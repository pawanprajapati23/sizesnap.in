'use client';

import React, { useState } from 'react';
import { TextEditor } from '../text/TextEditor';
import { TextOutput } from '../text/TextOutput';

export function RemoveLineBreaksTool() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'all' | 'preserve'>('all');

  let output = '';

  if (text) {
    let normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    if (mode === 'all') {
      output = normalized.replace(/\n/g, ' ').replace(/ {2,}/g, ' ');
    } else if (mode === 'preserve') {
      output = normalized.replace(/\n\s*\n/g, '___PARAGRAPH_MARKER___');
      output = output.replace(/\n/g, ' ');
      output = output.replace(/___PARAGRAPH_MARKER___/g, '\n\n');
      output = output.replace(/ {2,}/g, ' ');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-4 bg-white p-4 rounded border border-gray-200">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="radio"
            checked={mode === 'all'}
            onChange={() => setMode('all')}
            className="w-4 h-4 text-[#414FA8] focus:ring-[#414FA8]"
          />
          Remove ALL line breaks (join everything)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="radio"
            checked={mode === 'preserve'}
            onChange={() => setMode('preserve')}
            className="w-4 h-4 text-[#414FA8] focus:ring-[#414FA8]"
          />
          Preserve Paragraphs (remove single breaks)
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={text} onChange={setText} placeholder="Paste text with unwanted line breaks..." />
        <TextOutput value={output} />
      </div>
    </div>
  );
}
