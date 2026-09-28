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
  Palette,
} from 'lucide-react';

interface PngItem {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  originalSize: number;
  convertedBlob?: Blob;
  convertedUrl?: string;
  convertedSize?: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
}

export function PngToJpgConverter() {
  const [items, setItems] = useState<PngItem[]>([]);
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [quality, setQuality] = useState(90);
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
      if (!file.type.match(/^image\/(png|webp)$/i) && !file.name.match(/\.(png|webp)$/i)) {
        setErrorMsg('Please select PNG (or WebP) images.');
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
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
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

  // Convert single item to JPG via Canvas with background fill
  const convertToJpg = async (item: PngItem): Promise<{ blob: Blob; url: string; size: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context unavailable'));
          return;
        }

        // Fill background color for transparent alpha regions
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to create JPG blob'));
              return;
            }
            const url = registerUrl(URL.createObjectURL(blob));
            resolve({ blob, url, size: blob.size });
          },
          'image/jpeg',
          quality / 100
        );
      };
      img.onerror = () => reject(new Error('Image failed to load'));
      img.src = item.previewUrl;
    });
  };

  // Batch convert all pending
  const handleConvertAll = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);

    const updated = [...items];

    for (let i = 0; i < updated.length; i++) {
      setProgressMsg(`Converting image ${i + 1} of ${updated.length}...`);
      updated[i].status = 'processing';
      setItems([...updated]);

      try {
        const res = await convertToJpg(updated[i]);
        updated[i].convertedBlob = res.blob;
        updated[i].convertedUrl = res.url;
        updated[i].convertedSize = res.size;
        updated[i].status = 'done';
      } catch (err: any) {
        updated[i].status = 'error';
        updated[i].error = err?.message || 'Conversion failed';
      }
      setItems([...updated]);
    }

    setIsProcessing(false);
    setProgressMsg('');
  };

  const downloadSingle = (item: PngItem) => {
    if (!item.convertedUrl) return;
    const baseName = item.file.name.replace(/\.[^/.]+$/, '');
    const a = document.createElement('a');
    a.href = item.convertedUrl;
    a.download = `${baseName}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllZip = async () => {
    const doneItems = items.filter((it) => it.status === 'done' && it.convertedBlob);
    if (doneItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      doneItems.forEach((it) => {
        const baseName = it.file.name.replace(/\.[^/.]+$/, '');
        zip.file(`${baseName}.jpg`, it.convertedBlob!);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = registerUrl(URL.createObjectURL(zipBlob));
      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = 'sizesnap-converted-jpgs.zip';
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
            accept="image/png,image/webp,.png,.webp"
            onChange={(e) => e.target.files && processFiles(e.target.files)}
            className="sr-only"
          />
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-4">
            <Upload className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Select or Drag PNG Images to Convert
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Convert PNG graphics and logos to lightweight JPG. Choose custom background color for transparency, customize quality, and download as ZIP.
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
            <span>Select PNG Images</span>
          </button>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
            <span>Multiple PNGs supported</span>
            <span>•</span>
            <span>Custom Background Fill</span>
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
                {items.filter((it) => it.status === 'done').length} of {items.length} converted to JPG
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
                accept="image/png,image/webp,.png,.webp"
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

          {/* Conversion Settings: Background Color & Quality */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
              JPG Conversion Settings
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Background Color for Alpha */}
              <div>
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5 mb-1.5">
                  <Palette className="h-3.5 w-3.5 text-[#414FA8]" />
                  <span>Transparency Fill Color:</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-8 w-10 border border-gray-300 rounded cursor-pointer p-0 bg-transparent"
                    title="Choose background color"
                  />
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setBgColor('#FFFFFF')}
                      className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                        bgColor.toUpperCase() === '#FFFFFF'
                          ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      White
                    </button>
                    <button
                      type="button"
                      onClick={() => setBgColor('#000000')}
                      className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                        bgColor === '#000000'
                          ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold'
                          : 'border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      Black
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  JPG does not support transparency. Transparent areas will be filled with this color.
                </p>
              </div>

              {/* Quality Slider */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                    <Sliders className="h-3.5 w-3.5 text-[#414FA8]" />
                    <span>JPEG Quality:</span>
                  </label>
                  <span className="text-xs font-bold text-[#414FA8]">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#414FA8]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Smaller File</span>
                  <span>90% (Standard)</span>
                  <span>Maximum Quality</span>
                </div>
              </div>
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
                  <div className="h-14 w-14 shrink-0 rounded border border-gray-200 bg-[#FAFAFC] overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.convertedUrl || item.previewUrl}
                      alt={item.file.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate" title={item.file.name}>
                      {item.file.name}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {item.width} × {item.height} px
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-medium border border-blue-200">
                        PNG: {formatBytes(item.originalSize)}
                      </span>
                      {item.convertedSize && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200">
                          JPG: {formatBytes(item.convertedSize)}
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
                      <span className="text-[11px] text-gray-400">Ready to convert</span>
                    )}
                    {item.status === 'processing' && (
                      <span className="text-[11px] text-[#414FA8] font-medium flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" /> Converting...
                      </span>
                    )}
                    {item.status === 'done' && (
                      <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Done
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
                      <span>Download JPG</span>
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
              onClick={handleConvertAll}
              disabled={isProcessing}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-[#414FA8] hover:bg-[#343f88] disabled:bg-gray-300 text-white font-semibold text-xs sm:text-sm rounded-[4px] transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                  <span>{progressMsg || 'Converting to JPG...'}</span>
                </>
              ) : allDone ? (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Re-convert All with Current Settings</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>Convert All to JPG ({items.length})</span>
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
            <span>100% private conversion inside your browser. No files are uploaded to servers.</span>
          </div>
        </div>
      )}
    </div>
  );
}
