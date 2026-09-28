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
  RotateCw,
  RotateCcw,
  Sliders,
} from 'lucide-react';

interface RotateItem {
  id: string;
  file: File;
  previewUrl: string;
  naturalWidth: number;
  naturalHeight: number;
  originalSize: number;
  angle: number; // in degrees
  rotatedBlob?: Blob;
  rotatedUrl?: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
}

export function RotateImageTool() {
  const [items, setItems] = useState<RotateItem[]>([]);
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
        setErrorMsg('Please select valid image files (JPG, PNG, WebP).');
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
            naturalWidth: img.naturalWidth || img.width,
            naturalHeight: img.naturalHeight || img.height,
            originalSize: file.size,
            angle: 90, // Default 90 deg right
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

  // Adjust angle for single item
  const updateItemAngle = (idx: number, delta: number) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[idx].angle = (copy[idx].angle + delta + 360) % 360;
      copy[idx].status = 'pending';
      return copy;
    });
  };

  const setItemExactAngle = (idx: number, angle: number) => {
    setItems((prev) => {
      const copy = [...prev];
      copy[idx].angle = angle;
      copy[idx].status = 'pending';
      return copy;
    });
  };

  // Bulk actions
  const adjustAllAngles = (delta: number) => {
    setItems((prev) =>
      prev.map((item) => ({
        ...item,
        angle: (item.angle + delta + 360) % 360,
        status: 'pending',
      }))
    );
  };

  // Render rotation on Canvas
  const renderRotatedImage = async (item: RotateItem): Promise<{ blob: Blob; url: string }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const rad = (item.angle * Math.PI) / 180;
        const sin = Math.abs(Math.sin(rad));
        const cos = Math.abs(Math.cos(rad));
        const newWidth = Math.round(img.naturalWidth * cos + img.naturalHeight * sin);
        const newHeight = Math.round(img.naturalWidth * sin + img.naturalHeight * cos);

        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }

        const mime = item.file.type || 'image/jpeg';
        if (mime === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, newWidth, newHeight);
        }

        ctx.translate(newWidth / 2, newHeight / 2);
        ctx.rotate(rad);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error('Failed to create rotated blob'));
            return;
          }
          const url = registerUrl(URL.createObjectURL(blob));
          resolve({ blob, url });
        }, mime, 0.95);
      };
      img.onerror = () => reject(new Error('Image failed to load'));
      img.src = item.previewUrl;
    });
  };

  // Process all
  const handleRotateAll = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);

    const updated = [...items];

    for (let i = 0; i < updated.length; i++) {
      setProgressMsg(`Processing image ${i + 1} of ${updated.length}...`);
      updated[i].status = 'processing';
      setItems([...updated]);

      try {
        const res = await renderRotatedImage(updated[i]);
        updated[i].rotatedBlob = res.blob;
        updated[i].rotatedUrl = res.url;
        updated[i].status = 'done';
      } catch (err: any) {
        updated[i].status = 'error';
        updated[i].error = err?.message || 'Rotation failed';
      }
      setItems([...updated]);
    }

    setIsProcessing(false);
    setProgressMsg('');
  };

  const downloadSingle = (item: RotateItem) => {
    if (!item.rotatedUrl) return;
    const baseName = item.file.name.replace(/\.[^/.]+$/, '');
    const match = item.file.name.match(/\.([a-zA-Z0-9]+)$/);
    const ext = match ? match[1].toLowerCase() : 'jpg';

    const a = document.createElement('a');
    a.href = item.rotatedUrl;
    a.download = `${baseName}-rotated-${item.angle}deg.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllZip = async () => {
    const doneItems = items.filter((it) => it.status === 'done' && it.rotatedBlob);
    if (doneItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      doneItems.forEach((it) => {
        const baseName = it.file.name.replace(/\.[^/.]+$/, '');
        const match = it.file.name.match(/\.([a-zA-Z0-9]+)$/);
        const ext = match ? match[1].toLowerCase() : 'jpg';
        zip.file(`${baseName}-rotated-${it.angle}deg.${ext}`, it.rotatedBlob!);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = registerUrl(URL.createObjectURL(zipBlob));
      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = 'sizesnap-rotated-images.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err: any) {
      setErrorMsg('Failed to generate ZIP archive: ' + err.message);
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
            <RotateCw className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Select or Drag Images to Rotate
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Rotate photos 90° clockwise, 90° counter-clockwise, 180°, or any custom angle. Batch process and download as ZIP.
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
            <span>Select Images to Rotate</span>
          </button>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
            <span>90° / 180° / Custom angle slider</span>
            <span>•</span>
            <span>Batch ZIP download</span>
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
                {items.length} Image{items.length > 1 ? 's' : ''} Loaded
              </h3>
              <p className="text-[11px] text-gray-500">
                {items.filter((it) => it.status === 'done').length} of {items.length} rotated
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

          {/* Bulk Controls */}
          <div className="bg-white p-3.5 rounded-[4px] border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Bulk Rotation Actions:
            </span>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => adjustAllAngles(90)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] border border-[#9AA3C8]/40 transition-colors"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Rotate All 90° CW</span>
              </button>

              <button
                type="button"
                onClick={() => adjustAllAngles(-90)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] border border-[#9AA3C8]/40 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Rotate All 90° CCW</span>
              </button>

              <button
                type="button"
                onClick={() => adjustAllAngles(180)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Flip All 180°</span>
              </button>
            </div>
          </div>

          {/* Grid of Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {items.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white p-3 rounded-[4px] border border-gray-200 shadow-xs flex flex-col justify-between gap-2.5"
              >
                <div className="flex items-start gap-2.5">
                  {/* Live preview with CSS rotation */}
                  <div className="h-20 w-20 shrink-0 rounded border border-gray-200 bg-[#FAFAFC] overflow-hidden flex items-center justify-center relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.rotatedUrl || item.previewUrl}
                      alt={item.file.name}
                      style={{
                        transform: item.rotatedUrl ? 'none' : `rotate(${item.angle}deg)`,
                      }}
                      className="max-h-full max-w-full object-contain transition-transform duration-200"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate" title={item.file.name}>
                      {item.file.name}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {item.naturalWidth} × {item.naturalHeight} px • {formatBytes(item.originalSize)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-[#EEF1FB] text-[#414FA8] border border-[#9AA3C8]/40">
                        {item.angle}°
                      </span>
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

                {/* Individual Controls */}
                <div className="space-y-2 pt-1 border-t border-gray-100">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateItemAngle(idx, -90)}
                      className="flex-1 py-1 px-2 text-xs rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-1"
                      title="Rotate -90°"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>-90°</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updateItemAngle(idx, 90)}
                      className="flex-1 py-1 px-2 text-xs rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 flex items-center justify-center gap-1"
                      title="Rotate +90°"
                    >
                      <RotateCw className="h-3 w-3" />
                      <span>+90°</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setItemExactAngle(idx, 0)}
                      className="py-1 px-2 text-xs rounded border border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
                    >
                      0°
                    </button>
                  </div>

                  {/* Fine tune slider */}
                  <div className="flex items-center gap-2 text-xs">
                    <Sliders className="h-3 w-3 text-gray-400 shrink-0" />
                    <input
                      type="range"
                      min="0"
                      max="359"
                      value={item.angle}
                      onChange={(e) => setItemExactAngle(idx, Number(e.target.value))}
                      className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#414FA8]"
                    />
                    <span className="font-mono text-[11px] text-gray-500 w-8 text-right">
                      {item.angle}°
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    {item.status === 'pending' && (
                      <span className="text-[11px] text-gray-400">Ready</span>
                    )}
                    {item.status === 'processing' && (
                      <span className="text-[11px] text-[#414FA8] font-medium flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" /> Rotating...
                      </span>
                    )}
                    {item.status === 'done' && (
                      <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Rotated
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
            ))}
          </div>

          {/* Action Footer */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleRotateAll}
              disabled={isProcessing}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#414FA8] hover:bg-[#343f88] disabled:bg-gray-300 text-white font-semibold text-xs sm:text-sm rounded-[4px] transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>{progressMsg || 'Rendering rotated images...'}</span>
                </>
              ) : allDone ? (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Re-apply Rotation Angles ({items.length})</span>
                </>
              ) : (
                <>
                  <RotateCw className="h-4 w-4" />
                  <span>Apply Rotation to All ({items.length} Images)</span>
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
                    <span>Packing ZIP...</span>
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
            <span>High-precision canvas rotation. Zero server uploads.</span>
          </div>
        </div>
      )}
    </div>
  );
}
