'use client';

import React, { useState } from 'react';
import { TextEditor } from './TextEditor';
import { TextOutput } from './TextOutput';
import { ArrowDownAZ, ArrowUpZA, ArrowDown10, ArrowUp01, AlignLeft, AlignRight } from 'lucide-react';

export function SortLinesTool() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<string>('az');

  let output = '';

  if (text) {
    let lines = text.split('\n');

    switch(mode) {
      case 'az':
        lines.sort();
        break;
      case 'za':
        lines.sort().reverse();
        break;
      case 'numAsc':
        lines.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0));
        break;
      case 'numDesc':
        lines.sort((a, b) => (parseFloat(b) || 0) - (parseFloat(a) || 0));
        break;
      case 'lenAsc':
        lines.sort((a, b) => a.length - b.length);
        break;
      case 'lenDesc':
        lines.sort((a, b) => b.length - a.length);
        break;
    }

    output = lines.join('\n');
  }

  const buttons = [
    { id: 'az', icon: ArrowDownAZ, label: 'A to Z' },
    { id: 'za', icon: ArrowUpZA, label: 'Z to A' },
    { id: 'numAsc', icon: ArrowDown10, label: 'Numeric (Asc)' },
    { id: 'numDesc', icon: ArrowUp01, label: 'Numeric (Desc)' },
    { id: 'lenAsc', icon: AlignLeft, label: 'Shortest to Longest' },
    { id: 'lenDesc', icon: AlignRight, label: 'Longest to Shortest' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 bg-white p-3 rounded border border-gray-200">
        {buttons.map(b => (
          <button
            key={b.id}
            onClick={() => setMode(b.id)}
            className={`px-3 py-2 text-xs font-medium rounded transition-colors border flex items-center gap-1.5 ${mode === b.id ? 'bg-[#414FA8] text-white border-[#414FA8]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
          >
            <b.icon className="w-4 h-4" /> {b.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={text} onChange={setText} placeholder="Paste list to sort..." />
        <TextOutput value={output} />
      </div>
    </div>
  );
}
