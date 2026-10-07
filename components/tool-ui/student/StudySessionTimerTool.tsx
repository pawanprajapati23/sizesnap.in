'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square } from 'lucide-react';

export function StudySessionTimerTool() {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const stopTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
  const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');

  return (
    <div className="space-y-6 max-w-md mx-auto">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center gap-8">
        <h3 className="font-bold text-gray-800 tracking-tight">Study Session Stopwatch</h3>

        <div className="text-6xl sm:text-7xl font-bold font-mono tracking-tight text-[#414FA8]">
          {h}:{m}:{s}
        </div>

        <div className="flex items-center gap-4 w-full">
          <button
            onClick={toggleTimer}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-white font-bold text-base shadow-sm transition-colors ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-[#414FA8] hover:bg-[#343f88]'}`}
          >
            {isRunning ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
            {isRunning ? 'Pause' : 'Start Session'}
          </button>

          <button
            onClick={stopTimer}
            disabled={seconds === 0 && !isRunning}
            className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 bg-gray-50 border border-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:hover:bg-gray-50 disabled:hover:text-gray-500"
            title="Stop & Reset"
          >
            <Square className="w-6 h-6 fill-current" />
          </button>
        </div>
      </div>
    </div>
  );
}
