'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DropzoneUpload } from './DropzoneUpload';
import { ImagePreviewCard, type ImageMetadata } from './ImagePreviewCard';
import { CompressionSettings, type OutputFormatOption } from './CompressionSettings';
import { CompressionResultCard, type CompressedResult } from './CompressionResultCard';
import { sanitizeFilename, getExtensionFromMime } from '@/lib/format-utils';
import { AlertCircle } from 'lucide-react';

export function ImageCompressor() {
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);
  const [quality, setQuality] = useState<number>(75);
  const [outputFormat, setOutputFormat] = useState<OutputFormatOption>('original');
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [compressionResult, setCompressionResult] = useState<CompressedResult | null>(null);
  const [processError, setProcessError] = useState<string | null>(null);

  // Track created object URLs for clean garbage collection
  const createdUrlsRef = useRef<string[]>([]);

  const registerUrl = useCallback((url: string) => {
    createdUrlsRef.current.push(url);
    return url;
  }, []);

  const revokeAllUrls = useCallback(() => {
    createdUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    });
    createdUrlsRef.current = [];
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      revokeAllUrls();
    };
  }, [revokeAllUrls]);

  // Handle file select from dropzone or picker
  const handleFileSelect = (file: File) => {
    setProcessError(null);
    setCompressionResult(null);

    const objectUrl = registerUrl(URL.createObjectURL(file));
    const img = new Image();

    img.onload = () => {
      setSelectedImage({
        file,
        previewUrl: objectUrl,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        size: file.size,
        name: file.name,
        type: file.type || 'image/jpeg',
      });
    };

    img.onerror = () => {
      setProcessError('Failed to load image. The file might be corrupted or in an unsupported format.');
    };

    img.src = objectUrl;
  };

  // Reset entire state
  const handleReset = () => {
    revokeAllUrls();
    setSelectedImage(null);
    setCompressionResult(null);
    setProcessError(null);
    setQuality(75);
    setOutputFormat('original');
  };

  // Adjust settings without removing image
  const handleAdjustSettings = () => {
    setCompressionResult(null);
  };

  // Perform canvas compression client-side
  const handleCompress = () => {
    if (!selectedImage) return;

    setIsCompressing(true);
    setProcessError(null);

    // Give UI a moment to show loading state
    setTimeout(() => {
      try {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const width = img.naturalWidth || img.width;
          const height = img.naturalHeight || img.height;

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d', { willReadFrequently: false });
          if (!ctx) {
            setIsCompressing(false);
            setProcessError('Browser canvas 2D context is not available.');
            return;
          }

          // Determine target MIME type
          let targetMime =
            outputFormat === 'original' ? selectedImage.type : outputFormat;

          // Fallback if mime is empty
          if (!targetMime) targetMime = 'image/jpeg';

          // If converting to JPEG, fill background with white (prevents black background on transparent PNGs)
          if (targetMime === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
          }

          // Draw the image
          ctx.drawImage(img, 0, 0, width, height);

          // Quality factor between 0.05 and 1.0
          const qualityParam = Math.max(0.05, Math.min(1, quality / 100));

          canvas.toBlob(
            (blob) => {
              setIsCompressing(false);
              if (!blob) {
                setProcessError('Could not compress image. Please try a different format.');
                return;
              }

              const resultUrl = registerUrl(URL.createObjectURL(blob));
              const targetExt = getExtensionFromMime(targetMime, selectedImage.name);
              const filename = sanitizeFilename(selectedImage.name, targetExt);

              setCompressionResult({
                blob,
                url: resultUrl,
                width,
                height,
                size: blob.size,
                format: targetMime,
                filename,
              });
            },
            targetMime,
            qualityParam
          );
        };

        img.onerror = () => {
          setIsCompressing(false);
          setProcessError('An error occurred while reading the image bitmap.');
        };

        img.src = selectedImage.previewUrl;
      } catch (err) {
        setIsCompressing(false);
        setProcessError(
          err instanceof Error ? err.message : 'An unexpected error occurred during compression.'
        );
      }
    }, 60);
  };

  return (
    <div className="space-y-4">
      {/* Error alert banner */}
      {processError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[4px]">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <p className="flex-1">{processError}</p>
          <button
            type="button"
            onClick={() => setProcessError(null)}
            className="text-xs font-semibold text-red-800 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Upload View */}
      {!selectedImage && (
        <DropzoneUpload onFileSelect={handleFileSelect} />
      )}

      {/* 2. Configure View */}
      {selectedImage && !compressionResult && (
        <div className="space-y-4">
          <ImagePreviewCard image={selectedImage} onReset={handleReset} />
          <CompressionSettings
            quality={quality}
            onQualityChange={setQuality}
            outputFormat={outputFormat}
            onOutputFormatChange={setOutputFormat}
            originalFormat={selectedImage.type}
            onCompress={handleCompress}
            isCompressing={isCompressing}
          />
        </div>
      )}

      {/* 3. Result View */}
      {selectedImage && compressionResult && (
        <CompressionResultCard
          originalSize={selectedImage.size}
          originalUrl={selectedImage.previewUrl}
          originalWidth={selectedImage.width}
          originalHeight={selectedImage.height}
          result={compressionResult}
          onReset={handleReset}
          onAdjustSettings={handleAdjustSettings}
        />
      )}
    </div>
  );
}
