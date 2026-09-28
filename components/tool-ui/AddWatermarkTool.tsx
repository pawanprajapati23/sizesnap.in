'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
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
  Stamp,
  Settings,
  Sliders,
  Type,
  Eye,
} from 'lucide-react';

interface PdfDocMeta {
  file: File;
  name: string;
  size: number;
  pageCount: number;
}

type WatermarkPosition = 'diagonal-center' | 'center' | 'header' | 'footer';
type WatermarkColor = 'red' | 'gray' | 'blue' | 'black' | 'green';

export function AddWatermarkTool() {
  const [docMeta, setDocMeta] = useState<PdfDocMeta | null>(null);

  // Settings
  const [watermarkText, setWatermarkText] = useState<string>('CONFIDENTIAL');
  const [position, setPosition] = useState<WatermarkPosition>('diagonal-center');
  const [opacity, setOpacity] = useState<number>(25);
  const [fontSize, setFontSize] = useState<number>(48);
  const [color, setColor] = useState<WatermarkColor>('red');
  const [skipCover, setSkipCover] = useState<boolean>(false);

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

  // Watermark Apply Execution
  const handleApplyWatermark = async () => {
    if (!docMeta) return;

    if (!watermarkText.trim()) {
      setErrorMsg('Please enter watermark text.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    setProgressMsg('Loading PDF and embedding watermark font...');

    await new Promise((r) => setTimeout(r, 50));

    try {
      const buffer = await docMeta.file.arrayBuffer();
      const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const font = await doc.embedFont(StandardFonts.HelveticaBold);
      const pages = doc.getPages();
      const totalPages = pages.length;

      // Color mapping
      let colorRgb = rgb(0.85, 0.15, 0.15);
      if (color === 'gray') colorRgb = rgb(0.4, 0.4, 0.4);
      else if (color === 'blue') colorRgb = rgb(0.1, 0.3, 0.7);
      else if (color === 'black') colorRgb = rgb(0.0, 0.0, 0.0);
      else if (color === 'green') colorRgb = rgb(0.15, 0.55, 0.25);

      const startIndex = skipCover ? 1 : 0;
      const opacityVal = Math.min(1, Math.max(0.05, opacity / 100));

      for (let i = startIndex; i < totalPages; i++) {
        const page = pages[i];
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        let x = 0;
        let y = 0;
        let angle = 0;

        if (position === 'diagonal-center') {
          angle = 45;
          // Approximate centered position considering rotation
          const rad = (45 * Math.PI) / 180;
          x = (width - textWidth * Math.cos(rad) + textHeight * Math.sin(rad)) / 2;
          y = (height - textWidth * Math.sin(rad) - textHeight * Math.cos(rad)) / 2;
        } else if (position === 'center') {
          angle = 0;
          x = (width - textWidth) / 2;
          y = (height - textHeight) / 2;
        } else if (position === 'header') {
          angle = 0;
          x = (width - textWidth) / 2;
          y = height - 40 - textHeight;
        } else if (position === 'footer') {
          angle = 0;
          x = (width - textWidth) / 2;
          y = 40;
        }

        page.drawText(watermarkText, {
          x,
          y,
          size: fontSize,
          font,
          color: colorRgb,
          opacity: opacityVal,
          rotate: degrees(angle),
        });
      }

      setProgressMsg('Compiling watermarked PDF document...');
      const bytes = await doc.save();
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const url = registerUrl(URL.createObjectURL(blob));

      setResultBlob(blob);
      setResultUrl(url);
      setIsProcessing(false);
      setProgressMsg('');
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err?.message || 'Failed to add watermark to PDF.');
    }
  };

  const handleDownload = () => {
    if (!resultUrl || !docMeta) return;
    const baseName = docMeta.name.replace(/\.[^/.]+$/, '');
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `${baseName}-watermarked.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const presets = ['CONFIDENTIAL', 'DRAFT', 'DO NOT COPY', 'SAMPLE', 'FOR REVIEW ONLY'];

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
            <Stamp className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Select or Drag a PDF to Add Watermark
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Stamp diagonal or horizontal text watermarks (e.g. CONFIDENTIAL, DRAFT) across all pages with customizable opacity and font size.
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
            <span>Diagonal &amp; center placement</span>
            <span>•</span>
            <span>Adjustable transparency</span>
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

          {/* Watermark Configuration */}
          <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <Settings className="h-4 w-4 text-[#414FA8]" />
              <h3 className="text-sm font-bold text-gray-900">Watermark Configuration</h3>
            </div>

            {/* Text Input & Quick Presets */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                <Type className="h-3.5 w-3.5 text-[#414FA8]" />
                <span>Watermark Text:</span>
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => {
                  setWatermarkText(e.target.value);
                  setResultUrl(null);
                }}
                placeholder="Enter text (e.g. CONFIDENTIAL)"
                className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded bg-white text-gray-900 font-semibold focus:border-[#414FA8] focus:ring-1 focus:ring-[#414FA8] outline-none"
              />
              <div className="flex flex-wrap gap-1.5 pt-1">
                {presets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setWatermarkText(preset);
                      setResultUrl(null);
                    }}
                    className={`px-2.5 py-1 text-xs rounded border transition-colors ${
                      watermarkText === preset
                        ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Position, Color, Size */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              {/* Position */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Position &amp; Angle:
                </label>
                <select
                  value={position}
                  onChange={(e) => {
                    setPosition(e.target.value as WatermarkPosition);
                    setResultUrl(null);
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-white text-gray-800"
                >
                  <option value="diagonal-center">Diagonal Center (45° Angle)</option>
                  <option value="center">Horizontal Center (0° Angle)</option>
                  <option value="header">Header (Top Center)</option>
                  <option value="footer">Footer (Bottom Center)</option>
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Color:
                </label>
                <select
                  value={color}
                  onChange={(e) => {
                    setColor(e.target.value as WatermarkColor);
                    setResultUrl(null);
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-white text-gray-800"
                >
                  <option value="red">Warning Red</option>
                  <option value="gray">Neutral Gray</option>
                  <option value="blue">Classic Blue</option>
                  <option value="black">Bold Black</option>
                  <option value="green">Forest Green</option>
                </select>
              </div>

              {/* Font Size */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Font Size ({fontSize} pt):
                </label>
                <input
                  type="range"
                  min="20"
                  max="90"
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(Number(e.target.value));
                    setResultUrl(null);
                  }}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#414FA8]"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                  <span>Small (20pt)</span>
                  <span>48pt (Standard)</span>
                  <span>Huge (90pt)</span>
                </div>
              </div>
            </div>

            {/* Opacity Slider */}
            <div className="space-y-1.5 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-[#414FA8]" />
                  <span>Watermark Transparency / Opacity:</span>
                </label>
                <span className="text-xs font-bold text-[#414FA8]">{opacity}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                value={opacity}
                onChange={(e) => {
                  setOpacity(Number(e.target.value));
                  setResultUrl(null);
                }}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#414FA8]"
              />
              <div className="flex justify-between text-[10px] text-gray-400">
                <span>10% (Very subtle)</span>
                <span>25% (Recommended for readability)</span>
                <span>80% (Prominent)</span>
              </div>
            </div>

            {/* Checkbox: Skip Cover */}
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
                  Do not watermark the first page (Cover / Title Page)
                </span>
              </label>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleApplyWatermark}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>{progressMsg || 'Stamping watermark...'}</span>
                  </>
                ) : (
                  <>
                    <Stamp className="h-4 w-4 text-amber-300" />
                    <span>Apply Watermark to All {docMeta.pageCount} Pages</span>
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
                      Watermark Applied Successfully!
                    </h3>
                    <p className="text-xs text-gray-500">
                      Stamped &ldquo;{watermarkText}&rdquo; across {skipCover ? docMeta.pageCount - 1 : docMeta.pageCount} pages.
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
                  <span>Download Watermarked PDF</span>
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
                >
                  Watermark Another PDF
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Zero server uploads. Watermarked directly in your browser.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
