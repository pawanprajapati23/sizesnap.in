'use client';

import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { CodeOutput } from './CodeOutput';

export function Base64DecoderTool() {
  const [input, setInput] = useState('');

  let output = '';
  let error = null;

  if (input.trim()) {
    try {
      const cleanInput = input.replace(/\s/g, ''); // ignore whitespace
      const binString = atob(cleanInput);
      const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
      output = new TextDecoder().decode(bytes);
    } catch (e: any) {
      error = 'Invalid Base64 string.';
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor value={input} onChange={setInput} placeholder="Paste Base64 here..." label="Base64 Input" />
        <CodeOutput value={output} error={error} label="Decoded Text" filename="decoded.txt" />
      </div>
    </div>
  );
}
