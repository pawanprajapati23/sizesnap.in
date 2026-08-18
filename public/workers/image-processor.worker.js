// SizeSnap Background Image Processing Web Worker
// Handles heavy resizing, iterative compression, and color quantization off the main UI thread.

self.onmessage = async (e) => {
  const { id, type, imageBitmap, options } = e.data;

  try {
    if (type === 'RESIZE_AND_COMPRESS') {
      const {
        targetKB,
        targetWidth,
        targetHeight,
        format = 'image/jpeg',
        initialQuality = 0.92,
        maxIterations = 30,
        safetyMargin = 0.98
      } = options;

      let width = imageBitmap.width;
      let height = imageBitmap.height;

      // Restrict max dimension if too large
      const maxDim = 2000;
      if (!targetWidth && !targetHeight && (width > maxDim || height > maxDim)) {
        const ratio = Math.min(maxDim / width, maxDim / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      if (targetWidth && targetHeight) {
        width = targetWidth;
        height = targetHeight;
      }

      if (typeof OffscreenCanvas === 'undefined') {
        throw new Error('OffscreenCanvas is not supported in this browser worker.');
      }

      let scale = 1.0;
      let quality = initialQuality;
      let bestBlob = null;
      let iteration = 0;

      while (iteration < maxIterations) {
        const currentWidth = Math.max(1, Math.round(width * scale));
        const currentHeight = Math.max(1, Math.round(height * scale));

        const canvas = new OffscreenCanvas(currentWidth, currentHeight);
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('Canvas 2D context unavailable in worker');
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(imageBitmap, 0, 0, currentWidth, currentHeight);

        const blob = await canvas.convertToBlob({
          type: format,
          quality: Math.min(1.0, Math.max(0.1, quality))
        });

        const currentKB = blob.size / 1024;
        bestBlob = blob;

        if (targetKB) {
          if (currentKB <= targetKB * safetyMargin) {
            // Target satisfied within threshold
            if (currentKB >= targetKB * 0.75 || quality >= 0.9) {
              break;
            }
          }

          if (currentKB > targetKB) {
            // Oversized, reduce quality or scale
            if (quality > 0.45) {
              quality -= 0.12;
            } else {
              scale *= 0.88;
            }
          } else {
            // Undersized, try increasing quality slightly
            if (quality < 0.92) {
              quality += 0.05;
            } else {
              break;
            }
          }
        } else {
          // No target KB specified, single pass complete
          break;
        }

        iteration++;
      }

      // Emergency fallback if target still not met
      if (targetKB && bestBlob.size / 1024 > targetKB) {
        let emergencyScale = scale * 0.7;
        while (bestBlob.size / 1024 > targetKB && emergencyScale > 0.05) {
          const currentWidth = Math.max(1, Math.round(width * emergencyScale));
          const currentHeight = Math.max(1, Math.round(height * emergencyScale));
          const canvas = new OffscreenCanvas(currentWidth, currentHeight);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(imageBitmap, 0, 0, currentWidth, currentHeight);
          
          bestBlob = await canvas.convertToBlob({
            type: format,
            quality: 0.3
          });
          emergencyScale *= 0.7;
        }
      }

      self.postMessage({
        id,
        success: true,
        blob: bestBlob,
        size: bestBlob.size
      });
    } else if (type === 'ENHANCE_SCAN') {
      // Document scan / shadow removal in worker
      const { brightness = 15, contrast = 35, monochrome = true, threshold = 180 } = options;
      const width = imageBitmap.width;
      const height = imageBitmap.height;

      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext('2d');
      ctx.drawImage(imageBitmap, 0, 0, width, height);

      const imgData = ctx.getImageData(0, 0, width, height);
      const data = imgData.data;
      const contrastFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];

        // Apply contrast
        r = Math.min(255, Math.max(0, contrastFactor * (r - 128) + 128 + brightness));
        g = Math.min(255, Math.max(0, contrastFactor * (g - 128) + 128 + brightness));
        b = Math.min(255, Math.max(0, contrastFactor * (b - 128) + 128 + brightness));

        if (monochrome) {
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          const val = gray > threshold ? 255 : gray;
          data[i] = val;
          data[i + 1] = val;
          data[i + 2] = val;
        } else {
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.92 });

      self.postMessage({
        id,
        success: true,
        blob,
        size: blob.size
      });
    }
  } catch (error) {
    self.postMessage({
      id,
      success: false,
      error: error.message || 'Worker image processing failed'
    });
  }
};
