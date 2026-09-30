'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Loader2 } from 'lucide-react';
import { removeBackground } from '@imgly/background-removal';

export function BlurBackgroundTool() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [blurAmount, setBlurAmount] = useState(10);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const origImgRef = useRef<HTMLImageElement>(null);
  const maskImgRef = useRef<HTMLImageElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
      setResult(null);
      origImgRef.current = null;
      maskImgRef.current = null;
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
      
      const maskUrl = URL.createObjectURL(blob);
      
      const orig = new Image();
      const mask = new Image();
      orig.src = image;
      mask.src = maskUrl;
      
      await Promise.all([
        new Promise(r => orig.onload = r),
        new Promise(r => mask.onload = r)
      ]);
      
      origImgRef.current = orig;
      maskImgRef.current = mask;
      
      applyBlur(orig, mask, blurAmount);
    } catch (error) {
      console.error(error);
      alert('Failed to process image.');
    }
    setIsProcessing(false);
  };
  
  const applyBlur = (orig: HTMLImageElement, mask: HTMLImageElement, blur: number) => {
      if (!canvasRef.current) return;
      const cvs = canvasRef.current;
      const ctx = cvs.getContext('2d');
      if(!ctx) return;
      
      cvs.width = orig.naturalWidth || orig.width;
      cvs.height = orig.naturalHeight || orig.height;
      
      // Draw blurred original for background
      ctx.filter = `blur(${blur}px)`;
      ctx.drawImage(orig, 0, 0, cvs.width, cvs.height);
      
      // Draw the crisp masked subject on top
      ctx.filter = 'none';
      ctx.drawImage(mask, 0, 0, cvs.width, cvs.height);
      
      setResult(cvs.toDataURL('image/jpeg', 0.9));
  };
  
  useEffect(() => {
     if(origImgRef.current && maskImgRef.current) {
        applyBlur(origImgRef.current, maskImgRef.current, blurAmount);
     }
  }, [blurAmount]);

  return (
    <div className="w-full space-y-4 text-center">
      <canvas ref={canvasRef} className="hidden" />
      {!image ? (
        <div className="border-2 border-dashed border-[#9AA3C8] rounded-md p-10 bg-[#FAFAFC]">
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" id="upload-blur" />
          <label htmlFor="upload-blur" className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-[#414FA8] text-white text-sm font-semibold rounded shadow-sm hover:bg-[#343f88]">
            <Upload className="h-4 w-4" /> Upload Photo
          </label>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <div className="w-full max-w-sm rounded border shadow-sm bg-gray-50 overflow-hidden relative">
              <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Original</span>
              <img src={image} className="w-full h-auto" />
            </div>
            
            {result && (
               <div className="w-full max-w-sm rounded border shadow-sm bg-gray-50 overflow-hidden relative">
                 <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Blurred Background</span>
                 <img src={result} className="w-full h-auto" />
               </div>
            )}
          </div>
          
          {result && (
             <div className="max-w-md mx-auto p-4 bg-gray-50 rounded border">
                <label className="block text-sm font-bold mb-2">Blur Intensity: {blurAmount}px</label>
                <input type="range" min="1" max="40" value={blurAmount} onChange={e => setBlurAmount(Number(e.target.value))} className="w-full" />
             </div>
          )}

          {!result && !isProcessing && (
            <button onClick={processImage} className="px-6 py-3 bg-[#414FA8] text-white font-bold rounded">
              Detect Subject & Blur Background
            </button>
          )}

          {isProcessing && (
            <div className="py-4 space-y-2">
               <div className="flex justify-center items-center gap-2 text-[#414FA8] font-semibold"><Loader2 className="animate-spin w-5 h-5" /> AI Processing ({progress}%)</div>
            </div>
          )}

          {result && (
             <div className="flex justify-center gap-3 mt-4">
               <button onClick={() => {setImage(null); setResult(null); origImgRef.current = null; maskImgRef.current = null;}} className="px-4 py-2 border rounded">Start Over</button>
               <a href={result} download="blur-bg.jpg" className="px-4 py-2 bg-emerald-600 text-white font-bold rounded flex items-center gap-2"><Download className="w-4 h-4" /> Download Result</a>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
