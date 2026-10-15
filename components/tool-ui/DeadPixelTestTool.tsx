'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Monitor,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RefreshCw,
  Eye,
  Activity,
  Sparkles,
  Zap,
  Info,
  X,
  Keyboard,
  Headphones,
  Video,
  Mic,
} from 'lucide-react';

interface TestColor {
  id: string;
  name: string;
  hex: string;
  textColor: string;
  description: string;
}

const TEST_COLORS: TestColor[] = [
  { id: 'black', name: 'Pure Black', hex: '#000000', textColor: '#ffffff', description: 'Tests for stuck/hot pixels (white, red, green, blue) & backlight bleeding' },
  { id: 'white', name: 'Pure White', hex: '#FFFFFF', textColor: '#000000', description: 'Tests for dead pixels (black dots) & dirty screen effect' },
  { id: 'red', name: 'Pure Red', hex: '#FF0000', textColor: '#ffffff', description: 'Tests red sub-pixels & color uniformity' },
  { id: 'green', name: 'Pure Green', hex: '#00FF00', textColor: '#000000', description: 'Tests green sub-pixels (human eye is most sensitive to green)' },
  { id: 'blue', name: 'Pure Blue', hex: '#0000FF', textColor: '#ffffff', description: 'Tests blue sub-pixels & tinting' },
  { id: 'yellow', name: 'Pure Yellow', hex: '#FFFF00', textColor: '#000000', description: 'Combines red & green sub-pixels' },
  { id: 'cyan', name: 'Pure Cyan', hex: '#00FFFF', textColor: '#000000', description: 'Combines green & blue sub-pixels' },
  { id: 'magenta', name: 'Pure Magenta', hex: '#FF00FF', textColor: '#ffffff', description: 'Combines red & blue sub-pixels' },
  { id: 'gray50', name: '50% Neutral Gray', hex: '#808080', textColor: '#ffffff', description: 'Tests grayscale tracking & backlight uniformity' },
];

export function DeadPixelTestTool() {
  const [isFullscreenMode, setIsFullscreenMode] = useState<boolean>(false);
  const [currentColorIdx, setCurrentColorIdx] = useState<number>(0);
  const [isAutoCycling, setIsAutoCycling] = useState<boolean>(false);
  const [cycleIntervalSec, setCycleIntervalSec] = useState<number>(3);
  const [showControlsInFullscreen, setShowControlsInFullscreen] = useState<boolean>(true);

  // Screen Hardware Diagnostics
  const [screenWidth, setScreenWidth] = useState<number>(0);
  const [screenHeight, setScreenHeight] = useState<number>(0);
  const [colorDepth, setColorDepth] = useState<number>(24);
  const [pixelRatio, setPixelRatio] = useState<number>(1);
  const [measuredHz, setMeasuredHz] = useState<number>(60);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const autoCycleTimerRef = useRef<any>(null);
  const hideControlsTimerRef = useRef<any>(null);

  // Measure screen refresh rate (Hz)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    setScreenWidth(window.screen.width);
    setScreenHeight(window.screen.height);
    setColorDepth(window.screen.colorDepth || 24);
    setPixelRatio(window.devicePixelRatio || 1);

    let frameCount = 0;
    let startTime = performance.now();
    let animId: number;

    const measureHz = (now: number) => {
      frameCount++;
      if (now - startTime >= 1000) {
        const calculatedHz = Math.round((frameCount * 1000) / (now - startTime));
        // Normalize common refresh rates: 60, 75, 90, 120, 144, 165, 240
        setMeasuredHz(calculatedHz);
      } else {
        animId = requestAnimationFrame(measureHz);
      }
    };

    animId = requestAnimationFrame(measureHz);
    return () => cancelAnimationFrame(animId);
  }, []);

  /* ─── Next / Prev Color Handlers ─── */
  const nextColor = useCallback(() => {
    setCurrentColorIdx((prev) => (prev + 1) % TEST_COLORS.length);
  }, []);

  const prevColor = useCallback(() => {
    setCurrentColorIdx((prev) => (prev - 1 + TEST_COLORS.length) % TEST_COLORS.length);
  }, []);

  /* ─── Auto-Cycle Timer ─── */
  useEffect(() => {
    if (isAutoCycling && isFullscreenMode) {
      autoCycleTimerRef.current = setInterval(() => {
        nextColor();
      }, cycleIntervalSec * 1000);
    } else {
      if (autoCycleTimerRef.current) {
        clearInterval(autoCycleTimerRef.current);
        autoCycleTimerRef.current = null;
      }
    }
    return () => {
      if (autoCycleTimerRef.current) clearInterval(autoCycleTimerRef.current);
    };
  }, [isAutoCycling, isFullscreenMode, cycleIntervalSec, nextColor]);

  /* ─── Fullscreen Handlers ─── */
  const enterFullscreen = () => {
    if (!containerRef.current) return;
    if (containerRef.current.requestFullscreen) {
      containerRef.current.requestFullscreen().catch(() => {});
    }
    setIsFullscreenMode(true);
    resetHideControlsTimer();
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setIsFullscreenMode(false);
    setIsAutoCycling(false);
  };

  useEffect(() => {
    const handleFsChange = () => {
      if (!document.fullscreenElement) {
        setIsFullscreenMode(false);
        setIsAutoCycling(false);
      }
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  /* ─── Keyboard Controls in Fullscreen ─── */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreenMode) return;

      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        nextColor();
        resetHideControlsTimer();
      } else if (e.key === 'ArrowLeft' || e.key === 'Backspace') {
        e.preventDefault();
        prevColor();
        resetHideControlsTimer();
      } else if (e.key === 'Escape') {
        exitFullscreen();
      } else if (e.key.toLowerCase() === 'p') {
        setIsAutoCycling((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreenMode, nextColor, prevColor]);

  /* ─── Auto-hide HUD controls after 3 seconds of inactivity ─── */
  const resetHideControlsTimer = () => {
    setShowControlsInFullscreen(true);
    if (hideControlsTimerRef.current) clearTimeout(hideControlsTimerRef.current);
    hideControlsTimerRef.current = setTimeout(() => {
      setShowControlsInFullscreen(false);
    }, 3000);
  };

  const activeColor = TEST_COLORS[currentColorIdx];

  return (
    <div className="space-y-6">
      {/* Interactive Fullscreen Stage Container */}
      <div
        ref={containerRef}
        onClick={(e) => {
          if (isFullscreenMode) {
            // Click anywhere to advance color
            nextColor();
            resetHideControlsTimer();
          }
        }}
        onMouseMove={resetHideControlsTimer}
        style={{ backgroundColor: activeColor.hex }}
        className={`relative rounded-[6px] border border-gray-800 overflow-hidden shadow-md transition-colors duration-200 select-none ${
          isFullscreenMode
            ? 'fixed inset-0 z-50 h-screen w-screen rounded-none border-none cursor-pointer'
            : 'min-h-[380px] sm:min-h-[440px] flex flex-col justify-between p-4 sm:p-6'
        }`}
      >
        {/* Fullscreen Overlay HUD */}
        {isFullscreenMode && (
          <div
            onClick={(e) => e.stopPropagation()}
            className={`fixed top-4 left-1/2 -translate-x-1/2 transition-opacity duration-300 z-50 ${
              showControlsInFullscreen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="bg-black/85 backdrop-blur-md px-4 py-2.5 rounded-full border border-white/20 text-white shadow-2xl flex items-center gap-3 text-xs font-semibold">
              <span className="font-bold">{activeColor.name}</span>
              <span className="text-gray-400">({currentColorIdx + 1} / {TEST_COLORS.length})</span>

              <div className="flex items-center gap-1 border-l border-white/20 pl-2">
                <button
                  type="button"
                  onClick={prevColor}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Previous Color (Left Arrow)"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsAutoCycling((prev) => !prev)}
                  className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded transition-colors text-[11px]"
                  title="Toggle Slideshow"
                >
                  {isAutoCycling ? 'Pause' : 'Auto Play'}
                </button>
                <button
                  type="button"
                  onClick={nextColor}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                  title="Next Color (Right Arrow or Click)"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={exitFullscreen}
                className="ml-1 p-1 hover:bg-red-500/80 rounded transition-colors text-gray-300 hover:text-white"
                title="Exit Fullscreen (Esc)"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {/* Normal Embedded Mode Viewport */}
        {!isFullscreenMode && (
          <>
            {/* Top Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-black/60 backdrop-blur-md p-3 rounded-[4px] border border-white/10 text-white">
              <div className="flex items-center gap-2">
                <div
                  className="h-3.5 w-3.5 rounded-full border border-white/40"
                  style={{ backgroundColor: activeColor.hex }}
                />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {activeColor.name} Test Pattern
                </span>
                <span className="text-[11px] text-gray-400">
                  ({currentColorIdx + 1} of {TEST_COLORS.length})
                </span>
              </div>

              <button
                type="button"
                onClick={enterFullscreen}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] text-white text-xs font-bold rounded-[4px] shadow-xs transition-colors"
              >
                <Maximize2 className="h-3.5 w-3.5" />
                <span>Start Full-Screen Test</span>
              </button>
            </div>

            {/* Center Hint */}
            <div className="flex flex-col items-center justify-center my-8 text-center px-4">
              <div className="bg-black/65 backdrop-blur-md p-5 rounded-lg border border-white/15 max-w-md text-white shadow-lg space-y-2">
                <Monitor className="h-8 w-8 text-[#414FA8] mx-auto mb-1" />
                <h3 className="text-sm font-bold">{activeColor.name} Screen Mode</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {activeColor.description}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={enterFullscreen}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded shadow-xs transition-colors"
                  >
                    <Maximize2 className="h-4 w-4" />
                    <span>Open Fullscreen & Inspect Pixels</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Color Swatches Bar */}
            <div className="bg-black/60 backdrop-blur-md p-3 rounded-[4px] border border-white/10 text-white flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                {TEST_COLORS.map((color, idx) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setCurrentColorIdx(idx)}
                    title={color.name}
                    className={`h-7 w-7 rounded-full border-2 transition-transform ${
                      currentColorIdx === idx
                        ? 'border-white scale-110 shadow-md ring-2 ring-indigo-400'
                        : 'border-white/30 hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.hex }}
                  />
                ))}
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={prevColor}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded text-white transition-colors"
                >
                  ◀ Prev
                </button>
                <button
                  type="button"
                  onClick={nextColor}
                  className="px-3 py-1 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded text-white transition-colors"
                >
                  Next ▶
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Screen Hardware Specs & Dead vs Stuck Pixel Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Hardware Display Specs */}
        <div className="bg-white p-4 sm:p-5 rounded-[6px] border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
            <Activity className="h-4 w-4 text-[#414FA8]" />
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Display Hardware Diagnostics
            </h4>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-gray-50 border border-gray-100 rounded">
              <span className="text-gray-400 text-[11px] block">Screen Resolution</span>
              <span className="font-bold text-gray-800 text-sm">
                {screenWidth > 0 ? `${screenWidth} × ${screenHeight}` : 'Detecting...'}
              </span>
            </div>
            <div className="p-2.5 bg-gray-50 border border-gray-100 rounded">
              <span className="text-gray-400 text-[11px] block">Measured Refresh Rate</span>
              <span className="font-bold text-emerald-600 text-sm">
                ~{measuredHz} Hz Display
              </span>
            </div>
            <div className="p-2.5 bg-gray-50 border border-gray-100 rounded">
              <span className="text-gray-400 text-[11px] block">Color Bit Depth</span>
              <span className="font-bold text-gray-800 text-sm">{colorDepth}-bit TrueColor</span>
            </div>
            <div className="p-2.5 bg-gray-50 border border-gray-100 rounded">
              <span className="text-gray-400 text-[11px] block">Device Pixel Ratio (DPR)</span>
              <span className="font-bold text-gray-800 text-sm">{pixelRatio}x (Hi-DPI)</span>
            </div>
          </div>

          <div className="pt-1">
            <span className="text-[11px] font-semibold text-gray-500 block mb-1.5">
              Fullscreen Keyboard Controls:
            </span>
            <div className="flex flex-wrap gap-2 text-[11px] text-gray-600">
              <span className="bg-gray-100 px-2 py-0.5 rounded font-mono">Right Arrow / Space: Next Color</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded font-mono">Left Arrow: Prev Color</span>
              <span className="bg-gray-100 px-2 py-0.5 rounded font-mono">Esc: Exit Fullscreen</span>
            </div>
          </div>
        </div>

        {/* Dead Pixel vs Stuck Pixel Diagnostic Guide */}
        <div className="bg-white p-4 sm:p-5 rounded-[6px] border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
            <Eye className="h-4 w-4 text-[#414FA8]" />
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              How to Spot Dead vs Stuck Pixels
            </h4>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 bg-red-50 border border-red-200 rounded">
              <span className="font-bold text-red-800 block">1. Dead Pixel (Permanent Black)</span>
              <p className="text-red-700 text-[11px] mt-0.5">
                Shows as a persistent black dot on the <strong>Pure White</strong> test screen. The sub-pixel transistor is completely unpowered.
              </p>
            </div>

            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded">
              <span className="font-bold text-amber-800 block">2. Stuck Pixel (Colored Dot)</span>
              <p className="text-amber-700 text-[11px] mt-0.5">
                Shows as a persistent Red, Green, or Blue dot on the <strong>Pure Black</strong> test screen. Often fixable with rapid color cycling.
              </p>
            </div>

            <div className="p-2.5 bg-gray-50 border border-gray-200 rounded">
              <span className="font-bold text-gray-800 block">3. Backlight Bleed / IPS Glow</span>
              <p className="text-gray-600 text-[11px] mt-0.5">
                In a dark room on the <strong>Pure Black</strong> screen, check the monitor corners for yellowish or whitish glow leaking from the edges.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Paired Quick Tool Links & Privacy Card */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#EEF1FB] p-4 rounded-[6px] border border-[#9AA3C8]/40 text-[#414FA8]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="text-xs text-gray-700">
            <strong>100% Client-Side Test:</strong> Runs directly on your device screen hardware. Works on phones, monitors, and laptops.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/tools/keyboard-test"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-[#9AA3C8] text-[#414FA8] text-xs font-semibold rounded-[4px] transition-colors"
          >
            <Keyboard className="h-3.5 w-3.5" />
            <span>Test Keyboard</span>
          </Link>
          <Link
            href="/tools/speaker-test"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-[#9AA3C8] text-[#414FA8] text-xs font-semibold rounded-[4px] transition-colors"
          >
            <Headphones className="h-3.5 w-3.5" />
            <span>Test Speakers</span>
          </Link>
          <Link
            href="/tools/webcam-test"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs font-semibold rounded-[4px] transition-colors"
          >
            <Video className="h-3.5 w-3.5" />
            <span>Test Webcam</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
