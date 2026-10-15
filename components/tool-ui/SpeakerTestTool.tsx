'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Volume2,
  VolumeX,
  Play,
  Square,
  Headphones,
  Sliders,
  Activity,
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Mic,
  Video,
  Radio,
  Sparkles,
  Zap,
} from 'lucide-react';

export function SpeakerTestTool() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [activeChannel, setActiveChannel] = useState<'left' | 'right' | 'both' | null>(null);
  const [volume, setVolume] = useState<number>(80);
  const [balance, setBalance] = useState<number>(0); // -1 (Left) to +1 (Right)
  const [customFreq, setCustomFreq] = useState<number>(440);
  const [activeToneType, setActiveToneType] = useState<string | null>(null);
  const [sweepActive, setSweepActive] = useState<boolean>(false);
  const [currentSweepFreq, setCurrentSweepFreq] = useState<number>(20);

  // Web Audio API Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const pannerNodeRef = useRef<StereoPannerNode | null>(null);
  const sweepIntervalRef = useRef<any>(null);

  /* ─── Init Audio Context ─── */
  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  /* ─── Stop All Audio ─── */
  const stopAudio = useCallback(() => {
    if (oscRef.current) {
      try {
        oscRef.current.stop();
        oscRef.current.disconnect();
      } catch {}
      oscRef.current = null;
    }
    if (sweepIntervalRef.current) {
      clearInterval(sweepIntervalRef.current);
      sweepIntervalRef.current = null;
    }
    setIsPlaying(false);
    setActiveChannel(null);
    setActiveToneType(null);
    setSweepActive(false);
  }, []);

  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, [stopAudio]);

  /* ─── Update Gain & Pan Dynamically ─── */
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume / 100, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  useEffect(() => {
    if (pannerNodeRef.current && audioCtxRef.current) {
      pannerNodeRef.current.pan.setValueAtTime(balance, audioCtxRef.current.currentTime);
    }
  }, [balance]);

  /* ─── Play Synthesized Tone with Pan ─── */
  const playTone = (freq: number, panValue: number, channelType: 'left' | 'right' | 'both', label?: string) => {
    stopAudio();

    const ctx = getAudioContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Check StereoPannerNode support
    let panner: StereoPannerNode | null = null;
    if (ctx.createStereoPanner) {
      panner = ctx.createStereoPanner();
      panner.pan.setValueAtTime(panValue, ctx.currentTime);
      pannerNodeRef.current = panner;
    }

    gainNode.gain.setValueAtTime(volume / 100, ctx.currentTime);
    gainNodeRef.current = gainNode;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Audio node routing
    if (panner) {
      osc.connect(gainNode);
      gainNode.connect(panner);
      panner.connect(ctx.destination);
    } else {
      // Fallback
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
    }

    osc.start();
    oscRef.current = osc;

    setIsPlaying(true);
    setActiveChannel(channelType);
    if (label) setActiveToneType(label);
  };

  /* ─── Channel Test Handlers ─── */
  const testLeftSpeaker = () => {
    setBalance(-1);
    playTone(440, -1, 'left', 'Left Channel (440 Hz)');
  };

  const testRightSpeaker = () => {
    setBalance(1);
    playTone(440, 1, 'right', 'Right Channel (440 Hz)');
  };

  const testBothSpeakers = () => {
    setBalance(0);
    playTone(440, 0, 'both', 'Both Channels Stereo (440 Hz)');
  };

  /* ─── Alternating Left-Right Test (3D Panning) ─── */
  const testAlternatingStereo = () => {
    stopAudio();

    const ctx = getAudioContext();
    let currentSide = -1; // start Left

    testLeftSpeaker();

    let step = 0;
    sweepIntervalRef.current = setInterval(() => {
      step++;
      currentSide = currentSide === -1 ? 1 : -1;
      setBalance(currentSide);

      if (pannerNodeRef.current) {
        pannerNodeRef.current.pan.setValueAtTime(currentSide, ctx.currentTime);
      }
      setActiveChannel(currentSide === -1 ? 'left' : 'right');
      setActiveToneType(currentSide === -1 ? 'Alternating: Left ⟵' : 'Alternating: ⟶ Right');

      if (step >= 10) {
        stopAudio();
      }
    }, 1200);
  };

  /* ─── Frequency Sweep Test (20 Hz - 10,000 Hz) ─── */
  const startFrequencySweep = () => {
    stopAudio();
    const ctx = getAudioContext();
    setSweepActive(true);
    setActiveToneType('Continuous Frequency Sweep');

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(volume / 100, ctx.currentTime);
    gainNodeRef.current = gainNode;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(40, ctx.currentTime);

    // Exponential ramp over 10 seconds from 40Hz to 12000Hz
    osc.frequency.exponentialRampToValueAtTime(12000, ctx.currentTime + 10);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    osc.start();
    oscRef.current = osc;
    setIsPlaying(true);
    setActiveChannel('both');

    let current = 40;
    sweepIntervalRef.current = setInterval(() => {
      current = Math.round(current * 1.35);
      if (current >= 12000) {
        clearInterval(sweepIntervalRef.current);
        stopAudio();
      } else {
        setCurrentSweepFreq(current);
      }
    }, 400);
  };

  /* ─── Specific Frequency Presets ─── */
  const playPresetFrequency = (freq: number, label: string) => {
    setBalance(0);
    playTone(freq, 0, 'both', label);
  };

  return (
    <div className="space-y-6">
      {/* Visual Stereo Headphone / Speaker Display Card */}
      <div className="bg-[#0F1117] rounded-[6px] border border-gray-800 overflow-hidden shadow-md text-white">
        {/* Top Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#171923] border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                isPlaying ? 'bg-emerald-500 animate-pulse' : 'bg-gray-500'
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-200">
              {isPlaying ? 'Audio Output Active' : 'Sound Output Standby'}
            </span>

            {isPlaying && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold rounded">
                <CheckCircle2 className="h-3 w-3" />
                {activeToneType || 'Playing Sound'}
              </span>
            )}
          </div>

          <div>
            {isPlaying && (
              <button
                type="button"
                onClick={stopAudio}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded transition-colors shadow-xs"
              >
                <Square className="h-3.5 w-3.5" />
                <span>Stop Audio</span>
              </button>
            )}
          </div>
        </div>

        {/* Interactive Stereo Visualizer */}
        <div className="p-6 sm:p-10 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-md flex items-center justify-between gap-4 sm:gap-8 my-4">
            {/* Left Channel Indicator */}
            <div
              onClick={testLeftSpeaker}
              className={`flex-1 p-5 rounded-lg border-2 text-center cursor-pointer select-none transition-all duration-150 ${
                activeChannel === 'left' || activeChannel === 'both'
                  ? 'border-emerald-500 bg-emerald-500/15 shadow-[0_0_25px_rgba(34,197,94,0.3)] scale-105'
                  : 'border-gray-800 bg-[#161922] hover:border-gray-700'
              }`}
            >
              <div
                className={`h-12 w-12 mx-auto rounded-full flex items-center justify-center mb-3 transition-colors ${
                  activeChannel === 'left' || activeChannel === 'both'
                    ? 'bg-emerald-500 text-black'
                    : 'bg-white/5 text-gray-400'
                }`}
              >
                <Volume2 className="h-6 w-6" />
              </div>
              <span className="text-sm font-extrabold block text-white">LEFT</span>
              <span className="text-[11px] text-gray-400">Speaker / Earphone</span>
              <button
                type="button"
                className="mt-3 px-3 py-1 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded block mx-auto text-white"
              >
                {activeChannel === 'left' ? 'Playing Left...' : 'Test Left'}
              </button>
            </div>

            {/* Center Headphone Icon & Balance Indicator */}
            <div className="flex flex-col items-center justify-center shrink-0">
              <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#414FA8]">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <span className="text-[10px] text-gray-400 font-mono mt-2">
                {balance === -1 ? '100% Left' : balance === 1 ? '100% Right' : 'Balanced Center'}
              </span>
            </div>

            {/* Right Channel Indicator */}
            <div
              onClick={testRightSpeaker}
              className={`flex-1 p-5 rounded-lg border-2 text-center cursor-pointer select-none transition-all duration-150 ${
                activeChannel === 'right' || activeChannel === 'both'
                  ? 'border-emerald-500 bg-emerald-500/15 shadow-[0_0_25px_rgba(34,197,94,0.3)] scale-105'
                  : 'border-gray-800 bg-[#161922] hover:border-gray-700'
              }`}
            >
              <div
                className={`h-12 w-12 mx-auto rounded-full flex items-center justify-center mb-3 transition-colors ${
                  activeChannel === 'right' || activeChannel === 'both'
                    ? 'bg-emerald-500 text-black'
                    : 'bg-white/5 text-gray-400'
                }`}
              >
                <Volume2 className="h-6 w-6" />
              </div>
              <span className="text-sm font-extrabold block text-white">RIGHT</span>
              <span className="text-[11px] text-gray-400">Speaker / Earphone</span>
              <button
                type="button"
                className="mt-3 px-3 py-1 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded block mx-auto text-white"
              >
                {activeChannel === 'right' ? 'Playing Right...' : 'Test Right'}
              </button>
            </div>
          </div>

          {/* Quick Stereo Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-4">
            <button
              type="button"
              onClick={testLeftSpeaker}
              className="px-4 py-2 bg-[#1B1E2B] hover:bg-[#252a3d] border border-gray-700 text-white text-xs font-bold rounded transition-colors"
            >
              Left Speaker Only
            </button>
            <button
              type="button"
              onClick={testBothSpeakers}
              className="px-5 py-2 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs font-bold rounded transition-colors shadow-xs"
            >
              Both (Stereo 440Hz)
            </button>
            <button
              type="button"
              onClick={testRightSpeaker}
              className="px-4 py-2 bg-[#1B1E2B] hover:bg-[#252a3d] border border-gray-700 text-white text-xs font-bold rounded transition-colors"
            >
              Right Speaker Only
            </button>
            <button
              type="button"
              onClick={testAlternatingStereo}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded transition-colors shadow-xs"
            >
              Alternating Left ⟷ Right
            </button>
          </div>
        </div>

        {/* Master Volume & Balance Sliders */}
        <div className="px-4 sm:px-6 py-4 bg-[#141721] border-t border-gray-800 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Volume2 className="h-3.5 w-3.5 text-[#414FA8]" />
                Volume Output
              </span>
              <span className="font-mono text-emerald-400">{volume}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className="w-full accent-[#414FA8] cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-300 mb-1">
              <span className="flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-indigo-400" />
                Stereo Balance (Pan)
              </span>
              <span className="font-mono text-gray-400">
                {balance < 0 ? `Left ${Math.abs(Math.round(balance * 100))}%` : balance > 0 ? `Right ${Math.round(balance * 100)}%` : 'Center (0)'}
              </span>
            </div>
            <input
              type="range"
              min={-1}
              max={1}
              step={0.1}
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              className="w-full accent-[#414FA8] cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Frequency & Tone Testing Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Frequency Presets (Bass, Mid, High Treble) */}
        <div className="bg-white p-4 sm:p-5 rounded-[6px] border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-[#414FA8]" />
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Sound Frequency & Bass Test
              </h4>
            </div>
            <span className="text-[11px] text-gray-400">Audible range: 20Hz - 20kHz</span>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Test whether your headphones or laptop speakers can clearly reproduce deep bass, vocal mid-tones, and crisp high frequencies.
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => playPresetFrequency(60, 'Sub-Bass (60 Hz)')}
              className="p-2.5 bg-gray-50 hover:bg-[#EEF1FB] hover:text-[#414FA8] border border-gray-200 rounded text-left font-semibold transition-colors"
            >
              <span className="text-gray-400 text-[10px] block">Sub-Bass Depth</span>
              <span>60 Hz (Deep Bass)</span>
            </button>

            <button
              type="button"
              onClick={() => playPresetFrequency(120, 'Bass Tone (120 Hz)')}
              className="p-2.5 bg-gray-50 hover:bg-[#EEF1FB] hover:text-[#414FA8] border border-gray-200 rounded text-left font-semibold transition-colors"
            >
              <span className="text-gray-400 text-[10px] block">Standard Bass</span>
              <span>120 Hz (Punchy Bass)</span>
            </button>

            <button
              type="button"
              onClick={() => playPresetFrequency(1000, 'Mid-Range Vocal (1 kHz)')}
              className="p-2.5 bg-gray-50 hover:bg-[#EEF1FB] hover:text-[#414FA8] border border-gray-200 rounded text-left font-semibold transition-colors"
            >
              <span className="text-gray-400 text-[10px] block">Mid-Range (Voice)</span>
              <span>1,000 Hz (Reference)</span>
            </button>

            <button
              type="button"
              onClick={() => playPresetFrequency(8000, 'High Treble (8 kHz)')}
              className="p-2.5 bg-gray-50 hover:bg-[#EEF1FB] hover:text-[#414FA8] border border-gray-200 rounded text-left font-semibold transition-colors"
            >
              <span className="text-gray-400 text-[10px] block">High Frequency</span>
              <span>8,000 Hz (Crisp Treble)</span>
            </button>
          </div>

          {/* Continuous Frequency Sweep Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={sweepActive ? stopAudio : startFrequencySweep}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded shadow-xs transition-colors"
            >
              <Zap className="h-4 w-4" />
              <span>
                {sweepActive
                  ? `Sweeping Frequency: ${currentSweepFreq} Hz (Stop)`
                  : 'Start Full Frequency Sweep (40Hz to 12kHz)'}
              </span>
            </button>
          </div>
        </div>

        {/* Custom Tone Generator & Health Diagnosis */}
        <div className="bg-white p-4 sm:p-5 rounded-[6px] border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
            <Radio className="h-4 w-4 text-[#414FA8]" />
            <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Custom Tone Generator
            </h4>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
              <span>Sine Wave Frequency</span>
              <span className="font-mono text-[#414FA8] font-bold">{customFreq} Hz</span>
            </div>
            <input
              type="range"
              min={100}
              max={5000}
              step={10}
              value={customFreq}
              onChange={(e) => {
                const val = Number(e.target.value);
                setCustomFreq(val);
                if (isPlaying && oscRef.current && audioCtxRef.current) {
                  oscRef.current.frequency.setValueAtTime(val, audioCtxRef.current.currentTime);
                }
              }}
              className="w-full accent-[#414FA8] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-mono mt-1">
              <span>100 Hz</span>
              <span>440 Hz (Standard A)</span>
              <span>2500 Hz</span>
              <span>5000 Hz</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => playTone(customFreq, balance, 'both', `Custom Tone (${customFreq} Hz)`)}
              className="flex-1 py-2 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs font-bold rounded transition-colors"
            >
              Play {customFreq} Hz Tone
            </button>
            {isPlaying && (
              <button
                type="button"
                onClick={stopAudio}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold rounded transition-colors"
              >
                Stop
              </button>
            )}
          </div>

          {/* Speaker Health Status */}
          <div className="p-3 bg-gray-50 border border-gray-200 rounded text-xs space-y-1">
            <span className="font-bold text-gray-800 block">How to check your speakers:</span>
            <p className="text-gray-600 text-[11px]">
              1. <strong>Left Test:</strong> Sound should only play from your left ear. If you hear it in both, your device is in Mono mode.
            </p>
            <p className="text-gray-600 text-[11px]">
              2. <strong>Right Test:</strong> Sound should only play from your right ear.
            </p>
            <p className="text-gray-600 text-[11px]">
              3. <strong>Bass Test:</strong> Low 60Hz hum should sound smooth with zero crackling or rattling.
            </p>
          </div>
        </div>
      </div>

      {/* Paired Quick Tool Links & Privacy Card */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#EEF1FB] p-4 rounded-[6px] border border-[#9AA3C8]/40 text-[#414FA8]">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
          <p className="text-xs text-gray-700">
            <strong>100% In-Browser Audio:</strong> All sound frequencies and stereo panning are generated directly by your browser&apos;s audio synthesizer.
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
