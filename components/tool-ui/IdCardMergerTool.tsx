'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PDFDocument } from 'pdf-lib';
import { formatBytes } from '@/lib/format-utils';
import { padJpegBlob } from '@/lib/image-padding';
import {
  Upload,
  CreditCard,
  Download,
  Printer,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  FileText,
  Image as ImageIcon,
  Sliders,
} from 'lucide-react';

type LayoutMode = 'a4-portrait' | 'compact-vertical' | 'compact-horizontal';
type OutputType = 'jpg' | 'pdf';

interface SideImage {
  file: File;
  url: string;
  width: number;
  height: number;
  rotation: number;
}

interface MergedOutput {
  blob: Blob;
  url: string;
  size: number;
  width: number;
  height: number;
  outputType: OutputType;
  filename: string;
  previewImageUrl: string;
}

const KB_TARGETS = [50, 100, 150, 200, 300];

export function IdCardMergerTool() {
  const [frontImg, setFrontImg] = useState<SideImage | null>(null);
  const [backImg, setBackImg] = useState<SideImage | null>(null);
  const [layout, setLayout] = useState<LayoutMode>('compact-vertical');
  const [outputType, setOutputType] = useState<OutputType>('jpg');
  const [targetKb, setTargetKb] = useState<number>(100);
  const [addBorder, setAddBorder] = useState<boolean>(true);
  const [cleanScanMode, setCleanScanMode] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [result, setResult] = useState<MergedOutput | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const urlsRef = useRef<string[]>([]);

  const registerUrl = useCallback((u: string) => {
    urlsRef.current.push(u);
    return u;
  }, []);

  useEffect(() => {
    const urls = urlsRef.current;
    return () => {
      urls.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {
          // ignore
        }
      });
    };
  }, []);

  const handleSideUpload = (side: 'front' | 'back', file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please upload a valid JPG, PNG, or WebP image file.');
      return;
    }
    setErrorMsg(null);
    setResult(null);

    const url = registerUrl(URL.createObjectURL(file));
    const img = new Image();
    img.onload = () => {
      const data: SideImage = {
        file,
        url,
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        rotation: 0,
      };
      if (side === 'front') setFrontImg(data);
      else setBackImg(data);
    };
    img.onerror = () => {
      setErrorMsg('Could not read the selected image file.');
    };
    img.src = url;
  };

  const rotateSide = (side: 'front' | 'back') => {
    setResult(null);
    if (side === 'front' && frontImg) {
      setFrontImg({ ...frontImg, rotation: (frontImg.rotation + 90) % 360 });
    } else if (side === 'back' && backImg) {
      setBackImg({ ...backImg, rotation: (backImg.rotation + 90) % 360 });
    }
  };

  const loadHtmlImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });

  // Draw a rotated image onto a temporary canvas and return it
  const createOrientedCanvas = (img: HTMLImageElement, rotation: number): HTMLCanvasElement => {
    const temp = document.createElement('canvas');
    const isSideways = rotation === 90 || rotation === 270;
    temp.width = isSideways ? img.naturalHeight : img.naturalWidth;
    temp.height = isSideways ? img.naturalWidth : img.naturalHeight;
    const tCtx = temp.getContext('2d')!;
    tCtx.translate(temp.width / 2, temp.height / 2);
    tCtx.rotate((rotation * Math.PI) / 180);
    tCtx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    return temp;
  };

  const handleMerge = async () => {
    if (!frontImg || !backImg) {
      setErrorMsg('Please upload both Front Side and Back Side images of your ID Card first.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);
    await new Promise((r) => setTimeout(r, 40));

    try {
      const [fRaw, bRaw] = await Promise.all([
        loadHtmlImage(frontImg.url),
        loadHtmlImage(backImg.url),
      ]);

      const fCanvas = createOrientedCanvas(fRaw, frontImg.rotation);
      const bCanvas = createOrientedCanvas(bRaw, backImg.rotation);

      // Standard CR80 ID card aspect ratio is 85.6mm x 54mm (~1.585)
      const cardW = 1011; // ~85.6mm at 300 DPI
      const cardH = 638;  // ~54.0mm at 300 DPI

      let canvasW = 1200;
      let canvasH = 1500;

      if (layout === 'a4-portrait') {
        // A4 at 200 DPI: 1654 x 2339 px
        canvasW = 1654;
        canvasH = 2339;
      } else if (layout === 'compact-vertical') {
        canvasW = cardW + 80;
        canvasH = cardH * 2 + 120;
      } else {
        // compact-horizontal
        canvasW = cardW * 2 + 120;
        canvasH = cardH + 80;
      }

      const renderMergedCanvas = (scale: number): HTMLCanvasElement => {
        const w = Math.max(300, Math.round(canvasW * scale));
        const h = Math.max(300, Math.round(canvasH * scale));
        const cW = Math.round(cardW * scale);
        const cH = Math.round(cardH * scale);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, w, h);

        if (cleanScanMode) {
          ctx.filter = 'contrast(1.14) brightness(1.04) saturate(1.02)';
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        const drawCardSlot = (src: HTMLCanvasElement, x: number, y: number, slotW: number, slotH: number) => {
          // Fit inside slot while maintaining card look
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(x, y, slotW, slotH);
          ctx.drawImage(src, x, y, slotW, slotH);

          if (addBorder) {
            ctx.save();
            ctx.filter = 'none';
            ctx.strokeStyle = '#94A3B8';
            ctx.lineWidth = Math.max(1.5, Math.round(2 * scale));
            ctx.strokeRect(x, y, slotW, slotH);
            ctx.restore();
          }
        };

        if (layout === 'a4-portrait') {
          const x = Math.round((w - cW) / 2);
          const topY = Math.round(180 * scale);
          const bottomY = topY + cH + Math.round(110 * scale);
          drawCardSlot(fCanvas, x, topY, cW, cH);
          drawCardSlot(bCanvas, x, bottomY, cW, cH);
        } else if (layout === 'compact-vertical') {
          const pad = Math.round(40 * scale);
          const x = Math.round((w - cW) / 2);
          drawCardSlot(fCanvas, x, pad, cW, cH);
          drawCardSlot(bCanvas, x, pad * 2 + cH, cW, cH);
        } else {
          const pad = Math.round(40 * scale);
          const y = Math.round((h - cH) / 2);
          drawCardSlot(fCanvas, pad, y, cW, cH);
          drawCardSlot(bCanvas, pad * 2 + cW, y, cW, cH);
        }

        return canvas;
      };

      const canvasToBlobAsync = (c: HTMLCanvasElement, q: number) =>
        new Promise<Blob | null>((resolve) => c.toBlob((b) => resolve(b), 'image/jpeg', q));

      const maxBytes = targetKb * 1024;
      // Leave ~4KB overhead when wrapping inside PDF
      const jpegBudgetBytes = outputType === 'pdf' ? Math.max(10240, maxBytes - 4500) : maxBytes;
      const minDesiredBytes = Math.max(8192, Math.floor(jpegBudgetBytes * 0.85));

      let activeCanvas = renderMergedCanvas(1);
      let bestJpeg: Blob | null = null;

      // Binary search quality first, then scale down if needed for strict 50KB/100KB targets
      for (const scaleStep of [1, 0.85, 0.72, 0.6]) {
        activeCanvas = renderMergedCanvas(scaleStep);
        let low = 0.25;
        let high = 0.95;
        let candidateBest: Blob | null = null;

        for (let i = 0; i < 7; i++) {
          const mid = (low + high) / 2;
          const b = await canvasToBlobAsync(activeCanvas, mid);
          if (!b) break;
          if (b.size <= jpegBudgetBytes) {
            candidateBest = b;
            low = mid;
          } else {
            high = mid;
          }
        }

        if (candidateBest) {
          bestJpeg = candidateBest;
          break;
        }
      }

      if (!bestJpeg) {
        bestJpeg = await canvasToBlobAsync(activeCanvas, 0.2);
      }

      if (!bestJpeg) {
        throw new Error('Could not generate merged ID card image.');
      }

      if (outputType === 'jpg' && bestJpeg.size < minDesiredBytes) {
        bestJpeg = await padJpegBlob(bestJpeg, minDesiredBytes);
      }

      const previewImageUrl = registerUrl(URL.createObjectURL(bestJpeg));

      if (outputType === 'pdf') {
        const pdfDoc = await PDFDocument.create();
        const jpgBytes = await bestJpeg.arrayBuffer();
        const embeddedJpg = await pdfDoc.embedJpg(jpgBytes);

        // Standard A4 points (595.28 x 841.89) or proportional page
        const pageW = layout === 'compact-horizontal' ? 841.89 : 595.28;
        const pageH = layout === 'compact-horizontal' ? 595.28 : 841.89;
        const page = pdfDoc.addPage([pageW, pageH]);

        const imgRatio = activeCanvas.width / activeCanvas.height;
        const margin = 24;
        const availW = pageW - margin * 2;
        const availH = pageH - margin * 2;

        let drawW = availW;
        let drawH = drawW / imgRatio;
        if (drawH > availH) {
          drawH = availH;
          drawW = drawH * imgRatio;
        }

        const drawX = (pageW - drawW) / 2;
        const drawY = pageH - drawH - margin;

        page.drawImage(embeddedJpg, {
          x: drawX,
          y: drawY,
          width: drawW,
          height: drawH,
        });

        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
        const pdfUrl = registerUrl(URL.createObjectURL(pdfBlob));

        setResult({
          blob: pdfBlob,
          url: pdfUrl,
          size: pdfBlob.size,
          width: activeCanvas.width,
          height: activeCanvas.height,
          outputType: 'pdf',
          filename: `id-card-front-back-${targetKb}kb-sizesnap.pdf`,
          previewImageUrl,
        });
      } else {
        setResult({
          blob: bestJpeg,
          url: previewImageUrl,
          size: bestJpeg.size,
          width: activeCanvas.width,
          height: activeCanvas.height,
          outputType: 'jpg',
          filename: `id-card-front-back-${targetKb}kb-sizesnap.jpg`,
          previewImageUrl,
        });
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to merge ID card images.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = result.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrint = () => {
    if (!result) return;
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) return;
    doc.open();
    doc.write(`
      <html>
        <head><title>Print ID Card Front & Back</title></head>
        <body style="margin:0;display:flex;justify-content:center;align-items:flex-start;">
          <img src="${result.previewImageUrl}" style="max-width:100%;height:auto;" onload="window.print();setTimeout(()=>window.frameElement.remove(),500);" />
        </body>
      </html>
    `);
    doc.close();
  };

  const handleReset = () => {
    setFrontImg(null);
    setBackImg(null);
    setResult(null);
    setErrorMsg(null);
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

      {/* Dual Upload Cards: Front Side & Back Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Front Side Box */}
        <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#414FA8] text-white text-[11px] font-bold">
                1
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                Front Side (Aadhaar / PAN / Voter ID)
              </h3>
            </div>
            {frontImg && (
              <button
                type="button"
                onClick={() => rotateSide('front')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#414FA8] hover:underline"
              >
                <RotateCw className="h-3.5 w-3.5" /> Rotate 90°
              </button>
            )}
          </div>

          <input
            ref={frontInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleSideUpload('front', e.target.files?.[0])}
          />

          {frontImg ? (
            <div className="space-y-3">
              <div className="relative h-44 w-full rounded border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={frontImg.url}
                  alt="Front Side Preview"
                  style={{ transform: `rotate(${frontImg.rotation}deg)` }}
                  className="max-h-full max-w-full object-contain transition-transform"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="truncate max-w-[180px] font-medium">{frontImg.file.name}</span>
                <button
                  type="button"
                  onClick={() => frontInputRef.current?.click()}
                  className="text-[#414FA8] font-semibold hover:underline"
                >
                  Change Front Photo
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => frontInputRef.current?.click()}
              className="h-44 w-full rounded-[4px] border-2 border-dashed border-[#9AA3C8] bg-[#F8FAFF] hover:bg-[#EEF1FB]/60 transition-colors flex flex-col items-center justify-center p-4 text-center cursor-pointer"
            >
              <Upload className="h-7 w-7 text-[#414FA8] mb-2" />
              <span className="text-xs sm:text-sm font-bold text-gray-800">
                Upload ID Card Front Side
              </span>
              <span className="text-[11px] text-gray-500 mt-1">
                JPG, PNG, or WebP • 100% Private Browser Processing
              </span>
            </button>
          )}
        </div>

        {/* Back Side Box */}
        <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#414FA8] text-white text-[11px] font-bold">
                2
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                Back Side (Address / QR Side)
              </h3>
            </div>
            {backImg && (
              <button
                type="button"
                onClick={() => rotateSide('back')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#414FA8] hover:underline"
              >
                <RotateCw className="h-3.5 w-3.5" /> Rotate 90°
              </button>
            )}
          </div>

          <input
            ref={backInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => handleSideUpload('back', e.target.files?.[0])}
          />

          {backImg ? (
            <div className="space-y-3">
              <div className="relative h-44 w-full rounded border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={backImg.url}
                  alt="Back Side Preview"
                  style={{ transform: `rotate(${backImg.rotation}deg)` }}
                  className="max-h-full max-w-full object-contain transition-transform"
                />
              </div>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="truncate max-w-[180px] font-medium">{backImg.file.name}</span>
                <button
                  type="button"
                  onClick={() => backInputRef.current?.click()}
                  className="text-[#414FA8] font-semibold hover:underline"
                >
                  Change Back Photo
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => backInputRef.current?.click()}
              className="h-44 w-full rounded-[4px] border-2 border-dashed border-[#9AA3C8] bg-[#F8FAFF] hover:bg-[#EEF1FB]/60 transition-colors flex flex-col items-center justify-center p-4 text-center cursor-pointer"
            >
              <Upload className="h-7 w-7 text-[#414FA8] mb-2" />
              <span className="text-xs sm:text-sm font-bold text-gray-800">
                Upload ID Card Back Side
              </span>
              <span className="text-[11px] text-gray-500 mt-1">
                JPG, PNG, or WebP • Combine Front &amp; Back on 1 Page
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Layout, Output Format & Target KB Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
          <Sliders className="h-4 w-4 text-[#414FA8]" />
          <h3 className="text-sm font-bold text-gray-900">
            Page Layout, Output Format &amp; Target KB Size
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Layout Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 block">
              1. Arrangement Layout:
            </label>
            <div className="space-y-1.5">
              {(
                [
                  {
                    id: 'compact-vertical',
                    title: 'Top & Bottom (Compact Upload)',
                    desc: 'Best for SSC, UPSC, Bank & KYC form uploads',
                  },
                  {
                    id: 'a4-portrait',
                    title: 'A4 Page (True ID Size for Xerox/Print)',
                    desc: 'Standard cyber-cafe A4 photocopy layout',
                  },
                  {
                    id: 'compact-horizontal',
                    title: 'Side-by-Side (Left & Right)',
                    desc: 'Landscape side-by-side ID proof card',
                  },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    setLayout(opt.id);
                    setResult(null);
                  }}
                  className={`w-full text-left p-2.5 rounded-[4px] border transition-all ${
                    layout === opt.id
                      ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8]'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-xs font-bold">{opt.title}</div>
                  <div className="text-[11px] text-gray-500">{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Output Type: JPG vs PDF */}
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-700 block mb-1.5">
                2. Output Format (JPG or PDF):
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setOutputType('jpg');
                    setResult(null);
                  }}
                  className={`p-2.5 rounded-[4px] border flex items-center justify-center gap-1.5 text-xs font-bold transition-colors ${
                    outputType === 'jpg'
                      ? 'border-[#414FA8] bg-[#414FA8] text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <ImageIcon className="h-4 w-4" />
                  JPG Image
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setOutputType('pdf');
                    setResult(null);
                  }}
                  className={`p-2.5 rounded-[4px] border flex items-center justify-center gap-1.5 text-xs font-bold transition-colors ${
                    outputType === 'pdf'
                      ? 'border-[#414FA8] bg-[#414FA8] text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  PDF Document
                </button>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={addBorder}
                  onChange={(e) => {
                    setAddBorder(e.target.checked);
                    setResult(null);
                  }}
                  className="h-4 w-4 rounded text-[#414FA8]"
                />
                <span>Add clean card border outline</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={cleanScanMode}
                  onChange={(e) => {
                    setCleanScanMode(e.target.checked);
                    setResult(null);
                  }}
                  className="h-4 w-4 rounded text-[#414FA8]"
                />
                <span>Enhance text contrast (Clean Scan Effect)</span>
              </label>
            </div>
          </div>

          {/* Target File Size in KB */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 block">
              3. Max File Size Limit (KB Lock):
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {KB_TARGETS.map((kb) => (
                <button
                  key={kb}
                  type="button"
                  onClick={() => {
                    setTargetKb(kb);
                    setResult(null);
                  }}
                  className={`py-2 px-2 rounded border text-xs font-bold tabular-nums transition-colors ${
                    targetKb === kb
                      ? 'border-emerald-700 bg-emerald-700 text-white'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-500'
                  }`}
                >
                  ≤ {kb} KB
                </button>
              ))}
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed pt-1">
              Govt portals like SSC, UPSC, India Post GDS &amp; NSDL mandate single-file ID proof under <strong>100 KB</strong> or <strong>200 KB</strong>.
            </p>
          </div>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={handleMerge}
            disabled={!frontImg || !backImg || isProcessing}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] disabled:bg-gray-300 text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed tabular-nums"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Combining Front &amp; Back Side...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>
                  Merge Front &amp; Back to Single {outputType.toUpperCase()} (Under {targetKb} KB)
                </span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result Preview & Download */}
      {result && (
        <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-emerald-200 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  ID Card Front &amp; Back Merged on 1 Page!
                </h3>
                <p className="text-xs text-gray-500 tabular-nums">
                  Format: {result.outputType.toUpperCase()} • Final Size: <strong>{formatBytes(result.size)}</strong> (Target ≤ {targetKb} KB)
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-100 rounded-full tabular-nums">
              {formatBytes(result.size)} • Portal Ready
            </span>
          </div>

          <div className="rounded-[4px] border border-gray-200 bg-gray-100 p-4 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={result.previewImageUrl}
              alt="Merged ID Card Front and Back Preview"
              className="max-h-[420px] max-w-full mx-auto rounded shadow-xs border border-gray-300 bg-white object-contain"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={handleDownload}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer tabular-nums"
            >
              <Download className="h-4 w-4" />
              <span>
                Download Merged {result.outputType.toUpperCase()} ({formatBytes(result.size)})
              </span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3 rounded-[4px] border border-[#414FA8] bg-[#EEF1FB] hover:bg-[#E2E7F8] text-[#414FA8] text-xs font-bold transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print A4 Sheet</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-3 rounded-[4px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Start Over</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>100% Client-Side Privacy: Your Aadhaar, PAN, or Voter ID never leaves your phone or computer.</span>
          </div>
        </div>
      )}
    </div>
  );
}
