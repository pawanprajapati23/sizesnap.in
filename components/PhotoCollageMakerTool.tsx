'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, Grid, ShieldCheck, X } from 'lucide-react';

export function PhotoCollageMakerTool() {
  const [images, setImages] = useState<{ url: string; file: File }[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [layout, setLayout] = useState<'grid2x2' | 'grid3x3' | 'row' | 'col'>('grid2x2');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => ({
        url: URL.createObjectURL(file),
        file
      }));
      setImages(prev => [...prev, ...newImages]);
    }
  };

  const removeImg = (idx: number) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
  };

  useEffect(() => {
    if (images.length === 0 || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawCollage = async () => {
      // Load all image objects
      const imgObjs = await Promise.all(
        images.map(img => {
          return new Promise<HTMLImageElement>((resolve) => {
            const i = new Image();
            i.onload = () => resolve(i);
            i.src = img.url;
          });
        })
      );

      const PADDING = 10;
      const TARGET_W = 800; // base resolution
      
      let cols = 2;
      let rows = 2;
      
      if (layout === 'grid2x2') {
        cols = 2; rows = Math.ceil(imgObjs.length / 2);
      } else if (layout === 'grid3x3') {
        cols = 3; rows = Math.ceil(imgObjs.length / 3);
      } else if (layout === 'row') {
        cols = imgObjs.length; rows = 1;
      } else if (layout === 'col') {
        cols = 1; rows = imgObjs.length;
      }

      const cellW = (TARGET_W - (PADDING * (cols + 1))) / cols;
      const cellH = cellW; // square cells
      
      canvas.width = TARGET_W;
      canvas.height = (cellH * rows) + (PADDING * (rows + 1));
      
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      imgObjs.forEach((img, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        
        const x = PADDING + c * (cellW + PADDING);
        const y = PADDING + r * (cellH + PADDING);
        
        // simple draw - could add object-fit: cover logic here
        ctx.drawImage(img, x, y, cellW, cellH);
      });
    };
    
    drawCollage();
  }, [images, layout]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/jpeg', 0.9);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'collage.jpg';
    a.click();
  };

  return (
    <div className="w-full space-y-4">
      <div className="border-2 border-dashed border-[#9AA3C8] rounded-md p-6 text-center bg-[#FAFAFC]">
        <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" id="upload-collage" />
        <label htmlFor="upload-collage" className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-[#414FA8] text-white text-xs sm:text-sm font-semibold rounded shadow-sm hover:bg-[#343f88]">
          <Upload className="h-4 w-4" /> Add Photos
        </label>
        <p className="text-xs text-gray-500 mt-2">Select multiple photos to create a collage.</p>
      </div>
      
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
             {images.map((img, i) => (
                <div key={i} className="relative w-16 h-16 rounded overflow-hidden shadow">
                   <img src={img.url} className="w-full h-full object-cover" />
                   <button onClick={() => removeImg(i)} className="absolute top-0 right-0 bg-red-500 text-white rounded-bl p-0.5"><X className="h-3 w-3" /></button>
                </div>
             ))}
          </div>

          <div className="flex gap-2 text-sm">
             <button onClick={() => setLayout('grid2x2')} className={`px-3 py-1 border rounded \${layout === 'grid2x2' ? 'bg-[#414FA8] text-white' : ''}`}>Grid 2x2</button>
             <button onClick={() => setLayout('grid3x3')} className={`px-3 py-1 border rounded \${layout === 'grid3x3' ? 'bg-[#414FA8] text-white' : ''}`}>Grid 3x3</button>
             <button onClick={() => setLayout('row')} className={`px-3 py-1 border rounded \${layout === 'row' ? 'bg-[#414FA8] text-white' : ''}`}>Row</button>
             <button onClick={() => setLayout('col')} className={`px-3 py-1 border rounded \${layout === 'col' ? 'bg-[#414FA8] text-white' : ''}`}>Column</button>
          </div>

          <canvas ref={canvasRef} className="w-full max-w-2xl border shadow-sm mx-auto block"></canvas>

          <button onClick={handleDownload} className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded flex items-center justify-center gap-2">
            <Download className="h-4 w-4" /> Download Collage
          </button>
        </div>
      )}
    </div>
  );
}
