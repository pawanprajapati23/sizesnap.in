'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Upload, Download, Maximize, Printer } from 'lucide-react';

function UpscalerToolContent() {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalDim, setOriginalDim] = useState<{w: number, h: number} | null>(null);
  
  // Settings
  const [scale, setScale] = useState<number>(2);
  const [targetDPI, setTargetDPI] = useState<number>(300);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      originalImageRef.current = img;
      setOriginalDim({ w: img.width, h: img.height });
      setImageSrc(url);
    };
    img.src = url;
  };

  useEffect(() => {
    if (imageSrc && originalImageRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const img = originalImageRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      // Use high quality image smoothing for upscaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
  }, [imageSrc, scale]);

  const changeDPI = (dataUrl: string, dpi: number) => {
      // Very basic DPI modifier for JPEG data URL
      if (!dataUrl.startsWith('data:image/jpeg')) return dataUrl;
      const base64 = dataUrl.split(',')[1];
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
      }
      // JPEG APP0 segment JFIF format specifies density
      // bytes[13] is density units (1 = pixels/inch)
      // bytes[14], bytes[15] is X density
      // bytes[16], bytes[17] is Y density
      if (bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF && bytes[3] === 0xE0) {
          bytes[13] = 1; // dots per inch
          bytes[14] = (dpi >> 8) & 0xFF;
          bytes[15] = dpi & 0xFF;
          bytes[16] = (dpi >> 8) & 0xFF;
          bytes[17] = dpi & 0xFF;
      }
      
      let newBinaryString = '';
      for (let i = 0; i < len; i++) {
          newBinaryString += String.fromCharCode(bytes[i]);
      }
      return 'data:image/jpeg;base64,' + window.btoa(newBinaryString);
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/jpeg', 1.0);
    const dpiUrl = changeDPI(url, targetDPI);
    
    const a = document.createElement('a');
    a.href = dpiUrl;
    a.download = `sizesnap_upscaled_${targetDPI}dpi.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!imageSrc) {
    return (
      <div className="border-2 border-dashed border-[#9AA3C8] rounded-md p-10 text-center bg-[#FAFAFC] hover:bg-white transition-colors">
        <div className="max-w-md mx-auto flex flex-col items-center">
          <div className="w-14 h-14 rounded-full bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center mb-4 shadow-xs">
            <Upload className="h-6 w-6" />
          </div>
          <h2 className="text-base font-bold text-gray-800 mb-2">Upload Image to Upscale</h2>
          <label className="cursor-pointer px-5 py-2.5 bg-[#414FA8] text-white text-sm font-semibold rounded shadow-sm hover:bg-[#343f88] transition-all">
            <span>Choose Image</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="sr-only" />
          </label>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar Controls */}
      <div className="lg:col-span-1 space-y-4 bg-gray-50 p-4 rounded border border-gray-200">
        <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                <Maximize className="w-4 h-4" /> Enhance
            </h3>
            <button onClick={() => setImageSrc(null)} className="text-xs text-red-600 hover:underline">
                Clear
            </button>
        </div>
        
        <div className="mb-4 border-b border-gray-200 pb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2">Upscale Resolution</label>
            <div className="flex gap-2 text-xs">
                <button
                    onClick={() => setScale(1)}
                    className={`flex-1 py-1.5 rounded border font-medium transition-colors ${
                        scale === 1 ? 'bg-[#414FA8] text-white border-[#414FA8]' : 'bg-white text-gray-700 border-gray-300'
                    }`}
                >
                    1x (Original)
                </button>
                <button
                    onClick={() => setScale(2)}
                    className={`flex-1 py-1.5 rounded border font-medium transition-colors ${
                        scale === 2 ? 'bg-[#414FA8] text-white border-[#414FA8]' : 'bg-white text-gray-700 border-gray-300'
                    }`}
                >
                    2x (HQ)
                </button>
                <button
                    onClick={() => setScale(4)}
                    className={`flex-1 py-1.5 rounded border font-medium transition-colors ${
                        scale === 4 ? 'bg-[#414FA8] text-white border-[#414FA8]' : 'bg-white text-gray-700 border-gray-300'
                    }`}
                >
                    4x (Max)
                </button>
            </div>
            {originalDim && (
                <p className="text-[10px] text-gray-500 mt-2">
                    Result Size: {originalDim.w * scale} x {originalDim.h * scale} px
                </p>
            )}
        </div>

        <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Printer className="w-3.5 h-3.5" /> Target Print DPI
            </label>
            <div className="flex gap-2 text-xs">
                <button
                    onClick={() => setTargetDPI(200)}
                    className={`flex-1 py-1.5 rounded border font-medium transition-colors ${
                        targetDPI === 200 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'
                    }`}
                >
                    200 DPI
                </button>
                <button
                    onClick={() => setTargetDPI(300)}
                    className={`flex-1 py-1.5 rounded border font-medium transition-colors ${
                        targetDPI === 300 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'
                    }`}
                >
                    300 DPI
                </button>
                <button
                    onClick={() => setTargetDPI(600)}
                    className={`flex-1 py-1.5 rounded border font-medium transition-colors ${
                        targetDPI === 600 ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-700 border-gray-300'
                    }`}
                >
                    600 DPI
                </button>
            </div>
        </div>

        <button
            onClick={handleDownload}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-[#414FA8] hover:bg-[#343f88] text-white text-sm font-semibold py-2.5 rounded shadow-sm transition-all"
        >
            <Download className="w-4 h-4" /> Download Image
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="lg:col-span-3 bg-gray-100 border border-gray-200 rounded p-4 flex flex-col items-center justify-center min-h-[400px]">
        <canvas
            ref={canvasRef}
            className="max-w-full max-h-[60vh] object-contain shadow-sm border border-gray-200 bg-white"
        />
      </div>
    </div>
  );
}

export function ImageUpscalerTool() {
    return (
        <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading...</div>}>
            <UpscalerToolContent />
        </Suspense>
    );
}
