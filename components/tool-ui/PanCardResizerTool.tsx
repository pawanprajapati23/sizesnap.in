'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
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
  Layers,
  Sparkles,
  Camera,
  PenTool,
  Sliders,
} from 'lucide-react';
import { formatBytes } from '@/lib/format-utils';
import { trackProcessingSuccess, trackDownload } from '@/lib/firebase';

type PanMode = 'photo' | 'signature';

interface PanPreset {
  mode: PanMode;
  label: string;
  width: number;
  height: number;
  maxKb: number;
  recommendedKb: number;
  dpi: number;
  description: string;
}

const PAN_PRESETS: Record<PanMode, PanPreset> = {
  photo: {
    mode: 'photo',
    label: 'PAN Card Photo',
    width: 213,
    height: 213,
    maxKb: 50,
    recommendedKb: 30,
    dpi: 300,
    description: 'Exact 213 × 213 px (3.5 × 2.5 cm), 300 DPI, under 50KB for NSDL & UTIITSL',
  },
  signature: {
    mode: 'signature',
    label: 'PAN Card Signature',
    width: 400,
    height: 213,
    maxKb: 30,
    recommendedKb: 20,
    dpi: 300,
    description: 'Exact 400 × 213 px (2 × 4.5 cm), 300 DPI, under 30KB for NSDL & UTIITSL',
  },
};

interface ProcessedPanResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  filename: string;
  isWithinLimit: boolean;
}

export function PanCardResizerTool() {
  const [mode, setMode] = useState<PanMode>('photo');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [customKb, setCustomKb] = useState<number>(30);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<ProcessedPanResult | null>(null);
  const [zoom, setZoom] = useState<number>(100);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastActivityIdRef = useRef<string | null>(null);

  const activePreset = PAN_PRESETS[mode];

  // Update target KB when mode changes
  const handleModeChange = (newMode: PanMode) => {
    setMode(newMode);
    setCustomKb(PAN_PRESETS[newMode].recommendedKb);
    setResult(null);
  };

  // Handle file selection
  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WebP).');
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

  // Process and resize image to exact NSDL / UTI specs
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

      const targetW = activePreset.width;
      const targetH = activePreset.height;

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d')!;

      // Fill clean background (White for passport/signature)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);

      // Apply zoom & center-fit
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

      // Binary search quality to hit target KB (under activePreset.maxKb)
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

      if (!bestBlob) {
        throw new Error('Image generation failed');
      }

      const url = URL.createObjectURL(bestBlob);
      const filename =
        mode === 'photo'
          ? 'pan_card_photo_213x213.jpg'
          : 'pan_card_signature_400x213.jpg';

      setResult({
        blob: bestBlob,
        url,
        width: targetW,
        height: targetH,
        size: bestBlob.size,
        filename,
        isWithinLimit: bestBlob.size <= activePreset.maxKb * 1024,
      });

      // Track PAN card resizing telemetry
      trackProcessingSuccess({
        tool: 'pan-card-photo-resizer',
        toolName: `PAN Card ${mode === 'photo' ? 'Photo' : 'Signature'} Resizer`,
        fileType: 'image',
        inputKb: selectedFile ? Math.round(selectedFile.size / 1024) : 0,
        outputKb: Math.round(bestBlob.size / 1024),
        targetKb: customKb || activePreset.maxKb,
      }).then((id) => {
        if (id) lastActivityIdRef.current = id;
      }).catch(() => {});
    } catch (err) {
      console.error('PAN Card Resizing error:', err);
    } finally {
      setProcessing(false);
    }
  }, [imageSrc, activePreset, customKb, zoom, mode, selectedFile]);

  useEffect(() => {
    if (imageSrc) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      processImage();
    }
  }, [imageSrc, mode, customKb, zoom, processImage]);

  const handleDownload = () => {
    if (!result) return;
    trackDownload('pan-card-photo-resizer', lastActivityIdRef.current || undefined);
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetTool = () => {
    setSelectedFile(null);
    setImageSrc(null);
    setResult(null);
    setZoom(100);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-[4px] border border-gray-200 shadow-xs overflow-hidden">
      {/* Mode Selector Tabs */}
      <div className="grid grid-cols-2 border-b border-gray-200 bg-gray-50/70">
        <button
          type="button"
          onClick={() => handleModeChange('photo')}
          className={`flex items-center justify-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-semibold transition-colors border-b-2 ${
            mode === 'photo'
              ? 'border-[#414FA8] bg-white text-[#414FA8] shadow-2xs'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>1. PAN Card Photo (213 × 213)</span>
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('signature')}
          className={`flex items-center justify-center gap-2 py-3.5 px-4 text-xs sm:text-sm font-semibold transition-colors border-b-2 ${
            mode === 'signature'
              ? 'border-[#414FA8] bg-white text-[#414FA8] shadow-2xs'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>2. PAN Card Signature (400 × 213)</span>
        </button>
      </div>

      <div className="p-5 sm:p-7 space-y-6">
        {/* Specification Alert Banner */}
        <div className="p-3.5 rounded-[4px] bg-[#EEF1FB] border border-[#414FA8]/20 flex items-start gap-3 text-xs text-gray-700">
          <Info className="w-4 h-4 text-[#414FA8] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-gray-900 block mb-0.5">
              Official NSDL &amp; UTIITSL Specification Active:
            </span>
            <span>{activePreset.description}. Guaranteed 100% portal acceptance.</span>
          </div>
        </div>

        {/* Upload Dropzone */}
        {!imageSrc ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-gray-300 hover:border-[#414FA8] rounded-[4px] p-8 sm:p-12 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-[#F2F4FC]/40 group"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <div className="w-14 h-14 mx-auto mb-3.5 rounded-full bg-white border border-gray-200 group-hover:border-[#414FA8]/30 flex items-center justify-center text-[#414FA8] shadow-xs transition-transform group-hover:scale-105">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-gray-800 mb-1">
              Select or Drop your {activePreset.label} Here
            </p>
            <p className="text-xs text-gray-500 mb-3">
              Supports JPG, PNG, WEBP • Automatically scales to exact {activePreset.width} × {activePreset.height} px
            </p>
            <button
              type="button"
              className="px-4 py-2 bg-[#414FA8] hover:bg-[#343F89] text-white text-xs font-semibold rounded-[4px] shadow-xs transition-colors"
            >
              Choose Photo
            </button>
          </div>
        ) : (
          /* Controls & Live Preview */
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Preview Box */}
              <div className="bg-gray-50 p-4 rounded-[4px] border border-gray-200 flex flex-col items-center justify-center min-h-[260px] relative">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Live Scaled Preview ({activePreset.width} × {activePreset.height} px)
                </span>
                {result ? (
                  <div
                    className="relative border-2 border-dashed border-[#414FA8]/40 rounded bg-white shadow-sm overflow-hidden flex items-center justify-center"
                    style={{
                      width: mode === 'photo' ? 180 : 260,
                      height: mode === 'photo' ? 180 : 138,
                    }}
                  >
                    <Image
                      src={result.url}
                      alt={activePreset.label}
                      width={activePreset.width}
                      height={activePreset.height}
                      unoptimized
                      className="object-contain max-w-full max-h-full"
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#414FA8]" /> Resizing...
                  </div>
                )}

                {result && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                      <CheckCircle2 className="w-3 h-3" /> {formatBytes(result.size)} (Limit: {activePreset.maxKb} KB)
                    </span>
                    <span className="text-[11px] font-medium text-gray-500">
                      300 DPI
                    </span>
                  </div>
                )}
              </div>

              {/* Adjustments Panel */}
              <div className="space-y-4 bg-white p-4 rounded-[4px] border border-gray-200">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-[#414FA8]" /> Adjust Scale &amp; Target Size
                  </span>
                  <button
                    type="button"
                    onClick={resetTool}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove Image
                  </button>
                </div>

                {/* Target File Size Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-gray-700">Max File Size (KB):</span>
                    <span className="font-bold text-[#414FA8]">{customKb} KB</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max={activePreset.maxKb}
                    value={customKb}
                    onChange={(e) => setCustomKb(Number(e.target.value))}
                    className="w-full accent-[#414FA8] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                    <span>10 KB</span>
                    <span>Max Portal Limit: {activePreset.maxKb} KB</span>
                  </div>
                </div>

                {/* Zoom / Crop Slider */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="font-semibold text-gray-700">Zoom / Crop Alignment:</span>
                    <span className="font-bold text-gray-800">{zoom}%</span>
                  </div>
                  <input
                    type="range"
                    min="80"
                    max="160"
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-[#414FA8] cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                    <span>Fit (80%)</span>
                    <span>Zoom In (160%)</span>
                  </div>
                </div>

                {/* Download Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    disabled={!result || processing}
                    onClick={handleDownload}
                    className="w-full py-3 px-4 bg-[#414FA8] hover:bg-[#343F89] disabled:bg-gray-300 text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download {activePreset.label} ({result ? formatBytes(result.size) : ''})</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
