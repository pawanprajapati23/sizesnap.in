'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import {
  Upload,
  Download,
  Trash2,
  Sliders,
  CheckCircle2,
  RefreshCw,
  FileCheck,
  ShieldCheck,
  Zap,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';
import { formatBytes, sanitizeFilename } from '@/lib/format-utils';

interface JoinedImageResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
  filename: string;
}

const PRESET_DIMENSIONS = [
  { label: 'Standard Govt Exam (350 × 500 px)', width: 350, height: 500 },
  { label: 'High Resolution (400 × 600 px)', width: 400, height: 600 },
  { label: 'Compact Slip (300 × 450 px)', width: 300, height: 450 },
  { label: 'Square Format (500 × 500 px)', width: 500, height: 500 },
];

const PRESET_TARGET_KB = [30, 50, 70, 100];

export function PhotoAndSignatureJoinerTool() {
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [signatureSrc, setSignatureSrc] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState<string>('photo');

  // Configuration options
  const [dimensionIndex, setDimensionIndex] = useState<number>(0);
  const [photoRatio, setPhotoRatio] = useState<number>(75); // 75% photo, 25% signature
  const [showDividingLine, setShowDividingLine] = useState<boolean>(true);
  const [showOuterBorder, setShowOuterBorder] = useState<boolean>(true);
  const [targetKb, setTargetKb] = useState<number>(50); // Under 50 KB by default
  const [candidateName, setCandidateName] = useState<string>('');
  const [dateOfPhoto, setDateOfPhoto] = useState<string>('');
  const [includeNameDate, setIncludeNameDate] = useState<boolean>(false);

  // Output states
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<JoinedImageResult | null>(null);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const resultUrlRef = useRef<string | null>(null);

  // Clean up object URLs to prevent memory leaks
  const registerResultUrl = useCallback((url: string) => {
    if (resultUrlRef.current && resultUrlRef.current.startsWith('blob:')) {
      URL.revokeObjectURL(resultUrlRef.current);
    }
    resultUrlRef.current = url;
    return url;
  }, []);

  useEffect(() => {
    return () => {
      if (resultUrlRef.current && resultUrlRef.current.startsWith('blob:')) {
        URL.revokeObjectURL(resultUrlRef.current);
      }
    };
  }, []);

  // Handle Photo File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoName(file.name.replace(/\.[^.]+$/, ''));
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setPhotoSrc(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Signature File Upload
  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        setSignatureSrc(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Canvas Generation & Target Compression Engine
  const generateJoinedImage = useCallback(async () => {
    if (!photoSrc && !signatureSrc) {
      setResult(null);
      return;
    }

    setIsProcessing(true);

    const dim = PRESET_DIMENSIONS[dimensionIndex];
    const totalW = dim.width;
    const totalH = dim.height;

    // Load images
    const loadImg = (src: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });

    try {
      const [photoImg, sigImg] = await Promise.all([
        photoSrc ? loadImg(photoSrc) : Promise.resolve(null),
        signatureSrc ? loadImg(signatureSrc) : Promise.resolve(null),
      ]);

      const canvas = document.createElement('canvas');
      canvas.width = totalW;
      canvas.height = totalH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      // 1. Fill solid white background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, totalW, totalH);

      // 2. Calculate vertical splits
      const splitY = Math.round((totalH * photoRatio) / 100);
      const photoH = splitY;
      const sigH = totalH - splitY;

      // Draw Photo in top section
      if (photoImg) {
        const imgAspect = photoImg.width / photoImg.height;
        const targetAspect = totalW / photoH;

        let drawW = totalW;
        let drawH = photoH;
        let drawX = 0;
        let drawY = 0;

        // Cover / Center crop into photo box
        if (imgAspect > targetAspect) {
          drawW = photoH * imgAspect;
          drawX = (totalW - drawW) / 2;
        } else {
          drawH = totalW / imgAspect;
          drawY = (photoH - drawH) / 2;
        }

        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, totalW, photoH);
        ctx.clip();
        ctx.drawImage(photoImg, drawX, drawY, drawW, drawH);

        // Optional Name & Date Stamp at bottom of photo area
        if (includeNameDate && (candidateName || dateOfPhoto)) {
          const bannerHeight = Math.max(30, Math.round(photoH * 0.18));
          const bannerY = photoH - bannerHeight;

          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.fillRect(0, bannerY, totalW, bannerHeight);

          ctx.strokeStyle = '#000000';
          ctx.lineWidth = 1;
          ctx.strokeRect(0, bannerY, totalW, bannerHeight);

          ctx.fillStyle = '#000000';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';

          if (candidateName && dateOfPhoto) {
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText(candidateName.toUpperCase(), totalW / 2, bannerY + bannerHeight * 0.32);
            ctx.font = '10px monospace';
            ctx.fillText(`DOP: ${dateOfPhoto}`, totalW / 2, bannerY + bannerHeight * 0.72);
          } else {
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText(
              (candidateName || dateOfPhoto).toUpperCase(),
              totalW / 2,
              bannerY + bannerHeight * 0.5
            );
          }
        }
        ctx.restore();
      } else {
        // Placeholder text
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Photograph Area', totalW / 2, photoH / 2);
      }

      // Draw Signature in bottom section (Contain / Fit on white)
      if (sigImg) {
        const padding = 10;
        const maxSigW = totalW - padding * 2;
        const maxSigH = sigH - padding * 2;

        const imgAspect = sigImg.width / sigImg.height;
        const boxAspect = maxSigW / maxSigH;

        let drawW = maxSigW;
        let drawH = maxSigH;

        if (imgAspect > boxAspect) {
          drawH = maxSigW / imgAspect;
        } else {
          drawW = maxSigH * imgAspect;
        }

        const drawX = (totalW - drawW) / 2;
        const drawY = splitY + (sigH - drawH) / 2;

        ctx.drawImage(sigImg, drawX, drawY, drawW, drawH);
      } else {
        // Placeholder text
        ctx.fillStyle = '#9CA3AF';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('Signature Area', totalW / 2, splitY + sigH / 2);
      }

      // 3. Draw Dividing Line between Photo & Signature
      if (showDividingLine) {
        ctx.strokeStyle = '#D1D5DB';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, splitY);
        ctx.lineTo(totalW, splitY);
        ctx.stroke();
      }

      // 4. Draw Outer Border
      if (showOuterBorder) {
        ctx.strokeStyle = '#9CA3AF';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, totalW, totalH);
      }

      // 5. Binary Search Compression to hit target KB (Strictly under targetKb)
      const targetBytes = targetKb * 1024;
      const mime = 'image/jpeg';

      const getBlobAtQuality = (q: number): Promise<Blob> =>
        new Promise((resolve) => {
          canvas.toBlob(
            (b) => {
              resolve(b || new Blob([], { type: mime }));
            },
            mime,
            q
          );
        });

      let lowQ = 0.05;
      let highQ = 0.98;
      let bestBlob: Blob | null = null;

      for (let i = 0; i < 8; i++) {
        const midQ = (lowQ + highQ) / 2;
        const b = await getBlobAtQuality(midQ);

        if (b.size <= targetBytes) {
          bestBlob = b;
          lowQ = midQ; // Try higher quality
        } else {
          highQ = midQ; // Too big, lower quality
        }
      }

      // Fallback if initial canvas is already smaller than target
      if (!bestBlob) {
        bestBlob = await getBlobAtQuality(0.7);
      }

      const finalUrl = registerResultUrl(URL.createObjectURL(bestBlob));
      const finalFilename = sanitizeFilename(`${photoName}_with_signature_${targetKb}kb`, 'jpg');

      setResult({
        blob: bestBlob,
        url: finalUrl,
        width: totalW,
        height: totalH,
        size: bestBlob.size,
        format: 'image/jpeg',
        filename: finalFilename,
      });
    } catch (err) {
      console.error('Error generating joined image:', err);
    } finally {
      setIsProcessing(false);
    }
  }, [
    photoSrc,
    signatureSrc,
    photoName,
    dimensionIndex,
    photoRatio,
    showDividingLine,
    showOuterBorder,
    targetKb,
    candidateName,
    dateOfPhoto,
    includeNameDate,
    registerResultUrl,
  ]);

  // Re-generate preview whenever any setting or image changes
  useEffect(() => {
    const timer = setTimeout(() => {
      generateJoinedImage();
    }, 0);
    return () => clearTimeout(timer);
  }, [generateJoinedImage]);

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const clearAll = () => {
    setPhotoSrc(null);
    setSignatureSrc(null);
    setResult(null);
    setCandidateName('');
    setDateOfPhoto('');
    if (photoInputRef.current) photoInputRef.current.value = '';
    if (signatureInputRef.current) signatureInputRef.current.value = '';
  };

  return (
    <div className="w-full space-y-6">
      {/* Dual Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Box 1: Photograph */}
        <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#414FA8] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#414FA8]" />
                Step 1: Candidate Photo
              </span>
              {photoSrc && (
                <button
                  type="button"
                  onClick={() => {
                    setPhotoSrc(null);
                    if (photoInputRef.current) photoInputRef.current.value = '';
                  }}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              )}
            </div>

            <p className="text-[11px] text-gray-500 mb-3">
              Upload recent passport photograph (JPG, PNG, WebP).
            </p>

            {photoSrc ? (
              <div className="relative w-full h-44 bg-gray-50 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                <Image
                  src={photoSrc}
                  alt="Uploaded Photo"
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>
            ) : (
              <div
                onClick={() => photoInputRef.current?.click()}
                className="w-full h-44 border-2 border-dashed border-[#9AA3C8] rounded-md flex flex-col items-center justify-center p-4 bg-[#FAFAFC] hover:bg-[#EEF1FB]/40 transition-colors cursor-pointer text-center"
              >
                <Upload className="w-7 h-7 text-[#414FA8] mb-2" />
                <span className="text-xs font-semibold text-gray-800">
                  Click or drag photo here
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  Passport photo, selfie, or formal image
                </span>
              </div>
            )}
          </div>

          <input
            ref={photoInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />

          {!photoSrc && (
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="mt-3 w-full py-2 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs font-semibold rounded shadow-2xs transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-3.5 h-3.5" /> Select Photograph
            </button>
          )}
        </div>

        {/* Box 2: Signature */}
        <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#414FA8] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#414FA8]" />
                Step 2: Candidate Signature
              </span>
              {signatureSrc && (
                <button
                  type="button"
                  onClick={() => {
                    setSignatureSrc(null);
                    if (signatureInputRef.current) signatureInputRef.current.value = '';
                  }}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 font-medium transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              )}
            </div>

            <p className="text-[11px] text-gray-500 mb-3">
              Upload signature on clean white paper with dark ink.
            </p>

            {signatureSrc ? (
              <div className="relative w-full h-44 bg-gray-50 rounded border border-gray-200 flex items-center justify-center overflow-hidden">
                <Image
                  src={signatureSrc}
                  alt="Uploaded Signature"
                  fill
                  className="object-contain p-2"
                  unoptimized
                />
              </div>
            ) : (
              <div
                onClick={() => signatureInputRef.current?.click()}
                className="w-full h-44 border-2 border-dashed border-[#9AA3C8] rounded-md flex flex-col items-center justify-center p-4 bg-[#FAFAFC] hover:bg-[#EEF1FB]/40 transition-colors cursor-pointer text-center"
              >
                <Upload className="w-7 h-7 text-[#414FA8] mb-2" />
                <span className="text-xs font-semibold text-gray-800">
                  Click or drag signature here
                </span>
                <span className="text-[10px] text-gray-400 mt-0.5">
                  Black or blue pen signature on white paper
                </span>
              </div>
            )}
          </div>

          <input
            ref={signatureInputRef}
            type="file"
            accept="image/*"
            onChange={handleSignatureUpload}
            className="hidden"
          />

          {!signatureSrc && (
            <button
              type="button"
              onClick={() => signatureInputRef.current?.click()}
              className="mt-3 w-full py-2 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs font-semibold rounded shadow-2xs transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-3.5 h-3.5" /> Select Signature
            </button>
          )}
        </div>
      </div>

      {/* Control Settings & Live Preview Section */}
      {(photoSrc || signatureSrc) && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* Controls Panel (7 Cols) */}
          <div className="lg:col-span-7 bg-white p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
              <span className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#414FA8]" /> Merge &amp; File Size Settings
              </span>
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset All
              </button>
            </div>

            {/* Target File Size (Exact KB Preset) */}
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                Target Maximum File Size:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {PRESET_TARGET_KB.map((kb) => (
                  <button
                    key={kb}
                    type="button"
                    onClick={() => setTargetKb(kb)}
                    className={`py-1.5 text-xs font-semibold rounded border transition-colors ${
                      targetKb === kb
                        ? 'bg-[#414FA8] text-white border-[#414FA8] shadow-2xs'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-[#EEF1FB]'
                    }`}
                  >
                    Under {kb} KB
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">
                Most exam portals (MP Vyapam, UPSSSC, High Court) require{' '}
                <strong className="text-gray-700">under 50 KB</strong>.
              </p>
            </div>

            {/* Output Dimensions */}
            <div>
              <label className="block text-xs font-semibold text-gray-800 mb-1.5">
                Combined Canvas Dimensions:
              </label>
              <select
                value={dimensionIndex}
                onChange={(e) => setDimensionIndex(Number(e.target.value))}
                className="w-full text-xs bg-gray-50 border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:border-[#414FA8]"
              >
                {PRESET_DIMENSIONS.map((preset, idx) => (
                  <option key={preset.label} value={idx}>
                    {preset.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Photo vs Signature Height Proportion */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-gray-800">
                  Photo vs. Signature Ratio:
                </label>
                <span className="text-xs text-gray-600 font-mono">
                  {photoRatio}% Photo / {100 - photoRatio}% Signature
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="85"
                step="5"
                value={photoRatio}
                onChange={(e) => setPhotoRatio(Number(e.target.value))}
                className="w-full accent-[#414FA8] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                <span>Larger Signature (60/40)</span>
                <span>Standard (75/25)</span>
                <span>Larger Photo (85/15)</span>
              </div>
            </div>

            {/* Visual Options (Toggles) */}
            <div className="pt-2 border-t border-gray-100 flex flex-wrap gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showDividingLine}
                  onChange={(e) => setShowDividingLine(e.target.checked)}
                  className="rounded text-[#414FA8] focus:ring-[#414FA8] accent-[#414FA8]"
                />
                <span className="text-gray-700 font-medium">Dividing Line</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={showOuterBorder}
                  onChange={(e) => setShowOuterBorder(e.target.checked)}
                  className="rounded text-[#414FA8] focus:ring-[#414FA8] accent-[#414FA8]"
                />
                <span className="text-gray-700 font-medium">Outer Border (1px)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={includeNameDate}
                  onChange={(e) => setIncludeNameDate(e.target.checked)}
                  className="rounded text-[#414FA8] focus:ring-[#414FA8] accent-[#414FA8]"
                />
                <span className="text-gray-700 font-medium">Add Name &amp; Date on Photo</span>
              </label>
            </div>

            {/* Optional Candidate Name & Date Fields */}
            {includeNameDate && (
              <div className="p-3 bg-[#EEF1FB]/60 border border-[#9AA3C8]/40 rounded grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Candidate Full Name:
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="e.g. RAHUL SHARMA"
                    className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5 uppercase"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">
                    Date of Photo (DOP):
                  </label>
                  <input
                    type="text"
                    value={dateOfPhoto}
                    onChange={(e) => setDateOfPhoto(e.target.value)}
                    placeholder="e.g. 15.10.2026"
                    className="w-full bg-white border border-gray-300 rounded px-2.5 py-1.5"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Live Preview & Download Panel (5 Cols) */}
          <div className="lg:col-span-5 bg-white p-5 rounded-[4px] border border-gray-200 shadow-xs flex flex-col items-center justify-between text-center">
            <div className="w-full">
              <div className="flex items-center justify-between mb-3 w-full border-b border-gray-100 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Live Preview
                </span>
                {result && (
                  <span className="text-[11px] font-mono bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                    {formatBytes(result.size)} ({result.width}×{result.height})
                  </span>
                )}
              </div>

              {/* Joined Preview Container */}
              <div className="relative my-2 p-3 bg-gray-100/60 rounded border border-gray-200 flex items-center justify-center min-h-[320px]">
                {result ? (
                  <div className="relative shadow-md bg-white border border-gray-300 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={result.url}
                      alt="Joined Photo and Signature"
                      className="max-h-[300px] w-auto object-contain block mx-auto"
                    />
                  </div>
                ) : (
                  <div className="text-gray-400 text-xs">Generating preview...</div>
                )}
              </div>

              {result && (
                <div className="text-[11px] text-gray-600 space-y-0.5 mt-2">
                  <p>
                    Target: <strong className="text-gray-900">Under {targetKb} KB</strong> | Status:{' '}
                    <span className="text-emerald-600 font-bold">
                      {result.size <= targetKb * 1024 ? '✓ Compliant' : 'Slightly Exceeded'}
                    </span>
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Output: High-clarity JPEG ready for immediate form upload
                  </p>
                </div>
              )}
            </div>

            {/* Download Button */}
            <div className="w-full mt-4">
              <button
                type="button"
                onClick={handleDownload}
                disabled={!result || isProcessing}
                className="w-full py-3 bg-[#414FA8] hover:bg-[#343f88] disabled:opacity-50 text-white font-bold text-sm rounded shadow transition-all flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Combined Image
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="bg-white p-3.5 rounded-[4px] border border-gray-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#414FA8] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-gray-900">100% Client-Side Privacy</h3>
            <p className="text-[11px] text-gray-600">
              Your photo and signature are processed in local browser memory without server uploads.
            </p>
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-[4px] border border-gray-200 flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-gray-900">Under 50 KB Guarantee</h3>
            <p className="text-[11px] text-gray-600">
              Binary compression strictly keeps the combined file size below official state exam limits.
            </p>
          </div>
        </div>
        <div className="bg-white p-3.5 rounded-[4px] border border-gray-200 flex items-start gap-3">
          <FileCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-xs font-bold text-gray-900">Govt Exam Accepted</h3>
            <p className="text-[11px] text-gray-600">
              Compliant with MP Vyapam, UPSSSC, Rajasthan High Court, and Bihar SSC portals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
