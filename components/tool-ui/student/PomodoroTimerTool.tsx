'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

export function PomodoroTimerTool() {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
             setIsRunning(false);
             if (timerRef.current) clearInterval(timerRef.current);
             return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const switchMode = (newMode: 'work' | 'break') => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(newMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center gap-8">
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          <button
            onClick={() => switchMode('work')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${mode === 'work' ? 'bg-white shadow-xs text-[#414FA8]' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Study Focus
          </button>
          <button
            onClick={() => switchMode('break')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-colors ${mode === 'break' ? 'bg-white shadow-xs text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Short Break
          </button>
        </div>

        <div className={`text-7xl font-bold font-mono tracking-tight ${mode === 'work' ? 'text-gray-800' : 'text-emerald-700'}`}>
          {m}:{s}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleTimer}
            className={`flex items-center justify-center gap-2 px-8 py-3 rounded-full text-white font-bold text-lg shadow-sm transition-transform active:scale-95 ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#414FA8] hover:bg-[#343f88]'}`}
          >
            {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
