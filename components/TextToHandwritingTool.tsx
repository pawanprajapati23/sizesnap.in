'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Download, Edit3, Settings2, Palette } from 'lucide-react';
import Head from 'next/head';

const FONTS = [
  { name: 'Caveat', family: "'Caveat', cursive" },
  { name: 'Indie Flower', family: "'Indie Flower', cursive" },
  { name: 'Dancing Script', family: "'Dancing Script', cursive" },
  { name: 'Shadows Into Light', family: "'Shadows Into Light', cursive" },
  { name: 'Permanent Marker', family: "'Permanent Marker', cursive" }
];

const COLORS = [
  { name: 'Blue Pen', hex: '#1e3a8a' }, // deep blue
  { name: 'Black Pen', hex: '#111827' }, // near black
  { name: 'Red Pen', hex: '#991b1b' }, // deep red
];

const PAPER_TYPES = [
  { id: 'blank', name: 'Blank Paper' },
  { id: 'ruled', name: 'Ruled (Lines)' },
];

function HandwritingToolContent() {
  const [text, setText] = useState<string>("Write your text here...\nIt will instantly convert to realistic handwriting.");
  const [fontFamily, setFontFamily] = useState<string>("'Caveat', cursive");
  const [fontSize, setFontSize] = useState<number>(32);
  const [inkColor, setInkColor] = useState<string>('#1e3a8a');
  const [paperType, setPaperType] = useState<string>('ruled');
  const [lineHeight, setLineHeight] = useState<number>(1.5);
  const [fontsLoaded, setFontsLoaded] = useState<boolean>(false);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Load Google Fonts dynamically
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Caveat:wght@400;600&family=Dancing+Script:wght@400;600&family=Indie+Flower&family=Permanent+Marker&family=Shadows+Into+Light&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Wait a bit for fonts to load before initial render
    setTimeout(() => {
        setFontsLoaded(true);
    }, 1000);

    return () => {
        document.head.removeChild(link);
    };
  }, []);

  const drawCanvas = React.useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // A4 Aspect Ratio roughly (width: 800, height: 1130)
    canvas.width = 800;
    canvas.height = 1130;
    
    // Draw Paper Background
    ctx.fillStyle = '#fdfcf0'; // Slightly yellowish warm paper color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (paperType === 'ruled') {
        // Draw left margin line (Red)
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(220, 38, 38, 0.4)'; // Light red
        ctx.lineWidth = 2;
        ctx.moveTo(100, 0);
        ctx.lineTo(100, canvas.height);
        ctx.stroke();

        // Draw horizontal lines (Blue)
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(59, 130, 246, 0.3)'; // Light blue
        ctx.lineWidth = 1;
        const lineSpacing = fontSize * lineHeight;
        const startY = 150; // top margin
        
        for (let y = startY; y < canvas.height; y += lineSpacing) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.stroke();
    }

    // Draw Text
    ctx.fillStyle = inkColor;
    ctx.font = `${fontSize}px ${fontFamily}`;
    ctx.textBaseline = 'bottom';
    
    const lines = text.split('\n');
    const lineSpacing = fontSize * lineHeight;
    let currentY = paperType === 'ruled' ? 150 : 100;
    const startX = paperType === 'ruled' ? 120 : 60; // 20px padding after margin
    const maxWidth = canvas.width - startX - 40;

    for (const rawLine of lines) {
        // Simple word wrap
        const words = rawLine.split(' ');
        let currentLine = '';

        for (let n = 0; n < words.length; n++) {
            const testLine = currentLine + words[n] + ' ';
            const metrics = ctx.measureText(testLine);
            const testWidth = metrics.width;
            
            if (testWidth > maxWidth && n > 0) {
                // Introduce slight random jitter for realistic handwriting
                const jitterY = (Math.random() - 0.5) * 2;
                ctx.fillText(currentLine, startX, currentY + jitterY);
                currentLine = words[n] + ' ';
                currentY += lineSpacing;
            } else {
                currentLine = testLine;
            }
        }
        const jitterY = (Math.random() - 0.5) * 2;
        ctx.fillText(currentLine, startX, currentY + jitterY);
        currentY += lineSpacing;
    }

  }, [text, fontFamily, fontSize, inkColor, paperType, lineHeight]);

  useEffect(() => {
    if (fontsLoaded) {
        drawCanvas();
    }
  }, [drawCanvas, fontsLoaded]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/jpeg', 0.9);
    const a = document.createElement('a');
    a.href = url;
    a.download = `handwriting_${Date.now()}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Settings & Input Area */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* Text Input */}
        <div className="bg-white p-4 rounded border border-gray-200 shadow-xs">
            <h3 className="font-bold text-sm text-gray-800 mb-2 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4" /> Your Text
            </h3>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full h-48 p-3 text-sm border border-gray-200 rounded bg-gray-50 focus:ring-1 focus:ring-[#414FA8] focus:border-[#414FA8] outline-none resize-none"
                placeholder="Type or paste your text here..."
            />
        </div>

        {/* Settings */}
        <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-4">
            <h3 className="font-bold text-sm text-gray-800 flex items-center gap-1.5 border-b border-gray-200 pb-2">
                <Settings2 className="w-4 h-4" /> Options
            </h3>
            
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Handwriting Style</label>
                <select
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded outline-none focus:border-[#414FA8]"
                >
                    {FONTS.map(f => <option key={f.name} value={f.family}>{f.name}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Font Size</label>
                    <input
                        type="number"
                        min="16"
                        max="72"
                        value={fontSize}
                        onChange={(e) => setFontSize(Number(e.target.value))}
                        className="w-full p-2 text-sm border border-gray-300 rounded outline-none focus:border-[#414FA8]"
                    />
                </div>
                <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">Spacing</label>
                    <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="3"
                        value={lineHeight}
                        onChange={(e) => setLineHeight(Number(e.target.value))}
                        className="w-full p-2 text-sm border border-gray-300 rounded outline-none focus:border-[#414FA8]"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1">
                    <Palette className="w-3.5 h-3.5" /> Ink Color
                </label>
                <div className="flex gap-2">
                    {COLORS.map(c => (
                        <button
                            key={c.name}
                            onClick={() => setInkColor(c.hex)}
                            title={c.name}
                            className={`w-8 h-8 rounded-full border-2 transition-transform ${inkColor === c.hex ? 'scale-110 border-gray-400 shadow-md' : 'border-transparent'}`}
                            style={{ backgroundColor: c.hex }}
                        />
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Paper Type</label>
                <div className="flex gap-2 text-xs">
                    {PAPER_TYPES.map(p => (
                        <button
                            key={p.id}
                            onClick={() => setPaperType(p.id)}
                            className={`flex-1 py-1.5 rounded border font-medium transition-colors ${
                                paperType === p.id ? 'bg-[#414FA8] text-white border-[#414FA8]' : 'bg-white text-gray-700 border-gray-300'
                            }`}
                        >
                            {p.name}
                        </button>
                    ))}
                </div>
            </div>

            <button
                onClick={handleDownload}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-[#414FA8] hover:bg-[#343f88] text-white text-sm font-semibold py-2.5 rounded shadow-sm transition-all"
            >
                <Download className="w-4 h-4" /> Download Image
            </button>
        </div>
      </div>

      {/* Right Canvas Area */}
      <div className="lg:col-span-8 bg-gray-200 border border-gray-300 rounded p-4 sm:p-8 flex items-start justify-center min-h-[600px] overflow-auto">
        {!fontsLoaded && (
            <div className="flex items-center justify-center h-full w-full absolute top-0 left-0 bg-white/50 z-10">
                <span className="text-sm font-medium text-gray-600 animate-pulse">Loading Fonts...</span>
            </div>
        )}
        <canvas
            ref={canvasRef}
            className="w-full max-w-[600px] h-auto shadow-md border border-gray-300 bg-white"
        />
      </div>
    </div>
  );
}

export function TextToHandwritingTool() {
    return (
        <Suspense fallback={<div className="h-40 flex items-center justify-center">Loading...</div>}>
            <HandwritingToolContent />
        </Suspense>
    );
}
