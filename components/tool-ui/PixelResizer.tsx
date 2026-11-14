'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DropzoneUpload } from './DropzoneUpload';
import { ImagePreviewCard, type ImageMetadata } from './ImagePreviewCard';
import { formatBytes, sanitizeFilename, getExtensionFromMime, consumeCachedHeroImage } from '@/lib/format-utils';
import { padJpegBlob } from '@/lib/image-padding';
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
  Printer,
  HardDrive,
  Ruler,
} from 'lucide-react';

type DimensionUnit = 'px' | 'cm' | 'mm' | 'in';

interface ResizeResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
  filename: string;
  dpi: number;
  unitLabel: string;
}

interface PresetItem {
  label: string;
  desc: string;
  unit: DimensionUnit;
  wInput: number;
  hInput: number;
  dpi: number;
  targetKb?: number;
}

const PRESETS: PresetItem[] = [
  { label: '3.5 × 4.5 cm', desc: 'Passport (300 DPI)', unit: 'cm', wInput: 3.5, hInput: 4.5, dpi: 300, targetKb: 50 },
  { label: '3.5 × 4.5 cm (200 DPI)', desc: 'SSC / Exam (276×354 px)', unit: 'cm', wInput: 3.5, hInput: 4.5, dpi: 200, targetKb: 50 },
  { label: '140 × 60 px', desc: 'IBPS / SSC Sign (20KB)', unit: 'px', wInput: 140, hInput: 60, dpi: 200, targetKb: 18 },
  { label: '50 × 20 mm', desc: 'RRB / Bank Sign', unit: 'mm', wInput: 50, hInput: 20, dpi: 200, targetKb: 25 },
  { label: '213 × 213 px', desc: 'NSDL PAN Photo (300 DPI)', unit: 'px', wInput: 213, hInput: 213, dpi: 300, targetKb: 30 },
  { label: '4 × 6 inch', desc: 'NEET Postcard (1200×1800)', unit: 'in', wInput: 4, hInput: 6, dpi: 300, targetKb: 150 },
  { label: '1280 × 720 px', desc: 'HD 720p Standard', unit: 'px', wInput: 1280, hInput: 720, dpi: 72 },
  { label: '1920 × 1080 px', desc: 'Full HD 1080p', unit: 'px', wInput: 1920, hInput: 1080, dpi: 72 },
];

const DPI_OPTIONS = [72, 150, 200, 300, 600];
const KB_PRESETS = [15, 20, 30, 50, 100, 200];

/**
 * Injects horizontal and vertical DPI density into a JPEG JFIF APP0 header (0xFF 0xE0)
 */
async function injectJpegDpiHeader(blob: Blob, dpi: number): Promise<Blob> {
  if (blob.type !== 'image/jpeg') return blob;
  try {
    const buf = await blob.arrayBuffer();
    const bytes = new Uint8Array(buf);
    if (bytes.length < 20 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
      return blob;
    }

    // Look for JFIF APP0 marker (0xFF 0xE0)
    let offset = 2;
    while (offset + 4 < bytes.length) {
      if (bytes[offset] !== 0xff) break;
      const marker = bytes[offset + 1];
      const segLen = (bytes[offset + 2] << 8) | bytes[offset + 3];
      if (
        marker === 0xe0 &&
        offset + 16 < bytes.length &&
        bytes[offset + 4] === 0x4a && // 'J'
        bytes[offset + 5] === 0x46 && // 'F'
        bytes[offset + 6] === 0x49 && // 'I'
        bytes[offset + 7] === 0x46 && // 'F'
        bytes[offset + 8] === 0x00
      ) {
        const out = new Uint8Array(bytes);
        out[offset + 11] = 1; // 1 = dots per inch (DPI)
        out[offset + 12] = (dpi >> 8) & 0xff;
        out[offset + 13] = dpi & 0xff;
        out[offset + 14] = (dpi >> 8) & 0xff;
        out[offset + 15] = dpi & 0xff;
        return new Blob([out], { type: 'image/jpeg' });
      }
      offset += 2 + segLen;
    }
    return blob;
  } catch {
    return blob;
  }
}

function unitToPixels(val: number, unit: DimensionUnit, dpi: number): number {
  if (!val || val <= 0) return 1;
  if (unit === 'px') return Math.round(val);
  if (unit === 'in') return Math.max(1, Math.round(val * dpi));
  if (unit === 'cm') return Math.max(1, Math.round((val / 2.54) * dpi));
  if (unit === 'mm') return Math.max(1, Math.round((val / 25.4) * dpi));
  return Math.round(val);
}

function pixelsToUnit(px: number, unit: DimensionUnit, dpi: number): number {
  if (unit === 'px') return Math.round(px);
  if (unit === 'in') return Number((px / dpi).toFixed(2));
  if (unit === 'cm') return Number(((px / dpi) * 2.54).toFixed(2));
  if (unit === 'mm') return Number(((px / dpi) * 25.4).toFixed(1));
  return Math.round(px);
}

export function PixelResizer({ customTitle }: { customTitle?: string; showSeoContent?: boolean }) {
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);
  const [unit, setUnit] = useState<DimensionUnit>('px');
  const [dpi, setDpi] = useState<number>(200);
  const [widthInput, setWidthInput] = useState<number>(800);
  const [heightInput, setHeightInput] = useState<number>(600);
  const [targetWidth, setTargetWidth] = useState<number>(800);
  const [targetHeight, setTargetHeight] = useState<number>(600);
  const [lockAspectRatio, setLockAspectRatio] = useState<boolean>(true);
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [allowUpscale, setAllowUpscale] = useState<boolean>(true);
  const [outputFormat, setOutputFormat] = useState<'original' | 'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState<number>(88);
  const [enableTargetKb, setEnableTargetKb] = useState<boolean>(false);
  const [targetKb, setTargetKb] = useState<number>(50);
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

  const handleFileSelect = useCallback((file: File) => {
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
      setUnit('px');
      setWidthInput(origW);
      setHeightInput(origH);
      setTargetWidth(origW);
      setTargetHeight(origH);
    };

    img.onerror = () => {
      setErrorMsg('Failed to read image. File may be corrupted.');
    };

    img.src = url;
  }, [registerUrl]);

  // Consume cached image from homepage quick dropzone if available
  useEffect(() => {
    consumeCachedHeroImage().then((file) => {
      if (file) {
        handleFileSelect(file);
      }
    });
  }, [handleFileSelect]);

  const handleReset = () => {
    cleanupUrls();
    setSelectedImage(null);
    setResult(null);
    setErrorMsg(null);
    setLockAspectRatio(true);
    setAllowUpscale(true);
  };

  // Switch between px, cm, mm, in seamlessly
  const handleUnitChange = (newUnit: DimensionUnit) => {
    setUnit(newUnit);
    const convertedW = pixelsToUnit(targetWidth, newUnit, dpi);
    const convertedH = pixelsToUnit(targetHeight, newUnit, dpi);
    setWidthInput(convertedW);
    setHeightInput(convertedH);
  };

  // Change DPI and recalculate pixels when in physical unit mode (cm/mm/in)
  const handleDpiChange = (newDpi: number) => {
    setDpi(newDpi);
    if (unit !== 'px') {
      const newPxW = Math.min(10000, unitToPixels(widthInput, unit, newDpi));
      const newPxH = Math.min(10000, unitToPixels(heightInput, unit, newDpi));
      setTargetWidth(newPxW);
      setTargetHeight(newPxH);
    }
  };

  // Width change handler with aspect ratio lock
  const handleWidthChange = (rawVal: number) => {
    const val = Math.max(0.1, rawVal || 0);
    setWidthInput(val);
    const pxW = Math.min(10000, unitToPixels(val, unit, dpi));
    setTargetWidth(pxW);

    if (lockAspectRatio && aspectRatio > 0) {
      const pxH = Math.max(1, Math.round(pxW / aspectRatio));
      setTargetHeight(pxH);
      setHeightInput(pixelsToUnit(pxH, unit, dpi));
    }
  };

  // Height change handler with aspect ratio lock
  const handleHeightChange = (rawVal: number) => {
    const val = Math.max(0.1, rawVal || 0);
    setHeightInput(val);
    const pxH = Math.min(10000, unitToPixels(val, unit, dpi));
    setTargetHeight(pxH);

    if (lockAspectRatio && aspectRatio > 0) {
      const pxW = Math.max(1, Math.round(pxH * aspectRatio));
      setTargetWidth(pxW);
      setWidthInput(pixelsToUnit(pxW, unit, dpi));
    }
  };

  // Apply preset dimensions (unlocks aspect ratio for exact exam dimensions)
  const handleApplyPreset = (preset: PresetItem) => {
    setLockAspectRatio(false);
    setAllowUpscale(true);
    setUnit(preset.unit);
    setDpi(preset.dpi);
    setWidthInput(preset.wInput);
    setHeightInput(preset.hInput);

    const pxW = unitToPixels(preset.wInput, preset.unit, preset.dpi);
    const pxH = unitToPixels(preset.hInput, preset.unit, preset.dpi);
    setTargetWidth(pxW);
    setTargetHeight(pxH);

    if (preset.targetKb) {
      setEnableTargetKb(true);
      setTargetKb(preset.targetKb);
      setOutputFormat('image/jpeg');
    }
  };

  // Reset to original dimensions
  const handleResetToOriginal = () => {
    if (!selectedImage) return;
    setUnit('px');
    setWidthInput(selectedImage.width);
    setHeightInput(selectedImage.height);
    setTargetWidth(selectedImage.width);
    setTargetHeight(selectedImage.height);
    setLockAspectRatio(true);
  };

  // Canvas Resize + DPI + Target KB Execution
  const handleResize = async () => {
    if (!selectedImage) return;

    if (targetWidth <= 0 || targetHeight <= 0) {
      setErrorMsg('Width and Height must be positive numbers greater than 0.');
      return;
    }

    if (targetWidth > 10000 || targetHeight > 10000) {
      setErrorMsg('Maximum allowed dimension is 10,000 pixels.');
      return;
    }

    const isUpscaling = targetWidth > selectedImage.width || targetHeight > selectedImage.height;
    if (isUpscaling && !allowUpscale) {
      setErrorMsg(
        `Requested dimensions (${targetWidth}×${targetHeight} px) are larger than the original image (${selectedImage.width}×${selectedImage.height} px). Enable "Allow Upscaling" below to proceed.`
      );
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    await new Promise((r) => setTimeout(r, 50));

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

      // If Target KB Lock is active, force JPEG so binary search + padding works reliably
      const targetMime = enableTargetKb
        ? 'image/jpeg'
        : outputFormat === 'original'
        ? selectedImage.type
        : outputFormat;

      if (targetMime === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const canvasToBlobAsync = (mime: string, q: number) =>
        new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), mime, q));

      let finalBlob: Blob | null = null;

      if (enableTargetKb && targetKb > 0) {
        const maxBytes = targetKb * 1024;
        const minDesiredBytes = Math.max(4096, Math.floor(maxBytes * 0.88));

        let low = 0.05;
        let high = 0.98;
        let bestBlob: Blob | null = null;

        for (let i = 0; i < 8; i++) {
          const mid = (low + high) / 2;
          const candidate = await canvasToBlobAsync('image/jpeg', mid);
          if (!candidate) break;
          if (candidate.size <= maxBytes) {
            bestBlob = candidate;
            low = mid;
          } else {
            high = mid;
          }
        }

        if (!bestBlob) {
          bestBlob = await canvasToBlobAsync('image/jpeg', 0.05);
        }

        if (bestBlob && bestBlob.size < minDesiredBytes) {
          bestBlob = await padJpegBlob(bestBlob, minDesiredBytes);
        }

        finalBlob = bestBlob;
      } else {
        const qualityParam = Math.max(0.05, Math.min(1, quality / 100));
        finalBlob = await canvasToBlobAsync(targetMime, qualityParam);
      }

      if (!finalBlob) {
        setIsProcessing(false);
        setErrorMsg('Could not export resized image blob.');
        return;
      }

      // Embed physical DPI into JFIF header if JPEG
      if (targetMime === 'image/jpeg') {
        finalBlob = await injectJpegDpiHeader(finalBlob, dpi);
      }

      const resultUrl = registerUrl(URL.createObjectURL(finalBlob));
      const ext = getExtensionFromMime(targetMime, selectedImage.name);
      const baseName = selectedImage.name.replace(/\.[^.]+$/, '');
      const filename = sanitizeFilename(`${baseName}_${targetWidth}x${targetHeight}_${dpi}dpi`, ext);

      const unitSummary =
        unit === 'px'
          ? `${targetWidth} × ${targetHeight} px`
          : `${widthInput} × ${heightInput} ${unit} (${targetWidth} × ${targetHeight} px @ ${dpi} DPI)`;

      setIsProcessing(false);
      setResult({
        blob: finalBlob,
        url: resultUrl,
        width: targetWidth,
        height: targetHeight,
        size: finalBlob.size,
        format: targetMime,
        filename,
        dpi,
        unitLabel: unitSummary,
      });
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

      {/* 2. Configure Dimensions, Unit, DPI & Target KB */}
      {selectedImage && !result && (
        <div className="space-y-4">
          <ImagePreviewCard image={selectedImage} onReset={handleReset} />

          <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <Maximize2 className="h-4 w-4 text-[#414FA8]" />
                <h3 className="text-sm font-bold text-gray-900">
                  {customTitle || 'Resize by Pixels, CM, MM or Inches + DPI & KB'}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleResetToOriginal}
                className="text-xs text-[#414FA8] hover:underline flex items-center gap-1 font-medium"
              >
                <RotateCcw className="h-3 w-3" /> Reset to Original ({selectedImage.width}×{selectedImage.height})
              </button>
            </div>

            {/* Unit Switcher + DPI Selector Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#F8FAFF] p-3 rounded-[4px] border border-[#9AA3C8]/40">
              {/* Unit Tabs */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Ruler className="h-3.5 w-3.5 text-[#414FA8]" /> Measurement Unit:
                </label>
                <div className="grid grid-cols-4 gap-1 bg-white p-1 rounded border border-gray-200">
                  {(
                    [
                      { id: 'px', label: 'Pixels (px)' },
                      { id: 'cm', label: 'CM' },
                      { id: 'mm', label: 'MM' },
                      { id: 'in', label: 'Inches' },
                    ] as const
                  ).map((u) => (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => handleUnitChange(u.id)}
                      className={`py-1.5 px-2 rounded text-xs font-bold transition-colors ${
                        unit === u.id
                          ? 'bg-[#414FA8] text-white shadow-2xs'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {u.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Print / Scan DPI Selector */}
              <div>
                <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
                  <Printer className="h-3.5 w-3.5 text-[#414FA8]" /> Scan / Print Resolution (DPI):
                </label>
                <div className="grid grid-cols-5 gap-1 bg-white p-1 rounded border border-gray-200">
                  {DPI_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => handleDpiChange(d)}
                      className={`py-1.5 px-1.5 rounded text-xs font-bold tabular-nums transition-colors ${
                        dpi === d
                          ? 'bg-[#414FA8] text-white shadow-2xs'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Width, Lock, Height Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              {/* Width Input */}
              <div className="sm:col-span-5 space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="target-width" className="text-xs font-semibold text-gray-700">
                    Width ({unit.toUpperCase()}):
                  </label>
                  {unit !== 'px' && (
                    <span className="text-[11px] font-mono text-[#414FA8] font-semibold tabular-nums">
                      = {targetWidth} px
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="target-width"
                    type="number"
                    step={unit === 'px' ? '1' : '0.1'}
                    min="0.1"
                    max="10000"
                    value={widthInput}
                    onChange={(e) => handleWidthChange(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-[#9AA3C8] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#414FA8] font-mono font-medium text-gray-900 tabular-nums"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-semibold">
                    {unit}
                  </span>
                </div>
              </div>

              {/* Aspect Ratio Lock Button */}
              <div className="sm:col-span-2 flex flex-col items-center justify-center pt-2 sm:pt-5">
                <button
                  type="button"
                  onClick={() => setLockAspectRatio(!lockAspectRatio)}
                  className={`p-2.5 rounded-[4px] border transition-colors flex items-center justify-center gap-1.5 w-full text-xs font-medium ${
                    lockAspectRatio
                      ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8]'
                      : 'border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                  title={lockAspectRatio ? 'Aspect Ratio Locked' : 'Unlocked (Custom Exact Width & Height)'}
                >
                  {lockAspectRatio ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                  <span className="sm:hidden">{lockAspectRatio ? 'Ratio Locked' : 'Free Ratio'}</span>
                </button>
                <span className="text-[10px] text-gray-400 mt-1 hidden sm:block">
                  {lockAspectRatio ? 'Locked' : 'Custom'}
                </span>
              </div>

              {/* Height Input */}
              <div className="sm:col-span-5 space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="target-height" className="text-xs font-semibold text-gray-700">
                    Height ({unit.toUpperCase()}):
                  </label>
                  {unit !== 'px' && (
                    <span className="text-[11px] font-mono text-[#414FA8] font-semibold tabular-nums">
                      = {targetHeight} px
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="target-height"
                    type="number"
                    step={unit === 'px' ? '1' : '0.1'}
                    min="0.1"
                    max="10000"
                    value={heightInput}
                    onChange={(e) => handleHeightChange(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-xs sm:text-sm border border-[#9AA3C8] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#414FA8] font-mono font-medium text-gray-900 tabular-nums"
                  />
                  <span className="absolute right-3 top-2.5 text-xs text-gray-400 font-semibold">
                    {unit}
                  </span>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="text-xs font-semibold text-gray-700 block">
                Indian Exam, Passport &amp; HD Resolution Presets (1-Click Setup):
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESETS.map((p) => {
                  const pPxW = unitToPixels(p.wInput, p.unit, p.dpi);
                  const pPxH = unitToPixels(p.hInput, p.unit, p.dpi);
                  const isMatch = targetWidth === pPxW && targetHeight === pPxH && dpi === p.dpi;
                  return (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => handleApplyPreset(p)}
                      className={`p-2 rounded-[4px] border text-left transition-all text-xs ${
                        isMatch
                          ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold ring-1 ring-[#414FA8]/30'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-[#9AA3C8] hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-semibold tabular-nums">{p.label}</div>
                      <div className="text-[10px] text-gray-500 font-normal truncate">{p.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target File Size (KB Lock) */}
            <div className="p-3.5 rounded-[4px] border border-emerald-200 bg-emerald-50/50 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableTargetKb}
                    onChange={(e) => setEnableTargetKb(e.target.checked)}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-600 border-gray-300"
                  />
                  <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <HardDrive className="h-3.5 w-3.5 text-emerald-700" />
                    Lock Exact Target File Size in KB (For SSC, UPSC, Bank &amp; PAN Portals)
                  </span>
                </label>
                {enableTargetKb && (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded tabular-nums">
                    Target: ≤ {targetKb} KB
                  </span>
                )}
              </div>

              {enableTargetKb && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="flex flex-wrap gap-1.5">
                    {KB_PRESETS.map((kb) => (
                      <button
                        key={kb}
                        type="button"
                        onClick={() => setTargetKb(kb)}
                        className={`px-2.5 py-1 rounded text-xs font-bold tabular-nums border transition-colors ${
                          targetKb === kb
                            ? 'bg-emerald-700 text-white border-emerald-700'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-emerald-500'
                        }`}
                      >
                        {kb} KB
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-1.5 ml-auto">
                    <span className="text-xs text-gray-600 font-medium">Custom KB:</span>
                    <input
                      type="number"
                      min="5"
                      max="2000"
                      value={targetKb}
                      onChange={(e) => setTargetKb(Math.max(5, parseInt(e.target.value) || 20))}
                      className="w-20 px-2 py-1 text-xs font-mono font-bold border border-emerald-400 rounded bg-white text-gray-900 tabular-nums"
                    />
                    <span className="text-xs text-gray-500 font-semibold">KB</span>
                  </div>
                </div>
              )}
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
                <strong>Allow Upscaling</strong> (Permits enlarging beyond {selectedImage.width}×{selectedImage.height} px original resolution).
              </label>
            </div>

            {isUpscalingNow && !allowUpscale && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded flex items-center gap-2">
                <Info className="h-4 w-4 shrink-0 text-amber-600" />
                <span>You are enlarging the image. Check &ldquo;Allow Upscaling&rdquo; above to proceed.</span>
              </div>
            )}

            {/* Output Format & Quality (when KB lock is not overriding) */}
            {!enableTargetKb && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">
                    Output Format:
                  </label>
                  <select
                    value={outputFormat}
                    onChange={(e) => setOutputFormat(e.target.value as typeof outputFormat)}
                    className="w-full px-3 py-2 text-xs border border-gray-300 rounded-[4px] bg-white text-gray-800"
                  >
                    <option value="image/jpeg">JPG / JPEG (Embeds {dpi} DPI Header)</option>
                    <option value="original">Original Format ({selectedImage.type.replace('image/', '').toUpperCase()})</option>
                    <option value="image/png">PNG (Preserves Transparency)</option>
                    <option value="image/webp">WebP (Modern Web)</option>
                  </select>
                </div>

                {outputFormat !== 'image/png' && (
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                      <span>Quality:</span>
                      <span className="text-[#414FA8] tabular-nums">{quality}%</span>
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
            )}

            {/* Action button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleResize}
                disabled={isProcessing || (isUpscalingNow && !allowUpscale)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed tabular-nums"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Resizing &amp; Calibrating {dpi} DPI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>
                      Resize to {targetWidth} × {targetHeight} px ({dpi} DPI)
                      {enableTargetKb ? ` • Under ${targetKb} KB` : ''}
                    </span>
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
                  Image Resized &amp; Calibrated Successfully!
                </h3>
                <p className="text-xs text-gray-500 tabular-nums">
                  {result.unitLabel} • {formatBytes(result.size)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <span className="px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full tabular-nums">
                {result.width} × {result.height} px
              </span>
              <span className="px-2.5 py-1 text-xs font-bold text-[#414FA8] bg-[#EEF1FB] border border-[#9AA3C8]/50 rounded-full tabular-nums">
                {result.dpi} DPI
              </span>
            </div>
          </div>

          {/* Comparison Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F9FAFB] p-3.5 rounded-[4px] border border-gray-200 text-center tabular-nums">
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
              <span className="block text-[11px] text-gray-500 font-medium">Resolution Density</span>
              <span className="text-xs sm:text-sm font-bold text-gray-800">
                {result.dpi} DPI
              </span>
            </div>

            <div className="p-2">
              <span className="block text-[11px] text-emerald-700 font-medium">Final File Size</span>
              <span className="text-xs sm:text-sm font-bold text-emerald-700">
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
            <span className="inline-block mt-2 text-[11px] text-gray-500 font-medium tabular-nums">
              Output: {result.width} × {result.height} px • {result.dpi} DPI • {formatBytes(result.size)}
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
              <span>Download Resized Image ({formatBytes(result.size)})</span>
            </button>

            <button
              type="button"
              onClick={() => setResult(null)}
              className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-[#9AA3C8] bg-white hover:bg-[#EEF1FB] hover:border-[#414FA8] text-[#414FA8] text-xs font-semibold transition-colors"
            >
              Adjust Dimensions / KB
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
            <span>Resizing &amp; {result.dpi} DPI JFIF calibration executed 100% locally in your browser.</span>
          </div>
        </div>
      )}
    </div>
  );
}
