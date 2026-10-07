'use client';

import React, { useState } from 'react';
import { TextEditor } from '../text/TextEditor';
import { TextOutput } from '../text/TextOutput';

export function RemoveExtraSpacesTool() {
  const [text, setText] = useState('');
  const [opts, setOpts] = useState({
    doubleSpaces: true,
    leadingTrailing: true,
    tabsToSpaces: true,
  });

  const toggleOpt = (key: keyof typeof opts) => setOpts(prev => ({ ...prev, [key]: !prev[key] }));

  let output = text;

  if (text) {
    if (opts.tabsToSpaces) {
      output = output.replace(/\t/g, ' ');
    }
    if (opts.doubleSpaces) {
      output = output.replace(/ {2,}/g, ' ');
    }
    if (opts.leadingTrailing) {
      output = output.split('\n').map(l => l.trim()).join('\n');
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-x-6 gap-y-3 bg-white p-4 rounded border border-gray-200">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={opts.doubleSpaces} onChange={() => toggleOpt('doubleSpaces')} className="w-4 h-4 text-[#414FA8] rounded border-gray-300" />
          Remove double/multiple spaces
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={opts.leadingTrailing} onChange={() => toggleOpt('leadingTrailing')} className="w-4 h-4 text-[#414FA8] rounded border-gray-300" />
          Trim leading and trailing spaces per line
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input type="checkbox" checked={opts.tabsToSpaces} onChange={() => toggleOpt('tabsToSpaces')} className="w-4 h-4 text-[#414FA8] rounded border-gray-300" />
          Convert tabs to spaces
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={text} onChange={setText} placeholder="Paste text with excessive spacing..." />
        <TextOutput value={output} />
      </div>
    </div>
  );
}
