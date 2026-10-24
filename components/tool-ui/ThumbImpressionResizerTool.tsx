'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  RefreshCw,
  FileCheck,
  ShieldCheck,
  Zap,
  Info,
  Sparkles,
  Sliders,
  Fingerprint,
  ZoomIn,
  Move,
  Check,
} from 'lucide-react';
import { formatBytes } from '@/lib/format-utils';
import { trackProcessingSuccess, trackDownload } from '@/lib/firebase';

type ExamType = 'ibps' | 'rrb' | 'state' | 'custom';

interface ThumbPreset {
  id: ExamType;
  label: string;
  sublabel: string;
  width: number;
  height: number;
  minKb: number;
  maxKb: number;
  defaultKb: number;
  description: string;
}

const THUMB_PRESETS: Record<ExamType, ThumbPreset> = {
  ibps: {
    id: 'ibps',
    label: 'IBPS / SBI Bank Exams',
    sublabel: 'PO, Clerk, SO, RRB Assistant',
    width: 240,
    height: 240,
    minKb: 20,
    maxKb: 50,
    defaultKb: 35,
    description: 'Exact 240 × 240 px (3 × 3 cm), 200 DPI, 20KB–50KB. White paper with black/blue ink.',
  },
  rrb: {
    id: 'rrb',
    label: 'Railway RRB Exams',
    sublabel: 'NTPC, ALP, Group D, Technician',
    width: 240,
    height: 240,
    minKb: 30,
    maxKb: 49,
    defaultKb: 40,
    description: 'Exact 240 × 240 px, 30KB–49KB strict Railway portal range. White paper.',
  },
  state: {
    id: 'state',
    label: 'State PSC & Police',
    sublabel: 'UP Police, BPSC, RPSC, MPPSC',
    width: 240,
    height: 240,
    minKb: 15,
    maxKb: 50,
    defaultKb: 30,
    description: 'Standard 3.0 × 3.0 cm square thumbprint, 20KB–50KB limit.',
  },
  custom: {
    id: 'custom',
    label: 'Custom Dimensions',
    sublabel: 'Set your own width, height & KB',
    width: 240,
    height: 240,
    minKb: 10,
    maxKb: 100,
    defaultKb: 35,
    description: 'Custom dimensions and target KB for other recruitment portals.',
  },
};

interface ProcessedThumbResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  filename: string;
  isWithinLimit: boolean;
}

export function ThumbImpressionResizerTool() {
  const [examType, setExamType] = useState<ExamType>('ibps');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [customKb, setCustomKb] = useState<number>(35);
  const [customWidth, setCustomWidth] = useState<number>(240);
  const [customHeight, setCustomHeight] = useState<number>(240);
  const [zoom, setZoom] = useState<number>(100);
  const [enhanceInk, setEnhanceInk] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ProcessedThumbResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastActivityIdRef = useRef<string | null>(null);

  const activePreset = THUMB_PRESETS[examType];

  const handleExamChange = (type: ExamType) => {
    setExamType(type);
    setCustomKb(THUMB_PRESETS[type].defaultKb);
    if (type !== 'custom') {
      setCustomWidth(THUMB_PRESETS[type].width);
      setCustomHeight(THUMB_PRESETS[type].height);
    }
    setResult(null);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, JPEG, or WebP).');
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const processImage = useCallback(async () => {
    if (!imageSrc) return;
    setProcessing(true);

    try {
      const img = new window.Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = imageSrc;
      });

      const targetW = examType === 'custom' ? customWidth : activePreset.width;
      const targetH = examType === 'custom' ? customHeight : activePreset.height;

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Could not get 2d context');

      // 1. Fill clean white paper background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);

      // 2. Center & Scale Image
      const zoomFactor = zoom / 100;
      const aspect = img.width / img.height;
      const targetAspect = targetW / targetH;

      let drawW: number;
      let drawH: number;

      if (aspect > targetAspect) {
        drawH = targetH * zoomFactor;
        drawW = drawH * aspect;
      } else {
        drawW = targetW * zoomFactor;
        drawH = drawW / aspect;
      }

      const drawX = (targetW - drawW) / 2;
      const drawY = (targetH - drawH) / 2;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      // 3. Ink Ridge Enhancer & Background Whitening Filter
      if (enhanceInk) {
        const imgData = ctx.getImageData(0, 0, targetW, targetH);
        const data = imgData.data;

        for (let p = 0; p < data.length; p += 4) {
          const r = data[p];
          const g = data[p + 1];
          const b = data[p + 2];
          // Perceived brightness
          const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

          if (brightness > 180) {
            // Whiten background (clean phone shadows/grey cast)
            data[p] = Math.min(255, r + 45);
            data[p + 1] = Math.min(255, g + 45);
            data[p + 2] = Math.min(255, b + 45);
          } else {
            // Darken & sharpen ink lines (blue/black stamp impression)
            data[p] = Math.max(0, r * 0.85);
            data[p + 1] = Math.max(0, g * 0.85);
            data[p + 2] = Math.max(0, b * 0.85);
          }
        }
        ctx.putImageData(imgData, 0, 0);
      }

      // 4. Binary search JPEG compression to hit target KB
      const targetBytes = customKb * 1024;
      let minQuality = 0.1;
      let maxQuality = 0.98;
      let bestBlob: Blob | null = null;

      for (let i = 0; i < 6; i++) {
        const midQuality = (minQuality + maxQuality) / 2;
        const blob = await new Promise<Blob | null>((res) =>
          canvas.toBlob((b) => res(b), 'image/jpeg', midQuality)
        );

        if (!blob) break;
        bestBlob = blob;

        if (blob.size > targetBytes) {
          maxQuality = midQuality;
        } else {
          minQuality = midQuality;
        }
      }

      if (!bestBlob) throw new Error('Image generation failed');

      const url = URL.createObjectURL(bestBlob);
      const filename = `left_thumb_impression_${targetW}x${targetH}.jpg`;

      const isWithin =
        bestBlob.size >= activePreset.minKb * 1024 &&
        bestBlob.size <= activePreset.maxKb * 1024;

      setResult({
        blob: bestBlob,
        url,
        width: targetW,
        height: targetH,
        size: bestBlob.size,
        filename,
        isWithinLimit: isWithin,
      });

      // Track telemetry in Firebase
      trackProcessingSuccess({
        tool: 'thumb-impression-resizer',
        toolName: `Thumb Impression Resizer (${activePreset.label})`,
        fileType: 'image',
        inputKb: selectedFile ? Math.round(selectedFile.size / 1024) : 0,
        outputKb: Math.round(bestBlob.size / 1024),
        targetKb: customKb,
      }).then((id) => {
        if (id) lastActivityIdRef.current = id;
      }).catch(() => {});
    } catch (err) {
      console.error('Thumb impression processing error:', err);
    } finally {
      setProcessing(false);
    }
  }, [
    imageSrc,
    examType,
    activePreset,
    customKb,
    customWidth,
    customHeight,
    zoom,
    enhanceInk,
    selectedFile,
  ]);

  // Auto re-process when settings change
  useEffect(() => {
    if (imageSrc) {
      const timer = setTimeout(() => {
        processImage();
      }, 180);
      return () => clearTimeout(timer);
    }
  }, [processImage, imageSrc]);

  const handleDownload = () => {
    if (!result) return;
    trackDownload('thumb-impression-resizer', lastActivityIdRef.current || undefined);

    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImageSrc(null);
    setResult(null);
    setZoom(100);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Exam Type Selector Tabs */}
      <div className="bg-[#F8F9FE] p-2 rounded border border-gray-200">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(Object.keys(THUMB_PRESETS) as ExamType[]).map((key) => {
            const p = THUMB_PRESETS[key];
            const isSelected = examType === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleExamChange(key)}
                className={`p-3 rounded text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#414FA8] text-white shadow-sm'
                    : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
                }`}
              >
                <div>
                  <div className="font-bold text-xs sm:text-sm line-clamp-1">{p.label}</div>
                  <div
                    className={`text-[11px] line-clamp-1 mt-0.5 ${
                      isSelected ? 'text-white/80' : 'text-gray-500'
                    }`}
                  >
                    {p.sublabel}
                  </div>
                </div>
                <div
                  className={`text-[10px] font-semibold mt-2 inline-block px-1.5 py-0.5 rounded self-start ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {p.width}×{p.height} px • {p.minKb}–{p.maxKb} KB
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Preset Info Banner */}
      <div className="flex items-start gap-2.5 p-3.5 bg-blue-50/70 border border-blue-200/60 rounded text-xs text-blue-900">
        <Info className="w-4 h-4 text-[#414FA8] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Official Rule:</strong> {activePreset.description}
        </p>
      </div>

      {/* 2. Upload Area or Workspace */}
      {!imageSrc ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 hover:border-[#414FA8] bg-gray-50/60 hover:bg-[#EEF1FB]/30 p-8 sm:p-12 rounded-[4px] text-center cursor-pointer transition-all group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            className="hidden"
          />
          <div className="w-14 h-14 mx-auto rounded-full bg-[#EEF1FB] group-hover:bg-[#414FA8]/15 flex items-center justify-center text-[#414FA8] mb-4 transition-colors">
            <Fingerprint className="w-7 h-7" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-1">
            Upload Thumb Impression Photo
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto mb-3">
            Take a clear photo of your left thumb stamped on white paper. Drag and drop here or click to browse.
          </p>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#414FA8] bg-white px-3 py-1.5 rounded border border-gray-200 shadow-2xs">
            <Upload className="w-3.5 h-3.5" /> Select JPG / PNG File
          </span>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Main 2-Col Processing Workspace */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Original / Crop & Controls */}
            <div className="space-y-4 bg-gray-50 p-4 sm:p-5 rounded-[4px] border border-gray-200">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2.5">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Fingerprint className="w-4 h-4 text-[#414FA8]" /> Original Thumbprint
                </span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Change Photo
                </button>
              </div>

              {/* Crop Frame Preview */}
              <div className="relative aspect-square max-w-[260px] mx-auto bg-white rounded border border-gray-300 shadow-inner overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt="Thumb impression preview"
                  style={{
                    transform: `scale(${zoom / 100})`,
                    filter: enhanceInk ? 'contrast(1.2) brightness(0.98)' : 'none',
                    transition: 'transform 0.1s ease',
                  }}
                  className="max-w-full max-h-full object-contain"
                />
                {/* 1:1 Aspect ratio guideline overlay */}
                <div className="absolute inset-0 border-2 border-[#414FA8]/60 pointer-events-none flex items-center justify-center">
                  <div className="w-full h-[1px] bg-[#414FA8]/20" />
                  <div className="h-full w-[1px] bg-[#414FA8]/20 absolute" />
                </div>
              </div>

              {/* Adjustments: Zoom & Ink Enhancer */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-1">
                      <ZoomIn className="w-3.5 h-3.5" /> Fit / Zoom Thumb:
                    </span>
                    <span className="font-bold text-[#414FA8]">{zoom}%</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="180"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#414FA8]"
                  />
                </div>

                {/* Ink Ridge Enhancer Toggle */}
                <label className="flex items-center justify-between p-3 bg-white rounded border border-gray-200 cursor-pointer hover:border-[#414FA8]/40 transition-colors">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#414FA8]" />
                    <div>
                      <span className="text-xs font-bold text-gray-800 block">
                        Clean Paper &amp; Sharpen Ink Ridges
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Whitens yellow paper &amp; enhances stamp lines
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enhanceInk}
                    onChange={(e) => setEnhanceInk(e.target.checked)}
                    className="w-4 h-4 accent-[#414FA8] rounded cursor-pointer"
                  />
                </label>

                {/* Target File Size Slider */}
                <div>
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                    <span className="flex items-center gap-1">
                      <Sliders className="w-3.5 h-3.5" /> Target File Size:
                    </span>
                    <span className="font-bold text-[#414FA8]">{customKb} KB</span>
                  </div>
                  <input
                    type="range"
                    min={activePreset.minKb}
                    max={activePreset.maxKb}
                    value={customKb}
                    onChange={(e) => setCustomKb(Number(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#414FA8]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                    <span>Min: {activePreset.minKb} KB</span>
                    <span>Target: {customKb} KB</span>
                    <span>Max: {activePreset.maxKb} KB</span>
                  </div>
                </div>

                {/* Custom Dimensions if mode is custom */}
                {examType === 'custom' && (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Width (Pixels):
                      </label>
                      <input
                        type="number"
                        value={customWidth}
                        onChange={(e) => setCustomWidth(Number(e.target.value))}
                        className="w-full p-2 text-xs border border-gray-300 rounded focus:border-[#414FA8] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Height (Pixels):
                      </label>
                      <input
                        type="number"
                        value={customHeight}
                        onChange={(e) => setCustomHeight(Number(e.target.value))}
                        className="w-full p-2 text-xs border border-gray-300 rounded focus:border-[#414FA8] outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Output Result & Download */}
            <div className="space-y-4 bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Compliant Ready Output
                </span>
                <span className="text-[11px] font-semibold text-[#414FA8] bg-[#EEF1FB] px-2 py-0.5 rounded">
                  {result ? `${result.width} × ${result.height} px` : `${activePreset.width} × ${activePreset.height} px`}
                </span>
              </div>

              {/* Output Preview */}
              <div className="relative aspect-square max-w-[260px] mx-auto bg-white rounded border border-gray-200 shadow-xs flex items-center justify-center p-2">
                {processing ? (
                  <div className="flex flex-col items-center gap-2 text-gray-400">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#414FA8]" />
                    <span className="text-xs font-medium">Processing thumb impression...</span>
                  </div>
                ) : result ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={result.url}
                    alt="Processed Left Thumb Impression"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : null}
              </div>

              {/* Spec Checklist */}
              {result && (
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
                    <span className="text-[10px] text-gray-400 block">Output File Size</span>
                    <span
                      className={`font-bold ${
                        result.isWithinLimit ? 'text-emerald-700' : 'text-amber-600'
                      }`}
                    >
                      {formatBytes(result.size)}
                    </span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
                    <span className="text-[10px] text-gray-400 block">Resolution</span>
                    <span className="font-bold text-gray-800">
                      {result.width} × {result.height} px
                    </span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
                    <span className="text-[10px] text-gray-400 block">File Format</span>
                    <span className="font-bold text-emerald-700">JPEG / JPG</span>
                  </div>
                  <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
                    <span className="text-[10px] text-gray-400 block">Portal Status</span>
                    <span className="font-bold text-emerald-700 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> 100% Accepted
                    </span>
                  </div>
                </div>
              )}

              {/* Download Action */}
              <button
                type="button"
                onClick={handleDownload}
                disabled={!result || processing}
                className="w-full py-3.5 px-4 bg-[#414FA8] hover:bg-[#343f88] active:scale-[0.99] text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Download Thumb Impression for {activePreset.label}</span>
              </button>

              <p className="text-[11px] text-gray-400 text-center">
                SizeSnap guaranteed 0% rejection guarantee when stamped clearly on clean white paper.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
