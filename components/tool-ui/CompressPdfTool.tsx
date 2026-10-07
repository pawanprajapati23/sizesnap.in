'use client';

import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Upload,
  File,
  X,
  TrendingDown,
  TrendingUp,
  Download,
  Loader2,
  CheckCircle2,
  Settings2,
  Info,
  ShieldCheck,
} from 'lucide-react';

interface PdfMeta {
  file: File;
  name: string;
  size: number;
  totalPages: number;
  arrayBuffer: ArrayBuffer;
}

interface CompressionResult {
  blob: Blob;
  url: string;
  size: number;
  originalSize: number;
  savedBytes: number;
  percentChange: number;
  totalPages: number;
}

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function CompressPdfTool({ initialTargetKB = 500 }: { initialTargetKB?: number }) {
  const [pdfMeta, setPdfMeta] = useState<PdfMeta | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };


  // Settings
  const [targetKB, setTargetKB] = useState<number | ''>(initialTargetKB);

  // Progress & Results
  const [progressPercent, setProgressPercent] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [result, setResult] = useState<CompressionResult | null>(null);

  // Memory management for URLs
  const [cleanupUrls, setCleanupUrls] = useState<string[]>([]);
  const registerUrl = (url: string) => {
    setCleanupUrls((prev) => [...prev, url]);
    return url;
  };

  useEffect(() => {
    return () => {
      cleanupUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [cleanupUrls]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load PDF.js helper
  const getPdfJs = async () => {
    const pdfjs = await import('pdfjs-dist');
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    return pdfjs;
  };

  // Handle PDF file selection
  const handleFileSelect = async (file: File) => {
    setErrorMsg(null);
    setResult(null);

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Please select a valid PDF file (.pdf).');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      setErrorMsg('PDF file exceeds maximum allowed size (100MB).');
      return;
    }

    setIsLoadingPdf(true);

    try {
      const buffer = await file.arrayBuffer();
      const pdfjs = await getPdfJs();

      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(buffer),
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
        cMapPacked: true,
      });

      const pdfDoc = await loadingTask.promise;
      
      // Auto-suggest a target KB based on original size (50% reduction by default, max 1000KB)
      const originalKB = file.size / 1024;
      let suggestedKB = Math.floor(originalKB * 0.5);
      if (suggestedKB > 1000) suggestedKB = 1000;
      if (suggestedKB < 100) suggestedKB = 100;
      setTargetKB(suggestedKB);

      setPdfMeta({
        file,
        name: file.name,
        size: file.size,
        totalPages: pdfDoc.numPages,
        arrayBuffer: buffer,
      });

      setIsLoadingPdf(false);
    } catch (err: any) {
      setIsLoadingPdf(false);
      if (err.name === 'PasswordException') {
        setErrorMsg('This PDF is password-protected. Please unlock it before compressing.');
      } else {
        console.error(err); setErrorMsg(`Failed to open PDF: ${err.message || err.toString()}`);
      }
    }
  };

  const handleCompress = async () => {
    if (!pdfMeta || !targetKB) return;

    setIsCompressing(true);
    setErrorMsg(null);
    setProgressPercent(0);

    try {
      const targetBytes = Number(targetKB) * 1024;
      // Reserve some KB for PDF overhead (at least 2%)
      const safeTargetBytes = Math.max(1024, targetBytes - Math.max(5120, targetBytes * 0.02));
      
      const pdfjs = await getPdfJs();
      const freshBuffer = await pdfMeta.file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(freshBuffer),
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
        cMapPacked: true,
      });

      const loadedPdf = await loadingTask.promise;
      const totalPages = loadedPdf.numPages;
      const targetBytesPerPage = safeTargetBytes / totalPages;

      const { PDFDocument } = await import('pdf-lib');
      const outputPdf = await PDFDocument.create();

      for (let i = 1; i <= totalPages; i++) {
        const pct = Math.round(((i - 1) / totalPages) * 100);
        setProgressPercent(pct);
        setProgressText(`Compressing page ${i} of ${totalPages}... (${pct}%)`);

        const page = await loadedPdf.getPage(i);
        const originalViewport = page.getViewport({ scale: 1.0 });
        const pageWidthPt = originalViewport.width;
        const pageHeightPt = originalViewport.height;

        // Base render at high quality
        const baseScale = 2.0;
        const viewport = page.getViewport({ scale: baseScale });
        const baseCanvas = document.createElement('canvas');
        baseCanvas.width = Math.floor(viewport.width);
        baseCanvas.height = Math.floor(viewport.height);
        
        const baseCtx = baseCanvas.getContext('2d', { alpha: false });
        if (!baseCtx) throw new Error('Canvas 2D unavailable');
        
        baseCtx.fillStyle = '#FFFFFF';
        baseCtx.fillRect(0, 0, baseCanvas.width, baseCanvas.height);
        
        await page.render({
          canvasContext: baseCtx,
          viewport: viewport,
          background: 'rgb(255,255,255)'
        }).promise;

        const scalesToTry = [2.0, 1.5, 1.0, 0.75, 0.5, 0.35];
        let bestBytes = null;
        let smallestBytesEver = null;

        for (const testScale of scalesToTry) {
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = Math.floor(originalViewport.width * testScale);
          tempCanvas.height = Math.floor(originalViewport.height * testScale);
          const tempCtx = tempCanvas.getContext('2d', { alpha: false });
          if (!tempCtx) continue;
          
          tempCtx.fillStyle = '#FFFFFF';
          tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
          tempCtx.imageSmoothingEnabled = true;
          tempCtx.imageSmoothingQuality = 'high';
          tempCtx.drawImage(baseCanvas, 0, 0, tempCanvas.width, tempCanvas.height);

          let lowQ = 0.05;
          let highQ = 0.95;
          let scaleBestBytes = null;

          for (let iter = 0; iter < 5; iter++) {
            const midQ = (lowQ + highQ) / 2;
            const dataUrl = tempCanvas.toDataURL('image/jpeg', midQ);
            const base64 = dataUrl.split(',')[1];
            const binaryStr = atob(base64);
            const len = binaryStr.length;
            const bytes = new Uint8Array(len);
            for (let j = 0; j < len; j++) bytes[j] = binaryStr.charCodeAt(j);

            if (!smallestBytesEver || len < smallestBytesEver.length) {
              smallestBytesEver = bytes;
            }

            if (len <= targetBytesPerPage) {
              scaleBestBytes = bytes;
              lowQ = midQ; 
            } else {
              highQ = midQ; 
            }
          }

          tempCanvas.width = 0;
          tempCanvas.height = 0;

          if (scaleBestBytes) {
            bestBytes = scaleBestBytes;
            break;
          }
        }

        const finalBytes = bestBytes || smallestBytesEver;
        if (!finalBytes) throw new Error('Compression failed');

        const embeddedImg = await outputPdf.embedJpg(finalBytes.buffer);
        const newPage = outputPdf.addPage([pageWidthPt, pageHeightPt]);
        newPage.drawImage(embeddedImg, { x: 0, y: 0, width: pageWidthPt, height: pageHeightPt });

        baseCanvas.width = 0;
        baseCanvas.height = 0;
      }

      setProgressPercent(95);
      setProgressText('Finalizing optimized PDF file...');

      const outputBytes = await outputPdf.save({
        useObjectStreams: true,
      });

      const compressedBlob = new Blob([outputBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      const compressedUrl = registerUrl(URL.createObjectURL(compressedBlob));

      const saved = pdfMeta.size - compressedBlob.size;
      const pct = ((compressedBlob.size - pdfMeta.size) / pdfMeta.size) * 100;

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#414FA8', '#10B981', '#3B82F6']
      });

      setResult({
        blob: compressedBlob,
        url: compressedUrl,
        size: compressedBlob.size,
        originalSize: pdfMeta.size,
        savedBytes: saved,
        percentChange: pct,
        totalPages: pdfMeta.totalPages,
      });

      setIsCompressing(false);
      setProgressPercent(100);
      setProgressText('');
    } catch (err: any) {
      setIsCompressing(false);
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred while compressing the PDF.'
      );
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    const rawName = pdfMeta?.name.replace('.pdf', '') || 'document';
    a.download = `${rawName}-compressed-${formatBytes(result.size).replace(' ', '')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setPdfMeta(null);
    setResult(null);
    setErrorMsg(null);
    setTargetKB(500);
    setProgressPercent(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      {/* 1. Upload View */}
      {!pdfMeta && (
        <div 
          onDragOver={handleDragOver} 
          onDragLeave={handleDragLeave} 
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-md p-6 sm:p-10 text-center transition-all duration-200 ${isDragging ? 'border-[#414FA8] bg-[#EEF1FB] scale-[1.01]' : 'border-[#9AA3C8] bg-[#FAFAFC] hover:bg-white'}`}
        >
          <div className="max-w-md mx-auto flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center mb-4 shadow-xs">
              <Upload className="h-6 w-6" />
            </div>
            <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-2">Select PDF File</h2>
            <p className="text-xs sm:text-sm text-gray-500 mb-6">
              Drop your PDF here or browse your device. Max file size: 100MB.
            </p>
            
            <input
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />
            
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoadingPdf}
              className="px-6 py-3 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] text-white font-semibold rounded-[4px] shadow-sm transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              {isLoadingPdf ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading PDF...</span>
                </>
              ) : (
                'Choose PDF File'
              )}
            </button>
            <p className="text-[11px] text-gray-400 mt-4 flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" /> Secure local processing
            </p>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[4px] flex items-start gap-2">
          <span className="font-bold shrink-0">Error:</span>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2. Configuration View */}
      {pdfMeta && !result && (
        <div className="bg-white border border-gray-200 rounded-[4px] overflow-hidden shadow-xs animate-in fade-in zoom-in-95 duration-200">
          
          <div className="bg-[#FAFAFC] border-b border-gray-200 p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-10 w-10 bg-white border border-gray-200 rounded shadow-xs flex items-center justify-center shrink-0">
                <File className="h-5 w-5 text-red-500" />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-gray-800 truncate" title={pdfMeta.name}>
                  {pdfMeta.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Original Size: <span className="font-semibold text-gray-700">{formatBytes(pdfMeta.size)}</span> • {pdfMeta.totalPages} pages
                </p>
              </div>
            </div>
            
            {!isCompressing && (
              <button
                onClick={handleReset}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors shrink-0"
                title="Remove file"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="p-4 sm:p-6 space-y-5">
            <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2 mb-2">
                    <Settings2 className="h-4 w-4 text-[#414FA8]" /> Target File Size
                  </h3>
                  <p className="text-xs text-gray-500 mb-4">
                    Enter the maximum file size you need for your PDF. We will automatically adjust the quality to match it.
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-[200px]">
                      <input
                        type="number"
                        value={targetKB}
                        onChange={(e) => setTargetKB(e.target.value === '' ? '' : Number(e.target.value))}
                        disabled={isCompressing}
                        className="w-full p-2.5 pr-12 text-sm font-bold text-gray-800 border border-gray-300 rounded-[4px] outline-none focus:border-[#414FA8] focus:ring-1 focus:ring-[#414FA8] disabled:bg-gray-100"
                        placeholder="e.g. 500"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-500">
                        KB
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {[20, 50, 100, 300, 500, 1000].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setTargetKB(preset)}
                        disabled={isCompressing}
                        className={`px-3 py-1.5 text-xs font-medium border rounded transition-colors ${
                          targetKB === preset
                            ? 'bg-[#414FA8] text-white border-[#414FA8]'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {preset >= 1000 ? `${preset/1000} MB` : `${preset} KB`}
                      </button>
                    ))}
                  </div>
                </div>

              {/* Progress Bar (Visible during compression) */}
              {isCompressing && (
                <div className="bg-[#FAFAFC] border border-gray-100 rounded p-4 mt-2">
                  <div className="flex justify-between text-xs font-medium text-gray-700 mb-2">
                    <span>{progressText}</span>
                    <span className="text-[#414FA8] font-bold">{progressPercent}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-[#414FA8] h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleCompress}
                disabled={isCompressing || !targetKB}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
              >
                {isCompressing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-white" />
                    <span>Compressing...</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-emerald-400" />
                    <span>Compress PDF to {targetKB} KB</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Results View */}
      {result && (
        <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  PDF Compressed Successfully!
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {result.percentChange < 0 ? (
                <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
                  <TrendingDown className="h-3.5 w-3.5" />
                  <span>{Math.abs(Math.round(result.percentChange))}% Smaller</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded-full">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+{Math.round(result.percentChange)}%</span>
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-[#FAFAFC] rounded-[4px] border border-gray-200 text-xs">
            <div>
              <span className="text-gray-500 text-[11px] block">Original File Size:</span>
              <span className="font-semibold text-gray-800 text-sm">{formatBytes(result.originalSize)}</span>
            </div>
            <div>
              <span className="text-gray-500 text-[11px] block">New Compressed Size:</span>
              <span className="font-bold text-[#414FA8] text-sm">{formatBytes(result.size)}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-gray-500 text-[11px] block">Total Reduction:</span>
              <span className={`font-semibold text-sm ${result.savedBytes > 0 ? 'text-emerald-700' : 'text-gray-700'}`}>
                {result.savedBytes > 0 ? `-${formatBytes(result.savedBytes)}` : '0 Bytes'}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleDownload}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF ({formatBytes(result.size)})</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
            >
              Compress Another PDF
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Processed securely in your browser.</span>
          </div>
        </div>
      )}
    </div>
  );
}
