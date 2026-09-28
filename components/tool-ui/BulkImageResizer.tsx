'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import JSZip from 'jszip';
import { formatBytes } from '@/lib/format-utils';
import {
  Upload,
  FilePlus,
  Trash2,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Archive,
  RefreshCw,
  Sliders,
  Maximize2,
  Percent,
  Lock,
  Unlock,
} from 'lucide-react';

interface ResizeItem {
  id: string;
  file: File;
  previewUrl: string;
  originalWidth: number;
  originalHeight: number;
  originalSize: number;
  targetWidth?: number;
  targetHeight?: number;
  resizedBlob?: Blob;
  resizedUrl?: string;
  resizedSize?: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
}

type ResizeMode = 'percentage' | 'dimensions' | 'max-bounds';
type OutputFormat = 'original' | 'jpeg' | 'png' | 'webp';

export function BulkImageResizer() {
  const [items, setItems] = useState<ResizeItem[]>([]);
  const [mode, setMode] = useState<ResizeMode>('percentage');

  // Mode: Percentage
  const [percentage, setPercentage] = useState<number>(50);

  // Mode: Dimensions
  const [targetWidth, setTargetWidth] = useState<number>(1280);
  const [targetHeight, setTargetHeight] = useState<number>(720);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [primaryDimension, setPrimaryDimension] = useState<'width' | 'height'>('width');

  // Mode: Max bounds
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [maxHeight, setMaxHeight] = useState<number>(1080);

  // Output settings
  const [format, setFormat] = useState<OutputFormat>('original');
  const [quality, setQuality] = useState<number>(85);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [isZipping, setIsZipping] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);
  const urlsRef = useRef<string[]>([]);

  const registerUrl = useCallback((url: string) => {
    urlsRef.current.push(url);
    return url;
  }, []);

  const cleanupUrls = useCallback(() => {
    urlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {
        // ignore
      }
    });
    urlsRef.current = [];
  }, []);

  useEffect(() => {
    return () => cleanupUrls();
  }, [cleanupUrls]);

  const processFiles = useCallback((files: FileList | File[]) => {
    setErrorMsg(null);
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Please select image files (JPG, PNG, or WebP).');
        return;
      }

      const previewUrl = registerUrl(URL.createObjectURL(file));
      const img = new Image();
      img.onload = () => {
        setItems((prev) => [
          ...prev,
          {
            id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            file,
            previewUrl,
            originalWidth: img.naturalWidth || img.width,
            originalHeight: img.naturalHeight || img.height,
            originalSize: file.size,
            status: 'pending',
          },
        ]);
      };
      img.src = previewUrl;
    });
  }, [registerUrl]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) {
      processFiles(e.dataTransfer.files);
    }
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    cleanupUrls();
    setItems([]);
    setErrorMsg(null);
  };

  // Calculate target dimensions for an individual image
  const calculateDims = (origW: number, origH: number): { w: number; h: number } => {
    if (mode === 'percentage') {
      const scale = Math.max(1, percentage) / 100;
      return {
        w: Math.max(1, Math.round(origW * scale)),
        h: Math.max(1, Math.round(origH * scale)),
      };
    }

    if (mode === 'max-bounds') {
      const maxW = Math.max(10, maxWidth);
      const maxH = Math.max(10, maxHeight);
      if (origW <= maxW && origH <= maxH) {
        return { w: origW, h: origH };
      }
      const ratio = Math.min(maxW / origW, maxH / origH);
      return {
        w: Math.max(1, Math.round(origW * ratio)),
        h: Math.max(1, Math.round(origH * ratio)),
      };
    }

    // mode === 'dimensions'
    if (!lockAspectRatio) {
      return {
        w: Math.max(1, targetWidth),
        h: Math.max(1, targetHeight),
      };
    }

    // Locked aspect ratio
    const imgAspect = origW / origH;
    if (primaryDimension === 'width') {
      const w = Math.max(1, targetWidth);
      const h = Math.max(1, Math.round(w / imgAspect));
      return { w, h };
    } else {
      const h = Math.max(1, targetHeight);
      const w = Math.max(1, Math.round(h * imgAspect));
      return { w, h };
    }
  };

  // Resize single image via Canvas
  const resizeSingle = async (
    item: ResizeItem
  ): Promise<{ blob: Blob; url: string; size: number; w: number; h: number }> => {
    const { w: finalW, h: finalH } = calculateDims(item.originalWidth, item.originalHeight);

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = finalW;
        canvas.height = finalH;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Determine mime type
        let mime = item.file.type;
        if (format === 'jpeg') mime = 'image/jpeg';
        else if (format === 'png') mime = 'image/png';
        else if (format === 'webp') mime = 'image/webp';

        // If target is JPEG and source might have transparency, fill white
        if (mime === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, finalW, finalH);
        }

        ctx.drawImage(img, 0, 0, finalW, finalH);

        const qualityParam = mime === 'image/png' ? undefined : quality / 100;
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create resized blob'));
              return;
            }
            const url = registerUrl(URL.createObjectURL(blob));
            resolve({ blob, url, size: blob.size, w: finalW, h: finalH });
          },
          mime,
          qualityParam
        );
      };
      img.onerror = () => reject(new Error('Image failed to load'));
      img.src = item.previewUrl;
    });
  };

  // Batch process all images
  const handleResizeAll = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);

    const updated = [...items];

    for (let i = 0; i < updated.length; i++) {
      setProgressMsg(`Resizing image ${i + 1} of ${updated.length}...`);
      updated[i].status = 'processing';
      setItems([...updated]);

      try {
        const res = await resizeSingle(updated[i]);
        updated[i].resizedBlob = res.blob;
        updated[i].resizedUrl = res.url;
        updated[i].resizedSize = res.size;
        updated[i].targetWidth = res.w;
        updated[i].targetHeight = res.h;
        updated[i].status = 'done';
      } catch (err: any) {
        updated[i].status = 'error';
        updated[i].error = err?.message || 'Resize failed';
      }
      setItems([...updated]);
    }

    setIsProcessing(false);
    setProgressMsg('');
  };

  const getExtension = (item: ResizeItem): string => {
    if (format === 'jpeg') return 'jpg';
    if (format === 'png') return 'png';
    if (format === 'webp') return 'webp';
    const match = item.file.name.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1].toLowerCase() : 'jpg';
  };

  const downloadSingle = (item: ResizeItem) => {
    if (!item.resizedUrl) return;
    const baseName = item.file.name.replace(/\.[^/.]+$/, '');
    const ext = getExtension(item);
    const a = document.createElement('a');
    a.href = item.resizedUrl;
    a.download = `${baseName}-${item.targetWidth}x${item.targetHeight}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllZip = async () => {
    const doneItems = items.filter((it) => it.status === 'done' && it.resizedBlob);
    if (doneItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      doneItems.forEach((it) => {
        const baseName = it.file.name.replace(/\.[^/.]+$/, '');
        const ext = getExtension(it);
        zip.file(`${baseName}-${it.targetWidth}x${it.targetHeight}.${ext}`, it.resizedBlob!);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = registerUrl(URL.createObjectURL(zipBlob));
      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = 'sizesnap-resized-images.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      setErrorMsg('Failed to generate ZIP: ' + err.message);
    } finally {
      setIsZipping(false);
    }
  };

  const allDone = items.length > 0 && items.every((it) => it.status === 'done');
  const someDone = items.some((it) => it.status === 'done');

  return (
    <div className="space-y-5">
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

      {/* Upload Dropzone */}
      {items.length === 0 ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[4px] border-2 border-dashed border-[#9AA3C8] bg-[#FAFAFC] hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-colors cursor-pointer select-none"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={(e) => e.target.files && processFiles(e.target.files)}
            className="sr-only"
          />
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-4">
            <Maximize2 className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Select or Drag Multiple Images to Resize
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Bulk resize images by percentage, exact pixel dimensions with aspect ratio lock, or bounding box. Download as a single ZIP archive.
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs sm:text-sm font-semibold rounded-[4px] shadow-xs transition-colors"
          >
            <FilePlus className="h-4 w-4" />
            <span>Select Multiple Images</span>
          </button>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
            <span>JPG, PNG, WebP supported</span>
            <span>•</span>
            <span>Aspect Ratio Lock</span>
            <span>•</span>
            <span>100% Client-Side</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-[4px] border border-gray-200 shadow-xs">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                {items.length} Image{items.length > 1 ? 's' : ''} Ready for Bulk Resize
              </h3>
              <p className="text-[11px] text-gray-500">
                {items.filter((it) => it.status === 'done').length} of {items.length} resized
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => addMoreInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#9AA3C8] hover:border-[#414FA8] bg-white hover:bg-[#EEF1FB] text-[#414FA8] text-xs font-semibold transition-colors"
              >
                <FilePlus className="h-3.5 w-3.5" />
                <span>Add More</span>
              </button>
              <input
                ref={addMoreInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                onChange={(e) => e.target.files && processFiles(e.target.files)}
                className="sr-only"
              />

              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Resize Configuration Panel */}
          <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
            {/* Mode Tabs */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Resize Mode
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setMode('percentage')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    mode === 'percentage'
                      ? 'bg-[#414FA8] text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  By Percentage (%)
                </button>
                <button
                  type="button"
                  onClick={() => setMode('dimensions')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    mode === 'dimensions'
                      ? 'bg-[#414FA8] text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Exact Dimensions (px)
                </button>
                <button
                  type="button"
                  onClick={() => setMode('max-bounds')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    mode === 'max-bounds'
                      ? 'bg-[#414FA8] text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Max Bounds
                </button>
              </div>
            </div>

            {/* Mode Controls */}
            {mode === 'percentage' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <Percent className="h-3.5 w-3.5 text-[#414FA8]" />
                    <span>Scale Percentage:</span>
                  </label>
                  <span className="text-xs font-bold text-[#414FA8]">{percentage}% of original</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#414FA8]"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[25, 50, 75, 100, 150].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setPercentage(pct)}
                      className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                        percentage === pct
                          ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold'
                          : 'border-gray-200 bg-white text-gray-600'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>
            )}

            {mode === 'dimensions' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Width (px):
                    </label>
                    <input
                      type="number"
                      value={targetWidth}
                      onChange={(e) => {
                        setTargetWidth(Number(e.target.value));
                        setPrimaryDimension('width');
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Height (px):
                    </label>
                    <input
                      type="number"
                      value={targetHeight}
                      onChange={(e) => {
                        setTargetHeight(Number(e.target.value));
                        setPrimaryDimension('height');
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-600">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={lockAspectRatio}
                      onChange={(e) => setLockAspectRatio(e.target.checked)}
                      className="accent-[#414FA8]"
                    />
                    <span className="flex items-center gap-1 font-medium">
                      {lockAspectRatio ? (
                        <>
                          <Lock className="h-3.5 w-3.5 text-[#414FA8]" /> Lock Aspect Ratio
                        </>
                      ) : (
                        <>
                          <Unlock className="h-3.5 w-3.5 text-gray-400" /> Unlock Aspect Ratio (Stretch)
                        </>
                      )}
                    </span>
                  </label>
                  {lockAspectRatio && (
                    <span className="text-[11px] text-gray-400">
                      Calculates height based on {primaryDimension === 'width' ? 'width' : 'height'}
                    </span>
                  )}
                </div>
              </div>
            )}

            {mode === 'max-bounds' && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">
                  Images exceeding these bounds will be downscaled proportionally. Smaller images will remain untouched.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Max Width (px):
                    </label>
                    <input
                      type="number"
                      value={maxWidth}
                      onChange={(e) => setMaxWidth(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-700 block mb-1">
                      Max Height (px):
                    </label>
                    <input
                      type="number"
                      value={maxHeight}
                      onChange={(e) => setMaxHeight(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded bg-white text-gray-800"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setMaxWidth(1920);
                      setMaxHeight(1080);
                    }}
                    className="px-2.5 py-1 text-xs rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                  >
                    1080p FHD (1920×1080)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMaxWidth(1280);
                      setMaxHeight(720);
                    }}
                    className="px-2.5 py-1 text-xs rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                  >
                    720p HD (1280×720)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMaxWidth(800);
                      setMaxHeight(800);
                    }}
                    className="px-2.5 py-1 text-xs rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
                  >
                    Square (800×800)
                  </button>
                </div>
              </div>
            )}

            {/* Output Format & Quality */}
            <div className="pt-3 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Output Format:
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as OutputFormat)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded bg-white text-gray-800"
                >
                  <option value="original">Keep Original Format</option>
                  <option value="jpeg">Convert to JPG/JPEG</option>
                  <option value="png">Convert to PNG</option>
                  <option value="webp">Convert to WebP</option>
                </select>
              </div>

              {format !== 'png' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700 flex items-center gap-1">
                      <Sliders className="h-3 w-3 text-[#414FA8]" />
                      <span>Quality:</span>
                    </label>
                    <span className="text-xs font-bold text-[#414FA8]">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#414FA8]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Images Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {items.map((item, idx) => {
              const previewTarget = calculateDims(item.originalWidth, item.originalHeight);

              return (
                <div
                  key={item.id}
                  className="bg-white p-3 rounded-[4px] border border-gray-200 shadow-xs flex flex-col justify-between gap-2.5"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="h-14 w-14 shrink-0 rounded border border-gray-200 bg-[#FAFAFC] overflow-hidden flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.resizedUrl || item.previewUrl}
                        alt={item.file.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-800 truncate" title={item.file.name}>
                        {item.file.name}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Original: {item.originalWidth} × {item.originalHeight} px
                      </p>
                      <p className="text-[11px] text-[#414FA8] font-semibold">
                        Target: {item.targetWidth || previewTarget.w} × {item.targetHeight || previewTarget.h} px
                      </p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 font-medium">
                          {formatBytes(item.originalSize)}
                        </span>
                        {item.resizedSize && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                            Resized: {formatBytes(item.resizedSize)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="text-gray-400 hover:text-red-600 p-1"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                    <div>
                      {item.status === 'pending' && (
                        <span className="text-[11px] text-gray-400">Ready</span>
                      )}
                      {item.status === 'processing' && (
                        <span className="text-[11px] text-[#414FA8] font-medium flex items-center gap-1">
                          <Loader2 className="h-3 w-3 animate-spin" /> Resizing...
                        </span>
                      )}
                      {item.status === 'done' && (
                        <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Resized
                        </span>
                      )}
                      {item.status === 'error' && (
                        <span className="text-[11px] text-red-600 font-medium">Error</span>
                      )}
                    </div>

                    {item.status === 'done' && (
                      <button
                        type="button"
                        onClick={() => downloadSingle(item)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-semibold rounded-[4px] transition-colors"
                      >
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResizeAll}
              disabled={isProcessing}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#414FA8] hover:bg-[#343f88] disabled:bg-gray-300 text-white font-semibold text-xs sm:text-sm rounded-[4px] transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>{progressMsg || 'Resizing in progress...'}</span>
                </>
              ) : allDone ? (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Re-apply Resize to All ({items.length})</span>
                </>
              ) : (
                <>
                  <Maximize2 className="h-4 w-4" />
                  <span>Resize All ({items.length} Images)</span>
                </>
              )}
            </button>

            {someDone && (
              <button
                type="button"
                onClick={downloadAllZip}
                disabled={isZipping}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold text-xs sm:text-sm rounded-[4px] transition-colors"
              >
                {isZipping ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Generating ZIP...</span>
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4" />
                    <span>Download All as ZIP</span>
                  </>
                )}
              </button>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>High-precision canvas interpolation. Files are processed locally without server uploads.</span>
          </div>
        </div>
      )}
    </div>
  );
}
