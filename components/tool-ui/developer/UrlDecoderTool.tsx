'use client';

import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { CodeOutput } from './CodeOutput';

export function UrlDecoderTool() {
  const [input, setInput] = useState('');

  let output = '';
  let error = null;

  if (input) {
    try {
      // Decode replaces '+' with space typically in forms, but decodeURIComponent natively doesn't.
      // Doing a standard decode here:
      output = decodeURIComponent(input.replace(/\+/g, '%20'));
    } catch (e: any) {
      error = 'Malformed URL encoding detected.';
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor value={input} onChange={setInput} placeholder="Paste encoded URL..." label="Encoded Input" />
        <CodeOutput value={output} error={error} label="Decoded URL" />
      </div>
    </div>
  );
}
