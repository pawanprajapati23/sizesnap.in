'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Upload, Download, RefreshCw, Type, Image as ImageIcon, SlidersHorizontal } from 'lucide-react';

type WatermarkType = 'text' | 'logo';

function WatermarkToolContent() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Text Watermark State
  const [textStr, setTextStr] = useState('Watermark');
  const [textColor, setTextColor] = useState('#ffffff');
  const [textSize, setTextSize] = useState(48);
  const [textOpacity, setTextOpacity] = useState(50);
  const [textPosX, setTextPosX] = useState(50);
  const [textPosY, setTextPosY] = useState(50);

  // Logo Watermark State
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const [logoScale, setLogoScale] = useState(20); // percentage of image width
  const [logoOpacity, setLogoOpacity] = useState(50);
  const [logoPosX, setLogoPosX] = useState(50);
  const [logoPosY, setLogoPosY] = useState(50);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const logoImageRef = useRef<HTMLImageElement | null>(null);

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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      logoImageRef.current = img;
      setLogoSrc(url);
    };
    img.src = url;
  };

  const applyWatermark = React.useCallback(() => {
    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    if (!canvas || !img) return;

    setIsProcessing(true);
    
    setTimeout(() => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.globalAlpha = 1.0;
      ctx.drawImage(img, 0, 0);

      if (watermarkType === 'text' && textStr) {
        ctx.globalAlpha = textOpacity / 100;
        ctx.fillStyle = textColor;
        ctx.font = `bold ${textSize * (img.width / 1000)}px sans-serif`; // scale font with image
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const x = (textPosX / 100) * img.width;
        const y = (textPosY / 100) * img.height;
        
        ctx.fillText(textStr, x, y);
      } else if (watermarkType === 'logo' && logoImageRef.current) {
        const logo = logoImageRef.current;
        ctx.globalAlpha = logoOpacity / 100;
        
        const targetWidth = (logoScale / 100) * img.width;
        const ratio = targetWidth / logo.width;
        const targetHeight = logo.height * ratio;

        const x = (logoPosX / 100) * img.width - (targetWidth / 2);
        const y = (logoPosY / 100) * img.height - (targetHeight / 2);

        ctx.drawImage(logo, x, y, targetWidth, targetHeight);
      }
      
      setIsProcessing(false);
    }, 10);
  }, [
    watermarkType, textStr, textColor, textSize, textOpacity, textPosX, textPosY,
    logoScale, logoOpacity, logoPosX, logoPosY
  ]);

  useEffect(() => {
    if (imageSrc && originalImageRef.current && canvasRef.current) {
      applyWatermark();
    }
  }, [imageSrc, logoSrc, applyWatermark]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/jpeg', 0.9);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sizesnap_watermarked.jpg`;
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
          <h2 className="text-base font-bold text-gray-800 mb-2">Upload Image to Add Watermark</h2>
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
                <SlidersHorizontal className="w-4 h-4" /> Watermark
            </h3>
            <button onClick={() => {
                setImageSrc(null);
                setLogoSrc(null);
            }} className="text-xs text-red-600 hover:underline">
                Clear
            </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
            <button
                onClick={() => setWatermarkType('text')}
                className={`py-2 px-1 rounded border font-medium flex items-center justify-center gap-1 transition-colors ${
                    watermarkType === 'text' 
                    ? 'bg-[#414FA8] text-white border-[#414FA8]' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
            >
                <Type className="w-3.5 h-3.5" /> Text
            </button>
            <button
                onClick={() => setWatermarkType('logo')}
                className={`py-2 px-1 rounded border font-medium flex items-center justify-center gap-1 transition-colors ${
                    watermarkType === 'logo' 
                    ? 'bg-[#414FA8] text-white border-[#414FA8]' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
            >
                <ImageIcon className="w-3.5 h-3.5" /> Logo
            </button>
        </div>

        {watermarkType === 'text' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Text String</label>
              <input
                type="text"
                value={textStr}
                onChange={(e) => setTextStr(e.target.value)}
                className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm outline-none focus:border-[#414FA8]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Color</label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-full h-8 cursor-pointer rounded border border-gray-300"
              />
            </div>
            <div>
              <label className="flex text-xs font-semibold text-gray-700 mb-1 justify-between">
                <span>Font Size</span>
                <span className="text-[#414FA8]">{textSize}</span>
              </label>
              <input
                type="range"
                min="10"
                max="200"
                value={textSize}
                onChange={(e) => setTextSize(Number(e.target.value))}
                className="w-full accent-[#414FA8]"
              />
            </div>
            <div>
              <label className="flex text-xs font-semibold text-gray-700 mb-1 justify-between">
                <span>Opacity</span>
                <span className="text-[#414FA8]">{textOpacity}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={textOpacity}
                onChange={(e) => setTextOpacity(Number(e.target.value))}
                className="w-full accent-[#414FA8]"
              />
            </div>
            <div>
              <label className="flex text-xs font-semibold text-gray-700 mb-1 justify-between">
                <span>Position X</span>
                <span className="text-[#414FA8]">{textPosX}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={textPosX}
                onChange={(e) => setTextPosX(Number(e.target.value))}
                className="w-full accent-[#414FA8]"
              />
            </div>
            <div>
              <label className="flex text-xs font-semibold text-gray-700 mb-1 justify-between">
                <span>Position Y</span>
                <span className="text-[#414FA8]">{textPosY}%</span>
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={textPosY}
                onChange={(e) => setTextPosY(Number(e.target.value))}
                className="w-full accent-[#414FA8]"
              />
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Logo Image</label>
              <label className="block cursor-pointer border border-gray-300 rounded px-2 py-1.5 text-center text-sm bg-white hover:bg-gray-50 transition-colors">
                <span className="text-gray-700">{logoSrc ? 'Change Logo' : 'Upload Logo'}</span>
                <input type="file" accept="image/*" onChange={handleLogoUpload} className="sr-only" />
              </label>
            </div>
            {logoSrc && (
              <>
                <div>
                  <label className="flex text-xs font-semibold text-gray-700 mb-1 justify-between">
                    <span>Scale</span>
                    <span className="text-[#414FA8]">{logoScale}%</span>
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={logoScale}
                    onChange={(e) => setLogoScale(Number(e.target.value))}
                    className="w-full accent-[#414FA8]"
                  />
                </div>
                <div>
                  <label className="flex text-xs font-semibold text-gray-700 mb-1 justify-between">
                    <span>Opacity</span>
                    <span className="text-[#414FA8]">{logoOpacity}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={logoOpacity}
                    onChange={(e) => setLogoOpacity(Number(e.target.value))}
                    className="w-full accent-[#414FA8]"
                  />
                </div>
                <div>
                  <label className="flex text-xs font-semibold text-gray-700 mb-1 justify-between">
                    <span>Position X</span>
                    <span className="text-[#414FA8]">{logoPosX}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={logoPosX}
                    onChange={(e) => setLogoPosX(Number(e.target.value))}
                    className="w-full accent-[#414FA8]"
                  />
                </div>
                <div>
                  <label className="flex text-xs font-semibold text-gray-700 mb-1 justify-between">
                    <span>Position Y</span>
                    <span className="text-[#414FA8]">{logoPosY}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={logoPosY}
                    onChange={(e) => setLogoPosY(Number(e.target.value))}
                    className="w-full accent-[#414FA8]"
                  />
                </div>
              </>
            )}
          </div>
        )}

        <button
            onClick={handleDownload}
            disabled={isProcessing || (watermarkType === 'logo' && !logoSrc)}
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

export function ImageWatermarkTool() {
    return (
        <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading editor...</div>}>
            <WatermarkToolContent />
        </Suspense>
    );
}
