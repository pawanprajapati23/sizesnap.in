'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DropzoneUpload } from './DropzoneUpload';
import { ImagePreviewCard, type ImageMetadata } from './ImagePreviewCard';
import { formatBytes, sanitizeFilename, getExtensionFromMime } from '@/lib/format-utils';
import { trackToolError } from '@/lib/firebase';
import {
  Maximize2,
  Lock,
  Unlock,
  RotateCcw,
  Sparkles,
  Download,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Info,
  ShieldCheck,
  Eye,
} from 'lucide-react';

interface ResizeResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
  filename: string;
}

const PRESETS = [
  { label: '320 × 240', width: 320, height: 240, desc: 'Thumbnail / Icon' },
  { label: '640 × 480', width: 640, height: 480, desc: 'SD Standard' },
  { label: '1280 × 720', width: 1280, height: 720, desc: 'HD 720p' },
  { label: '1920 × 1080', width: 1920, height: 1080, desc: 'Full HD 1080p' },
];

export function PixelResizer({ customTitle, showSeoContent }: { customTitle?: string, showSeoContent?: boolean }) {
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [allowUpscale, setAllowUpscale] = useState<boolean>(false);
  const [outputFormat, setOutputFormat] = useState<'original' | 'image/jpeg' | 'image/png' | 'image/webp'>('original');
  const [quality, setQuality] = useState<number>(85);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ResizeResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Object URL tracking for safe memory revocation
  const objectUrlsRef = useRef<string[]>([]);
  const registerUrl = useCallback((url: string) => {
    objectUrlsRef.current.push(url);
    return url;
  }, []);

  const cleanupUrls = useCallback(() => {
    objectUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    });
    objectUrlsRef.current = [];
  }, []);

  useEffect(() => {
    return () => cleanupUrls();
  }, [cleanupUrls]);

  const handleFileSelect = (file: File) => {
    setErrorMsg(null);
    setResult(null);

    const url = registerUrl(URL.createObjectURL(file));
    const img = new Image();

    img.onload = () => {
      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;
      const ratio = origW / origH;

      setSelectedImage({
        file,
        previewUrl: url,
        width: origW,
        height: origH,
        size: file.size,
        name: file.name,
        type: file.type || 'image/jpeg',
      });

      setAspectRatio(ratio);
      setTargetWidth(origW);
      setTargetHeight(origH);
    };

    img.onerror = () => {
      setErrorMsg('Failed to read image. File may be corrupted.');
    };

    img.src = url;
  };

  const handleReset = () => {
    cleanupUrls();
    setSelectedImage(null);
    setResult(null);
    setErrorMsg(null);
    setLockAspectRatio(true);
    setAllowUpscale(false);
  };

  // Width change handler with aspect ratio lock
  const handleWidthChange = (val: number) => {
    const w = Math.max(1, Math.min(10000, val || 0));
    setTargetWidth(w);
    if (lockAspectRatio && aspectRatio > 0) {
      setTargetHeight(Math.max(1, Math.round(w / aspectRatio)));
    }
  };

  // Height change handler with aspect ratio lock
  const handleHeightChange = (val: number) => {
    const h = Math.max(1, Math.min(10000, val || 0));
    setTargetHeight(h);
    if (lockAspectRatio && aspectRatio > 0) {
      setTargetWidth(Math.max(1, Math.round(h * aspectRatio)));
    }
  };

  // Apply preset dimensions
  const handleApplyPreset = (presetW: number, presetH: number) => {
    if (!selectedImage) return;

    if (lockAspectRatio) {
      // Scale according to preset width while keeping aspect ratio
      setTargetWidth(presetW);
      setTargetHeight(Math.max(1, Math.round(presetW / aspectRatio)));
    } else {
      setTargetWidth(presetW);
      setTargetHeight(presetH);
    }
  };

  // Reset to original dimensions
  const handleResetToOriginal = () => {
    if (!selectedImage) return;
    setTargetWidth(selectedImage.width);
    setTargetHeight(selectedImage.height);
  };

  // Canvas Resize Execution
  const handleResize = async () => {
    if (!selectedImage) return;

    // Validation
    if (targetWidth <= 0 || targetHeight <= 0) {
      setErrorMsg('Width and Height must be positive numbers greater than 0.');
      return;
    }

    if (targetWidth > 10000 || targetHeight > 10000) {
      setErrorMsg('Maximum allowed dimension is 10,000 pixels.');
      return;
    }

    // Check upscale constraint
    const isUpscaling = targetWidth > selectedImage.width || targetHeight > selectedImage.height;
    if (isUpscaling && !allowUpscale) {
      setErrorMsg(
        `Requested dimensions (${targetWidth}×${targetHeight}) are larger than the original image (${selectedImage.width}×${selectedImage.height}). Please enable "Allow Upscaling" checkbox below if you wish to enlarge.`
      );
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    // Yield to let UI show spinner
    await new Promise((r) => setTimeout(r, 60));

    try {
      const img = new Image();
      img.src = selectedImage.previewUrl;
      await new Promise<void>((resolve, reject) => {
        if (img.complete) return resolve();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image into canvas.'));
      });

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d', { willReadFrequently: false });

      if (!ctx) {
        setIsProcessing(false);
        setErrorMsg('Canvas 2D context is not supported in this browser.');
        return;
      }

      // Determine format
      const targetMime = outputFormat === 'original' ? selectedImage.type : outputFormat;

      // Handle transparent background if exporting to JPEG
      if (targetMime === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      // High quality bicubic image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const qualityParam = Math.max(0.05, Math.min(1, quality / 100));

      canvas.toBlob(
        (blob) => {
          setIsProcessing(false);
          if (!blob) {
            setErrorMsg('Could not export resized image blob.');
            return;
          }

          const resultUrl = registerUrl(URL.createObjectURL(blob));
          const ext = getExtensionFromMime(targetMime, selectedImage.name);
          const baseName = selectedImage.name.replace(/\.[^.]+$/, '');
          const filename = sanitizeFilename(`${baseName}_${targetWidth}x${targetHeight}`, ext);

          setResult({
            blob,
            url: resultUrl,
            width: targetWidth,
            height: targetHeight,
            size: blob.size,
            format: targetMime,
            filename,
          });
        },
        targetMime,
        qualityParam
      );
    } catch (err) {
      setIsProcessing(false);
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred during resizing.');
      trackToolError('resize-image-pixel', 'processing_failed', err instanceof Error ? err.message : '');
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isUpscalingNow =
    Boolean(selectedImage) &&
    (targetWidth > (selectedImage?.width || 0) || targetHeight > (selectedImage?.height || 0));

  return (
    <div className="space-y-4">
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[4px]">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <p className="flex-1">{errorMsg}</p>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-xs font-semibold text-red-800 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 1. Upload View */}
      {!selectedImage && <DropzoneUpload onFileSelect={handleFileSelect} />}

      {/* 2. Configure Dimensions */}
      {selectedImage && !result && (
        <div className="space-y-4">
          <ImagePreviewCard image={selectedImage} onReset={handleReset} />

          <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Maximize2 className="h-4 w-4 text-[#414FA8]" />
                <h3 className="text-sm font-bold text-gray-900">Resize Dimensions (Pixels)</h3>
              </div>
              <button
                type="button"
                onClick={handleResetToOriginal}
                className="text-xs text-[#414FA8] hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw className="h-3 w-3" /> Reset to Original
              </button>
            </div>

            {/* Width, Lock, Height Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Width Input */}
              <div className="sm:col-span-5 space-y-1">
                <label htmlFor="target-width" className="text-xs font-semibold text-gray-700 block">
                  Width (Pixels):
                </label>
                <div className="relative">
                  <input
                    id="target-width"
                    type="number"
                    min="1"
                    max="10000"
                    value={targetWidth}
                    onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-[#9AA3C8] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#414FA8] font-mono font-medium text-gray-900"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400">px</span>
                </div>
              </div>

              {/* Aspect Ratio Lock Button */}
              <div className="sm:col-span-2 flex flex-col items-center justify-center pt-4 sm:pt-5">
                <button
                  type="button"
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  className={`p-2.5 rounded-[4px] border transition-colors flex items-center justify-center gap-1.5 w-full text-xs font-medium ${
                    lockAspectRatio
                      ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8]'
                      : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                  title={lockAspectRatio ? 'Lock Aspect Ratio (Active)' : 'Unlock to set arbitrary width and height'}
                >
                  {lockAspectRatio ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  <span className="sm:hidden">{lockAspectRatio ? 'Locked' : 'Unlocked'}</span>
                </button>
                <span className="text-[10px] text-gray-400 mt-1 hidden sm:block">
                  {lockAspectRatio ? 'Locked' : 'Free'}
                </span>
              </div>

              {/* Height Input */}
              <div className="sm:col-span-5 space-y-1">
                <label htmlFor="target-height" className="text-xs font-semibold text-gray-700 block">
                  Height (Pixels):
                </label>
                <div className="relative">
                  <input
                    id="target-height"
                    type="number"
                    min="1"
                    max="10000"
                    value={targetHeight}
                    onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-[#9AA3C8] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#414FA8] font-mono font-medium text-gray-900"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400">px</span>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="text-xs font-semibold text-gray-700 block">
                Standard Resolution Presets:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESETS.map((p) => {
                  const isMatch = targetWidth === p.width && (!lockAspectRatio || targetHeight === p.height);
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleApplyPreset(p.width, p.height)}
                      className={`p-2 rounded-[4px] border text-center transition-all text-xs ${
                        isMatch
                          ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold ring-1 ring-[#414FA8]/30'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-[#9AA3C8] hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-semibold">{p.label}</div>
                      <div className="text-[10px] text-gray-500 font-normal">{p.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upscale Option */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <input
                id="allow-upscale"
                type="checkbox"
                checked={allowUpscale}
                onChange={(e) => setAllowUpscale(e.target.checked)}
                className="h-4 w-4 rounded text-[#414FA8] focus:ring-[#414FA8] border-gray-300"
              />
              <label htmlFor="allow-upscale" className="text-xs text-gray-700 cursor-pointer">
                <strong>Allow Upscaling</strong> (Permits enlarging beyond {selectedImage.width}×{selectedImage.height} original resolution).
              </label>
            </div>

            {isUpscalingNow && !allowUpscale && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded flex items-center gap-2">
                <Info className="h-4 w-4 shrink-0 text-amber-600" />
                <span>You are enlarging the image. Check &ldquo;Allow Upscaling&rdquo; above to proceed.</span>
              </div>
            )}

            {/* Output Format & Quality */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Format:
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as typeof outputFormat)}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-[4px] bg-white text-gray-800"
                >
                  <option value="original">Original Format ({selectedImage.type.replace('image/', '').toUpperCase()})</option>
                  <option value="image/jpeg">JPG / JPEG (Universal)</option>
                  <option value="image/png">PNG (Preserves Transparency)</option>
                  <option value="image/webp">WebP (Modern Web)</option>
                </select>
              </div>

              {outputFormat !== 'image/png' && (
                <div>
                  <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                    <span>Quality:</span>
                    <span className="text-[#414FA8]">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#414FA8] mt-2"
                  />
                </div>
              )}
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResize}
                disabled={isProcessing || (isUpscalingNow && !allowUpscale)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Resizing Image Canvas...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>Resize Image to {targetWidth} × {targetHeight} px</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Results View */}
      {selectedImage && result && (
        <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  Image Resized Successfully!
                </h3>
                <p className="text-xs text-gray-500">
                  New dimensions: {result.width} × {result.height} px
                </p>
              </div>
            </div>

            <span className="self-start sm:self-auto px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
              {result.width} × {result.height} px
            </span>
          </div>

          {/* Comparison Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F9FAFB] p-3.5 rounded-[4px] border border-gray-200 text-center">
            <div className="p-2">
              <span className="block text-[11px] text-gray-500 font-medium">Original Dimensions</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-800">
                {selectedImage.width} × {selectedImage.height} px
              </span>
            </div>

            <div className="p-2">
              <span className="block text-[11px] text-[#414FA8] font-medium">New Dimensions</span>
              <span className="text-xs sm:text-sm font-bold text-[#414FA8]">
                {result.width} × {result.height} px
              </span>
            </div>

            <div className="p-2">
              <span className="block text-[11px] text-gray-500 font-medium">Original Size</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                {formatBytes(selectedImage.size)}
              </span>
            </div>

            <div className="p-2">
              <span className="block text-[11px] text-gray-500 font-medium">New File Size</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                {formatBytes(result.size)}
              </span>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-[4px] border border-gray-200 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:10px_10px] p-4 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.url}
              alt="Resized output"
              className="max-h-[320px] max-w-full rounded object-contain mx-auto shadow-xs"
            />
            <span className="inline-block mt-2 text-[11px] text-gray-500 font-medium">
              Output: {result.width} × {result.height} px ({formatBytes(result.size)})
            </span>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownload}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download Resized Image</span>
            </button>

            <button
              type="button"
              onClick={() => setResult(null)}
              className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-[#9AA3C8] bg-white hover:bg-[#EEF1FB] hover:border-[#414FA8] text-[#414FA8] text-xs font-semibold transition-colors"
            >
              Change Dimensions
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
            >
              New Image
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Resizing executed client-side. No images sent to external servers.</span>
          </div>
        </div>
      )}
    </div>
  );
}
