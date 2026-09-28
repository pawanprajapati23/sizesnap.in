'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { formatBytes } from '@/lib/format-utils';
import {
  Upload,
  FilePlus,
  Trash2,
  Download,
  RotateCw,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  FileText,
  RefreshCw,
  CheckSquare,
  Square,
} from 'lucide-react';

interface PdfDocMeta {
  file: File;
  name: string;
  size: number;
  pageCount: number;
}

export function RotatePdfTool() {
  const [docMeta, setDocMeta] = useState<PdfDocMeta | null>(null);
  // Store rotation angle in degrees for each page (0-indexed)
  const [pageRotations, setPageRotations] = useState<number[]>([]);
  // Selected page indices for targeted rotation
  const [selectedPages, setSelectedPages] = useState<Set<number>>(new Set());

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
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
      const pages = doc.getPages();

      // Read current base rotation of pages if already rotated
      const rotations: number[] = [];
      for (let i = 0; i < count; i++) {
        const curRot = pages[i].getRotation().angle || 0;
        rotations.push(curRot % 360);
      }

      setDocMeta({
        file,
        name: file.name,
        size: file.size,
        pageCount: count,
      });
      setPageRotations(rotations);

      // Select all by default
      const all = new Set<number>();
      for (let i = 0; i < count; i++) all.add(i);
      setSelectedPages(all);

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
    setPageRotations([]);
    setSelectedPages(new Set());
    setResultBlob(null);
    setResultUrl(null);
    setErrorMsg(null);
  };

  // Rotate single page
  const rotateSingle = (pageIdx: number, delta: number) => {
    setPageRotations((prev) => {
      const copy = [...prev];
      copy[pageIdx] = (copy[pageIdx] + delta + 360) % 360;
      return copy;
    });
    setResultUrl(null);
  };

  // Rotate selected pages (or all if none specifically unchecked)
  const rotateSelected = (delta: number) => {
    setPageRotations((prev) => {
      const copy = [...prev];
      selectedPages.forEach((idx) => {
        copy[idx] = (copy[idx] + delta + 360) % 360;
      });
      return copy;
    });
    setResultUrl(null);
  };

  // Rotate ALL pages
  const rotateAll = (delta: number) => {
    setPageRotations((prev) => prev.map((rot) => (rot + delta + 360) % 360));
    setResultUrl(null);
  };

  // Reset all rotations to 0
  const resetRotations = () => {
    setPageRotations((prev) => prev.map(() => 0));
    setResultUrl(null);
  };

  // Toggle page selection
  const togglePageSelect = (pageIdx: number) => {
    setSelectedPages((prev) => {
      const copy = new Set(prev);
      if (copy.has(pageIdx)) {
        copy.delete(pageIdx);
      } else {
        copy.add(pageIdx);
      }
      return copy;
    });
  };

  const selectAll = () => {
    if (!docMeta) return;
    const all = new Set<number>();
    for (let i = 0; i < docMeta.pageCount; i++) all.add(i);
    setSelectedPages(all);
  };

  const deselectAll = () => {
    setSelectedPages(new Set());
  };

  // Save rotated PDF
  const handleSaveRotated = async () => {
    if (!docMeta) return;

    setIsProcessing(true);
    setErrorMsg(null);
    setProgressMsg('Applying page rotations...');

    await new Promise((r) => setTimeout(r, 50));

    try {
      const buffer = await docMeta.file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const pages = doc.getPages();

      for (let i = 0; i < pages.length; i++) {
        const targetRot = pageRotations[i] || 0;
        pages[i].setRotation(degrees(targetRot));
      }

      setProgressMsg('Compiling rotated PDF document...');
      const bytes = await doc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = registerUrl(URL.createObjectURL(blob));

      setResultBlob(blob);
      setResultUrl(url);
      setIsProcessing(false);
      setProgressMsg('');
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err?.message || 'Failed to rotate PDF pages.');
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !docMeta) return;
    const baseName = docMeta.name.replace(/\.[^/.]+$/, '');
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${baseName}-rotated.pdf`;
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
            <RotateCw className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Select or Drag a PDF to Rotate
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Rotate individual pages or all pages by 90°, 180°, or 270°. Fix upside-down or sideways pages permanently.
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
            <span>Visual rotation controls</span>
            <span>•</span>
            <span>Lossless stream update</span>
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

          {/* Quick Rotation Toolbar */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Bulk Rotation Tools:
                </span>
                <span className="text-xs text-gray-500">
                  ({selectedPages.size} of {docMeta.pageCount} selected)
                </span>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={selectAll}
                  className="text-[#414FA8] hover:underline font-semibold"
                >
                  Select All
                </button>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={deselectAll}
                  className="text-gray-500 hover:underline"
                >
                  Clear Selection
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => rotateSelected(90)}
                disabled={selectedPages.size === 0}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#EEF1FB] hover:bg-[#E2E7F8] disabled:opacity-40 text-[#414FA8] font-semibold text-xs rounded border border-[#9AA3C8]/40 transition-colors"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Rotate Selected Right (90°)</span>
              </button>

              <button
                type="button"
                onClick={() => rotateSelected(-90)}
                disabled={selectedPages.size === 0}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#EEF1FB] hover:bg-[#E2E7F8] disabled:opacity-40 text-[#414FA8] font-semibold text-xs rounded border border-[#9AA3C8]/40 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Rotate Selected Left (90°)</span>
              </button>

              <button
                type="button"
                onClick={() => rotateAll(90)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded border border-gray-200 transition-colors"
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span>Rotate ALL Pages (90°)</span>
              </button>

              <button
                type="button"
                onClick={() => rotateAll(180)}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs rounded border border-gray-200 transition-colors"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Flip ALL (180°)</span>
              </button>

              <button
                type="button"
                onClick={resetRotations}
                className="inline-flex items-center gap-1 px-3 py-2 bg-white hover:bg-gray-50 text-gray-600 text-xs rounded border border-gray-200 transition-colors ml-auto"
              >
                <span>Reset to 0°</span>
              </button>
            </div>
          </div>

          {/* Page Grid */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Pages Overview ({docMeta.pageCount})
              </span>
              <span className="text-[11px] text-gray-400">
                Click a page card to select/deselect or use the arrows to rotate individual pages
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {Array.from({ length: docMeta.pageCount }, (_, idx) => {
                const currentAngle = pageRotations[idx] || 0;
                const isSelected = selectedPages.has(idx);

                return (
                  <div
                    key={idx}
                    className={`p-3 rounded-[4px] border flex flex-col items-center justify-between gap-2.5 transition-all ${
                      isSelected
                        ? 'border-[#414FA8] bg-[#FAFAFC] ring-1 ring-[#414FA8]'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    {/* Header: Page Num + Checkbox */}
                    <div className="w-full flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => togglePageSelect(idx)}
                        className="flex items-center gap-1 text-xs text-gray-700 font-medium cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="h-3.5 w-3.5 text-[#414FA8]" />
                        ) : (
                          <Square className="h-3.5 w-3.5 text-gray-400" />
                        )}
                        <span>Page {idx + 1}</span>
                      </button>

                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          currentAngle === 0
                            ? 'bg-gray-100 text-gray-500'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {currentAngle}°
                      </span>
                    </div>

                    {/* Visual Page Graphic with CSS rotation */}
                    <div
                      onClick={() => togglePageSelect(idx)}
                      className="h-28 w-20 rounded border border-gray-300 bg-white shadow-xs flex items-center justify-center cursor-pointer transition-transform duration-200 overflow-hidden relative"
                      style={{ transform: `rotate(${currentAngle}deg)` }}
                    >
                      <div className="w-full h-full p-2 flex flex-col justify-between text-gray-300 pointer-events-none select-none">
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

                    {/* Individual Page Rotation Buttons */}
                    <div className="flex items-center gap-1 w-full justify-center pt-1 border-t border-gray-100">
                      <button
                        type="button"
                        onClick={() => rotateSingle(idx, -90)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-600 border border-gray-200"
                        title="Rotate Left 90°"
                      >
                        <RotateCcw className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => rotateSingle(idx, 90)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-600 border border-gray-200"
                        title="Rotate Right 90°"
                      >
                        <RotateCw className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Save Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveRotated}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>{progressMsg || 'Saving rotations...'}</span>
                  </>
                ) : (
                  <>
                    <RotateCw className="h-4 w-4 text-amber-300" />
                    <span>Save &amp; Download Rotated PDF</span>
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
                      PDF Rotated Successfully!
                    </h3>
                    <p className="text-xs text-gray-500">
                      All page orientation changes have been permanently applied.
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
                  <span>Download Rotated PDF</span>
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
                >
                  Rotate Another
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Zero server uploads. Rotated directly in your browser.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
