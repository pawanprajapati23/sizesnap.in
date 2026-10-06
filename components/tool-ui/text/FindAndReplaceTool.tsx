'use client';

import React, { useState } from 'react';
import { TextEditor } from './TextEditor';
import { TextOutput } from './TextOutput';
import { Settings2 } from 'lucide-react';

export function FindAndReplaceTool() {
  const [text, setText] = useState('');
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);

  let output = text;
  let matchCount = 0;

  if (text && find) {
    try {
      // Escape find string for regex safety if not whole word
      const escapedFind = find.replace(/[.*+?^\\${}()|[\\]\\\\]/g, '\\\\$&');

      let pattern = wholeWord ? `\b${escapedFind}\b` : escapedFind;
      const flags = caseSensitive ? 'g' : 'gi';
      const regex = new RegExp(pattern, flags);

      matchCount = (text.match(regex) || []).length;
      output = text.replace(regex, replace);
    } catch (e) {
      output = text; // Fallback if invalid regex somehow
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-white p-4 rounded border border-gray-200">
        <div className="flex flex-col gap-1.5 lg:col-span-2">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Find</label>
          <input
            type="text"
            value={find}
            onChange={(e) => setFind(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
            placeholder="Text to find..."
          />
        </div>
        <div className="flex flex-col gap-1.5 lg:col-span-2">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Replace With</label>
          <input
            type="text"
            value={replace}
            onChange={(e) => setReplace(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
            placeholder="Replacement text..."
          />
        </div>

        <div className="lg:col-span-4 flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100">
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="w-4 h-4 text-[#414FA8] rounded border-gray-300" />
              Case Sensitive
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input type="checkbox" checked={wholeWord} onChange={(e) => setWholeWord(e.target.checked)} className="w-4 h-4 text-[#414FA8] rounded border-gray-300" />
              Whole Word
            </label>
          </div>
          <div className="text-sm">
             Matches Found: <span className="font-semibold text-[#414FA8]">{matchCount}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={text} onChange={setText} placeholder="Original text..." />
        <TextOutput value={output} label="Result" />
      </div>
    </div>
  );
}
