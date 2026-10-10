'use client';
import React, { useState, useRef } from 'react';
import { Upload, Download, Loader2 } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';

export function RemoveBackgroundTool() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setResult(null);
    }
  };

  const processImage = async () => {
    if (!image) return;
    setIsProcessing(true);
    setProgress(10);
    try {
      const blob = await removeBackground(image, {
        progress: (key, current, total) => {
           setProgress(Math.round((current / total) * 100));
        }
      });
      setResult(URL.createObjectURL(blob));
    } catch (error) {
      console.error(error);
      alert('Failed to process image. Make sure you are using a modern browser.');
    }
    setIsProcessing(false);
  };

  return (
    <div className="w-full space-y-4 text-center">
      {!image ? (
        <div className="border-2 border-dashed border-[#9AA3C8] rounded-md p-10 bg-[#FAFAFC]">
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="upload-bg" />
          <label htmlFor="upload-bg" className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-[#414FA8] text-white text-sm font-semibold rounded shadow-sm hover:bg-[#343f88]">
            <Upload className="h-4 w-4" /> Upload Photo
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <div className="w-full max-w-sm rounded border shadow-sm bg-gray-50 overflow-hidden relative">
              <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Original</span>
              <img src={image} alt="Original photo" className="w-full h-auto" />
            </div>
            
            {result && (
               <div className="w-full max-w-sm rounded border shadow-sm pattern-checkerboard overflow-hidden relative" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), repeating-linear-gradient(45deg, #ccc 25%, #eee 25%, #eee 75%, #ccc 75%, #ccc)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}>
                 <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded z-10">Removed Background</span>
                 <img src={result} alt="Removed Background photo" className="w-full h-auto relative z-0" />
               </div>
            )}
          </div>

          {!result && !isProcessing && (
            <button onClick={processImage} className="px-6 py-3 bg-[#414FA8] text-white font-bold rounded">
              Remove Background
            </button>
          )}

          {isProcessing && (
            <div className="py-4 space-y-2">
               <div className="flex justify-center items-center gap-2 text-[#414FA8] font-semibold"><Loader2 className="animate-spin w-5 h-5" /> AI Processing ({progress}%)</div>
               <p className="text-xs text-gray-500">First-time load downloads the AI model locally (takes a few seconds).</p>
            </div>
          )}

          {result && (
             <div className="flex justify-center gap-3">
               <button onClick={() => {setImage(null); setResult(null);}} className="px-4 py-2 border rounded">Start Over</button>
               <a href={result} download="no-bg.png" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded flex items-center gap-2"><Download className="w-4 h-4" /> Download PNG</a>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
