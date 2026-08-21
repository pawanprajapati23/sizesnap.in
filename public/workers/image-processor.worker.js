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

      const testCompress = async (testScale, testQuality) => {
        const currentWidth = Math.max(1, Math.round(width * testScale));
        const currentHeight = Math.max(1, Math.round(height * testScale));
        const canvas = new OffscreenCanvas(currentWidth, currentHeight);
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(imageBitmap, 0, 0, currentWidth, currentHeight);
        return await canvas.convertToBlob({
          type: format,
          quality: testQuality
        });
      };

      let bestBlob = null;
      let bestDiff = Infinity;

      if (targetKB) {
        // 1. Binary Search Quality
        let qLow = 0.05, qHigh = 1.0;
        for (let i = 0; i < 7; i++) {
          const qMid = (qLow + qHigh) / 2;
          const blob = await testCompress(1.0, qMid);
          const kb = blob.size / 1024;
          if (kb <= targetKB) {
             if (targetKB - kb < bestDiff) {
                bestDiff = targetKB - kb;
                bestBlob = blob;
             }
             qLow = qMid;
          } else {
             qHigh = qMid;
          }
        }
        
        // 2. Binary Search Scale
        if (!bestBlob) {
          let sLow = 0.1, sHigh = 0.95;
          bestDiff = Infinity;
          for (let i = 0; i < 8; i++) {
             const sMid = (sLow + sHigh) / 2;
             const blob = await testCompress(sMid, 0.6);
             const kb = blob.size / 1024;
             if (kb <= targetKB) {
                if (targetKB - kb < bestDiff) {
                   bestDiff = targetKB - kb;
                   bestBlob = blob;
                }
                sLow = sMid;
             } else {
                sHigh = sMid;
             }
          }
        }
        
        if (!bestBlob) {
           bestBlob = await testCompress(0.2, 0.2);
        }
      } else {
        bestBlob = await testCompress(1.0, initialQuality);
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
