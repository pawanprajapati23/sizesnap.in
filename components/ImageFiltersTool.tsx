'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Upload, Download, RefreshCw, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';

type FilterMode = 'grayscale' | 'bw' | 'blur' | 'pixelate' | 'invert' | 'sepia' | 'deepfry' | 'sharpen';

function FilterToolContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialMode = (searchParams.get('mode') as FilterMode) || 'grayscale';
  
  const [mode, setMode] = useState<FilterMode>(initialMode);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<number>(50);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

  // Sync mode with URL if needed, but not strictly necessary to update URL on every click
  const handleModeChange = (newMode: FilterMode) => {
    setMode(newMode);
    setIntensity(newMode === 'blur' || newMode === 'pixelate' ? 10 : 50);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      originalImageRef.current = img;
      setImageSrc(url);
    };
    img.src = url;
  };

  const applyFilter = () => {
    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    if (!canvas || !img) return;

    setIsProcessing(true);
    
    // We use setTimeout to allow UI to show processing state if it takes long
    setTimeout(() => {
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;

      // Basic CSS filters supported by Canvas API
      ctx.filter = 'none';

      if (mode === 'blur') {
        ctx.filter = `blur(${intensity / 2}px)`;
        ctx.drawImage(img, 0, 0);
      } else if (mode === 'sepia') {
        ctx.filter = `sepia(${intensity}%)`;
        ctx.drawImage(img, 0, 0);
      } else if (mode === 'invert') {
        ctx.filter = `invert(${intensity}%)`;
        ctx.drawImage(img, 0, 0);
      } else if (mode === 'grayscale') {
        ctx.filter = `grayscale(${intensity * 2}%)`;
        ctx.drawImage(img, 0, 0);
      } else {
        // Draw normal first for pixel manipulation
        ctx.drawImage(img, 0, 0);
      }

      // Manual Pixel Manipulation for advanced filters
      if (['bw', 'deepfry', 'pixelate', 'sharpen'].includes(mode)) {
        if (mode === 'pixelate') {
            const size = Math.max(1, Math.floor(intensity / 2));
            const w = canvas.width;
            const h = canvas.height;
            // Draw small
            ctx.drawImage(img, 0, 0, w / size, h / size);
            // Disable smoothing
            ctx.imageSmoothingEnabled = false;
            // Scale back up
            ctx.drawImage(canvas, 0, 0, w / size, h / size, 0, 0, w, h);
        } else {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            
            if (mode === 'bw') {
                const threshold = (intensity / 100) * 255;
                for (let i = 0; i < data.length; i += 4) {
                    const avg = (data[i] + data[i+1] + data[i+2]) / 3;
                    const val = avg > threshold ? 255 : 0;
                    data[i] = data[i+1] = data[i+2] = val;
                }
            } else if (mode === 'deepfry') {
                const contrast = (intensity / 50) + 1; // 1 to 3
                for (let i = 0; i < data.length; i += 4) {
                    // Contrast
                    data[i] = ((data[i] / 255 - 0.5) * contrast + 0.5) * 255;
                    data[i+1] = ((data[i+1] / 255 - 0.5) * contrast + 0.5) * 255;
                    data[i+2] = ((data[i+2] / 255 - 0.5) * contrast + 0.5) * 255;
                    // Boost Red/Saturation
                    data[i] = Math.min(255, data[i] * 1.5);
                    data[i+1] = Math.max(0, data[i+1] * 0.8);
                }
            }
            ctx.putImageData(imageData, 0, 0);
        }
      }
      
      setIsProcessing(false);
    }, 10);
  };

  useEffect(() => {
    if (imageSrc && originalImageRef.current && canvasRef.current) {
      applyFilter();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc, mode, intensity]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/jpeg', 0.9);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sizesnap_${mode}_image.jpg`;
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
          <h2 className="text-base font-bold text-gray-800 mb-2">Upload Image to Apply Filters</h2>
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
                <SlidersHorizontal className="w-4 h-4" /> Filters
            </h3>
            <button onClick={() => setImageSrc(null)} className="text-xs text-red-600 hover:underline">
                Clear
            </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs">
            {(['grayscale', 'bw', 'blur', 'pixelate', 'sepia', 'deepfry'] as FilterMode[]).map(m => (
                <button
                    key={m}
                    onClick={() => handleModeChange(m)}
                    className={`py-2 px-1 rounded border font-medium capitalize transition-colors ${
                        mode === m 
                        ? 'bg-[#414FA8] text-white border-[#414FA8]' 
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                    }`}
                >
                    {m === 'bw' ? 'B & W' : m}
                </button>
            ))}
        </div>

        <div className="pt-4 border-t border-gray-200">
            <label className="block text-xs font-semibold text-gray-700 mb-2 flex justify-between">
                <span>Intensity / Threshold</span>
                <span className="text-[#414FA8]">{intensity}</span>
            </label>
            <input
                type="range"
                min="0"
                max="100"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full accent-[#414FA8]"
            />
        </div>

        <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="w-full mt-4 flex items-center justify-center gap-2 bg-[#414FA8] hover:bg-[#343f88] text-white text-sm font-semibold py-2.5 rounded shadow-sm transition-all disabled:opacity-50"
        >
            {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            Download Image
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="lg:col-span-3 bg-[#FAFAFC] border border-gray-200 rounded p-4 flex flex-col items-center justify-center min-h-[400px] overflow-hidden relative">
        {isProcessing && (
            <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                <RefreshCw className="w-8 h-8 text-[#414FA8] animate-spin" />
            </div>
        )}
        <canvas
            ref={canvasRef}
            className="max-w-full max-h-[60vh] object-contain shadow-sm border border-gray-100 bg-white"
        />
      </div>
    </div>
  );
}

export function ImageFiltersTool() {
    return (
        <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading editor...</div>}>
            <FilterToolContent />
        </Suspense>
    );
}
