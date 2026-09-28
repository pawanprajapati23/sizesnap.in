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
  Copy,
  Archive,
  CheckSquare,
  Square,
} from 'lucide-react';

interface PdfDocMeta {
  file: File;
  name: string;
  size: number;
  pageCount: number;
}

type ExtractTargetMode = 'single-pdf' | 'zip-individual';

export function ExtractPdfPagesTool() {
  const [docMeta, setDocMeta] = useState<PdfDocMeta | null>(null);
  // Set of 0-indexed page numbers selected for extraction
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set([0]));
  const [rangeInput, setRangeInput] = useState<string>('1');
  const [targetMode, setTargetMode] = useState<ExtractTargetMode>('single-pdf');

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultMode, setResultMode] = useState<ExtractTargetMode>('single-pdf');

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

  // Parse comma-separated ranges e.g. "1-3, 5" (1-indexed input)
  const parseRangeStringToIndices = (input: string, maxPages: number): Set<number> => {
    const indices = new Set<number>();
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
              indices.add(i - 1);
            }
          }
        }
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num) && num >= 1 && num <= maxPages) {
          indices.add(num - 1);
        }
      }
    }
    return indices;
  };

  const loadPdf = async (file: File) => {
    setErrorMsg(null);
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please select a valid PDF file.');
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = doc.getPageCount();

      setDocMeta({
        file,
        name: file.name,
        size: file.size,
        pageCount: count,
      });

      // Default select first page or first 3
      const defaultRange = count > 1 ? `1-${Math.min(3, count)}` : '1';
      setRangeInput(defaultRange);
      setSelectedIndices(parseRangeStringToIndices(defaultRange, count));
      setResultUrl(null);
      setResultBlob(null);
    } catch (err: any) {
      setErrorMsg(`Could not read PDF: ${err?.message || 'File may be encrypted or corrupted.'}`);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      loadPdf(e.dataTransfer.files[0]);
    }
  };

  const clearAll = () => {
    cleanupUrls();
    setDocMeta(null);
    setSelectedIndices(new Set());
    setRangeInput('');
    setResultBlob(null);
    setResultUrl(null);
    setErrorMsg(null);
  };

  // Toggle page selection
  const togglePageSelect = (pageIdx: number) => {
    setSelectedIndices((prev) => {
      const copy = new Set(prev);
      if (copy.has(pageIdx)) {
        if (copy.size > 1) copy.delete(pageIdx);
      } else {
        copy.add(pageIdx);
      }
      return copy;
    });
    setResultUrl(null);
  };

  const handleRangeInputChange = (val: string) => {
    setRangeInput(val);
    if (!docMeta) return;
    const parsed = parseRangeStringToIndices(val, docMeta.pageCount);
    if (parsed.size > 0) {
      setSelectedIndices(parsed);
    }
    setResultUrl(null);
  };

  const selectAll = () => {
    if (!docMeta) return;
    const all = new Set<number>();
    for (let i = 0; i < docMeta.pageCount; i++) all.add(i);
    setSelectedIndices(all);
    setRangeInput(`1-${docMeta.pageCount}`);
    setResultUrl(null);
  };

  const selectFirstPage = () => {
    setSelectedIndices(new Set([0]));
    setRangeInput('1');
    setResultUrl(null);
  };

  // Extract execution
  const handleExtractPages = async () => {
    if (!docMeta) return;

    const indicesToExtract = Array.from(selectedIndices).sort((a, b) => a - b);
    if (indicesToExtract.length === 0) {
      setErrorMsg('Please select at least 1 page to extract.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    await new Promise((r) => setTimeout(r, 50));

    try {
      const buffer = await docMeta.file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      if (targetMode === 'zip-individual') {
        // Extract each selected page into its own individual PDF & zip
        setProgressMsg('Extracting individual page files...');
        const zip = new JSZip();

        for (let i = 0; i < indicesToExtract.length; i++) {
          const originalPageNum = indicesToExtract[i] + 1;
          setProgressMsg(`Processing page ${originalPageNum} (${i + 1} of ${indicesToExtract.length})...`);

          const singleDoc = await PDFDocument.create();
          const [copiedPage] = await singleDoc.copyPages(srcDoc, [indicesToExtract[i]]);
          singleDoc.addPage(copiedPage);

          const bytes = await singleDoc.save();
          zip.file(`page-${originalPageNum}.pdf`, bytes);
        }

        setProgressMsg('Generating ZIP archive...');
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const url = registerUrl(URL.createObjectURL(zipBlob));

        setResultBlob(zipBlob);
        setResultUrl(url);
        setResultMode('zip-individual');
      } else {
        // Extract all selected pages into one PDF
        setProgressMsg(`Extracting ${indicesToExtract.length} pages...`);
        const newDoc = await PDFDocument.create();
        const copiedPages = await newDoc.copyPages(srcDoc, indicesToExtract);
        copiedPages.forEach((p) => newDoc.addPage(p));

        setProgressMsg('Compiling extracted PDF document...');
        const bytes = await newDoc.save();
        const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
        const url = registerUrl(URL.createObjectURL(blob));

        setResultBlob(blob);
        setResultUrl(url);
        setResultMode('single-pdf');
      }

      setIsProcessing(false);
      setProgressMsg('');
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err?.message || 'Failed to extract PDF pages.');
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !docMeta) return;
    const baseName = docMeta.name.replace(/\.[^/.]+$/, '');
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download =
      resultMode === 'zip-individual'
        ? `${baseName}-extracted-pages.zip`
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
      {!docMeta ? (
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
            onChange={(e) => e.target.files?.[0] && loadPdf(e.target.files[0])}
            className="sr-only"
          />
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-4">
            <Copy className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Select or Drag a PDF to Extract Pages
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Extract selected pages or custom ranges into a new standalone PDF or get individual pages packaged as a ZIP archive.
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
            <span>Lossless stream extraction</span>
            <span>•</span>
            <span>Single PDF or ZIP</span>
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
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate max-w-xs sm:max-w-md" title={docMeta.name}>
                  {docMeta.name}
                </h3>
                <p className="text-[11px] text-gray-500">
                  {docMeta.pageCount} page{docMeta.pageCount > 1 ? 's' : ''} • {formatBytes(docMeta.size)}
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
                onChange={(e) => e.target.files?.[0] && loadPdf(e.target.files[0])}
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

          {/* Extraction Settings */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Select Pages to Extract
                </span>
                <p className="text-[11px] text-gray-400">
                  Click pages below or enter comma-separated numbers/ranges (e.g. 1-3, 5)
                </p>
              </div>

              {/* Target Mode Toggle */}
              <div className="flex gap-1.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setTargetMode('single-pdf')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    targetMode === 'single-pdf'
                      ? 'bg-[#414FA8] text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Merge into 1 PDF
                </button>
                <button
                  type="button"
                  onClick={() => setTargetMode('zip-individual')}
                  className={`px-3 py-1 text-xs rounded transition-colors ${
                    targetMode === 'zip-individual'
                      ? 'bg-[#414FA8] text-white font-bold'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Separate Pages (ZIP)
                </button>
              </div>
            </div>

            {/* Range input */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700">
                  Page Range:
                </label>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={selectAll}
                    className="text-[#414FA8] hover:underline font-medium"
                  >
                    Select All ({docMeta.pageCount})
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={selectFirstPage}
                    className="text-gray-500 hover:underline"
                  >
                    First Page Only
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => handleRangeInputChange(e.target.value)}
                placeholder="e.g. 1-3, 5, 8"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded bg-white text-gray-900 font-mono focus:border-[#414FA8] focus:ring-1 focus:ring-[#414FA8] outline-none"
              />
              <p className="text-[11px] text-gray-500">
                Currently extracting {selectedIndices.size} page{selectedIndices.size > 1 ? 's' : ''}:{' '}
                <span className="font-semibold text-gray-800">
                  {Array.from(selectedIndices)
                    .map((i) => i + 1)
                    .sort((a, b) => a - b)
                    .join(', ')}
                </span>
              </p>
            </div>
          </div>

          {/* Interactive Page Selection Cards */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Click to Select Pages
              </span>
              <span className="text-[11px] text-gray-400">
                Selected cards will be extracted
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: docMeta.pageCount }, (_, idx) => {
                const isSelected = selectedIndices.has(idx);

                return (
                  <div
                    key={idx}
                    onClick={() => togglePageSelect(idx)}
                    className={`p-3 rounded-[4px] border flex flex-col items-center justify-between gap-2.5 cursor-pointer transition-all ${
                      isSelected
                        ? 'border-[#414FA8] bg-[#EEF1FB]/60 shadow-xs ring-1 ring-[#414FA8]'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800">
                        Page {idx + 1}
                      </span>
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4 text-[#414FA8]" />
                      ) : (
                        <Square className="h-4 w-4 text-gray-400" />
                      )}
                    </div>

                    <div
                      className={`h-28 w-20 rounded border flex items-center justify-center relative transition-all overflow-hidden ${
                        isSelected
                          ? 'border-[#414FA8] bg-white'
                          : 'border-gray-300 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className="w-full h-full p-2 flex flex-col justify-between text-gray-300 select-none">
                        <div className="h-1.5 w-8 bg-gray-200 rounded" />
                        <div className="space-y-1">
                          <div className="h-1 w-full bg-gray-200 rounded" />
                          <div className="h-1 w-full bg-gray-200 rounded" />
                          <div className="h-1 w-3/4 bg-gray-200 rounded" />
                        </div>
                        <div className="text-[10px] font-bold text-gray-400 text-center">
                          {idx + 1}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`text-[11px] font-medium ${
                        isSelected ? 'text-[#414FA8] font-bold' : 'text-gray-400'
                      }`}
                    >
                      {isSelected ? 'Selected' : 'Click to Select'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Action Extract Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleExtractPages}
                disabled={isProcessing || selectedIndices.size === 0}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>{progressMsg || 'Extracting pages...'}</span>
                  </>
                ) : (
                  <>
                    {targetMode === 'zip-individual' ? (
                      <Archive className="h-4 w-4 text-amber-300" />
                    ) : (
                      <Copy className="h-4 w-4 text-amber-300" />
                    )}
                    <span>
                      {targetMode === 'zip-individual'
                        ? `Extract ${selectedIndices.size} Pages as ZIP Archive`
                        : `Extract ${selectedIndices.size} Selected Pages into 1 PDF`}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Result Card */}
          {resultBlob && resultUrl && (
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">
                      {resultMode === 'zip-individual' ? 'Pages Extracted & Archived!' : 'Extracted PDF Ready!'}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {resultMode === 'zip-individual'
                        ? `Successfully saved ${selectedIndices.size} individual PDF documents inside a ZIP file.`
                        : `Successfully compiled ${selectedIndices.size} selected pages into a new clean document.`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold text-[#414FA8] bg-[#EEF1FB] border border-[#9AA3C8]/40 rounded-full">
                    {selectedIndices.size} {resultMode === 'zip-individual' ? 'Files in ZIP' : 'Pages'} • {formatBytes(resultBlob.size)}
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
                  {resultMode === 'zip-individual' ? <Archive className="h-4 w-4" /> : <Download className="h-4 w-4" />}
                  <span>
                    Download {resultMode === 'zip-individual' ? 'ZIP Archive' : 'Extracted PDF'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
                >
                  Extract Another
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Zero server uploads. Extracted directly in your browser.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
