'use client';

import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';

export function RegexTesterTool() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [text, setText] = useState('');

  let matches: string[] = [];
  let error = null;

  if (pattern && text) {
    try {
      const regex = new RegExp(pattern, flags);
      // To prevent infinite loops with zero-length matches (e.g., ^ or .*), limit execution safely
      let match;
      let iterations = 0;
      const MAX_ITER = 10000;

      // Global flag behavior
      if (flags.includes('g')) {
         while ((match = regex.exec(text)) !== null) {
            matches.push(match[0]);
            iterations++;
            if (match.index === regex.lastIndex) regex.lastIndex++;
            if (iterations > MAX_ITER) {
               error = 'Match limit exceeded (potential catastrophic backtracking or infinite zero-length match).';
               break;
            }
         }
      } else {
         match = regex.exec(text);
         if (match) matches.push(match[0]);
      }
    } catch (e: any) {
      error = e.message || 'Invalid regular expression.';
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3 bg-white p-4 rounded border border-gray-200 shadow-sm">
        <div className="flex-1 flex flex-col gap-1.5 min-w-[200px]">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Regular Expression</label>
          <div className="flex items-center">
            <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l font-mono text-gray-600">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="w-full bg-white border border-gray-300 px-3 py-2 font-mono text-sm focus:outline-none focus:border-[#414FA8] focus:ring-1 focus:ring-[#414FA8]"
              placeholder="^([a-z0-9]+)$"
            />
            <span className="px-2 py-2 bg-gray-100 border border-x-0 border-gray-300 font-mono text-gray-600">/</span>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="w-16 bg-white border border-gray-300 rounded-r px-2 py-2 font-mono text-sm focus:outline-none focus:border-[#414FA8] focus:ring-1 focus:ring-[#414FA8]"
              placeholder="g"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor value={text} onChange={setText} placeholder="Test string..." label="Test Text" minHeight="min-h-[250px]" />

        <div className={`w-full rounded-[4px] border shadow-xs flex flex-col overflow-hidden ${error ? 'border-red-800 bg-[#3A1D1D]' : 'border-gray-800 bg-[#1E1E1E]'}`}>
          <div className={`px-4 py-2 border-b ${error ? 'border-red-900 bg-[#4A2323]' : 'border-gray-700 bg-[#252526]'}`}>
            <label className={`text-xs font-semibold uppercase tracking-wider ${error ? 'text-red-300' : 'text-gray-300'}`}>
              {error ? 'Error' : `Match Results (${matches.length})`}
            </label>
          </div>
          <div className={`w-full p-4 overflow-auto text-sm font-mono leading-relaxed min-h-[250px] ${error ? 'text-red-200' : 'text-[#D4D4D4]'}`}>
             {error ? error : matches.length === 0 ? (
               <span className="text-gray-500 italic">No matches...</span>
             ) : (
               <div className="flex flex-col gap-2">
                 {matches.map((m, i) => (
                   <div key={i} className="bg-white/5 border border-white/10 rounded px-2 py-1 break-all">
                     <span className="text-xs text-gray-500 mr-3 inline-block w-4">#{i+1}</span>
                     {m === '' ? <span className="text-gray-500 italic">{'<empty string>'}</span> : m}
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
