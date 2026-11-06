'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Trash2,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Sliders,
  SunMedium,
  Layers,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { formatBytes } from '@/lib/format-utils';
import { trackProcessingSuccess, trackProcessingError, trackDownload } from '@/lib/firebase';

type ConversionMode = 'black-to-white' | 'invert' | 'monochrome';

export function BlackToWhiteConverter() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Settings
  const [mode, setMode] = useState<ConversionMode>('black-to-white');
  const [threshold, setThreshold] = useState<number>(128); // 0 - 255
  const [preserveAlpha, setPreserveAlpha] = useState<boolean>(true);
  const [previewBg, setPreviewBg] = useState<'dark' | 'checker' | 'light'>('dark');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const originalImgRef = useRef<HTMLImageElement | null>(null);
  const lastActivityIdRef = useRef<string | null>(null);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [originalUrl, resultUrl]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WebP, or SVG).');
      return;
    }
    setImageFile(file);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      originalImgRef.current = img;
      processConversion(img, mode, threshold, preserveAlpha, file.name);
    };
    img.src = url;
  };

  const processConversion = useCallback(
    (
      img: HTMLImageElement,
      currentMode: ConversionMode,
      currentThreshold: number,
      keepAlpha: boolean,
      filename: string
    ) => {
      setIsProcessing(true);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width;
        canvas.height = img.naturalHeight || img.height;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imgData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];

          // Skip completely transparent pixels
          if (a === 0 && keepAlpha) continue;

          // Perceived luminance (grayscale calculation)
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;

          if (currentMode === 'black-to-white') {
            // Converts dark/black elements into white (#FFFFFF)
            // If pixel is darker than threshold, make it white with alpha proportionate to its darkness
            if (lum < currentThreshold) {
              const alphaFactor = (currentThreshold - lum) / currentThreshold;
              data[i] = 255;
              data[i + 1] = 255;
              data[i + 2] = 255;
              if (keepAlpha) {
                // If it already had alpha, blend it
                data[i + 3] = Math.min(255, Math.round(a * (0.3 + 0.7 * alphaFactor)));
              } else {
                data[i + 3] = Math.round(255 * alphaFactor);
              }
            } else {
              // Light/white background becomes transparent
              data[i + 3] = 0;
            }
          } else if (currentMode === 'invert') {
            // Negative: Black becomes White, White becomes Black
            data[i] = 255 - r;
            data[i + 1] = 255 - g;
            data[i + 2] = 255 - b;
            // Alpha remains intact
          } else if (currentMode === 'monochrome') {
            // High-contrast clean Black & White (threshold binarization)
            const val = lum < currentThreshold ? 0 : 255;
            data[i] = val;
            data[i + 1] = val;
            data[i + 2] = val;
            data[i + 3] = 255;
          }
        }

        ctx.putImageData(imgData, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) return;
            if (resultUrl) URL.revokeObjectURL(resultUrl);
            const newResultUrl = URL.createObjectURL(blob);
            setResultUrl(newResultUrl);
            setResultBlob(blob);
            setIsProcessing(false);

            // Log activity
            if (imageFile) {
              trackProcessingSuccess({
                tool: 'convert-black-image-to-white',
                toolName: 'Black to White Converter',
                fileType: 'image',
                inputKb: Math.round(imageFile.size / 1024),
                outputKb: Math.round(blob.size / 1024),
              })
                .then((id) => {
                  if (id) lastActivityIdRef.current = id;
                })
                .catch(() => {});
            }
          },
          currentMode === 'black-to-white' ? 'image/png' : 'image/png'
        );
      } catch (err: unknown) {
        console.error(err);
        setIsProcessing(false);
        trackProcessingError(
          'convert-black-image-to-white',
          err instanceof Error ? err.message : 'Conversion error'
        );
      }
    },
    [imageFile, resultUrl]
  );

  // Trigger processing when controls change
  useEffect(() => {
    if (originalImgRef.current && imageFile) {
      processConversion(originalImgRef.current, mode, threshold, preserveAlpha, imageFile.name);
    }
  }, [mode, threshold, preserveAlpha, processConversion, imageFile]);

  const handleDownload = (format: 'png' | 'jpg' = 'png') => {
    if (!resultBlob || !imageFile) return;
    trackDownload('convert-black-image-to-white', lastActivityIdRef.current || undefined);

    const baseName = imageFile.name.replace(/\.[^/.]+$/, '');
    const ext = format === 'png' ? 'png' : 'jpg';
    const filename = `${baseName}_white.${ext}`;

    if (format === 'png') {
      const a = document.createElement('a');
      a.href = resultUrl!;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Export as JPG with white canvas under transparent parts
      const img = new Image();
      img.onload = () => {
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height;
        const ctx = c.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0);
        c.toBlob(
          (jpgBlob) => {
            if (!jpgBlob) return;
            const a = document.createElement('a');
            a.href = URL.createObjectURL(jpgBlob);
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          },
          'image/jpeg',
          0.95
        );
      };
      img.src = resultUrl!;
    }
  };

  const handleCopyClipboard = async () => {
    if (!resultBlob) return;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          [resultBlob.type]: resultBlob,
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Could not copy image directly to clipboard on this browser. Please use Download button.');
    }
  };

  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setImageFile(null);
    setOriginalUrl(null);
    setResultUrl(null);
    setResultBlob(null);
    originalImgRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      {/* Upload Dropzone */}
      {!imageFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-gray-300 hover:border-[#414FA8] rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-gray-50/50 hover:bg-indigo-50/20 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp, image/svg+xml"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
            }}
            className="hidden"
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 flex items-center justify-center text-[#414FA8] group-hover:scale-110 transition-transform shadow-xs">
            <Upload className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
            Upload Black Image, Logo, Signature or Drawing
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-4 max-w-md mx-auto">
            Drag & drop your file here, or click to browse. Automatically converts black pixels into pure white transparent PNG or inverted image.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Private • Zero File Upload
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-gray-800">Mode:</span>
                <div className="inline-flex rounded-lg border border-gray-300 p-0.5 bg-white">
                  <button
                    type="button"
                    onClick={() => setMode('black-to-white')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      mode === 'black-to-white'
                        ? 'bg-[#414FA8] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    ✨ Black to White (Transparent)
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('invert')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      mode === 'invert'
                        ? 'bg-[#414FA8] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    🔄 Invert Colors
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode('monochrome')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                      mode === 'monochrome'
                        ? 'bg-[#414FA8] text-white shadow-xs'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    📄 Pure B&W
                  </button>
                </div>
              </div>

              {/* Preview Background Toggle */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-600 font-medium">Preview BG:</span>
                <button
                  type="button"
                  onClick={() => setPreviewBg('dark')}
                  className={`w-6 h-6 rounded border ${
                    previewBg === 'dark' ? 'ring-2 ring-[#414FA8]' : 'border-gray-300'
                  } bg-slate-900`}
                  title="Dark background (best for viewing white logo)"
                />
                <button
                  type="button"
                  onClick={() => setPreviewBg('checker')}
                  className={`w-6 h-6 rounded border ${
                    previewBg === 'checker' ? 'ring-2 ring-[#414FA8]' : 'border-gray-300'
                  } bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:6px_6px] bg-white`}
                  title="Checkerboard transparent grid"
                />
                <button
                  type="button"
                  onClick={() => setPreviewBg('light')}
                  className={`w-6 h-6 rounded border ${
                    previewBg === 'light' ? 'ring-2 ring-[#414FA8]' : 'border-gray-300'
                  } bg-gray-100`}
                  title="Light background"
                />
              </div>
            </div>

            {/* Threshold Slider */}
            {mode !== 'invert' && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700 min-w-[120px]">
                  <Sliders className="w-3.5 h-3.5 text-gray-500" />
                  <span>Sensitivity: {Math.round((threshold / 255) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="245"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#414FA8]"
                />
                <span className="text-xs text-gray-400 font-mono">
                  {mode === 'black-to-white' ? 'Cutoff' : 'Threshold'}
                </span>
              </div>
            )}
          </div>

          {/* Side by Side Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Image */}
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex flex-col">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="font-semibold text-gray-700">Original Image</span>
                <span>{imageFile ? formatBytes(imageFile.size) : ''}</span>
              </div>
              <div className="flex-1 min-h-[220px] max-h-[340px] flex items-center justify-center p-3 bg-white rounded border border-gray-100 overflow-hidden">
                {originalUrl && (
                  <img
                    src={originalUrl}
                    alt="Original Upload"
                    className="max-h-[280px] max-w-full object-contain"
                  />
                )}
              </div>
            </div>

            {/* Converted White Result */}
            <div className="border border-indigo-100 rounded-lg p-3 bg-indigo-50/20 flex flex-col">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="font-semibold text-indigo-950 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#414FA8]" /> Converted Result
                </span>
                <span>{resultBlob ? formatBytes(resultBlob.size) : ''}</span>
              </div>
              <div
                className={`flex-1 min-h-[220px] max-h-[340px] flex items-center justify-center p-3 rounded border border-gray-200 overflow-hidden transition-colors ${
                  previewBg === 'dark'
                    ? 'bg-slate-900'
                    : previewBg === 'checker'
                    ? 'bg-[radial-gradient(#d1d5db_1.5px,transparent_1.5px)] [background-size:10px_10px] bg-white'
                    : 'bg-gray-100'
                }`}
              >
                {isProcessing ? (
                  <div className="text-center text-gray-400 text-xs py-10 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#414FA8]" /> Processing...
                  </div>
                ) : resultUrl ? (
                  <img
                    src={resultUrl}
                    alt="White Converted Result"
                    className="max-h-[280px] max-w-full object-contain drop-shadow-sm"
                  />
                ) : null}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Start Over
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyClipboard}
                disabled={!resultBlob}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-xs transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-500" /> Copy Image
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleDownload('png')}
                disabled={!resultBlob}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#414FA8] hover:bg-[#323E8F] rounded-lg shadow-sm transition-all"
              >
                <Download className="w-4 h-4" /> Download White PNG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
