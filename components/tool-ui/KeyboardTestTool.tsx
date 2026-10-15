'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  Keyboard,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Volume2,
  VolumeX,
  Laptop,
  Maximize2,
  Activity,
  Sparkles,
  Sliders,
  Radio,
  Headphones,
  Video,
  Mic,
} from 'lucide-react';

interface KeyDef {
  code: string;
  label: string;
  shiftLabel?: string;
  width?: string; // CSS width class or flex
}

export function KeyboardTestTool() {
  const [pressedCodes, setPressedCodes] = useState<Set<string>>(new Set());
  const [testedCodes, setTestedCodes] = useState<Set<string>>(new Set());
  const [lastKey, setLastKey] = useState<{
    key: string;
    code: string;
    keyCode: number;
    timestamp: number;
  } | null>(null);

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [layoutMode, setLayoutMode] = useState<'laptop' | 'full'>('laptop');
  const [keyPressCount, setKeyPressCount] = useState<number>(0);

  // Audio Context for subtle mechanical click sound
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playClickSound = useCallback(() => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {}
  }, [soundEnabled]);

  /* ─── Keyboard Event Listeners ─── */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Prevent browser default actions for testing keys (F5 refresh, Tab focus, Space scroll, etc.)
      if (
        [
          'Tab',
          'Space',
          'ArrowUp',
          'ArrowDown',
          'ArrowLeft',
          'ArrowRight',
          'F1',
          'F2',
          'F3',
          'F4',
          'F6',
          'F7',
          'F8',
          'F9',
          'F10',
          'F11',
          'F12',
          'AltLeft',
          'AltRight',
          'ContextMenu',
        ].includes(e.code)
      ) {
        e.preventDefault();
      }

      setPressedCodes((prev) => {
        const next = new Set(prev);
        next.add(e.code);
        return next;
      });

      setTestedCodes((prev) => {
        const next = new Set(prev);
        next.add(e.code);
        return next;
      });

      setLastKey({
        key: e.key === ' ' ? 'Space' : e.key,
        code: e.code,
        keyCode: e.keyCode,
        timestamp: Date.now(),
      });

      setKeyPressCount((prev) => prev + 1);
      playClickSound();
    },
    [playClickSound]
  );

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setPressedCodes((prev) => {
      const next = new Set(prev);
      next.delete(e.code);
      return next;
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [handleKeyDown, handleKeyUp]);

  /* ─── Reset Tested Keys ─── */
  const resetTest = () => {
    setPressedCodes(new Set());
    setTestedCodes(new Set());
    setLastKey(null);
    setKeyPressCount(0);
  };

  /* ─── Keyboard Layout Definition ─── */
  const rowFunction: KeyDef[] = [
    { code: 'Escape', label: 'Esc', width: 'w-10 sm:w-12' },
    { code: 'F1', label: 'F1' },
    { code: 'F2', label: 'F2' },
    { code: 'F3', label: 'F3' },
    { code: 'F4', label: 'F4' },
    { code: 'F5', label: 'F5' },
    { code: 'F6', label: 'F6' },
    { code: 'F7', label: 'F7' },
    { code: 'F8', label: 'F8' },
    { code: 'F9', label: 'F9' },
    { code: 'F10', label: 'F10' },
    { code: 'F11', label: 'F11' },
    { code: 'F12', label: 'F12' },
    { code: 'PrintScreen', label: 'PrtSc' },
    { code: 'Delete', label: 'Del' },
  ];

  const rowNumber: KeyDef[] = [
    { code: 'Backquote', label: '`', shiftLabel: '~' },
    { code: 'Digit1', label: '1', shiftLabel: '!' },
    { code: 'Digit2', label: '2', shiftLabel: '@' },
    { code: 'Digit3', label: '3', shiftLabel: '#' },
    { code: 'Digit4', label: '4', shiftLabel: '$' },
    { code: 'Digit5', label: '5', shiftLabel: '%' },
    { code: 'Digit6', label: '6', shiftLabel: '^' },
    { code: 'Digit7', label: '7', shiftLabel: '&' },
    { code: 'Digit8', label: '8', shiftLabel: '*' },
    { code: 'Digit9', label: '9', shiftLabel: '(' },
    { code: 'Digit0', label: '0', shiftLabel: ')' },
    { code: 'Minus', label: '-', shiftLabel: '_' },
    { code: 'Equal', label: '=', shiftLabel: '+' },
    { code: 'Backspace', label: 'Backspace', width: 'flex-1 min-w-[50px] sm:min-w-[70px]' },
  ];

  const rowQ: KeyDef[] = [
    { code: 'Tab', label: 'Tab', width: 'w-12 sm:w-16' },
    { code: 'KeyQ', label: 'Q' },
    { code: 'KeyW', label: 'W' },
    { code: 'KeyE', label: 'E' },
    { code: 'KeyR', label: 'R' },
    { code: 'KeyT', label: 'T' },
    { code: 'KeyY', label: 'Y' },
    { code: 'KeyU', label: 'U' },
    { code: 'KeyI', label: 'I' },
    { code: 'KeyO', label: 'O' },
    { code: 'KeyP', label: 'P' },
    { code: 'BracketLeft', label: '[', shiftLabel: '{' },
    { code: 'BracketRight', label: ']', shiftLabel: '}' },
    { code: 'Backslash', label: '\\', shiftLabel: '|', width: 'flex-1 min-w-[36px]' },
  ];

  const rowA: KeyDef[] = [
    { code: 'CapsLock', label: 'Caps Lock', width: 'w-14 sm:w-20' },
    { code: 'KeyA', label: 'A' },
    { code: 'KeyS', label: 'S' },
    { code: 'KeyD', label: 'D' },
    { code: 'KeyF', label: 'F' },
    { code: 'KeyG', label: 'G' },
    { code: 'KeyH', label: 'H' },
    { code: 'KeyJ', label: 'J' },
    { code: 'KeyK', label: 'K' },
    { code: 'KeyL', label: 'L' },
    { code: 'Semicolon', label: ';', shiftLabel: ':' },
    { code: 'Quote', label: "'", shiftLabel: '"' },
    { code: 'Enter', label: 'Enter', width: 'flex-1 min-w-[54px] sm:min-w-[80px]' },
  ];

  const rowZ: KeyDef[] = [
    { code: 'ShiftLeft', label: 'Shift', width: 'w-16 sm:w-24' },
    { code: 'KeyZ', label: 'Z' },
    { code: 'KeyX', label: 'X' },
    { code: 'KeyC', label: 'C' },
    { code: 'KeyV', label: 'V' },
    { code: 'KeyB', label: 'B' },
    { code: 'KeyN', label: 'N' },
    { code: 'KeyM', label: 'M' },
    { code: 'Comma', label: ',', shiftLabel: '<' },
    { code: 'Period', label: '.', shiftLabel: '>' },
    { code: 'Slash', label: '/', shiftLabel: '?' },
    { code: 'ShiftRight', label: 'Shift', width: 'flex-1 min-w-[60px] sm:min-w-[90px]' },
  ];

  const rowBottom: KeyDef[] = [
    { code: 'ControlLeft', label: 'Ctrl', width: 'w-10 sm:w-14' },
    { code: 'MetaLeft', label: 'Win', width: 'w-9 sm:w-12' },
    { code: 'AltLeft', label: 'Alt', width: 'w-9 sm:w-12' },
    { code: 'Space', label: 'Space', width: 'flex-1 min-w-[120px] sm:min-w-[220px]' },
    { code: 'AltRight', label: 'Alt', width: 'w-9 sm:w-12' },
    { code: 'MetaRight', label: 'Win', width: 'w-9 sm:w-12' },
    { code: 'ContextMenu', label: 'Menu', width: 'w-9 sm:w-12' },
    { code: 'ControlRight', label: 'Ctrl', width: 'w-10 sm:w-14' },
  ];

  // Navigation cluster
  const navKeys: KeyDef[] = [
    { code: 'ArrowUp', label: '▲' },
    { code: 'ArrowLeft', label: '◀' },
    { code: 'ArrowDown', label: '▼' },
    { code: 'ArrowRight', label: '▶' },
  ];

  // Total keys in layout for progress percentage
  const totalKeysInLayout =
    rowFunction.length +
    rowNumber.length +
    rowQ.length +
    rowA.length +
    rowZ.length +
    rowBottom.length +
    navKeys.length;

  const testedCount = testedCodes.size;
  const testedPercentage = Math.round((testedCount / totalKeysInLayout) * 100);

  /* ─── Render Single Key Component ─── */
  const renderKey = (key: KeyDef) => {
    const isCurrentlyPressed = pressedCodes.has(key.code);
    const hasBeenTested = testedCodes.has(key.code);

    let keyStyle = 'bg-[#181B24] text-gray-200 border-gray-700/80 hover:border-gray-500';

    if (isCurrentlyPressed) {
      // Actively pressed down: Vibrant Neon Emerald
      keyStyle =
        'bg-emerald-500 text-black border-emerald-400 font-black shadow-[0_0_15px_rgba(34,197,94,0.6)] scale-[0.96] z-10';
    } else if (hasBeenTested) {
      // Tested & Working: Muted Clean Green
      keyStyle = 'bg-emerald-950/80 text-emerald-400 border-emerald-500/60 shadow-xs font-bold';
    }

    return (
      <div
        key={key.code}
        className={`h-9 sm:h-11 ${
          key.width ? key.width : 'w-7 sm:w-10'
        } rounded-[4px] border text-[10px] sm:text-xs flex flex-col items-center justify-center select-none cursor-default transition-all duration-75 relative ${keyStyle}`}
      >
        {key.shiftLabel && (
          <span className="text-[9px] text-gray-400 leading-none -mt-1 mb-0.5">
            {key.shiftLabel}
          </span>
        )}
        <span className="leading-none text-center truncate px-0.5">{key.label}</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Visual Keyboard Stage Card */}
      <div className="bg-[#0F1117] rounded-[6px] border border-gray-800 overflow-hidden shadow-md text-white">
        {/* Top Viewport Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#171923] border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                pressedCodes.size > 0 ? 'bg-emerald-500 animate-ping' : 'bg-[#414FA8]'
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
              Interactive Keyboard Tester
            </span>

            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold rounded">
              <CheckCircle2 className="h-3 w-3" />
              {testedCount} / {totalKeysInLayout} Keys Tested ({testedPercentage}%)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSoundEnabled((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-colors ${
                soundEnabled
                  ? 'bg-[#414FA8] text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-400'
              }`}
              title="Toggle Mechanical Typing Sound"
            >
              {soundEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
              <span className="hidden sm:inline">{soundEnabled ? 'Sound ON' : 'Mute'}</span>
            </button>

            <button
              type="button"
              onClick={resetTest}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold rounded transition-colors"
              title="Clear tested keys"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Real-time Pressed Key Status Banner */}
        <div className="px-4 py-2 bg-[#12141C] border-b border-gray-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-gray-400">Last Pressed:</span>
            {lastKey ? (
              <span className="text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-600/30">
                Key: &quot;{lastKey.key}&quot; | Code: {lastKey.code} | KeyCode: {lastKey.keyCode}
              </span>
            ) : (
              <span className="text-gray-500 italic">Press any key on your keyboard...</span>
            )}
          </div>

          <div className="flex items-center gap-3 text-gray-400">
            <span>Total Presses: <strong className="text-white">{keyPressCount}</strong></span>
            <span>Simultaneous (Anti-ghosting): <strong className="text-emerald-400">{pressedCodes.size}</strong></span>
          </div>
        </div>

        {/* The Keyboard Layout Canvas */}
        <div className="p-3 sm:p-6 overflow-x-auto flex flex-col items-center">
          <div className="min-w-[680px] sm:min-w-[760px] max-w-full space-y-1.5 p-3 sm:p-5 bg-[#0A0B0F] border border-gray-800/90 rounded-lg shadow-inner">
            {/* Function Row */}
            <div className="flex gap-1 sm:gap-1.5">
              {rowFunction.map(renderKey)}
            </div>

            {/* Number Row */}
            <div className="flex gap-1 sm:gap-1.5">
              {rowNumber.map(renderKey)}
            </div>

            {/* Q Row */}
            <div className="flex gap-1 sm:gap-1.5">
              {rowQ.map(renderKey)}
            </div>

            {/* A Row */}
            <div className="flex gap-1 sm:gap-1.5">
              {rowA.map(renderKey)}
            </div>

            {/* Z Row */}
            <div className="flex gap-1 sm:gap-1.5">
              {rowZ.map(renderKey)}
            </div>

            {/* Bottom Row + Arrow cluster */}
            <div className="flex gap-1 sm:gap-1.5 items-center">
              {rowBottom.map(renderKey)}

              {/* Arrow Keys Mini Cluster */}
              <div className="flex gap-1 ml-2">
                {renderKey(navKeys[1])} {/* Left */}
                <div className="flex flex-col gap-1">
                  {renderKey(navKeys[0])} {/* Up */}
                  {renderKey(navKeys[2])} {/* Down */}
                </div>
                {renderKey(navKeys[3])} {/* Right */}
              </div>
            </div>
          </div>
        </div>

        {/* Legend / Key Guide Footer */}
        <div className="px-4 py-3 bg-[#171923] border-t border-gray-800 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-300">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-[#181B24] border border-gray-600 block" />
              Untested Key
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-emerald-500 border border-emerald-400 block" />
              Active Pressed Down
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-xs bg-emerald-950 border border-emerald-500 block" />
              Working / Verified Key
            </span>
          </div>

          <span className="text-gray-400">
            Keyboard shortcuts (F1-F12, Space, Tab) are safely captured for testing.
          </span>
        </div>
      </div>

      {/* Diagnostics & Refurbished Buyer Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Anti-Ghosting & Key Rollover Test */}
        <div className="bg-white p-4 sm:p-5 rounded-[6px] border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
            <Activity className="h-4 w-4 text-[#414FA8]" />
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              N-Key Rollover & Anti-Ghosting Check
            </h4>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Gamers and fast typists require keyboards that register multiple simultaneous keys without dropping inputs (Ghosting).
          </p>

          <div className="p-3 bg-gray-50 border border-gray-100 rounded text-xs space-y-1">
            <span className="font-bold text-gray-800 block">How to test Anti-Ghosting:</span>
            <p className="text-gray-600 text-[11px]">
              Press and hold <strong>W + A + S + D + Space + Shift</strong> all at the same time. If all keys light up in green simultaneously, your keyboard has high N-Key rollover!
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-gray-50 border border-gray-100 rounded">
              <span className="text-gray-400 text-[11px] block">Simultaneous Keys</span>
              <span className="font-bold text-gray-800 text-sm">{pressedCodes.size} Keys Active</span>
            </div>
            <div className="p-2.5 bg-gray-50 border border-gray-100 rounded">
              <span className="text-gray-400 text-[11px] block">Tested Status</span>
              <span className="font-bold text-emerald-600 text-sm">
                {testedCount > 0 ? `${testedCount} Verified` : 'Ready to Test'}
              </span>
            </div>
          </div>
        </div>

        {/* Second-Hand / Refurbished Laptop Checklist */}
        <div className="bg-white p-4 sm:p-5 rounded-[6px] border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
            <Laptop className="h-4 w-4 text-[#414FA8]" />
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Used / Refurbished Laptop Checklist
            </h4>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            When buying a new or second-hand laptop, sticky or dead keys (like Space, Enter, Backspace, or Fn keys) are the most common hidden defects.
          </p>

          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-gray-700">Press all keys row-by-row until the entire keyboard lights up green.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-gray-700">Check for repeated chatter (double typing when pressed once).</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-gray-700">Test CapsLock and NumLock toggle responsiveness.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Paired Quick Tool Links & Privacy Card */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#EEF1FB] p-4 rounded-[6px] border border-[#9AA3C8]/40 text-[#414FA8]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="text-xs text-gray-700">
            <strong>100% Client-Side & Private:</strong> Keystrokes are captured exclusively in your local browser memory and never transmitted or recorded.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/tools/speaker-test"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-[#9AA3C8] text-[#414FA8] text-xs font-semibold rounded-[4px] transition-colors"
          >
            <Headphones className="h-3.5 w-3.5" />
            <span>Test Speakers</span>
          </Link>
          <Link
            href="/tools/mic-test"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-gray-50 border border-[#9AA3C8] text-[#414FA8] text-xs font-semibold rounded-[4px] transition-colors"
          >
            <Mic className="h-3.5 w-3.5" />
            <span>Test Mic</span>
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
