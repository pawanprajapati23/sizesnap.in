// SizeSnap Web Worker Bridge for Client-side Image Processing
let workerInstance: Worker | null = null;
let msgId = 0;
const pendingCallbacks = new Map<number, { resolve: (val: any) => void; reject: (err: any) => void }>();

function getWorker(): Worker | null {
  if (typeof window === 'undefined' || typeof Worker === 'undefined') {
    return null;
  }

  if (!workerInstance) {
    try {
      workerInstance = new Worker('/workers/image-processor.worker.js');
      workerInstance.onmessage = (e: MessageEvent) => {
        const { id, success, blob, size, error } = e.data;
        const cb = pendingCallbacks.get(id);
        if (cb) {
          pendingCallbacks.delete(id);
          if (success) {
            cb.resolve({ blob, size });
          } else {
            cb.reject(new Error(error || 'Worker processing failed'));
          }
        }
      };

      workerInstance.onerror = (err) => {
        console.warn('Worker encountered an error:', err);
      };
    } catch (err) {
      console.warn('Could not initialize image processing Web Worker:', err);
      workerInstance = null;
    }
  }

  return workerInstance;
}

export interface CompressWorkerOptions {
  targetKB?: number;
  targetWidth?: number;
  targetHeight?: number;
  format?: 'image/jpeg' | 'image/png' | 'image/webp';
  initialQuality?: number;
}

export async function processImageWithWorker(
  file: File,
  options: CompressWorkerOptions
): Promise<{ blob: Blob; size: number }> {
  const worker = getWorker();

  // If worker and createImageBitmap available, use worker
  if (worker && typeof createImageBitmap !== 'undefined') {
    try {
      const bitmap = await createImageBitmap(file);
      const currentId = ++msgId;

      return await new Promise((resolve, reject) => {
        pendingCallbacks.set(currentId, { resolve, reject });
        worker.postMessage(
          {
            id: currentId,
            type: 'RESIZE_AND_COMPRESS',
            imageBitmap: bitmap,
            options
          },
          [bitmap] // transfer ImageBitmap ownership for zero memory copying
        );
      });
    } catch (workerErr) {
      console.warn('Worker fallback triggered due to error:', workerErr);
    }
  }

  // Fallback to Main Thread Canvas if worker not supported
  return fallbackMainThreadProcess(file, options);
}

async function fallbackMainThreadProcess(
  file: File,
  options: CompressWorkerOptions
): Promise<{ blob: Blob; size: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        let width = img.width;
        let height = img.height;

        const maxDim = 2000;
        if (!options.targetWidth && !options.targetHeight && (width > maxDim || height > maxDim)) {
          const ratio = Math.min(maxDim / width, maxDim / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }

        if (options.targetWidth && options.targetHeight) {
          width = options.targetWidth;
          height = options.targetHeight;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }

        let quality = options.initialQuality || 0.92;
        let scale = 1.0;
        let resultBlob: Blob | null = null;
        const targetKB = options.targetKB;
        const safetyMargin = 0.98;
        let iterations = 0;

        while (iterations < 30) {
          canvas.width = Math.max(1, Math.round(width * scale));
          canvas.height = Math.max(1, Math.round(height * scale));
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          resultBlob = await new Promise<Blob | null>((res) => {
            canvas.toBlob((b) => res(b), options.format || 'image/jpeg', quality);
          });

          if (!resultBlob) {
            reject(new Error('Failed to render compressed frames.'));
            return;
          }

          const currentKB = resultBlob.size / 1024;

          if (targetKB) {
            if (currentKB <= targetKB * safetyMargin) {
              if (currentKB >= targetKB * 0.75 || quality >= 0.9) break;
            }
            if (currentKB > targetKB) {
              if (quality > 0.45) quality -= 0.12;
              else scale *= 0.88;
            } else {
              if (quality < 0.92) quality += 0.05;
              else break;
            }
          } else {
            break;
          }
          iterations++;
        }

        // Emergency fallback
        if (targetKB && resultBlob && (resultBlob.size / 1024) > targetKB) {
          let emergencyScale = scale * 0.7;
          while ((resultBlob.size / 1024) > targetKB && emergencyScale > 0.05) {
            canvas.width = Math.max(1, Math.round(width * emergencyScale));
            canvas.height = Math.max(1, Math.round(height * emergencyScale));
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            
            resultBlob = await new Promise<Blob | null>((res) => {
              canvas.toBlob((b) => res(b), options.format || 'image/jpeg', 0.3);
            });
            
            if (!resultBlob) break;
            emergencyScale *= 0.7;
          }
        }

        if (resultBlob) {
          resolve({ blob: resultBlob, size: resultBlob.size });
        } else {
          reject(new Error('Compression could not be completed.'));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image file.'));
      img.src = event.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsDataURL(file);
  });
}
