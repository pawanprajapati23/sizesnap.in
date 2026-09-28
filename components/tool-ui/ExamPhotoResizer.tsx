'use client';

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { ExamPreset, ExamDocumentSpec } from '@/data/exam-presets';
import { formatBytes } from '@/lib/format-utils';
import {
  Upload,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Download,
  RotateCcw,
  Sparkles,
  Calendar,
  User,
  ShieldCheck,
  Zap,
  Sliders,
  Eye,
  FileCheck,
  Info,
} from 'lucide-react';

interface ExamPhotoResizerProps {
  exam: ExamPreset;
  initialDocId?: string;
}

interface ProcessedExamImage {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  filename: string;
  isValidSize: boolean;
}

export function ExamPhotoResizer({ exam, initialDocId }: ExamPhotoResizerProps) {
  // Selected document spec
  const [selectedDocId, setSelectedDocId] = useState<string>(
    initialDocId || exam.documents[0]?.id || 'photo'
  );

  const activeDoc: ExamDocumentSpec = useMemo(() => {
    return exam.documents.find((d) => d.id === selectedDocId) || exam.documents[0];
  }, [exam.documents, selectedDocId]);

  // Target KB setting (derived from activeDoc.recommendedKb unless overridden)
  const [userTargetKb, setUserTargetKb] = useState<number | null>(null);
  const targetKb = userTargetKb ?? activeDoc.recommendedKb;
  const setTargetKb = (val: number) => setUserTargetKb(val);

  // Name & Date on Photo (DOP) state (defaults to true if required by exam)
  const [userNameDateToggle, setUserNameDateToggle] = useState<boolean | null>(null);
  const addNameDate = userNameDateToggle ?? (activeDoc.requiresNameDate || false);
  const setAddNameDate = (val: boolean) => setUserNameDateToggle(val);

  const [candidateName, setCandidateName] = useState<string>('');
  
  // Format today's date as DD-MM-YYYY
  const defaultDateStr = useMemo(() => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }, []);

  const [dateOfPhoto, setDateOfPhoto] = useState<string>(defaultDateStr);

  // Uploaded original image
  const [sourceImage, setSourceImage] = useState<{
    file: File;
    name: string;
    url: string;
    width: number;
    height: number;
    size: number;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<ProcessedExamImage | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Object URL cleanup tracking
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

  // Handle file select
  const handleFileSelect = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, or WebP).');
      return;
    }

    setErrorMsg(null);
    setResult(null);

    const url = registerUrl(URL.createObjectURL(file));
    const img = new Image();
    img.onload = () => {
      setSourceImage({
        file,
        name: file.name,
        url,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        size: file.size,
      });
    };
    img.onerror = () => {
      setErrorMsg('Failed to load image. The file may be corrupt.');
    };
    img.src = url;
  };

  // Perform Image Rendering and Compression
  const processImage = useCallback(async () => {
    if (!sourceImage) return;

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image for canvas render'));
        img.src = sourceImage.url;
      });

      const canvas = document.createElement('canvas');
      const targetW = activeDoc.widthPx;
      const targetH = activeDoc.heightPx;
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('Canvas 2D context not available');
      }

      // Draw white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);

      // Determine photo scaling: object-fit cover
      const srcW = img.naturalWidth || img.width;
      const srcH = img.naturalHeight || img.height;

      // If Name and Date bar is needed, reserve bottom ~18-22% of height for the strip
      const nameBarHeight = addNameDate ? Math.round(targetH * 0.20) : 0;
      const photoAreaH = targetH - nameBarHeight;

      // Cover scaling for the photo area
      const scale = Math.max(targetW / srcW, photoAreaH / srcH);
      const drawW = srcW * scale;
      const drawH = srcH * scale;
      const drawX = (targetW - drawW) / 2;
      const drawY = (photoAreaH - drawH) / 2;

      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, targetW, photoAreaH);
      ctx.clip();
      ctx.drawImage(img, drawX, drawY, drawW, drawH);
      ctx.restore();

      // If Name & Date is requested, draw bottom strip
      if (addNameDate) {
        // Crisp white bar
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, photoAreaH, targetW, nameBarHeight);

        // Thin divider line
        ctx.strokeStyle = '#D1D5DB';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, photoAreaH);
        ctx.lineTo(targetW, photoAreaH);
        ctx.stroke();

        // Text styling
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const fontSize = Math.max(12, Math.round(nameBarHeight * 0.32));
        ctx.font = `bold ${fontSize}px sans-serif, Arial, Helvetica`;

        const nameText = candidateName.trim() ? candidateName.toUpperCase() : 'CANDIDATE NAME';
        const dateText = dateOfPhoto.trim() ? `DOP: ${dateOfPhoto}` : `DOP: ${defaultDateStr}`;

        // Line 1: Candidate Name
        ctx.fillText(nameText, targetW / 2, photoAreaH + nameBarHeight * 0.35);

        // Line 2: Date of Photo
        const dateFontSize = Math.max(10, Math.round(fontSize * 0.85));
        ctx.font = `${dateFontSize}px sans-serif, Arial, Helvetica`;
        ctx.fillText(dateText, targetW / 2, photoAreaH + nameBarHeight * 0.72);
      }

      // Binary Search JPEG Compression to match target KB (between minKb and maxKb)
      const targetBytes = targetKb * 1024;
      const minBytes = activeDoc.minKb * 1024;
      const maxBytes = activeDoc.maxKb * 1024;

      let lowQ = 0.1;
      let highQ = 0.98;
      let bestBlob: Blob | null = null;
      let bestDiff = Infinity;

      for (let iteration = 0; iteration < 8; iteration++) {
        const midQ = (lowQ + highQ) / 2;
        const currentBlob = await new Promise<Blob | null>((res) =>
          canvas.toBlob(res, 'image/jpeg', midQ)
        );

        if (!currentBlob) break;

        const currentSize = currentBlob.size;
        const diff = Math.abs(currentSize - targetBytes);

        if (diff < bestDiff) {
          bestDiff = diff;
          bestBlob = currentBlob;
        }

        if (currentSize > targetBytes) {
          highQ = midQ;
        } else {
          lowQ = midQ;
        }
      }

      // Fallback
      if (!bestBlob) {
        bestBlob = await new Promise<Blob | null>((res) =>
          canvas.toBlob(res, 'image/jpeg', 0.8)
        );
      }

      if (!bestBlob) {
        throw new Error('Failed to encode JPEG blob from canvas.');
      }

      const finalSizeKb = Math.round(bestBlob.size / 1024);
      const isValidSize = bestBlob.size >= minBytes && bestBlob.size <= maxBytes;

      const safeName = `${exam.id}_${activeDoc.id}_${targetW}x${targetH}_${finalSizeKb}kb.jpg`;
      const resultUrl = registerUrl(URL.createObjectURL(bestBlob));

      setResult({
        blob: bestBlob,
        url: resultUrl,
        width: targetW,
        height: targetH,
        size: bestBlob.size,
        filename: safeName,
        isValidSize,
      });
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg(err instanceof Error ? err.message : 'An error occurred during resizing.');
    } finally {
      setIsProcessing(false);
    }
  }, [
    sourceImage,
    activeDoc,
    addNameDate,
    candidateName,
    dateOfPhoto,
    defaultDateStr,
    targetKb,
    exam.id,
    registerUrl,
  ]);

  // Trigger processing whenever settings or source change
  useEffect(() => {
    if (sourceImage) {
      const timer = setTimeout(() => {
        processImage();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [processImage, sourceImage]);

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    cleanupUrls();
    setSourceImage(null);
    setResult(null);
    setErrorMsg(null);
  };

  return (
    <div className="space-y-5">
      {/* 1. Exam Document Type Switcher Tabs */}
      <div className="bg-white p-2 rounded-[4px] border border-gray-200 shadow-2xs flex flex-wrap gap-1.5">
        {exam.documents.map((doc) => {
          const isSelected = doc.id === selectedDocId;
          return (
            <button
              key={doc.id}
              type="button"
              onClick={() => {
                setSelectedDocId(doc.id);
                setUserTargetKb(null);
                setUserNameDateToggle(null);
                setResult(null);
              }}
              className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-semibold rounded-[4px] transition-all flex items-center justify-center gap-1.5 ${
                isSelected
                  ? 'bg-[#414FA8] text-white shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FileCheck className="h-3.5 w-3.5" />
              <span>{doc.title}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded font-normal ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                {doc.minKb}-{doc.maxKb} KB
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Official Specification Banner */}
      <div className="bg-[#EEF1FB] border border-[#9AA3C8]/40 p-4 rounded-[4px] text-xs text-gray-800 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#9AA3C8]/30 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#414FA8] uppercase tracking-wide text-[11px]">
              {exam.authority} Official Specs:
            </span>
            <span className="bg-white text-gray-700 px-2 py-0.5 rounded font-mono font-medium border border-[#9AA3C8]/30">
              {activeDoc.widthPx} × {activeDoc.heightPx} px
              {activeDoc.widthCm ? ` (${activeDoc.widthCm}cm × ${activeDoc.heightCm}cm)` : ''}
            </span>
          </div>
          <div className="flex items-center gap-1 font-semibold text-[#414FA8]">
            <Zap className="h-3.5 w-3.5" />
            <span>Strict File Size: {activeDoc.minKb} KB to {activeDoc.maxKb} KB</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-[11px] text-gray-600">
          <div>
            <span className="font-semibold text-gray-800">Background:</span> {activeDoc.backgroundRequirement}
          </div>
          <div>
            <span className="font-semibold text-gray-800">Format:</span> Strictly JPEG (.jpg / .jpeg)
          </div>
        </div>
      </div>

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

      {/* 3. Dropzone Upload Area (When No Image is Loaded) */}
      {!sourceImage && (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[4px] border-2 border-dashed border-[#9AA3C8] bg-[#FAFAFC] hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-colors cursor-pointer select-none"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={(e) => e.target.files && e.target.files[0] && handleFileSelect(e.target.files[0])}
            className="sr-only"
          />
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-4 shadow-2xs">
            <Upload className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Upload your {activeDoc.title} for {exam.shortTitle}
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Drag &amp; drop file here, or click to browse. Automatically resizes to {activeDoc.widthPx}×{activeDoc.heightPx} px &amp; fits inside {activeDoc.minKb}–{activeDoc.maxKb} KB.
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs sm:text-sm font-semibold rounded-[4px] shadow-xs transition-colors"
          >
            <Upload className="h-4 w-4" />
            <span>Select {activeDoc.title}</span>
          </button>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
            <span>Instant In-Browser Processing</span>
            <span>•</span>
            <span>100% Private (No server uploads)</span>
          </div>
        </div>
      )}

      {/* 4. Interactive Configuration & Live Preview (When Image is Loaded) */}
      {sourceImage && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Controls Column (5 cols) */}
            <div className="lg:col-span-5 bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <span className="text-xs font-bold text-gray-900">Customization &amp; Stamp</span>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 font-medium"
                >
                  <RotateCcw className="h-3 w-3" /> Change File
                </button>
              </div>

              {/* Target File Size Slider */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                  <span className="flex items-center gap-1">
                    <Sliders className="h-3.5 w-3.5 text-[#414FA8]" /> Target Size:
                  </span>
                  <span className="text-[#414FA8] font-bold bg-[#EEF1FB] px-2 py-0.5 rounded">
                    {targetKb} KB
                  </span>
                </div>
                <input
                  type="range"
                  min={activeDoc.minKb}
                  max={activeDoc.maxKb}
                  step={1}
                  value={targetKb}
                  onChange={(e) => setTargetKb(parseInt(e.target.value, 10))}
                  className="w-full accent-[#414FA8] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-gray-400 font-mono">
                  <span>Min: {activeDoc.minKb} KB</span>
                  <span className="font-semibold text-emerald-600">Safe Target: {targetKb} KB</span>
                  <span>Max: {activeDoc.maxKb} KB</span>
                </div>
              </div>

              {/* Name & Date on Photo (DOP) Controls */}
              {activeDoc.id === 'photo' && (
                <div className="pt-2 border-t border-gray-100 space-y-3">
                  <label className="flex items-start gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={addNameDate}
                      onChange={(e) => setAddNameDate(e.target.checked)}
                      className="mt-0.5 rounded border-gray-300 text-[#414FA8] focus:ring-[#414FA8]"
                    />
                    <div className="text-xs">
                      <span className="font-semibold text-gray-800 flex items-center gap-1">
                        Add Name &amp; Date of Photo (DOP) Stamp
                        {activeDoc.requiresNameDate && (
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                            Mandatory for UPSC
                          </span>
                        )}
                      </span>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        Prints a clean white bar at the bottom with candidate name &amp; date as required by government portals.
                      </p>
                    </div>
                  </label>

                  {addNameDate && (
                    <div className="space-y-2.5 bg-gray-50 p-3 rounded border border-gray-200">
                      <div>
                        <label className="text-[11px] font-semibold text-gray-700 flex items-center gap-1 mb-1">
                          <User className="h-3 w-3 text-[#414FA8]" /> Candidate Full Name:
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. RAHUL SHARMA"
                          value={candidateName}
                          onChange={(e) => setCandidateName(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded focus:border-[#414FA8] focus:ring-1 focus:ring-[#414FA8] uppercase font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-gray-700 flex items-center gap-1 mb-1">
                          <Calendar className="h-3 w-3 text-[#414FA8]" /> Date of Photo Taken (DOP):
                        </label>
                        <input
                          type="text"
                          placeholder="DD-MM-YYYY"
                          value={dateOfPhoto}
                          onChange={(e) => setDateOfPhoto(e.target.value)}
                          className="w-full text-xs px-2.5 py-1.5 border border-gray-300 rounded focus:border-[#414FA8] focus:ring-1 focus:ring-[#414FA8] font-mono"
                        />
                        <p className="text-[10px] text-gray-400 mt-1">
                          *UPSC Rule: Date must not be older than 10 days from notification.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Instructions checklist */}
              <div className="pt-2 border-t border-gray-100 space-y-1.5">
                <span className="text-[11px] font-bold text-gray-700 block">
                  Mandatory Photo Checklist:
                </span>
                <ul className="text-[11px] text-gray-600 space-y-1">
                  {activeDoc.instructions.map((inst, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Live Preview & Download (7 cols) */}
            <div className="lg:col-span-7 bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-[#414FA8]" /> Live Processed Output
                </span>
                {result && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                      result.isValidSize
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {result.isValidSize ? (
                      <>
                        <CheckCircle2 className="h-3 w-3" /> Exact Portal Compliant
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-3 w-3" /> Out of Range
                      </>
                    )}
                  </span>
                )}
              </div>

              {/* Visual Preview Box */}
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 rounded border border-gray-200">
                {result ? (
                  <div className="relative group max-w-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.url}
                      alt="Processed Exam Output"
                      className="max-h-72 object-contain border border-gray-300 shadow-sm rounded-xs bg-white"
                    />
                  </div>
                ) : (
                  <div className="py-12 flex flex-col items-center text-gray-400 text-xs">
                    <Sparkles className="h-6 w-6 text-[#414FA8] animate-pulse mb-2" />
                    <span>Processing live image...</span>
                  </div>
                )}
              </div>

              {/* Metrics Bar */}
              {result && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <div className="text-[10px] text-gray-500">Output Size</div>
                    <div className="font-bold text-[#414FA8]">{formatBytes(result.size)}</div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <div className="text-[10px] text-gray-500">Allowed KB</div>
                    <div className="font-semibold text-gray-800">
                      {activeDoc.minKb} - {activeDoc.maxKb} KB
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <div className="text-[10px] text-gray-500">Resolution</div>
                    <div className="font-semibold text-gray-800 font-mono">
                      {result.width} × {result.height} px
                    </div>
                  </div>
                  <div className="p-2 bg-gray-50 rounded border border-gray-100">
                    <div className="text-[10px] text-gray-500">File Type</div>
                    <div className="font-semibold text-emerald-700">JPEG</div>
                  </div>
                </div>
              )}

              {/* Download Action */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!result || isProcessing}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-3 px-5 bg-[#414FA8] hover:bg-[#343f88] active:scale-[0.99] text-white text-xs sm:text-sm font-semibold rounded-[4px] shadow-sm transition-all cursor-pointer disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  <span>Download {activeDoc.title} for {exam.shortTitle}</span>
                </button>
              </div>

              <p className="text-[11px] text-gray-400 text-center">
                SizeSnap guaranteed 0% rejection guarantee when uploaded with correct background and posture.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
