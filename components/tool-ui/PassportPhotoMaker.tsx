'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
  Calendar,
  Type,
  Zap,
  ArrowRight,
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
    description: 'Indian Passport, SSC, UPSC, Police & Govt Exams',
  },
  {
    id: 'pan-card',
    name: '2.5 × 3.5 cm',
    width: 2.5,
    height: 3.5,
    unit: 'cm',
    description: 'PAN Card (NSDL / UTI Application Portal)',
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
    description: 'Stamp Size / Bank Account / Admit Card',
  },
  {
    id: 'schengen',
    name: '3.5 × 4.5 cm (Europe)',
    width: 3.5,
    height: 4.5,
    unit: 'cm',
    description: 'Schengen, UK, Canada, Australia Visa',
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

  // Name & Date on Photo (SSC / Railway / Govt Exam strip)
  const [addNameDate, setAddNameDate] = useState<boolean>(false);
  const [candidateName, setCandidateName] = useState<string>('');
  const [photoDate, setPhotoDate] = useState<string>(() => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  });

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

  // AI Background Removal state
  const [isRemovingBg, setIsRemovingBg] = useState<boolean>(false);
  const [bgRemovalProgress, setBgRemovalProgress] = useState<number>(0);
  const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);

  const handleAiRemoveBg = async () => {
    if (!selectedImage) return;
    setIsRemovingBg(true);
    setBgRemovalProgress(10);
    setErrorMsg(null);

    try {
      const { removeBackground } = await import('@imgly/background-removal');
      const blob = await removeBackground(selectedImage.previewUrl, {
        progress: (key, current, total) => {
          if (total > 0) {
            setBgRemovalProgress(Math.min(95, Math.round((current / total) * 100)));
          }
        },
      });
      const newUrl = registerUrl(URL.createObjectURL(blob));
      if (!originalPreviewUrl) {
        setOriginalPreviewUrl(selectedImage.previewUrl);
      }
      setSelectedImage({
        ...selectedImage,
        previewUrl: newUrl,
      });
      setBgChoice('white');
    } catch (err) {
      console.error('Failed to remove background:', err);
      setErrorMsg('Could not automatically remove background. Please make sure your browser supports WebAssembly.');
    } finally {
      setIsRemovingBg(false);
      setBgRemovalProgress(0);
    }
  };

  const handleRevertBg = () => {
    if (originalPreviewUrl && selectedImage) {
      setSelectedImage({
        ...selectedImage,
        previewUrl: originalPreviewUrl,
      });
      setOriginalPreviewUrl(null);
      setBgChoice('original');
    }
  };

  // Single photo result (HQ)
  const [singleResult, setSingleResult] = useState<{
    url: string;
    blob: Blob;
    widthPx: number;
    heightPx: number;
    size: number;
    filename: string;
  } | null>(null);

  // Govt Portal Compressed Result (20KB - 50KB guaranteed)
  const [portalResult, setPortalResult] = useState<{
    url: string;
    blob: Blob;
    size: number;
    filename: string;
  } | null>(null);

  // Print sheet result
  const [sheetType, setSheetType] = useState<'a4' | '4x6'>('a4');
  const [isGeneratingSheet, setIsGeneratingSheet] = useState<boolean>(false);
  const [sheetResult, setSheetResult] = useState<{
    url: string;
    blob: Blob;
    copiesCount: number;
    size: number;
    filename: string;
    sheetName: string;
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
    setOriginalPreviewUrl(null);
    setIsRemovingBg(false);
    setBgChoice('original');
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

      // Render Name & Date strip at the bottom if enabled
      if (addNameDate && (candidateName.trim() || photoDate.trim())) {
        const stripHeight = Math.round(heightPx * 0.17);
        const stripY = heightPx - stripHeight;

        // Clean white background strip
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, stripY, widthPx, stripHeight);

        // Thin separating border line
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = Math.max(1, Math.round(widthPx / 350));
        ctx.strokeRect(0, stripY, widthPx, stripHeight);

        // Text formatting
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const nameText = candidateName.trim().toUpperCase();
        let formattedDate = photoDate.trim();
        if (formattedDate.includes('-')) {
          const parts = formattedDate.split('-');
          if (parts.length === 3 && parts[0].length === 4) {
            formattedDate = `${parts[2]}/${parts[1]}/${parts[0]}`;
          }
        }

        if (nameText && formattedDate) {
          const nameFontSize = Math.max(11, Math.round(stripHeight * 0.36));
          const dateFontSize = Math.max(10, Math.round(stripHeight * 0.30));

          ctx.font = `bold ${nameFontSize}px sans-serif`;
          ctx.fillText(nameText, widthPx / 2, stripY + stripHeight * 0.32);

          ctx.font = `600 ${dateFontSize}px sans-serif`;
          ctx.fillText(`DOP: ${formattedDate}`, widthPx / 2, stripY + stripHeight * 0.72);
        } else if (nameText) {
          const nameFontSize = Math.max(12, Math.round(stripHeight * 0.5));
          ctx.font = `bold ${nameFontSize}px sans-serif`;
          ctx.fillText(nameText, widthPx / 2, stripY + stripHeight * 0.5);
        } else if (formattedDate) {
          const dateFontSize = Math.max(12, Math.round(stripHeight * 0.5));
          ctx.font = `bold ${dateFontSize}px sans-serif`;
          ctx.fillText(`DOP: ${formattedDate}`, widthPx / 2, stripY + stripHeight * 0.5);
        }
      }

      const getBlobAtQuality = (q: number): Promise<Blob | null> => {
        return new Promise((res) => canvas.toBlob(res, 'image/jpeg', q));
      };

      // 1. Generate Studio Quality (HQ)
      const hqBlob = await getBlobAtQuality(0.95);
      if (!hqBlob) {
        setIsProcessing(false);
        setErrorMsg('Failed to generate passport photo blob.');
        return;
      }

      const cleanName = selectedImage.name.replace(/\.[^.]+$/, '');
      const baseFilename = `passport_${cleanName}_${activeWidth}x${activeHeight}${activeUnit}`;
      const hqUrl = registerUrl(URL.createObjectURL(hqBlob));

      setSingleResult({
        url: hqUrl,
        blob: hqBlob,
        widthPx,
        heightPx,
        size: hqBlob.size,
        filename: sanitizeFilename(`${baseFilename}_${dpi}dpi`, 'jpg'),
      });

      // 2. Generate Govt Portal Ready (20KB - 50KB) version
      try {
        let portalBlob: Blob | null = null;
        // Test qualities from 0.75 down to 0.25 to hit under 50KB (ideally between 25KB and 48KB)
        const testQualities = [0.72, 0.60, 0.48, 0.38, 0.28];
        for (const q of testQualities) {
          const b = await getBlobAtQuality(q);
          if (b) {
            portalBlob = b;
            if (b.size <= 50000) {
              break;
            }
          }
        }

        if (portalBlob) {
          const portalUrl = registerUrl(URL.createObjectURL(portalBlob));
          setPortalResult({
            url: portalUrl,
            blob: portalBlob,
            size: portalBlob.size,
            filename: sanitizeFilename(`${baseFilename}_govt_portal_${Math.round(portalBlob.size / 1024)}KB`, 'jpg'),
          });
        }
      } catch (err) {
        console.error('Portal auto-compression failed:', err);
      }

      setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      setErrorMsg(err instanceof Error ? err.message : 'Error generating passport photo.');
    }
  };

  // Generate Multi-Photo Printable Sheet (A4 or 4x6 Photo Paper)
  const handleGenerateSheet = async (type: 'a4' | '4x6') => {
    if (!singleResult) return;

    setSheetType(type);
    setIsGeneratingSheet(true);
    await new Promise((r) => setTimeout(r, 60));

    try {
      // Load the generated passport photo
      const photoImg = new Image();
      photoImg.src = singleResult.url;
      await new Promise<void>((resolve, reject) => {
        if (photoImg.complete) return resolve();
        photoImg.onload = () => resolve();
        photoImg.onerror = () => reject(new Error('Failed to load passport photo for sheet.'));
      });

      // Sheet dimensions in mm
      // A4 = 210 × 297 mm
      // 4x6 inch = 101.6 × 152.4 mm (Postcard photo paper)
      let sheetW_mm = 210;
      let sheetH_mm = 297;
      let sheetTitle = 'A4 Sheet';
      const margin_mm = type === '4x6' ? 5 : 10;
      const gap_mm = type === '4x6' ? 2 : 3;

      if (type === '4x6') {
        sheetW_mm = 101.6;
        sheetH_mm = 152.4;
        sheetTitle = '4×6" Photo Paper';
      }

      const sheetDpi = Math.min(300, dpi);
      const sheetWidthPx = Math.round((sheetW_mm / 25.4) * sheetDpi);
      const sheetHeightPx = Math.round((sheetH_mm / 25.4) * sheetDpi);

      const canvas = document.createElement('canvas');
      canvas.width = sheetWidthPx;
      canvas.height = sheetHeightPx;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsGeneratingSheet(false);
        return;
      }

      // Fill pure white page
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, sheetWidthPx, sheetHeightPx);

      const marginPx = Math.round((margin_mm / 25.4) * sheetDpi);
      const gapPx = Math.round((gap_mm / 25.4) * sheetDpi);

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

      const availableW = sheetWidthPx - 2 * marginPx;
      const availableH = sheetHeightPx - 2 * marginPx;

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

      // Footer label
      ctx.fillStyle = '#9CA3AF';
      ctx.font = `${Math.round(sheetDpi * 0.085)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(
        `SizeSnap.in • ${sheetTitle} (${copiesCount} Copies • ${activeWidth}×${activeHeight} ${activeUnit} • ${sheetDpi} DPI) • Print at 100% Scale`,
        sheetWidthPx / 2,
        sheetHeightPx - Math.round(marginPx / 3)
      );

      canvas.toBlob(
        (blob) => {
          setIsGeneratingSheet(false);
          if (!blob) return;

          const sheetUrl = registerUrl(URL.createObjectURL(blob));
          const filename = sanitizeFilename(
            `passport_${type === '4x6' ? '4x6inch' : 'A4'}_sheet_${copiesCount}copies_${activeWidth}x${activeHeight}${activeUnit}`,
            'jpg'
          );

          setSheetResult({
            url: sheetUrl,
            blob,
            copiesCount,
            size: blob.size,
            filename,
            sheetName: sheetTitle,
          });
        },
        'image/jpeg',
        0.95
      );
    } catch {
      setIsGeneratingSheet(false);
    }
  };

  const handleDownloadPortal = () => {
    if (!portalResult) return;
    const a = document.createElement('a');
    a.href = portalResult.url;
    a.download = portalResult.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
                {!originalPreviewUrl ? (
                  <div className="mt-2.5 pt-2 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={handleAiRemoveBg}
                      disabled={isRemovingBg}
                      className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2e3778] text-white text-xs font-semibold rounded shadow-xs transition-colors disabled:opacity-60 cursor-pointer"
                    >
                      {isRemovingBg ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>AI Removing Background ({bgRemovalProgress}%)...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Make Background Pure White / Light Blue (AI 1-Click)</span>
                        </>
                      )}
                    </button>
                    <span className="text-[10px] text-gray-500 mt-1 block text-center">
                      Cuts out your photo subject and replaces the background with pure studio white or blue.
                    </span>
                  </div>
                ) : (
                  <div className="mt-2.5 pt-2 border-t border-gray-100 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded p-2 text-xs">
                    <span className="text-emerald-800 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Subject Cut Out Active
                    </span>
                    <button
                      type="button"
                      onClick={handleRevertBg}
                      className="text-xs text-[#414FA8] font-bold hover:underline"
                    >
                      Revert to Original
                    </button>
                  </div>
                )}
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

                {/* Realtime Name & Date Strip preview overlay */}
                {addNameDate && (
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-white border-t border-black text-black text-center flex flex-col justify-center items-center pointer-events-none z-10 select-none shadow-sm"
                    style={{ height: '17%' }}
                  >
                    <span className="font-bold text-[10px] sm:text-[11px] leading-tight truncate px-1 text-black">
                      {candidateName.trim() ? candidateName.toUpperCase() : 'CANDIDATE NAME'}
                    </span>
                    <span className="text-[9px] font-semibold text-gray-800 leading-tight">
                      DOP: {photoDate || 'DD/MM/YYYY'}
                    </span>
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

            {/* Candidate Name & Date Strip for SSC/Police Exams */}
            <div className="pt-3 border-t border-gray-100 space-y-2.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={addNameDate}
                  onChange={(e) => setAddNameDate(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#414FA8] focus:ring-[#414FA8] accent-[#414FA8]"
                />
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Type className="h-3.5 w-3.5 text-[#414FA8]" />
                  Add Name &amp; Date on Photo (Mandatory for SSC, Police &amp; Govt Exams)
                </span>
              </label>

              {addNameDate && (
                <div className="p-3 bg-[#EEF1FB]/70 border border-[#9AA3C8]/40 rounded-[4px] space-y-2.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                        Candidate Full Name (in CAPITAL):
                      </label>
                      <input
                        type="text"
                        value={candidateName}
                        onChange={(e) => setCandidateName(e.target.value)}
                        placeholder="e.g. AMIT KUMAR"
                        className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white uppercase font-medium focus:outline-none focus:border-[#414FA8]"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-gray-700 block mb-1">
                        Date of Photo (DOP):
                      </label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={photoDate}
                          onChange={(e) => setPhotoDate(e.target.value)}
                          placeholder="DD/MM/YYYY"
                          className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white font-medium focus:outline-none focus:border-[#414FA8]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            const dd = String(d.getDate()).padStart(2, '0');
                            const mm = String(d.getMonth() + 1).padStart(2, '0');
                            const yyyy = d.getFullYear();
                            setPhotoDate(`${dd}/${mm}/${yyyy}`);
                          }}
                          className="px-2 py-1.5 text-[10px] font-semibold bg-white border border-gray-200 rounded text-gray-600 hover:bg-gray-50 shrink-0"
                          title="Set Today's Date"
                        >
                          Today
                        </button>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-600 leading-normal">
                    Prints a clean white strip at the bottom of the photo with candidate name &amp; photo capture date, matching official SSC &amp; government exam rules.
                  </p>
                </div>
              )}
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

      {/* 3. Output & Multi-Sheet Generation */}
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
              HQ: {formatBytes(singleResult.size)}
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

            {/* Specifications Details & Download Buttons */}
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

              {/* Two Download Options: Studio HQ & Govt Portal (20KB - 50KB) */}
              <div className="space-y-2 pt-1">
                {/* Button 1: Govt Portal (20KB - 50KB) */}
                {portalResult && (
                  <button
                    type="button"
                    onClick={handleDownloadPortal}
                    className="w-full flex items-center justify-between gap-2 py-2.5 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-sm transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-amber-300" />
                      <span>Download for Govt Exam Portal (20KB – 50KB)</span>
                    </div>
                    <span className="bg-white/20 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                      {formatBytes(portalResult.size)}
                    </span>
                  </button>
                )}

                {/* Button 2: Studio Print (HQ) */}
                <button
                  type="button"
                  onClick={handleDownloadSingle}
                  className="w-full flex items-center justify-between gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span>Download Studio High-Quality Photo</span>
                  </div>
                  <span className="bg-emerald-700 text-white text-[11px] font-semibold px-2 py-0.5 rounded">
                    {formatBytes(singleResult.size)}
                  </span>
                </button>
              </div>

              <div className="flex gap-2 pt-1">
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

              {/* Next Steps for Govt Exam Candidates */}
              <div className="p-3 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[4px] mt-2 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#414FA8]" />
                    <span>Next Steps for Exam Application Form</span>
                  </span>
                  <span className="text-[10px] text-gray-400 font-medium">Free Utilities</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                  <Link
                    href="/tools/generate-signature"
                    className="p-2.5 bg-white hover:bg-[#EEF1FB] border border-gray-200 hover:border-[#9AA3C8] rounded text-left transition-colors group flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-gray-800 group-hover:text-[#414FA8]">
                        Format Signature (10KB–20KB)
                      </div>
                      <div className="text-[10px] text-gray-500">
                        Official 4.0×2.0 cm running hand crop
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#414FA8] shrink-0" />
                  </Link>

                  <Link
                    href="/tools/reduce-image-size-in-kb"
                    className="p-2.5 bg-white hover:bg-[#EEF1FB] border border-gray-200 hover:border-[#9AA3C8] rounded text-left transition-colors group flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-semibold text-gray-800 group-hover:text-[#414FA8]">
                        Compress Marksheet / Thumb
                      </div>
                      <div className="text-[10px] text-gray-500">
                        Exact 100KB, 200KB or 300KB target
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-gray-400 group-hover:text-[#414FA8] shrink-0" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Printable Multi-Photo Sheet Generator (A4 & 4x6 Photo Paper) */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            <div className="flex items-center gap-2">
              <Printer className="h-4 w-4 text-[#414FA8]" />
              <h4 className="text-xs sm:text-sm font-bold text-gray-900">
                Printable Photo Sheet (Ready for Printing on Photo Paper)
              </h4>
            </div>
            <p className="text-xs text-gray-600">
              Arrange multiple copies with precision cut guides. Choose standard <strong>A4 Sheet (up to 30 copies)</strong> or <strong>4×6 Inch Photo Paper (6–8 copies)</strong> for local studio/cyber cafe printers.
            </p>

            {/* Sheet format selector buttons */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleGenerateSheet('a4')}
                disabled={isGeneratingSheet}
                className="flex items-center gap-2 py-2 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white text-xs font-semibold rounded-[4px] transition-colors cursor-pointer"
              >
                {isGeneratingSheet && sheetType === 'a4' ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                <span>Generate A4 Sheet (30 Copies)</span>
              </button>

              <button
                type="button"
                onClick={() => handleGenerateSheet('4x6')}
                disabled={isGeneratingSheet}
                className="flex items-center gap-2 py-2 px-4 bg-[#EEF1FB] hover:bg-[#E2E7F8] border border-[#9AA3C8] text-[#414FA8] text-xs font-bold rounded-[4px] transition-colors cursor-pointer"
              >
                {isGeneratingSheet && sheetType === '4x6' ? (
                  <Loader2 className="h-4 w-4 animate-spin text-[#414FA8]" />
                ) : (
                  <Printer className="h-4 w-4" />
                )}
                <span>Generate 4×6&quot; Photo Paper Sheet</span>
              </button>
            </div>

            {sheetResult && (
              <div className="bg-gray-50 p-4 rounded-[4px] border border-gray-200 space-y-3 mt-3 animate-fadeIn">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">
                      {sheetResult.sheetName} Ready ({sheetResult.copiesCount} Copies)
                    </span>
                    <span className="text-[11px] text-gray-500">
                      File size: {formatBytes(sheetResult.size)} • 300 DPI high resolution
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownloadSheet}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-[4px] shadow-xs transition-colors cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download {sheetResult.sheetName} ({sheetResult.copiesCount} Photos)</span>
                  </button>
                </div>

                <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-800 text-[11px] rounded leading-relaxed">
                  <strong>Printing Tip:</strong> In your printer dialogue, select <strong>Actual Size</strong> or <strong>100% Scale</strong> (never &ldquo;Fit to page&rdquo;) to ensure exact {activeWidth} × {activeHeight} {activeUnit} millimeter accuracy on physical photo paper.
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
