'use client';

import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { CodeOutput } from './CodeOutput';
import { Settings2, AlertCircle } from 'lucide-react';

export function JavascriptFormatterTool() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState(2);

  let output = '';
  let error = null;

  if (input.trim()) {
    try {
      // Extremely naive bracket-based JS formatting
      // (Full JS formatting requires Prettier/Babel AST, which violates our lightweight dependency constraint)
      let formatted = input;
      formatted = formatted.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ');
      formatted = formatted.replace(/\{/g, ' {\n').replace(/\}/g, '\n}\n').replace(/;/g, ';\n');

      const lines = formatted.split('\n');
      let pad = 0;
      const res = [];

      for(let line of lines) {
        line = line.trim();
        if (!line) continue;

        if (line.includes('}')) pad = Math.max(0, pad - 1);
        res.push(' '.repeat(pad * indent) + line);
        if (line.includes('{')) pad++;
      }
      output = res.join('\n');
    } catch (e: any) {
      error = 'Error formatting JavaScript.';
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded flex items-start gap-2 text-sm shadow-sm">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p><strong>Note:</strong> This is a lightweight bracket-matching formatter to quickly prettify minified blocks. It is not a full AST parser (like Prettier) and may struggle with complex ES6 string templates or inline functions.</p>
      </div>

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
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor value={input} onChange={setInput} placeholder="Paste JavaScript here..." label="Raw JS" />
        <CodeOutput value={output} error={error} label="Formatted JS" filename="script.js" />
      </div>
    </div>
  );
}
