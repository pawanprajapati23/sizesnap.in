'use client';

import React, { useState, useMemo } from 'react';
import { TextEditor } from './TextEditor';

export function LineCounterTool() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    if (!text) return { total: 0, empty: 0, content: 0 };

    const lines = text.split(/\n/);
    const total = lines.length;
    let empty = 0;

    for (const line of lines) {
      if (line.trim() === '') empty++;
    }

    const content = total - empty;
    return { total, empty, content };
  }, [text]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-[#414FA8] bg-indigo-50/30 rounded flex flex-col items-center justify-center py-3 px-2 shadow-xs">
          <span className="text-2xl font-bold text-[#414FA8]">{stats.total}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wide mt-1 text-center leading-tight">Total Lines</span>
        </div>
        <div className="bg-white border border-[#9AA3C8] rounded flex flex-col items-center justify-center py-3 px-2 shadow-xs">
          <span className="text-2xl font-bold text-[#414FA8]">{stats.content}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wide mt-1 text-center leading-tight">Lines With Content</span>
        </div>
        <div className="bg-white border border-[#9AA3C8] rounded flex flex-col items-center justify-center py-3 px-2 shadow-xs">
          <span className="text-2xl font-bold text-[#414FA8]">{stats.empty}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wide mt-1 text-center leading-tight">Empty/Blank Lines</span>
        </div>
      </div>

      <TextEditor value={text} onChange={setText} placeholder="Paste text here to count lines..." />
    </div>
  );
}
