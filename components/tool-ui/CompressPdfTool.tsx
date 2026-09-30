'use client';

import React, { useState, useRef, useEffect } from 'react';
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

export function CompressPdfTool() {
  const [pdfMeta, setPdfMeta] = useState<PdfMeta | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Settings
  const [targetKB, setTargetKB] = useState<number | ''>(500);

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
        setErrorMsg('Failed to open PDF. The file may be damaged, corrupted, or unsupported.');
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
      // Reserve 2% or 5KB for PDF overhead
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

        // Initial high-res render
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

          let lowQ = 0.1;
          let highQ = 0.9;
          let scaleBestBytes = null;

          // Binary search quality
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
              lowQ = midQ; // Try to get higher quality
            } else {
              highQ = midQ; // Need to reduce size
            }
          }

          tempCanvas.width = 0;
          tempCanvas.height = 0;

          if (scaleBestBytes) {
            bestBytes = scaleBestBytes;
            break; // Target hit for this page!
          }
        }

        const finalBytes = bestBytes || smallestBytesEver;
        if (!finalBytes) throw new Error('Compression failed for a page');

        const embeddedImg = await outputPdf.embedJpg(finalBytes.buffer);
        const newPage = outputPdf.addPage([pageWidthPt, pageHeightPt]);
        newPage.drawImage(embeddedImg, {
          x: 0,
          y: 0,
          width: pageWidthPt,
          height: pageHeightPt,
        });

        baseCanvas.width = 0;
        baseCanvas.height = 0;
      }

      setProgressPercent(100);
      setProgressText('Finalizing PDF...');

      
