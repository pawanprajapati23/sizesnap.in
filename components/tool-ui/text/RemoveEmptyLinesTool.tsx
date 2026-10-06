'use client';

import React, { useState } from 'react';
import { TextEditor } from './TextEditor';
import { TextOutput } from './TextOutput';

export function RemoveEmptyLinesTool() {
  const [text, setText] = useState('');
  const [trimWhitespace, setTrimWhitespace] = useState(true);

  let output = '';

  if (text) {
    const lines = text.split('\n');
    output = lines
      .filter(line => {
        if (trimWhitespace) return line.trim() !== '';
        return line !== '';
      })
      .join('\n');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 bg-white p-4 rounded border border-gray-200">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={trimWhitespace}
            onChange={(e) => setTrimWhitespace(e.target.checked)}
            className="w-4 h-4 text-[#414FA8] rounded border-gray-300 focus:ring-[#414FA8]"
          />
          Also remove whitespace-only lines
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={text} onChange={setText} placeholder="Paste text with empty lines here..." />
        <TextOutput value={output} />
      </div>
    </div>
  );
}
