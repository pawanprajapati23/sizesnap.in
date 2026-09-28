'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
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
  FileText,
  Scissors,
  Archive,
  RefreshCw,
  CheckSquare,
  Square,
} from 'lucide-react';

interface PdfMetadata {
  file: File;
  name: string;
  size: number;
  pageCount: number;
}

type SplitMode = 'range' | 'all-individual' | 'visual';

export function SplitPdfTool() {
  const [pdfMeta, setPdfMeta] = useState<PdfMetadata | null>(null);
  const [splitMode, setSplitMode] = useState<SplitMode>('range');

  // Range input state
  const [rangeStr, setRangeStr] = useState<string>('1');
  const [selectedPages, setSelectedPages] = useState<number[]>([1]);

  // Visual selection
  const [visualSelection, setVisualSelection] = useState<Set<number>>(new Set([1]));

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultType, setResultType] = useState<'pdf' | 'zip'>('pdf');
  const [resultCount, setResultCount] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
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

  // Parse range string into valid 1-based page indices
  const parseRangeString = (input: string, maxPages: number): number[] => {
    const pages = new Set<number>();
    const parts = input.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (!part) continue;
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-').map((s) => s.trim());
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end) && start <= end) {
          for (let i = start; i <= end; i++) {
            if (i >= 1 && i <= maxPages) {
              pages.add(i);
            }
          }
        }
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num) && num >= 1 && num <= maxPages) {
          pages.add(num);
        }
      }
    }

    return Array.from(pages).sort((a, b) => a - b);
  };

  const handleRangeChange = (val: string, maxPages: number) => {
    setRangeStr(val);
    const parsed = parseRangeString(val, maxPages);
    setSelectedPages(parsed);
    setResultUrl(null);
  };

  const processPdfFile = async (file: File) => {
    setErrorMsg(null);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please select a valid PDF document.');
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pageCount = doc.getPageCount();

      setPdfMeta({
        file,
        name: file.name,
        size: file.size,
        pageCount,
      });

      // Default selections
      const defaultRange = pageCount > 1 ? `1-${Math.min(3, pageCount)}` : '1';
      setRangeStr(defaultRange);
      setSelectedPages(parseRangeString(defaultRange, pageCount));
      setVisualSelection(new Set([1]));
      setResultUrl(null);
      setResultBlob(null);
    } catch (err: any) {
      setErrorMsg(`Could not read PDF: ${err?.message || 'File may be encrypted or corrupted.'}`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      processPdfFile(e.dataTransfer.files[0]);
    }
  };

  const clearAll = () => {
    cleanupUrls();
    setPdfMeta(null);
    setResultBlob(null);
    setResultUrl(null);
    setErrorMsg(null);
  };

  // Toggle visual page
  const toggleVisualPage = (pageIdx: number) => {
    setVisualSelection((prev) => {
      const copy = new Set(prev);
      if (copy.has(pageIdx)) {
        if (copy.size > 1) {
          copy.delete(pageIdx);
        }
      } else {
        copy.add(pageIdx);
      }
      return copy;
    });
    setResultUrl(null);
  };

  const selectAllPages = () => {
    if (!pdfMeta) return;
    const all = new Set<number>();
    for (let i = 1; i <= pdfMeta.pageCount; i++) all.add(i);
    setVisualSelection(all);
    setResultUrl(null);
  };

  const deselectAllPages = () => {
    setVisualSelection(new Set([1]));
    setResultUrl(null);
  };

  // Perform PDF Split execution
  const handleSplitPdf = async () => {
    if (!pdfMeta) return;

    setIsProcessing(true);
    setErrorMsg(null);

    await new Promise((r) => setTimeout(r, 50));

    try {
      const buffer = await pdfMeta.file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      if (splitMode === 'all-individual') {
        // Split every page into its own PDF and zip them
        setProgressMsg('Splitting pages into individual documents...');
        const zip = new JSZip();

        for (let i = 0; i < pdfMeta.pageCount; i++) {
          setProgressMsg(`Extracting page ${i + 1} of ${pdfMeta.pageCount}...`);
          const singleDoc = await PDFDocument.create();
          const [copiedPage] = await singleDoc.copyPages(srcDoc, [i]);
          singleDoc.addPage(copiedPage);

          const bytes = await singleDoc.save();
          zip.file(`page-${i + 1}.pdf`, bytes);
        }

        setProgressMsg('Packaging ZIP file...');
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const zipUrl = registerUrl(URL.createObjectURL(zipBlob));

        setResultBlob(zipBlob);
        setResultUrl(zipUrl);
        setResultType('zip');
        setResultCount(pdfMeta.pageCount);
      } else {
        // Extract selected pages into one PDF
        const targetPages =
          splitMode === 'visual'
            ? Array.from(visualSelection).sort((a, b) => a - b)
            : selectedPages;

        if (targetPages.length === 0) {
          throw new Error('Please select at least one valid page to extract.');
        }

        setProgressMsg(`Extracting ${targetPages.length} pages...`);
        const newDoc = await PDFDocument.create();
        const zeroIndexed = targetPages.map((p) => p - 1);
        const copiedPages = await newDoc.copyPages(srcDoc, zeroIndexed);

        copiedPages.forEach((page) => newDoc.addPage(page));

        const bytes = await newDoc.save();
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        const url = registerUrl(URL.createObjectURL(blob));

        setResultBlob(blob);
        setResultUrl(url);
        setResultType('pdf');
        setResultCount(targetPages.length);
      }

      setIsProcessing(false);
      setProgressMsg('');
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err?.message || 'Failed to split PDF document.');
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !pdfMeta) return;
    const baseName = pdfMeta.name.replace(/\.[^/.]+$/, '');
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download =
      resultType === 'zip'
        ? `${baseName}-split-pages.zip`
        : `${baseName}-extracted.pdf`;
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
      {!pdfMeta ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[4px] border-2 border-dashed border-[#9AA3C8] bg-[#FAFAFC] hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-colors cursor-pointer select-none"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={(e) => e.target.files?.[0] && processPdfFile(e.target.files[0])}
            className="sr-only"
          />
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-4">
            <Scissors className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Select or Drag a PDF File to Split
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Extract specific page ranges, pick pages visually, or split every single page into separate files and download as ZIP.
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
            <span>Select PDF File</span>
          </button>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
            <span>Lossless extraction</span>
            <span>•</span>
            <span>Range &amp; visual picker</span>
            <span>•</span>
            <span>100% Client-Side</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-[4px] border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate max-w-xs sm:max-w-md" title={pdfMeta.name}>
                  {pdfMeta.name}
                </h3>
                <p className="text-[11px] text-gray-500">
                  {pdfMeta.pageCount} page{pdfMeta.pageCount > 1 ? 's' : ''} • {formatBytes(pdfMeta.size)}
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
                <span>Replace PDF</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => e.target.files?.[0] && processPdfFile(e.target.files[0])}
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

          {/* Mode Tabs */}
          <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Split Method
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSplitMode('range');
                    setResultUrl(null);
                  }}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    splitMode === 'range'
                      ? 'bg-[#414FA8] text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  By Range
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSplitMode('visual');
                    setResultUrl(null);
                  }}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    splitMode === 'visual'
                      ? 'bg-[#414FA8] text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Visual Selector
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSplitMode('all-individual');
                    setResultUrl(null);
                  }}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    splitMode === 'all-individual'
                      ? 'bg-[#414FA8] text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Pages to ZIP
                </button>
              </div>
            </div>

            {/* Mode 1: Range Input */}
            {splitMode === 'range' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-700 block">
                  Enter Page Numbers or Ranges:
                </label>
                <input
                  type="text"
                  value={rangeStr}
                  onChange={(e) => handleRangeChange(e.target.value, pdfMeta.pageCount)}
                  placeholder="e.g. 1-3, 5, 8-10"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded bg-white text-gray-900 font-mono focus:border-[#414FA8] focus:ring-1 focus:ring-[#414FA8] outline-none"
                />
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <p className="text-gray-500">
                    Selected pages:{' '}
                    <span className="font-semibold text-gray-800">
                      {selectedPages.length > 0 ? selectedPages.join(', ') : 'None'}
                    </span>{' '}
                    ({selectedPages.length} total)
                  </p>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleRangeChange(`1-${pdfMeta.pageCount}`, pdfMeta.pageCount)}
                      className="text-[11px] text-[#414FA8] hover:underline"
                    >
                      All ({pdfMeta.pageCount})
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => handleRangeChange('1', pdfMeta.pageCount)}
                      className="text-[11px] text-[#414FA8] hover:underline"
                    >
                      Page 1 Only
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: Visual Grid Picker */}
            {splitMode === 'visual' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-600">
                    Click pages to include in the extracted document ({visualSelection.size} selected):
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={selectAllPages}
                      className="text-xs text-[#414FA8] hover:underline font-semibold"
                    >
                      Select All
                    </button>
                    <span className="text-gray-300">|</span>
                    <button
                      type="button"
                      onClick={deselectAllPages}
                      className="text-xs text-gray-500 hover:underline"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-60 overflow-y-auto p-1">
                  {Array.from({ length: pdfMeta.pageCount }, (_, i) => i + 1).map((pNum) => {
                    const isSelected = visualSelection.has(pNum);
                    return (
                      <button
                        key={pNum}
                        type="button"
                        onClick={() => toggleVisualPage(pNum)}
                        className={`flex flex-col items-center justify-center p-2 rounded border text-xs transition-all ${
                          isSelected
                            ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold shadow-xs'
                            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 mb-1 text-[#414FA8]" />
                        ) : (
                          <Square className="h-4 w-4 mb-1 text-gray-400" />
                        )}
                        <span>Page {pNum}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mode 3: All Individual Pages to ZIP */}
            {splitMode === 'all-individual' && (
              <div className="p-3 bg-[#EEF1FB] border border-[#9AA3C8]/40 rounded text-xs text-gray-700 space-y-1">
                <p className="font-semibold text-[#414FA8]">Extract Every Single Page</p>
                <p className="text-gray-600">
                  This mode separates all {pdfMeta.pageCount} pages into individual 1-page PDF documents (page-1.pdf, page-2.pdf, etc.) and bundles them into a single downloadable ZIP archive.
                </p>
              </div>
            )}

            {/* Split Trigger Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSplitPdf}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>{progressMsg || 'Splitting PDF...'}</span>
                  </>
                ) : (
                  <>
                    <Scissors className="h-4 w-4 text-amber-300" />
                    <span>
                      {splitMode === 'all-individual'
                        ? `Extract All ${pdfMeta.pageCount} Pages as ZIP`
                        : `Extract Selected Pages (${
                            splitMode === 'visual' ? visualSelection.size : selectedPages.length
                          } Pages)`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Split Result Card */}
          {resultBlob && resultUrl && (
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">
                      {resultType === 'zip' ? 'Pages Split & Archived!' : 'Extracted PDF Ready!'}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {resultType === 'zip'
                        ? `Extracted ${resultCount} single-page PDF files into a ZIP archive.`
                        : `Contains ${resultCount} selected pages from the original document.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold text-[#414FA8] bg-[#EEF1FB] border border-[#9AA3C8]/40 rounded-full">
                    {resultCount} {resultType === 'zip' ? 'PDFs in ZIP' : 'Pages'} • {formatBytes(resultBlob.size)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer"
                >
                  {resultType === 'zip' ? <Archive className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                  <span>
                    Download {resultType === 'zip' ? 'ZIP Archive' : 'Extracted PDF'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
                >
                  Split Another
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Lossless stream extraction. Original PDF quality &amp; selectable text preserved.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
