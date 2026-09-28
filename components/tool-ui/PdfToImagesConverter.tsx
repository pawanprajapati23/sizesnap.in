'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import JSZip from 'jszip';
import { formatBytes } from '@/lib/format-utils';
import {
  Upload,
  FileText,
  Sliders,
  Settings,
  Download,
  Trash2,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Archive,
  Eye,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';

interface ConvertedPage {
  pageNumber: number;
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  filename: string;
}

interface PdfMetadata {
  file: File;
  name: string;
  size: number;
  totalPages: number;
  arrayBuffer: ArrayBuffer;
}

export function parsePageRange(
  rangeStr: string,
  totalPages: number
): { pages: number[]; error: string | null } {
  const trimmed = rangeStr.trim();
  if (!trimmed) {
    return { pages: [], error: 'Please enter page numbers or ranges (e.g. 1-3, 5)' };
  }

  const parts = trimmed.split(',');
  const pageSet = new Set<number>();

  for (const rawPart of parts) {
    const part = rawPart.trim();
    if (!part) continue;

    if (part.includes('-')) {
      const [startStr, endStr] = part.split('-');
      const start = parseInt(startStr.trim(), 10);
      const end = parseInt(endStr.trim(), 10);

      if (isNaN(start) || isNaN(end) || start < 1 || end < 1 || start > end) {
        return { pages: [], error: `Invalid range "${part}". Example: 1-5` };
      }

      for (let p = start; p <= end; p++) {
        if (p <= totalPages) {
          pageSet.add(p);
        }
      }
    } else {
      const pageNum = parseInt(part, 10);
      if (isNaN(pageNum) || pageNum < 1) {
        return { pages: [], error: `Invalid page number "${part}".` };
      }
      if (pageNum <= totalPages) {
        pageSet.add(pageNum);
      }
    }
  }

  const pages = Array.from(pageSet).sort((a, b) => a - b);
  if (pages.length === 0) {
    return { pages: [], error: `No pages within 1-${totalPages} matched your input.` };
  }

  return { pages, error: null };
}

export function PdfToImagesConverter() {
  const [pdfMeta, setPdfMeta] = useState<PdfMetadata | null>(null);
  const [format, setFormat] = useState<'jpg' | 'png'>('jpg');
  const [dpi, setDpi] = useState<number>(150);
  const [quality, setQuality] = useState<number>(85);
  const [pageSelectionMode, setPageSelectionMode] = useState<'all' | 'custom'>('all');
  const [customRange, setCustomRange] = useState<string>('');
  const [rangeError, setRangeError] = useState<string | null>(null);

  // Loading & Progress states
  const [isLoadingPdf, setIsLoadingPdf] = useState<boolean>(false);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
  const [convertedPages, setConvertedPages] = useState<ConvertedPage[]>([]);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  // Object URL tracking for safe disposal
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

  // PDF.js loader helper
  const getPdfJs = async () => {
    const pdfjs = await import('pdfjs-dist');
    // Configure worker
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
    return pdfjs;
  };

  // Handle PDF file selection
  const handleFileSelect = async (file: File) => {
    setErrorMsg(null);
    setConvertedPages([]);
    setRangeError(null);

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please select a valid PDF document (.pdf).');
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
      const count = pdfDoc.numPages;

      setPdfMeta({
        file,
        name: file.name,
        size: file.size,
        totalPages: count,
        arrayBuffer: buffer,
      });

      setIsLoadingPdf(false);
    } catch (err: any) {
      setIsLoadingPdf(false);
      if (err?.name === 'PasswordException') {
        setErrorMsg('This PDF is password-protected. Please decrypt it before converting.');
      } else {
        setErrorMsg('Failed to open PDF. File might be corrupted or invalid.');
      }
    }
  };

  const handleReset = () => {
    cleanupUrls();
    setPdfMeta(null);
    setConvertedPages([]);
    setErrorMsg(null);
    setRangeError(null);
    setPageSelectionMode('all');
    setCustomRange('');
  };

  // Convert selected pages to images
  const handleConvert = async () => {
    if (!pdfMeta) return;

    // Validate page selection
    let targetPages: number[] = [];
    if (pageSelectionMode === 'all') {
      targetPages = Array.from({ length: pdfMeta.totalPages }, (_, i) => i + 1);
    } else {
      const parsed = parsePageRange(customRange, pdfMeta.totalPages);
      if (parsed.error) {
        setRangeError(parsed.error);
        return;
      }
      setRangeError(null);
      targetPages = parsed.pages;
    }

    if (targetPages.length === 0) {
      setErrorMsg('No valid pages selected for conversion.');
      return;
    }

    setIsConverting(true);
    setErrorMsg(null);
    cleanupUrls();
    setConvertedPages([]);

    // Yield to let UI update
    await new Promise((r) => setTimeout(r, 60));

    try {
      const pdfjs = await getPdfJs();
      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(pdfMeta.arrayBuffer),
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
        cMapPacked: true,
      });
      const pdfDoc = await loadingTask.promise;

      const scale = dpi / 72; // 72 DPI is standard PDF point ratio
      const outputMime = format === 'jpg' ? 'image/jpeg' : 'image/png';
      const outputExt = format === 'jpg' ? 'jpg' : 'png';
      const qualityFactor = Math.max(0.1, Math.min(1.0, quality / 100));

      const results: ConvertedPage[] = [];

      for (let i = 0; i < targetPages.length; i++) {
        const pageNum = targetPages[i];
        const percent = Math.round(((i + 1) / targetPages.length) * 100);
        setProgressMsg(`Rendering page ${pageNum} (${i + 1} of ${targetPages.length})...`);
        setProgressPercent(percent);

        const page = await pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const ctx = canvas.getContext('2d', { willReadFrequently: false });

        if (!ctx) {
          throw new Error('Canvas 2D context unavailable.');
        }

        // Fill white background (ensures transparent PDF pages render cleanly as JPG/PNG)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render PDF page into canvas
        const renderTask = page.render({
          canvasContext: ctx,
          viewport,
        });

        await renderTask.promise;

        // Convert canvas to blob
        const blob: Blob = await new Promise((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b);
              else reject(new Error(`Failed to convert page ${pageNum} to blob`));
            },
            outputMime,
            qualityFactor
          );
        });

        const url = registerUrl(URL.createObjectURL(blob));
        const filename = `sizesnap-page-${pageNum}.${outputExt}`;

        results.push({
          pageNumber: pageNum,
          blob,
          url,
          width: canvas.width,
          height: canvas.height,
          size: blob.size,
          filename,
        });
      }

      setConvertedPages(results);
      setIsConverting(false);
      setProgressMsg('');
      setProgressPercent(0);
    } catch (err: any) {
      setIsConverting(false);
      setErrorMsg(err?.message || 'An error occurred during PDF conversion.');
    }
  };

  // Download single image
  const handleDownloadSingle = (page: ConvertedPage) => {
    const a = document.createElement('a');
    a.href = page.url;
    a.download = page.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Download all as ZIP
  const handleDownloadZip = async () => {
    if (convertedPages.length === 0) return;

    setIsZipping(true);
    try {
      const zip = new JSZip();

      for (const item of convertedPages) {
        zip.file(item.filename, item.blob);
      }

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      const zipUrl = registerUrl(URL.createObjectURL(zipBlob));
      const a = document.createElement('a');
      a.href = zipUrl;
      const baseName = pdfMeta?.name.replace(/\.[^.]+$/, '') || 'pdf-pages';
      a.download = `${baseName}-images.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      setIsZipping(false);
    } catch (err: any) {
      setIsZipping(false);
      setErrorMsg('Failed to bundle ZIP file. Try downloading images individually.');
    }
  };

  const isHighMemory = (dpi === 300 || dpi === 200) && (pdfMeta?.totalPages || 0) > 15;

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

      {/* 1. PDF Upload Zone */}
      {!pdfMeta && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
              handleFileSelect(e.dataTransfer.files[0]);
            }
          }}
          onClick={() => fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[4px] border-2 border-dashed border-[#9AA3C8] bg-[#FAFAFC] hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-colors cursor-pointer select-none"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
            className="sr-only"
          />

          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-4">
            {isLoadingPdf ? (
              <Loader2 className="h-7 w-7 animate-spin text-[#414FA8]" />
            ) : (
              <FileText className="h-7 w-7" />
            )}
          </div>

          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            {isLoadingPdf ? 'Reading PDF Structure...' : 'Select or Drop PDF File Here'}
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Convert any multi-page PDF document into high-resolution JPG or PNG pictures.
          </p>

          <button
            type="button"
            disabled={isLoadingPdf}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white text-xs sm:text-sm font-semibold rounded-[4px] shadow-xs transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Browse PDF</span>
          </button>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
            <span>Supports All Standard PDFs</span>
            <span>•</span>
            <span>Up to 100MB</span>
            <span>•</span>
            <span className="text-[#414FA8] font-medium">100% Client-Side</span>
          </div>
        </div>
      )}

      {/* 2. PDF Loaded: Settings Panel */}
      {pdfMeta && convertedPages.length === 0 && (
        <div className="space-y-4">
          {/* Document Summary Card */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0 border border-[#9AA3C8]/40">
                <FileText className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 truncate" title={pdfMeta.name}>
                  {pdfMeta.name}
                </h4>
                <p className="text-xs text-gray-500">
                  {pdfMeta.totalPages} Page{pdfMeta.totalPages > 1 ? 's' : ''} • {formatBytes(pdfMeta.size)}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Change PDF</span>
            </button>
          </div>

          {/* Conversion Configuration */}
          <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <Settings className="h-4 w-4 text-[#414FA8]" />
              <h3 className="text-sm font-bold text-gray-900">Image Conversion Settings</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Format selection */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Output Format:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormat('jpg')}
                    className={`py-2 px-3 rounded-[4px] border text-center text-xs transition-colors ${
                      format === 'jpg'
                        ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold ring-1 ring-[#414FA8]/30'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div>JPG / JPEG</div>
                    <div className="text-[10px] text-gray-500 font-normal">Smaller file size</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormat('png')}
                    className={`py-2 px-3 rounded-[4px] border text-center text-xs transition-colors ${
                      format === 'png'
                        ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold ring-1 ring-[#414FA8]/30'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div>PNG</div>
                    <div className="text-[10px] text-gray-500 font-normal">Crisp lossless text</div>
                  </button>
                </div>
              </div>

              {/* Resolution / DPI */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Image Resolution (DPI):
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { val: 72, label: '72', hint: 'Screen' },
                    { val: 150, label: '150', hint: 'Good' },
                    { val: 200, label: '200', hint: 'High' },
                    { val: 300, label: '300', hint: 'Ultra' },
                  ].map((d) => (
                    <button
                      key={d.val}
                      type="button"
                      onClick={() => setDpi(d.val)}
                      className={`py-1.5 px-1 rounded-[4px] border text-center transition-colors ${
                        dpi === d.val
                          ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-xs font-semibold">{d.label}</div>
                      <div className="text-[9px] text-gray-500">{d.hint}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* JPG Quality (if JPG chosen) */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1.5">
                  <span>JPG Quality:</span>
                  <span className="text-[#414FA8]">{quality}%</span>
                </div>
                {format === 'jpg' ? (
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#414FA8] mt-2"
                  />
                ) : (
                  <p className="text-[11px] text-gray-400 mt-2">
                    PNG format always exports with lossless quality.
                  </p>
                )}
              </div>
            </div>

            {/* Page Selection Mode */}
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <label className="text-xs font-semibold text-gray-700 block">
                Pages to Convert:
              </label>

              <div className="flex flex-wrap items-center gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pageMode"
                    checked={pageSelectionMode === 'all'}
                    onChange={() => {
                      setPageSelectionMode('all');
                      setRangeError(null);
                    }}
                    className="h-4 w-4 text-[#414FA8] focus:ring-[#414FA8]"
                  />
                  <span>All Pages (1 to {pdfMeta.totalPages})</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pageMode"
                    checked={pageSelectionMode === 'custom'}
                    onChange={() => setPageSelectionMode('custom')}
                    className="h-4 w-4 text-[#414FA8] focus:ring-[#414FA8]"
                  />
                  <span>Select Specific Pages / Range</span>
                </label>
              </div>

              {pageSelectionMode === 'custom' && (
                <div className="pt-1 max-w-sm space-y-1">
                  <input
                    type="text"
                    value={customRange}
                    onChange={(e) => {
                      setCustomRange(e.target.value);
                      setRangeError(null);
                    }}
                    placeholder={`e.g. 1-3, 5, 8-${Math.min(pdfMeta.totalPages, 10)}`}
                    className="w-full px-3 py-2 text-xs border border-[#9AA3C8] rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#414FA8] font-mono text-gray-900"
                  />
                  {rangeError ? (
                    <p className="text-[11px] text-red-600">{rangeError}</p>
                  ) : (
                    <p className="text-[10px] text-gray-400">
                      Comma-separated pages and ranges (e.g. 1, 3-5). Max page is {pdfMeta.totalPages}.
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Memory advisory notice */}
            {isHighMemory && (
              <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] rounded-[4px]">
                <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  <strong>Performance Notice:</strong> Converting {pdfMeta.totalPages} pages at {dpi} DPI requires rendering large canvases in device RAM. For faster processing, 150 DPI is recommended.
                </span>
              </div>
            )}

            {/* Main Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleConvert}
                disabled={isConverting}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isConverting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>
                      {progressMsg || 'Rendering pages...'} ({progressPercent}%)
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-amber-300" />
                    <span>
                      Convert PDF Pages to {format.toUpperCase()} ({dpi} DPI)
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Converted Results View */}
      {convertedPages.length > 0 && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Results Action Bar */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  {convertedPages.length} Page{convertedPages.length > 1 ? 's' : ''} Converted to {format.toUpperCase()}
                </h3>
                <p className="text-xs text-gray-500">
                  Rendered at {dpi} DPI • Total size: {formatBytes(convertedPages.reduce((a, b) => a + b.size, 0))}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleDownloadZip}
                disabled={isZipping}
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-gray-400 text-white text-xs font-bold rounded-[4px] shadow-xs transition-colors cursor-pointer"
              >
                {isZipping ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Creating ZIP...</span>
                  </>
                ) : (
                  <>
                    <Archive className="h-4 w-4" />
                    <span>Download All as ZIP</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setConvertedPages([])}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-[4px] border border-[#9AA3C8] bg-white hover:bg-[#EEF1FB] hover:border-[#414FA8] text-[#414FA8] text-xs font-semibold transition-colors"
              >
                <Sliders className="h-3.5 w-3.5" />
                <span>Adjust Settings</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-[4px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>New PDF</span>
              </button>
            </div>
          </div>

          {/* Grid of Converted Pages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {convertedPages.map((page) => (
              <div
                key={page.pageNumber}
                className="bg-white p-3 rounded-[4px] border border-gray-200 shadow-xs flex flex-col justify-between space-y-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#414FA8] bg-[#EEF1FB] px-2 py-0.5 rounded border border-[#9AA3C8]/40">
                    Page {page.pageNumber}
                  </span>
                  <span className="text-gray-500 font-medium">
                    {formatBytes(page.size)}
                  </span>
                </div>

                {/* Thumbnail */}
                <div className="relative rounded border border-gray-200 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:8px_8px] overflow-hidden flex items-center justify-center p-2 min-h-[160px]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.url}
                    alt={`Page ${page.pageNumber}`}
                    className="max-h-[220px] max-w-full object-contain mx-auto shadow-2xs"
                  />
                </div>

                {/* Footer & Individual Download */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>{page.width} × {page.height} px</span>
                    <span className="uppercase">{format}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDownloadSingle(page)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-[#EEF1FB] hover:bg-[#414FA8] text-[#414FA8] hover:text-white border border-[#9AA3C8]/40 hover:border-[#414FA8] text-xs font-semibold rounded-[4px] transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Page {page.pageNumber}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-2 pt-2 text-[11px] text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>All pages rendered directly in your browser. Document remains completely private.</span>
          </div>
        </div>
      )}
    </div>
  );
}
