'use client';

import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { CodeOutput } from './CodeOutput';
import { Settings2 } from 'lucide-react';

export function JsonFormatterTool() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState(2);

  let output = '';
  let error = null;

  if (input.trim()) {
    try {
      const parsed = JSON.parse(input);
      output = JSON.stringify(parsed, null, indent);
    } catch (e: any) {
      error = e.message || 'Invalid JSON format';
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
            <Settings2 className="w-3.5 h-3.5" /> Indentation
          </label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#414FA8]"
          >
            <option value={2}>2 Spaces</option>
            <option value={4}>4 Spaces</option>
            <option value={8}>8 Spaces</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor value={input} onChange={setInput} placeholder="Paste raw JSON here..." label="Raw JSON" />
        <CodeOutput value={output} error={error} label="Formatted JSON" filename="formatted.json" />
      </div>
    </div>
  );
}
