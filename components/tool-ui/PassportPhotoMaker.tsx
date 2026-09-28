'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DropzoneUpload } from './DropzoneUpload';
import { ImagePreviewCard, type ImageMetadata } from './ImagePreviewCard';
import { formatBytes, sanitizeFilename } from '@/lib/format-utils';
import {
  Crop,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Sparkles,
  Download,
  Printer,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Info,
  ShieldCheck,
  Eye,
  FileText,
  User,
  Sliders,
} from 'lucide-react';

interface PresetSize {
  id: string;
  name: string;
  width: number;
  height: number;
  unit: 'cm' | 'inch' | 'mm';
  description: string;
}

const PRESET_SIZES: PresetSize[] = [
  {
    id: 'in-passport',
    name: '3.5 × 4.5 cm',
    width: 3.5,
    height: 4.5,
    unit: 'cm',
    description: 'Indian Passport, Visa, SSC, UPSC, PAN Card',
  },
  {
    id: 'us-visa',
    name: '2 × 2 inches',
    width: 2.0,
    height: 2.0,
    unit: 'inch',
    description: 'US Visa, OCI Card, 51 × 51 mm Biometric',
  },
  {
    id: 'stamp-size',
    name: '3.5 × 3.5 cm',
    width: 3.5,
    height: 3.5,
    unit: 'cm',
    description: 'Stamp Size / Bank Account / Indian Admit Card',
  },
  {
    id: 'small-icon',
    name: '2 × 2 cm',
    width: 2.0,
    height: 2.0,
    unit: 'cm',
    description: 'Small Identity Icon / Portal Avatar',
  },
];

const DPI_OPTIONS = [150, 200, 300, 600];

export function PassportPhotoMaker() {
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);

  // Dimension settings
  const [selectedPresetId, setSelectedPresetId] = useState<string>('in-passport');
  const [customWidth, setCustomWidth] = useState<number>(3.5);
  const [customHeight, setCustomHeight] = useState<number>(4.5);
  const [unit, setUnit] = useState<'cm' | 'inch' | 'mm'>('cm');
  const [dpi, setDpi] = useState<number>(300);

  // Background replacement
  const [bgChoice, setBgChoice] = useState<'original' | 'white' | 'lightblue'>('original');

  // Interactive Crop & Pan state
  const [zoom, setZoom] = useState<number>(1.0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [showFaceGuide, setShowFaceGuide] = useState<boolean>(true);

  // Dragging interaction state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; initialPanX: number; initialPanY: number }>({
    x: 0,
    y: 0,
    initialPanX: 0,
    initialPanY: 0,
  });

  // Processing state
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Single photo result
  const [singleResult, setSingleResult] = useState<{
    url: string;
    blob: Blob;
    widthPx: number;
    heightPx: number;
    size: number;
    filename: string;
  } | null>(null);

  // A4 sheet result
  const [isGeneratingSheet, setIsGeneratingSheet] = useState<boolean>(false);
  const [sheetResult, setSheetResult] = useState<{
    url: string;
    blob: Blob;
    copiesCount: number;
    size: number;
    filename: string;
  } | null>(null);

  // Memory management
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

  // Calculate current physical size
  const activeWidth =
    selectedPresetId === 'custom'
      ? customWidth
      : PRESET_SIZES.find((p) => p.id === selectedPresetId)?.width || 3.5;

  const activeHeight =
    selectedPresetId === 'custom'
      ? customHeight
      : PRESET_SIZES.find((p) => p.id === selectedPresetId)?.height || 4.5;

  const activeUnit =
    selectedPresetId === 'custom'
      ? unit
      : PRESET_SIZES.find((p) => p.id === selectedPresetId)?.unit || 'cm';

  // Calculate pixel dimensions from physical size & DPI
  const getPixelDimensions = useCallback(() => {
    let wInches = activeWidth;
    let hInches = activeHeight;

    if (activeUnit === 'cm') {
      wInches = activeWidth / 2.54;
      hInches = activeHeight / 2.54;
    } else if (activeUnit === 'mm') {
      wInches = activeWidth / 25.4;
      hInches = activeHeight / 25.4;
    }

    return {
      widthPx: Math.max(20, Math.round(wInches * dpi)),
      heightPx: Math.max(20, Math.round(hInches * dpi)),
    };
  }, [activeWidth, activeHeight, activeUnit, dpi]);

  const { widthPx, heightPx } = getPixelDimensions();
  const targetAspectRatio = widthPx / heightPx;

  // Handle Preset Selection
  const handleSelectPreset = (preset: PresetSize) => {
    setSelectedPresetId(preset.id);
    setCustomWidth(preset.width);
    setCustomHeight(preset.height);
    setUnit(preset.unit);
    setSingleResult(null);
    setSheetResult(null);
  };

  // Upload handler
  const handleFileSelect = (file: File) => {
    setErrorMsg(null);
    setSingleResult(null);
    setSheetResult(null);

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
      // reset transform
      setZoom(1.0);
      setPanX(0);
      setPanY(0);
      setRotation(0);
    };

    img.onerror = () => {
      setErrorMsg('Failed to read image. File may be corrupted.');
    };

    img.src = url;
  };

  const handleResetAll = () => {
    cleanupUrls();
    setSelectedImage(null);
    setSingleResult(null);
    setSheetResult(null);
    setErrorMsg(null);
    setZoom(1.0);
    setPanX(0);
    setPanY(0);
    setRotation(0);
  };

  // Touch and Mouse dragging logic
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: panX,
      initialPanY: panY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPanX(dragStartRef.current.initialPanX + dx);
    setPanY(dragStartRef.current.initialPanY + dy);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        initialPanX: panX,
        initialPanY: panY,
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - dragStartRef.current.x;
    const dy = e.touches[0].clientY - dragStartRef.current.y;
    setPanX(dragStartRef.current.initialPanX + dx);
    setPanY(dragStartRef.current.initialPanY + dy);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Generate Single Cropped Passport Photo
  const handleGeneratePassportPhoto = async () => {
    if (!selectedImage) return;

    setIsProcessing(true);
    setErrorMsg(null);
    await new Promise((r) => setTimeout(r, 60));

    try {
      const img = new Image();
      img.src = selectedImage.previewUrl;
      await new Promise<void>((resolve, reject) => {
        if (img.complete) return resolve();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image.'));
      });

      const canvas = document.createElement('canvas');
      canvas.width = widthPx;
      canvas.height = heightPx;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        setErrorMsg('Canvas 2D context not available.');
        return;
      }

      // Background fill
      if (bgChoice === 'white') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, widthPx, heightPx);
      } else if (bgChoice === 'lightblue') {
        ctx.fillStyle = '#CBE3FB';
        ctx.fillRect(0, 0, widthPx, heightPx);
      } else {
        // Original: if JPEG output, fill white fallback for transparent parts
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, widthPx, heightPx);
      }

      // Base fitting: scale image to cover the canvas at zoom = 1
      const scaleCover = Math.max(widthPx / img.width, heightPx / img.height);
      const effectiveScale = scaleCover * zoom;

      const drawnW = img.width * effectiveScale;
      const drawnH = img.height * effectiveScale;

      // Center + pan offset (pan is mapped proportionally)
      // Preview box is ~300px wide, so scale pan to canvas resolution
      const previewRefWidth = 320;
      const panFactor = widthPx / previewRefWidth;
      const effectivePanX = panX * panFactor;
      const effectivePanY = panY * panFactor;

      const centerX = widthPx / 2 + effectivePanX;
      const centerY = heightPx / 2 + effectivePanY;

      ctx.save();
      ctx.translate(centerX, centerY);
      if (rotation !== 0) {
        ctx.rotate((rotation * Math.PI) / 180);
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, -drawnW / 2, -drawnH / 2, drawnW, drawnH);
      ctx.restore();

      canvas.toBlob(
        (blob) => {
          setIsProcessing(false);
          if (!blob) {
            setErrorMsg('Failed to generate passport photo blob.');
            return;
          }

          const url = registerUrl(URL.createObjectURL(blob));
          const cleanName = selectedImage.name.replace(/\.[^.]+$/, '');
          const filename = sanitizeFilename(
            `passport_${cleanName}_${activeWidth}x${activeHeight}${activeUnit}_${dpi}dpi`,
            'jpg'
          );

          setSingleResult({
            url,
            blob,
            widthPx,
            heightPx,
            size: blob.size,
            filename,
          });
        },
        'image/jpeg',
        0.95
      );
    } catch (err) {
      setIsProcessing(false);
      setErrorMsg(err instanceof Error ? err.message : 'Error generating passport photo.');
    }
  };

  // Generate A4 Multi-Photo Printable Sheet
  const handleGenerateA4Sheet = async () => {
    if (!singleResult) return;

    setIsGeneratingSheet(true);
    await new Promise((r) => setTimeout(r, 60));

    try {
      // Load the generated single passport photo
      const photoImg = new Image();
      photoImg.src = singleResult.url;
      await new Promise<void>((resolve, reject) => {
        if (photoImg.complete) return resolve();
        photoImg.onload = () => resolve();
        photoImg.onerror = () => reject(new Error('Failed to load passport photo for sheet.'));
      });

      // A4 dimensions in mm: 210 × 297 mm
      // In inches: 8.27 × 11.69 inches
      // Use 300 DPI for standard printable sheet
      const sheetDpi = Math.min(300, dpi);
      const a4WidthPx = Math.round((210 / 25.4) * sheetDpi);
      const a4HeightPx = Math.round((297 / 25.4) * sheetDpi);

      const canvas = document.createElement('canvas');
      canvas.width = a4WidthPx;
      canvas.height = a4HeightPx;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsGeneratingSheet(false);
        return;
      }

      // Fill pure white page
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, a4WidthPx, a4HeightPx);

      // Margins: 10mm (in px)
      const marginPx = Math.round((10 / 25.4) * sheetDpi);
      // Spacing between photos: 3mm
      const gapPx = Math.round((3 / 25.4) * sheetDpi);

      // Photo size in px on this sheet
      let photoW_mm = activeWidth;
      let photoH_mm = activeHeight;
      if (activeUnit === 'cm') {
        photoW_mm = activeWidth * 10;
        photoH_mm = activeHeight * 10;
      } else if (activeUnit === 'inch') {
        photoW_mm = activeWidth * 25.4;
        photoH_mm = activeHeight * 25.4;
      }

      const photoW_px = Math.round((photoW_mm / 25.4) * sheetDpi);
      const photoH_px = Math.round((photoH_mm / 25.4) * sheetDpi);

      const availableW = a4WidthPx - 2 * marginPx;
      const availableH = a4HeightPx - 2 * marginPx;

      const cols = Math.floor((availableW + gapPx) / (photoW_px + gapPx));
      const rows = Math.floor((availableH + gapPx) / (photoH_px + gapPx));

      let copiesCount = 0;

      // Draw faint cut marks and photos
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = marginPx + c * (photoW_px + gapPx);
          const y = marginPx + r * (photoH_px + gapPx);

          // Draw passport photo
          ctx.drawImage(photoImg, x, y, photoW_px, photoH_px);

          // Draw delicate cut outline border
          ctx.strokeStyle = '#D1D5DB';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, photoW_px, photoH_px);

          copiesCount++;
        }
      }

      // Add a small footer label
      ctx.fillStyle = '#9CA3AF';
      ctx.font = `${Math.round(sheetDpi * 0.1)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(
        `SizeSnap.in • A4 Passport Photo Print Sheet (${copiesCount} Copies • ${activeWidth}×${activeHeight} ${activeUnit} • ${sheetDpi} DPI) • Print at 100% Scale`,
        a4WidthPx / 2,
        a4HeightPx - Math.round(marginPx / 2)
      );

      canvas.toBlob(
        (blob) => {
          setIsGeneratingSheet(false);
          if (!blob) return;

          const sheetUrl = registerUrl(URL.createObjectURL(blob));
          const filename = sanitizeFilename(
            `passport_A4_print_sheet_${copiesCount}copies_${activeWidth}x${activeHeight}${activeUnit}`,
            'jpg'
          );

          setSheetResult({
            url: sheetUrl,
            blob,
            copiesCount,
            size: blob.size,
            filename,
          });
        },
        'image/jpeg',
        0.95
      );
    } catch {
      setIsGeneratingSheet(false);
    }
  };

  const handleDownloadSingle = () => {
    if (!singleResult) return;
    const a = document.createElement('a');
    a.href = singleResult.url;
    a.download = singleResult.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadSheet = () => {
    if (!sheetResult) return;
    const a = document.createElement('a');
    a.href = sheetResult.url;
    a.download = sheetResult.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

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

      {/* 1. Upload */}
      {!selectedImage && <DropzoneUpload onFileSelect={handleFileSelect} />}

      {/* 2. Passport Editor */}
      {selectedImage && !singleResult && (
        <div className="space-y-4">
          <ImagePreviewCard image={selectedImage} onReset={handleResetAll} />

          {/* Configuration & Crop Workbench */}
          <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <Crop className="h-4 w-4 text-[#414FA8]" />
                <h3 className="text-sm font-bold text-gray-900">
                  Passport Photo Framing &amp; Dimensions
                </h3>
              </div>
              <span className="text-xs font-semibold text-[#414FA8] bg-[#EEF1FB] px-2.5 py-0.5 rounded self-start sm:self-auto">
                Output: {widthPx} × {heightPx} px ({dpi} DPI)
              </span>
            </div>

            {/* Presets Grid */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 block">
                Standard Passport &amp; Exam Dimensions:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PRESET_SIZES.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2 rounded-[4px] border text-left text-xs transition-all ${
                        isSelected
                          ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold ring-1 ring-[#414FA8]/30'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-[#9AA3C8] hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-bold text-xs">{preset.name}</div>
                      <div className="text-[10px] text-gray-500 font-normal line-clamp-1">
                        {preset.description}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Custom Size button toggle */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedPresetId('custom')}
                  className={`text-xs font-medium px-2.5 py-1 rounded border transition-colors ${
                    selectedPresetId === 'custom'
                      ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Custom Width &amp; Height...
                </button>
              </div>

              {/* Custom dimensions inputs if selected */}
              {selectedPresetId === 'custom' && (
                <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 border border-gray-200 rounded-[4px] mt-2">
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-0.5">
                      Width:
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(parseFloat(e.target.value) || 1)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-0.5">
                      Height:
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.5"
                      value={customHeight}
                      onChange={(e) => setCustomHeight(parseFloat(e.target.value) || 1)}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-gray-600 block mb-0.5">
                      Unit:
                    </label>
                    <select
                      value={unit}
                      onChange={(e) => setUnit(e.target.value as 'cm' | 'inch' | 'mm')}
                      className="w-full px-2 py-1 text-xs border border-gray-300 rounded bg-white"
                    >
                      <option value="cm">Centimeters (cm)</option>
                      <option value="inch">Inches (in)</option>
                      <option value="mm">Millimeters (mm)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* DPI & Background Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              {/* DPI Selector */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Print Resolution (DPI):
                </label>
                <div className="flex gap-2">
                  {DPI_OPTIONS.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDpi(d)}
                      className={`flex-1 py-1.5 px-2 rounded-[4px] border text-xs font-medium transition-all ${
                        dpi === d
                          ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-[#9AA3C8]'
                      }`}
                    >
                      {d} DPI
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  300 DPI is standard for high-resolution print submissions.
                </span>
              </div>

              {/* Background Color Choice */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">
                  Background Color (Transparent Areas):
                </label>
                <div className="flex gap-2">
                  {[
                    { id: 'original', label: 'Original', color: 'bg-gray-100' },
                    { id: 'white', label: 'Pure White', color: 'bg-white border' },
                    { id: 'lightblue', label: 'Light Blue', color: 'bg-[#CBE3FB]' },
                  ].map((bg) => (
                    <button
                      key={bg.id}
                      type="button"
                      onClick={() => setBgChoice(bg.id as typeof bgChoice)}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-[4px] border text-xs font-medium transition-all ${
                        bgChoice === bg.id
                          ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-[#9AA3C8]'
                      }`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${bg.color}`} />
                      <span>{bg.label}</span>
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 block">
                  Color fills transparent pixels. (Automatic AI background removal is not supported yet).
                </span>
              </div>
            </div>

            {/* Interactive Crop & Pan Frame */}
            <div className="pt-2 border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-[#414FA8]" /> Position &amp; Zoom Image
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowFaceGuide(!showFaceGuide)}
                    className={`text-[11px] px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
                      showFaceGuide
                        ? 'border-[#414FA8] text-[#414FA8] bg-[#EEF1FB] font-semibold'
                        : 'border-gray-200 text-gray-500'
                    }`}
                  >
                    <User className="h-3 w-3" />
                    <span>Face Biometric Guide</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZoom(1.0);
                      setPanX(0);
                      setPanY(0);
                      setRotation(0);
                    }}
                    className="text-[11px] text-gray-500 hover:text-gray-800 underline"
                  >
                    Reset Framing
                  </button>
                </div>
              </div>

              {/* Viewport Frame */}
              <div
                className="relative mx-auto rounded-[4px] border-2 border-[#414FA8] overflow-hidden bg-gray-900 select-none cursor-grab active:cursor-grabbing shadow-sm flex items-center justify-center touch-none"
                style={{
                  width: 'min(100%, 320px)',
                  height: `${320 / targetAspectRatio}px`,
                  maxHeight: '440px',
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {/* Image under transform */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedImage.previewUrl}
                  alt="Crop preview"
                  draggable={false}
                  className="max-w-none pointer-events-none transition-transform duration-75"
                  style={{
                    transform: `translate(${panX}px, ${panY}px) scale(${zoom}) rotate(${rotation}deg)`,
                    transformOrigin: 'center center',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Biometric Oval Head Guide */}
                {showFaceGuide && (
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                    {/* Head Oval (approx 70-80% height of passport frame) */}
                    <div
                      className="border-2 border-dashed border-amber-300/80 rounded-full"
                      style={{
                        width: '60%',
                        height: '72%',
                        boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.25)',
                      }}
                    />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                      Align face inside oval (70–80%)
                    </div>
                  </div>
                )}
              </div>

              {/* Framing Controls: Zoom, Pan Hint, Rotate */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                {/* Zoom control */}
                <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                  <ZoomOut className="h-4 w-4 text-gray-400" />
                  <input
                    type="range"
                    min="0.8"
                    max="3.0"
                    step="0.05"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#414FA8]"
                  />
                  <ZoomIn className="h-4 w-4 text-gray-400" />
                  <span className="text-xs font-mono text-gray-600 min-w-[40px]">
                    {zoom.toFixed(1)}x
                  </span>
                </div>

                {/* Rotate buttons */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r - 90) % 360)}
                    className="p-1.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs"
                    title="Rotate 90° counter-clockwise"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="p-1.5 rounded border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs"
                    title="Rotate 90° clockwise"
                  >
                    <RotateCw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-gray-400 text-center">
                Tip: Click and drag (or swipe on phone) inside the box to center your face and shoulders.
              </p>
            </div>

            {/* Disclaimer on authority rules */}
            <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 text-amber-900 text-[11px] rounded-[4px] leading-relaxed">
              <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
              <span>
                <strong>Application Requirements Disclaimer:</strong> Different portals (such as SSC, UPSC, US Visa, Schengen, or Indian Passport) have unique background color, head ratio, and file size constraints. Please confirm your specific exam/consulate notice before printing or uploading.
              </span>
            </div>

            {/* Action button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGeneratePassportPhoto}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Processing Passport Photo...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>Generate Passport Photo ({widthPx} × {heightPx} px)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Output & A4 Sheet Generation */}
      {selectedImage && singleResult && (
        <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  Passport Photo Ready!
                </h3>
                <p className="text-xs text-gray-500">
                  Formatted to {activeWidth} × {activeHeight} {activeUnit} ({singleResult.widthPx} × {singleResult.heightPx} px @ {dpi} DPI).
                </p>
              </div>
            </div>

            <span className="self-start sm:self-auto px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
              {formatBytes(singleResult.size)}
            </span>
          </div>

          {/* Photo Preview & Details */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            {/* Thumbnail */}
            <div className="sm:col-span-4 flex flex-col items-center justify-center bg-gray-50 p-4 rounded-[4px] border border-gray-200">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={singleResult.url}
                alt="Passport photo preview"
                className="max-h-[220px] max-w-full rounded shadow-md border border-gray-300"
              />
              <span className="text-[11px] text-gray-500 mt-2 font-medium">
                {activeWidth} × {activeHeight} {activeUnit}
              </span>
            </div>

            {/* Specifications Details */}
            <div className="sm:col-span-8 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                  <span className="text-gray-400 block text-[10px]">Physical Size</span>
                  <span className="font-bold text-gray-800">{activeWidth} × {activeHeight} {activeUnit}</span>
                </div>
                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                  <span className="text-gray-400 block text-[10px]">Pixel Dimensions</span>
                  <span className="font-bold text-gray-800">{singleResult.widthPx} × {singleResult.heightPx} px</span>
                </div>
                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                  <span className="text-gray-400 block text-[10px]">DPI Resolution</span>
                  <span className="font-bold text-gray-800">{dpi} DPI</span>
                </div>
                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                  <span className="text-gray-400 block text-[10px]">File Size</span>
                  <span className="font-bold text-[#414FA8]">{formatBytes(singleResult.size)}</span>
                </div>
              </div>

              {/* Single Download button */}
              <button
                type="button"
                onClick={handleDownloadSingle}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer"
              >
                <Download className="h-4 w-4" />
                <span>Download Single Passport Photo</span>
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSingleResult(null)}
                  className="flex-1 py-2 px-3 rounded-[4px] border border-[#9AA3C8] bg-white hover:bg-[#EEF1FB] text-[#414FA8] text-xs font-semibold transition-colors"
                >
                  Adjust Framing / Size
                </button>
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="py-2 px-3 rounded-[4px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-xs font-medium transition-colors"
                >
                  New Photo
                </button>
              </div>
            </div>
          </div>

          {/* Section 6: Printable A4 Sheet Generator */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <div className="flex items-center gap-2">
              <Printer className="h-4 w-4 text-[#414FA8]" />
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                Optional: Printable A4 Photo Sheet (Multi-Copy Grid)
              </h4>
            </div>
            <p className="text-xs text-gray-600">
              Fit multiple passport photos on a standard A4 page with cutting guides. Ready to print on glossy photo paper at any local cyber cafe or home printer.
            </p>

            {!sheetResult ? (
              <button
                type="button"
                onClick={handleGenerateA4Sheet}
                disabled={isGeneratingSheet}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white text-xs font-semibold rounded-[4px] transition-colors"
              >
                {isGeneratingSheet ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Calculating &amp; Arranging A4 Grid...</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" />
                    <span>Generate A4 Multi-Photo Sheet</span>
                  </>
                )}
              </button>
            ) : (
              <div className="bg-gray-50 p-4 rounded-[4px] border border-gray-200 space-y-3">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">
                      A4 Sheet Generated ({sheetResult.copiesCount} Copies)
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Standard A4 (210 × 297 mm) • File size: {formatBytes(sheetResult.size)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadSheet}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-[4px] shadow-xs transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download A4 Sheet ({sheetResult.copiesCount} Photos)</span>
                  </button>
                </div>

                <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-800 text-[11px] rounded leading-relaxed">
                  <strong>Printing Tip:</strong> When printing this sheet, select <strong>Actual Size</strong> or <strong>100% Scale</strong> in printer settings (do NOT choose &ldquo;Fit to page&rdquo;) to ensure exact {activeWidth} × {activeHeight} {activeUnit} dimensions on paper.
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Processed 100% locally in your browser. No photos uploaded to cloud servers.</span>
          </div>
        </div>
      )}
    </div>
  );
}
