'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Upload,
  Download,
  Printer,
  Trash2,
  RefreshCw,
  Sparkles,
  Sliders,
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Scissors,
  Check,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Layers,
  FileCheck,
  ShieldCheck,
  Zap,
  Info,
  Calendar,
  User,
  Copy,
  Eye,
  Settings2,
  Maximize2,
  Wand2,
} from 'lucide-react';
import { trackProcessingSuccess, trackDownload } from '@/lib/firebase';
import { WhatsAppShareButton } from '@/components/WhatsAppShareButton';

// Studio background color presets popular in Indian Cyber Cafes & CSC Kendras
const STUDIO_BG_COLORS = [
  { id: 'lightblue', name: 'Studio Sky Blue', hex: '#CBE3FB', border: '#93C5FD', desc: 'India Cyber Cafe #1 Choice (School, Police, State Exams)' },
  { id: 'white', name: 'White', hex: '#FFFFFF', border: '#D1D5DB', desc: 'Indian Passport, US Visa, SSC, Banking' },
  { id: 'royalblue', name: 'Royal Blue', hex: '#1E3A8A', border: '#1E40AF', desc: 'Formal Studio Backdrop' },
  { id: 'grey', name: 'Studio Grey', hex: '#E2E8F0', border: '#CBD5E1', desc: 'Corporate & Embassy Formal' },
  { id: 'cream', name: 'Off-White', hex: '#F8F9FA', border: '#E2E8F0', desc: 'Soft Neutral Off-White' },
  { id: 'red', name: 'Studio Red', hex: '#DC2626', border: '#B91C1C', desc: 'State Badges & Special Admissions' },
];

// Quick Sheet Count Presets for Cyber Cafe
const QUICK_PACKS = [
  { count: 6, label: '6 Photos', paper: '4x6', popular: true, desc: 'Classic 4x6" Cyber Cafe Pack (₹30-₹50)' },
  { count: 8, label: '8 Photos', paper: '4x6', popular: false, desc: '8 Copies on 4x6" Glossy Paper' },
  { count: 12, label: '12 Photos', paper: '4x6', popular: false, desc: '12 Copies (Compact or Stamp Size)' },
  { count: 16, label: '16 Photos', paper: 'a4', popular: false, desc: '16 Copies on Standard A4 Sheet' },
  { count: 32, label: '32 Photos (Full A4)', paper: 'a4', popular: false, desc: 'Bulk 32 Copies on Full A4 Paper' },
];

export function CyberCafePassportPhotoTool() {
  // Input image state
  const [rawFile, setRawFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageFilename, setImageFilename] = useState<string>('photo');
  const [imageNaturalSize, setImageNaturalSize] = useState<{ width: number; height: number } | null>(null);

  // Background states
  const [cutoutSrc, setCutoutSrc] = useState<string | null>(null);
  const [smartCutoutSrc, setSmartCutoutSrc] = useState<string | null>(null);
  const [selectedBgId, setSelectedBgId] = useState<string>('lightblue'); // default is popular Sky Blue
  const [customBgColor, setCustomBgColor] = useState<string>('#CBE3FB');
  const [isRemovingBg, setIsRemovingBg] = useState<boolean>(false);
  const [bgRemovalProgress, setBgRemovalProgress] = useState<number>(0);
  const [useOriginalBg, setUseOriginalBg] = useState<boolean>(false);
  const [aiErrorMsg, setAiErrorMsg] = useState<string | null>(null);

  // Biometric Alignment / Crop controls
  const [zoom, setZoom] = useState<number>(1.0);
  const [panX, setPanX] = useState<number>(0);
  const [panY, setPanY] = useState<number>(0);
  const [rotation, setRotation] = useState<number>(0);
  const [showFaceGuide, setShowFaceGuide] = useState<boolean>(true);

  // Print Sheet Settings
  const [paperSize, setPaperSize] = useState<'4x6' | 'a4'>('4x6');
  const [copiesCount, setCopiesCount] = useState<number>(6);
  const [fillMode, setFillMode] = useState<'exact' | 'full'>('exact'); // 'exact' = exactly N photos line-by-line; 'full' = fill entire sheet
  const [hasBorder, setHasBorder] = useState<boolean>(true); // Scissor cutting line border

  // Govt Exam Name & Date Strip (SSC / UPSC / Police exam)
  const [addNameDate, setAddNameDate] = useState<boolean>(false);
  const [candidateName, setCandidateName] = useState<string>('');
  const [photoDate, setPhotoDate] = useState<string>(() => {
    const d = new Date();
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  });

  // UI tabs & states
  const [activeTab, setActiveTab] = useState<'sheet' | 'single'>('sheet');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  // Canvas References
  const sheetCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const singleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Dragging interaction state for panning
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number; initialPanX: number; initialPanY: number }>({
    x: 0,
    y: 0,
    initialPanX: 0,
    initialPanY: 0,
  });

  // Clean up object URLs
  const urlsRef = useRef<string[]>([]);
  const registerUrl = useCallback((url: string) => {
    urlsRef.current.push(url);
    return url;
  }, []);

  useEffect(() => {
    return () => {
      urlsRef.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {
          // ignore
        }
      });
    };
  }, []);

  // Get active background hex color
  const getActiveBgColor = useCallback(() => {
    if (selectedBgId === 'custom') return customBgColor;
    const preset = STUDIO_BG_COLORS.find((c) => c.id === selectedBgId);
    return preset ? preset.hex : '#FFFFFF';
  }, [selectedBgId, customBgColor]);

  // Instant Smart Corner-Key Color Replace Fallback (runs in 10ms on canvas)
  const generateSmartCornerReplace = useCallback(
    (sourceImg: HTMLImageElement, targetHex: string): string => {
      const canvas = document.createElement('canvas');
      canvas.width = sourceImg.width;
      canvas.height = sourceImg.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return sourceImg.src;

      ctx.drawImage(sourceImg, 0, 0);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const w = canvas.width;
      const h = canvas.height;

      // Sample 4 corners for background color estimation
      const sampleCoords = [
        [Math.min(10, w - 1), Math.min(10, h - 1)],
        [Math.max(0, w - 11), Math.min(10, h - 1)],
        [Math.min(15, w - 1), Math.min(25, h - 1)],
        [Math.max(0, w - 16), Math.min(25, h - 1)],
      ];

      let sR = 0, sG = 0, sB = 0;
      for (const [sx, sy] of sampleCoords) {
        const idx = (sy * w + sx) * 4;
        sR += data[idx];
        sG += data[idx + 1];
        sB += data[idx + 2];
      }
      sR = Math.round(sR / sampleCoords.length);
      sG = Math.round(sG / sampleCoords.length);
      sB = Math.round(sB / sampleCoords.length);

      // Target background RGB
      const rT = parseInt(targetHex.slice(1, 3), 16) || 255;
      const gT = parseInt(targetHex.slice(3, 5), 16) || 255;
      const bT = parseInt(targetHex.slice(5, 7), 16) || 255;

      const tolerance = 42;
      const tolSq = tolerance * tolerance * 3;

      // Scan and replace outer pixels
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          const dr = r - sR;
          const dg = g - sG;
          const db = b - sB;
          const distSq = dr * dr + dg * dg + db * db;

          if (distSq < tolSq) {
            const factor = Math.min(1, Math.max(0, (tolSq - distSq) / (tolSq * 0.4)));
            data[i] = Math.round(r * (1 - factor) + rT * factor);
            data[i + 1] = Math.round(g * (1 - factor) + gT * factor);
            data[i + 2] = Math.round(b * (1 - factor) + bT * factor);
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
      return canvas.toDataURL('image/png');
    },
    []
  );

  // Background Cutout with AI (@imgly/background-removal)
  // Passed directly as a Blob / File to prevent string URL corruption
  const executeAiRemoveBg = useCallback(
    async (fileToProcess: File): Promise<void> => {
      setIsRemovingBg(true);
      setBgRemovalProgress(10);
      setAiErrorMsg(null);
      setStatusMessage('Removing background with AI (running 100% in your browser)...');

      try {
        const { removeBackground } = await import('@imgly/background-removal');

        // Pass File (Blob) directly!
        const blob = await removeBackground(fileToProcess, {
          publicPath: 'https://staticimgly.com/@imgly/background-removal-data/1.5.0/dist/',
          progress: (key, current, total) => {
            if (total > 0) {
              setBgRemovalProgress(Math.min(95, Math.round((current / total) * 100)));
            }
          },
        });

        const cutoutUrl = registerUrl(URL.createObjectURL(blob));
        setCutoutSrc(cutoutUrl);
        setUseOriginalBg(false);
        setStatusMessage('Background removed cleanly with AI.');
      } catch (err: unknown) {
        console.error('AI background removal error:', err);
        setAiErrorMsg('AI cutout encountered a browser issue. Applied Smart Studio Color Match.');
        setStatusMessage('Applied Smart Studio Color Match.');
      } finally {
        setIsRemovingBg(false);
        setBgRemovalProgress(0);
      }
    },
    [registerUrl]
  );

  // Handle Photo File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    loadImageFile(file);
  };

  const loadImageFile = (file: File) => {
    setRawFile(file);
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
    setImageFilename(nameWithoutExt);

    const objectUrl = registerUrl(URL.createObjectURL(file));
    const img = new window.Image();
    img.onload = () => {
      setImageNaturalSize({ width: img.width, height: img.height });
      setImageSrc(objectUrl);
      setCutoutSrc(null);
      setUseOriginalBg(false);
      setZoom(1.0);
      setPanX(0);
      setPanY(0);
      setRotation(0);
      setStatusMessage('Photo loaded. Changing background to Studio Sky Blue...');

      // Immediately generate instant smart corner replace
      const instantReplaced = generateSmartCornerReplace(img, getActiveBgColor());
      setSmartCutoutSrc(instantReplaced);

      // Automatically launch AI background removal
      executeAiRemoveBg(file);
    };
    img.src = objectUrl;
  };

  // Drag & drop handlers
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      loadImageFile(e.dataTransfer.files[0]);
    }
  };

  // User clicks a Studio Background Color (White, Sky Blue, Navy, etc.)
  const handleSelectColor = (colorId: string) => {
    setSelectedBgId(colorId);
    setUseOriginalBg(false);

    // If cutout is not yet available and not currently processing, trigger it now
    if (!cutoutSrc && rawFile && !isRemovingBg) {
      executeAiRemoveBg(rawFile);
    }

    // Also update instant smart replace
    if (imageSrc && !cutoutSrc) {
      const img = new window.Image();
      img.onload = () => {
        const hex = colorId === 'custom' ? customBgColor : (STUDIO_BG_COLORS.find((c) => c.id === colorId)?.hex || '#FFFFFF');
        const instant = generateSmartCornerReplace(img, hex);
        setSmartCutoutSrc(instant);
      };
      img.src = imageSrc;
    }
  };

  // Revert to original background
  const handleToggleOriginalBg = () => {
    setUseOriginalBg(!useOriginalBg);
  };

  // Render Single Passport Photo (3.5 × 4.5 cm at 300 DPI)
  // 35 mm × 45 mm at 300 DPI: Width = 413 px, Height = 531 px
  const renderSinglePhotoToCanvas = useCallback(
    async (targetCanvas: HTMLCanvasElement): Promise<void> => {
      const widthPx = 413;
      const heightPx = 531;
      targetCanvas.width = widthPx;
      targetCanvas.height = heightPx;
      const ctx = targetCanvas.getContext('2d');
      if (!ctx) return;

      const bgColor = getActiveBgColor();

      // 1. Draw solid background color
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, widthPx, heightPx);

      // 2. Select image source:
      // Priority:
      // 1) Original photo if "Keep Original" is toggled
      // 2) AI Cutout (Transparent PNG) if ready
      // 3) Smart Corner Replaced if AI is still running
      // 4) Fallback original image
      let activeSource = imageSrc;
      if (useOriginalBg) {
        activeSource = imageSrc;
      } else if (cutoutSrc) {
        activeSource = cutoutSrc;
      } else if (smartCutoutSrc) {
        activeSource = smartCutoutSrc;
      }

      if (!activeSource) return;

      const img = new window.Image();
      img.src = activeSource;
      await new Promise<void>((res) => {
        if (img.complete) return res();
        img.onload = () => res();
      });

      // Cover scaling with zoom
      const scaleCover = Math.max(widthPx / img.width, heightPx / img.height);
      const effectiveScale = scaleCover * zoom;
      const drawnW = img.width * effectiveScale;
      const drawnH = img.height * effectiveScale;

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

      // Render Name & Date strip if enabled
      if (addNameDate && (candidateName.trim() || photoDate.trim())) {
        const stripHeight = Math.round(heightPx * 0.17);
        const stripY = heightPx - stripHeight;

        // Clean white strip
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, stripY, widthPx, stripHeight);

        // Thin top divider line
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, stripY);
        ctx.lineTo(widthPx, stripY);
        ctx.stroke();

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
          const nameFontSize = Math.max(12, Math.round(stripHeight * 0.36));
          const dateFontSize = Math.max(11, Math.round(stripHeight * 0.30));

          ctx.font = `bold ${nameFontSize}px sans-serif`;
          ctx.fillText(nameText, widthPx / 2, stripY + stripHeight * 0.32);

          ctx.font = `600 ${dateFontSize}px sans-serif`;
          ctx.fillText(`DOP: ${formattedDate}`, widthPx / 2, stripY + stripHeight * 0.72);
        } else if (nameText) {
          const nameFontSize = Math.max(14, Math.round(stripHeight * 0.5));
          ctx.font = `bold ${nameFontSize}px sans-serif`;
          ctx.fillText(nameText, widthPx / 2, stripY + stripHeight * 0.5);
        } else if (formattedDate) {
          const dateFontSize = Math.max(13, Math.round(stripHeight * 0.5));
          ctx.font = `bold ${dateFontSize}px sans-serif`;
          ctx.fillText(`DOP: ${formattedDate}`, widthPx / 2, stripY + stripHeight * 0.5);
        }
      }

      // Border for scissor cutting
      if (hasBorder) {
        ctx.strokeStyle = '#CBD5E1';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, widthPx, heightPx);
      }
    },
    [
      imageSrc,
      cutoutSrc,
      smartCutoutSrc,
      useOriginalBg,
      getActiveBgColor,
      zoom,
      panX,
      panY,
      rotation,
      addNameDate,
      candidateName,
      photoDate,
      hasBorder,
    ]
  );

  // Render Full Print Sheet (4x6 or A4) - STRICTLY ZERO WATERMARK / ZERO BRANDING
  const renderSheetToCanvas = useCallback(
    async (targetCanvas: HTMLCanvasElement): Promise<void> => {
      // 1. Render a clean single photo offscreen first
      const singleCanvas = document.createElement('canvas');
      await renderSinglePhotoToCanvas(singleCanvas);

      const dpi = 300;
      let sheetW_mm = paperSize === '4x6' ? 101.6 : 210.0;
      let sheetH_mm = paperSize === '4x6' ? 152.4 : 297.0;

      const isLandscape4x6 = paperSize === '4x6' && copiesCount === 8;
      if (isLandscape4x6) {
        sheetW_mm = 152.4;
        sheetH_mm = 101.6;
      }

      const sheetWidthPx = Math.round((sheetW_mm / 25.4) * dpi);
      const sheetHeightPx = Math.round((sheetH_mm / 25.4) * dpi);

      targetCanvas.width = sheetWidthPx;
      targetCanvas.height = sheetHeightPx;
      const ctx = targetCanvas.getContext('2d');
      if (!ctx) return;

      // Pure White Clean Sheet - NO WATERMARKS, NO LOGOS, ZERO BRANDING
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, sheetWidthPx, sheetHeightPx);

      // Passport photo standard: 35 mm × 45 mm
      const photoW_mm = 35;
      const photoH_mm = 45;
      const photoW_px = Math.round((photoW_mm / 25.4) * dpi);
      const photoH_px = Math.round((photoH_mm / 25.4) * dpi);

      let cols = 2;
      let rows = 3;
      let marginX_mm = 10;
      let marginY_mm = 6;
      let gapX_mm = 4;
      let gapY_mm = 4;

      if (paperSize === '4x6') {
        if (isLandscape4x6) {
          cols = 4;
          rows = 2;
          gapX_mm = 2.5;
          gapY_mm = 4;
          const totalW_mm = cols * photoW_mm + (cols - 1) * gapX_mm;
          const totalH_mm = rows * photoH_mm + (rows - 1) * gapY_mm;
          marginX_mm = Math.max(2, (sheetW_mm - totalW_mm) / 2);
          marginY_mm = Math.max(2, (sheetH_mm - totalH_mm) / 2);
        } else {
          cols = 2;
          rows = 3;
          gapX_mm = 4;
          gapY_mm = 4.5;
          const totalW_mm = cols * photoW_mm + (cols - 1) * gapX_mm;
          const totalH_mm = rows * photoH_mm + (rows - 1) * gapY_mm;
          marginX_mm = (sheetW_mm - totalW_mm) / 2;
          marginY_mm = (sheetH_mm - totalH_mm) / 2;
        }
      } else {
        if (copiesCount > 24) {
          cols = 4;
          rows = 8;
          gapX_mm = 4;
          gapY_mm = 2;
        } else {
          cols = 4;
          rows = 6;
          gapX_mm = 5;
          gapY_mm = 4;
        }
        const totalW_mm = cols * photoW_mm + (cols - 1) * gapX_mm;
        const totalH_mm = rows * photoH_mm + (rows - 1) * gapY_mm;
        marginX_mm = Math.max(4, (sheetW_mm - totalW_mm) / 2);
        marginY_mm = Math.max(4, (sheetH_mm - totalH_mm) / 2);
      }

      const marginX_px = Math.round((marginX_mm / 25.4) * dpi);
      const marginY_px = Math.round((marginY_mm / 25.4) * dpi);
      const gapX_px = Math.round((gapX_mm / 25.4) * dpi);
      const gapY_px = Math.round((gapY_mm / 25.4) * dpi);

      const maxSlots = cols * rows;
      const targetCount = fillMode === 'full' ? maxSlots : Math.min(copiesCount, maxSlots);

      let placed = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (placed >= targetCount) break;

          const x = marginX_px + c * (photoW_px + gapX_px);
          const y = marginY_px + r * (photoH_px + gapY_px);

          // Draw the photo
          ctx.drawImage(singleCanvas, x, y, photoW_px, photoH_px);

          // Draw scissor cutting guide border
          if (hasBorder) {
            ctx.strokeStyle = '#D1D5DB';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, photoW_px, photoH_px);
          }

          placed++;
        }
        if (placed >= targetCount) break;
      }
    },
    [paperSize, copiesCount, fillMode, hasBorder, renderSinglePhotoToCanvas]
  );

  // Trigger re-render whenever settings change
  useEffect(() => {
    if (!imageSrc) return;
    const timer = setTimeout(async () => {
      if (sheetCanvasRef.current) {
        await renderSheetToCanvas(sheetCanvasRef.current);
      }
      if (singleCanvasRef.current) {
        await renderSinglePhotoToCanvas(singleCanvasRef.current);
      }
    }, 60);
    return () => clearTimeout(timer);
  }, [
    imageSrc,
    cutoutSrc,
    smartCutoutSrc,
    useOriginalBg,
    selectedBgId,
    customBgColor,
    zoom,
    panX,
    panY,
    rotation,
    paperSize,
    copiesCount,
    fillMode,
    hasBorder,
    addNameDate,
    candidateName,
    photoDate,
    renderSheetToCanvas,
    renderSinglePhotoToCanvas,
  ]);

  // Direct 1-Click Print (Ctrl + P support)
  const handleDirectPrint = async () => {
    if (!sheetCanvasRef.current) return;
    setIsPrinting(true);
    setStatusMessage('Preparing high-res print dialog...');

    try {
      const dataUrl = sheetCanvasRef.current.toDataURL('image/jpeg', 0.98);

      const isLandscape4x6 = paperSize === '4x6' && copiesCount === 8;
      const pageSize = paperSize === '4x6' ? (isLandscape4x6 ? '6in 4in' : '4in 6in') : 'A4';

      const printIframe = document.createElement('iframe');
      printIframe.style.position = 'fixed';
      printIframe.style.right = '0';
      printIframe.style.bottom = '0';
      printIframe.style.width = '0';
      printIframe.style.height = '0';
      printIframe.style.border = '0';
      document.body.appendChild(printIframe);

      const iframeDoc = printIframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error('Cannot access print document');
      }

      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Passport Photo Print Sheet (${copiesCount} Copies)</title>
            <style>
              @page {
                size: ${pageSize};
                margin: 0;
              }
              html, body {
                margin: 0;
                padding: 0;
                width: 100%;
                height: 100%;
                background: #FFFFFF;
                display: flex;
                align-items: center;
                justify-content: center;
              }
              img {
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
              }
            </style>
          </head>
          <body>
            <img src="${dataUrl}" onload="setTimeout(() => { window.print(); }, 150);" />
          </body>
        </html>
      `);
      iframeDoc.close();

      trackDownload('cyber-cafe-passport-photo-maker');
      trackProcessingSuccess({
        tool: 'cyber-cafe-passport-photo-maker',
        toolName: 'Cyber Cafe Passport Photo Sheet',
        fileType: 'image',
      });

      setTimeout(() => {
        try {
          document.body.removeChild(printIframe);
        } catch {
          // ignore
        }
        setIsPrinting(false);
        setStatusMessage('Print dialog opened.');
      }, 2000);
    } catch (err) {
      console.error('Print failed:', err);
      setIsPrinting(false);
      window.print();
    }
  };

  // Download High-Resolution Sheet JPG (300 DPI)
  const handleDownloadSheetJpg = () => {
    if (!sheetCanvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${imageFilename}_${copiesCount}_passport_photos_${paperSize}.jpg`;
    link.href = sheetCanvasRef.current.toDataURL('image/jpeg', 0.98);
    link.click();
    trackDownload('cyber-cafe-passport-photo-maker');
    setStatusMessage(`Downloaded ${copiesCount} photo sheet (300 DPI JPG).`);
  };

  // Download Print-Ready PDF via jsPDF
  const handleDownloadPdf = async () => {
    if (!sheetCanvasRef.current) return;
    setIsProcessing(true);
    setStatusMessage('Generating print-ready PDF...');

    try {
      const { jsPDF } = await import('jspdf');

      const isLandscape4x6 = paperSize === '4x6' && copiesCount === 8;
      const orientation = isLandscape4x6 ? 'landscape' : 'portrait';
      const widthMm = paperSize === '4x6' ? (isLandscape4x6 ? 152.4 : 101.6) : 210.0;
      const heightMm = paperSize === '4x6' ? (isLandscape4x6 ? 101.6 : 152.4) : 297.0;

      const pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: paperSize === '4x6' ? [widthMm, heightMm] : 'a4',
      });

      const imgData = sheetCanvasRef.current.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData, 'JPEG', 0, 0, widthMm, heightMm, undefined, 'FAST');

      pdf.save(`${imageFilename}_passport_sheet_${paperSize}.pdf`);
      trackDownload('cyber-cafe-passport-photo-maker');
      setStatusMessage('PDF download complete.');
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      setStatusMessage('PDF export error. Try downloading JPG instead.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Download Single 3.5 × 4.5 cm Photo (for online portal upload)
  const handleDownloadSingleJpg = () => {
    if (!singleCanvasRef.current) return;
    const link = document.createElement('a');
    link.download = `${imageFilename}_3.5x4.5cm_passport.jpg`;
    link.href = singleCanvasRef.current.toDataURL('image/jpeg', 0.95);
    link.click();
    trackDownload('cyber-cafe-passport-photo-maker');
    setStatusMessage('Downloaded single 3.5×4.5 cm passport photo.');
  };

  // Panning drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialPanX: panX,
      initialPanY: panY,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPanX(dragStartRef.current.initialPanX + dx);
    setPanY(dragStartRef.current.initialPanY + dy);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner / Hero Badge */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-[#414FA8] rounded-xl p-5 sm:p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Cyber Cafe & CSC Digital Seva Special Edition</span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight">
              Cyber Cafe Passport Photo Sheet Maker (4×6 & A4)
            </h1>
            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl">
              Upload 1 Photo &rarr; Auto White or Studio Blue Background &rarr; Line up 6, 8, 12, or 32 photos on 4×6" photo paper.
              Zero watermark, scissor cutting lines, instant Ctrl+P direct print.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-300" /> 100% Free & No Watermark
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Controls & Customization (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Step 1: Upload Box */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#414FA8] text-white text-xs font-bold">1</span>
                <span>Upload Candidate Photo</span>
              </h2>
              {imageSrc && (
                <button
                  onClick={() => {
                    setRawFile(null);
                    setImageSrc(null);
                    setCutoutSrc(null);
                    setSmartCutoutSrc(null);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp,image/jpg"
              onChange={handleFileUpload}
              className="hidden"
              id="cyber-cafe-photo-input"
            />

            {!imageSrc ? (
              <label
                htmlFor="cyber-cafe-photo-input"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50/50 hover:bg-blue-50 cursor-pointer transition-colors text-center"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-[#414FA8] mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-gray-800">Click to Upload or Drag & Drop Photo</span>
                <span className="text-xs text-gray-500 mt-1">Accepts JPG, PNG, WEBP (Phone photo, Selfie, or Studio snap)</span>
                <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-[11px] font-semibold">
                  ⚡ Auto Changes to Studio Blue on Upload
                </span>
              </label>
            ) : (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-3 truncate">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageSrc}
                    alt="Uploaded thumbnail"
                    className="w-12 h-12 rounded object-cover border border-gray-300"
                  />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-gray-800 truncate">{imageFilename}</p>
                    <p className="text-[11px] text-gray-500">
                      {imageNaturalSize ? `${imageNaturalSize.width} × ${imageNaturalSize.height} px` : 'Loaded'}
                    </p>
                  </div>
                </div>
                <label
                  htmlFor="cyber-cafe-photo-input"
                  className="px-2.5 py-1.5 text-xs bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-100 font-medium cursor-pointer"
                >
                  Change
                </label>
              </div>
            )}
          </div>

          {/* Step 2: Background Selector (Studio Colors + Instant Trigger) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#414FA8] text-white text-xs font-bold">2</span>
                <span>Select Background Color (1-Click)</span>
              </h2>
              {isRemovingBg ? (
                <span className="text-[11px] font-bold text-blue-600 flex items-center gap-1 animate-pulse">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Processing AI... {bgRemovalProgress}%
                </span>
              ) : cutoutSrc ? (
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> AI Cutout Active
                </span>
              ) : (
                <span className="text-[11px] font-medium text-gray-500 flex items-center gap-1">
                  <Wand2 className="w-3.5 h-3.5 text-blue-500" /> Click to Apply
                </span>
              )}
            </div>

            {/* AI Status / Re-cut bar */}
            {isRemovingBg && (
              <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-800 space-y-1">
                <div className="flex items-center justify-between font-semibold">
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#414FA8]" />
                    <span>Removing background &amp; applying color...</span>
                  </span>
                  <span>{bgRemovalProgress}%</span>
                </div>
                <div className="w-full bg-blue-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#414FA8] h-full transition-all duration-300"
                    style={{ width: `${Math.max(10, bgRemovalProgress)}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Color Swatches Grid */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-700">Choose Studio Background Color:</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {STUDIO_BG_COLORS.map((color) => {
                  const isSelected = selectedBgId === color.id && !useOriginalBg;
                  return (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => handleSelectColor(color.id)}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                        isSelected
                          ? 'border-[#414FA8] ring-2 ring-[#414FA8]/30 shadow-xs bg-blue-50/50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <span
                        className="w-8 h-8 rounded-full border shadow-inner mb-1 flex items-center justify-center"
                        style={{ backgroundColor: color.hex, borderColor: color.border }}
                      >
                        {isSelected && (
                          <Check
                            className={`w-4 h-4 ${color.id === 'white' || color.id === 'cream' ? 'text-gray-900' : 'text-white'}`}
                          />
                        )}
                      </span>
                      <span className="text-[11px] font-semibold text-gray-800 leading-tight">{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Original Background Toggle & Custom Color */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
              <button
                type="button"
                onClick={handleToggleOriginalBg}
                className={`px-3 py-1.5 rounded border font-medium transition-colors ${
                  useOriginalBg
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                Keep Original Background
              </button>

              <div className="flex items-center gap-1.5">
                <span className="text-gray-600 text-[11px]">Custom Color:</span>
                <input
                  type="color"
                  value={customBgColor}
                  onChange={(e) => {
                    setCustomBgColor(e.target.value);
                    handleSelectColor('custom');
                  }}
                  className="w-7 h-7 rounded border border-gray-300 cursor-pointer p-0.5 bg-white"
                  title="Choose custom background color"
                />
              </div>
            </div>

            {aiErrorMsg && (
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded border border-amber-200 font-medium">
                {aiErrorMsg}
              </p>
            )}
          </div>

          {/* Step 3: Cyber Cafe Sheet Setup (Photo Count & 4x6 / A4) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 sm:p-5 space-y-4">
            <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#414FA8] text-white text-xs font-bold">3</span>
              <span>How Many Photos Do You Need?</span>
            </h2>

            {/* Quick Presets for Cyber Cafe */}
            <div className="space-y-2">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {QUICK_PACKS.map((pack) => {
                  const isSelected = copiesCount === pack.count && paperSize === pack.paper;
                  return (
                    <button
                      key={pack.count}
                      type="button"
                      onClick={() => {
                        setCopiesCount(pack.count);
                        setPaperSize(pack.paper as '4x6' | 'a4');
                      }}
                      className={`relative p-2.5 rounded-lg border text-left transition-all ${
                        isSelected
                          ? 'border-[#414FA8] bg-blue-50/60 ring-2 ring-[#414FA8]/20 shadow-xs'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      {pack.popular && (
                        <span className="absolute -top-2 right-2 px-1.5 py-0.2 bg-amber-500 text-white text-[9px] font-bold rounded-full uppercase">
                          Hot
                        </span>
                      )}
                      <p className="text-xs font-bold text-gray-900">{pack.label}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{pack.paper === '4x6' ? '4×6" Paper' : 'A4 Sheet'}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Detailed Controls: Paper Size & Custom Count */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Paper Type:</label>
                <select
                  value={paperSize}
                  onChange={(e) => setPaperSize(e.target.value as '4x6' | 'a4')}
                  className="w-full text-xs font-semibold p-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-[#414FA8] focus:outline-hidden"
                >
                  <option value="4x6">4 × 6 Inch (10×15 cm) Photo Paper</option>
                  <option value="a4">A4 Sheet (210 × 297 mm)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Photo Count:</label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCopiesCount(Math.max(1, copiesCount - 1))}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={paperSize === '4x6' ? 12 : 36}
                    value={copiesCount}
                    onChange={(e) => setCopiesCount(Math.max(1, Math.min(36, parseInt(e.target.value) || 1)))}
                    className="w-full text-center text-xs font-bold p-1.5 border border-gray-300 rounded-lg bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setCopiesCount(Math.min(paperSize === '4x6' ? 12 : 36, copiesCount + 1))}
                    className="w-8 h-8 rounded border border-gray-300 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Layout Options: Fill Mode & Scissor Cut Borders */}
            <div className="space-y-2 pt-2 border-t border-gray-100 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700 flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-gray-500" /> Thin Scissor Cutting Border:
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasBorder}
                    onChange={(e) => setHasBorder(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#414FA8]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-gray-700">Fill Mode:</span>
                <div className="inline-flex rounded-md shadow-xs" role="group">
                  <button
                    type="button"
                    onClick={() => setFillMode('exact')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-l-md border ${
                      fillMode === 'exact'
                        ? 'bg-[#414FA8] text-white border-[#414FA8]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Exact ({copiesCount} Copies)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFillMode('full')}
                    className={`px-2.5 py-1 text-[11px] font-semibold rounded-r-md border-t border-b border-r ${
                      fillMode === 'full'
                        ? 'bg-[#414FA8] text-white border-[#414FA8]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Fill Entire Page
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Govt Exam Strip (Candidate Name & Date of Photo) */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#414FA8]" />
                <span>Name & Date on Photo (SSC / UPSC / Police)</span>
              </h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={addNameDate}
                  onChange={(e) => setAddNameDate(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#414FA8]"></div>
              </label>
            </div>

            {addNameDate && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Candidate Name:</label>
                  <input
                    type="text"
                    placeholder="e.g. RAHUL SHARMA"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold uppercase bg-white focus:ring-2 focus:ring-[#414FA8] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Date of Photo (DOP):</label>
                  <input
                    type="text"
                    placeholder="DD/MM/YYYY"
                    value={photoDate}
                    onChange={(e) => setPhotoDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg text-xs font-semibold bg-white focus:ring-2 focus:ring-[#414FA8] focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Sheet Preview & Direct Print Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Action Header Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('sheet')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === 'sheet' ? 'bg-[#414FA8] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📄 {paperSize === '4x6' ? '4×6" Print Sheet' : 'A4 Print Sheet'} ({copiesCount} Copies)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('single')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === 'single' ? 'bg-[#414FA8] text-white shadow-xs' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👤 Single Photo (3.5×4.5 cm)
              </button>
            </div>

            {/* Zero Watermark Pill */}
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Pure Clean Sheet (0 Watermark)
            </span>
          </div>

          {/* Interactive Alignment Controls Bar */}
          {imageSrc && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-gray-700 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-[#414FA8]" /> Face Zoom:
                </span>
                <input
                  type="range"
                  min="0.8"
                  max="2.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-24 sm:w-32 accent-[#414FA8] cursor-pointer"
                />
                <span className="font-bold text-gray-700 min-w-8">{Math.round(zoom * 100)}%</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1.5 rounded border border-gray-200 hover:bg-gray-100 text-gray-700"
                  title="Rotate 90 degrees"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setShowFaceGuide(!showFaceGuide)}
                  className={`px-2 py-1 rounded border text-[11px] font-semibold ${
                    showFaceGuide ? 'bg-blue-50 text-[#414FA8] border-blue-200' : 'bg-white text-gray-600 border-gray-200'
                  }`}
                >
                  Biometric Face Guide
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setZoom(1.0);
                    setPanX(0);
                    setPanY(0);
                    setRotation(0);
                  }}
                  className="text-gray-500 hover:text-gray-800 text-[11px] font-medium"
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* Canvas Preview Area */}
          <div className="bg-[#E5E7EB] rounded-xl border border-gray-300 p-4 sm:p-6 flex flex-col items-center justify-center min-h-[460px] relative overflow-hidden shadow-inner">
            {!imageSrc ? (
              <div className="text-center p-8 max-w-sm">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 mx-auto mb-3">
                  <Printer className="w-8 h-8 text-[#414FA8]" />
                </div>
                <h3 className="text-base font-bold text-gray-800">Print Sheet Preview Area</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Upload a photo on the left to instantly generate a 6, 8, 12, or 32 passport photo sheet formatted for 4×6"
                  or A4 paper.
                </p>
              </div>
            ) : (
              <div className="relative flex items-center justify-center max-w-full">
                {/* Processing Overlay over Preview */}
                {isRemovingBg && (
                  <div className="absolute inset-0 z-20 bg-black/40 backdrop-blur-xs rounded flex flex-col items-center justify-center text-white p-4">
                    <Loader2 className="w-8 h-8 animate-spin text-white mb-2" />
                    <p className="text-sm font-bold">Removing Background with AI...</p>
                    <p className="text-xs text-blue-200 mt-0.5">{bgRemovalProgress}% complete</p>
                  </div>
                )}

                {/* Printable Sheet View */}
                <div className={`transition-all ${activeTab === 'sheet' ? 'block' : 'hidden'}`}>
                  <canvas
                    ref={sheetCanvasRef}
                    className="max-h-[520px] max-w-full object-contain bg-white shadow-2xl rounded-[2px] border border-gray-300"
                  />
                  <p className="text-center text-[11px] text-gray-600 mt-2 font-medium">
                    Sheet Dimensions: {paperSize === '4x6' ? '4 × 6 Inch (101.6 × 152.4 mm)' : 'A4 (210 × 297 mm)'} • 300
                    DPI • {copiesCount} Passport Photos
                  </p>
                </div>

                {/* Single Photo View with Interactive Pan/Zoom */}
                <div
                  className={`relative cursor-grab active:cursor-grabbing ${activeTab === 'single' ? 'block' : 'hidden'}`}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <canvas
                    ref={singleCanvasRef}
                    className="w-[280px] h-[360px] object-contain bg-white shadow-xl rounded border border-gray-300 select-none"
                  />

                  {/* Biometric Oval Face Guide Overlay */}
                  {showFaceGuide && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                      <div className="w-[170px] h-[230px] rounded-[50%] border-2 border-dashed border-blue-500/60 bg-blue-500/5 relative">
                        {/* Eye level line */}
                        <div className="absolute top-[42%] left-2 right-2 border-t border-blue-400/50"></div>
                        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-blue-600 bg-white/80 px-1 rounded">
                          Crown
                        </span>
                        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-bold text-blue-600 bg-white/80 px-1 rounded">
                          Chin
                        </span>
                      </div>
                      <span className="text-[10px] text-blue-600 font-bold bg-white/90 px-2 py-0.5 rounded shadow-xs mt-1">
                        Drag to Center Face (70-80% biometric frame)
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Cyber Cafe Primary Action Buttons (Print + Download) */}
          {imageSrc && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1-Click Direct Print */}
                <button
                  type="button"
                  onClick={handleDirectPrint}
                  disabled={isPrinting}
                  className="sm:col-span-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  {isPrinting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Opening Print...</span>
                    </>
                  ) : (
                    <>
                      <Printer className="w-5 h-5" />
                      <span>Direct Print (Ctrl+P)</span>
                    </>
                  )}
                </button>

                {/* Download 300 DPI HD JPG */}
                <button
                  type="button"
                  onClick={handleDownloadSheetJpg}
                  className="py-3 px-4 rounded-xl bg-[#414FA8] hover:bg-[#343f88] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Sheet (300 DPI JPG)</span>
                </button>

                {/* Download Print-Ready PDF */}
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  disabled={isProcessing}
                  className="py-3 px-4 rounded-xl bg-gray-900 hover:bg-black text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <FileCheck className="w-4 h-4 text-emerald-400" />
                  )}
                  <span>Download PDF Sheet</span>
                </button>
              </div>

              {/* Secondary Download: Single Photo */}
              <div className="flex flex-wrap items-center justify-between pt-2 border-t border-gray-100 text-xs">
                <button
                  type="button"
                  onClick={handleDownloadSingleJpg}
                  className="text-gray-700 hover:text-[#414FA8] font-semibold flex items-center gap-1.5 py-1 px-2 rounded hover:bg-gray-50"
                >
                  <Download className="w-3.5 h-3.5 text-gray-500" />
                  <span>Download Single 3.5×4.5 cm Photo (for Online Forms)</span>
                </button>

                <div className="flex items-center gap-2">
                  <WhatsAppShareButton title="SizeSnap Cyber Cafe Passport Photo Sheet Maker (No Watermark)" />
                </div>
              </div>

              {/* Status Message Notification */}
              {statusMessage && (
                <p className="text-xs text-center text-gray-500 font-medium pt-1">{statusMessage}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
