'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import JSZip from 'jszip';
import {
  Upload,
  Download,
  Trash2,
  CheckCircle2,
  RefreshCw,
  FileCheck,
  ShieldCheck,
  Zap,
  Info,
  Camera,
  PenTool,
  Sliders,
  Archive,
  Bookmark,
  Building2,
} from 'lucide-react';
import { formatBytes } from '@/lib/format-utils';
import { trackProcessingSuccess, trackDownload } from '@/lib/firebase';
import { WhatsAppShareButton } from '@/components/WhatsAppShareButton';

type PanMode = 'photo' | 'signature' | 'combo';
type PortalType = 'uti' | 'nsdl';

interface PanPreset {
  portal: PortalType;
  label: string;
  photoW: number;
  photoH: number;
  photoMaxKb: number;
  photoRecKb: number;
  photoDpi: number;
  sigW: number;
  sigH: number;
  sigMaxKb: number;
  sigRecKb: number;
  sigDpi: number;
  description: string;
}

const PORTAL_SPECS: Record<PortalType, PanPreset> = {
  uti: {
    portal: 'uti',
    label: 'UTIITSL Portal',
    photoW: 213,
    photoH: 213,
    photoMaxKb: 30, // UTIITSL rejects photos > 30KB!
    photoRecKb: 25,
    photoDpi: 300,
    sigW: 400,
    sigH: 200,
    sigMaxKb: 60,
    sigRecKb: 40,
    sigDpi: 600,
    description: 'UTIITSL Strict Specs: Photo 213×213 px (<30KB, 300 DPI) & Signature 400×200 px (<60KB, 600 DPI)',
  },
  nsdl: {
    portal: 'nsdl',
    label: 'NSDL / Protean Portal',
    photoW: 213,
    photoH: 213, // 3.5cm x 2.5cm @ 200-300 dpi
    photoMaxKb: 50,
    photoRecKb: 40,
    photoDpi: 200,
    sigW: 400,
    sigH: 200, // 2cm x 4.5cm
    sigMaxKb: 20,
    sigRecKb: 15,
    sigDpi: 200,
    description: 'NSDL Specs: Photo 3.5×2.5 cm (<50KB, 200 DPI) & Signature 2×4.5 cm (<20KB, 200 DPI)',
  },
};

interface ProcessedResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  filename: string;
  isWithinLimit: boolean;
}

export function PanCardResizerTool() {
  const [mode, setMode] = useState<PanMode>('combo');
  const [portal, setPortal] = useState<PortalType>('uti');

  // Single mode state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [customKb, setCustomKb] = useState<number>(25);
  const [zoom, setZoom] = useState<number>(100);
  const [result, setResult] = useState<ProcessedResult | null>(null);
  const [processing, setProcessing] = useState(false);

  // Combo mode state (Photo + Signature)
  const [comboPhotoFile, setComboPhotoFile] = useState<File | null>(null);
  const [comboPhotoSrc, setComboPhotoSrc] = useState<string | null>(null);
  const [comboPhotoResult, setComboPhotoResult] = useState<ProcessedResult | null>(null);

  const [comboSigFile, setComboSigFile] = useState<File | null>(null);
  const [comboSigSrc, setComboSigSrc] = useState<string | null>(null);
  const [comboSigResult, setComboSigResult] = useState<ProcessedResult | null>(null);

  const [comboProcessing, setComboProcessing] = useState(false);
  const [isZipping, setIsZipping] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const comboPhotoInputRef = useRef<HTMLInputElement>(null);
  const comboSigInputRef = useRef<HTMLInputElement>(null);
  const lastActivityIdRef = useRef<string | null>(null);

  const activeSpec = PORTAL_SPECS[portal];

  // Helper to resize single image on canvas
  const renderResizedBlob = async (
    sourceUrl: string,
    targetW: number,
    targetH: number,
    targetKb: number,
    zoomPct: number = 100
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        canvas.width = targetW;
        canvas.height = targetH;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Canvas unavailable'));

        // Fill background white
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetW, targetH);

        const zoomFactor = zoomPct / 100;
        const aspect = img.width / img.height;
        const targetAspect = targetW / targetH;

        let drawW: number;
        let drawH: number;

        if (aspect > targetAspect) {
          drawH = targetH * zoomFactor;
          drawW = drawH * aspect;
        } else {
          drawW = targetW * zoomFactor;
          drawH = drawW / aspect;
        }

        const drawX = (targetW - drawW) / 2;
        const drawY = (targetH - drawH) / 2;

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        const targetBytes = targetKb * 1024;
        let minQuality = 0.1;
        let maxQuality = 0.98;
        let bestBlob: Blob | null = null;

        for (let i = 0; i < 6; i++) {
          const midQuality = (minQuality + maxQuality) / 2;
          const blob = await new Promise<Blob | null>((res) =>
            canvas.toBlob((b) => res(b), 'image/jpeg', midQuality)
          );

          if (!blob) break;
          bestBlob = blob;
          if (blob.size > targetBytes) {
            maxQuality = midQuality;
          } else {
            minQuality = midQuality;
          }
        }

        if (bestBlob) {
          resolve(bestBlob);
        } else {
          reject(new Error('Canvas blob generation failed'));
        }
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = sourceUrl;
    });
  };

  // Process Single Mode (Photo or Signature)
  const processSingleImage = useCallback(async () => {
    if (!imageSrc || mode === 'combo') return;
    setProcessing(true);

    try {
      const targetW = mode === 'photo' ? activeSpec.photoW : activeSpec.sigW;
      const targetH = mode === 'photo' ? activeSpec.photoH : activeSpec.sigH;
      const maxAllowed = mode === 'photo' ? activeSpec.photoMaxKb : activeSpec.sigMaxKb;

      const blob = await renderResizedBlob(imageSrc, targetW, targetH, customKb, zoom);
      const url = URL.createObjectURL(blob);
      const filename =
        mode === 'photo'
          ? `pan_card_photo_${portal.toUpperCase()}_${targetW}x${targetH}.jpg`
          : `pan_card_signature_${portal.toUpperCase()}_${targetW}x${targetH}.jpg`;

      setResult({
        blob,
        url,
        width: targetW,
        height: targetH,
        size: blob.size,
        filename,
        isWithinLimit: blob.size <= maxAllowed * 1024,
      });

      trackProcessingSuccess({
        tool: 'pan-card-photo-resizer',
        toolName: `PAN Card ${mode === 'photo' ? 'Photo' : 'Signature'} Resizer (${portal.toUpperCase()})`,
        fileType: 'image',
        inputKb: selectedFile ? Math.round(selectedFile.size / 1024) : 0,
        outputKb: Math.round(blob.size / 1024),
        targetKb: customKb,
      }).then((id) => {
        if (id) lastActivityIdRef.current = id;
      }).catch(() => {});
    } catch (err) {
      console.error('PAN Single resize error:', err);
    } finally {
      setProcessing(false);
    }
  }, [imageSrc, mode, activeSpec, portal, customKb, zoom, selectedFile]);

  // Process Combo Mode (Both Photo & Signature)
  const processCombo = useCallback(async () => {
    if (!comboPhotoSrc && !comboSigSrc) return;
    setComboProcessing(true);

    try {
      if (comboPhotoSrc) {
        const photoBlob = await renderResizedBlob(
          comboPhotoSrc,
          activeSpec.photoW,
          activeSpec.photoH,
          activeSpec.photoRecKb,
          100
        );
        const photoUrl = URL.createObjectURL(photoBlob);
        setComboPhotoResult({
          blob: photoBlob,
          url: photoUrl,
          width: activeSpec.photoW,
          height: activeSpec.photoH,
          size: photoBlob.size,
          filename: `pan_card_photo_${portal.toUpperCase()}_213x213.jpg`,
          isWithinLimit: photoBlob.size <= activeSpec.photoMaxKb * 1024,
        });
      }

      if (comboSigSrc) {
        const sigBlob = await renderResizedBlob(
          comboSigSrc,
          activeSpec.sigW,
          activeSpec.sigH,
          activeSpec.sigRecKb,
          100
        );
        const sigUrl = URL.createObjectURL(sigBlob);
        setComboSigResult({
          blob: sigBlob,
          url: sigUrl,
          width: activeSpec.sigW,
          height: activeSpec.sigH,
          size: sigBlob.size,
          filename: `pan_card_signature_${portal.toUpperCase()}_${activeSpec.sigW}x${activeSpec.sigH}.jpg`,
          isWithinLimit: sigBlob.size <= activeSpec.sigMaxKb * 1024,
        });
      }

      trackProcessingSuccess({
        tool: 'pan-card-photo-resizer',
        toolName: `PAN Card 2-in-1 Combo (${portal.toUpperCase()})`,
        fileType: 'image',
        outputKb: (comboPhotoResult?.size || 0) + (comboSigResult?.size || 0),
      }).catch(() => {});
    } catch (err) {
      console.error('PAN Combo resize error:', err);
    } finally {
      setComboProcessing(false);
    }
  }, [comboPhotoSrc, comboSigSrc, activeSpec, portal]);

  // Trigger processing
  useEffect(() => {
    if (mode === 'combo') {
      processCombo();
    } else if (imageSrc) {
      processSingleImage();
    }
  }, [mode, portal, imageSrc, customKb, zoom, comboPhotoSrc, comboSigSrc, processCombo, processSingleImage]);

  // Mode change handler
  const handleModeChange = (newMode: PanMode) => {
    setMode(newMode);
    if (newMode === 'photo') {
      setCustomKb(activeSpec.photoRecKb);
    } else if (newMode === 'signature') {
      setCustomKb(activeSpec.sigRecKb);
    }
  };

  // Portal change handler
  const handlePortalChange = (newPortal: PortalType) => {
    setPortal(newPortal);
    const spec = PORTAL_SPECS[newPortal];
    if (mode === 'photo') {
      setCustomKb(spec.photoRecKb);
    } else if (mode === 'signature') {
      setCustomKb(spec.sigRecKb);
    }
  };

  // Single file handlers
  const handleSingleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPG, PNG, WebP).');
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageSrc(e.target?.result as string);
      setResult(null);
    };
    reader.readAsDataURL(file);
  };

  // Combo file handlers
  const handleComboPhoto = (file: File) => {
    setComboPhotoFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setComboPhotoSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleComboSig = (file: File) => {
    setComboSigFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setComboSigSrc(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDownloadSingle = () => {
    if (!result) return;
    trackDownload('pan-card-photo-resizer', lastActivityIdRef.current || undefined);
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadComboItem = (res: ProcessedResult) => {
    trackDownload('pan-card-photo-resizer');
    const a = document.createElement('a');
    a.href = res.url;
    a.download = res.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadBothZip = async () => {
    if (!comboPhotoResult && !comboSigResult) return;
    setIsZipping(true);
    try {
      const zip = new JSZip();
      if (comboPhotoResult) {
        zip.file(comboPhotoResult.filename, comboPhotoResult.blob);
      }
      if (comboSigResult) {
        zip.file(comboSigResult.filename, comboSigResult.blob);
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = `pan_card_bundle_${portal.toUpperCase()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      trackDownload('pan-card-photo-resizer');
    } catch (err) {
      console.error('ZIP generation error:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="bg-white rounded-[4px] border border-gray-200 shadow-xs overflow-hidden">
      {/* Top Bar: Portal Type Selector (UTIITSL vs NSDL) */}
      <div className="bg-[#EEF1FB] border-b border-gray-200 p-3 sm:px-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#414FA8]" />
          <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">
            Select PAN Application Portal:
          </span>
        </div>

        <div className="inline-flex rounded-[4px] bg-white p-0.5 border border-[#9AA3C8]/40 shadow-xs">
          <button
            type="button"
            onClick={() => handlePortalChange('uti')}
            className={`px-3 py-1.5 text-xs font-bold rounded-[3px] transition-colors ${
              portal === 'uti'
                ? 'bg-[#414FA8] text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            UTIITSL Portal (Strict &lt;30KB, 213×213)
          </button>
          <button
            type="button"
            onClick={() => handlePortalChange('nsdl')}
            className={`px-3 py-1.5 text-xs font-bold rounded-[3px] transition-colors ${
              portal === 'nsdl'
                ? 'bg-[#414FA8] text-white shadow-2xs'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            NSDL / Protean (3.5×2.5 cm, &lt;50KB)
          </button>
        </div>
      </div>

      {/* Mode Tabs: 2-in-1 Combo vs Photo vs Signature */}
      <div className="grid grid-cols-3 border-b border-gray-200 bg-gray-50/70 text-center">
        <button
          type="button"
          onClick={() => handleModeChange('combo')}
          className={`flex items-center justify-center gap-1.5 py-3 px-2 sm:px-4 text-xs sm:text-sm font-bold transition-colors border-b-2 ${
            mode === 'combo'
              ? 'border-[#414FA8] bg-white text-[#414FA8] shadow-2xs'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
          <span className="truncate">Photo + Signature (2-in-1 Combo)</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange('photo')}
          className={`flex items-center justify-center gap-1.5 py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold transition-colors border-b-2 ${
            mode === 'photo'
              ? 'border-[#414FA8] bg-white text-[#414FA8] shadow-2xs'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
          }`}
        >
          <Camera className="w-4 h-4 shrink-0" />
          <span className="truncate">Photo Only (213 × 213)</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange('signature')}
          className={`flex items-center justify-center gap-1.5 py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold transition-colors border-b-2 ${
            mode === 'signature'
              ? 'border-[#414FA8] bg-white text-[#414FA8] shadow-2xs'
              : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/60'
          }`}
        >
          <PenTool className="w-4 h-4 shrink-0" />
          <span className="truncate">Signature Only ({activeSpec.sigW} × {activeSpec.sigH})</span>
        </button>
      </div>

      <div className="p-4 sm:p-6 space-y-5">
        {/* Active Portal Rules Banner */}
        <div className="p-3 rounded-[4px] bg-[#EEF1FB]/60 border border-[#414FA8]/20 flex items-start gap-2.5 text-xs text-gray-700">
          <Info className="w-4 h-4 text-[#414FA8] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-gray-900">
              {activeSpec.label} Rules Applied:
            </span>
            <span className="ml-1">{activeSpec.description}. Guaranteed 100% portal pass.</span>
          </div>
        </div>

        {/* ================= MODE: 2-IN-1 COMBO ================= */}
        {mode === 'combo' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Box 1: Photo Upload & Preview */}
              <div className="border border-gray-200 rounded-[4px] p-4 bg-gray-50/50 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-[#414FA8]" />
                    <span>1. Applicant Photograph</span>
                  </span>
                  <span className="text-[11px] font-semibold text-gray-500">
                    213 × 213 px ({activeSpec.photoDpi} DPI, &lt;{activeSpec.photoMaxKb}KB)
                  </span>
                </div>

                {!comboPhotoSrc ? (
                  <div
                    onClick={() => comboPhotoInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 hover:border-[#414FA8] bg-white rounded p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[170px]"
                  >
                    <input
                      ref={comboPhotoInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleComboPhoto(e.target.files[0])}
                    />
                    <Upload className="w-6 h-6 text-[#414FA8] mb-2" />
                    <p className="text-xs font-bold text-gray-800">Select or Drop Photo</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">JPG, PNG (Auto-crops to 213×213)</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2 py-2">
                    <div className="w-[140px] h-[140px] border border-gray-300 rounded bg-white overflow-hidden shadow-xs relative flex items-center justify-center">
                      {comboPhotoResult ? (
                        <Image
                          src={comboPhotoResult.url}
                          alt="PAN Photo Preview"
                          width={213}
                          height={213}
                          unoptimized
                          className="object-contain max-h-full max-w-full"
                        />
                      ) : (
                        <RefreshCw className="w-5 h-5 animate-spin text-[#414FA8]" />
                      )}
                    </div>
                    {comboPhotoResult && (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {formatBytes(comboPhotoResult.size)} (Limit: {activeSpec.photoMaxKb}KB)
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setComboPhotoFile(null);
                        setComboPhotoSrc(null);
                        setComboPhotoResult(null);
                      }}
                      className="text-[11px] text-red-600 hover:underline font-medium"
                    >
                      Change Photo
                    </button>
                  </div>
                )}
              </div>

              {/* Box 2: Signature Upload & Preview */}
              <div className="border border-gray-200 rounded-[4px] p-4 bg-gray-50/50 flex flex-col justify-between space-y-3">
                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <PenTool className="w-3.5 h-3.5 text-[#414FA8]" />
                    <span>2. Applicant Signature</span>
                  </span>
                  <span className="text-[11px] font-semibold text-gray-500">
                    {activeSpec.sigW} × {activeSpec.sigH} px (&lt;{activeSpec.sigMaxKb}KB)
                  </span>
                </div>

                {!comboSigSrc ? (
                  <div
                    onClick={() => comboSigInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 hover:border-[#414FA8] bg-white rounded p-6 text-center cursor-pointer transition-colors flex flex-col items-center justify-center min-h-[170px]"
                  >
                    <input
                      ref={comboSigInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleComboSig(e.target.files[0])}
                    />
                    <Upload className="w-6 h-6 text-[#414FA8] mb-2" />
                    <p className="text-xs font-bold text-gray-800">Select or Drop Signature</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">JPG, PNG (Auto-crops to {activeSpec.sigW}×{activeSpec.sigH})</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2 py-2">
                    <div className="w-[180px] h-[90px] border border-gray-300 rounded bg-white overflow-hidden shadow-xs relative flex items-center justify-center">
                      {comboSigResult ? (
                        <Image
                          src={comboSigResult.url}
                          alt="PAN Signature Preview"
                          width={activeSpec.sigW}
                          height={activeSpec.sigH}
                          unoptimized
                          className="object-contain max-h-full max-w-full"
                        />
                      ) : (
                        <RefreshCw className="w-5 h-5 animate-spin text-[#414FA8]" />
                      )}
                    </div>
                    {comboSigResult && (
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> {formatBytes(comboSigResult.size)} (Limit: {activeSpec.sigMaxKb}KB)
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setComboSigFile(null);
                        setComboSigSrc(null);
                        setComboSigResult(null);
                      }}
                      className="text-[11px] text-red-600 hover:underline font-medium"
                    >
                      Change Signature
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Action Bar for Combo */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {comboPhotoResult && (
                  <button
                    type="button"
                    onClick={() => downloadComboItem(comboPhotoResult)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Photo (213×213)
                  </button>
                )}
                {comboSigResult && (
                  <button
                    type="button"
                    onClick={() => downloadComboItem(comboSigResult)}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Signature
                  </button>
                )}
                {comboPhotoResult && comboSigResult && (
                  <button
                    type="button"
                    onClick={downloadBothZip}
                    disabled={isZipping}
                    className="px-4 py-2 bg-[#414FA8] hover:bg-[#343F89] text-white font-bold text-xs rounded transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <Archive className="w-3.5 h-3.5" />
                    <span>Download Both (ZIP Bundle)</span>
                  </button>
                )}
              </div>

              {/* WhatsApp Share Button */}
              <WhatsAppShareButton
                title={`Free PAN Card Photo & Signature Resizer (${activeSpec.label})`}
                message={`🔥 Resize PAN Card Photo (213x213) & Signature (${activeSpec.label} under 30KB/50KB) in 1 click free:`}
              />
            </div>
          </div>
        )}

        {/* ================= MODE: SINGLE (PHOTO OR SIGNATURE) ================= */}
        {mode !== 'combo' && (
          <div>
            {!imageSrc ? (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) handleSingleFile(e.dataTransfer.files[0]);
                }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-300 hover:border-[#414FA8] rounded-[4px] p-8 sm:p-12 text-center cursor-pointer transition-colors bg-gray-50/50 hover:bg-[#F2F4FC]/40 group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleSingleFile(e.target.files[0])}
                />
                <div className="w-14 h-14 mx-auto mb-3.5 rounded-full bg-white border border-gray-200 group-hover:border-[#414FA8]/30 flex items-center justify-center text-[#414FA8] shadow-xs transition-transform group-hover:scale-105">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-gray-800 mb-1">
                  Select or Drop your {mode === 'photo' ? 'Photo' : 'Signature'}
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Automatic scale to {mode === 'photo' ? activeSpec.photoW : activeSpec.sigW} × {mode === 'photo' ? activeSpec.photoH : activeSpec.sigH} px • Under {mode === 'photo' ? activeSpec.photoMaxKb : activeSpec.sigMaxKb}KB
                </p>
                <button
                  type="button"
                  className="px-4 py-2 bg-[#414FA8] hover:bg-[#343F89] text-white text-xs font-semibold rounded-[4px] shadow-xs transition-colors"
                >
                  Choose File
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                  {/* Preview */}
                  <div className="bg-gray-50 p-4 rounded-[4px] border border-gray-200 flex flex-col items-center justify-center min-h-[260px] relative">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-2">
                      Live Preview ({mode === 'photo' ? activeSpec.photoW : activeSpec.sigW} × {mode === 'photo' ? activeSpec.photoH : activeSpec.sigH} px)
                    </span>
                    {result ? (
                      <div
                        className="relative border-2 border-dashed border-[#414FA8]/40 rounded bg-white shadow-sm overflow-hidden flex items-center justify-center"
                        style={{
                          width: mode === 'photo' ? 180 : 260,
                          height: mode === 'photo' ? 180 : 130,
                        }}
                      >
                        <Image
                          src={result.url}
                          alt="PAN Preview"
                          width={result.width}
                          height={result.height}
                          unoptimized
                          className="object-contain max-h-full max-w-full"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <RefreshCw className="w-4 h-4 animate-spin text-[#414FA8]" /> Processing...
                      </div>
                    )}

                    {result && (
                      <div className="mt-3 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3" /> {formatBytes(result.size)} (Limit: {mode === 'photo' ? activeSpec.photoMaxKb : activeSpec.sigMaxKb} KB)
                        </span>
                        <span className="text-[11px] font-medium text-gray-500">
                          {mode === 'photo' ? activeSpec.photoDpi : activeSpec.sigDpi} DPI
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Settings */}
                  <div className="space-y-4 bg-white p-4 rounded-[4px] border border-gray-200">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
                      <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                        <Sliders className="w-3.5 h-3.5 text-[#414FA8]" /> Adjust Target Size
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setImageSrc(null);
                          setResult(null);
                        }}
                        className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>

                    {/* Target File Size Slider */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-semibold text-gray-700">Target Max File Size:</span>
                        <span className="font-bold text-[#414FA8]">{customKb} KB</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max={mode === 'photo' ? activeSpec.photoMaxKb : activeSpec.sigMaxKb}
                        value={customKb}
                        onChange={(e) => setCustomKb(Number(e.target.value))}
                        className="w-full accent-[#414FA8] cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                        <span>10 KB</span>
                        <span>Portal Limit: {mode === 'photo' ? activeSpec.photoMaxKb : activeSpec.sigMaxKb} KB</span>
                      </div>
                    </div>

                    {/* Zoom / Crop Slider */}
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1.5">
                        <span className="font-semibold text-gray-700">Crop Alignment / Zoom:</span>
                        <span className="font-bold text-gray-800">{zoom}%</span>
                      </div>
                      <input
                        type="range"
                        min="80"
                        max="160"
                        value={zoom}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full accent-[#414FA8] cursor-pointer"
                      />
                    </div>

                    {/* Download & Share Actions */}
                    <div className="pt-2 space-y-2">
                      <button
                        type="button"
                        disabled={!result || processing}
                        onClick={handleDownloadSingle}
                        className="w-full py-2.5 px-4 bg-[#414FA8] hover:bg-[#343F89] disabled:bg-gray-300 text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download {mode === 'photo' ? 'Photo' : 'Signature'} ({result ? formatBytes(result.size) : ''})</span>
                      </button>

                      <div className="flex justify-center">
                        <WhatsAppShareButton
                          title={`PAN Card ${mode === 'photo' ? 'Photo' : 'Signature'} Resizer (${activeSpec.label})`}
                          message={`🔥 Resize PAN Card ${mode === 'photo' ? 'Photo 213x213' : 'Signature'} for ${activeSpec.label} free without uploads:`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cyber Cafe & CSC Operator Bookmark Tip */}
        <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-amber-500" />
            <span><strong>CSC / Cyber Cafe Pro-Tip:</strong> Press <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-300 rounded text-[11px] font-mono">Ctrl + D</kbd> to bookmark for instant PAN card sizing.</span>
          </div>
          <span className="text-[11px] text-gray-400">100% Client-Side Privacy Guaranteed</span>
        </div>
      </div>
    </div>
  );
}
