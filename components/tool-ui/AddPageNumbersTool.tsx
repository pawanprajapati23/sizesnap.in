'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
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
  Hash,
  Settings,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

interface PdfDocMeta {
  file: File;
  name: string;
  size: number;
  pageCount: number;
}

type NumberPosition =
  | 'bottom-center'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'top-right'
  | 'top-left';

type NumberFormat = 'page-n' | 'page-n-of-total' | 'n-of-total' | 'n' | 'hyphen-n';

export function AddPageNumbersTool() {
  const [docMeta, setDocMeta] = useState<PdfDocMeta | null>(null);

  // Settings
  const [position, setPosition] = useState<NumberPosition>('bottom-center');
  const [format, setFormat] = useState<NumberFormat>('page-n-of-total');
  const [startNum, setStartNum] = useState<number>(1);
  const [skipCover, setSkipCover] = useState<boolean>(false);
  const [fontSize, setFontSize] = useState<number>(10);
  const [textColor, setTextColor] = useState<'black' | 'charcoal' | 'gray' | 'navy'>('charcoal');
  const [marginOffset, setMarginOffset] = useState<number>(25);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

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
    setResultBlob(null);
    setResultUrl(null);
    setErrorMsg(null);
  };

  const getSampleText = (n: number, total: number) => {
    switch (format) {
      case 'page-n':
        return `Page ${n}`;
      case 'page-n-of-total':
        return `Page ${n} of ${total}`;
      case 'n-of-total':
        return `${n} of ${total}`;
      case 'n':
        return `${n}`;
      case 'hyphen-n':
        return `- ${n} -`;
    }
  };

  // Add Page Numbers Execution
  const handleApplyNumbers = async () => {
    if (!docMeta) return;

    setIsProcessing(true);
    setErrorMsg(null);
    setProgressMsg('Loading PDF and fonts...');

    await new Promise((r) => setTimeout(r, 50));

    try {
      const buffer = await docMeta.file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const pages = doc.getPages();
      const totalPages = pages.length;

      // Color selection
      let colorRgb = rgb(0.2, 0.2, 0.2);
      if (textColor === 'black') colorRgb = rgb(0, 0, 0);
      else if (textColor === 'gray') colorRgb = rgb(0.5, 0.5, 0.5);
      else if (textColor === 'navy') colorRgb = rgb(0.1, 0.2, 0.45);

      const startIndex = skipCover ? 1 : 0;
      let currentNumber = startNum;

      for (let i = startIndex; i < totalPages; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const text = getSampleText(currentNumber, totalPages);
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        let x = 0;
        let y = 0;

        // X placement
        if (position === 'bottom-left' || position === 'top-left') {
          x = marginOffset;
        } else if (position === 'bottom-right' || position === 'top-right') {
          x = width - textWidth - marginOffset;
        } else {
          // center
          x = (width - textWidth) / 2;
        }

        // Y placement
        if (position.startsWith('top')) {
          y = height - marginOffset - textHeight;
        } else {
          // bottom
          y = marginOffset;
        }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color: colorRgb,
        });

        currentNumber++;
      }

      setProgressMsg('Compiling numbered PDF document...');
      const bytes = await doc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = registerUrl(URL.createObjectURL(blob));

      setResultBlob(blob);
      setResultUrl(url);
      setIsProcessing(false);
      setProgressMsg('');
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err?.message || 'Failed to add page numbers to PDF.');
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !docMeta) return;
    const baseName = docMeta.name.replace(/\.[^/.]+$/, '');
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${baseName}-numbered.pdf`;
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
            <Hash className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Select or Drag a PDF to Add Page Numbers
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Number pages with custom positions (bottom center, top right, etc.), format styles, font size, and optional cover page skipping.
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
            <span>Multiple positions &amp; formats</span>
            <span>•</span>
            <span>Skip cover page</span>
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

          {/* Numbering Configuration */}
          <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <Settings className="h-4 w-4 text-[#414FA8]" />
              <h3 className="text-sm font-bold text-gray-900">Page Number Settings</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Position */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Position on Page:
                </label>
                <select
                  value={position}
                  onChange={(e) => {
                    setPosition(e.target.value as NumberPosition);
                    setResultUrl(null);
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-white text-gray-800"
                >
                  <option value="bottom-center">Bottom Center (Standard)</option>
                  <option value="bottom-right">Bottom Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-right">Top Right</option>
                  <option value="top-left">Top Left</option>
                </select>
              </div>

              {/* Number Format */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Number Format:
                </label>
                <select
                  value={format}
                  onChange={(e) => {
                    setFormat(e.target.value as NumberFormat);
                    setResultUrl(null);
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-white text-gray-800"
                >
                  <option value="page-n-of-total">Page 1 of {docMeta.pageCount}</option>
                  <option value="n-of-total">1 of {docMeta.pageCount}</option>
                  <option value="page-n">Page 1</option>
                  <option value="n">1 (Number only)</option>
                  <option value="hyphen-n">- 1 -</option>
                </select>
              </div>

              {/* Starting Number */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Starting Page Number:
                </label>
                <input
                  type="number"
                  min="1"
                  value={startNum}
                  onChange={(e) => {
                    setStartNum(Math.max(1, parseInt(e.target.value, 10) || 1));
                    setResultUrl(null);
                  }}
                  className="w-full px-3 py-1.5 text-xs border border-gray-300 rounded bg-white text-gray-800"
                />
              </div>

              {/* Font Size */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Font Size:
                </label>
                <select
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(Number(e.target.value));
                    setResultUrl(null);
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-white text-gray-800"
                >
                  <option value={9}>Small (9 pt)</option>
                  <option value={10}>Standard (10 pt)</option>
                  <option value={12}>Medium (12 pt)</option>
                  <option value={14}>Large (14 pt)</option>
                </select>
              </div>

              {/* Text Color */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Text Color:
                </label>
                <select
                  value={textColor}
                  onChange={(e) => {
                    setTextColor(e.target.value as any);
                    setResultUrl(null);
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-white text-gray-800"
                >
                  <option value="charcoal">Dark Charcoal (Subtle)</option>
                  <option value="black">Pure Black</option>
                  <option value="gray">Medium Gray</option>
                  <option value="navy">Navy Blue</option>
                </select>
              </div>

              {/* Margin Offset */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Margin from Page Edge:
                </label>
                <select
                  value={marginOffset}
                  onChange={(e) => {
                    setMarginOffset(Number(e.target.value));
                    setResultUrl(null);
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-white text-gray-800"
                >
                  <option value={18}>Compact (18 pt / ~6 mm)</option>
                  <option value={25}>Standard (25 pt / ~9 mm)</option>
                  <option value={35}>Wide (35 pt / ~12 mm)</option>
                </select>
              </div>
            </div>

            {/* Checkbox: Skip First Page */}
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={skipCover}
                  onChange={(e) => {
                    setSkipCover(e.target.checked);
                    setResultUrl(null);
                  }}
                  className="accent-[#414FA8]"
                />
                <span className="font-semibold">
                  Do not number the first page (Cover / Title Page)
                </span>
              </label>

              <div className="text-xs text-gray-500">
                Preview sample:{' '}
                <span className="font-mono font-bold text-[#414FA8] bg-[#EEF1FB] px-2 py-0.5 rounded">
                  {getSampleText(startNum, docMeta.pageCount)}
                </span>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleApplyNumbers}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>{progressMsg || 'Adding page numbers...'}</span>
                  </>
                ) : (
                  <>
                    <Hash className="h-4 w-4 text-amber-300" />
                    <span>Add Page Numbers to All {docMeta.pageCount} Pages</span>
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
                      Page Numbers Added Successfully!
                    </h3>
                    <p className="text-xs text-gray-500">
                      Numbered {skipCover ? docMeta.pageCount - 1 : docMeta.pageCount} pages at position {position}.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold text-[#414FA8] bg-[#EEF1FB] border border-[#9AA3C8]/40 rounded-full">
                    {docMeta.pageCount} Pages • {formatBytes(resultBlob.size)}
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
                  <span>Download Numbered PDF</span>
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
                >
                  Number Another PDF
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Zero server uploads. Numbered directly in your browser.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
