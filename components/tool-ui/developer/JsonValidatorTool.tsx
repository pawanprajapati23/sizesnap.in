'use client';

import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { CheckCircle2, XCircle } from 'lucide-react';

export function JsonValidatorTool() {
  const [input, setInput] = useState('');

  let isValid = false;
  let parsedJson = null;
  let errorMessage = '';

  if (input.trim()) {
    try {
      parsedJson = JSON.parse(input);
      isValid = true;
    } catch (e: any) {
      isValid = false;
      errorMessage = e.message || 'SyntaxError: Invalid JSON';
    }
  }

  return (
    <div className="space-y-6">
      {input.trim() && (
        <div className={`p-4 rounded border flex items-start gap-3 shadow-sm ${isValid ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {isValid ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <XCircle className="w-6 h-6 shrink-0" />}
          <div>
            <h3 className="font-bold">{isValid ? 'Valid JSON' : 'Invalid JSON'}</h3>
            {!isValid && <p className="text-sm font-mono mt-1 opacity-90">{errorMessage}</p>}
          </div>
        </div>
      )}

      <CodeEditor
        value={input}
        onChange={setInput}
        placeholder="Paste JSON to validate..."
        label="JSON Input"
        minHeight="min-h-[400px]"
      />
    </div>
  );
}
