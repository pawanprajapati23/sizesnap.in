'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { formatBytes } from '@/lib/format-utils';
import {
  Upload,
  Camera,
  Plus,
  Trash2,
  Download,
  FileText,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  X,
  ScanLine,
  ZoomIn,
  FilePlus,
  GripVertical,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

/* ─── Types ─── */
interface ScannedPage {
  id: string;
  pageNumber: number;
  imageDataUrl: string; // full-res JPEG data URL
  thumbnail: string;    // small preview data URL
  width: number;
  height: number;
  timestamp: number;
}

type ToolMode = 'idle' | 'camera' | 'upload-review' | 'corner-adjust' | 'pages';
type Corner = [number, number]; // [x, y]

const MAX_PAGES = 30;

/* ─── Helpers ─── */
function orderCorners(pts: Corner[]): Corner[] {
  const sum = pts.map((p, i) => ({ i, v: p[0] + p[1] }));
  const diff = pts.map((p, i) => ({ i, v: p[0] - p[1] }));
  sum.sort((a, b) => a.v - b.v);
  diff.sort((a, b) => a.v - b.v);
  return [
    pts[sum[0].i],  // TL – smallest sum
    pts[diff[3].i], // TR – largest diff
    pts[sum[3].i],  // BR – largest sum
    pts[diff[0].i], // BL – smallest diff
  ];
}

function createThumbnail(dataUrl: string, maxW = 150): Promise<string> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.onload = () => {
      const ratio = maxW / img.width;
      const c = document.createElement('canvas');
      c.width = maxW;
      c.height = Math.round(img.height * ratio);
      const ctx = c.getContext('2d')!;
      ctx.drawImage(img, 0, 0, c.width, c.height);
      resolve(c.toDataURL('image/jpeg', 0.6));
    };
    img.src = dataUrl;
  });
}

function canvasToDataUrl(canvas: HTMLCanvasElement, quality = 0.92): string {
  return canvas.toDataURL('image/jpeg', quality);
}

function dist(a: Corner, b: Corner): number {
  return Math.hypot(b[0] - a[0], b[1] - a[1]);
}

function warpPerspectiveJS(
  srcCtx: CanvasRenderingContext2D,
  srcW: number,
  srcH: number,
  corners: Corner[],
  outW: number,
  outH: number
): HTMLCanvasElement {
  const [p0, p1, p2, p3] = corners;
  const dx1 = p1[0] - p2[0];
  const dy1 = p1[1] - p2[1];
  const dx2 = p3[0] - p2[0];
  const dy2 = p3[1] - p2[1];
  const sx = p0[0] - p1[0] + p2[0] - p3[0];
  const sy = p0[1] - p1[1] + p2[1] - p3[1];

  let g = 0, h = 0;
  if (sx !== 0 || sy !== 0) {
    const det = dx1 * dy2 - dx2 * dy1;
    if (Math.abs(det) > 1e-7) {
      g = (sx * dy2 - sy * dx2) / det;
      h = (dx1 * sy - dy1 * sx) / det;
    }
  }

  const a = (p1[0] - p0[0]) + g * p1[0];
  const b = (p3[0] - p0[0]) + h * p3[0];
  const c0 = p0[0];
  const d = (p1[1] - p0[1]) + g * p1[1];
  const e = (p3[1] - p0[1]) + h * p3[1];
  const f = p0[1];

  const m0 = a / outW;
  const m1 = b / outH;
  const m2 = c0;
  const m3 = d / outW;
  const m4 = e / outH;
  const m5 = f;
  const m6 = g / outW;
  const m7 = h / outH;
  const m8 = 1.0;

  const srcImageData = srcCtx.getImageData(0, 0, srcW, srcH);
  const srcData = srcImageData.data;

  const outCanvas = document.createElement('canvas');
  outCanvas.width = outW;
  outCanvas.height = outH;
  const outCtx = outCanvas.getContext('2d')!;
  const dstImageData = outCtx.createImageData(outW, outH);
  const dstData = dstImageData.data;

  for (let y = 0; y < outH; y++) {
    const yRow = y * outW * 4;
    for (let x = 0; x < outW; x++) {
      const w = m6 * x + m7 * y + m8;
      const u = (m0 * x + m1 * y + m2) / w;
      const v = (m3 * x + m4 * y + m5) / w;

      const x0 = Math.floor(u);
      const y0 = Math.floor(v);
      const x1 = Math.min(x0 + 1, srcW - 1);
      const y1 = Math.min(y0 + 1, srcH - 1);

      const dstIdx = yRow + (x * 4);

      if (x0 >= 0 && x0 < srcW && y0 >= 0 && y0 < srcH) {
        const dx = u - x0;
        const dy = v - y0;
        const w00 = (1 - dx) * (1 - dy);
        const w10 = dx * (1 - dy);
        const w01 = (1 - dx) * dy;
        const w11 = dx * dy;

        const idx00 = (y0 * srcW + x0) * 4;
        const idx10 = (y0 * srcW + x1) * 4;
        const idx01 = (y1 * srcW + x0) * 4;
        const idx11 = (y1 * srcW + x1) * 4;

        dstData[dstIdx] = (srcData[idx00] * w00 + srcData[idx10] * w10 + srcData[idx01] * w01 + srcData[idx11] * w11) | 0;
        dstData[dstIdx + 1] = (srcData[idx00 + 1] * w00 + srcData[idx10 + 1] * w10 + srcData[idx01 + 1] * w01 + srcData[idx11 + 1] * w11) | 0;
        dstData[dstIdx + 2] = (srcData[idx00 + 2] * w00 + srcData[idx10 + 2] * w10 + srcData[idx01 + 2] * w01 + srcData[idx11 + 2] * w11) | 0;
        dstData[dstIdx + 3] = 255;
      } else {
        dstData[dstIdx] = 255;
        dstData[dstIdx + 1] = 255;
        dstData[dstIdx + 2] = 255;
        dstData[dstIdx + 3] = 255;
      }
    }
  }

  outCtx.putImageData(dstImageData, 0, 0);
  return outCanvas;
}

/* ─── Main Component ─── */
export function DocumentScannerTool() {
  /* State */
  const [mode, setMode] = useState<ToolMode>('idle');
  const [pages, setPages] = useState<ScannedPage[]>([]);
  const [currentPageIdx, setCurrentPageIdx] = useState(-1);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // OpenCV
  const [cvReady, setCvReady] = useState(false);
  const [cvLoading, setCvLoading] = useState(false);
  const cvRef = useRef<any>(null);

  // Camera
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const detectionFrameRef = useRef<number>(0);
  const lastDetectTimeRef = useRef<number>(0);

  // Captured frame for review
  const [capturedDataUrl, setCapturedDataUrl] = useState<string | null>(null);
  const [capturedDims, setCapturedDims] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  // Corner adjustment
  const [corners, setCorners] = useState<Corner[]>([]);
  const [draggingCorner, setDraggingCorner] = useState<number | null>(null);
  const cornerContainerRef = useRef<HTMLDivElement>(null);

  // File input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Re-scan mode
  const [rescanPageId, setRescanPageId] = useState<string | null>(null);

  /* ─── OpenCV Loader ─── */
  const loadOpenCv = useCallback(() => {
    if (cvRef.current || cvLoading) return;
    setCvLoading(true);

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@techstark/opencv-js@4.10.0-release.1/dist/opencv.js';
    script.async = true;

    script.onload = () => {
      let attempts = 0;
      const checkReady = () => {
        attempts++;
        // @ts-ignore
        const cvObj = window.cv;
        if (cvObj) {
          if (cvObj.Mat) {
            cvRef.current = cvObj;
            setCvReady(true);
            setCvLoading(false);
            return;
          }
          if (typeof cvObj.then === 'function') {
            cvObj.then((cvInstance: any) => {
              cvRef.current = cvInstance;
              setCvReady(true);
              setCvLoading(false);
            }).catch(() => {
              setCvLoading(false);
            });
            return;
          }
          if (cvObj.onRuntimeInitialized !== undefined) {
            cvObj.onRuntimeInitialized = () => {
              // @ts-ignore
              cvRef.current = window.cv;
              setCvReady(true);
              setCvLoading(false);
            };
            return;
          }
        }
        if (attempts < 100) {
          setTimeout(checkReady, 100);
        } else {
          setCvLoading(false);
        }
      };
      checkReady();
    };

    script.onerror = () => {
      console.warn('OpenCV CDN unavailable. Using built-in pure JS perspective engine.');
      setCvLoading(false);
    };

    document.body.appendChild(script);
  }, [cvLoading]);

  /* ─── Camera ─── */
  const startCamera = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setMode('camera');
      // Start loading OpenCV in the background
      if (!cvRef.current && !cvLoading) loadOpenCv();
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        setError('Camera permission denied. Please allow camera access in your browser settings.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found on this device. Try uploading an image instead.');
      } else {
        setError(`Camera error: ${err.message || 'Unknown error'}`);
      }
    }
  }, [cvLoading, loadOpenCv]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    cancelAnimationFrame(detectionFrameRef.current);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  /* ─── Edge Detection on Video (throttled ~5fps) ─── */
  const runLiveDetection = useCallback(() => {
    if (!videoRef.current || !overlayCanvasRef.current || !cvRef.current) {
      detectionFrameRef.current = requestAnimationFrame(runLiveDetection);
      return;
    }

    const now = performance.now();
    if (now - lastDetectTimeRef.current < 200) {
      detectionFrameRef.current = requestAnimationFrame(runLiveDetection);
      return;
    }
    lastDetectTimeRef.current = now;

    const video = videoRef.current;
    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx || video.videoWidth === 0) {
      detectionFrameRef.current = requestAnimationFrame(runLiveDetection);
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    try {
      const cv = cvRef.current;
      // Draw video frame to a temp canvas for OpenCV
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = video.videoWidth;
      tempCanvas.height = video.videoHeight;
      const tempCtx = tempCanvas.getContext('2d')!;
      tempCtx.drawImage(video, 0, 0);
      const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);

      const src = cv.matFromImageData(imageData);
      const gray = new cv.Mat();
      cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

      const blurred = new cv.Mat();
      cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

      const edges = new cv.Mat();
      cv.Canny(blurred, edges, 50, 150);

      const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
      const dilated = new cv.Mat();
      cv.dilate(edges, dilated, kernel);

      const contours = new cv.MatVector();
      const hierarchy = new cv.Mat();
      cv.findContours(dilated, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

      let maxArea = 0;
      let bestCorners: Corner[] | null = null;

      for (let i = 0; i < contours.size(); i++) {
        const cnt = contours.get(i);
        const area = cv.contourArea(cnt);
        if (area > maxArea && area > (canvas.width * canvas.height * 0.05)) {
          const peri = cv.arcLength(cnt, true);
          const approx = new cv.Mat();
          cv.approxPolyDP(cnt, approx, 0.02 * peri, true);
          if (approx.rows === 4) {
            maxArea = area;
            const pts: Corner[] = [];
            for (let j = 0; j < 4; j++) {
              pts.push([approx.data32S[j * 2], approx.data32S[j * 2 + 1]]);
            }
            bestCorners = orderCorners(pts);
          }
          approx.delete();
        }
        cnt.delete();
      }

      // Draw overlay
      if (bestCorners) {
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 3;
        ctx.fillStyle = 'rgba(34, 197, 94, 0.15)';
        ctx.beginPath();
        ctx.moveTo(bestCorners[0][0], bestCorners[0][1]);
        for (let i = 1; i < 4; i++) {
          ctx.lineTo(bestCorners[i][0], bestCorners[i][1]);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Draw corner dots
        for (const c of bestCorners) {
          ctx.beginPath();
          ctx.arc(c[0], c[1], 8, 0, Math.PI * 2);
          ctx.fillStyle = '#22c55e';
          ctx.fill();
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }

      // Cleanup
      src.delete();
      gray.delete();
      blurred.delete();
      edges.delete();
      kernel.delete();
      dilated.delete();
      contours.delete();
      hierarchy.delete();
    } catch {
      // Silently fail edge detection – not critical
    }

    detectionFrameRef.current = requestAnimationFrame(runLiveDetection);
  }, []);

  // Start/stop live detection when in camera mode
  useEffect(() => {
    if (mode === 'camera' && cvReady) {
      detectionFrameRef.current = requestAnimationFrame(runLiveDetection);
    }
    return () => cancelAnimationFrame(detectionFrameRef.current);
  }, [mode, cvReady, runLiveDetection]);

  /* ─── Capture Frame ─── */
  const captureFrame = useCallback(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0);
    const dataUrl = canvasToDataUrl(canvas);
    setCapturedDataUrl(dataUrl);
    setCapturedDims({ w: canvas.width, h: canvas.height });

    // Try to detect corners on captured frame
    detectCornersOnImage(dataUrl, canvas.width, canvas.height);

    stopCamera();
    setMode('corner-adjust');
  }, [stopCamera]);

  /* ─── Upload Image ─── */
  const handleFileSelect = (file: File) => {
    setError(null);
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (JPG, PNG, WebP).');
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError('File too large. Maximum 50 MB allowed.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const img = new window.Image();
      img.onload = () => {
        // Downscale if too large
        let w = img.width;
        let h = img.height;
        const maxDim = 3000;
        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h);
          w = Math.round(w * ratio);
          h = Math.round(h * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        const processedDataUrl = canvasToDataUrl(canvas);

        setCapturedDataUrl(processedDataUrl);
        setCapturedDims({ w, h });

        // Load OpenCV and detect corners
        if (!cvRef.current && !cvLoading) loadOpenCv();
        detectCornersOnImage(processedDataUrl, w, h);

        setMode('corner-adjust');
      };
      img.onerror = () => setError('Failed to load image.');
      img.src = dataUrl;
    };
    reader.onerror = () => setError('Failed to read file.');
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) handleFileSelect(e.dataTransfer.files[0]);
  };

  /* ─── Detect Corners ─── */
  const detectCornersOnImage = (dataUrl: string, w: number, h: number) => {
    if (!cvRef.current) {
      // No OpenCV – use default corners (10% inset)
      const margin = 0.1;
      setCorners([
        [Math.round(w * margin), Math.round(h * margin)],
        [Math.round(w * (1 - margin)), Math.round(h * margin)],
        [Math.round(w * (1 - margin)), Math.round(h * (1 - margin))],
        [Math.round(w * margin), Math.round(h * (1 - margin))],
      ]);
      return;
    }

    const img = new window.Image();
    img.onload = () => {
      try {
        const cv = cvRef.current;
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, w, h);
        const imageData = ctx.getImageData(0, 0, w, h);

        const src = cv.matFromImageData(imageData);
        const gray = new cv.Mat();
        cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

        const blurred = new cv.Mat();
        cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

        const edges = new cv.Mat();
        cv.Canny(blurred, edges, 50, 150);

        const kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(3, 3));
        const dilated = new cv.Mat();
        cv.dilate(edges, dilated, kernel);

        const contours = new cv.MatVector();
        const hierarchy = new cv.Mat();
        cv.findContours(dilated, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

        let maxArea = 0;
        let bestCorners: Corner[] | null = null;

        for (let i = 0; i < contours.size(); i++) {
          const cnt = contours.get(i);
          const area = cv.contourArea(cnt);
          if (area > maxArea && area > (w * h * 0.05)) {
            const peri = cv.arcLength(cnt, true);
            const approx = new cv.Mat();
            cv.approxPolyDP(cnt, approx, 0.02 * peri, true);
            if (approx.rows === 4) {
              maxArea = area;
              const pts: Corner[] = [];
              for (let j = 0; j < 4; j++) {
                pts.push([approx.data32S[j * 2], approx.data32S[j * 2 + 1]]);
              }
              bestCorners = orderCorners(pts);
            }
            approx.delete();
          }
          cnt.delete();
        }

        src.delete(); gray.delete(); blurred.delete(); edges.delete();
        kernel.delete(); dilated.delete(); contours.delete(); hierarchy.delete();

        if (bestCorners) {
          setCorners(bestCorners);
        } else {
          // Fallback – use 10% margin
          const margin = 0.1;
          setCorners([
            [Math.round(w * margin), Math.round(h * margin)],
            [Math.round(w * (1 - margin)), Math.round(h * margin)],
            [Math.round(w * (1 - margin)), Math.round(h * (1 - margin))],
            [Math.round(w * margin), Math.round(h * (1 - margin))],
          ]);
        }
      } catch {
        const margin = 0.1;
        setCorners([
          [Math.round(w * margin), Math.round(h * margin)],
          [Math.round(w * (1 - margin)), Math.round(h * margin)],
          [Math.round(w * (1 - margin)), Math.round(h * (1 - margin))],
          [Math.round(w * margin), Math.round(h * (1 - margin))],
        ]);
      }
    };
    img.src = dataUrl;
  };

  /* ─── Apply Perspective Correction ─── */
  const applyCorrection = async () => {
    if (!capturedDataUrl || corners.length !== 4) return;
    setProcessing(true);
    setError(null);

    try {
      const img = new window.Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load captured image'));
        img.src = capturedDataUrl;
      });

      const outW = Math.round(Math.max(dist(corners[0], corners[1]), dist(corners[3], corners[2])));
      const outH = Math.round(Math.max(dist(corners[0], corners[3]), dist(corners[1], corners[2])));

      let resultDataUrl: string;

      if (cvRef.current) {
        // Use OpenCV for perspective warp
        const cv = cvRef.current;
        const srcCanvas = document.createElement('canvas');
        srcCanvas.width = capturedDims.w;
        srcCanvas.height = capturedDims.h;
        const srcCtx = srcCanvas.getContext('2d')!;
        srcCtx.drawImage(img, 0, 0);
        const imageData = srcCtx.getImageData(0, 0, capturedDims.w, capturedDims.h);

        const src = cv.matFromImageData(imageData);
        const srcPts = cv.matFromArray(4, 1, cv.CV_32FC2, corners.flat());
        const dstPts = cv.matFromArray(4, 1, cv.CV_32FC2, [
          0, 0, outW, 0, outW, outH, 0, outH,
        ]);

        const M = cv.getPerspectiveTransform(srcPts, dstPts);
        const dst = new cv.Mat();
        cv.warpPerspective(src, dst, M, new cv.Size(outW, outH));

        // Sharpen
        const sharpened = new cv.Mat();
        const blurTemp = new cv.Mat();
        cv.GaussianBlur(dst, blurTemp, new cv.Size(0, 0), 3);
        cv.addWeighted(dst, 1.5, blurTemp, -0.5, 0, sharpened);

        const outCanvas = document.createElement('canvas');
        outCanvas.width = outW;
        outCanvas.height = outH;
        cv.imshow(outCanvas, sharpened);
        resultDataUrl = canvasToDataUrl(outCanvas);

        src.delete(); srcPts.delete(); dstPts.delete(); M.delete();
        dst.delete(); sharpened.delete(); blurTemp.delete();
      } else {
        // High-precision pure JS bilinear perspective warp engine
        const srcCanvas = document.createElement('canvas');
        srcCanvas.width = capturedDims.w;
        srcCanvas.height = capturedDims.h;
        const srcCtx = srcCanvas.getContext('2d')!;
        srcCtx.drawImage(img, 0, 0);

        const outCanvas = warpPerspectiveJS(srcCtx, capturedDims.w, capturedDims.h, corners, outW, outH);
        resultDataUrl = canvasToDataUrl(outCanvas);
      }

      const thumb = await createThumbnail(resultDataUrl);

      const newPage: ScannedPage = {
        id: crypto.randomUUID(),
        pageNumber: pages.length + 1,
        imageDataUrl: resultDataUrl,
        thumbnail: thumb,
        width: outW,
        height: outH,
        timestamp: Date.now(),
      };

      if (rescanPageId) {
        // Replace existing page
        setPages((prev) =>
          prev.map((p) =>
            p.id === rescanPageId
              ? { ...newPage, id: rescanPageId, pageNumber: p.pageNumber }
              : p
          )
        );
        setRescanPageId(null);
      } else {
        setPages((prev) => [...prev, newPage]);
        setCurrentPageIdx(pages.length);
      }

      setCapturedDataUrl(null);
      setMode('pages');
    } catch (err: any) {
      setError(err?.message || 'Processing failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  /* ─── Page Management ─── */
  const deletePage = (id: string) => {
    setPages((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      return filtered.map((p, i) => ({ ...p, pageNumber: i + 1 }));
    });
    if (pages.length <= 1) {
      setMode('idle');
      setCurrentPageIdx(-1);
    } else {
      setCurrentPageIdx(Math.max(0, currentPageIdx - 1));
    }
  };

  const startRescan = (id: string) => {
    setRescanPageId(id);
    setMode('idle');
  };

  const movePage = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= pages.length) return;
    setPages((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(fromIdx, 1);
      updated.splice(toIdx, 0, moved);
      return updated.map((p, i) => ({ ...p, pageNumber: i + 1 }));
    });
    setCurrentPageIdx(toIdx);
  };

  const addNewPage = () => {
    if (pages.length >= MAX_PAGES) {
      setError(`Maximum ${MAX_PAGES} pages allowed.`);
      return;
    }
    setMode('idle');
  };

  /* ─── Export Functions ─── */
  const downloadPdf = async () => {
    if (pages.length === 0) return;
    setProcessing(true);
    setError(null);

    try {
      const { jsPDF } = await import('jspdf');

      // Load first image to determine PDF page size
      const firstImg = new window.Image();
      await new Promise<void>((resolve) => {
        firstImg.onload = () => resolve();
        firstImg.src = pages[0].imageDataUrl;
      });

      const pdf = new jsPDF({
        orientation: firstImg.width > firstImg.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [firstImg.width, firstImg.height],
      });

      for (let i = 0; i < pages.length; i++) {
        const pageImg = new window.Image();
        await new Promise<void>((resolve) => {
          pageImg.onload = () => resolve();
          pageImg.src = pages[i].imageDataUrl;
        });

        if (i > 0) {
          pdf.addPage([pageImg.width, pageImg.height],
            pageImg.width > pageImg.height ? 'landscape' : 'portrait'
          );
        }

        pdf.addImage(
          pages[i].imageDataUrl,
          'JPEG',
          0, 0,
          pageImg.width,
          pageImg.height
        );
      }

      const blob = pdf.output('blob');
      triggerDownload(blob, `scanned-document-${pages.length}pages.pdf`);
    } catch (err: any) {
      setError(err?.message || 'PDF generation failed.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadZip = async () => {
    if (pages.length === 0) return;
    setProcessing(true);
    setError(null);

    try {
      const JSZipModule = await import('jszip');
      const JSZip = (JSZipModule as any).default || JSZipModule;
      const zip = new JSZip();

      for (const page of pages) {
        const response = await fetch(page.imageDataUrl);
        const blob = await response.blob();
        zip.file(`scanned-page-${page.pageNumber}.jpg`, blob);
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      triggerDownload(blob, `scanned-pages-${pages.length}.zip`);
    } catch (err: any) {
      setError(err?.message || 'ZIP generation failed.');
    } finally {
      setProcessing(false);
    }
  };

  const downloadSinglePage = (page: ScannedPage) => {
    const link = document.createElement('a');
    link.href = page.imageDataUrl;
    link.download = `scanned-page-${page.pageNumber}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /* ─── Corner Drag Handlers ─── */
  const handleCornerPointerDown = (idx: number, e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDraggingCorner(idx);
  };

  const handleCornerPointerMove = useCallback(
    (e: PointerEvent) => {
      if (draggingCorner === null || !cornerContainerRef.current) return;

      const rect = cornerContainerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * capturedDims.w;
      const y = ((e.clientY - rect.top) / rect.height) * capturedDims.h;

      const clampedX = Math.max(0, Math.min(capturedDims.w, Math.round(x)));
      const clampedY = Math.max(0, Math.min(capturedDims.h, Math.round(y)));

      setCorners((prev) => {
        const updated = [...prev] as Corner[];
        updated[draggingCorner] = [clampedX, clampedY];
        return updated;
      });
    },
    [draggingCorner, capturedDims]
  );

  const handleCornerPointerUp = useCallback(() => {
    setDraggingCorner(null);
  }, []);

  useEffect(() => {
    if (draggingCorner !== null) {
      window.addEventListener('pointermove', handleCornerPointerMove);
      window.addEventListener('pointerup', handleCornerPointerUp);
    }
    return () => {
      window.removeEventListener('pointermove', handleCornerPointerMove);
      window.removeEventListener('pointerup', handleCornerPointerUp);
    };
  }, [draggingCorner, handleCornerPointerMove, handleCornerPointerUp]);

  /* ─── Clear All ─── */
  const clearAll = () => {
    stopCamera();
    setPages([]);
    setCurrentPageIdx(-1);
    setCapturedDataUrl(null);
    setCorners([]);
    setError(null);
    setRescanPageId(null);
    setMode('idle');
  };

  /* ═══════════════════════════════════ RENDER ═══════════════════════════════════ */

  return (
    <div className="space-y-5">
      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[4px]">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <p className="flex-1">{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-xs font-semibold text-red-800 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ─── IDLE MODE: Upload / Camera Selector ─── */}
      {mode === 'idle' && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[4px] border-2 border-dashed border-[#9AA3C8] bg-[#FAFAFC] hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-colors select-none"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="sr-only"
          />

          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-4">
            <ScanLine className="h-7 w-7" />
          </div>

          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            {rescanPageId ? 'Re-scan Page' : pages.length > 0 ? 'Add Another Page' : 'Scan a Document'}
          </h3>
          <p className="text-xs text-gray-500 mb-5 max-w-sm">
            Use your phone camera to scan documents or upload a photo. Auto-detect edges, flatten perspective, and export as multi-page PDF.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={startCamera}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs sm:text-sm font-semibold rounded-[4px] shadow-xs transition-colors"
            >
              <Camera className="h-4 w-4" />
              <span>Open Camera</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#9AA3C8] hover:border-[#414FA8] bg-white hover:bg-[#EEF1FB] text-[#414FA8] text-xs sm:text-sm font-semibold rounded-[4px] shadow-xs transition-colors"
            >
              <Upload className="h-4 w-4" />
              <span>Upload Image</span>
            </button>
          </div>

          {pages.length > 0 && (
            <button
              type="button"
              onClick={() => setMode('pages')}
              className="mt-4 text-xs text-[#414FA8] hover:underline font-medium"
            >
              ← Back to scanned pages ({pages.length})
            </button>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
            <span>Auto edge detection</span>
            <span>•</span>
            <span>Perspective correction</span>
            <span>•</span>
            <span>Multi-page PDF</span>
            <span>•</span>
            <span>100% Client-Side</span>
          </div>
        </div>
      )}

      {/* ─── CAMERA MODE ─── */}
      {mode === 'camera' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white p-3 rounded-[4px] border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-[#414FA8]" />
              <span className="text-xs font-bold text-gray-800">Camera Preview</span>
              {cvLoading && (
                <span className="inline-flex items-center gap-1 text-[11px] text-amber-600">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Loading edge detection...
                </span>
              )}
              {cvReady && (
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" />
                  Edge detection active
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => { stopCamera(); setMode(pages.length > 0 ? 'pages' : 'idle'); }}
              className="text-xs text-gray-500 hover:text-red-600 font-medium"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="relative bg-[#1E202A] rounded overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full max-h-[70vh] object-contain"
            />
            <canvas
              ref={overlayCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ objectFit: 'contain' }}
            />
          </div>

          <div className="flex justify-center">
            <button
              type="button"
              onClick={captureFrame}
              className="flex items-center justify-center gap-2 px-8 py-3 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] text-white font-bold text-sm rounded-[4px] shadow-xs transition-colors"
            >
              <Camera className="h-5 w-5" />
              <span>Capture</span>
            </button>
          </div>

          <p className="text-center text-[11px] text-gray-400">
            Position your document within the frame. {cvReady ? 'Green overlay shows detected edges.' : 'Tip: keep the document flat and well-lit.'}
          </p>
        </div>
      )}

      {/* ─── CORNER ADJUST MODE ─── */}
      {mode === 'corner-adjust' && capturedDataUrl && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white p-3 rounded-[4px] border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2">
              <ZoomIn className="h-4 w-4 text-[#414FA8]" />
              <div>
                <span className="text-xs font-bold text-gray-800 block">Adjust Document Corners</span>
                <span className="text-[11px] text-gray-500">Drag the corner handles to match your document edges</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => { setCapturedDataUrl(null); setMode(pages.length > 0 ? 'pages' : 'idle'); }}
              className="text-xs text-gray-500 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="bg-[#1E202A] p-2 sm:p-4 rounded overflow-hidden flex justify-center">
            <div
              ref={cornerContainerRef}
              className="relative inline-block max-w-full max-h-[500px]"
              style={{ touchAction: 'none' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={capturedDataUrl}
                alt="Captured document"
                className="max-h-[500px] w-auto object-contain block pointer-events-none"
              />

              {/* Semi-transparent overlay */}
              <div className="absolute inset-0 bg-black/30 pointer-events-none" />

              {/* Draw corner polygon (SVG overlay) */}
              {corners.length === 4 && (
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  viewBox={`0 0 ${capturedDims.w} ${capturedDims.h}`}
                  preserveAspectRatio="xMidYMid meet"
                >
                  <polygon
                    points={corners.map((c) => `${c[0]},${c[1]}`).join(' ')}
                    fill="rgba(65, 79, 168, 0.2)"
                    stroke="#414FA8"
                    strokeWidth="3"
                  />
                </svg>
              )}

              {/* Corner handles */}
              {corners.map((corner, idx) => (
                <div
                  key={idx}
                  onPointerDown={(e) => handleCornerPointerDown(idx, e)}
                  className="absolute w-6 h-6 -ml-3 -mt-3 bg-white border-2 border-[#414FA8] rounded-full cursor-grab active:cursor-grabbing z-20 shadow-md"
                  style={{
                    left: `${(corner[0] / capturedDims.w) * 100}%`,
                    top: `${(corner[1] / capturedDims.h) * 100}%`,
                  }}
                >
                  <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white bg-[#414FA8] px-1.5 py-0.5 rounded">
                    {['TL', 'TR', 'BR', 'BL'][idx]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={applyCorrection}
              disabled={processing || corners.length !== 4}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 text-amber-300" />
                  <span>Apply & Scan</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setCapturedDataUrl(null); setRescanPageId(null); setMode(pages.length > 0 ? 'pages' : 'idle'); }}
              className="px-4 py-3 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium rounded-[4px] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ─── PAGES MODE: Results + Page Strip ─── */}
      {mode === 'pages' && pages.length > 0 && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-[4px] border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] border border-[#9AA3C8]/40 flex items-center justify-center shrink-0">
                <ScanLine className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-gray-900">
                  {pages.length} Page{pages.length !== 1 ? 's' : ''} Scanned
                </h3>
                <p className="text-[11px] text-gray-500">
                  Viewing Page {(currentPageIdx >= 0 ? currentPageIdx : 0) + 1} of {pages.length}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={addNewPage}
                disabled={pages.length >= MAX_PAGES}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] bg-[#414FA8] hover:bg-[#343f88] text-white text-xs font-semibold transition-colors disabled:bg-gray-400"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Page</span>
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Current Page Preview */}
          {currentPageIdx >= 0 && currentPageIdx < pages.length && (
            <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Page {pages[currentPageIdx].pageNumber} of {pages.length}
                  </span>
                  {pages.length > 1 && (
                    <div className="flex items-center gap-1 ml-2">
                      <button
                        type="button"
                        onClick={() => setCurrentPageIdx((prev) => Math.max(0, prev - 1))}
                        disabled={currentPageIdx === 0}
                        title="Previous Page"
                        className="p-1 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      >
                        <ChevronLeft className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrentPageIdx((prev) => Math.min(pages.length - 1, prev + 1))}
                        disabled={currentPageIdx === pages.length - 1}
                        title="Next Page"
                        className="p-1 rounded border border-gray-200 hover:bg-gray-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      >
                        <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {pages[currentPageIdx].width} × {pages[currentPageIdx].height} px
                </span>
              </div>

              <div className="flex justify-center bg-[#FAFAFC] p-3 border border-gray-200 rounded">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pages[currentPageIdx].imageDataUrl}
                  alt={`Scanned page ${pages[currentPageIdx].pageNumber}`}
                  className="max-h-80 max-w-full object-contain rounded shadow-xs"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                {/* Reorder buttons */}
                {pages.length > 1 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold text-gray-500">Reorder:</span>
                    <button
                      type="button"
                      onClick={() => movePage(currentPageIdx, currentPageIdx - 1)}
                      disabled={currentPageIdx === 0}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] border border-gray-200 hover:bg-[#EEF1FB] hover:text-[#414FA8] text-gray-700 text-xs font-medium disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Move page earlier"
                    >
                      <ChevronLeft className="h-3 w-3" />
                      <span>Move Left</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => movePage(currentPageIdx, currentPageIdx + 1)}
                      disabled={currentPageIdx === pages.length - 1}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] border border-gray-200 hover:bg-[#EEF1FB] hover:text-[#414FA8] text-gray-700 text-xs font-medium disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Move page later"
                    >
                      <span>Move Right</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                )}

                {/* Page actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => downloadSinglePage(pages[currentPageIdx])}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Download Page</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => startRescan(pages[currentPageIdx].id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Re-scan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => deletePage(pages[currentPageIdx].id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Page Thumbnail Strip */}
          <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block mb-3">
              All Pages
            </span>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
              {pages.map((page, idx) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setCurrentPageIdx(idx)}
                  className={`relative flex-shrink-0 rounded border-2 overflow-hidden transition-all ${
                    currentPageIdx === idx
                      ? 'border-[#414FA8] shadow-md ring-2 ring-[#414FA8]/20'
                      : 'border-gray-200 hover:border-gray-400'
                  }`}
                  style={{ width: 80 }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={page.thumbnail}
                    alt={`Page ${page.pageNumber}`}
                    className="w-full h-auto object-cover"
                  />
                  <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] font-bold text-center py-0.5">
                    {page.pageNumber}
                  </span>
                </button>
              ))}

              {/* Add Page Thumbnail */}
              {pages.length < MAX_PAGES && (
                <button
                  type="button"
                  onClick={addNewPage}
                  className="flex-shrink-0 flex flex-col items-center justify-center rounded border-2 border-dashed border-[#9AA3C8] bg-[#FAFAFC] hover:bg-[#EEF1FB] hover:border-[#414FA8] transition-colors text-[#414FA8]"
                  style={{ width: 80, minHeight: 90 }}
                >
                  <Plus className="h-5 w-5" />
                  <span className="text-[10px] font-bold mt-1">Add</span>
                </button>
              )}
            </div>
          </div>

          {/* Export Actions */}
          <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <Download className="h-4 w-4 text-[#414FA8]" />
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Export {pages.length} Page{pages.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={downloadPdf}
                disabled={processing}
                className="flex items-center justify-center gap-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 disabled:bg-gray-400 text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors disabled:cursor-not-allowed"
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
                <span>Download as PDF</span>
              </button>

              <button
                type="button"
                onClick={downloadZip}
                disabled={processing}
                className="flex items-center justify-center gap-2 py-3 px-5 border border-[#9AA3C8] bg-white hover:bg-[#EEF1FB] text-[#414FA8] font-bold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                {processing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImageIcon className="h-4 w-4" />
                )}
                <span>Download as Images (ZIP)</span>
              </button>
            </div>
          </div>

          {/* Privacy Badge */}
          <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Zero server uploads. All scanning, edge detection, and PDF generation happens locally in your browser.</span>
          </div>
        </div>
      )}
    </div>
  );
}
