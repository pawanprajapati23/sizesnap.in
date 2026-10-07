'use client';

import React, { useState, useMemo } from 'react';
import { TextEditor } from './TextEditor';

export function CharacterCounterTool() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    // Array.from splits correctly on Unicode/emoji boundaries (mostly)
    const chars = Array.from(text).length;
    const charsNoSpace = Array.from(text.replace(/\s/g, '')).length;
    const spaces = chars - charsNoSpace;
    const letters = (text.match(/[a-zA-Z]/g) || []).length;
    const numbers = (text.match(/[0-9]/g) || []).length;

    return { chars, charsNoSpace, spaces, letters, numbers };
  }, [text]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatBox label="Total Characters" value={stats.chars} highlight />
        <StatBox label="Without Spaces" value={stats.charsNoSpace} />
        <StatBox label="Spaces" value={stats.spaces} />
      </div>

      <TextEditor value={text} onChange={setText} placeholder="Paste text here to count characters..." />

      <div className="bg-white p-4 rounded border border-gray-200 text-sm text-gray-700 flex gap-6">
         <div><span className="text-gray-500">Letters:</span> <span className="font-medium">{stats.letters}</span></div>
         <div><span className="text-gray-500">Numbers:</span> <span className="font-medium">{stats.numbers}</span></div>
      </div>
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
