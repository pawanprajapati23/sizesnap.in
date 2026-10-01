'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DropzoneUpload } from './DropzoneUpload';
import { ImagePreviewCard, type ImageMetadata } from './ImagePreviewCard';
import { formatBytes, calculateSavings, sanitizeFilename, getExtensionFromMime } from '@/lib/format-utils';
import { useSearchParams } from 'next/navigation';
import {
  Sparkles,
  Download,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Info,
  Sliders,
  Eye,
  ShieldCheck,
  Target,
} from 'lucide-react';

const BASE_PRESET_KB = [20, 50, 100, 200];

interface KbCompressResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  targetKb: number;
  format: string;
  filename: string;
  reachedTarget: boolean;
}

export function KbCompressor({ initialTargetKb, title, showSeoContent }: { initialTargetKb?: number, title?: string, showSeoContent?: boolean }) {
  const searchParams = useSearchParams();
  const queryTarget = searchParams?.get('target') || searchParams?.get('kb') || searchParams?.get('size');
  const parsedQueryTarget = queryTarget ? parseInt(queryTarget, 10) : NaN;
  const initialTarget = initialTargetKb ?? (!isNaN(parsedQueryTarget) ? parsedQueryTarget : 50);

  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);
  const [customKb, setCustomKb] = useState<number | null>(null);
  const targetKb = customKb ?? (initialTarget > 0 ? initialTarget : 50);
  const setTargetKb = (val: number) => setCustomKb(val);

  const [outputFormat, setOutputFormat] = useState<'auto' | 'image/jpeg' | 'image/webp' | 'image/png'>('auto');
  const [allowDimensionScale, setAllowDimensionScale] = useState<boolean>(true);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<KbCompressResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Object URL tracking
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
      setSelectedImage({
        file,
        previewUrl: url,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        size: file.size,
        name: file.name,
        type: file.type || 'image/jpeg',
      });
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
    setTargetKb(50);
    setOutputFormat('auto');
  };

  // Binary search compression engine
  const handleCompressToKb = async () => {
    if (!selectedImage) return;

    if (targetKb <= 0 || isNaN(targetKb)) {
      setErrorMsg('Please enter a valid target size greater than 0 KB.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    // Yield to UI to render spinner
    await new Promise((r) => setTimeout(r, 60));

    try {
      const img = new Image();
      img.src = selectedImage.previewUrl;
      await new Promise<void>((resolve, reject) => {
        if (img.complete) return resolve();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Image failed to load in canvas.'));
      });

      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;
      const targetBytes = targetKb * 1024;

      // Determine format
      let targetMime: string;
      if (outputFormat === 'auto') {
        targetMime = selectedImage.type === 'image/webp' ? 'image/webp' : 'image/jpeg';
      } else {
        targetMime = outputFormat;
      }

      // Special warning if PNG selected without scale
      if (targetMime === 'image/png' && !allowDimensionScale) {
        setIsProcessing(false);
        setErrorMsg(
          'PNG export does not support quality compression. Please switch format to JPG/WebP or enable dimension scaling.'
        );
        return;
      }

      // Helper function to render a canvas and get blob at (scale, quality)
      const tryRender = (scale: number, qual: number): Promise<Blob | null> => {
        return new Promise((resolve) => {
          const w = Math.max(16, Math.round(origW * scale));
          const h = Math.max(16, Math.round(origH * scale));
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(null);

          if (targetMime === 'image/jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, w, h);
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, w, h);

          canvas.toBlob((blob) => resolve(blob), targetMime, qual);
        });
      };

      // Scales to test
      const scales = allowDimensionScale
        ? [1.0, 0.85, 0.7, 0.55, 0.45, 0.35, 0.25, 0.15]
        : [1.0];

      let bestBlob: Blob | null = null;
      let bestScale = 1.0;
      let smallestBlobEver: Blob | null = null;
      let smallestScaleEver = 1.0;

      for (const scale of scales) {
        // Binary search quality in [0.05, 0.95]
        let lowQ = 0.05;
        let highQ = 0.95;
        let scaleBestBlob: Blob | null = null;

        for (let iter = 0; iter < 7; iter++) {
          const midQ = (lowQ + highQ) / 2;
          const blob = await tryRender(scale, midQ);
          if (!blob) continue;

          // Track smallest blob ever
          if (!smallestBlobEver || blob.size < smallestBlobEver.size) {
            smallestBlobEver = blob;
            smallestScaleEver = scale;
          }

          if (blob.size <= targetBytes) {
            scaleBestBlob = blob;
            // Try higher quality to get closer to target
            lowQ = midQ;
          } else {
            // Exceeds target, need lower quality
            highQ = midQ;
          }
        }

        if (scaleBestBlob) {
          bestBlob = scaleBestBlob;
          bestScale = scale;
          // Target satisfied!
          break;
        }
      }

      const finalBlob = bestBlob || smallestBlobEver;
      const finalScale = bestBlob ? bestScale : smallestScaleEver;

      if (!finalBlob) {
        setIsProcessing(false);
        setErrorMsg('Could not process this image to target size.');
        return;
      }

      const finalW = Math.round(origW * finalScale);
      const finalH = Math.round(origH * finalScale);
      const resultUrl = registerUrl(URL.createObjectURL(finalBlob));
      const ext = getExtensionFromMime(targetMime, selectedImage.name);
      const filename = sanitizeFilename(
        `${selectedImage.name.replace(/\.[^.]+$/, '')}_${targetKb}kb`,
        ext
      );

      setResult({
        blob: finalBlob,
        url: resultUrl,
        width: finalW,
        height: finalH,
        size: finalBlob.size,
        targetKb,
        format: targetMime,
        filename,
        reachedTarget: finalBlob.size <= targetBytes,
      });

      setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      setErrorMsg(
        err instanceof Error ? err.message : 'An error occurred during target KB processing.'
      );
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

  // Compute preset list including any custom URL query target (e.g. 12kb, 14kb, 28kb)
  const activePresets = React.useMemo(() => {
    if (queryTarget) {
      const val = parseInt(queryTarget, 10);
      if (!isNaN(val) && val > 0 && !BASE_PRESET_KB.includes(val)) {
        return [val, ...BASE_PRESET_KB].sort((a, b) => a - b);
      }
    }
    return BASE_PRESET_KB;
  }, [queryTarget]);

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

      {queryTarget && (
        <div className="flex items-center gap-2 p-3 bg-indigo-50/90 border border-indigo-200 text-indigo-900 text-xs rounded-[4px] shadow-2xs">
          <Target className="h-4 w-4 shrink-0 text-[#414FA8]" />
          <p className="flex-1">
            Google Search Preset: Target size is pre-configured to <strong>{targetKb} KB</strong>. Simply upload your photo below!
          </p>
          <span className="font-bold text-[#414FA8] bg-white px-2 py-0.5 rounded border border-indigo-200 text-[11px]">
            {targetKb} KB Locked
          </span>
        </div>
      )}

      {/* 1. Upload */}
      {!selectedImage && <DropzoneUpload onFileSelect={handleFileSelect} />}

      {/* 2. Configure Target KB */}
      {selectedImage && !result && (
        <div className="space-y-4">
          <ImagePreviewCard image={selectedImage} onReset={handleReset} />

          <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-[#414FA8]" />
                <h3 className="text-sm font-bold text-gray-900">
                  Target File Size (KB)
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#414FA8] bg-[#EEF1FB] px-2.5 py-0.5 rounded">
                Target: {targetKb} KB
              </span>
            </div>

            {/* Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 block">
                Quick Size Presets:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2">
                {activePresets.map((kb) => {
                  const isSelected = targetKb === kb;
                  const isQueryPreset = queryTarget && parseInt(queryTarget, 10) === kb;
                  return (
                    <button
                      key={kb}
                      type="button"
                      onClick={() => setTargetKb(kb)}
                      className={`py-2 px-3 rounded-[4px] border text-center transition-all text-xs ${
                        isSelected
                          ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold ring-1 ring-[#414FA8]/30'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-[#9AA3C8] hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-bold text-sm">{kb} KB</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        {isQueryPreset
                          ? 'Search Preset'
                          : kb === 20
                          ? 'Govt / SSC exam'
                          : kb === 50
                          ? 'Forms & Passports'
                          : kb === 100
                          ? 'Web upload'
                          : 'High quality'}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom KB Input */}
            <div className="space-y-2 pt-1">
              <label htmlFor="custom-kb" className="text-xs font-semibold text-gray-700 block">
                Or Enter Custom Size in KB:
              </label>
              <div className="flex items-center gap-2 max-w-xs">
                <input
                  id="custom-kb"
                  type="number"
                  min="5"
                  max="10000"
                  step="1"
                  value={targetKb}
                  onChange={(e) => setTargetKb(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-[#9AA3C8] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#414FA8] text-gray-800"
                  placeholder="e.g. 35"
                />
                <span className="text-xs font-semibold text-gray-500">KB</span>
              </div>
            </div>

            {/* Format Selection */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="text-xs font-semibold text-gray-700 block">
                Output Format:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'auto', label: 'Auto (Recommended)', hint: 'Best balance' },
                  { id: 'image/jpeg', label: 'JPG / JPEG', hint: 'Universal' },
                  { id: 'image/webp', label: 'WebP', hint: 'Smallest file' },
                  { id: 'image/png', label: 'PNG', hint: 'Transparent' },
                ].map((fmt) => {
                  const isSelected = outputFormat === fmt.id;
                  return (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setOutputFormat(fmt.id as typeof outputFormat)}
                      className={`p-2 rounded-[4px] border text-left text-xs transition-all ${
                        isSelected
                          ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold ring-1 ring-[#414FA8]/30'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-[#9AA3C8] hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-semibold">{fmt.label}</div>
                      <div className="text-[10px] text-gray-500">{fmt.hint}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dimension Scale Toggle */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <input
                id="allow-scale"
                type="checkbox"
                checked={allowDimensionScale}
                onChange={(e) => setAllowDimensionScale(e.target.checked)}
                className="h-4 w-4 rounded text-[#414FA8] focus:ring-[#414FA8] border-gray-300"
              />
              <label htmlFor="allow-scale" className="text-xs text-gray-700 cursor-pointer">
                <strong>Allow smart dimension scaling</strong> if quality adjustment alone cannot reach {targetKb} KB (recommended for large images).
              </label>
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCompressToKb}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Compressing to ~{targetKb} KB...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>Reduce Image to {targetKb} KB</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Results */}
      {selectedImage && result && (
        <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-5">
          {/* Header Status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  {result.reachedTarget
                    ? `Successfully Reduced to ${formatBytes(result.size)}!`
                    : `Smallest Achieved: ${formatBytes(result.size)}`}
                </h3>
                <p className="text-xs text-gray-500">
                  {result.reachedTarget
                    ? `Your file is now under your ${result.targetKb} KB target.`
                    : `Target was ${result.targetKb} KB. Image could not be compressed smaller without excessive distortion.`}
                </p>
              </div>
            </div>

            <span
              className={`self-start sm:self-auto px-2.5 py-1 text-xs font-bold rounded-full ${
                result.reachedTarget
                  ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                  : 'text-amber-700 bg-amber-50 border border-amber-200'
              }`}
            >
              {result.reachedTarget ? 'Target Achieved' : 'Near Target'}
            </span>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F9FAFB] p-3.5 rounded-[4px] border border-gray-200 text-center">
            <div className="p-2">
              <span className="block text-[11px] text-gray-500 font-medium">Original</span>
              <span className="text-xs sm:text-sm font-bold text-gray-800">
                {formatBytes(selectedImage.size)}
              </span>
            </div>
            <div className="p-2">
              <span className="block text-[11px] text-[#414FA8] font-medium">Compressed</span>
              <span className="text-xs sm:text-sm font-bold text-[#414FA8]">
                {formatBytes(result.size)}
              </span>
            </div>
            <div className="p-2">
              <span className="block text-[11px] text-gray-500 font-medium">Target Size</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                {result.targetKb} KB
              </span>
            </div>
            <div className="p-2">
              <span className="block text-[11px] text-gray-500 font-medium">Dimensions</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-700">
                {result.width} × {result.height} px
              </span>
            </div>
          </div>

          {/* Preview */}
          <div className="rounded-[4px] border border-gray-200 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:10px_10px] p-4 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.url}
              alt="Compressed result"
              className="max-h-[300px] max-w-full rounded object-contain mx-auto shadow-xs"
            />
            <span className="inline-block mt-2 text-[11px] text-gray-500 font-medium">
              Compressed: {formatBytes(result.size)} ({result.width} × {result.height} px)
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
              <span>Download {formatBytes(result.size)} Image</span>
            </button>

            <button
              type="button"
              onClick={() => setResult(null)}
              className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-[#9AA3C8] bg-white hover:bg-[#EEF1FB] hover:border-[#414FA8] text-[#414FA8] text-xs font-semibold transition-colors"
            >
              Change Target KB
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
            <span>Files processed 100% locally in browser memory.</span>
          </div>
        </div>
      )}
    </div>
  );
}
