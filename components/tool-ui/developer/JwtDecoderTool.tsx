'use client';

import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { CodeOutput } from './CodeOutput';
import { AlertCircle } from 'lucide-react';

export function JwtDecoderTool() {
  const [input, setInput] = useState('');

  let header = '';
  let payload = '';
  let error = null;

  if (input.trim()) {
    try {
      const parts = input.trim().split('.');
      if (parts.length !== 3) {
        throw new Error('JWT must have exactly 3 parts separated by dots.');
      }

      const decodeBase64Url = (str: string) => {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        const padLength = (4 - base64.length % 4) % 4;
        base64 += '='.repeat(padLength);

        // decodeURIComponent(escape()) handles UTF-8 safely
        return decodeURIComponent(escape(atob(base64)));
      };

      header = JSON.stringify(JSON.parse(decodeBase64Url(parts[0])), null, 2);
      payload = JSON.stringify(JSON.parse(decodeBase64Url(parts[1])), null, 2);

    } catch (e: any) {
      error = e.message || 'Invalid JWT structure or encoding.';
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded flex items-start gap-2 text-sm shadow-sm">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p><strong>Warning:</strong> Decoding a JWT is 100% client-side and does <strong>not</strong> verify its signature or validate its authenticity. Never trust a JWT without server-side verification.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor value={input} onChange={setInput} placeholder="Paste JWT string here..." label="Encoded JWT" />

        <div className="flex flex-col gap-4">
          <CodeOutput value={header} error={error} label="Header (Algorithm & Type)" minHeight="min-h-[100px]" />
          <CodeOutput value={payload} error={error} label="Payload (Data/Claims)" minHeight="min-h-[250px]" />
        </div>
      </div>
    </div>
  );
}
