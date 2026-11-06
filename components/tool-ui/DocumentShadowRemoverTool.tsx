'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { getPdfJs, getPdfCMapConfig } from '@/lib/pdfjs';
import { formatBytes } from '@/lib/format-utils';
import { trackProcessingSuccess, trackProcessingError, trackDownload } from '@/lib/firebase';
import { WhatsAppShareButton } from '@/components/WhatsAppShareButton';
import {
  Upload,
  Camera,
  Trash2,
  Download,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  Sun,
  Contrast,
  Sparkles,
  RotateCw,
  Eye,
  FilePlus,
  Layers,
  Sliders,
  Bookmark,
  Share2,
} from 'lucide-react';

export type ShadowFilterMode = 'bw' | 'color' | 'sharpen' | 'original';

interface ProcessedPage {
  id: string;
  name: string;
  originalDataUrl: string;
  cleanedDataUrl: string;
  width: number;
  height: number;
  originalSize: number;
  cleanedSize: number;
  filterMode: ShadowFilterMode;
}

export function DocumentShadowRemoverTool() {
  const [pages, setPages] = useState<ProcessedPage[]>([]);
  const [activePageIdx, setActivePageIdx] = useState<number>(0);
  const [filterMode, setFilterMode] = useState<ShadowFilterMode>('bw');
  const [paperWhiteness, setPaperWhiteness] = useState<number>(85); // 50 to 100
  const [textDarkness, setTextDarkness] = useState<number>(75); // 30 to 100
  const [showOriginal, setShowOriginal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [loadingMsg, setLoadingMsg] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  // Process a single image canvas with adaptive shadow removal & paper whitening
  const applyShadowRemoval = useCallback(
    (
      img: HTMLImageElement,
      mode: ShadowFilterMode,
      whiteness: number,
      darkness: number
    ): { dataUrl: string; size: number } => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return { dataUrl: img.src, size: 0 };

      ctx.drawImage(img, 0, 0);

      if (mode === 'original') {
        const url = canvas.toDataURL('image/jpeg', 0.92);
        return { dataUrl: url, size: Math.round((url.length * 3) / 4) };
      }

      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      const len = data.length;

      // Dynamic thresholds from user sliders
      // whiteness (50-100) -> threshold where paper turns pure white (lower = more aggressive shadow removal)
      const whiteThreshold = 255 - (whiteness / 100) * 90; // e.g. 85 -> ~178
      // darkness (30-100) -> threshold where ink turns dark
      const darkThreshold = (darkness / 100) * 110; // e.g. 75 -> ~82

      if (mode === 'bw') {
        // Clean Xerox Photocopy Black & White
        for (let i = 0; i < len; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;

          let v: number;
          if (gray >= whiteThreshold) {
            v = 255; // Clean pure white paper (erases dark shadows)
          } else if (gray <= darkThreshold) {
            v = Math.max(0, gray * 0.5); // Deep sharp black ink
          } else {
            // Smooth transition
            const ratio = (gray - darkThreshold) / (whiteThreshold - darkThreshold);
            v = Math.min(255, Math.max(0, ratio * 255));
          }

          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
        }
      } else if (mode === 'color') {
        // Color Document Mode: Whiten background while preserving color stamps, logos & photos
        for (let i = 0; i < len; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;

          let gain = 1.0;
          if (gray >= whiteThreshold) {
            gain = 255 / Math.max(1, gray);
          } else if (gray <= darkThreshold) {
            gain = 0.75;
          } else {
            const ratio = (gray - darkThreshold) / (whiteThreshold - darkThreshold);
            gain = 0.75 + ratio * 0.5;
          }

          data[i] = Math.min(255, Math.round(r * gain));
          data[i + 1] = Math.min(255, Math.round(g * gain));
          data[i + 2] = Math.min(255, Math.round(b * gain));
        }
      } else if (mode === 'sharpen') {
        // High Contrast / Magic Sharpen (For faded pencil marks or old carbon copies)
        for (let i = 0; i < len; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;

          let v: number;
          if (gray > whiteThreshold - 15) {
            v = 255;
          } else if (gray < darkThreshold + 20) {
            v = 0; // Pure solid black ink
          } else {
            v = gray > 140 ? 255 : 0; // Binary threshold
          }

          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
        }
      }

      ctx.putImageData(imgData, 0, 0);
      const cleanedUrl = canvas.toDataURL('image/jpeg', 0.92);
      return { dataUrl: cleanedUrl, size: Math.round((cleanedUrl.length * 3) / 4) };
    },
    []
  );

  // Re-process active page when user adjusts filters or sliders
  const reprocessActivePage = useCallback(
    (targetMode: ShadowFilterMode, targetWhiteness: number, targetDarkness: number) => {
      if (pages.length === 0 || activePageIdx < 0 || activePageIdx >= pages.length) return;

      const page = pages[activePageIdx];
      const img = new window.Image();
      img.onload = () => {
        const result = applyShadowRemoval(img, targetMode, targetWhiteness, targetDarkness);
        setPages((prev) =>
          prev.map((p, idx) =>
            idx === activePageIdx
              ? {
                  ...p,
                  cleanedDataUrl: result.dataUrl,
                  cleanedSize: result.size,
                  filterMode: targetMode,
                }
              : p
          )
        );
      };
      img.src = page.originalDataUrl;
    },
    [pages, activePageIdx, applyShadowRemoval]
  );

  // Handle image files
  const processImageFile = async (file: File): Promise<ProcessedPage> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const originalUrl = reader.result as string;
        const img = new window.Image();
        img.onload = () => {
          const result = applyShadowRemoval(img, filterMode, paperWhiteness, textDarkness);
          resolve({
            id: Math.random().toString(36).substring(2, 9),
            name: file.name,
            originalDataUrl: originalUrl,
            cleanedDataUrl: result.dataUrl,
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
            originalSize: file.size,
            cleanedSize: result.size,
            filterMode,
          });
        };
        img.onerror = () => reject(new Error(`Failed to load ${file.name}`));
        img.src = originalUrl;
      };
      reader.onerror = () => reject(new Error(`Failed to read ${file.name}`));
      reader.readAsDataURL(file);
    });
  };

  // Handle PDF files (render PDF pages into clean images)
  const processPdfFile = async (file: File): Promise<ProcessedPage[]> => {
    const pdfjs = await getPdfJs();
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjs.getDocument({
      data: arrayBuffer,
      ...getPdfCMapConfig(),
    }).promise;

    const newPages: ProcessedPage[] = [];

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      setLoadingMsg(`Extracting PDF page ${pageNum} of ${pdf.numPages}...`);
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2.0 }); // 2x high-res rendering

      const canvas = document.createElement('canvas');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext('2d')!;

      await page.render({
        canvas,
        canvasContext: ctx,
        viewport,
      }).promise;

      const originalDataUrl = canvas.toDataURL('image/jpeg', 0.92);

      const img = new window.Image();
      await new Promise<void>((res) => {
        img.onload = () => res();
        img.src = originalDataUrl;
      });

      const result = applyShadowRemoval(img, filterMode, paperWhiteness, textDarkness);

      newPages.push({
        id: Math.random().toString(36).substring(2, 9),
        name: `${file.name.replace(/\.pdf$/i, '')}_page_${pageNum}.jpg`,
        originalDataUrl,
        cleanedDataUrl: result.dataUrl,
        width: canvas.width,
        height: canvas.height,
        originalSize: Math.round(file.size / pdf.numPages),
        cleanedSize: result.size,
        filterMode,
      });
    }

    return newPages;
  };

  // Main files intake handler
  const handleFiles = async (fileList: FileList | File[]) => {
    setErrorMsg(null);
    setIsProcessing(true);
    setLoadingMsg('Analyzing document and removing camera shadows...');

    try {
      const incoming = Array.from(fileList);
      const generatedPages: ProcessedPage[] = [];

      for (const file of incoming) {
        if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
          setLoadingMsg(`Processing PDF: ${file.name}...`);
          const pdfPages = await processPdfFile(file);
          generatedPages.push(...pdfPages);
        } else if (file.type.startsWith('image/')) {
          setLoadingMsg(`Removing shadows from ${file.name}...`);
          const imgPage = await processImageFile(file);
          generatedPages.push(imgPage);
        }
      }

      if (generatedPages.length > 0) {
        setPages((prev) => [...prev, ...generatedPages]);
        setActivePageIdx((prev) => (prev < 0 ? 0 : prev));

        trackProcessingSuccess({
          tool: 'remove-shadow-from-document',
          fileType: incoming[0]?.type.includes('pdf') ? 'pdf' : 'image',
          inputKb: Math.round(incoming[0]?.size / 1024),
          outputKb: Math.round(generatedPages[0]?.cleanedSize / 1024),
        });
      } else {
        setErrorMsg('Please upload a valid document image (JPG, PNG) or PDF file.');
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to process document. Please try a different file.');
      trackProcessingError('remove-shadow-from-document', err?.message);
    } finally {
      setIsProcessing(false);
      setLoadingMsg('');
    }
  };

  // Rotate 90 degrees
  const rotatePage = (degrees: number = 90) => {
    if (pages.length === 0 || activePageIdx < 0) return;
    const page = pages[activePageIdx];

    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalHeight || img.height;
      canvas.height = img.naturalWidth || img.width;
      const ctx = canvas.getContext('2d')!;

      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((degrees * Math.PI) / 180);
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

      const rotatedOriginal = canvas.toDataURL('image/jpeg', 0.92);

      const cleanImg = new window.Image();
      cleanImg.onload = () => {
        const result = applyShadowRemoval(cleanImg, filterMode, paperWhiteness, textDarkness);
        setPages((prev) =>
          prev.map((p, idx) =>
            idx === activePageIdx
              ? {
                  ...p,
                  originalDataUrl: rotatedOriginal,
                  cleanedDataUrl: result.dataUrl,
                  width: canvas.width,
                  height: canvas.height,
                  cleanedSize: result.size,
                }
              : p
          )
        );
      };
      cleanImg.src = rotatedOriginal;
    };
    img.src = page.originalDataUrl;
  };

  // Download single clean page as JPG
  const downloadSingleJpg = () => {
    if (pages.length === 0 || activePageIdx < 0) return;
    const page = pages[activePageIdx];
    const link = document.createElement('a');
    link.href = page.cleanedDataUrl;
    link.download = `sizesnap_clean_${page.name.replace(/\.[^/.]+$/, '')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    trackDownload('remove-shadow-from-document');
  };

  // Download all pages as clean PDF
  const downloadAsPdf = async () => {
    if (pages.length === 0) return;
    setIsProcessing(true);
    setLoadingMsg('Compiling clean Xerox PDF document...');

    try {
      const { jsPDF } = await import('jspdf');
      const pdf = new jsPDF({
        orientation: pages[0].width > pages[0].height ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      for (let i = 0; i < pages.length; i++) {
        if (i > 0) {
          pdf.addPage('a4', pages[i].width > pages[i].height ? 'landscape' : 'portrait');
        }

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(pages[i].cleanedDataUrl, 'JPEG', 0, 0, pageWidth, pageHeight, undefined, 'FAST');
      }

      pdf.save(`sizesnap_clean_document_${Date.now()}.pdf`);
      trackDownload('remove-shadow-from-document');
    } catch {
      setErrorMsg('Failed to generate PDF. Please download as JPG.');
    } finally {
      setIsProcessing(false);
      setLoadingMsg('');
    }
  };

  const removePage = (id: string) => {
    setPages((prev) => prev.filter((p) => p.id !== id));
    setActivePageIdx((prev) => Math.max(0, prev - 1));
  };

  const handleReset = () => {
    setPages([]);
    setActivePageIdx(0);
    setErrorMsg(null);
  };

  const activePage = pages[activePageIdx];

  return (
    <div className="space-y-5">
      {/* Quick Cyber Cafe & Privacy Notice */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 bg-blue-50/70 border border-blue-200/80 rounded-[4px] text-xs text-blue-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#414FA8] shrink-0" />
          <span>
            <strong>Phone Photo to Clean Xerox:</strong> Removes mobile shadows, hands, and glare. Makes marksheet and Aadhaar paper 100% clean white for Sarkari portals.
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200">
          <Bookmark className="w-3 h-3 text-[#414FA8]" />
          <span>Tip: Press Ctrl+D to bookmark</span>
        </div>
      </div>

      {/* Error Alert */}
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
      {pages.length === 0 ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              handleFiles(e.dataTransfer.files);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[4px] border-2 border-dashed border-[#9AA3C8] bg-[#FAFAFC] hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-colors cursor-pointer select-none"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp,application/pdf,.pdf"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="sr-only"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="sr-only"
          />

          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-4">
            <Sun className="h-7 w-7" />
          </div>

          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Drop Document Photo or PDF Here to Remove Shadows
          </h3>
          <p className="text-xs text-gray-500 mb-5 max-w-md">
            Upload certificates, marksheet photos, Aadhaar, notes, or PDFs with dark phone shadows. Automatically whitens paper background and sharpens text like an office scanner.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs sm:text-sm font-semibold rounded-[4px] shadow-xs transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Select Document Photo / PDF</span>
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cameraInputRef.current?.click();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs sm:text-sm font-semibold rounded-[4px] border border-gray-300 transition-colors"
            >
              <Camera className="h-4 w-4 text-[#414FA8]" />
              <span>Take Photo with Camera</span>
            </button>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
            <span>Removes Dark Mobile Shadows</span>
            <span>•</span>
            <span>Supports JPG &amp; PDF</span>
            <span>•</span>
            <span>Zero server upload (100% Private)</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Top Actions & Page Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-[4px] border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-800">
                Page {activePageIdx + 1} of {pages.length}
              </span>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded border border-emerald-200">
                Shadow Removed
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => addMoreInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-[4px] border border-gray-300 transition-colors"
              >
                <FilePlus className="h-3.5 w-3.5 text-gray-600" />
                <span>Add More Pages</span>
              </button>
              <input
                ref={addMoreInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp,application/pdf,.pdf"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="sr-only"
              />

              <button
                type="button"
                onClick={() => rotatePage(90)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-[4px] border border-gray-300 transition-colors"
                title="Rotate 90 degrees"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Rotate</span>
              </button>

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

          {/* Filter Modes Bar */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                <Sun className="h-4 w-4 text-[#414FA8]" />
                <span>Shadow Removal Preset:</span>
              </span>

              {/* Before / After toggle button */}
              <button
                type="button"
                onClick={() => setShowOriginal(!showOriginal)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded border transition-colors ${
                  showOriginal
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showOriginal ? 'Showing: Original (With Shadow)' : 'Hold to See Original'}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                {
                  id: 'bw' as ShadowFilterMode,
                  title: 'Xerox Clean (B&W)',
                  desc: 'Erases all shadows. Crisp white paper.',
                  badge: 'Recommended',
                },
                {
                  id: 'color' as ShadowFilterMode,
                  title: 'Color Document',
                  desc: 'Whitens paper, keeps color stamps.',
                },
                {
                  id: 'sharpen' as ShadowFilterMode,
                  title: 'Magic Sharpen',
                  desc: 'High contrast for faded notes.',
                },
                {
                  id: 'original' as ShadowFilterMode,
                  title: 'Raw Original',
                  desc: 'Original photo without filters.',
                },
              ].map((btn) => {
                const isActive = filterMode === btn.id;
                return (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => {
                      setFilterMode(btn.id);
                      reprocessActivePage(btn.id, paperWhiteness, textDarkness);
                    }}
                    className={`p-2.5 text-left rounded-[4px] border transition-all ${
                      isActive
                        ? 'bg-[#EEF1FB] border-[#414FA8] shadow-xs'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${isActive ? 'text-[#414FA8]' : 'text-gray-900'}`}>
                        {btn.title}
                      </span>
                      {btn.badge && (
                        <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-1 py-0.2 rounded">
                          {btn.badge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{btn.desc}</span>
                  </button>
                );
              })}
            </div>

            {/* Fine-Tuning Sliders */}
            <div className="pt-2 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-gray-700">
                  <span>Paper Whitening / Shadow Eraser</span>
                  <span className="font-mono text-[#414FA8]">{paperWhiteness}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="100"
                  value={paperWhiteness}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setPaperWhiteness(val);
                    reprocessActivePage(filterMode, val, textDarkness);
                  }}
                  className="w-full accent-[#414FA8] cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-gray-700">
                  <span>Text &amp; Ink Darkness</span>
                  <span className="font-mono text-[#414FA8]">{textDarkness}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={textDarkness}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTextDarkness(val);
                    reprocessActivePage(filterMode, paperWhiteness, val);
                  }}
                  className="w-full accent-[#414FA8] cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Main Visual Preview Area */}
          {activePage && (
            <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs flex flex-col items-center">
              <div className="relative max-h-[550px] w-full flex items-center justify-center bg-gray-900/5 rounded p-2 overflow-hidden border border-gray-200">
                <img
                  src={showOriginal ? activePage.originalDataUrl : activePage.cleanedDataUrl}
                  alt={activePage.name}
                  className="max-h-[500px] max-w-full object-contain rounded shadow-md"
                />

                {showOriginal && (
                  <div className="absolute top-4 left-4 bg-amber-600 text-white text-[11px] font-bold px-2 py-1 rounded shadow">
                    Viewing Raw Original (With Shadow)
                  </div>
                )}
              </div>

              {/* Page Thumbnails Shelf */}
              {pages.length > 1 && (
                <div className="flex items-center gap-2 overflow-x-auto w-full pt-3 pb-1">
                  {pages.map((p, idx) => (
                    <div
                      key={p.id}
                      onClick={() => setActivePageIdx(idx)}
                      className={`relative w-16 h-20 shrink-0 rounded cursor-pointer border-2 overflow-hidden transition-all ${
                        activePageIdx === idx
                          ? 'border-[#414FA8] ring-2 ring-[#414FA8]/20'
                          : 'border-gray-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={p.cleanedDataUrl} alt={p.name} className="w-full h-full object-cover" />
                      <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[9px] px-1 font-bold">
                        {idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removePage(p.id);
                        }}
                        className="absolute top-0.5 right-0.5 p-0.5 bg-red-600 text-white rounded-full hover:bg-red-700"
                        title="Delete page"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Export Action Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              disabled={isProcessing}
              onClick={downloadAsPdf}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#414FA8] hover:bg-[#343f88] disabled:bg-gray-400 text-white text-xs sm:text-sm font-semibold rounded-[4px] shadow-xs transition-colors"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{loadingMsg || 'Generating Clean PDF...'}</span>
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4" />
                  <span>Download Clean PDF (A4 Xerox Print)</span>
                </>
              )}
            </button>

            <button
              type="button"
              disabled={isProcessing}
              onClick={downloadSingleJpg}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white text-xs sm:text-sm font-semibold rounded-[4px] shadow-xs transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download as Clean JPG</span>
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Share & Viral Trigger */}
      <div className="pt-2">
        <WhatsAppShareButton
          title="Phone Document Shadow Remover (Xerox Scanner Quality)"
          url="https://www.sizesnap.in/tools/remove-shadow-from-document"
        />
      </div>

      {/* Trust & Privacy Notice */}
      <div className="p-3 bg-white rounded-[4px] border border-gray-200 text-xs text-gray-500 flex items-center gap-2 shadow-2xs">
        <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
        <span>
          <strong>100% Client-Side Privacy:</strong> Shadow removal is performed locally in your browser memory using HTML5 Canvas. Your confidential marksheets, certificates, and Aadhaar cards are never transmitted or stored on any server.
        </span>
      </div>
    </div>
  );
}
