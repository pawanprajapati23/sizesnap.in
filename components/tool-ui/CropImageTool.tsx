'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Crop as CropIcon,
  Maximize2,
  Square,
  Smartphone,
  RefreshCw,
} from 'lucide-react';

interface ImageMeta {
  file: File;
  name: string;
  size: number;
  previewUrl: string;
  naturalWidth: number;
  naturalHeight: number;
}

type AspectRatioOption = 'free' | '1:1' | '4:3' | '16:9' | '3:2' | '3.5:4.5';

export function CropImageTool() {
  const [imageMeta, setImageMeta] = useState<ImageMeta | null>(null);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('free');

  // Crop box in percentage of displayed container [0, 100]
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<'move' | 'nw' | 'ne' | 'sw' | 'se' | null>(null);
  const [dragStart, setDragStart] = useState({ mouseX: 0, mouseY: 0, boxX: 0, boxY: 0, boxW: 0, boxH: 0 });

  // Output settings
  const [outputFormat, setOutputFormat] = useState<'original' | 'jpeg' | 'png' | 'webp'>('original');
  const [quality, setQuality] = useState<number>(90);

  // Result
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [croppedDims, setCroppedDims] = useState<{ width: number; height: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
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

  const loadImage = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select an image file (JPG, PNG, WebP).');
      return;
    }

    const previewUrl = registerUrl(URL.createObjectURL(file));
    const img = new Image();
    img.onload = () => {
      setImageMeta({
        file,
        name: file.name,
        size: file.size,
        previewUrl,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
      });

      // Default crop box (centered 80%)
      setCropBox({ x: 10, y: 10, width: 80, height: 80 });
      setCroppedBlob(null);
      setCroppedUrl(null);
      setCroppedDims(null);
    };
    img.onerror = () => setErrorMsg('Failed to load image.');
    img.src = previewUrl;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      loadImage(e.dataTransfer.files[0]);
    }
  };

  const clearAll = () => {
    cleanupUrls();
    setImageMeta(null);
    setCroppedBlob(null);
    setCroppedUrl(null);
    setCroppedDims(null);
    setErrorMsg(null);
  };

  // Adjust crop box based on selected aspect ratio
  const applyAspectRatio = (ratioKey: AspectRatioOption) => {
    setAspectRatio(ratioKey);
    setCroppedUrl(null);

    if (!imageMeta) return;

    if (ratioKey === 'free') {
      return;
    }

    let targetRatio = 1; // w / h
    if (ratioKey === '1:1') targetRatio = 1;
    else if (ratioKey === '4:3') targetRatio = 4 / 3;
    else if (ratioKey === '16:9') targetRatio = 16 / 9;
    else if (ratioKey === '3:2') targetRatio = 3 / 2;
    else if (ratioKey === '3.5:4.5') targetRatio = 3.5 / 4.5;

    // Current image aspect ratio
    const imgRatio = imageMeta.naturalWidth / imageMeta.naturalHeight;

    // We want cropBox in % coords such that (cropBox.width * naturalWidth) / (cropBox.height * naturalHeight) == targetRatio
    // i.e. (cropBox.width / cropBox.height) * imgRatio == targetRatio
    // cropBox.width / cropBox.height = targetRatio / imgRatio
    const desiredPctRatio = targetRatio / imgRatio;

    let newWidth = 70;
    let newHeight = newWidth / desiredPctRatio;

    if (newHeight > 80) {
      newHeight = 80;
      newWidth = newHeight * desiredPctRatio;
    }

    if (newWidth > 90) {
      newWidth = 90;
      newHeight = newWidth / desiredPctRatio;
    }

    const newX = Math.max(0, (100 - newWidth) / 2);
    const newY = Math.max(0, (100 - newHeight) / 2);

    setCropBox({
      x: Math.round(newX),
      y: Math.round(newY),
      width: Math.round(newWidth),
      height: Math.round(newHeight),
    });
  };

  // Mouse / Touch Drag handlers
  const handlePointerDown = (mode: 'move' | 'nw' | 'ne' | 'sw' | 'se', e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragMode(mode);
    setDragStart({
      mouseX: e.clientX,
      mouseY: e.clientY,
      boxX: cropBox.x,
      boxY: cropBox.y,
      boxW: cropBox.width,
      boxH: cropBox.height,
    });
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging || !dragMode || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const deltaXPercent = ((e.clientX - dragStart.mouseX) / rect.width) * 100;
      const deltaYPercent = ((e.clientY - dragStart.mouseY) / rect.height) * 100;

      if (dragMode === 'move') {
        let newX = dragStart.boxX + deltaXPercent;
        let newY = dragStart.boxY + deltaYPercent;

        newX = Math.max(0, Math.min(100 - dragStart.boxW, newX));
        newY = Math.max(0, Math.min(100 - dragStart.boxH, newY));

        setCropBox((prev) => ({ ...prev, x: newX, y: newY }));
      } else {
        // Resize handle
        let newX = dragStart.boxX;
        let newY = dragStart.boxY;
        let newW = dragStart.boxW;
        let newH = dragStart.boxH;

        if (dragMode === 'se') {
          newW = Math.max(10, Math.min(100 - dragStart.boxX, dragStart.boxW + deltaXPercent));
          newH = Math.max(10, Math.min(100 - dragStart.boxY, dragStart.boxH + deltaYPercent));
        } else if (dragMode === 'sw') {
          const proposedW = dragStart.boxW - deltaXPercent;
          if (proposedW >= 10 && dragStart.boxX + deltaXPercent >= 0) {
            newX = dragStart.boxX + deltaXPercent;
            newW = proposedW;
          }
          newH = Math.max(10, Math.min(100 - dragStart.boxY, dragStart.boxH + deltaYPercent));
        } else if (dragMode === 'ne') {
          newW = Math.max(10, Math.min(100 - dragStart.boxX, dragStart.boxW + deltaXPercent));
          const proposedH = dragStart.boxH - deltaYPercent;
          if (proposedH >= 10 && dragStart.boxY + deltaYPercent >= 0) {
            newY = dragStart.boxY + deltaYPercent;
            newH = proposedH;
          }
        } else if (dragMode === 'nw') {
          const proposedW = dragStart.boxW - deltaXPercent;
          if (proposedW >= 10 && dragStart.boxX + deltaXPercent >= 0) {
            newX = dragStart.boxX + deltaXPercent;
            newW = proposedW;
          }
          const proposedH = dragStart.boxH - deltaYPercent;
          if (proposedH >= 10 && dragStart.boxY + deltaYPercent >= 0) {
            newY = dragStart.boxY + deltaYPercent;
            newH = proposedH;
          }
        }

        setCropBox({
          x: Math.round(newX),
          y: Math.round(newY),
          width: Math.round(newW),
          height: Math.round(newH),
        });
      }
    },
    [isDragging, dragMode, dragStart]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setDragMode(null);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  // Pixel coordinates in original image
  const pixelCrop = imageMeta
    ? {
        x: Math.round((cropBox.x / 100) * imageMeta.naturalWidth),
        y: Math.round((cropBox.y / 100) * imageMeta.naturalHeight),
        width: Math.max(1, Math.round((cropBox.width / 100) * imageMeta.naturalWidth)),
        height: Math.max(1, Math.round((cropBox.height / 100) * imageMeta.naturalHeight)),
      }
    : { x: 0, y: 0, width: 0, height: 0 };

  // Perform Crop execution via Canvas
  const handlePerformCrop = async () => {
    if (!imageMeta) return;

    setIsProcessing(true);
    setErrorMsg(null);

    await new Promise((r) => setTimeout(r, 50));

    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = pixelCrop.width;
        canvas.height = pixelCrop.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          setErrorMsg('Canvas context not available');
          return;
        }

        let mime = imageMeta.file.type;
        if (outputFormat === 'jpeg') mime = 'image/jpeg';
        else if (outputFormat === 'png') mime = 'image/png';
        else if (outputFormat === 'webp') mime = 'image/webp';

        if (mime === 'image/jpeg') {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(
          img,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          pixelCrop.width,
          pixelCrop.height
        );

        const qualityParam = mime === 'image/png' ? undefined : quality / 100;
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setIsProcessing(false);
              setErrorMsg('Failed to create cropped image blob');
              return;
            }
            const url = registerUrl(URL.createObjectURL(blob));
            setCroppedBlob(blob);
            setCroppedUrl(url);
            setCroppedDims({ width: pixelCrop.width, height: pixelCrop.height });
            setIsProcessing(false);
          },
          mime,
          qualityParam
        );
      };
      img.onerror = () => {
        setIsProcessing(false);
        setErrorMsg('Failed to process image');
      };
      img.src = imageMeta.previewUrl;
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err?.message || 'Crop failed');
    }
  };

  const getExtension = () => {
    if (outputFormat === 'jpeg') return 'jpg';
    if (outputFormat === 'png') return 'png';
    if (outputFormat === 'webp') return 'webp';
    const match = imageMeta?.name.match(/\.([a-zA-Z0-9]+)$/);
    return match ? match[1].toLowerCase() : 'jpg';
  };

  const handleDownload = () => {
    if (!croppedUrl || !imageMeta) return;
    const baseName = imageMeta.name.replace(/\.[^/.]+$/, '');
    const a = document.createElement('a');
    a.href = croppedUrl;
    a.download = `${baseName}-cropped.${getExtension()}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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
      {!imageMeta ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[4px] border-2 border-dashed border-[#9AA3C8] bg-[#FAFAFC] hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-colors cursor-pointer select-none"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={(e) => e.target.files?.[0] && loadImage(e.target.files[0])}
            className="sr-only"
          />
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-4">
            <CropIcon className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Select or Drag an Image to Crop
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Interactive drag-to-crop area, aspect ratio presets (1:1, 16:9, Passport 3.5:4.5), exact pixel preview, and instant download.
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
            <span>Select Image File</span>
          </button>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
            <span>Freeform &amp; fixed aspect ratios</span>
            <span>•</span>
            <span>High-precision pixel crop</span>
            <span>•</span>
            <span>100% Client-Side</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-[4px] border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] border border-[#9AA3C8]/40 flex items-center justify-center shrink-0">
                <CropIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate max-w-xs sm:max-w-md" title={imageMeta.name}>
                  {imageMeta.name}
                </h3>
                <p className="text-[11px] text-gray-500">
                  Original: {imageMeta.naturalWidth} × {imageMeta.naturalHeight} px • {formatBytes(imageMeta.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#9AA3C8] hover:border-[#414FA8] bg-white hover:bg-[#EEF1FB] text-[#414FA8] text-xs font-semibold transition-colors"
              >
                <FilePlus className="h-3.5 w-3.5" />
                <span>Change Image</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                onChange={(e) => e.target.files?.[0] && loadImage(e.target.files[0])}
                className="sr-only"
              />

              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          {/* Aspect Ratio & Settings Toolbar */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Aspect Ratio Presets:
              </span>
              <div className="text-xs font-semibold text-[#414FA8]">
                Crop Size: {pixelCrop.width} × {pixelCrop.height} px
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'free', label: 'Freeform', icon: Maximize2 },
                { id: '1:1', label: '1:1 Square (Instagram / DP)', icon: Square },
                { id: '4:3', label: '4:3 Standard Photo', icon: Square },
                { id: '16:9', label: '16:9 Widescreen (YouTube)', icon: Square },
                { id: '3:2', label: '3:2 Classic Photo', icon: Square },
                { id: '3.5:4.5', label: '3.5:4.5 (Passport / Official ID)', icon: Smartphone },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => applyAspectRatio(opt.id as AspectRatioOption)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded border transition-colors ${
                    aspectRatio === opt.id
                      ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold shadow-xs'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <opt.icon className="h-3 w-3" />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>

            {/* Format & Quality */}
            <div className="pt-2 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Output Format:
                </label>
                <select
                  value={outputFormat}
                  onChange={(e) => {
                    setOutputFormat(e.target.value as any);
                    setCroppedUrl(null);
                  }}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded bg-white text-gray-800"
                >
                  <option value="original">Keep Original Format</option>
                  <option value="jpeg">Convert to JPG/JPEG</option>
                  <option value="png">Convert to PNG</option>
                  <option value="webp">Convert to WebP</option>
                </select>
              </div>

              {outputFormat !== 'png' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-gray-700">JPEG/WebP Quality:</label>
                    <span className="text-xs font-bold text-[#414FA8]">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={quality}
                    onChange={(e) => {
                      setQuality(Number(e.target.value));
                      setCroppedUrl(null);
                    }}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#414FA8]"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Interactive Crop Canvas Viewport */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Crop Area (Drag to move or drag corners to resize)
              </span>
              <button
                type="button"
                onClick={() => setCropBox({ x: 10, y: 10, width: 80, height: 80 })}
                className="text-xs text-[#414FA8] hover:underline font-medium"
              >
                Reset Crop Box
              </button>
            </div>

            <div className="flex justify-center bg-[#1E202A] p-2 sm:p-4 rounded overflow-hidden select-none">
              <div
                ref={containerRef}
                className="relative inline-block max-w-full max-h-[500px]"
                style={{ touchAction: 'none' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageMeta.previewUrl}
                  alt={imageMeta.name}
                  className="max-h-[500px] w-auto object-contain block pointer-events-none"
                />

                {/* Shading overlay */}
                <div className="absolute inset-0 bg-black/50 pointer-events-none" />

                {/* Interactive Crop Box */}
                <div
                  onPointerDown={(e) => handlePointerDown('move', e)}
                  style={{
                    left: `${cropBox.x}%`,
                    top: `${cropBox.y}%`,
                    width: `${cropBox.width}%`,
                    height: `${cropBox.height}%`,
                  }}
                  className="absolute border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] cursor-move transition-[box-shadow]"
                >
                  {/* Grid 3x3 rule of thirds */}
                  <div className="w-full h-full grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-white" />
                    <div className="border-r border-white" />
                    <div />
                  </div>

                  {/* Corner handles */}
                  <div
                    onPointerDown={(e) => handlePointerDown('nw', e)}
                    className="absolute -top-2 -left-2 w-4 h-4 bg-white border-2 border-[#414FA8] rounded-full cursor-nwse-resize z-20"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown('ne', e)}
                    className="absolute -top-2 -right-2 w-4 h-4 bg-white border-2 border-[#414FA8] rounded-full cursor-nesw-resize z-20"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown('sw', e)}
                    className="absolute -bottom-2 -left-2 w-4 h-4 bg-white border-2 border-[#414FA8] rounded-full cursor-nesw-resize z-20"
                  />
                  <div
                    onPointerDown={(e) => handlePointerDown('se', e)}
                    className="absolute -bottom-2 -right-2 w-4 h-4 bg-white border-2 border-[#414FA8] rounded-full cursor-nwse-resize z-20"
                  />
                </div>
              </div>
            </div>

            {/* Action Trigger Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handlePerformCrop}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Cropping image...</span>
                  </>
                ) : (
                  <>
                    <CropIcon className="h-4 w-4 text-amber-300" />
                    <span>Crop to {pixelCrop.width} × {pixelCrop.height} px</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Card */}
          {croppedBlob && croppedUrl && croppedDims && (
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">
                      Image Cropped Successfully!
                    </h3>
                    <p className="text-xs text-gray-500">
                      New dimensions: {croppedDims.width} × {croppedDims.height} px • File size: {formatBytes(croppedBlob.size)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold text-[#414FA8] bg-[#EEF1FB] border border-[#9AA3C8]/40 rounded-full">
                    {croppedDims.width} × {croppedDims.height} px
                  </span>
                </div>
              </div>

              {/* Preview of cropped image */}
              <div className="flex justify-center p-3 bg-[#FAFAFC] border border-gray-200 rounded">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={croppedUrl}
                  alt="Cropped output"
                  className="max-h-60 max-w-full object-contain rounded shadow-xs"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Cropped Image</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCroppedUrl(null);
                    setCroppedBlob(null);
                  }}
                  className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
                >
                  Adjust Crop
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Zero server uploads. High-precision canvas crop rendered locally.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
