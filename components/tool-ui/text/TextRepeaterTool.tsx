'use client';

import React, { useState } from 'react';
import { TextEditor } from './TextEditor';
import { TextOutput } from './TextOutput';
import { Settings2, AlertCircle } from 'lucide-react';

export function TextRepeaterTool() {
  const [text, setText] = useState('Hello');
  const [count, setCount] = useState(5);
  const [separator, setSeparator] = useState<string>('newline');
  const [customSep, setCustomSep] = useState('');

  let output = '';
  let error = '';

  try {
    if (count > 100000) {
      error = 'Maximum repetitions allowed is 100,000 to prevent browser crashing.';
    } else if (text) {
      let sep = '';
      if (separator === 'newline') sep = '\n';
      else if (separator === 'space') sep = ' ';
      else if (separator === 'comma') sep = ', ';
      else if (separator === 'custom') sep = customSep;

      // Prevent massive allocations by checking predicted output size first
      const predictedLength = (text.length * count) + (sep.length * (count - 1));
      if (predictedLength > 5000000) {
         error = 'Output is too large (>5MB). Please reduce the repetition count.';
         output = '';
      } else {
         output = Array(count).fill(text).join(sep);
      }
    }
  } catch (e) {
    error = 'Error generating output. Input might be too large.';
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 bg-white p-4 rounded border border-gray-200">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1"><Settings2 className="w-3.5 h-3.5" /> Repeat Count</label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
            min="1"
            max="100000"
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
            <option value="space">Space</option>
            <option value="none">None</option>
            <option value="comma">Comma</option>
            <option value="custom">Custom...</option>
          </select>
        </div>

        {separator === 'custom' && (
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Custom Separator</label>
            <input
              type="text"
              value={customSep}
              onChange={(e) => setCustomSep(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
              placeholder="e.g. - "
            />
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded flex items-start gap-2 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={text} onChange={setText} placeholder="Text to repeat..." minHeight="min-h-[150px]" />
        <TextOutput value={output} minHeight="min-h-[150px]" />
      </div>
    </div>
  );
}
