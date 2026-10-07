'use client';

import React, { useState } from 'react';
import { TextEditor } from '../text/TextEditor';
import { TextOutput } from '../text/TextOutput';

export function ListFormatterTool() {
  const [text, setText] = useState('');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [separator, setSeparator] = useState('newline');
  const [wrapQuotes, setWrapQuotes] = useState(false);

  let output = '';

  if (text) {
    let lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    // Optional wrapping
    if (wrapQuotes) {
      lines = lines.map(l => `"${l}"`);
    }

    // Add explicit prefix/suffix
    lines = lines.map(l => `${prefix}${l}${suffix}`);

    if (separator === 'newline') {
      output = lines.join('\n');
    } else if (separator === 'comma') {
      output = lines.join(', ');
    } else if (separator === 'comma-newline') {
      output = lines.join(',\n');
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 bg-white p-4 rounded border border-gray-200">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Prefix (Before)</label>
          <input
            type="text"
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
            placeholder="e.g. - "
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Suffix (After)</label>
          <input
            type="text"
            value={suffix}
            onChange={(e) => setSuffix(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
            placeholder="e.g. ;"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Separator</label>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
          >
            <option value="newline">New Line</option>
            <option value="comma">Comma (, )</option>
            <option value="comma-newline">Comma + New Line</option>
          </select>
        </div>
        <div className="flex items-end pb-2">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={wrapQuotes} onChange={(e) => setWrapQuotes(e.target.checked)} className="w-4 h-4 text-[#414FA8] rounded border-gray-300" />
            Wrap in Quotes &quot;&quot;
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={text} onChange={setText} placeholder="Paste list of items here (one per line)..." />
        <TextOutput value={output} />
      </div>
    </div>
  );
}
