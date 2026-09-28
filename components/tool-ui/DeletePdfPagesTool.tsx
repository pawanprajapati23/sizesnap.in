'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
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
  XCircle,
  Check,
  RefreshCw,
} from 'lucide-react';

interface PdfDocMeta {
  file: File;
  name: string;
  size: number;
  pageCount: number;
}

export function DeletePdfPagesTool() {
  const [docMeta, setDocMeta] = useState<PdfDocMeta | null>(null);
  // Set of 0-indexed page numbers marked FOR DELETION
  const [pagesToDelete, setPagesToDelete] = useState<Set<number>>(new Set());
  const [rangeInput, setRangeInput] = useState<string>('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [remainingCount, setRemainingCount] = useState<number>(0);

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

  // Parse comma-separated ranges e.g. "2, 4-6" (1-indexed input)
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
      setPagesToDelete(new Set());
      setRangeInput('');
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
    setPagesToDelete(new Set());
    setRangeInput('');
    setResultBlob(null);
    setResultUrl(null);
    setErrorMsg(null);
  };

  // Toggle page deletion status
  const togglePageDelete = (pageIdx: number) => {
    setPagesToDelete((prev) => {
      const copy = new Set(prev);
      if (copy.has(pageIdx)) {
        copy.delete(pageIdx);
      } else {
        copy.add(pageIdx);
      }
      return copy;
    });
    setResultUrl(null);
  };

  // Apply range input
  const handleRangeInputChange = (val: string) => {
    setRangeInput(val);
    if (!docMeta) return;
    const parsed = parseRangeStringToIndices(val, docMeta.pageCount);
    setPagesToDelete(parsed);
    setResultUrl(null);
  };

  // Delete execution
  const handleDeletePages = async () => {
    if (!docMeta) return;

    if (pagesToDelete.size === 0) {
      setErrorMsg('Please select at least one page to delete.');
      return;
    }

    if (pagesToDelete.size >= docMeta.pageCount) {
      setErrorMsg('You cannot delete all pages. The PDF must keep at least 1 page.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setProgressMsg('Extracting remaining pages...');

    await new Promise((r) => setTimeout(r, 50));

    try {
      const buffer = await docMeta.file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      const keptIndices: number[] = [];
      for (let i = 0; i < docMeta.pageCount; i++) {
        if (!pagesToDelete.has(i)) {
          keptIndices.push(i);
        }
      }

      const newDoc = await PDFDocument.create();
      const copiedPages = await newDoc.copyPages(srcDoc, keptIndices);
      copiedPages.forEach((p) => newDoc.addPage(p));

      setProgressMsg('Compiling updated PDF...');
      const bytes = await newDoc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = registerUrl(URL.createObjectURL(blob));

      setResultBlob(blob);
      setResultUrl(url);
      setRemainingCount(keptIndices.length);
      setIsProcessing(false);
      setProgressMsg('');
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err?.message || 'Failed to delete PDF pages.');
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !docMeta) return;
    const baseName = docMeta.name.replace(/\.[^/.]+$/, '');
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${baseName}-pages-removed.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const remaining = docMeta ? docMeta.pageCount - pagesToDelete.size : 0;

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
            <Trash2 className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Select or Drag a PDF to Remove Pages
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Quickly remove unwanted, blank, or duplicate pages from any PDF document. Click pages to delete or enter page numbers.
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
            <span>Click-to-delete visual grid</span>
            <span>•</span>
            <span>Page range input</span>
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

          {/* Range Input & Summary Banner */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
                  Delete Specific Page Numbers
                </span>
                <p className="text-[11px] text-gray-400">
                  Click pages below or enter page numbers/ranges separated by commas (e.g. 2, 4-6)
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">
                  {pagesToDelete.size} to Delete
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  {remaining} Remaining
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={rangeInput}
                onChange={(e) => handleRangeInputChange(e.target.value)}
                placeholder="e.g. 2, 4-6, 9"
                className="flex-1 px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded bg-white text-gray-900 font-mono focus:border-[#414FA8] focus:ring-1 focus:ring-[#414FA8] outline-none"
              />
              {pagesToDelete.size > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setPagesToDelete(new Set());
                    setRangeInput('');
                  }}
                  className="px-3 py-2 text-xs border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 rounded font-medium transition-colors"
                >
                  Reset Selection
                </button>
              )}
            </div>
          </div>

          {/* Interactive Pages Grid */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Click any page to toggle deletion ({docMeta.pageCount} total pages)
              </span>
              <span className="text-[11px] text-gray-400">
                Red cards will be permanently removed
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: docMeta.pageCount }, (_, idx) => {
                const isMarkedForDeletion = pagesToDelete.has(idx);

                return (
                  <div
                    key={idx}
                    onClick={() => togglePageDelete(idx)}
                    className={`p-3 rounded-[4px] border flex flex-col items-center justify-between gap-2.5 cursor-pointer transition-all ${
                      isMarkedForDeletion
                        ? 'border-red-400 bg-red-50/80 shadow-xs ring-1 ring-red-400'
                        : 'border-gray-200 bg-white hover:border-[#9AA3C8] hover:bg-[#FAFAFC]'
                    }`}
                  >
                    {/* Header */}
                    <div className="w-full flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800">
                        Page {idx + 1}
                      </span>
                      {isMarkedForDeletion ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-semibold flex items-center gap-0.5">
                          <XCircle className="h-3 w-3" /> Delete
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-0.5">
                          <Check className="h-3 w-3" /> Keep
                        </span>
                      )}
                    </div>

                    {/* Visual Card representation */}
                    <div
                      className={`h-28 w-20 rounded border flex items-center justify-center relative transition-all overflow-hidden ${
                        isMarkedForDeletion
                          ? 'border-red-300 bg-red-100/50'
                          : 'border-gray-300 bg-white'
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

                      {/* Deletion Cross Overlay */}
                      {isMarkedForDeletion && (
                        <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                          <XCircle className="h-8 w-8 text-red-600 drop-shadow-xs" />
                        </div>
                      )}
                    </div>

                    {/* Toggle Button */}
                    <span
                      className={`text-[11px] font-medium ${
                        isMarkedForDeletion ? 'text-red-700 underline' : 'text-gray-500'
                      }`}
                    >
                      {isMarkedForDeletion ? 'Click to Restore' : 'Click to Remove'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Action Trigger Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDeletePages}
                disabled={isProcessing || pagesToDelete.size === 0 || remaining === 0}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>{progressMsg || 'Removing pages...'}</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 text-white" />
                    <span>
                      {pagesToDelete.size === 0
                        ? 'Select Pages to Remove'
                        : `Delete ${pagesToDelete.size} Page${pagesToDelete.size > 1 ? 's' : ''} (${remaining} will remain)`}
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
                      Pages Deleted Successfully!
                    </h3>
                    <p className="text-xs text-gray-500">
                      Removed {pagesToDelete.size} page{pagesToDelete.size > 1 ? 's' : ''}. Your new document contains {remainingCount} pages.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold text-[#414FA8] bg-[#EEF1FB] border border-[#9AA3C8]/40 rounded-full">
                    {remainingCount} Pages • {formatBytes(resultBlob.size)}
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
                  <Download className="h-4 w-4" />
                  <span>Download Clean PDF</span>
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
                >
                  Delete From Another PDF
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Zero server uploads. Unwanted pages removed locally in browser.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
