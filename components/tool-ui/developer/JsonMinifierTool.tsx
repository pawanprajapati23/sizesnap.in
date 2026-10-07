'use client';

import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { CodeOutput } from './CodeOutput';

export function JsonMinifierTool() {
  const [input, setInput] = useState('');

  let output = '';
  let error = null;
  let savings = null;

  if (input.trim()) {
    try {
      const parsed = JSON.parse(input);
      output = JSON.stringify(parsed);

      const beforeSize = new Blob([input]).size;
      const afterSize = new Blob([output]).size;
      const percent = beforeSize > 0 ? Math.round(((beforeSize - afterSize) / beforeSize) * 100) : 0;
      savings = { beforeSize, afterSize, percent };
    } catch (e: any) {
      error = e.message || 'Invalid JSON format';
    }
  }

  return (
    <div className="space-y-6">
      {savings && !error && (
        <div className="flex flex-wrap gap-4 bg-white p-4 rounded border border-gray-200 shadow-sm text-sm">
          <div>Original Size: <span className="font-mono font-semibold">{savings.beforeSize} B</span></div>
          <div>Minified Size: <span className="font-mono font-semibold">{savings.afterSize} B</span></div>
          <div>Space Saved: <span className="font-semibold text-emerald-600">{savings.percent}%</span></div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor value={input} onChange={setInput} placeholder="Paste JSON to minify..." label="Unminified JSON" />
        <CodeOutput value={output} error={error} label="Minified JSON" filename="minified.json" />
      </div>
    </div>
  );
}
