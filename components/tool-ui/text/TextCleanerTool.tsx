'use client';

import React, { useState } from 'react';
import { TextEditor } from './TextEditor';
import { TextOutput } from './TextOutput';

export function TextCleanerTool() {
  const [text, setText] = useState('');
  const [options, setOptions] = useState({
    trimLines: true,
    removeExtraSpaces: true,
    removeEmptyLines: false,
    normalizeTabs: true
  });

  const toggleOption = (key: keyof typeof options) => {
    setOptions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  let output = text;

  if (text) {
    if (options.normalizeTabs) output = output.replace(/\t/g, ' ');
    if (options.trimLines) {
      output = output.split('\n').map(line => line.trim()).join('\n');
    }
    if (options.removeExtraSpaces) {
      output = output.replace(/ {2,}/g, ' ');
    }
    if (options.removeEmptyLines) {
      output = output.split('\n').filter(line => line.trim() !== '').join('\n');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-x-6 gap-y-3 bg-white p-4 rounded border border-gray-200">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={options.trimLines} onChange={() => toggleOption('trimLines')} className="w-4 h-4 text-[#414FA8] rounded border-gray-300" />
          Trim Line Spaces
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={options.removeExtraSpaces} onChange={() => toggleOption('removeExtraSpaces')} className="w-4 h-4 text-[#414FA8] rounded border-gray-300" />
          Remove Duplicate Spaces
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={options.normalizeTabs} onChange={() => toggleOption('normalizeTabs')} className="w-4 h-4 text-[#414FA8] rounded border-gray-300" />
          Convert Tabs to Spaces
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={options.removeEmptyLines} onChange={() => toggleOption('removeEmptyLines')} className="w-4 h-4 text-[#414FA8] rounded border-gray-300" />
          Remove Empty Lines
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={text} onChange={setText} placeholder="Paste messy text here..." />
        <TextOutput value={output} />
      </div>
    </div>
  );
}
