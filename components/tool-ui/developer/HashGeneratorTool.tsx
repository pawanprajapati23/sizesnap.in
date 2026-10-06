'use client';

import React, { useState, useEffect } from 'react';
import { CodeEditor } from './CodeEditor';
import { CodeOutput } from './CodeOutput';
import { Settings2, AlertCircle } from 'lucide-react';

export function HashGeneratorTool() {
  const [input, setInput] = useState('');
  const [algo, setAlgo] = useState<'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'>('SHA-256');
  const [output, setOutput] = useState('');

  useEffect(() => {
    let active = true;
    if (!input) { return; }

    const generateHash = async () => {
      try {
        const msgUint8 = new TextEncoder().encode(input);
        const hashBuffer = await window.crypto.subtle.digest(algo, msgUint8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
        if (active) setOutput(hashHex);
      } catch (err) {
        console.error(err);
      }
    };

    generateHash();
    return () => { active = false; };
  }, [input, algo]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
            <Settings2 className="w-3.5 h-3.5" /> Algorithm
          </label>
          <select
            value={algo}
            onChange={(e) => setAlgo(e.target.value as any)}
            className="bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#414FA8]"
          >
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-384">SHA-384</option>
            <option value="SHA-512">SHA-512</option>
            <option value="SHA-1">SHA-1 (Legacy)</option>
          </select>
        </div>
      </div>

      {algo === 'SHA-1' && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded flex items-start gap-2 text-sm shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>SHA-1 is considered cryptographically weak and insecure. It is provided for legacy compatibility only. Do not use for passwords or digital signatures.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor value={input} onChange={setInput} placeholder="Type text to hash..." label="Text Input" />
        <CodeOutput value={output} label={`${algo} Hash`} />
      </div>
    </div>
  );
}
