'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  Mouse,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  Activity,
  Timer,
  Sliders,
  Keyboard,
  Headphones,
  Video,
  Mic,
  Monitor,
} from 'lucide-react';

export function MouseTestTool() {
  // Button click counters
  const [leftClicks, setLeftClicks] = useState<number>(0);
  const [rightClicks, setRightClicks] = useState<number>(0);
  const [middleClicks, setMiddleClicks] = useState<number>(0);
  const [sideBackClicks, setSideBackClicks] = useState<number>(0);
  const [sideForwardClicks, setSideForwardClicks] = useState<number>(0);

  // Wheel scroll counters
  const [scrollUpCount, setScrollUpCount] = useState<number>(0);
  const [scrollDownCount, setScrollDownCount] = useState<number>(0);
  const [wheelDeltaY, setWheelDeltaY] = useState<number>(0);

  // Active button pressed state for real-time visual highlight
  const [activeButton, setActiveButton] = useState<number | null>(null);

  // Double Click / Switch Chatter Detection
  const [doubleClickCount, setDoubleClickCount] = useState<number>(0);
  const [lastClickTime, setLastClickTime] = useState<number>(0);
  const [fastestClickGapMs, setFastestClickGapMs] = useState<number | null>(null);
  const [potentialDoubleClicks, setPotentialDoubleClicks] = useState<number>(0);

  // CPS (Clicks Per Second) Speed Test
  const [cpsDuration, setCpsDuration] = useState<number>(5); // 5s or 10s
  const [cpsActive, setCpsActive] = useState<boolean>(false);
  const [cpsClicks, setCpsClicks] = useState<number>(0);
  const [cpsTimeLeft, setCpsTimeLeft] = useState<number>(5);
  const [cpsScore, setCpsScore] = useState<number | null>(null);
  const cpsTimerRef = useRef<any>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);

  /* ─── Mouse Down Handler ─── */
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setActiveButton(e.button);

    const now = performance.now();
    setLastClickTime((prev) => {
      if (prev > 0) {
        const gap = Math.round(now - prev);
        if (gap < 80) {
          // Switch chatter / defect indicator
          setPotentialDoubleClicks((c) => c + 1);
        }
        setFastestClickGapMs((f) => (f === null ? gap : Math.min(f, gap)));
      }
      return now;
    });

    // Map buttons
    switch (e.button) {
      case 0: // Left
        setLeftClicks((c) => c + 1);
        break;
      case 1: // Middle
        setMiddleClicks((c) => c + 1);
        break;
      case 2: // Right
        setRightClicks((c) => c + 1);
        break;
      case 3: // Browser Back
        setSideBackClicks((c) => c + 1);
        break;
      case 4: // Browser Forward
        setSideForwardClicks((c) => c + 1);
        break;
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    setActiveButton(null);
  }, []);

  /* ─── Wheel Handler ─── */
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setWheelDeltaY(e.deltaY);
    if (e.deltaY < 0) {
      setScrollUpCount((c) => c + 1);
    } else if (e.deltaY > 0) {
      setScrollDownCount((c) => c + 1);
    }
  }, []);

  /* ─── CPS Test Click Handler ─── */
  const handleCpsBoxClick = () => {
    if (!cpsActive && cpsTimeLeft === cpsDuration) {
      // Start test on first click
      setCpsActive(true);
      setCpsClicks(1);
      setCpsScore(null);

      let timeLeft = cpsDuration;
      cpsTimerRef.current = setInterval(() => {
        timeLeft -= 1;
        setCpsTimeLeft(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(cpsTimerRef.current);
          setCpsActive(false);
          setCpsClicks((finalClicks) => {
            setCpsScore(parseFloat((finalClicks / cpsDuration).toFixed(1)));
            return finalClicks;
          });
        }
      }, 1000);
    } else if (cpsActive) {
      setCpsClicks((c) => c + 1);
    }
  };

  const resetCpsTest = () => {
    if (cpsTimerRef.current) clearInterval(cpsTimerRef.current);
    setCpsActive(false);
    setCpsClicks(0);
    setCpsTimeLeft(cpsDuration);
    setCpsScore(null);
  };

  /* ─── Clear All Test Counters ─── */
  const resetAll = () => {
    setLeftClicks(0);
    setRightClicks(0);
    setMiddleClicks(0);
    setSideBackClicks(0);
    setSideForwardClicks(0);
    setScrollUpCount(0);
    setScrollDownCount(0);
    setWheelDeltaY(0);
    setActiveButton(null);
    setDoubleClickCount(0);
    setFastestClickGapMs(null);
    setPotentialDoubleClicks(0);
    resetCpsTest();
  };

  // Prevent right click menu on test stage
  const preventContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      {/* Visual Mouse Graphic Card & Test Pad */}
      <div className="bg-[#0F1117] rounded-[6px] border border-gray-800 overflow-hidden shadow-md text-white">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#171923] border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                activeButton !== null ? 'bg-emerald-500 animate-ping' : 'bg-[#414FA8]'
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
              Interactive Mouse & Click Tester
            </span>

            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold rounded">
              <CheckCircle2 className="h-3 w-3" />
              {leftClicks + rightClicks + middleClicks + scrollUpCount + scrollDownCount} Actions Registered
            </span>
          </div>

          <button
            type="button"
            onClick={resetAll}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Counters</span>
          </button>
        </div>

        {/* Interactive Mouse Test Stage */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onWheel={handleWheel}
          onContextMenu={preventContextMenu}
          className="p-6 sm:p-10 flex flex-col md:flex-row items-center justify-around gap-8 select-none cursor-crosshair bg-[#0B0D14]"
        >
          {/* Visual 2D Mouse SVG Diagram */}
          <div className="relative w-52 h-72 shrink-0">
            {/* Mouse Body Outline SVG */}
            <svg viewBox="0 0 200 300" className="w-full h-full drop-shadow-xl">
              {/* Outer Shell */}
              <path
                d="M 50 120 C 50 40, 150 40, 150 120 L 150 200 C 150 270, 50 270, 50 200 Z"
                fill="#161922"
                stroke="#2A2F3D"
                strokeWidth="4"
              />

              {/* Left Mouse Button */}
              <path
                d="M 52 115 C 52 50, 95 45, 95 45 L 95 115 Z"
                fill={activeButton === 0 ? '#10b981' : leftClicks > 0 ? '#064e3b' : '#222736'}
                stroke={activeButton === 0 ? '#34d399' : leftClicks > 0 ? '#10b981' : '#374151'}
                strokeWidth="3"
                className="transition-colors duration-75"
              />

              {/* Right Mouse Button */}
              <path
                d="M 105 45 C 105 45, 148 50, 148 115 L 105 115 Z"
                fill={activeButton === 2 ? '#10b981' : rightClicks > 0 ? '#064e3b' : '#222736'}
                stroke={activeButton === 2 ? '#34d399' : rightClicks > 0 ? '#10b981' : '#374151'}
                strokeWidth="3"
                className="transition-colors duration-75"
              />

              {/* Scroll Wheel Center */}
              <rect
                x="94"
                y="65"
                width="12"
                height="32"
                rx="6"
                fill={activeButton === 1 ? '#10b981' : middleClicks > 0 ? '#047857' : '#374151'}
                stroke="#4b5563"
                strokeWidth="2"
                className="transition-colors duration-75"
              />

              {/* Side Button 1 (Back / M4) */}
              <rect
                x="44"
                y="130"
                width="6"
                height="22"
                rx="3"
                fill={activeButton === 3 ? '#10b981' : sideBackClicks > 0 ? '#047857' : '#374151'}
                stroke="#4b5563"
                strokeWidth="1.5"
              />

              {/* Side Button 2 (Forward / M5) */}
              <rect
                x="44"
                y="160"
                width="6"
                height="22"
                rx="3"
                fill={activeButton === 4 ? '#10b981' : sideForwardClicks > 0 ? '#047857' : '#374151'}
                stroke="#4b5563"
                strokeWidth="1.5"
              />
            </svg>

            {/* In-diagram Labels */}
            <div className="absolute top-12 left-10 text-[10px] font-bold text-gray-300 pointer-events-none">
              LEFT ({leftClicks})
            </div>
            <div className="absolute top-12 right-10 text-[10px] font-bold text-gray-300 pointer-events-none">
              RIGHT ({rightClicks})
            </div>
            <div className="absolute top-28 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-400 pointer-events-none text-center">
              WHEEL ({middleClicks})
            </div>
          </div>

          {/* Real-time Status Badges */}
          <div className="flex-1 max-w-sm space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Live Click Counts
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`p-2.5 rounded border transition-colors ${leftClicks > 0 ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-gray-900 border-gray-800 text-gray-400'}`}>
                <span className="text-[10px] block opacity-70">Left Click</span>
                <span className="text-base font-bold text-white">{leftClicks} clicks</span>
              </div>

              <div className={`p-2.5 rounded border transition-colors ${rightClicks > 0 ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-gray-900 border-gray-800 text-gray-400'}`}>
                <span className="text-[10px] block opacity-70">Right Click</span>
                <span className="text-base font-bold text-white">{rightClicks} clicks</span>
              </div>

              <div className={`p-2.5 rounded border transition-colors ${middleClicks > 0 ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-gray-900 border-gray-800 text-gray-400'}`}>
                <span className="text-[10px] block opacity-70">Middle Click (Wheel)</span>
                <span className="text-base font-bold text-white">{middleClicks} clicks</span>
              </div>

              <div className={`p-2.5 rounded border transition-colors ${scrollUpCount + scrollDownCount > 0 ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' : 'bg-gray-900 border-gray-800 text-gray-400'}`}>
                <span className="text-[10px] block opacity-70">Scroll Wheel</span>
                <span className="text-base font-bold text-white">▲ {scrollUpCount} | ▼ {scrollDownCount}</span>
              </div>
            </div>

            <div className="p-3 bg-gray-900/80 border border-gray-800 rounded text-xs text-gray-300 space-y-1">
              <span className="font-bold text-white block">Switch Chatter & Bounce Health:</span>
              {potentialDoubleClicks > 0 ? (
                <span className="text-amber-400 font-semibold block">
                  ⚠️ {potentialDoubleClicks} fast bounce click(s) detected (&lt;80ms). Possible switch chatter!
                </span>
              ) : (
                <span className="text-emerald-400 block">
                  ✅ No switch chatter detected. Clean single clicks.
                </span>
              )}
              {fastestClickGapMs && (
                <span className="text-gray-400 text-[11px] block">
                  Fastest click gap: {fastestClickGapMs} ms
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Instruction Strip */}
        <div className="px-4 py-2.5 bg-[#171923] border-t border-gray-800 text-xs text-gray-400 flex items-center justify-between">
          <span>Click anywhere in the box above (Left, Right, Middle, or Scroll Wheel) to test your mouse buttons.</span>
        </div>
      </div>

      {/* CPS (Clicks Per Second) Speed Test Section */}
      <div className="bg-white p-5 sm:p-6 rounded-[6px] border border-gray-200 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-[#414FA8]" />
            <div>
              <h3 className="text-sm font-bold text-gray-900">CPS Speed Test (Clicks Per Second)</h3>
              <p className="text-[11px] text-gray-500">Test how fast you can click in 5 or 10 seconds</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setCpsDuration(5); setCpsTimeLeft(5); }}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${cpsDuration === 5 ? 'bg-[#414FA8] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              5 Seconds
            </button>
            <button
              type="button"
              onClick={() => { setCpsDuration(10); setCpsTimeLeft(10); }}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${cpsDuration === 10 ? 'bg-[#414FA8] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              10 Seconds
            </button>
          </div>
        </div>

        {/* CPS Click Pad Box */}
        <div
          onClick={handleCpsBoxClick}
          className={`h-40 rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer select-none transition-all ${
            cpsActive
              ? 'bg-emerald-50 border-emerald-500 scale-[0.99] shadow-inner'
              : 'bg-[#FAFAFC] border-gray-300 hover:border-[#414FA8] hover:bg-[#F2F4FC]'
          }`}
        >
          {cpsActive ? (
            <div className="text-center space-y-1">
              <span className="text-3xl font-black text-emerald-600">{cpsClicks}</span>
              <span className="text-xs text-emerald-800 font-bold block">Clicks registered! KEEP CLICKING!</span>
              <span className="text-xs text-gray-500 font-mono">Time left: {cpsTimeLeft}s</span>
            </div>
          ) : cpsScore !== null ? (
            <div className="text-center space-y-1">
              <span className="text-3xl font-black text-[#414FA8]">{cpsScore} CPS</span>
              <span className="text-xs text-gray-700 font-bold block">
                {cpsClicks} clicks in {cpsDuration} seconds (
                {cpsScore >= 10 ? '⚡ Pro Gamer' : cpsScore >= 7 ? '🐆 Cheetah Speed' : cpsScore >= 5 ? '🐇 Good Speed' : '🐢 Casual Typist'}
                )
              </span>
              <span className="text-[11px] text-[#414FA8] font-semibold underline mt-2 block">
                Click here to try again
              </span>
            </div>
          ) : (
            <div className="text-center space-y-1">
              <Mouse className="h-7 w-7 text-[#414FA8] mx-auto mb-1" />
              <span className="text-sm font-bold text-gray-800 block">Click here rapidly to start CPS Test</span>
              <span className="text-xs text-gray-500">Timer ({cpsDuration}s) begins on your first click</span>
            </div>
          )}
        </div>
      </div>

      {/* Paired Quick Tool Links & Privacy Card */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#EEF1FB] p-4 rounded-[6px] border border-[#9AA3C8]/40 text-[#414FA8]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="text-xs text-gray-700">
            <strong>100% Client-Side & Private:</strong> Mouse clicks and scroll events are evaluated entirely in your browser without tracking or upload.
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
            href="/tools/dead-pixel-test"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-[#9AA3C8] text-[#414FA8] text-xs font-semibold rounded-[4px] transition-colors"
          >
            <Monitor className="h-3.5 w-3.5" />
            <span>Test Screen</span>
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
