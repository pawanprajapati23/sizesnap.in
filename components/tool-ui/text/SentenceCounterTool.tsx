'use client';

import React, { useState, useMemo } from 'react';
import { TextEditor } from './TextEditor';

export function SentenceCounterTool() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    // Split by . ! ? followed by space or newline, or end of string
    const match = text.match(/[^.!?]+[.!?]+(?:\s|$)/g);
    const count = text.trim() === '' ? 0 : (match ? match.length : 1);
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const avgWords = count === 0 ? 0 : Math.round(words / count);

    return { count, words, avgWords };
  }, [text]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatBox label="Sentences" value={stats.count} highlight />
        <StatBox label="Words" value={stats.words} />
        <StatBox label="Avg Words / Sentence" value={stats.avgWords} />
      </div>

      <TextEditor value={text} onChange={setText} placeholder="Paste text to analyze sentences..." />
    </div>
  );
}

function StatBox({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`bg-white border ${highlight ? 'border-[#414FA8] bg-indigo-50/30' : 'border-[#9AA3C8]'} rounded flex flex-col items-center justify-center py-3 px-2 shadow-xs`}>
      <span className="text-2xl font-bold text-[#414FA8]">{value}</span>
      <span className="text-xs text-gray-500 uppercase tracking-wide mt-1 text-center leading-tight">{label}</span>
    </div>
  );
}
