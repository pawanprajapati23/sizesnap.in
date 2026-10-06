'use client';

import React, { useState } from 'react';
import { TextEditor } from './TextEditor';
import { TextOutput } from './TextOutput';
import { Settings2 } from 'lucide-react';

export function RemoveDuplicateLinesTool() {
  const [text, setText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(true);

  let output = '';
  let originalCount = 0;
  let uniqueCount = 0;

  if (text) {
    const lines = text.split('\n');
    originalCount = lines.length;

    if (caseSensitive) {
      output = Array.from(new Set(lines)).join('\n');
    } else {
      const seen = new Set();
      const unique = [];
      for (const line of lines) {
        const lower = line.toLowerCase();
        if (!seen.has(lower)) {
          seen.add(lower);
          unique.push(line);
        }
      }
      output = unique.join('\n');
    }

    uniqueCount = output.split('\n').length;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded border border-gray-200">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="w-4 h-4 text-[#414FA8] rounded border-gray-300 focus:ring-[#414FA8]"
          />
          Case Sensitive Matching
        </label>

        <div className="flex gap-4 text-sm">
          <div>Original Lines: <span className="font-semibold text-gray-900">{originalCount}</span></div>
          <div>Duplicates Removed: <span className="font-semibold text-red-600">{originalCount - uniqueCount}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={text} onChange={setText} placeholder="Paste list with duplicates here..." />
        <TextOutput value={output} />
      </div>
    </div>
  );
}
