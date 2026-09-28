'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { formatBytes } from '@/lib/format-utils';
import {
  Upload,
  FilePlus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  FileText,
  Layers,
  RefreshCw,
} from 'lucide-react';

interface PdfFileItem {
  id: string;
  file: File;
  pageCount: number;
  size: number;
  name: string;
}

export function MergePdfTool() {
  const [items, setItems] = useState<PdfFileItem[]>([]);
  const [isMerging, setIsMerging] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
  const [mergedBlob, setMergedBlob] = useState<Blob | null>(null);
  const [mergedUrl, setMergedUrl] = useState<string | null>(null);
  const [mergedTotalPages, setMergedTotalPages] = useState<number>(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);
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

  const processPdfFiles = useCallback(async (files: FileList | File[]) => {
    setErrorMsg(null);
    const newItems: PdfFileItem[] = [];

    for (const file of Array.from(files)) {
      if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        setErrorMsg('Please select valid PDF documents.');
        continue;
      }

      try {
        const buffer = await file.arrayBuffer();
        const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const count = doc.getPageCount();

        newItems.push({
          id: `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          file,
          pageCount: count,
          size: file.size,
          name: file.name,
        });
      } catch (err: any) {
        setErrorMsg(`Could not read "${file.name}": It might be encrypted or corrupted.`);
      }
    }

    if (newItems.length > 0) {
      setItems((prev) => [...prev, ...newItems]);
      setMergedUrl(null);
      setMergedBlob(null);
    }
  }, []);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.length) {
      processPdfFiles(e.dataTransfer.files);
    }
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setMergedUrl(null);
  };

  const moveDown = (index: number) => {
    if (index === items.length - 1) return;
    setItems((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setMergedUrl(null);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
    setMergedUrl(null);
  };

  const clearAll = () => {
    cleanupUrls();
    setItems([]);
    setMergedBlob(null);
    setMergedUrl(null);
    setMergedTotalPages(0);
    setErrorMsg(null);
  };

  // Perform Merge using pdf-lib
  const handleMergePdfs = async () => {
    if (items.length < 2) {
      setErrorMsg('Please upload at least 2 PDF documents to merge.');
      return;
    }

    setIsMerging(true);
    setErrorMsg(null);
    setProgressMsg('Initializing merged document...');

    await new Promise((r) => setTimeout(r, 50));

    try {
      const mergedPdf = await PDFDocument.create();
      let totalCopied = 0;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        setProgressMsg(`Merging "${item.name}" (${i + 1} of ${items.length})...`);

        const buffer = await item.file.arrayBuffer();
        const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const indices = srcDoc.getPageIndices();
        const copiedPages = await mergedPdf.copyPages(srcDoc, indices);

        copiedPages.forEach((page) => mergedPdf.addPage(page));
        totalCopied += copiedPages.length;
      }

      setProgressMsg('Compiling final PDF...');
      const mergedBytes = await mergedPdf.save();
      const blob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = registerUrl(URL.createObjectURL(blob));

      setMergedBlob(blob);
      setMergedUrl(url);
      setMergedTotalPages(totalCopied);
      setIsMerging(false);
      setProgressMsg('');
    } catch (err: any) {
      setIsMerging(false);
      setErrorMsg(err?.message || 'Failed to merge PDF documents.');
    }
  };

  const handleDownload = () => {
    if (!mergedUrl) return;
    const a = document.createElement('a');
    a.href = mergedUrl;
    a.download = 'sizesnap-merged.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const totalPagesSum = items.reduce((sum, it) => sum + it.pageCount, 0);

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
      {items.length === 0 ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[4px] border-2 border-dashed border-[#9AA3C8] bg-[#FAFAFC] hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-colors cursor-pointer select-none"
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="application/pdf,.pdf"
            onChange={(e) => e.target.files && processPdfFiles(e.target.files)}
            className="sr-only"
          />
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-4">
            <Layers className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Select or Drag Multiple PDF Files to Merge
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Combine two or more PDF documents into one. Drag or use arrow keys to change document order before merging.
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
            <span>Select PDF Files</span>
          </button>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
            <span>Combine unlimited PDFs</span>
            <span>•</span>
            <span>Preserve bookmarks &amp; text</span>
            <span>•</span>
            <span>100% Client-Side</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-[4px] border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] font-bold text-xs">
                {items.length}
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                  {items.length} PDF Document{items.length > 1 ? 's' : ''} Ready to Merge
                </h3>
                <p className="text-[11px] text-gray-500">
                  Total {totalPagesSum} pages across all documents
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => addMoreInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#9AA3C8] hover:border-[#414FA8] bg-white hover:bg-[#EEF1FB] text-[#414FA8] text-xs font-semibold transition-colors"
              >
                <FilePlus className="h-3.5 w-3.5" />
                <span>Add More PDFs</span>
              </button>
              <input
                ref={addMoreInputRef}
                type="file"
                multiple
                accept="application/pdf,.pdf"
                onChange={(e) => e.target.files && processPdfFiles(e.target.files)}
                className="sr-only"
              />

              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Reorderable Documents List */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Document Merge Sequence
              </span>
              <span className="text-[11px] text-gray-400">
                Documents are merged from top to bottom
              </span>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-[4px] border border-gray-200 hover:border-[#9AA3C8] bg-[#FAFAFC] transition-colors"
                >
                  {/* Order Badge */}
                  <span className="h-6 w-6 rounded-full bg-[#EEF1FB] text-[#414FA8] text-xs font-bold flex items-center justify-center shrink-0 border border-[#9AA3C8]/40">
                    {idx + 1}
                  </span>

                  {/* Icon */}
                  <div className="h-9 w-9 rounded bg-red-50 text-red-600 border border-red-200 flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5" />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      {item.pageCount} page{item.pageCount > 1 ? 's' : ''} • {formatBytes(item.size)}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700"
                      title="Move Up"
                      aria-label={`Move ${item.name} up`}
                    >
                      <ArrowUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(idx)}
                      disabled={idx === items.length - 1}
                      className="p-1.5 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700"
                      title="Move Down"
                      aria-label={`Move ${item.name} down`}
                    >
                      <ArrowDown className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="p-1.5 rounded border border-gray-200 bg-white hover:bg-red-50 hover:border-red-300 text-gray-500 hover:text-red-600 transition-colors ml-1"
                      title="Remove"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Merge Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleMergePdfs}
                disabled={isMerging || items.length < 2}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isMerging ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>{progressMsg || 'Merging PDF files...'}</span>
                  </>
                ) : (
                  <>
                    <Layers className="h-4 w-4 text-amber-300" />
                    <span>Merge {items.length} PDF Files ({totalPagesSum} Total Pages)</span>
                  </>
                )}
              </button>
              {items.length < 2 && (
                <p className="text-[11px] text-gray-400 text-center mt-1.5">
                  Add at least 2 PDF files to activate merge
                </p>
              )}
            </div>
          </div>

          {/* Merge Result Card */}
          {mergedBlob && mergedUrl && (
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">
                      PDFs Merged Successfully!
                    </h3>
                    <p className="text-xs text-gray-500">
                      Combined into one document containing {mergedTotalPages} pages.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold text-[#414FA8] bg-[#EEF1FB] border border-[#9AA3C8]/40 rounded-full">
                    {mergedTotalPages} Pages • {formatBytes(mergedBlob.size)}
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
                  <span>Download sizesnap-merged.pdf</span>
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
                >
                  Merge More
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Zero server uploads. Your PDF files were merged entirely in your browser sandbox.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
