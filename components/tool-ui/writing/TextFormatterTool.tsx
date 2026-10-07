'use client';

import React, { useState } from 'react';
import { TextEditor } from '../text/TextEditor';
import { TextOutput } from '../text/TextOutput';

export function TextFormatterTool() {
  const [text, setText] = useState('');
  const [opts, setOpts] = useState({
    trimLeading: true,
    trimTrailing: true,
    normalizeSpaces: true,
    normalizeLineBreaks: true,
    collapseBlankLines: true,
    normalizeTabs: true,
  });

  const toggleOpt = (key: keyof typeof opts) => setOpts(prev => ({ ...prev, [key]: !prev[key] }));

  let output = text;

  if (text) {
    if (opts.normalizeTabs) output = output.replace(/\t/g, ' ');
    if (opts.normalizeSpaces) output = output.replace(/ {2,}/g, ' ');
    if (opts.normalizeLineBreaks) output = output.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

    // Process line by line
    let lines = output.split('\n');

    if (opts.trimLeading) lines = lines.map(l => l.replace(/^\s+/, ''));
    if (opts.trimTrailing) lines = lines.map(l => l.replace(/\s+$/, ''));

    if (opts.collapseBlankLines) {
      // Remove consecutive empty lines (leave max 1)
      output = lines.join('\n').replace(/\n{3,}/g, '\n\n');
    } else {
      output = lines.join('\n');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-x-6 gap-y-3 bg-white p-4 rounded border border-gray-200">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={opts.trimLeading} onChange={() => toggleOpt('trimLeading')} className="w-4 h-4 text-[#414FA8] rounded border-gray-300" />
          Trim Leading Whitespace
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={opts.trimTrailing} onChange={() => toggleOpt('trimTrailing')} className="w-4 h-4 text-[#414FA8] rounded border-gray-300" />
          Trim Trailing Whitespace
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={opts.normalizeSpaces} onChange={() => toggleOpt('normalizeSpaces')} className="w-4 h-4 text-[#414FA8] rounded border-gray-300" />
          Normalize Spaces
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={opts.collapseBlankLines} onChange={() => toggleOpt('collapseBlankLines')} className="w-4 h-4 text-[#414FA8] rounded border-gray-300" />
          Collapse Blank Lines
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={text} onChange={setText} placeholder="Paste unformatted text here..." />
        <TextOutput value={output} />
      </div>
    </div>
  );
}
