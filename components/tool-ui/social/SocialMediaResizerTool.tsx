'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Upload, Image as ImageIcon, Download, Maximize, CheckCircle2, Crop, AlertCircle } from 'lucide-react';

interface SocialPreset {
  id: string;
  platform: string;
  type: string;
  width: number;
  height: number;
  aspectRatio: number;
}

const PRESETS: SocialPreset[] = [
  // Instagram
  { id: 'ig-square', platform: 'Instagram', type: 'Square Post', width: 1080, height: 1080, aspectRatio: 1 },
  { id: 'ig-portrait', platform: 'Instagram', type: 'Portrait Post', width: 1080, height: 1350, aspectRatio: 1080/1350 },
  { id: 'ig-story', platform: 'Instagram', type: 'Story / Reel', width: 1080, height: 1920, aspectRatio: 1080/1920 },

  // YouTube
  { id: 'yt-thumbnail', platform: 'YouTube', type: 'Thumbnail', width: 1280, height: 720, aspectRatio: 1280/720 },
  { id: 'yt-banner', platform: 'YouTube', type: 'Channel Banner', width: 2560, height: 1440, aspectRatio: 2560/1440 },

  // LinkedIn
  { id: 'li-post', platform: 'LinkedIn', type: 'Post Image', width: 1200, height: 627, aspectRatio: 1200/627 },
  { id: 'li-banner', platform: 'LinkedIn', type: 'Background Banner', width: 1584, height: 396, aspectRatio: 1584/396 },

  // Facebook
  { id: 'fb-post', platform: 'Facebook', type: 'Post Image', width: 1200, height: 630, aspectRatio: 1200/630 },
  { id: 'fb-cover', platform: 'Facebook', type: 'Cover Photo', width: 820, height: 312, aspectRatio: 820/312 },

  // X/Twitter
  { id: 'x-post', platform: 'X (Twitter)', type: 'In-Stream Photo', width: 1600, height: 900, aspectRatio: 1600/900 },
  { id: 'x-header', platform: 'X (Twitter)', type: 'Header Photo', width: 1500, height: 500, aspectRatio: 1500/500 },

  // WhatsApp
  { id: 'wa-dp', platform: 'WhatsApp', type: 'Profile Picture', width: 500, height: 500, aspectRatio: 1 },
  { id: 'wa-status', platform: 'WhatsApp', type: 'Status', width: 1080, height: 1920, aspectRatio: 1080/1920 },

  // Pinterest
  { id: 'pin-standard', platform: 'Pinterest', type: 'Standard Pin', width: 1000, height: 1500, aspectRatio: 1000/1500 },
];

interface SocialMediaResizerToolProps {
  initialPresetId?: string;
}

export function SocialMediaResizerTool({ initialPresetId }: SocialMediaResizerToolProps) {
  const [file, setFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string>('');
  const [originalDims, setOriginalDims] = useState<{w: number, h: number} | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<SocialPreset>(
    PRESETS.find(p => p.id === initialPresetId) || PRESETS[0]
  );
  const [fitMode, setFitMode] = useState<'cover' | 'contain'>('cover');
  const [backgroundColor, setBackgroundColor] = useState<string>('#ffffff');

  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setOriginalImageUrl(url);

    const img = new Image();
    img.onload = () => {
      setOriginalDims({ w: img.width, h: img.height });
    };
    img.src = url;
  };

  useEffect(() => {
    if (!originalImageUrl) return;

    const processImage = async () => {
      setIsProcessing(true);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.src = originalImageUrl;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const { width: targetW, height: targetH } = selectedPreset;
      canvas.width = targetW;
      canvas.height = targetH;

      // Fill background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, targetW, targetH);

      const srcRatio = img.width / img.height;
      const targetRatio = targetW / targetH;

      let drawW, drawH, drawX, drawY;

      if (fitMode === 'cover') {
        if (srcRatio > targetRatio) {
           drawH = targetH;
           drawW = img.width * (targetH / img.height);
           drawX = (targetW - drawW) / 2;
           drawY = 0;
        } else {
           drawW = targetW;
           drawH = img.height * (targetW / img.width);
           drawX = 0;
           drawY = (targetH - drawH) / 2;
        }
      } else {
        // contain
        if (srcRatio > targetRatio) {
           drawW = targetW;
           drawH = img.height * (targetW / img.width);
           drawX = 0;
           drawY = (targetH - drawH) / 2;
        } else {
           drawH = targetH;
           drawW = img.width * (targetH / img.height);
           drawX = (targetW - drawW) / 2;
           drawY = 0;
        }
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      setPreviewUrl(canvas.toDataURL('image/jpeg', 0.92));
      setIsProcessing(false);
    };

    processImage();

  }, [originalImageUrl, selectedPreset, fitMode, backgroundColor]);

  const downloadImage = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `${selectedPreset.platform.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${selectedPreset.type.toLowerCase().replace(/[^a-z0-9]/g, '-')}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const reset = () => {
    setFile(null);
    setOriginalImageUrl('');
    setPreviewUrl('');
    setOriginalDims(null);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {!file ? (
        <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6 items-center">
          <div className="w-full max-w-2xl flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-[#414FA8] transition-colors relative cursor-pointer">
             <input
               type="file"
               accept="image/jpeg, image/png, image/webp"
               onChange={handleFileUpload}
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
             />
             <Upload className="w-12 h-12 text-gray-400 mb-4" />
             <h3 className="text-lg font-bold text-gray-800 mb-1">Upload image to resize</h3>
             <p className="text-sm text-gray-500 text-center max-w-md">Resize for Instagram, YouTube, LinkedIn, Facebook, and more perfectly formatted for your timeline. Processed locally in your browser.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Controls Sidebar */}
          <div className="lg:col-span-4 space-y-4">
             <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-5">
                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Platform & Size Preset</label>
                   <select
                     value={selectedPreset.id}
                     onChange={e => setSelectedPreset(PRESETS.find(p => p.id === e.target.value) || PRESETS[0])}
                     className="w-full bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-[#414FA8] focus:border-[#414FA8] block p-2.5"
                   >
                     {Array.from(new Set(PRESETS.map(p => p.platform))).map(platform => (
                       <optgroup key={platform} label={platform}>
                         {PRESETS.filter(p => p.platform === platform).map(p => (
                           <option key={p.id} value={p.id}>{p.type} ({p.width}x{p.height})</option>
                         ))}
                       </optgroup>
                     ))}
                   </select>
                </div>

                <div>
                   <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Crop & Fit Mode</label>
                   <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                      <button
                        onClick={() => setFitMode('cover')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${fitMode === 'cover' ? 'bg-white shadow-xs text-[#414FA8]' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        <Crop className="w-4 h-4" /> Cover (Fill)
                      </button>
                      <button
                        onClick={() => setFitMode('contain')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${fitMode === 'contain' ? 'bg-white shadow-xs text-[#414FA8]' : 'text-gray-500 hover:text-gray-700'}`}
                      >
                        <Maximize className="w-4 h-4" /> Fit (Contain)
                      </button>
                   </div>
                </div>

                {fitMode === 'contain' && (
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Background Fill Color</label>
                    <div className="flex items-center gap-3">
                       <input
                         type="color"
                         value={backgroundColor}
                         onChange={e => setBackgroundColor(e.target.value)}
                         className="h-10 w-16 p-1 bg-white border border-gray-300 rounded cursor-pointer"
                       />
                       <span className="text-sm text-gray-600 font-mono uppercase">{backgroundColor}</span>
                    </div>
                  </div>
                )}
             </div>

             <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-3">
                <button
                  onClick={downloadImage}
                  disabled={!previewUrl || isProcessing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#414FA8] text-white font-bold rounded-lg hover:bg-[#343f88] transition-colors disabled:opacity-50"
                >
                  <Download className="w-5 h-5" />
                  Download Resized Image
                </button>
                <button
                  onClick={reset}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-600 font-medium border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Upload Different Image
                </button>
             </div>
          </div>

          {/* Preview Canvas Window */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full min-h-[500px]">
               <div className="bg-gray-50 p-3 border-b border-gray-200 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <ImageIcon className="w-4 h-4" />
                    <span className="font-semibold text-gray-800">{selectedPreset.platform} {selectedPreset.type}</span> Preview
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-white px-2 py-1 rounded border border-gray-200 font-mono text-xs font-semibold shadow-xs">
                      {selectedPreset.width} &times; {selectedPreset.height} px
                    </span>
                  </div>
               </div>

               <div className="flex-1 bg-gray-100 p-6 flex items-center justify-center relative overflow-hidden bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2U1ZTVlNSIvPgo8cmVjdCB4PSIxMCIgeT0iMTAiIHdpZHRoPSIxMCIgaGVpZ2h0PSIxMCIgZmlsbD0iI2U1ZTVlNSIvPgo8L3N2Zz4=')]">

                  {isProcessing && (
                     <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#414FA8] mb-3"></div>
                        <p className="text-sm font-semibold text-[#414FA8]">Applying crop format...</p>
                     </div>
                  )}

                  <div className="relative shadow-md border border-gray-200 bg-white max-h-full max-w-full flex items-center justify-center transition-all duration-300">
                     {previewUrl && (
                        <img
                          src={previewUrl}
                          alt="Cropped preview"
                          className="max-h-[600px] max-w-full object-contain pointer-events-none"
                        />
                     )}
                  </div>

               </div>

               <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Your image is cropped entirely on your device. SizeSnap does not upload or save your photos.
               </div>
            </div>
          </div>

        </div>
      )}

      {/* Hidden processing canvas */}
      <canvas ref={canvasRef} className="hidden" />

    </div>
  );
}
