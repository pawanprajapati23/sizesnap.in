'use client';

import React, { useState } from 'react';
import { TextEditor } from '../text/TextEditor';
import { TextOutput } from '../text/TextOutput';

export function NumberedListGeneratorTool() {
  const [text, setText] = useState('');
  const [startAt, setStartAt] = useState(1);
  const [separator, setSeparator] = useState('.');
  const [cleanExisting, setCleanExisting] = useState(true);

  let output = '';

  if (text) {
    let lines = text.split('\n');

    if (cleanExisting) {
      lines = lines.map(l => l.replace(/^\s*\d+[.)]\s*/, ''));
    }

    let counter = startAt;
    output = lines.map(l => {
      if (l.trim() === '') return '';
      const formatted = `${counter}${separator} ${l}`;
      counter++;
      return formatted;
    }).join('\n');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded border border-gray-200">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Start At:</label>
          <input
            type="number"
            value={startAt}
            onChange={(e) => setStartAt(parseInt(e.target.value) || 1)}
            className="w-20 bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#414FA8]"
          />
        </div>

        <div className="flex items-center gap-2 border-l pl-4 border-gray-200">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Separator:</label>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#414FA8]"
          >
            <option value=".">Dot (.)</option>
            <option value=")">Parenthesis ())</option>
            <option value="-">Dash (-)</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer border-l pl-4 border-gray-200">
          <input type="checkbox" checked={cleanExisting} onChange={(e) => setCleanExisting(e.target.checked)} className="w-4 h-4 text-[#414FA8] rounded border-gray-300" />
          Remove existing numbering
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={text} onChange={setText} placeholder="Paste list of items here..." />
        <TextOutput value={output} />
      </div>
    </div>
  );
}
