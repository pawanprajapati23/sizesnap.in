'use client';
import { ImageMetadata } from './ImagePreviewCard';
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { formatBytes, sanitizeFilename } from '@/lib/format-utils';
import { trackToolError } from '@/lib/firebase';
import { RelatedTools } from "@/components/RelatedTools";
import {
  Upload,
  Settings,
  Download,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Info,
  ShieldCheck,
  Eye,
  RefreshCw,
  Archive,
  Trash2,
  FilePlus,
} from 'lucide-react';

interface Preset {
  id: string;
  name: string;
  width: number;
  height: number;
  format: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
  background: string;
  padding: number;
}

const PRESETS: Preset[] = [
  { id: 'amazon', name: 'Amazon (1000x1000, White BG)', width: 1000, height: 1000, format: 'image/jpeg', quality: 85, background: '#FFFFFF', padding: 0 },
  { id: 'flipkart', name: 'Flipkart (800x800, White BG)', width: 800, height: 800, format: 'image/jpeg', quality: 85, background: '#FFFFFF', padding: 0 },
  { id: 'meesho', name: 'Meesho (1080x1080)', width: 1080, height: 1080, format: 'image/jpeg', quality: 85, background: '#FFFFFF', padding: 0 },
  { id: 'myntra', name: 'Myntra (1080x1440)', width: 1080, height: 1440, format: 'image/jpeg', quality: 85, background: '#FFFFFF', padding: 0 },
  { id: 'shopify', name: 'Shopify Square (1024x1024)', width: 1024, height: 1024, format: 'image/jpeg', quality: 85, background: 'transparent', padding: 0 },
  { id: 'custom', name: 'Custom Configuration', width: 1000, height: 1000, format: 'image/jpeg', quality: 85, background: '#FFFFFF', padding: 0 },
];

interface ProcessedImage {
  id: string;
  original: ImageMetadata;
  blob?: Blob;
  url?: string;
  width?: number;
  height?: number;
  size?: number;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
}

export function ProductImageMakerTool() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('amazon');
  const [customPreset, setCustomPreset] = useState<Preset>(PRESETS[5]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [resultZipUrl, setResultZipUrl] = useState<string | null>(null);

  const urlsRef = useRef<string[]>([]);

  const registerUrl = useCallback((url: string) => {
    urlsRef.current.push(url);
    return url;
  }, []);

  const cleanupUrls = useCallback(() => {
    urlsRef.current.forEach((url) => {
      try { URL.revokeObjectURL(url); } catch { /* ignore */ }
    });
    urlsRef.current = [];
  }, []);

  useEffect(() => {
    return () => cleanupUrls();
  }, [cleanupUrls]);

  const activePreset = selectedPresetId === 'custom'
    ? customPreset
    : PRESETS.find(p => p.id === selectedPresetId) || PRESETS[0];

  const handleFiles = async (files: FileList | File[]) => {
    setErrorMsg(null);
    const validFiles: File[] = [];

    const MAX_FILES = 50;

    for (let i = 0; i < files.length; i++) {
      if (files[i].type.startsWith('image/')) {
        validFiles.push(files[i]);
      }
    }

    if (validFiles.length === 0) {
      setErrorMsg('Please select valid image files.');
      return;
    }

    const totalFiles = images.length + validFiles.length;
    if (totalFiles > MAX_FILES) {
      setErrorMsg(`Maximum ${MAX_FILES} images allowed at once.`);
      validFiles.splice(MAX_FILES - images.length);
    }

    setProgressMsg('Loading images...');
    setIsProcessing(true);

    try {
      const newImages: ProcessedImage[] = await Promise.all(
        validFiles.map(async (file) => {
          return new Promise<ProcessedImage>((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const img = new Image();
              img.onload = () => {
                const url = registerUrl(URL.createObjectURL(file));
                resolve({
                  id: Math.random().toString(36).substr(2, 9),
                  original: {
                    file,
                    previewUrl: url,
                    width: img.width,
                    height: img.height,
                    size: file.size,
                    type: file.type,
                    name: file.name
                  },
                  status: 'pending'
                });
              };
              img.onerror = () => {
                resolve({
                  id: Math.random().toString(36).substr(2, 9),
                  original: { file, previewUrl: '', width: 0, height: 0, size: file.size, type: file.type, name: file.name },
                  status: 'error',
                  error: 'Failed to load image'
                });
              };
              img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
          });
        })
      );

      setImages(prev => [...prev, ...newImages]);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to load images');
    } finally {
      setIsProcessing(false);
      setProgressMsg('');
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const resetAll = () => {
    cleanupUrls();
    setImages([]);
    setResultZipUrl(null);
    setErrorMsg(null);
  };

  const processImage = async (img: ProcessedImage, preset: Preset): Promise<ProcessedImage> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      canvas.width = preset.width;
      canvas.height = preset.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve({ ...img, status: 'error', error: 'Canvas not supported' });
        return;
      }

      if (preset.background !== 'transparent') {
        ctx.fillStyle = preset.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      const imageObj = new Image();
      imageObj.onload = () => {
        const padPx = preset.padding || 0;
        const availableW = canvas.width - (padPx * 2);
        const availableH = canvas.height - (padPx * 2);

        const scale = Math.min(availableW / imageObj.width, availableH / imageObj.height);
        const drawW = imageObj.width * scale;
        const drawH = imageObj.height * scale;
        const drawX = padPx + (availableW - drawW) / 2;
        const drawY = padPx + (availableH - drawH) / 2;

        ctx.drawImage(imageObj, drawX, drawY, drawW, drawH);

        canvas.toBlob((blob) => {
          if (!blob) {
            resolve({ ...img, status: 'error', error: 'Failed to encode image' });
            return;
          }
          const url = registerUrl(URL.createObjectURL(blob));
          resolve({
            ...img,
            blob,
            url,
            width: preset.width,
            height: preset.height,
            size: blob.size,
            status: 'done'
          });
        }, preset.format, preset.quality / 100);
      };

      imageObj.onerror = () => {
        resolve({ ...img, status: 'error', error: 'Failed to process' });
      };

      imageObj.src = img.original.previewUrl;
    });
  };

  const processAll = async () => {
    if (images.length === 0) return;

    setIsProcessing(true);
    setErrorMsg(null);
    setResultZipUrl(null);

    const updatedImages = [...images];
    let successCount = 0;

    for (let i = 0; i < updatedImages.length; i++) {
      if (updatedImages[i].status === 'error' && !updatedImages[i].original.previewUrl) continue;

      setProgressMsg(`Processing image ${i + 1} of ${updatedImages.length}...`);
      updatedImages[i].status = 'processing';
      setImages([...updatedImages]);

      try {
        const res = await processImage(updatedImages[i], activePreset);
        updatedImages[i] = res;
        if (res.status === 'done') successCount++;
      } catch (err: any) {
        updatedImages[i].status = 'error';
        updatedImages[i].error = err.message || 'Processing failed';
      }
      setImages([...updatedImages]);
    }

    if (successCount > 1) {
      setProgressMsg('Generating ZIP archive...');
      try {
        const JSZip = (await import('jszip')).default;
        const zip = new JSZip();
        updatedImages.forEach((img, idx) => {
          if (img.status === 'done' && img.blob) {
            const ext = activePreset.format === 'image/jpeg' ? 'jpg' : activePreset.format === 'image/png' ? 'png' : 'webp';
            const originalName = sanitizeFilename(img.original.name.replace(/\.[^/.]+$/, ""), "");
            zip.file(`${originalName}_${activePreset.width}x${activePreset.height}.${ext}`, img.blob);
          }
        });

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const zipUrl = registerUrl(URL.createObjectURL(zipBlob));
        setResultZipUrl(zipUrl);
      } catch (err: any) {
        console.error(err);
        trackToolError('product-image-maker', err.message);
        setErrorMsg('Failed to create ZIP archive. You can still download individually.');
      }
    }

    setIsProcessing(false);
    setProgressMsg('');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Col: Settings */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-5">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Settings className="h-4 w-4" /> Output Configuration
            </h3>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">Select Preset</label>
              <select
                value={selectedPresetId}
                onChange={(e) => setSelectedPresetId(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg p-2.5 focus:ring-2 focus:ring-[#414FA8] focus:border-[#414FA8] bg-gray-50"
                disabled={isProcessing}
              >
                {PRESETS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {selectedPresetId === 'custom' && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Width (px)</label>
                    <input
                      type="number"
                      min="100" max="4000"
                      value={customPreset.width}
                      onChange={(e) => setCustomPreset({...customPreset, width: Number(e.target.value)})}
                      className="w-full text-sm border border-gray-200 rounded-lg p-2"
                      disabled={isProcessing}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Height (px)</label>
                    <input
                      type="number"
                      min="100" max="4000"
                      value={customPreset.height}
                      onChange={(e) => setCustomPreset({...customPreset, height: Number(e.target.value)})}
                      className="w-full text-sm border border-gray-200 rounded-lg p-2"
                      disabled={isProcessing}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Format</label>
                  <select
                    value={customPreset.format}
                    onChange={(e) => setCustomPreset({...customPreset, format: e.target.value as any})}
                    className="w-full text-sm border border-gray-200 rounded-lg p-2"
                    disabled={isProcessing}
                  >
                    <option value="image/jpeg">JPEG</option>
                    <option value="image/png">PNG</option>
                    <option value="image/webp">WebP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Background</label>
                  <select
                    value={customPreset.background}
                    onChange={(e) => setCustomPreset({...customPreset, background: e.target.value})}
                    className="w-full text-sm border border-gray-200 rounded-lg p-2"
                    disabled={isProcessing}
                  >
                    <option value="#FFFFFF">White</option>
                    <option value="transparent">Transparent (PNG/WebP only)</option>
                    <option value="#000000">Black</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Quality ({customPreset.quality}%)</label>
                  <input
                    type="range"
                    min="10" max="100"
                    value={customPreset.quality}
                    onChange={(e) => setCustomPreset({...customPreset, quality: Number(e.target.value)})}
                    className="w-full"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            )}

            <div className="bg-[#EEF1FB] p-4 rounded-lg">
              <h4 className="text-xs font-bold text-[#414FA8] mb-1 flex items-center gap-1.5">
                 <Info className="h-3.5 w-3.5" /> Image Check Info
              </h4>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Output will be resized to exactly <strong>{activePreset.width} × {activePreset.height} px</strong>. Images will be fit within these bounds and padded with the selected background to prevent distortion. Check against your selected marketplace guidelines.
              </p>
            </div>

            {images.length > 0 && (
              <button
                onClick={processAll}
                disabled={isProcessing}
                className="w-full py-3 bg-[#414FA8] text-white font-medium rounded-xl hover:bg-[#344190] transition-colors focus:ring-4 focus:ring-[#414FA8]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> {progressMsg}</>
                ) : (
                  <>Generate {images.length} {images.length === 1 ? 'Image' : 'Images'}</>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Col: Workspace */}
        <div className="lg:col-span-8 space-y-6">
          {errorMsg && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
               <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                 <Upload className="h-4 w-4 text-[#414FA8]" /> Workspace ({images.length})
               </h3>
               {images.length > 0 && (
                 <div className="flex gap-2">
                   {resultZipUrl && (
                     <a
                       href={resultZipUrl}
                       download={`product-images-${activePreset.width}x${activePreset.height}.zip`}
                       className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5"
                     >
                       <Archive className="h-3.5 w-3.5" /> Download All ZIP
                     </a>
                   )}
                   <button
                     onClick={resetAll}
                     disabled={isProcessing}
                     className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                   >
                     <RefreshCw className="h-3.5 w-3.5" /> Clear All
                   </button>
                 </div>
               )}
            </div>

            <div className="p-6">
              {images.length === 0 ? (
                <div
                   className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center hover:bg-gray-50 hover:border-[#414FA8] transition-colors cursor-pointer bg-gray-50/30"
                   onClick={() => {
                     const input = document.createElement('input');
                     input.type = 'file';
                     input.multiple = true;
                     input.accept = 'image/*';
                     input.onchange = (e: any) => handleFiles(e.target.files);
                     input.click();
                   }}
                >
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#414FA8]">
                    <Upload className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Product Images</h3>
                  <p className="text-sm text-gray-500 max-w-sm mx-auto mb-6">
                    Select up to 50 images to process. Browser-based, secure, and fast.
                  </p>
                  <button className="px-6 py-2.5 bg-[#414FA8] text-white font-medium rounded-lg hover:bg-[#344190] transition-colors">
                    Browse Files
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((img) => (
                      <div key={img.id} className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                        <div className="aspect-square bg-white relative flex items-center justify-center p-2">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img.url || img.original.previewUrl}
                            alt={img.original.name}
                            className="max-w-full max-h-full object-contain"
                          />
                          {img.status === 'processing' && (
                            <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                              <Loader2 className="h-6 w-6 text-[#414FA8] animate-spin" />
                            </div>
                          )}
                          {img.status === 'done' && (
                            <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                              <CheckCircle2 className="h-3 w-3" />
                            </div>
                          )}
                        </div>

                        <div className="p-2 border-t border-gray-100 text-[10px] sm:text-xs">
                          <p className="font-medium text-gray-900 truncate" title={img.original.name}>
                            {img.original.name}
                          </p>

                          <div className="flex justify-between text-gray-500 mt-1">
                            <span>
                              {img.status === 'done'
                                ? `${img.width}x${img.height}`
                                : `${img.original.width}x${img.original.height}`}
                            </span>
                            <span>
                              {img.status === 'done' && img.size
                                ? formatBytes(img.size)
                                : formatBytes(img.original.size)}
                            </span>
                          </div>

                          <div className="mt-1 flex items-center gap-1">
                            {img.original.width === activePreset.width && img.original.height === activePreset.height ? (
                               <span className="text-green-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Size Matches</span>
                            ) : (
                               <span className="text-amber-600 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Will resize</span>
                            )}
                          </div>

                          {img.status === 'done' && img.url && (
                            <a
                              href={img.url}
                              download={`${sanitizeFilename(img.original.name.replace(/\.[^/.]+$/, ""), "")}_${activePreset.width}x${activePreset.height}.${activePreset.format === 'image/jpeg' ? 'jpg' : 'png'}`}
                              className="mt-2 block text-center w-full py-1.5 bg-[#EEF1FB] text-[#414FA8] font-medium rounded hover:bg-[#E2E7F8] transition-colors"
                            >
                              Download
                            </a>
                          )}
                          {img.status !== 'processing' && img.status !== 'done' && (
                            <button
                              onClick={() => removeImage(img.id)}
                              className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {!isProcessing && images.length < 50 && (
                      <div
                         className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:text-[#414FA8] hover:border-[#414FA8] hover:bg-gray-50 transition-colors cursor-pointer"
                         onClick={() => {
                           const input = document.createElement('input');
                           input.type = 'file';
                           input.multiple = true;
                           input.accept = 'image/*';
                           input.onchange = (e: any) => handleFiles(e.target.files);
                           input.click();
                         }}
                      >
                         <FilePlus className="h-6 w-6 mb-2" />
                         <span className="text-xs font-medium">Add More</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 flex flex-col items-center justify-center gap-2 mt-8">
        <div className="flex items-center gap-1.5 text-green-600 font-medium">
          <ShieldCheck className="h-4 w-4" /> 100% Secure & Private
        </div>
        <p>All images are processed locally in your browser. Files are never uploaded to our servers.</p>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 pb-12">
        <RelatedTools category="Image" currentSlug="product-image-maker" />
      </div>
    </div>
  );
}
