'use client';

import React, { useState } from 'react';
import { TextEditor } from './TextEditor';
import { TextOutput } from './TextOutput';

export function TextReverseTool() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<string>('chars');

  let output = '';

  if (text) {
    if (mode === 'chars') {
      output = Array.from(text).reverse().join('');
    } else if (mode === 'words') {
      output = text.split(/(\s+)/).map(w => w.trim() ? Array.from(w).reverse().join('') : w).join('');
    } else if (mode === 'wordOrder') {
      output = text.split(/(\s+)/).reverse().join('');
    } else if (mode === 'lines') {
      output = text.split('\n').reverse().join('\n');
    }
  }

  const modes = [
    { id: 'chars', label: 'Reverse Characters' },
    { id: 'words', label: 'Reverse Each Word' },
    { id: 'wordOrder', label: 'Reverse Word Order' },
    { id: 'lines', label: 'Reverse Lines' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-4 bg-white p-3 rounded border border-gray-200">
        {modes.map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors border ${mode === m.id ? 'bg-[#414FA8] text-white border-[#414FA8]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={text} onChange={setText} placeholder="Text to reverse..." />
        <TextOutput value={output} />
      </div>
    </div>
  );
}
