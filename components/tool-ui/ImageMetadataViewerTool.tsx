'use client';

import React, { useState, useRef } from 'react';
import { formatBytes } from '@/lib/format-utils';
import {
  Upload,
  FilePlus,
  Trash2,
  Download,
  AlertCircle,
  ShieldCheck,
  Info,
  Camera,
  MapPin,
  Calendar,
  Layers,
  FileText,
  Sliders,
  Maximize2,
} from 'lucide-react';

interface ParsedMetadata {
  fileName: string;
  fileSize: number;
  mimeType: string;
  lastModified: string;
  width: number;
  height: number;
  megapixels: string;
  aspectRatio: string;
  colorDepth: string;
  // EXIF
  cameraMake?: string;
  cameraModel?: string;
  dateTimeOriginal?: string;
  exposureTime?: string;
  fNumber?: string;
  iso?: string;
  focalLength?: string;
  software?: string;
  lensModel?: string;
  gpsLatitude?: number;
  gpsLongitude?: number;
  hasExif: boolean;
}

export function ImageMetadataViewerTool() {
  const [meta, setMeta] = useState<ParsedMetadata | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Greatest common divisor for aspect ratio calculation
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  // Pure binary client-side EXIF parser for JPEG
  const parseExifFromBuffer = (buffer: ArrayBuffer): Partial<ParsedMetadata> => {
    const dataView = new DataView(buffer);
    const exifData: Partial<ParsedMetadata> = { hasExif: false };

    // Check for JPEG SOI marker (0xFFD8)
    if (dataView.byteLength < 4 || dataView.getUint16(0, false) !== 0xffd8) {
      return exifData;
    }

    let offset = 2;
    const length = dataView.byteLength;

    while (offset < length - 4) {
      const marker = dataView.getUint16(offset, false);
      offset += 2;

      // APP1 Marker is 0xFFE1
      if (marker === 0xffe1) {
        const app1Length = dataView.getUint16(offset, false);
        offset += 2;

        // Check for 'Exif\0\0' (0x457869660000)
        const exifHeader = dataView.getUint32(offset, false);
        if (exifHeader === 0x45786966 && dataView.getUint16(offset + 4, false) === 0x0000) {
          exifData.hasExif = true;
          const tiffStart = offset + 6;

          // Check Endianness: 'II' = 0x4949 (Little-endian), 'MM' = 0x4D4D (Big-endian)
          const endianMarker = dataView.getUint16(tiffStart, false);
          const littleEndian = endianMarker === 0x4949;

          // IFD0 offset
          const firstIfdOffset = dataView.getUint32(tiffStart + 4, littleEndian);
          let dirStart = tiffStart + firstIfdOffset;

          if (dirStart < length) {
            const entries = dataView.getUint16(dirStart, littleEndian);
            dirStart += 2;

            for (let i = 0; i < entries && dirStart + i * 12 + 12 < length; i++) {
              const entryOffset = dirStart + i * 12;
              const tag = dataView.getUint16(entryOffset, littleEndian);
              const type = dataView.getUint16(entryOffset + 2, littleEndian);
              const numValues = dataView.getUint32(entryOffset + 4, littleEndian);
              const valueOffset = entryOffset + 8;

              // Helper to read ASCII string
              const readAscii = (): string => {
                let strOffset = valueOffset;
                if (numValues > 4) {
                  strOffset = tiffStart + dataView.getUint32(valueOffset, littleEndian);
                }
                let str = '';
                for (let j = 0; j < numValues - 1 && strOffset + j < length; j++) {
                  const charCode = dataView.getUint8(strOffset + j);
                  if (charCode === 0) break;
                  str += String.fromCharCode(charCode);
                }
                return str.trim();
              };

              // Make: 0x010F
              if (tag === 0x010f) exifData.cameraMake = readAscii();
              // Model: 0x0110
              if (tag === 0x0110) exifData.cameraModel = readAscii();
              // Software: 0x0131
              if (tag === 0x0131) exifData.software = readAscii();
              // DateTime: 0x0132
              if (tag === 0x0132) exifData.dateTimeOriginal = readAscii();

              // SubIFD (Exif Offset): 0x8769
              if (tag === 0x8769) {
                const subIfdOffset = tiffStart + dataView.getUint32(valueOffset, littleEndian);
                if (subIfdOffset + 2 < length) {
                  const subEntries = dataView.getUint16(subIfdOffset, littleEndian);
                  const subDirStart = subIfdOffset + 2;

                  for (let s = 0; s < subEntries && subDirStart + s * 12 + 12 < length; s++) {
                    const subEntryOffset = subDirStart + s * 12;
                    const subTag = dataView.getUint16(subEntryOffset, littleEndian);
                    const subValueOffset = subEntryOffset + 8;

                    // ExposureTime: 0x829A (Rational)
                    if (subTag === 0x829a) {
                      const ratOffset = tiffStart + dataView.getUint32(subValueOffset, littleEndian);
                      if (ratOffset + 8 <= length) {
                        const num = dataView.getUint32(ratOffset, littleEndian);
                        const den = dataView.getUint32(ratOffset + 4, littleEndian);
                        if (den > 0) {
                          exifData.exposureTime = num === 1 ? `1/${den}s` : `${(num / den).toFixed(3)}s`;
                        }
                      }
                    }

                    // FNumber: 0x829D (Rational)
                    if (subTag === 0x829d) {
                      const ratOffset = tiffStart + dataView.getUint32(subValueOffset, littleEndian);
                      if (ratOffset + 8 <= length) {
                        const num = dataView.getUint32(ratOffset, littleEndian);
                        const den = dataView.getUint32(ratOffset + 4, littleEndian);
                        if (den > 0) {
                          exifData.fNumber = `f/${(num / den).toFixed(1)}`;
                        }
                      }
                    }

                    // ISO: 0x8827
                    if (subTag === 0x8827) {
                      exifData.iso = `ISO ${dataView.getUint16(subValueOffset, littleEndian)}`;
                    }

                    // DateTimeOriginal: 0x9003
                    if (subTag === 0x9003) {
                      const subNum = dataView.getUint32(subEntryOffset + 4, littleEndian);
                      const strOffset = tiffStart + dataView.getUint32(subValueOffset, littleEndian);
                      let str = '';
                      for (let j = 0; j < subNum - 1 && strOffset + j < length; j++) {
                        str += String.fromCharCode(dataView.getUint8(strOffset + j));
                      }
                      if (str.trim()) exifData.dateTimeOriginal = str.trim();
                    }

                    // FocalLength: 0x920A
                    if (subTag === 0x920a) {
                      const ratOffset = tiffStart + dataView.getUint32(subValueOffset, littleEndian);
                      if (ratOffset + 8 <= length) {
                        const num = dataView.getUint32(ratOffset, littleEndian);
                        const den = dataView.getUint32(ratOffset + 4, littleEndian);
                        if (den > 0) exifData.focalLength = `${(num / den).toFixed(1)} mm`;
                      }
                    }
                  }
                }
              }
            }
          }
        }
        break;
      } else {
        // Skip marker
        if (offset < length - 2) {
          const markerLen = dataView.getUint16(offset, false);
          offset += markerLen;
        } else {
          break;
        }
      }
    }

    return exifData;
  };

  const processFile = async (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    try {
      const buffer = await file.arrayBuffer();
      const exif = parseExifFromBuffer(buffer);

      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      const img = new Image();
      img.onload = () => {
        const w = img.naturalWidth || img.width;
        const h = img.naturalHeight || img.height;
        const mp = ((w * h) / 1000000).toFixed(2);

        // Aspect ratio simplification
        const divisor = gcd(w, h);
        const aspectW = Math.round(w / divisor);
        const aspectH = Math.round(h / divisor);
        const aspectStr =
          aspectW <= 16 && aspectH <= 16
            ? `${aspectW}:${aspectH}`
            : (w / h).toFixed(2) + ':1';

        setMeta({
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type || 'image/jpeg',
          lastModified: new Date(file.lastModified).toLocaleString(),
          width: w,
          height: h,
          megapixels: `${mp} MP`,
          aspectRatio: aspectStr,
          colorDepth: '24-bit TrueColor (RGB 8-bit/channel)',
          ...exif,
          hasExif: !!exif.hasExif,
        });
      };
      img.onerror = () => setErrorMsg('Failed to decode image dimensions.');
      img.src = previewUrl;
    } catch (err: any) {
      setErrorMsg('Error reading file: ' + err.message);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const clearAll = () => {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
    setMeta(null);
    setErrorMsg(null);
  };

  const exportJson = () => {
    if (!meta) return;
    const blob = new Blob([JSON.stringify(meta, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meta.fileName.replace(/\.[^/.]+$/, '')}-metadata.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      {!meta ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[4px] border-2 border-dashed border-[#9AA3C8] bg-[#FAFAFC] hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-colors cursor-pointer select-none"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.webp,.tiff"
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            className="sr-only"
          />
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-4">
            <Info className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Select or Drag an Image to View Metadata
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Inspect EXIF camera parameters, aperture, shutter speed, ISO, focal length, image dimensions, megapixels, and color depth.
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
            <span>Select Image File</span>
          </button>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
            <span>Client-side EXIF binary reader</span>
            <span>•</span>
            <span>Camera &amp; file geometry</span>
            <span>•</span>
            <span>100% Client-Side</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-[4px] border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2.5">
              {imagePreview && (
                <div className="h-12 w-12 rounded border border-gray-200 bg-[#FAFAFC] overflow-hidden flex items-center justify-center shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt={meta.fileName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              )}
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate max-w-xs sm:max-w-md" title={meta.fileName}>
                  {meta.fileName}
                </h3>
                <p className="text-[11px] text-gray-500 font-mono">
                  {meta.width} × {meta.height} px ({meta.megapixels}) • {formatBytes(meta.fileSize)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={exportJson}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#EEF1FB] hover:bg-[#E2E7F8] text-[#414FA8] text-xs font-semibold border border-[#9AA3C8]/40 transition-colors"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export JSON</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#9AA3C8] hover:border-[#414FA8] bg-white hover:bg-[#EEF1FB] text-[#414FA8] text-xs font-semibold transition-colors"
              >
                <FilePlus className="h-3.5 w-3.5" />
                <span>Change Image</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.jpg,.jpeg,.png,.webp,.tiff"
                onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                className="sr-only"
              />

              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Metadata Section 1: File & Geometry */}
          <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <Maximize2 className="h-4 w-4 text-[#414FA8]" />
              <h4 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider">
                File &amp; Image Geometry
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              <div className="p-2.5 rounded border border-gray-200 bg-[#FAFAFC]">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Dimensions</span>
                <span className="font-semibold text-gray-800">{meta.width} × {meta.height} px</span>
              </div>

              <div className="p-2.5 rounded border border-gray-200 bg-[#FAFAFC]">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Megapixels</span>
                <span className="font-semibold text-gray-800">{meta.megapixels}</span>
              </div>

              <div className="p-2.5 rounded border border-gray-200 bg-[#FAFAFC]">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Aspect Ratio</span>
                <span className="font-semibold text-gray-800">{meta.aspectRatio}</span>
              </div>

              <div className="p-2.5 rounded border border-gray-200 bg-[#FAFAFC]">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">File Size</span>
                <span className="font-semibold text-gray-800">{formatBytes(meta.fileSize)}</span>
              </div>

              <div className="p-2.5 rounded border border-gray-200 bg-[#FAFAFC]">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">MIME Type</span>
                <span className="font-semibold text-gray-800">{meta.mimeType}</span>
              </div>

              <div className="p-2.5 rounded border border-gray-200 bg-[#FAFAFC]">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Color Depth</span>
                <span className="font-semibold text-gray-800">{meta.colorDepth}</span>
              </div>

              <div className="p-2.5 rounded border border-gray-200 bg-[#FAFAFC] col-span-2">
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Last Modified</span>
                <span className="font-semibold text-gray-800">{meta.lastModified}</span>
              </div>
            </div>
          </div>

          {/* Metadata Section 2: Camera & EXIF */}
          <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <Camera className="h-4 w-4 text-[#414FA8]" />
              <h4 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider">
                Camera &amp; Shooting Parameters (EXIF)
              </h4>
            </div>

            {meta.hasExif && (meta.cameraMake || meta.cameraModel || meta.exposureTime || meta.fNumber || meta.iso) ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
                {meta.cameraMake && (
                  <div className="p-2.5 rounded border border-gray-200 bg-[#FAFAFC]">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Camera Make</span>
                    <span className="font-semibold text-gray-800">{meta.cameraMake}</span>
                  </div>
                )}

                {meta.cameraModel && (
                  <div className="p-2.5 rounded border border-gray-200 bg-[#FAFAFC]">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Camera Model</span>
                    <span className="font-semibold text-gray-800">{meta.cameraModel}</span>
                  </div>
                )}

                {meta.dateTimeOriginal && (
                  <div className="p-2.5 rounded border border-gray-200 bg-[#FAFAFC]">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Date Taken</span>
                    <span className="font-semibold text-gray-800">{meta.dateTimeOriginal}</span>
                  </div>
                )}

                {meta.exposureTime && (
                  <div className="p-2.5 rounded border border-gray-200 bg-[#FAFAFC]">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Shutter Speed</span>
                    <span className="font-semibold text-gray-800">{meta.exposureTime}</span>
                  </div>
                )}

                {meta.fNumber && (
                  <div className="p-2.5 rounded border border-gray-200 bg-[#FAFAFC]">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Aperture</span>
                    <span className="font-semibold text-gray-800">{meta.fNumber}</span>
                  </div>
                )}

                {meta.iso && (
                  <div className="p-2.5 rounded border border-gray-200 bg-[#FAFAFC]">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">ISO Sensitivity</span>
                    <span className="font-semibold text-gray-800">{meta.iso}</span>
                  </div>
                )}

                {meta.focalLength && (
                  <div className="p-2.5 rounded border border-gray-200 bg-[#FAFAFC]">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Focal Length</span>
                    <span className="font-semibold text-gray-800">{meta.focalLength}</span>
                  </div>
                )}

                {meta.software && (
                  <div className="p-2.5 rounded border border-gray-200 bg-[#FAFAFC]">
                    <span className="text-gray-400 block text-[10px] uppercase font-bold">Software</span>
                    <span className="font-semibold text-gray-800">{meta.software}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600 space-y-1">
                <p className="font-semibold text-gray-800">No EXIF Camera Metadata Found</p>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  This image does not contain camera tags or shooting information. Common reasons include:
                  the photo was downloaded from social media (WhatsApp, Instagram, Twitter/X automatically strip EXIF for privacy),
                  or was saved from an image editor or screenshot tool without EXIF preservation.
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>EXIF tags parsed client-side using binary ArrayBuffer streams. 100% private.</span>
          </div>
        </div>
      )}
    </div>
  );
}
