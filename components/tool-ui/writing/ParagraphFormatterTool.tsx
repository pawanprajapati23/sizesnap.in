'use client';

import React, { useState } from 'react';
import { TextEditor } from '../text/TextEditor';
import { TextOutput } from '../text/TextOutput';

export function ParagraphFormatterTool() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'double' | 'single' | 'indent'>('double');

  let output = '';
  let pCount = 0;

  if (text) {
    let normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    let paragraphs = normalized.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);
    paragraphs = paragraphs.map(p => p.replace(/\n/g, ' ').replace(/ {2,}/g, ' '));

    pCount = paragraphs.length;

    if (mode === 'double') {
      output = paragraphs.join('\n\n');
    } else if (mode === 'single') {
      output = paragraphs.join('\n');
    } else if (mode === 'indent') {
      output = paragraphs.map(p => '    ' + p).join('\n\n');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded border border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('double')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors border ${mode === 'double' ? 'bg-[#414FA8] text-white border-[#414FA8]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
          >
            Double Spaced
          </button>
          <button
            onClick={() => setMode('single')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors border ${mode === 'single' ? 'bg-[#414FA8] text-white border-[#414FA8]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
          >
            Single Spaced
          </button>
          <button
            onClick={() => setMode('indent')}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors border ${mode === 'indent' ? 'bg-[#414FA8] text-white border-[#414FA8]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
          >
            Indented
          </button>
        </div>
        <div className="text-sm font-medium text-gray-600">
          Detected Paragraphs: <span className="text-[#414FA8]">{pCount}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={text} onChange={setText} placeholder="Paste broken paragraphs here..." />
        <TextOutput value={output} />
      </div>
    </div>
  );
}
