'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import JSZip from 'jszip';
import { formatBytes } from '@/lib/format-utils';
import { trackProcessingSuccess, trackProcessingError, trackDownload } from '@/lib/firebase';
import { WhatsAppShareButton } from '@/components/WhatsAppShareButton';
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
  Smartphone,
  Bookmark,
  Share2,
} from 'lucide-react';

interface HeicItem {
  id: string;
  file: File;
  name: string;
  originalSize: number;
  originalExt: string;
  convertedBlob?: Blob;
  convertedUrl?: string;
  convertedSize?: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
}

export function HeicToJpgConverter() {
  const [items, setItems] = useState<HeicItem[]>([]);
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

  const convertItem = async (item: HeicItem, targetQuality: number): Promise<{ blob: Blob; url: string; size: number }> => {
    const ext = item.originalExt.toLowerCase();
    const isHeic = ext === 'heic' || ext === 'heif' || item.file.type === 'image/heic' || item.file.type === 'image/heif';

    if (isHeic) {
      const heic2anyModule = await import('heic2any');
      const heic2any = heic2anyModule.default;
      const result = await heic2any({
        blob: item.file,
        toType: 'image/jpeg',
        quality: targetQuality / 100,
      });

      const convertedBlob = Array.isArray(result) ? result[0] : result;
      const url = registerUrl(URL.createObjectURL(convertedBlob));
      return {
        blob: convertedBlob,
        url,
        size: convertedBlob.size,
      };
    } else {
      // Fallback for standard images via Canvas
      return new Promise((resolve, reject) => {
        const tempUrl = URL.createObjectURL(item.file);
        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(tempUrl);
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to encode image to JPG'));
                return;
              }
              const url = registerUrl(URL.createObjectURL(blob));
              resolve({
                blob,
                url,
                size: blob.size,
              });
            },
            'image/jpeg',
            targetQuality / 100
          );
        };
        img.onerror = () => {
          URL.revokeObjectURL(tempUrl);
          reject(new Error('Could not read image file'));
        };
        img.src = tempUrl;
      });
    }
  };

  const processFiles = useCallback((files: FileList | File[]) => {
    setErrorMsg(null);
    const newItems: HeicItem[] = [];

    Array.from(files).forEach((file) => {
      const extMatch = file.name.match(/\.([^.]+)$/);
      const ext = extMatch ? extMatch[1].toLowerCase() : '';

      if (
        !file.type.match(/^image\//i) &&
        !['heic', 'heif', 'jpeg', 'jpg', 'jfif', 'png', 'webp'].includes(ext)
      ) {
        setErrorMsg('Please select HEIC, HEIF, or standard image files.');
        return;
      }

      newItems.push({
        id: Math.random().toString(36).substring(2, 9),
        file,
        name: file.name,
        originalSize: file.size,
        originalExt: ext || 'heic',
        status: 'pending',
      });
    });

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
    }
  }, []);

  const handleConvertAll = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);

    const updated = [...items];

    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status === 'done') continue;

      setProgressMsg(`Converting ${updated[i].name} (${i + 1} of ${updated.length})...`);
      updated[i].status = 'processing';
      setItems([...updated]);

      try {
        const res = await convertItem(updated[i], quality);
        updated[i].convertedBlob = res.blob;
        updated[i].convertedUrl = res.url;
        updated[i].convertedSize = res.size;
        updated[i].status = 'done';

        trackProcessingSuccess({
          tool: 'heic-to-jpg',
          fileType: 'image',
          inputKb: Math.round(updated[i].originalSize / 1024),
          outputKb: Math.round(res.size / 1024),
        });
      } catch (err: any) {
        updated[i].status = 'error';
        updated[i].error = err?.message || 'Conversion failed. File may be corrupted.';
        trackProcessingError('heic-to-jpg', updated[i].error || 'Unknown error');
      }
      setItems([...updated]);
    }

    setIsProcessing(false);
    setProgressMsg('');
  };

  const downloadSingle = (item: HeicItem) => {
    if (!item.convertedUrl) return;
    const baseName = item.name.replace(/\.[^/.]+$/, '');
    const a = document.createElement('a');
    a.href = item.convertedUrl;
    a.download = `${baseName}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    trackDownload('heic-to-jpg');
  };

  const handleDownloadZip = async () => {
    const doneItems = items.filter((item) => item.status === 'done' && item.convertedBlob);
    if (doneItems.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();
      doneItems.forEach((item) => {
        const baseName = item.name.replace(/\.[^/.]+$/, '');
        zip.file(`${baseName}.jpg`, item.convertedBlob!);
      });

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = `sizesnap_heic_to_jpg_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(zipUrl);

      trackDownload('heic-to-jpg');
    } catch {
      setErrorMsg('Failed to create ZIP file. Please download files individually.');
    } finally {
      setIsZipping(false);
    }
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleReset = () => {
    cleanupUrls();
    setItems([]);
    setErrorMsg(null);
    setProgressMsg('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const doneCount = items.filter((i) => i.status === 'done').length;
  const pendingCount = items.filter((i) => i.status === 'pending').length;

  return (
    <div className="space-y-5">
      {/* Quick Cyber Cafe & Privacy Notice */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-blue-50/70 border border-blue-200/80 rounded-[4px] text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-[#414FA8] shrink-0" />
          <span>
            <strong>iPhone / iPad Photo Rejection Fix:</strong> Converts Apple HEIC to universally accepted JPG format for SSC, UPSC, and State exam portals.
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200">
          <Bookmark className="w-3 h-3 text-[#414FA8]" />
          <span>Tip: Press Ctrl+D to bookmark</span>
        </div>
      </div>

      {/* Error alert */}
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
            accept=".heic,.heif,.HEIC,.HEIF,image/heic,image/heif,image/jpeg,image/png,image/webp"
            onChange={(e) => e.target.files && processFiles(e.target.files)}
            className="sr-only"
          />
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-4">
            <Upload className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Drop Apple iPhone HEIC / HEIF Photos Here
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-md">
            Easily convert <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 font-semibold">.heic</code> and <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-800 font-semibold">.heif</code> pictures from iOS to standard <code className="bg-blue-100 px-1.5 py-0.5 rounded text-blue-800 font-semibold">.jpg</code> format. 100% private in browser — no file leaves your computer.
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
            <span>Select HEIC Photos</span>
          </button>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
            <span>Fixes &quot;File format not supported&quot; error</span>
            <span>•</span>
            <span>Batch Convert up to 50 photos</span>
            <span>•</span>
            <span>Zero server upload</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-[4px] border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-800">
                {items.length} {items.length === 1 ? 'Photo' : 'Photos'} Selected
              </span>
              {doneCount > 0 && (
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded border border-emerald-200">
                  {doneCount} Converted to JPG
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => addMoreInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-[4px] border border-gray-300 transition-colors"
              >
                <FilePlus className="h-3.5 w-3.5 text-gray-600" />
                <span>Add More</span>
              </button>
              <input
                ref={addMoreInputRef}
                type="file"
                multiple
                accept=".heic,.heif,.HEIC,.HEIF,image/heic,image/heif,image/jpeg,image/png,image/webp"
                onChange={(e) => e.target.files && processFiles(e.target.files)}
                className="sr-only"
              />

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-red-50 text-gray-700 hover:text-red-700 text-xs font-semibold rounded-[4px] border border-gray-300 hover:border-red-200 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Quality Control Bar */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                <Sliders className="h-4 w-4 text-[#414FA8]" />
                <span>JPG Image Quality</span>
              </div>
              <span className="text-xs font-mono font-bold text-[#414FA8] bg-[#EEF1FB] px-2 py-0.5 rounded">
                {quality}% {quality === 90 ? '(Recommended)' : ''}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="60"
                max="100"
                step="5"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-[#414FA8] cursor-pointer"
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>Smaller Size (60%)</span>
              <span className="font-semibold text-gray-600">Balanced Crisp (90%)</span>
              <span>Maximum Quality (100%)</span>
            </div>
          </div>

          {/* Action Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={isProcessing}
              onClick={handleConvertAll}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#414FA8] hover:bg-[#343f88] disabled:bg-gray-400 text-white text-xs sm:text-sm font-semibold rounded-[4px] shadow-xs transition-colors"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{progressMsg || 'Converting HEIC to JPG...'}</span>
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  <span>
                    {pendingCount > 0
                      ? `Convert ${pendingCount} ${pendingCount === 1 ? 'Photo' : 'Photos'} to JPG`
                      : 'Re-Convert All to JPG'}
                  </span>
                </>
              )}
            </button>

            {doneCount > 0 && (
              <button
                type="button"
                disabled={isZipping}
                onClick={handleDownloadZip}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white text-xs sm:text-sm font-semibold rounded-[4px] shadow-xs transition-colors"
              >
                {isZipping ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Zipping JPGs...</span>
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4" />
                    <span>Download All as ZIP ({doneCount})</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Files List */}
          <div className="space-y-2">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 bg-white rounded-[4px] border border-gray-200 hover:border-gray-300 transition-colors shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Thumbnail / Status Icon */}
                  <div className="relative w-12 h-12 rounded bg-gray-100 flex items-center justify-center overflow-hidden shrink-0 border border-gray-200">
                    {item.convertedUrl ? (
                      <img
                        src={item.convertedUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <Smartphone className="w-5 h-5 text-gray-500" />
                        <span className="text-[8px] font-bold uppercase mt-0.5">{item.originalExt}</span>
                      </div>
                    )}
                    {item.status === 'processing' && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* File Metadata */}
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-gray-900 truncate" title={item.name}>
                      {item.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                      <span>Original: {formatBytes(item.originalSize)}</span>
                      {item.convertedSize && (
                        <>
                          <span>→</span>
                          <span className="font-semibold text-emerald-700">
                            JPG: {formatBytes(item.convertedSize)}
                          </span>
                        </>
                      )}
                    </div>
                    {item.error && (
                      <p className="text-[11px] text-red-600 mt-0.5">{item.error}</p>
                    )}
                  </div>
                </div>

                {/* File Row Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {item.status === 'done' && (
                    <button
                      type="button"
                      onClick={() => downloadSingle(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EEF1FB] hover:bg-[#414FA8] text-[#414FA8] hover:text-white text-xs font-semibold rounded transition-colors"
                      title="Download JPG"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download JPG</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp Share & Viral Trigger */}
      <div className="pt-2">
        <WhatsAppShareButton
          title="HEIC to JPG Converter"
          url="https://www.sizesnap.in/tools/heic-to-jpg"
        />
      </div>

      {/* Trust & Privacy Footer */}
      <div className="p-3 bg-white rounded-[4px] border border-gray-200 text-xs text-gray-500 flex items-center gap-2 shadow-2xs">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>
          <strong>100% Client-Side Privacy:</strong> Conversion runs locally via WebAssembly. Your photos are never uploaded or saved to any cloud server.
        </span>
      </div>
    </div>
  );
}
