'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Upload, Download, Square, CircleDashed, Ratio } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

function FramerToolContent() {
  const searchParams = useSearchParams();
  const initialMode = searchParams.get('mode') || 'border';
  
  const [mode, setMode] = useState<string>(initialMode);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  // Settings
  const [borderSize, setBorderSize] = useState<number>(20);
  const [borderColor, setBorderColor] = useState<string>('#FFFFFF');
  const [borderRadius, setBorderRadius] = useState<number>(50);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);

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

  const applyFrame = () => {
    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (mode === 'border') {
      canvas.width = img.width + (borderSize * 2);
      canvas.height = img.height + (borderSize * 2);
      
      ctx.fillStyle = borderColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, borderSize, borderSize);
    } else if (mode === 'round') {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Calculate true radius so it doesn't exceed image bounds
      const maxRadius = Math.min(img.width, img.height) / 2;
      const r = (borderRadius / 100) * maxRadius;

      // Draw rounded rect mask
      ctx.beginPath();
      ctx.moveTo(r, 0);
      ctx.lineTo(canvas.width - r, 0);
      ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r);
      ctx.lineTo(canvas.width, canvas.height - r);
      ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height);
      ctx.lineTo(r, canvas.height);
      ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      
      ctx.clip();
      ctx.drawImage(img, 0, 0);
    }
  };

  useEffect(() => {
    if (imageSrc && originalImageRef.current && canvasRef.current) {
      applyFrame();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageSrc, mode, borderSize, borderColor, borderRadius]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL(mode === 'round' ? 'image/png' : 'image/jpeg', 0.9);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sizesnap_${mode}_image.${mode === 'round' ? 'png' : 'jpg'}`;
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
          <h2 className="text-base font-bold text-gray-800 mb-2">Upload Image to Frame</h2>
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
                <Square className="w-4 h-4" /> Tools
            </h3>
            <button onClick={() => setImageSrc(null)} className="text-xs text-red-600 hover:underline">
                Clear
            </button>
        </div>
        
        <div className="flex gap-2 text-xs mb-4">
            <button
                onClick={() => setMode('border')}
                className={`flex-1 py-2 rounded border font-medium transition-colors ${
                    mode === 'border' ? 'bg-[#414FA8] text-white border-[#414FA8]' : 'bg-white text-gray-700 border-gray-300'
                }`}
            >
                Add Border
            </button>
            <button
                onClick={() => setMode('round')}
                className={`flex-1 py-2 rounded border font-medium transition-colors ${
                    mode === 'round' ? 'bg-[#414FA8] text-white border-[#414FA8]' : 'bg-white text-gray-700 border-gray-300'
                }`}
            >
                Round Corners
            </button>
        </div>

        {mode === 'border' && (
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2 flex justify-between">
                        <span>Border Thickness</span>
                        <span className="text-[#414FA8]">{borderSize}px</span>
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="200"
                        value={borderSize}
                        onChange={(e) => setBorderSize(Number(e.target.value))}
                        className="w-full accent-[#414FA8]"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Border Color</label>
                    <input
                        type="color"
                        value={borderColor}
                        onChange={(e) => setBorderColor(e.target.value)}
                        className="w-full h-10 rounded cursor-pointer"
                    />
                </div>
            </div>
        )}

        {mode === 'round' && (
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2 flex justify-between">
                    <span>Corner Radius</span>
                    <span className="text-[#414FA8]">{borderRadius}%</span>
                </label>
                <input
                    type="range"
                    min="1"
                    max="100"
                    value={borderRadius}
                    onChange={(e) => setBorderRadius(Number(e.target.value))}
                    className="w-full accent-[#414FA8]"
                />
            </div>
        )}

        <button
            onClick={handleDownload}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-[#414FA8] hover:bg-[#343f88] text-white text-sm font-semibold py-2.5 rounded shadow-sm transition-all"
        >
            <Download className="w-4 h-4" /> Download Image
        </button>
      </div>

      {/* Main Canvas Area */}
      <div className="lg:col-span-3 bg-[url('/checkers.png')] bg-gray-100 border border-gray-200 rounded p-4 flex flex-col items-center justify-center min-h-[400px]">
        <canvas
            ref={canvasRef}
            className="max-w-full max-h-[60vh] object-contain shadow-sm border border-gray-200"
        />
      </div>
    </div>
  );
}

export function ImageFramerTool() {
    return (
        <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading...</div>}>
            <FramerToolContent />
        </Suspense>
    );
}
