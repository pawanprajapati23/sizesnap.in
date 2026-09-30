'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { formatBytes } from '@/lib/format-utils';
import { useSearchParams } from 'next/navigation';
import {
  Upload,
  FileText,
  Sliders,
  Settings,
  Download,
  Trash2,
  AlertCircle,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  Target,
} from 'lucide-react';

export type CompressionPreset = 'low' | 'recommended' | 'high' | 'custom';
export type CompressionEngine = 'canvas' | 'structural';

interface PdfFileMeta {
  file: File;
  name: string;
  size: number;
  totalPages: number;
  arrayBuffer: ArrayBuffer;
}

interface CompressionResult {
  blob: Blob;
  url: string;
  size: number;
  originalSize: number;
  savedBytes: number;
  percentChange: number; // negative for reduction, positive for increase
  engineUsed: CompressionEngine;
  presetUsed: CompressionPreset;
  dpiUsed?: number;
  qualityUsed?: number;
  totalPages: number;
}

export function CompressPdfTool() {
  const searchParams = useSearchParams();
  const queryTarget = searchParams?.get('target') || searchParams?.get('kb') || searchParams?.get('size');
  const targetKb = queryTarget ? parseInt(queryTarget, 10) : null;

  const [pdfMeta, setPdfMeta] = useState<PdfFileMeta | null>(null);
  const [engine, setEngine] = useState<CompressionEngine>('canvas');

  // Custom parameters and presets (derived from targetKb or user override)
  const [userPreset, setUserPreset] = useState<CompressionPreset | null>(null);
  const [userDpi, setUserDpi] = useState<number | null>(null);
  const [userQuality, setUserQuality] = useState<number | null>(null);

  const preset: CompressionPreset = userPreset ?? (targetKb && targetKb <= 50 ? 'high' : 'recommended');
  const dpi: number = userDpi ?? (targetKb && targetKb <= 50 ? 96 : 120);
  const quality: number = userQuality ?? (targetKb && targetKb <= 50 ? 45 : 70);

  const setPreset = (p: CompressionPreset) => setUserPreset(p);
  const setDpi = (d: number) => setUserDpi(d);
  const setQuality = (q: number) => setUserQuality(q);

  // Status & Progress
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);
  const [isCompressing, setIsCompressing] = useState<boolean>(false);
  const [progressText, setProgressText] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result
  const [result, setResult] = useState<CompressionResult | null>(null);

  // Track Object URLs for memory cleanup
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load PDF.js helper
  const getPdfJs = async () => {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    return pdfjs;
  };

  // Preset configuration handler
  const handlePresetSelect = (newPreset: CompressionPreset) => {
    setPreset(newPreset);
    if (newPreset === 'low') {
      setDpi(150);
      setQuality(85);
    } else if (newPreset === 'recommended') {
      setDpi(120);
      setQuality(70);
    } else if (newPreset === 'high') {
      setDpi(96);
      setQuality(50);
    }
  };

  // Handle PDF file selection
  const handleFileSelect = async (file: File) => {
    setErrorMsg(null);
    setResult(null);

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please select a valid PDF file (.pdf).');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setErrorMsg('PDF file exceeds maximum allowed size (100MB).');
      return;
    }

    setIsLoadingPdf(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdfjs = await getPdfJs();

      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(buffer),
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
        cMapPacked: true,
      });

      const pdfDoc = await loadingTask.promise;

      setPdfMeta({
        file,
        name: file.name,
        size: file.size,
        totalPages: pdfDoc.numPages,
        arrayBuffer: buffer,
      });

      setIsLoadingPdf(false);
    } catch (err: any) {
      setIsLoadingPdf(false);
      if (err.name === 'PasswordException') {
        setErrorMsg('This PDF is password-protected. Please unlock it before compressing.');
      } else {
        setErrorMsg('Failed to open PDF. The file may be damaged, corrupted, or unsupported.');
      }
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleReset = () => {
    cleanupUrls();
    setPdfMeta(null);
    setResult(null);
    setErrorMsg(null);
    setIsCompressing(false);
    setProgressPercent(0);
    setProgressText('');
  };

  // Perform Compression
  const handleCompress = async () => {
    if (!pdfMeta) return;

    setIsCompressing(true);
    setErrorMsg(null);
    setProgressPercent(0);

    try {
      if (engine === 'structural') {
        const { PDFDocument } = await import('pdf-lib');
        // 1. Structural / Metadata stream optimization with pdf-lib
        setProgressText('Optimizing document structure & streams...');
        await new Promise((r) => setTimeout(r, 60));

        const doc = await PDFDocument.load(pdfMeta.arrayBuffer, {
          updateMetadata: false,
          ignoreEncryption: false,
        });

        // Strip non-essential metadata
        doc.setTitle('');
        doc.setAuthor('');
        doc.setSubject('');
        doc.setKeywords([]);
        doc.setProducer('SizeSnap PDF Optimizer');
        doc.setCreator('SizeSnap');

        // Save with object streams enabled
        const pdfBytes = await doc.save({
          useObjectStreams: true,
          addDefaultPage: false,
        });

        const compressedBlob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        const compressedUrl = registerUrl(URL.createObjectURL(compressedBlob));

        const saved = pdfMeta.size - compressedBlob.size;
        const pct = ((compressedBlob.size - pdfMeta.size) / pdfMeta.size) * 100;

        setResult({
          blob: compressedBlob,
          url: compressedUrl,
          size: compressedBlob.size,
          originalSize: pdfMeta.size,
          savedBytes: saved,
          percentChange: pct,
          engineUsed: 'structural',
          presetUsed: preset,
          totalPages: pdfMeta.totalPages,
        });

        setIsCompressing(false);
        return;
      }

      // 2. Canvas-based Visual Downsampling Engine (High compression for scanned/image PDFs)
      const pdfjs = await getPdfJs();
      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(pdfMeta.arrayBuffer),
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
        cMapPacked: true,
      });

      const loadedPdf = await loadingTask.promise;
      const totalPages = loadedPdf.numPages;

      const { PDFDocument } = await import('pdf-lib');
      const outputPdf = await PDFDocument.create();

      // Effective scale from 72 pt basis
      const scale = dpi / 72;
      const jpegQuality = quality / 100;

      for (let i = 1; i <= totalPages; i++) {
        const pct = Math.round(((i - 1) / totalPages) * 100);
        setProgressPercent(pct);
        setProgressText(`Compressing page ${i} of ${totalPages}... (${pct}%)`);

        const page = await loadedPdf.getPage(i);
        const viewport = page.getViewport({ scale });

        // Original unscaled points dimensions for page size
        const originalViewport = page.getViewport({ scale: 1.0 });
        const pageWidthPt = originalViewport.width;
        const pageHeightPt = originalViewport.height;

        const canvas = document.createElement('canvas');
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) {
          throw new Error('Canvas 2D context unavailable.');
        }

        // Draw white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render PDF page to canvas
        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
          background: 'rgb(255,255,255)',
        };

        await page.render(renderContext).promise;

        // Export compressed JPEG from canvas
        const dataUrl = canvas.toDataURL('image/jpeg', jpegQuality);
        const base64 = dataUrl.split(',')[1];
        const binaryStr = atob(base64);
        const len = binaryStr.length;
        const bytes = new Uint8Array(len);
        for (let j = 0; j < len; j++) {
          bytes[j] = binaryStr.charCodeAt(j);
        }

        // Embed in output PDF
        const embeddedImg = await outputPdf.embedJpg(bytes.buffer as ArrayBuffer);
        const newPage = outputPdf.addPage([pageWidthPt, pageHeightPt]);
        newPage.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: pageWidthPt,
          height: pageHeightPt,
        });

        // Release memory
        canvas.width = 0;
        canvas.height = 0;
      }

      setProgressPercent(95);
      setProgressText('Finalizing optimized PDF file...');

      const outputBytes = await outputPdf.save({
        useObjectStreams: true,
      });

      const compressedBlob = new Blob([outputBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const compressedUrl = registerUrl(URL.createObjectURL(compressedBlob));

      const saved = pdfMeta.size - compressedBlob.size;
      const pct = ((compressedBlob.size - pdfMeta.size) / pdfMeta.size) * 100;

      setResult({
        blob: compressedBlob,
        url: compressedUrl,
        size: compressedBlob.size,
        originalSize: pdfMeta.size,
        savedBytes: saved,
        percentChange: pct,
        engineUsed: 'canvas',
        presetUsed: preset,
        dpiUsed: dpi,
        qualityUsed: quality,
        totalPages: pdfMeta.totalPages,
      });

      setIsCompressing(false);
      setProgressPercent(100);
      setProgressText('');
    } catch (err: any) {
      setIsCompressing(false);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while compressing the PDF.'
      );
    }
  };

  const handleDownload = () => {
    if (!result?.url) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = 'sizesnap-compressed.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-5">
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

      {targetKb && (
        <div className="flex items-center gap-2 p-3 bg-indigo-50/90 border border-indigo-200 text-indigo-900 text-xs rounded-[4px] shadow-2xs">
          <Target className="h-4 w-4 shrink-0 text-[#414FA8]" />
          <p className="flex-1">
            Google Search Target: Auto-configured compression profile for <strong>{targetKb} KB</strong> PDF target. Upload your PDF below!
          </p>
          <span className="font-bold text-[#414FA8] bg-white px-2 py-0.5 rounded border border-indigo-200 text-[11px]">
            ~{targetKb} KB Target
          </span>
        </div>
      )}

      {/* 1. Upload Dropzone (When no PDF is loaded) */}
      {!pdfMeta && (
        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[4px] border-2 border-dashed border-[#9AA3C8] bg-[#FAFAFC] hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-colors cursor-pointer select-none"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => e.target.files && e.target.files[0] && handleFileSelect(e.target.files[0])}
            className="sr-only"
          />
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-4">
            <Upload className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Select or Drag a PDF File Here
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Compress large PDF files, reduce scanned documents for portal uploads, or optimize PDF storage. Up to 100MB.
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            disabled={isLoadingPdf}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs sm:text-sm font-semibold rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoadingPdf ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Reading PDF...</span>
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                <span>Select PDF File</span>
              </>
            )}
          </button>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
            <span>Client-side compression</span>
            <span>•</span>
            <span>100% Private (No server upload)</span>
          </div>
        </div>
      )}

      {/* 2. File Loaded: Metadata bar & Configuration */}
      {pdfMeta && (
        <div className="space-y-5">
          {/* File Overview Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-[4px] border border-gray-200 shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[4px] bg-[#EEF1FB] text-[#414FA8] border border-[#9AA3C8]/30">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate" title={pdfMeta.name}>
                  {pdfMeta.name}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-gray-500">
                  <span className="font-semibold text-gray-700">{formatBytes(pdfMeta.size)}</span>
                  <span>•</span>
                  <span>{pdfMeta.totalPages} Page{pdfMeta.totalPages > 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#9AA3C8] hover:border-[#414FA8] bg-white hover:bg-[#EEF1FB] text-[#414FA8] text-xs font-semibold transition-colors"
              >
                <span>Replace</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => e.target.files && e.target.files[0] && handleFileSelect(e.target.files[0])}
                className="sr-only"
              />

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium transition-colors"
                title="Remove PDF"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>

          {/* Compression Engine Selector */}
          <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <Settings className="h-4 w-4 text-[#414FA8]" />
              <h3 className="text-sm font-bold text-gray-900">Compression Method</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Option A: Canvas Recompression */}
              <button
                type="button"
                onClick={() => {
                  setEngine('canvas');
                  setResult(null);
                }}
                className={`p-3.5 rounded-[4px] text-left border transition-all ${
                  engine === 'canvas'
                    ? 'border-[#414FA8] bg-[#F2F4FC] ring-1 ring-[#414FA8]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-900">
                    Visual &amp; Image Compression
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-100 text-emerald-800">
                    Recommended for Portals
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed mb-2">
                  Re-renders each page to optimized resolution and JPEG quality. Best for scanned forms, photo PDFs, and government portal uploads under 1MB/500KB.
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-amber-700 bg-amber-50 p-1.5 rounded border border-amber-200">
                  <AlertTriangle className="h-3 w-3 shrink-0" />
                  <span>Flattens pages into optimized images (text becomes non-selectable).</span>
                </div>
              </button>

              {/* Option B: Structural / Stream Optimization */}
              <button
                type="button"
                onClick={() => {
                  setEngine('structural');
                  setResult(null);
                }}
                className={`p-3.5 rounded-[4px] text-left border transition-all ${
                  engine === 'structural'
                    ? 'border-[#414FA8] bg-[#F2F4FC] ring-1 ring-[#414FA8]'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-gray-900">
                    Structural Stream Optimizer
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-blue-100 text-blue-800">
                    Preserves Text
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed mb-2">
                  Cleans redundant metadata and recompresses PDF object streams without changing page visuals. Text remains 100% selectable and vector fonts are preserved.
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-blue-700 bg-blue-50 p-1.5 rounded border border-blue-200">
                  <Info className="h-3 w-3 shrink-0" />
                  <span>Modest size savings on already optimized vector PDFs.</span>
                </div>
              </button>
            </div>

            {/* Presets and Sliders (When Canvas Engine is selected) */}
            {engine === 'canvas' && (
              <div className="space-y-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-2">
                    Compression Level Presets:
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <button
                      type="button"
                      onClick={() => handlePresetSelect('low')}
                      className={`p-2.5 rounded-[4px] text-center border text-xs font-medium transition-all ${
                        preset === 'low'
                          ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold shadow-xs'
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="font-bold">Low Compression</div>
                      <div className="text-[10px] text-gray-500">150 DPI • 85% Q</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePresetSelect('recommended')}
                      className={`p-2.5 rounded-[4px] text-center border text-xs font-medium transition-all ${
                        preset === 'recommended'
                          ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold shadow-xs'
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="font-bold">Recommended</div>
                      <div className="text-[10px] text-gray-500">120 DPI • 70% Q</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePresetSelect('high')}
                      className={`p-2.5 rounded-[4px] text-center border text-xs font-medium transition-all ${
                        preset === 'high'
                          ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold shadow-xs'
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="font-bold">High Compression</div>
                      <div className="text-[10px] text-gray-500">96 DPI • 50% Q</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreset('custom')}
                      className={`p-2.5 rounded-[4px] text-center border text-xs font-medium transition-all ${
                        preset === 'custom'
                          ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold shadow-xs'
                          : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div className="font-bold">Custom</div>
                      <div className="text-[10px] text-gray-500">Manual sliders</div>
                    </button>
                  </div>
                </div>

                {/* Granular Sliders for fine tuning */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-[#FAFAFC] border border-gray-200 rounded-[4px]">
                  <div>
                    <div className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                      <span>Render Resolution (DPI):</span>
                      <span className="font-bold text-[#414FA8]">{dpi} DPI</span>
                    </div>
                    <select
                      value={dpi}
                      onChange={(e) => {
                        setDpi(Number(e.target.value));
                        setPreset('custom');
                        setResult(null);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded-[4px] bg-white text-gray-800"
                    >
                      <option value={72}>72 DPI (Extreme compression / web view)</option>
                      <option value={96}>96 DPI (Smallest size for upload limits)</option>
                      <option value={120}>120 DPI (Balanced readability)</option>
                      <option value={150}>150 DPI (Crisp text &amp; images)</option>
                      <option value={200}>200 DPI (High detail / print grade)</option>
                    </select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-medium text-gray-700 mb-1">
                      <span>Image Quality:</span>
                      <span className="font-bold text-[#414FA8]">{quality}%</span>
                    </div>
                    <input
                      type="range"
                      min={30}
                      max={95}
                      step={5}
                      value={quality}
                      onChange={(e) => {
                        setQuality(Number(e.target.value));
                        setPreset('custom');
                        setResult(null);
                      }}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#414FA8] mt-2.5"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                      <span>30% (Smallest)</span>
                      <span>70% (Balanced)</span>
                      <span>95% (Maximum)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Compress Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCompress}
                disabled={isCompressing}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isCompressing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>{progressText || 'Compressing PDF file...'}</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-emerald-400" />
                    <span>
                      Compress &amp; Optimize PDF ({formatBytes(pdfMeta.size)})
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3. Compression Results View */}
          {result && (
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">
                      PDF Compression Complete!
                    </h3>
                    <p className="text-xs text-gray-500">
                      Mode: {result.engineUsed === 'canvas' ? 'Visual Downsampling' : 'Structural Stream Optimizer'}
                      {result.dpiUsed ? ` (${result.dpiUsed} DPI, ${result.qualityUsed}% Q)` : ''}
                    </p>
                  </div>
                </div>

                {/* Percentage savings badge */}
                <div className="flex items-center gap-2">
                  {result.percentChange < 0 ? (
                    <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                      <TrendingDown className="h-3.5 w-3.5" />
                      <span>{Math.abs(Math.round(result.percentChange))}% Smaller</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>+{Math.round(result.percentChange)}% (Original was already optimal)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Before vs After stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-[#FAFAFC] rounded-[4px] border border-gray-200 text-xs">
                <div>
                  <span className="text-gray-500 text-[11px] block">Original File Size:</span>
                  <span className="font-semibold text-gray-800 text-sm">{formatBytes(result.originalSize)}</span>
                </div>
                <div>
                  <span className="text-gray-500 text-[11px] block">Compressed Size:</span>
                  <span className="font-bold text-[#414FA8] text-sm">{formatBytes(result.size)}</span>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <span className="text-gray-500 text-[11px] block">Total Reduction:</span>
                  <span className={`font-semibold text-sm ${result.savedBytes > 0 ? 'text-emerald-700' : 'text-gray-700'}`}>
                    {result.savedBytes > 0 ? `-${formatBytes(result.savedBytes)}` : '0 Bytes'}
                  </span>
                </div>
              </div>

              {/* Advisory note if file didn't shrink significantly */}
              {result.percentChange >= 0 && (
                <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-[4px]">
                  <Info className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>
                    This PDF is already highly compressed with minimal uncompressed streams. For maximum size reduction, switch to <strong>Visual &amp; Image Compression</strong> with 96 or 120 DPI.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Download sizesnap-compressed.pdf ({formatBytes(result.size)})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-[#9AA3C8] bg-white hover:bg-[#EEF1FB] hover:border-[#414FA8] text-[#414FA8] text-xs font-semibold transition-colors"
                >
                  Change Settings
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
                >
                  New PDF
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Compressed locally in your browser. No files were sent to an external server.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
