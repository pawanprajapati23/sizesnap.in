'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Video,
  VideoOff,
  Camera,
  RefreshCw,
  Maximize,
  Minimize,
  Download,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sliders,
  Sparkles,
  FlipHorizontal,
  Mic,
  Sun,
  Eye,
  Activity,
  Layers,
  Settings2,
} from 'lucide-react';

interface VideoDeviceInfo {
  deviceId: string;
  label: string;
}

export function WebcamTestTool() {
  // Stream & Hardware
  const [devices, setDevices] = useState<VideoDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Video technical specs
  const [resolution, setResolution] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [fps, setFps] = useState<number>(0);
  const [aspectRatio, setAspectRatio] = useState<string>('');
  const [cameraLabel, setCameraLabel] = useState<string>('');

  // Live adjustments
  const [mirror, setMirror] = useState<boolean>(true);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [grayscale, setGrayscale] = useState<boolean>(false);

  // Snapshot
  const [snapshotUrl, setSnapshotUrl] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);

  // Fullscreen
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const fpsFrameCountRef = useRef<number>(0);
  const fpsLastTimeRef = useRef<number>(0);
  const fpsAnimIdRef = useRef<number>(0);

  /* ─── List Video Devices ─── */
  const enumerateVideoDevices = useCallback(async () => {
    try {
      if (!navigator.mediaDevices?.enumerateDevices) return;
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoInputs = allDevices
        .filter((d) => d.kind === 'videoinput')
        .map((d, index) => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${index + 1}`,
        }));
      setDevices(videoInputs);
      if (videoInputs.length > 0 && !selectedDeviceId) {
        setSelectedDeviceId(videoInputs[0].deviceId);
      }
    } catch (err) {
      console.warn('Unable to enumerate video devices:', err);
    }
  }, [selectedDeviceId]);

  /* ─── Stop Camera Stream ─── */
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    cancelAnimationFrame(fpsAnimIdRef.current);
    setIsStreaming(false);
    setFps(0);
  }, []);

  /* ─── Measure FPS Real-Time ─── */
  const measureFps = useCallback(() => {
    const now = performance.now();
    fpsFrameCountRef.current++;

    if (now - fpsLastTimeRef.current >= 1000) {
      const calculatedFps = Math.round(
        (fpsFrameCountRef.current * 1000) / (now - fpsLastTimeRef.current)
      );
      setFps(calculatedFps);
      fpsFrameCountRef.current = 0;
      fpsLastTimeRef.current = now;
    }

    fpsAnimIdRef.current = requestAnimationFrame(measureFps);
  }, []);

  /* ─── Start Camera Stream ─── */
  const startCamera = useCallback(
    async (deviceIdToUse?: string) => {
      setError(null);
      setIsLoading(true);
      stopCamera();

      try {
        const constraints: MediaStreamConstraints = {
          video: {
            deviceId: deviceIdToUse ? { exact: deviceIdToUse } : undefined,
            width: { ideal: 1920, max: 3840 },
            height: { ideal: 1080, max: 2160 },
          },
          audio: false,
        };

        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia(constraints);
        } catch {
          // Fallback to basic constraint if exact resolution is rejected
          stream = await navigator.mediaDevices.getUserMedia({
            video: deviceIdToUse ? { deviceId: { exact: deviceIdToUse } } : true,
            audio: false,
          });
        }

        streamRef.current = stream;

        // Attach to video
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }

        setIsStreaming(true);
        setIsLoading(false);

        // Read active track metadata
        const videoTrack = stream.getVideoTracks()[0];
        if (videoTrack) {
          setCameraLabel(videoTrack.label || 'Webcam Active');
          const settings = videoTrack.getSettings ? videoTrack.getSettings() : null;
          const w = settings?.width || videoRef.current?.videoWidth || 1280;
          const h = settings?.height || videoRef.current?.videoHeight || 720;
          setResolution({ width: w, height: h });

          // Calculate Aspect Ratio
          const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
          const divisor = gcd(w, h);
          setAspectRatio(`${Math.round(w / divisor)}:${Math.round(h / divisor)}`);
        }

        // Start FPS tracking
        fpsFrameCountRef.current = 0;
        fpsLastTimeRef.current = performance.now();
        fpsAnimIdRef.current = requestAnimationFrame(measureFps);

        // Re-enumerate to get full hardware labels (now that permission is granted)
        await enumerateVideoDevices();
      } catch (err: any) {
        setIsLoading(false);
        setIsStreaming(false);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          setError('Camera permission was denied. Please allow camera permissions in your browser address bar.');
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          setError('No camera detected. Please plug in or enable your webcam and retry.');
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          setError('Camera is currently in use by another application (e.g., Zoom, Teams, Skype). Please close it and retry.');
        } else {
          setError(`Camera error: ${err.message || 'Unable to access webcam.'}`);
        }
      }
    },
    [enumerateVideoDevices, measureFps, stopCamera]
  );

  /* ─── Auto-detect on mount ─── */
  useEffect(() => {
    enumerateVideoDevices();
    return () => {
      stopCamera();
    };
  }, [enumerateVideoDevices, stopCamera]);

  /* ─── Handle Device Change ─── */
  const handleDeviceChange = (newDeviceId: string) => {
    setSelectedDeviceId(newDeviceId);
    if (isStreaming) {
      startCamera(newDeviceId);
    }
  };

  /* ─── Video Filter Style ─── */
  const videoFilterStyle: React.CSSProperties = {
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${grayscale ? 0 : saturation}%)`,
    transform: mirror ? 'scaleX(-1)' : 'none',
  };

  /* ─── Take Snapshot ─── */
  const triggerSnapshot = () => {
    if (!videoRef.current || !isStreaming) return;

    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          captureSnapshotNow();
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const captureSnapshotNow = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d')!;

    if (mirror) {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${grayscale ? 0 : saturation}%)`;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setSnapshotUrl(dataUrl);
  };

  const downloadSnapshot = () => {
    if (!snapshotUrl) return;
    const a = document.createElement('a');
    a.href = snapshotUrl;
    a.download = `webcam-test-${resolution.width}x${resolution.height}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  /* ─── Fullscreen Toggle ─── */
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  /* ─── Reset Quality Settings ─── */
  const resetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setGrayscale(false);
    setMirror(true);
  };

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[4px] shadow-xs">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold">Camera Access Blocked or Not Found</p>
            <p className="mt-0.5 text-red-600">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-xs text-red-800 font-bold hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Main Viewfinder Card */}
      <div
        ref={containerRef}
        className={`relative bg-[#0F1117] rounded-[6px] border border-gray-800 overflow-hidden shadow-md flex flex-col ${
          isFullscreen ? 'h-screen w-screen p-4' : 'min-h-[420px]'
        }`}
      >
        {/* Top Viewfinder Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#171923] border-b border-gray-800 text-white z-10">
          <div className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                isStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
              {isStreaming ? 'Webcam Live' : 'Camera Off'}
            </span>

            {isStreaming && resolution.width > 0 && (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold rounded">
                <CheckCircle2 className="h-3 w-3" />
                {resolution.width} × {resolution.height} ({resolution.height >= 1080 ? 'Full HD' : resolution.height >= 720 ? 'HD' : 'SD'})
              </span>
            )}
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-2">
            {isStreaming && (
              <>
                <button
                  type="button"
                  onClick={() => setMirror((prev) => !prev)}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                    mirror
                      ? 'bg-[#414FA8] text-white'
                      : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                  }`}
                  title="Flip Video Horizontally (Mirror)"
                >
                  <FlipHorizontal className="h-3.5 w-3.5" />
                  <span className="hidden md:inline">Mirror</span>
                </button>

                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded transition-colors"
                  title="Toggle Fullscreen"
                >
                  {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
                </button>
              </>
            )}

            {!isStreaming ? (
              <button
                type="button"
                onClick={() => startCamera(selectedDeviceId)}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] text-white text-xs font-bold rounded-[4px] transition-colors shadow-xs"
              >
                <Video className="h-4 w-4" />
                <span>{isLoading ? 'Connecting...' : 'Test My Cam'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={stopCamera}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600/90 hover:bg-red-700 text-white text-xs font-bold rounded-[4px] transition-colors shadow-xs"
              >
                <VideoOff className="h-4 w-4" />
                <span>Stop Camera</span>
              </button>
            )}
          </div>
        </div>

        {/* Video Canvas Container */}
        <div className="relative flex-1 flex items-center justify-center bg-[#090A0F] overflow-hidden min-h-[340px] sm:min-h-[460px]">
          {isStreaming ? (
            <>
              <video
                ref={(el) => {
                  videoRef.current = el;
                  if (el && streamRef.current && el.srcObject !== streamRef.current) {
                    el.srcObject = streamRef.current;
                    el.play().catch(() => {});
                  }
                }}
                autoPlay
                playsInline
                muted
                style={videoFilterStyle}
                className="w-full h-full max-h-[72vh] object-contain transition-all duration-75"
              />

              {/* Countdown Overlay for Snapshot */}
              {countdown !== null && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
                  <div className="h-24 w-24 rounded-full bg-[#414FA8] text-white flex items-center justify-center text-4xl font-black animate-ping">
                    {countdown}
                  </div>
                </div>
              )}

              {/* Realtime Stats HUD in Bottom Corner */}
              <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded text-white text-[11px] font-mono flex items-center gap-3 border border-white/10 z-10 pointer-events-none">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Activity className="h-3 w-3" />
                  {fps} FPS
                </span>
                <span className="text-gray-400">|</span>
                <span>{resolution.width}×{resolution.height}</span>
                {aspectRatio && (
                  <>
                    <span className="text-gray-400">|</span>
                    <span className="text-gray-300">{aspectRatio}</span>
                  </>
                )}
              </div>
            </>
          ) : (
            /* Idle Screen */
            <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
              <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 mb-4">
                <Video className="h-8 w-8 text-[#414FA8]" />
              </div>
              <h3 className="text-base font-bold text-white mb-1.5">Webcam Test Online</h3>
              <p className="text-xs text-gray-400 mb-6">
                Test your camera quality, resolution, FPS, and framing before joining Zoom, Google Meet, Microsoft Teams, or online exams.
              </p>
              <button
                type="button"
                onClick={() => startCamera(selectedDeviceId)}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] text-white text-xs sm:text-sm font-bold rounded-[4px] shadow-md transition-colors"
              >
                <Video className="h-4 w-4" />
                <span>{isLoading ? 'Opening Camera...' : 'Start Webcam Test'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Viewfinder Bottom Bar (Controls & Snapshot) */}
        {isStreaming && (
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#171923] border-t border-gray-800 text-white z-10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={triggerSnapshot}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition-colors shadow-xs"
              >
                <Camera className="h-3.5 w-3.5" />
                <span>Take Photo (3s Timer)</span>
              </button>
              <button
                type="button"
                onClick={captureSnapshotNow}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium rounded transition-colors"
              >
                <span>Instant Photo</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400 truncate max-w-[200px]">
                {cameraLabel || 'Connected Webcam'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Snapshot Preview Card */}
      {snapshotUrl && (
        <div className="p-4 bg-white border border-gray-200 rounded-[6px] shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2">
            <div className="flex items-center gap-2">
              <Camera className="h-4 w-4 text-[#414FA8]" />
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Snapshot Photo Preview ({resolution.width} × {resolution.height})
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSnapshotUrl(null)}
              className="text-xs text-gray-500 hover:text-red-600 font-medium"
            >
              Close
            </button>
          </div>

          <div className="flex justify-center bg-gray-900 p-2 rounded">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={snapshotUrl}
              alt="Webcam snapshot capture"
              className="max-h-72 w-auto object-contain rounded"
            />
          </div>

          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-[11px] text-gray-500">
              High resolution snapshot captured from live webcam feed.
            </span>
            <button
              type="button"
              onClick={downloadSnapshot}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs font-semibold rounded-[4px] shadow-xs transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Snapshot</span>
            </button>
          </div>
        </div>
      )}

      {/* Camera Selection & Settings Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Device Selector & Readiness Status */}
        <div className="bg-white p-4 sm:p-5 rounded-[6px] border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
            <Settings2 className="h-4 w-4 text-[#414FA8]" />
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Camera Device & Specs
            </h4>
          </div>

          {/* Device dropdown */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Select Camera Device
            </label>
            <select
              value={selectedDeviceId}
              onChange={(e) => handleDeviceChange(e.target.value)}
              className="w-full text-xs font-medium bg-[#FAFAFC] border border-gray-200 rounded-[4px] p-2.5 text-gray-800 focus:outline-none focus:border-[#414FA8]"
            >
              {devices.length === 0 ? (
                <option value="">Default Web Camera</option>
              ) : (
                devices.map((d) => (
                  <option key={d.deviceId} value={d.deviceId}>
                    {d.label}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Technical Diagnostics */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-gray-50 border border-gray-100 rounded">
              <span className="text-gray-400 text-[11px] block">Resolution</span>
              <span className="font-bold text-gray-800">
                {isStreaming && resolution.width > 0 ? `${resolution.width} × ${resolution.height}` : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-gray-50 border border-gray-100 rounded">
              <span className="text-gray-400 text-[11px] block">Frame Rate</span>
              <span className="font-bold text-gray-800">
                {isStreaming && fps > 0 ? `${fps} FPS` : '—'}
              </span>
            </div>
            <div className="p-2.5 bg-gray-50 border border-gray-100 rounded">
              <span className="text-gray-400 text-[11px] block">Aspect Ratio</span>
              <span className="font-bold text-gray-800">{isStreaming && aspectRatio ? aspectRatio : '—'}</span>
            </div>
            <div className="p-2.5 bg-gray-50 border border-gray-100 rounded">
              <span className="text-gray-400 text-[11px] block">Hardware Status</span>
              <span className={`font-bold ${isStreaming ? 'text-emerald-600' : 'text-gray-500'}`}>
                {isStreaming ? 'Active' : 'Standby'}
              </span>
            </div>
          </div>

          {/* App Compatibility Badges */}
          <div className="pt-1">
            <span className="text-[11px] font-semibold text-gray-500 block mb-2">
              Application Readiness Checklist:
            </span>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className={`px-2 py-1 rounded font-medium flex items-center gap-1 ${isStreaming ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'}`}>
                <CheckCircle2 className="h-3 w-3" /> Zoom
              </span>
              <span className={`px-2 py-1 rounded font-medium flex items-center gap-1 ${isStreaming ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'}`}>
                <CheckCircle2 className="h-3 w-3" /> Google Meet
              </span>
              <span className={`px-2 py-1 rounded font-medium flex items-center gap-1 ${isStreaming ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'}`}>
                <CheckCircle2 className="h-3 w-3" /> Microsoft Teams
              </span>
              <span className={`px-2 py-1 rounded font-medium flex items-center gap-1 ${isStreaming ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500'}`}>
                <CheckCircle2 className="h-3 w-3" /> TCS iON / Online Exams
              </span>
            </div>
          </div>
        </div>

        {/* Video Appearance Controls (Sliders) */}
        <div className="bg-white p-4 sm:p-5 rounded-[6px] border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-[#414FA8]" />
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Video Lighting & Quality Adjustments
              </h4>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              className="text-[11px] font-semibold text-[#414FA8] hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Brightness */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
              <span className="flex items-center gap-1.5">
                <Sun className="h-3.5 w-3.5 text-amber-500" />
                Brightness
              </span>
              <span className="text-gray-500">{brightness}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={160}
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-[#414FA8] cursor-pointer"
            />
          </div>

          {/* Contrast */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                Contrast
              </span>
              <span className="text-gray-500">{contrast}%</span>
            </div>
            <input
              type="range"
              min={50}
              max={160}
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full accent-[#414FA8] cursor-pointer"
            />
          </div>

          {/* Saturation */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
              <span className="flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-pink-500" />
                Color Saturation
              </span>
              <span className="text-gray-500">{saturation}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={200}
              value={saturation}
              disabled={grayscale}
              onChange={(e) => setSaturation(Number(e.target.value))}
              className="w-full accent-[#414FA8] cursor-pointer disabled:opacity-40"
            />
          </div>

          {/* Toggles */}
          <div className="pt-2 flex items-center justify-between border-t border-gray-100">
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={mirror}
                onChange={(e) => setMirror(e.target.checked)}
                className="rounded accent-[#414FA8] h-3.5 w-3.5"
              />
              <span>Mirror camera view (Selfie mode)</span>
            </label>

            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={grayscale}
                onChange={(e) => setGrayscale(e.target.checked)}
                className="rounded accent-[#414FA8] h-3.5 w-3.5"
              />
              <span>Black & White</span>
            </label>
          </div>
        </div>
      </div>

      {/* Paired Quick Tool Links & Privacy Card */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#EEF1FB] p-4 rounded-[6px] border border-[#9AA3C8]/40 text-[#414FA8]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="text-xs text-gray-700">
            <strong>100% Private & In-Browser:</strong> SizeSnap never records, transmits, or stores your webcam video feed on any server.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/tools/mic-test"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-[#9AA3C8] text-[#414FA8] text-xs font-semibold rounded-[4px] transition-colors"
          >
            <Mic className="h-3.5 w-3.5" />
            <span>Test Microphone</span>
          </Link>
          <Link
            href="/tools/document-scanner"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs font-semibold rounded-[4px] transition-colors"
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Document Scanner</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
