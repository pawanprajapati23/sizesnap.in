'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { formatBytes } from '@/lib/format-utils';
import {
  Upload,
  FilePlus,
  Trash2,
  ArrowUp,
  ArrowDown,
  FileText,
  Download,
  Settings,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  RefreshCw,
  Eye,
  GripVertical,
} from 'lucide-react';

export interface ImageItem {
  id: string;
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  size: number;
  name: string;
  type: string;
}

export type PageSizeOption = 'a4' | 'letter' | 'legal' | 'fit-image';
export type OrientationOption = 'auto' | 'portrait' | 'landscape';
export type MarginOption = 'none' | 'small' | 'large';
export type FitOption = 'fit' | 'fill' | 'original';

const PAGE_DIMENSIONS_PT: Record<Exclude<PageSizeOption, 'fit-image'>, { width: number; height: number }> = {
  a4: { width: 595.28, height: 841.89 },
  letter: { width: 612.0, height: 792.0 },
  legal: { width: 612.0, height: 1008.0 },
};

const MARGIN_PT: Record<MarginOption, number> = {
  none: 0,
  small: 20,
  large: 40,
};

export function ImageToPdfConverter() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSizeOption>('a4');
  const [orientation, setOrientation] = useState<OrientationOption>('auto');
  const [margin, setMargin] = useState<MarginOption>('small');
  const [fit, setFit] = useState<FitOption>('fit');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [progressText, setProgressText] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Result state
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [pdfPageCount, setPdfPageCount] = useState<number>(0);

  // Object URL tracking for cleanup
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
  const addMoreInputRef = useRef<HTMLInputElement>(null);

  // Helper to load file into ImageItem
  const processFiles = useCallback((files: FileList | File[]) => {
    setErrorMsg(null);
    const newItems: ImageItem[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        return;
      }

      const previewUrl = registerUrl(URL.createObjectURL(file));
      const img = new Image();

      img.onload = () => {
        setImages((prev) => [
          ...prev,
          {
            id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            file,
            previewUrl,
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
            size: file.size,
            name: file.name,
            type: file.type,
          },
        ]);
      };

      img.onerror = () => {
        // ignore unreadable
      };

      img.src = previewUrl;
    });
  }, [registerUrl]);

  // Upload handler
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Reorder actions
  const moveUp = (index: number) => {
    if (index === 0) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setPdfUrl(null);
  };

  const moveDown = (index: number) => {
    if (index === images.length - 1) return;
    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
    setPdfUrl(null);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPdfUrl(null);
  };

  const clearAll = () => {
    cleanupUrls();
    setImages([]);
    setPdfBlob(null);
    setPdfUrl(null);
    setPdfPageCount(0);
    setErrorMsg(null);
  };

  // Convert an image file or preview into embedded PDF Image
  const embedImageInPdf = async (pdfDoc: PDFDocument, item: ImageItem) => {
    // Attempt direct embed for clean JPEGs
    if (item.type === 'image/jpeg' || item.type === 'image/jpg') {
      try {
        const buffer = await item.file.arrayBuffer();
        return await pdfDoc.embedJpg(buffer);
      } catch {
        // Fallback to canvas below
      }
    }

    // For PNGs
    if (item.type === 'image/png') {
      try {
        const buffer = await item.file.arrayBuffer();
        return await pdfDoc.embedPng(buffer);
      } catch {
        // Fallback to canvas below
      }
    }

    // Canvas fallback for WebP, complex PNGs, and corrupted headers
    return new Promise<any>((resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return reject(new Error('Canvas 2D context unavailable'));

          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          const base64 = dataUrl.split(',')[1];
          const binaryStr = atob(base64);
          const len = binaryStr.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryStr.charCodeAt(i);
          }
          const embedded = await pdfDoc.embedJpg(bytes);
          resolve(embedded);
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error(`Failed to decode image ${item.name}`));
      img.src = item.previewUrl;
    });
  };

  // PDF Generation Engine
  const handleGeneratePdf = async () => {
    if (images.length === 0) return;

    setIsGenerating(true);
    setErrorMsg(null);
    setProgressText('Initializing PDF document...');

    // Small delay so UI renders progress bar
    await new Promise((r) => setTimeout(r, 60));

    try {
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < images.length; i++) {
        const item = images[i];
        setProgressText(`Processing image ${i + 1} of ${images.length}...`);

        const embeddedImage = await embedImageInPdf(pdfDoc, item);
        const imgWidth = embeddedImage.width;
        const imgHeight = embeddedImage.height;

        let pageWidth: number;
        let pageHeight: number;

        if (pageSize === 'fit-image') {
          // Page dimensions equal image natural dimensions (converted at 72dpi standard)
          pageWidth = imgWidth;
          pageHeight = imgHeight;
        } else {
          const baseDims = PAGE_DIMENSIONS_PT[pageSize];

          // Determine orientation
          let isLandscape = false;
          if (orientation === 'landscape') {
            isLandscape = true;
          } else if (orientation === 'portrait') {
            isLandscape = false;
          } else {
            // Auto
            isLandscape = imgWidth > imgHeight;
          }

          pageWidth = isLandscape
            ? Math.max(baseDims.width, baseDims.height)
            : Math.min(baseDims.width, baseDims.height);
          pageHeight = isLandscape
            ? Math.min(baseDims.width, baseDims.height)
            : Math.max(baseDims.width, baseDims.height);
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Background
        page.drawRectangle({
          x: 0,
          y: 0,
          width: pageWidth,
          height: pageHeight,
          color: rgb(1, 1, 1),
        });

        const marginPt = pageSize === 'fit-image' ? 0 : MARGIN_PT[margin];
        const availWidth = Math.max(10, pageWidth - marginPt * 2);
        const availHeight = Math.max(10, pageHeight - marginPt * 2);

        let drawW: number;
        let drawH: number;
        let drawX: number;
        let drawY: number;

        if (fit === 'fill' && pageSize !== 'fit-image') {
          // Fill available box (stretched)
          drawW = availWidth;
          drawH = availHeight;
          drawX = marginPt;
          drawY = marginPt;
        } else if (fit === 'original' && pageSize !== 'fit-image') {
          // Centered at natural size or capped to avail
          drawW = Math.min(imgWidth, availWidth);
          drawH = (drawW / imgWidth) * imgHeight;
          if (drawH > availHeight) {
            drawH = availHeight;
            drawW = (drawH / imgHeight) * imgWidth;
          }
          drawX = marginPt + (availWidth - drawW) / 2;
          drawY = marginPt + (availHeight - drawH) / 2;
        } else {
          // Fit (proportional within bounds)
          const scale = Math.min(availWidth / imgWidth, availHeight / imgHeight);
          drawW = imgWidth * scale;
          drawH = imgHeight * scale;
          drawX = marginPt + (availWidth - drawW) / 2;
          drawY = marginPt + (availHeight - drawH) / 2;
        }

        page.drawImage(embeddedImage, {
          x: drawX,
          y: drawY,
          width: drawW,
          height: drawH,
        });
      }

      setProgressText('Compiling PDF file...');
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const downloadUrl = registerUrl(URL.createObjectURL(blob));

      setPdfBlob(blob);
      setPdfUrl(downloadUrl);
      setPdfPageCount(images.length);
      setIsGenerating(false);
      setProgressText('');
    } catch (err) {
      setIsGenerating(false);
      setErrorMsg(
        err instanceof Error ? err.message : 'An unexpected error occurred during PDF generation.'
      );
    }
  };

  const handleDownload = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = 'sizesnap-images.pdf';
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

      {/* 1. Upload Dropzone when empty */}
      {images.length === 0 && (
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
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={(e) => e.target.files && processFiles(e.target.files)}
            className="sr-only"
          />
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-4">
            <Upload className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Select or Drag Multiple Images Here
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Select JPG, PNG, or WebP photos. You can reorder pages and customize paper size before creating your PDF.
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
            <span>Select Images</span>
          </button>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
            <span>Multiple files supported</span>
            <span>•</span>
            <span>100% Private in Browser</span>
          </div>
        </div>
      )}

      {/* 2. Image Manager & PDF Settings (when images uploaded) */}
      {images.length > 0 && (
        <div className="space-y-5">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-[4px] border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] font-bold text-xs">
                {images.length}
              </span>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                  {images.length} Image{images.length > 1 ? 's' : ''} Ready for PDF
                </h3>
                <span className="text-[11px] text-gray-500">
                  Total size: {formatBytes(images.reduce((acc, it) => acc + it.size, 0))}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => addMoreInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#9AA3C8] hover:border-[#414FA8] bg-white hover:bg-[#EEF1FB] text-[#414FA8] text-xs font-semibold transition-colors"
              >
                <FilePlus className="h-3.5 w-3.5" />
                <span>Add More</span>
              </button>
              <input
                ref={addMoreInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
                onChange={(e) => e.target.files && processFiles(e.target.files)}
                className="sr-only"
              />

              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium transition-colors"
                title="Remove all images"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Reorderable Image Cards Grid */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                PDF Page Order
              </span>
              <span className="text-[11px] text-gray-400">
                Use arrows to change page order
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {images.map((item, idx) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2.5 p-2.5 rounded-[4px] border border-gray-200 hover:border-[#9AA3C8] bg-[#FAFAFC] transition-colors"
                >
                  {/* Page index badge */}
                  <span className="h-6 w-6 rounded-full bg-[#EEF1FB] text-[#414FA8] text-[11px] font-bold flex items-center justify-center shrink-0 border border-[#9AA3C8]/40">
                    {idx + 1}
                  </span>

                  {/* Thumbnail */}
                  <div className="h-14 w-14 shrink-0 rounded border border-gray-200 bg-white overflow-hidden flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 truncate" title={item.name}>
                      {item.name}
                    </p>
                    <p className="text-[10px] text-gray-500">
                      {item.width} × {item.height} • {formatBytes(item.size)}
                    </p>
                  </div>

                  {/* Reorder & Delete Buttons */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        className="p-1 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700"
                        title="Move Up"
                        aria-label={`Move ${item.name} up`}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDown(idx)}
                        disabled={idx === images.length - 1}
                        className="p-1 rounded border border-gray-200 bg-white hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700"
                        title="Move Down"
                        aria-label={`Move ${item.name} down`}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="p-1 rounded border border-gray-200 bg-white hover:bg-red-50 hover:border-red-300 text-gray-500 hover:text-red-600 transition-colors self-end"
                      title="Remove from PDF"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PDF Layout & Page Settings */}
          <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <Settings className="h-4 w-4 text-[#414FA8]" />
              <h3 className="text-sm font-bold text-gray-900">PDF Document Settings</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Page Size */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Page Size:
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(e.target.value as PageSizeOption);
                    setPdfUrl(null);
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-[4px] bg-white text-gray-800"
                >
                  <option value="a4">A4 (Standard 210 × 297 mm)</option>
                  <option value="letter">US Letter (8.5 × 11 in)</option>
                  <option value="legal">US Legal (8.5 × 14 in)</option>
                  <option value="fit-image">Match Original Image Size</option>
                </select>
              </div>

              {/* Orientation */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Orientation:
                </label>
                <select
                  value={orientation}
                  disabled={pageSize === 'fit-image'}
                  onChange={(e) => {
                    setOrientation(e.target.value as OrientationOption);
                    setPdfUrl(null);
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-[4px] bg-white text-gray-800 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="auto">Auto (Match Image Ratio)</option>
                  <option value="portrait">Portrait (Vertical)</option>
                  <option value="landscape">Landscape (Horizontal)</option>
                </select>
              </div>

              {/* Placement / Fit */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Image Placement:
                </label>
                <select
                  value={fit}
                  disabled={pageSize === 'fit-image'}
                  onChange={(e) => {
                    setFit(e.target.value as FitOption);
                    setPdfUrl(null);
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-[4px] bg-white text-gray-800 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="fit">Fit (Keep Aspect Ratio, No Crop)</option>
                  <option value="fill">Fill (Cover Entire Page)</option>
                  <option value="original">Original Proportions (Centered)</option>
                </select>
              </div>

              {/* Margins */}
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">
                  Page Margins:
                </label>
                <select
                  value={margin}
                  disabled={pageSize === 'fit-image'}
                  onChange={(e) => {
                    setMargin(e.target.value as MarginOption);
                    setPdfUrl(null);
                  }}
                  className="w-full px-3 py-2 text-xs border border-gray-300 rounded-[4px] bg-white text-gray-800 disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="small">Small (~7 mm Margin)</option>
                  <option value="none">No Margins (Edge-to-Edge)</option>
                  <option value="large">Large (~14 mm Margin)</option>
                </select>
              </div>
            </div>

            {/* Action Generate Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleGeneratePdf}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>{progressText || 'Creating PDF document...'}</span>
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4 text-amber-300" />
                    <span>Convert {images.length} Image{images.length > 1 ? 's' : ''} to PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* 3. Generated PDF Result View */}
          {pdfBlob && pdfUrl && (
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-gray-900">
                      PDF Document Ready!
                    </h3>
                    <p className="text-xs text-gray-500">
                      Combined {pdfPageCount} image{pdfPageCount > 1 ? 's' : ''} into a single document.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 text-xs font-bold text-[#414FA8] bg-[#EEF1FB] border border-[#9AA3C8]/40 rounded-full">
                    {pdfPageCount} Pages • {formatBytes(pdfBlob.size)}
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
                  <span>Download sizesnap-images.pdf</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPdfUrl(null)}
                  className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-[#9AA3C8] bg-white hover:bg-[#EEF1FB] hover:border-[#414FA8] text-[#414FA8] text-xs font-semibold transition-colors"
                >
                  Modify Settings
                </button>

                <button
                  type="button"
                  onClick={clearAll}
                  className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
                >
                  New PDF
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>Your files were compiled entirely in your browser without uploading.</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
