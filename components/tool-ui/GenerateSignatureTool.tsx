'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Download, Eraser, Palette, Settings2 } from 'lucide-react';

const INK_COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'Blue', value: '#0000CD' },
  { name: 'Navy', value: '#000080' },
  { name: 'Red', value: '#DC143C' },
];

export function GenerateSignatureTool() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isDrawing, setIsDrawing] = useState(false);
  const [inkColor, setInkColor] = useState(INK_COLORS[0].value);
  const [penSize, setPenSize] = useState(3);
  const [isEmpty, setIsEmpty] = useState(true);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Set canvas dimensions to match container exactly
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set line styles for smooth drawing
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getCoordinates = (e: React.PointerEvent<HTMLCanvasElement> | PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const rect = canvas.getBoundingClientRect();
    // Calculate precise coordinates relative to the canvas
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getCoordinates(e);
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    
    setIsDrawing(true);
    setIsEmpty(false);
    
    // Capture pointer events even if they move outside canvas slightly
    canvas.setPointerCapture(e.pointerId);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const { x, y } = getCoordinates(e);

    ctx.lineTo(x, y);
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = penSize;
    ctx.stroke();
  };

  const stopDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.releasePointerCapture(e.pointerId);
    }
    
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  };

  const handleDownload = (format: 'png' | 'jpg') => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return;

    let downloadUrl = '';

    if (format === 'jpg') {
        // Create a temporary canvas to fill white background
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
            tempCtx.fillStyle = '#FFFFFF';
            tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(canvas, 0, 0);
            downloadUrl = tempCanvas.toDataURL('image/jpeg', 1.0);
        }
    } else {
        // Transparent PNG
        downloadUrl = canvas.toDataURL('image/png');
    }

    if (downloadUrl) {
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `signature_${Date.now()}.${format}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left: Canvas Area */}
      <div className="lg:col-span-8 flex flex-col space-y-3">
        <div 
          className="w-full flex items-center justify-between text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-2 rounded-t border-x border-t border-gray-200"
        >
            <span>Draw Your Signature Below</span>
            <button 
                onClick={clearSignature}
                className="flex items-center gap-1 text-red-600 hover:text-red-700 transition-colors bg-white px-2 py-1 rounded border border-red-200"
            >
                <Eraser className="w-3.5 h-3.5" /> Clear
            </button>
        </div>
        
        <div 
            ref={containerRef}
            className="w-full h-[300px] sm:h-[400px] bg-white border border-gray-300 rounded-b shadow-sm relative overflow-hidden"
            style={{ touchAction: 'none' }} // Prevent scrolling when drawing on touch devices
        >
            {isEmpty && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-30 select-none">
                    <span className="text-4xl text-gray-300 font-serif rotate-[-10deg]">Sign Here</span>
                </div>
            )}
            
            <canvas
                ref={canvasRef}
                onPointerDown={startDrawing}
                onPointerMove={draw}
                onPointerUp={stopDrawing}
                onPointerCancel={stopDrawing}
                onPointerOut={stopDrawing}
                className="absolute inset-0 cursor-crosshair z-10 w-full h-full"
            />
        </div>
      </div>

      {/* Right: Settings & Actions */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-5">
            <div>
                <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1.5 mb-3">
                    <Palette className="w-4 h-4" /> Ink Color
                </h3>
                <div className="flex gap-3">
                    {INK_COLORS.map(c => (
                        <button
                            key={c.name}
                            onClick={() => setInkColor(c.value)}
                            title={c.name}
                            className={`w-8 h-8 rounded-full border-2 transition-transform shadow-xs ${inkColor === c.value ? 'scale-110 border-gray-400 ring-2 ring-gray-200 ring-offset-1' : 'border-white/50'}`}
                            style={{ backgroundColor: c.value }}
                        />
                    ))}
                </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
                <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1.5 mb-2">
                    <Settings2 className="w-4 h-4" /> Pen Thickness
                </h3>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-500 font-medium w-6 text-right">{penSize}px</span>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={penSize}
                        onChange={(e) => setPenSize(Number(e.target.value))}
                        className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#414FA8]"
                    />
                </div>
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-2.5">
                <h3 className="font-bold text-sm text-gray-800 mb-2">
                    Download
                </h3>
                
                <button
                    onClick={() => handleDownload('png')}
                    disabled={isEmpty}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-semibold text-sm rounded shadow-sm transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Transparent Background (PNG)
                </button>
                
                <button
                    onClick={() => handleDownload('jpg')}
                    disabled={isEmpty}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white border border-[#414FA8] hover:bg-[#EEF1FB] text-[#414FA8] disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-white font-semibold text-sm rounded transition-colors"
                >
                    <Download className="w-4 h-4" />
                    White Background (JPG)
                </button>
            </div>
        </div>
      </div>
      
    </div>
  );
}
