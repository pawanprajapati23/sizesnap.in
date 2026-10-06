'use client';

import React, { useState, useEffect } from 'react';
import { CodeOutput } from './CodeOutput';
import { Settings2, RefreshCw } from 'lucide-react';

export function UuidGeneratorTool() {
  const [count, setCount] = useState(1);
  const [output, setOutput] = useState(() => { try { return crypto.randomUUID(); } catch(e) { return ''; } });

  const generateUuids = () => {
    try {
      const limit = Math.min(Math.max(1, count), 10000);
      const uuids = [];
      for (let i = 0; i < limit; i++) {
        uuids.push(crypto.randomUUID());
      }
      setOutput(uuids.join('\n'));
    } catch (e) {
      setOutput('Error: crypto.randomUUID() is not supported in this environment.');
    }
  };



  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded border border-gray-200 shadow-sm">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1"><Settings2 className="w-3.5 h-3.5" /> Quantity</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-24 bg-gray-50 border border-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
              min="1"
              max="10000"
            />
          </div>
        </div>

        <div className="flex items-end h-full mt-4 sm:mt-0 border-t sm:border-t-0 sm:border-l border-gray-100 sm:pl-4 pt-4 sm:pt-0">
          <button
            onClick={generateUuids}
            className="flex items-center gap-2 px-4 py-2 bg-[#414FA8] text-white rounded hover:bg-[#343f88] transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" /> Generate UUIDs (v4)
          </button>
        </div>
      </div>

      <CodeOutput value={output} label="Generated UUIDs" filename="uuids.txt" />
    </div>
  );
}
