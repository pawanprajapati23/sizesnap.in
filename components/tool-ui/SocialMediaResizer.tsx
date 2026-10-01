'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DropzoneUpload } from './DropzoneUpload';
import { ImagePreviewCard, type ImageMetadata } from './ImagePreviewCard';
import { formatBytes, sanitizeFilename, getExtensionFromMime } from '@/lib/format-utils';
import {
  Download,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Crop,
  Settings2
} from 'lucide-react';

interface Preset {
  id: string;
  label: string;
  width: number;
  height: number;
  platform: string;
}

const PRESETS: Preset[] = [
  { id: 'ig-post', platform: 'Instagram', label: 'Post (Square)', width: 1080, height: 1080 },
  { id: 'ig-portrait', platform: 'Instagram', label: 'Post (Portrait)', width: 1080, height: 1350 },
  { id: 'ig-landscape', platform: 'Instagram', label: 'Post (Landscape)', width: 1080, height: 566 },
  { id: 'ig-story', platform: 'Instagram', label: 'Story / Reel', width: 1080, height: 1920 },
  { id: 'ig-profile', platform: 'Instagram', label: 'Profile Picture', width: 320, height: 320 },

  { id: 'fb-profile', platform: 'Facebook', label: 'Profile Picture', width: 176, height: 176 },
  { id: 'fb-cover', platform: 'Facebook', label: 'Cover Photo', width: 851, height: 315 },
  { id: 'fb-post', platform: 'Facebook', label: 'Post Image', width: 1200, height: 630 },

  { id: 'yt-thumb', platform: 'YouTube', label: 'Thumbnail', width: 1280, height: 720 },
  { id: 'yt-banner', platform: 'YouTube', label: 'Channel Banner', width: 2560, height: 1440 },
  { id: 'yt-profile', platform: 'YouTube', label: 'Profile Picture', width: 800, height: 800 },

  { id: 'li-profile', platform: 'LinkedIn', label: 'Profile Picture', width: 400, height: 400 },
  { id: 'li-banner', platform: 'LinkedIn', label: 'Background Banner', width: 1584, height: 396 },
  { id: 'li-post', platform: 'LinkedIn', label: 'Post Image', width: 1200, height: 627 },

  { id: 'wa-dp', platform: 'WhatsApp', label: 'Profile Picture (DP)', width: 500, height: 500 },
  { id: 'wa-status', platform: 'WhatsApp', label: 'Status', width: 1080, height: 1920 },
];

export function SocialMediaResizer() {
  const [selectedImage, setSelectedImage] = useState<ImageMetadata | null>(null);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ig-post');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number>(0);
  const [resultDim, setResultDim] = useState<{w: number, h: number}>({w: 0, h: 0});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const objectUrlsRef = useRef<string[]>([]);
  const registerUrl = useCallback((url: string) => {
    objectUrlsRef.current.push(url);
    return url;
  }, []);

  const cleanupUrls = useCallback(() => {
    objectUrlsRef.current.forEach((url) => {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    });
    objectUrlsRef.current = [];
  }, []);

  useEffect(() => {
    return () => cleanupUrls();
  }, [cleanupUrls]);

  const handleFileSelect = (file: File) => {
    setErrorMsg(null);
    setResultUrl(null);

    const url = registerUrl(URL.createObjectURL(file));
    const img = new Image();

    img.onload = () => {
      setSelectedImage({
        file,
        previewUrl: url,
        name: file.name,
        width: img.width,
        height: img.height,
        size: file.size,
        type: file.type,
      });
    };
    img.onerror = () => {
      setErrorMsg('Failed to read image file.');
    };
    img.src = url;
  };

  const currentPreset = PRESETS.find(p => p.id === selectedPresetId) || PRESETS[0];

  const processImage = async () => {
    if (!selectedImage) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const img = new Image();
      img.src = selectedImage.previewUrl;
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      const targetW = currentPreset.width;
      const targetH = currentPreset.height;

      canvas.width = targetW;
      canvas.height = targetH;

      // Fill background for transparent images
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, targetW, targetH);

      // object-fit: cover logic
      const imgRatio = img.width / img.height;
      const targetRatio = targetW / targetH;

      let drawW = targetW;
      let drawH = targetH;
      let offsetX = 0;
      let offsetY = 0;

      if (imgRatio > targetRatio) {
         // image is wider than target. Fit height, crop width.
         drawW = targetH * imgRatio;
         drawH = targetH;
         offsetX = (targetW - drawW) / 2;
      } else {
         // image is taller than target. Fit width, crop height.
         drawW = targetW;
         drawH = targetW / imgRatio;
         offsetY = (targetH - drawH) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);

      canvas.toBlob((blob) => {
        if (!blob) {
          setErrorMsg('Failed to generate image blob');
          setIsProcessing(false);
          return;
        }
        const rUrl = registerUrl(URL.createObjectURL(blob));
        setResultUrl(rUrl);
        setResultSize(blob.size);
        setResultDim({ w: targetW, h: targetH });
        setIsProcessing(false);
      }, 'image/jpeg', 0.9);

    } catch (err) {
      console.error(err);
      setErrorMsg('An error occurred during resizing.');
      setIsProcessing(false);
    }
  };

  const platforms = Array.from(new Set(PRESETS.map(p => p.platform)));

  return (
    <div className="space-y-6">
      {!selectedImage ? (
        <DropzoneUpload
          onFileSelect={handleFileSelect}
          acceptedFormats={['JPG', 'JPEG', 'PNG', 'WebP']}
          maxSizeMB={20}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-4 space-y-4">
            <ImagePreviewCard image={selectedImage} onReset={() => {
                setSelectedImage(null);
                setResultUrl(null);
                cleanupUrls();
              }} />
            <button
              onClick={() => {
                setSelectedImage(null);
                setResultUrl(null);
                cleanupUrls();
              }}
              className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50 transition"
            >
              Upload Different Image
            </button>
          </div>

          <div className="md:col-span-8 space-y-6">
            <div className="bg-gray-50 p-4 rounded border border-gray-200">
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 text-gray-800">
                <Settings2 className="w-4 h-4 text-gray-500" />
                Select Social Media Preset
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Platform & Size</label>
                  <select
                    className="w-full border-gray-300 rounded shadow-sm text-sm p-2 focus:ring-[#414FA8] focus:border-[#414FA8] outline-none border"
                    value={selectedPresetId}
                    onChange={(e) => setSelectedPresetId(e.target.value)}
                  >
                    {platforms.map(platform => (
                      <optgroup key={platform} label={platform}>
                        {PRESETS.filter(p => p.platform === platform).map(p => (
                          <option key={p.id} value={p.id}>
                            {p.label} ({p.width} × {p.height} px)
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={processImage}
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 bg-[#414FA8] text-white font-medium rounded shadow-sm hover:bg-[#344087] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                  ) : (
                    <><Crop className="w-5 h-5" /> Resize for {currentPreset.platform}</>
                  )}
                </button>
              </div>

              {errorMsg && (
                <div className="mt-4 p-3 bg-red-50 text-red-700 rounded border border-red-200 flex items-center gap-2 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  {errorMsg}
                </div>
              )}
              <div className="mt-4 text-xs text-gray-500 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-green-500" /> All image processing happens safely on your device.
              </div>
            </div>

            {resultUrl && (
              <div className="bg-emerald-50 p-4 rounded border border-emerald-200">
                <div className="flex items-start gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-emerald-900">Resizing Complete</h3>
                    <p className="text-sm text-emerald-700 mt-1">
                      Your image is ready for {currentPreset.platform} ({currentPreset.label}).
                    </p>
                    <div className="mt-2 text-xs text-emerald-800 bg-emerald-100 px-2 py-1 rounded inline-block font-medium">
                      {resultDim.w} × {resultDim.h} px • {formatBytes(resultSize)}
                    </div>
                  </div>
                </div>

                <div className="mb-4 bg-white border border-emerald-100 rounded p-2 flex justify-center items-center overflow-hidden h-48 relative">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={resultUrl} alt="Resized Preview" className="max-w-full max-h-full object-contain" />
                </div>

                <div className="flex gap-3">
                  <a
                    href={resultUrl}
                    download={sanitizeFilename(`${currentPreset.platform.toLowerCase()}-${selectedImage.name}`, "jpg")}
                    className="flex-1 py-2 px-4 bg-emerald-600 text-white text-center font-medium rounded hover:bg-emerald-700 transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Download Image
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
