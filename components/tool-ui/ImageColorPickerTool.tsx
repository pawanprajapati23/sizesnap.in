'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  FilePlus,
  Trash2,
  Copy,
  Check,
  Pipette,
  Palette,
  Sparkles,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface ColorData {
  hex: string;
  rgb: string;
  hsl: string;
  cmyk: string;
  r: number;
  g: number;
  b: number;
}

export function ImageColorPickerTool() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<ColorData | null>(null);
  const [hoverColor, setHoverColor] = useState<ColorData | null>(null);
  const [colorHistory, setColorHistory] = useState<ColorData[]>([]);
  const [dominantColors, setDominantColors] = useState<string[]>([]);
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper: RGB to HEX
  const rgbToHex = (r: number, g: number, b: number): string => {
    return (
      '#' +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? '0' + hex : hex;
        })
        .join('')
        .toUpperCase()
    );
  };

  // Helper: RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number): string => {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rn:
          h = (gn - bn) / d + (gn < bn ? 6 : 0);
          break;
        case gn:
          h = (bn - rn) / d + 2;
          break;
        case bn:
          h = (rn - gn) / d + 4;
          break;
      }
      h /= 6;
    }
    return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
  };

  // Helper: RGB to CMYK
  const rgbToCmyk = (r: number, g: number, b: number): string => {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const k = 1 - Math.max(rn, gn, bn);
    if (k === 1) return 'cmyk(0%, 0%, 0%, 100%)';
    const c = (1 - rn - k) / (1 - k);
    const m = (1 - gn - k) / (1 - k);
    const y = (1 - bn - k) / (1 - k);
    return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
  };

  const createColorData = (r: number, g: number, b: number): ColorData => {
    return {
      r,
      g,
      b,
      hex: rgbToHex(r, g, b),
      rgb: `rgb(${r}, ${g}, ${b})`,
      hsl: rgbToHsl(r, g, b),
      cmyk: rgbToCmyk(r, g, b),
    };
  };

  // Extract Dominant Colors by sampling
  const extractDominantPalette = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const { width, height } = canvas;
      const step = Math.max(1, Math.floor(Math.min(width, height) / 30));
      const colorCounts: { [hex: string]: number } = {};

      const imgData = ctx.getImageData(0, 0, width, height).data;
      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const idx = (y * width + x) * 4;
          const a = imgData[idx + 3];
          if (a < 128) continue; // skip transparent

          const r = Math.round(imgData[idx] / 16) * 16;
          const g = Math.round(imgData[idx + 1] / 16) * 16;
          const b = Math.round(imgData[idx + 2] / 16) * 16;
          const hex = rgbToHex(Math.min(255, r), Math.min(255, g), Math.min(255, b));
          colorCounts[hex] = (colorCounts[hex] || 0) + 1;
        }
      }

      const sorted = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([hex]) => hex);

      setDominantColors(sorted);
    } catch {
      // ignore
    }
  };

  const processFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setImageSrc(url);
        setImageName(file.name);

        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            extractDominantPalette(canvas);

            // Default pick center pixel
            const cx = Math.floor(img.naturalWidth / 2);
            const cy = Math.floor(img.naturalHeight / 2);
            const pixel = ctx.getImageData(cx, cy, 1, 1).data;
            const centerColor = createColorData(pixel[0], pixel[1], pixel[2]);
            setSelectedColor(centerColor);
            setColorHistory([centerColor]);
          }
        }
      };
      img.onerror = () => setErrorMsg('Failed to render image on canvas.');
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const clearAll = () => {
    setImageSrc(null);
    setImageName('');
    setSelectedColor(null);
    setHoverColor(null);
    setColorHistory([]);
    setDominantColors([]);
    setErrorMsg(null);
  };

  // Canvas picking coordinates
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    return { x: Math.max(0, Math.min(canvas.width - 1, x)), y: Math.max(0, Math.min(canvas.height - 1, y)) };
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    if (!coords || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    try {
      const p = ctx.getImageData(coords.x, coords.y, 1, 1).data;
      setHoverColor(createColorData(p[0], p[1], p[2]));
    } catch {
      // ignore
    }
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    if (!coords || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    try {
      const p = ctx.getImageData(coords.x, coords.y, 1, 1).data;
      const picked = createColorData(p[0], p[1], p[2]);
      setSelectedColor(picked);

      // Add to history (limit 12, avoid duplicate immediate)
      setColorHistory((prev) => {
        const filtered = prev.filter((c) => c.hex !== picked.hex);
        return [picked, ...filtered].slice(0, 12);
      });
    } catch {
      // ignore
    }
  };

  const copyValue = async (format: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 2000);
    }
  };

  // Convert hex to ColorData
  const pickFromHex = (hex: string) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    const data = createColorData(r, g, b);
    setSelectedColor(data);
    setColorHistory((prev) => [data, ...prev.filter((c) => c.hex !== data.hex)].slice(0, 12));
  };

  const displayColor = hoverColor || selectedColor || {
    hex: '#414FA8',
    rgb: 'rgb(65, 79, 168)',
    hsl: 'hsl(232, 44%, 46%)',
    cmyk: 'cmyk(61%, 53%, 0%, 34%)',
    r: 65,
    g: 79,
    b: 168,
  };

  return (
    <div className="space-y-5">
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[4px]">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <p className="flex-1">{errorMsg}</p>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-xs font-semibold text-red-800 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Upload Dropzone */}
      {!imageSrc ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[4px] border-2 border-dashed border-[#9AA3C8] bg-[#FAFAFC] hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-colors cursor-pointer select-none"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.webp"
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            className="sr-only"
          />
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-4">
            <Pipette className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Select or Drag an Image to Pick Colors
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Click on any pixel to extract HEX, RGB, HSL, and CMYK color codes. Inspect dominant image palettes and recent color history.
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs sm:text-sm font-semibold rounded-[4px] shadow-xs transition-colors"
          >
            <FilePlus className="h-4 w-4" />
            <span>Select Image File</span>
          </button>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
            <span>Pixel-accurate color sampling</span>
            <span>•</span>
            <span>HEX, RGB, HSL, CMYK</span>
            <span>•</span>
            <span>100% Client-Side</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-[4px] border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div
                className="h-10 w-10 rounded border border-gray-300 shadow-xs shrink-0 transition-colors"
                style={{ backgroundColor: displayColor.hex }}
              />
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate max-w-xs sm:max-w-md" title={imageName}>
                  {imageName}
                </h3>
                <p className="text-[11px] text-gray-500 font-mono">
                  Active Color: <span className="font-bold text-[#414FA8]">{displayColor.hex}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#9AA3C8] hover:border-[#414FA8] bg-white hover:bg-[#EEF1FB] text-[#414FA8] text-xs font-semibold transition-colors"
              >
                <FilePlus className="h-3.5 w-3.5" />
                <span>Change Image</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.jpg,.jpeg,.png,.webp"
                onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                className="sr-only"
              />

              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Color Values & Copy Bar */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <Pipette className="h-3.5 w-3.5 text-[#414FA8]" />
                <span>Selected Color Formats</span>
              </span>
              <span className="text-[11px] text-gray-400">
                Hover or click image to sample colors
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'HEX', val: displayColor.hex },
                { label: 'RGB', val: displayColor.rgb },
                { label: 'HSL', val: displayColor.hsl },
                { label: 'CMYK', val: displayColor.cmyk },
              ].map((fmt) => (
                <div
                  key={fmt.label}
                  className="p-2.5 rounded border border-gray-200 bg-[#FAFAFC] flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">
                      {fmt.label}
                    </span>
                    <span className="text-xs font-mono font-semibold text-gray-800 truncate block">
                      {fmt.val}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyValue(fmt.label, fmt.val)}
                    className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors shrink-0"
                    title={`Copy ${fmt.label}`}
                  >
                    {copiedFormat === fmt.label ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Canvas Viewport */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Click Image to Pick Exact Color
              </span>
              <span className="text-[11px] text-gray-400">
                Crosshair cursor active
              </span>
            </div>

            <div className="flex justify-center bg-[#1E202A] p-2 sm:p-4 rounded overflow-auto select-none max-h-[500px]">
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseMove={handleCanvasMouseMove}
                onMouseLeave={() => setHoverColor(null)}
                className="cursor-crosshair max-w-full h-auto block rounded shadow-xs"
              />
            </div>
          </div>

          {/* Dominant Palette & History */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Dominant Colors */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Dominant Palette
                </h4>
              </div>

              {dominantColors.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {dominantColors.map((hex) => (
                    <button
                      key={hex}
                      type="button"
                      onClick={() => pickFromHex(hex)}
                      className="group flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <div
                        className="h-10 w-10 rounded border border-gray-300 shadow-2xs group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: hex }}
                      />
                      <span className="text-[10px] font-mono text-gray-600 group-hover:text-[#414FA8]">
                        {hex}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Calculating palette...</p>
              )}
            </div>

            {/* Picked History */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2">
                <Palette className="h-3.5 w-3.5 text-[#414FA8]" />
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Color History ({colorHistory.length})
                </h4>
              </div>

              {colorHistory.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {colorHistory.map((item, idx) => (
                    <button
                      key={`${item.hex}-${idx}`}
                      type="button"
                      onClick={() => setSelectedColor(item)}
                      className="group flex flex-col items-center gap-1 cursor-pointer"
                    >
                      <div
                        className="h-10 w-10 rounded border border-gray-300 shadow-2xs group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: item.hex }}
                      />
                      <span className="text-[10px] font-mono text-gray-600 group-hover:text-[#414FA8]">
                        {item.hex}
                      </span>
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Click pixels on the image to build a history.</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Pixel reading executed 100% locally on canvas. Your images remain private.</span>
          </div>
        </div>
      )}
    </div>
  );
}
