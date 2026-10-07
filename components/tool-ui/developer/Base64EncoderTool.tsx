'use client';

import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { CodeOutput } from './CodeOutput';
import { Settings2 } from 'lucide-react';

export function Base64EncoderTool() {
  const [input, setInput] = useState('');

  let output = '';
  let error = null;

  if (input) {
    try {
      // Safe Unicode Base64 encoding
      const bytes = new TextEncoder().encode(input);
      const binString = Array.from(bytes, (byte) => String.fromCodePoint(byte)).join('');
      output = btoa(binString);
    } catch (e: any) {
      error = e.message || 'Encoding failed.';
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor value={input} onChange={setInput} placeholder="Type text to encode..." label="Text Input" />
        <CodeOutput value={output} error={error} label="Base64 Output" filename="encoded.txt" />
      </div>
    </div>
  );
}
