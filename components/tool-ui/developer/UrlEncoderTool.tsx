'use client';

import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { CodeOutput } from './CodeOutput';
import { Settings2 } from 'lucide-react';

export function UrlEncoderTool() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'component' | 'full'>('component');

  let output = '';

  if (input) {
    if (mode === 'component') {
      output = encodeURIComponent(input);
    } else {
      output = encodeURI(input);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded border border-gray-200 shadow-sm">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="radio"
            checked={mode === 'component'}
            onChange={() => setMode('component')}
            className="w-4 h-4 text-[#414FA8] focus:ring-[#414FA8]"
          />
          Encode Component (Escapes ?, &, =, etc.)
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer border-l pl-4 border-gray-200">
          <input
            type="radio"
            checked={mode === 'full'}
            onChange={() => setMode('full')}
            className="w-4 h-4 text-[#414FA8] focus:ring-[#414FA8]"
          />
          Encode Full URL (Preserves syntactical chars)
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor value={input} onChange={setInput} placeholder="Type URL or query parameter..." label="Input" />
        <CodeOutput value={output} label="URL Encoded" />
      </div>
    </div>
  );
}
