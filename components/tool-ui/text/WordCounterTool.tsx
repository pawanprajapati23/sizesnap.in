'use client';

import React, { useState, useMemo } from 'react';
import { TextEditor } from './TextEditor';

export function WordCounterTool() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpace = text.replace(/\s/g, '').length;
    const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    const lines = text === '' ? 0 : text.split('\n').length;

    // Naive sentence split by common terminators
    const sentences = text.split(/[.!?]+/).filter(Boolean).length;
    const paragraphs = text.split(/\n\s*\n/).filter(Boolean).length;

    // Standard reading speed is ~200 WPM
    const readingTimeMins = Math.ceil(words / 200);

    return { chars, charsNoSpace, words, lines, sentences, paragraphs, readingTimeMins };
  }, [text]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox label="Words" value={stats.words} />
        <StatBox label="Characters" value={stats.chars} />
        <StatBox label="Sentences" value={stats.sentences} />
        <StatBox label="Paragraphs" value={stats.paragraphs} />
      </div>

      <TextEditor value={text} onChange={setText} placeholder="Start typing or paste your document here..." />

      <div className="bg-white p-4 rounded border border-gray-200 text-sm text-gray-700 space-y-2">
        <h3 className="font-semibold text-gray-900 border-b pb-2 mb-2">Detailed Statistics</h3>
        <div className="flex justify-between"><span>Characters (no spaces)</span> <span className="font-medium">{stats.charsNoSpace}</span></div>
        <div className="flex justify-between"><span>Lines</span> <span className="font-medium">{stats.lines}</span></div>
        <div className="flex justify-between"><span>Reading Time</span> <span className="font-medium">~{stats.readingTimeMins} min</span></div>
      </div>
    </div>
  );
}

function StatBox({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white border border-[#9AA3C8] rounded flex flex-col items-center justify-center py-3 px-2 shadow-xs">
      <span className="text-2xl font-bold text-[#414FA8]">{value}</span>
      <span className="text-xs text-gray-500 uppercase tracking-wide mt-1 text-center leading-tight">{label}</span>
    </div>
  );
}
