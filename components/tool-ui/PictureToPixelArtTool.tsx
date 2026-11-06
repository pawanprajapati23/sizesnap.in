'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Upload,
  Download,
  Trash2,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Sliders,
  Grid,
  Palette,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { formatBytes } from '@/lib/format-utils';
import { trackProcessingSuccess, trackProcessingError, trackDownload } from '@/lib/firebase';

type PaletteType = 'original' | 'gameboy' | 'arcade' | 'cyberpunk' | 'monochrome';

const GAMEBOY_PALETTE = [
  [15, 56, 15],
  [48, 98, 48],
  [139, 172, 15],
  [155, 188, 15],
];

const ARCADE_PALETTE = [
  [0, 0, 0],
  [255, 255, 255],
  [136, 0, 0],
  [170, 255, 238],
  [204, 68, 204],
  [0, 204, 85],
  [0, 0, 170],
  [238, 238, 119],
  [221, 136, 85],
  [102, 68, 0],
  [255, 119, 119],
  [51, 51, 51],
  [119, 119, 119],
  [170, 255, 102],
  [0, 136, 255],
  [187, 187, 187],
];

const CYBERPUNK_PALETTE = [
  [13, 2, 33],
  [255, 0, 127],
  [0, 240, 255],
  [112, 0, 255],
  [255, 222, 0],
  [255, 255, 255],
];

function findNearestColor(r: number, g: number, b: number, palette: number[][]): number[] {
  let minDistance = Infinity;
  let nearest = palette[0];
  for (const c of palette) {
    const dr = r - c[0];
    const dg = g - c[1];
    const db = b - c[2];
    const dist = dr * dr + dg * dg + db * db;
    if (dist < minDistance) {
      minDistance = dist;
      nearest = c;
    }
  }
  return nearest;
}

export function PictureToPixelArtTool() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Pixel art settings
  const [pixelSize, setPixelSize] = useState<number>(8); // 4, 8, 12, 16, 24, 32
  const [palette, setPalette] = useState<PaletteType>('original');
  const [showGrid, setShowGrid] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const originalImgRef = useRef<HTMLImageElement | null>(null);
  const lastActivityIdRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (originalUrl) URL.revokeObjectURL(originalUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [originalUrl, resultUrl]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WebP).');
      return;
    }
    setImageFile(file);
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    const url = URL.createObjectURL(file);
    setOriginalUrl(url);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      originalImgRef.current = img;
      renderPixelArt(img, pixelSize, palette, showGrid, file.name);
    };
    img.src = url;
  };

  const renderPixelArt = useCallback(
    (
      img: HTMLImageElement,
      blockSize: number,
      selectedPalette: PaletteType,
      grid: boolean,
      filename: string
    ) => {
      setIsProcessing(true);
      try {
        const origW = img.naturalWidth || img.width;
        const origH = img.naturalHeight || img.height;

        // Downsampled dimensions
        const smallW = Math.max(1, Math.floor(origW / blockSize));
        const smallH = Math.max(1, Math.floor(origH / blockSize));

        // 1. Offscreen canvas to downsample
        const smallCanvas = document.createElement('canvas');
        smallCanvas.width = smallW;
        smallCanvas.height = smallH;
        const smallCtx = smallCanvas.getContext('2d');
        if (!smallCtx) return;

        smallCtx.drawImage(img, 0, 0, smallW, smallH);
        const smallImgData = smallCtx.getImageData(0, 0, smallW, smallH);
        const data = smallImgData.data;

        // 2. Palette Quantization
        if (selectedPalette !== 'original') {
          let pal: number[][] = ARCADE_PALETTE;
          if (selectedPalette === 'gameboy') pal = GAMEBOY_PALETTE;
          else if (selectedPalette === 'cyberpunk') pal = CYBERPUNK_PALETTE;
          else if (selectedPalette === 'monochrome') pal = [[0, 0, 0], [255, 255, 255]];

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const nearest = findNearestColor(r, g, b, pal);
            data[i] = nearest[0];
            data[i + 1] = nearest[1];
            data[i + 2] = nearest[2];
          }
          smallCtx.putImageData(smallImgData, 0, 0);
        }

        // 3. Upscale canvas to full size with nearest-neighbor crisp pixels
        const fullCanvas = document.createElement('canvas');
        fullCanvas.width = origW;
        fullCanvas.height = origH;
        const fullCtx = fullCanvas.getContext('2d');
        if (!fullCtx) return;

        fullCtx.imageSmoothingEnabled = false;
        fullCtx.drawImage(smallCanvas, 0, 0, smallW, smallH, 0, 0, origW, origH);

        // 4. Optional Retro Grid overlay
        if (grid) {
          fullCtx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
          fullCtx.lineWidth = 1;
          for (let x = 0; x <= origW; x += blockSize) {
            fullCtx.beginPath();
            fullCtx.moveTo(x, 0);
            fullCtx.lineTo(x, origH);
            fullCtx.stroke();
          }
          for (let y = 0; y <= origH; y += blockSize) {
            fullCtx.beginPath();
            fullCtx.moveTo(0, y);
            fullCtx.lineTo(origW, y);
            fullCtx.stroke();
          }
        }

        fullCanvas.toBlob(
          (blob) => {
            if (!blob) return;
            if (resultUrl) URL.revokeObjectURL(resultUrl);
            const newUrl = URL.createObjectURL(blob);
            setResultUrl(newUrl);
            setResultBlob(blob);
            setIsProcessing(false);

            if (imageFile) {
              trackProcessingSuccess({
                tool: 'picture-to-pixel-art',
                toolName: 'Picture to Pixel Art',
                fileType: 'image',
                inputKb: Math.round(imageFile.size / 1024),
                outputKb: Math.round(blob.size / 1024),
              })
                .then((id) => {
                  if (id) lastActivityIdRef.current = id;
                })
                .catch(() => {});
            }
          },
          'image/png'
        );
      } catch (err: unknown) {
        console.error(err);
        setIsProcessing(false);
        trackProcessingError(
          'picture-to-pixel-art',
          err instanceof Error ? err.message : 'Pixel art rendering error'
        );
      }
    },
    [imageFile, resultUrl]
  );

  useEffect(() => {
    if (originalImgRef.current && imageFile) {
      renderPixelArt(originalImgRef.current, pixelSize, palette, showGrid, imageFile.name);
    }
  }, [pixelSize, palette, showGrid, renderPixelArt, imageFile]);

  const handleDownload = () => {
    if (!resultBlob || !imageFile) return;
    trackDownload('picture-to-pixel-art', lastActivityIdRef.current || undefined);

    const baseName = imageFile.name.replace(/\.[^/.]+$/, '');
    const filename = `${baseName}_pixel_art.png`;

    const a = document.createElement('a');
    a.href = resultUrl!;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyClipboard = async () => {
    if (!resultBlob) return;
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          [resultBlob.type]: resultBlob,
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Could not copy image directly to clipboard on this browser. Please use Download button.');
    }
  };

  const handleReset = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setImageFile(null);
    setOriginalUrl(null);
    setResultUrl(null);
    setResultBlob(null);
    originalImgRef.current = null;
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm p-4 sm:p-6">
      {!imageFile ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0]);
          }}
          className="border-2 border-dashed border-gray-300 hover:border-[#414FA8] rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-gray-50/50 hover:bg-indigo-50/20 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={(e) => {
              if (e.target.files?.[0]) handleFile(e.target.files[0]);
            }}
            className="hidden"
          />
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-indigo-50 flex items-center justify-center text-[#414FA8] group-hover:scale-110 transition-transform shadow-xs">
            <Sparkles className="w-8 h-8" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1">
            Upload Picture to Convert into Pixel Art
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 mb-4 max-w-md mx-auto">
            Turn portraits, game screenshots, and landscapes into retro 8-bit, 16-bit, Game Boy, or arcade pixel art. 100% free and instant.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Private • Zero File Upload
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              {/* Pixel Block Size */}
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-gray-700 flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-gray-500" /> Pixel Size:
                </span>
                <div className="inline-flex rounded-lg border border-gray-300 p-0.5 bg-white">
                  {[
                    { label: 'Tiny (4px)', val: 4 },
                    { label: '8-bit (8px)', val: 8 },
                    { label: 'Retro (16px)', val: 16 },
                    { label: 'Chunky (24px)', val: 24 },
                  ].map((item) => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setPixelSize(item.val)}
                      className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors ${
                        pixelSize === item.val
                          ? 'bg-[#414FA8] text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid Toggle */}
              <button
                type="button"
                onClick={() => setShowGrid(!showGrid)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
                  showGrid
                    ? 'bg-[#414FA8] text-white border-[#414FA8]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                Pixel Grid
              </button>
            </div>

            {/* Retro Color Palette Selector */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-200">
              <span className="font-bold text-xs text-gray-700 flex items-center gap-1 min-w-[70px]">
                <Palette className="w-3.5 h-3.5 text-gray-500" /> Palette:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'original', name: '🎨 Full 24-bit Color' },
                  { id: 'arcade', name: '🕹️ 8-bit Arcade NES' },
                  { id: 'gameboy', name: '👾 Game Boy (4-shade)' },
                  { id: 'cyberpunk', name: '🌆 Cyberpunk Neon' },
                  { id: 'monochrome', name: '🖤 1-bit Monochrome' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPalette(p.id as PaletteType)}
                    className={`px-3 py-1 text-xs font-medium rounded-full border transition-colors ${
                      palette === p.id
                        ? 'bg-indigo-50 border-[#414FA8] text-[#414FA8] font-bold shadow-xs'
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Side by Side Preview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 flex flex-col">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="font-semibold text-gray-700">Original Photo</span>
                <span>{imageFile ? formatBytes(imageFile.size) : ''}</span>
              </div>
              <div className="flex-1 min-h-[220px] max-h-[340px] flex items-center justify-center p-3 bg-white rounded border border-gray-100 overflow-hidden">
                {originalUrl && (
                  <img
                    src={originalUrl}
                    alt="Original"
                    className="max-h-[280px] max-w-full object-contain"
                  />
                )}
              </div>
            </div>

            <div className="border border-indigo-100 rounded-lg p-3 bg-indigo-50/20 flex flex-col">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                <span className="font-semibold text-indigo-950 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#414FA8]" /> 8-Bit Pixel Art Result
                </span>
                <span>{resultBlob ? formatBytes(resultBlob.size) : ''}</span>
              </div>
              <div className="flex-1 min-h-[220px] max-h-[340px] flex items-center justify-center p-3 rounded border border-gray-200 bg-white overflow-hidden">
                {isProcessing ? (
                  <div className="text-center text-gray-400 text-xs py-10 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-[#414FA8]" /> Generating Pixel Art...
                  </div>
                ) : resultUrl ? (
                  <img
                    src={resultUrl}
                    alt="Pixel Art Result"
                    className="max-h-[280px] max-w-full object-contain [image-rendering:pixelated]"
                  />
                ) : null}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Start Over
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyClipboard}
                disabled={!resultBlob}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg shadow-xs transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-gray-500" /> Copy Image
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={!resultBlob}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-[#414FA8] hover:bg-[#323E8F] rounded-lg shadow-sm transition-all"
              >
                <Download className="w-4 h-4" /> Download Pixel Art PNG
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
