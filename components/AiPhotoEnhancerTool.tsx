'use client';
import React, { useState, useRef } from 'react';
import { Upload, Download, Wand2 } from 'lucide-react';

export function AiPhotoEnhancerTool() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setResult(null);
    }
  };

  const processImage = async () => {
    if (!image || !canvasRef.current) return;
    setIsProcessing(true);
    
    // Simulate AI processing time
    await new Promise(r => setTimeout(r, 1200));
    
    const orig = new Image();
    orig.src = image;
    await new Promise(r => orig.onload = r);
    
    const cvs = canvasRef.current;
    const ctx = cvs.getContext('2d');
    if(!ctx) return;
    
    cvs.width = orig.naturalWidth || orig.width;
    cvs.height = orig.naturalHeight || orig.height;
    
    // Apply "Smart Enhancement" filters
    ctx.filter = 'contrast(1.15) saturate(1.25) brightness(1.05) sepia(0.05)';
    ctx.drawImage(orig, 0, 0, cvs.width, cvs.height);
    
    setResult(cvs.toDataURL('image/jpeg', 0.95));
    setIsProcessing(false);
  };

  return (
    <div className="w-full space-y-4 text-center">
      <canvas ref={canvasRef} className="hidden" />
      {!image ? (
        <div className="border-2 border-dashed border-[#9AA3C8] rounded-md p-10 bg-[#FAFAFC]">
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="upload-enhance" />
          <label htmlFor="upload-enhance" className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-[#414FA8] text-white text-sm font-semibold rounded shadow-sm hover:bg-[#343f88]">
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
               <div className="w-full max-w-sm rounded border shadow-sm bg-gray-50 overflow-hidden relative">
                 <span className="absolute top-2 left-2 bg-emerald-600 text-white text-xs px-2 py-1 rounded">Enhanced</span>
                 <img src={result} alt="Enhanced photo" className="w-full h-auto" />
               </div>
            )}
          </div>
          
          {!result && !isProcessing && (
            <button onClick={processImage} className="px-6 py-3 bg-[#414FA8] text-white font-bold rounded flex items-center gap-2 justify-center mx-auto">
              <Wand2 className="w-5 h-5" /> Auto Enhance with AI
            </button>
          )}

          {isProcessing && (
            <div className="py-4 space-y-2">
               <div className="flex justify-center items-center gap-2 text-[#414FA8] font-semibold animate-pulse"><Wand2 className="w-5 h-5" /> Enhancing details, color and contrast...</div>
            </div>
          )}

          {result && (
             <div className="flex justify-center gap-3 mt-4">
               <button onClick={() => {setImage(null); setResult(null);}} className="px-4 py-2 border rounded">Start Over</button>
               <a href={result} download="enhanced-photo.jpg" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded flex items-center gap-2"><Download className="w-4 h-4" /> Download Result</a>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
