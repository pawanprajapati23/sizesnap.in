'use client';

import React, { useState, useMemo } from 'react';
import { TextEditor } from './TextEditor';
import { Settings2 } from 'lucide-react';

export function ReadingTimeCalculatorTool() {
  const [text, setText] = useState('');
  const [wpm, setWpm] = useState(200);

  const stats = useMemo(() => {
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const minutes = words / (wpm || 1);

    // Format minutes and seconds
    const m = Math.floor(minutes);
    const s = Math.round((minutes - m) * 60);

    return { words, m, s, totalSeconds: Math.ceil(minutes * 60) };
  }, [text, wpm]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-3xl font-bold text-[#414FA8]">
            {stats.m} <span className="text-sm font-normal text-gray-500">min</span> {stats.s} <span className="text-sm font-normal text-gray-500">sec</span>
          </h3>
          <p className="text-xs text-gray-500 uppercase tracking-wide mt-1">Estimated Reading Time</p>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded border border-gray-100">
          <Settings2 className="w-4 h-4 text-gray-400" />
          <div className="flex flex-col">
            <label className="text-[10px] text-gray-500 uppercase font-semibold">Reading Speed (WPM)</label>
            <input
              type="number"
              value={wpm}
              onChange={(e) => setWpm(Math.max(1, parseInt(e.target.value) || 200))}
              className="w-20 bg-transparent border-none p-0 text-sm font-medium focus:ring-0"
              min="10"
              max="1000"
            />
          </div>
        </div>
      </div>

      <TextEditor value={text} onChange={setText} placeholder="Paste your article or script here..." />
    </div>
  );
}
