'use client';

import React, { useState, useRef } from 'react';
import { Upload, Download, RefreshCw, Maximize, FileImage, Settings2 } from 'lucide-react';

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function IncreaseImageSizeTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [targetKB, setTargetKB] = useState<number | ''>(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImageRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        setErrorMsg('Please upload a valid image file (JPG, PNG).');
        return;
    }

    setOriginalFile(file);
    setErrorMsg(null);
    setResultUrl(null);
    setResultSize(0);

    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      originalImageRef.current = img;
      setImageSrc(url);
    };
    img.src = url;
  };

  const handleIncrease = () => {
    const canvas = canvasRef.current;
    const img = originalImageRef.current;
    if (!canvas || !img || !originalFile || !targetKB) return;

    const targetBytes = Number(targetKB) * 1024;
    
    if (originalFile.size >= targetBytes) {
        setErrorMsg(`Your image is already ${formatBytes(originalFile.size)}. Please enter a target size greater than the original size.`);
        return;
    }

    setErrorMsg(null);
    setIsProcessing(true);

    setTimeout(() => {
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            setIsProcessing(false);
            return;
        }

        // Strategy: 
        // 1. We scale up the dimensions gently (Max 2.0x) to add real pixel data.
        // 2. We use 1.0 (Maximum) JPEG Quality to balloon the file size.
        // 3. We use a binary search to find the exact scale multiplier needed.
        
        let minScale = 1.0;
        let maxScale = 5.0; // Allow up to 5x scale if needed for massive KB jumps
        let bestBlob: Blob | null = null;
        let bestSizeDiff = Infinity;
        let attempts = 0;
        const maxAttempts = 15;

        // Binary search for perfect scale
        while (attempts < maxAttempts) {
            const currentScale = (minScale + maxScale) / 2;
            
            canvas.width = Math.floor(img.width * currentScale);
            canvas.height = Math.floor(img.height * currentScale);
            
            // Draw white background in case of transparent PNGs
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const dataUrl = canvas.toDataURL('image/jpeg', 1.0); // 1.0 = Max Quality
            
            // Base64 size to bytes approx
            const binaryString = atob(dataUrl.split(',')[1]);
            const bytesLength = binaryString.length;
            
            const diff = Math.abs(bytesLength - targetBytes);

            if (diff < bestSizeDiff) {
                bestSizeDiff = diff;
                
                // Construct blob
                const bytes = new Uint8Array(bytesLength);
                for (let i = 0; i < bytesLength; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                bestBlob = new Blob([bytes], { type: 'image/jpeg' });
            }

            // Stop if we are within 2% of the target size
            if (bytesLength > targetBytes * 0.98 && bytesLength < targetBytes * 1.05) {
                break;
            }

            if (bytesLength < targetBytes) {
                minScale = currentScale; // Need bigger
            } else {
                maxScale = currentScale; // Need smaller
            }
            
            attempts++;
        }

        if (bestBlob) {
            const url = URL.createObjectURL(bestBlob);
            setResultUrl(url);
            setResultSize(bestBlob.size);
        }

        setIsProcessing(false);
    }, 50);
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement('a');
    a.href = resultUrl;
    a.download = `sizesnap_increased_${targetKB}kb.jpg`;
    document.body.appendChild(a);
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Hidden canvas for processing */}
      <canvas ref={canvasRef} className="hidden" />

      {!imageSrc ? (
        <div className="border-2 border-dashed border-[#9AA3C8] rounded-md p-10 text-center bg-[#FAFAFC] hover:bg-white transition-colors">
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center mb-4 shadow-xs">
              <Upload className="h-6 w-6" />
            </div>
            <h2 className="text-base font-bold text-gray-800 mb-2">Upload Image to Increase Size</h2>
            <p className="text-xs text-gray-500 mb-5">
              Select a JPG or PNG file. We will upscale it to hit your required KB limit.
            </p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2.5 bg-[#414FA8] hover:bg-[#343f88] text-white font-semibold rounded shadow-sm transition-colors text-sm"
            >
              Choose Image
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Original Preview & Settings */}
          <div className="space-y-4">
            <div className="bg-gray-100 border border-gray-200 rounded p-2 flex items-center justify-center h-[300px] relative overflow-hidden">
                <img src={imageSrc} alt="Original Preview" className="max-w-full max-h-full object-contain" />
            </div>
            
            <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-4">
                <div className="flex items-center justify-between text-xs font-semibold text-gray-700">
                    <span>Original Size:</span>
                    <span className="text-gray-900 bg-gray-200 px-2 py-1 rounded">{originalFile ? formatBytes(originalFile.size) : '0 KB'}</span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                    <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1.5 mb-2">
                        <Settings2 className="w-4 h-4" /> Target Size
                    </h3>
                    <div className="relative">
                        <input
                            type="number"
                            value={targetKB}
                            onChange={(e) => setTargetKB(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full p-2.5 pr-12 text-sm font-bold text-gray-800 border border-gray-300 rounded outline-none focus:border-[#414FA8]"
                            placeholder="e.g. 100"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">
                            KB
                        </span>
                    </div>
                    
                    {errorMsg && (
                        <p className="text-xs text-red-600 mt-2 font-medium">{errorMsg}</p>
                    )}
                </div>

                <button
                    onClick={handleIncrease}
                    disabled={isProcessing || !targetKB}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] disabled:bg-gray-400 text-white font-semibold text-sm rounded shadow-sm transition-colors"
                >
                    {isProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Maximize className="w-4 h-4" />}
                    {isProcessing ? 'Upscaling Image...' : `Increase Size to ${targetKB} KB`}
                </button>

                <button onClick={() => { setImageSrc(null); setResultUrl(null); setErrorMsg(null); }} className="w-full text-xs text-red-600 hover:underline py-1">
                    Upload Different Image
                </button>
            </div>
          </div>

          {/* Right: Result View */}
          <div className="bg-white border border-gray-200 rounded flex flex-col shadow-xs">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50 rounded-t">
                <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                    <FileImage className="w-4 h-4" /> Result Image
                </h3>
            </div>
            
            <div className="flex-1 p-4 flex flex-col items-center justify-center min-h-[300px]">
                {resultUrl ? (
                    <div className="w-full h-full flex flex-col items-center space-y-4 animate-in fade-in zoom-in-95 duration-300">
                        <div className="flex-1 w-full bg-gray-100 border border-gray-200 rounded p-2 flex items-center justify-center">
                            <img src={resultUrl} alt="Result Preview" className="max-w-full max-h-[220px] object-contain shadow-sm" />
                        </div>
                        
                        <div className="w-full bg-emerald-50 border border-emerald-200 p-3 rounded text-center">
                            <span className="block text-[11px] text-emerald-600 font-medium uppercase tracking-wider mb-1">New File Size</span>
                            <span className="text-lg font-bold text-emerald-700">{formatBytes(resultSize)}</span>
                        </div>

                        <button
                            onClick={handleDownload}
                            className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded shadow-sm transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Download Ready Image
                        </button>
                    </div>
                ) : (
                    <div className="text-gray-400 text-sm flex flex-col items-center gap-2">
                        <Maximize className="w-8 h-8 opacity-20" />
                        <p>Click "Increase Size" to see results here.</p>
                    </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
