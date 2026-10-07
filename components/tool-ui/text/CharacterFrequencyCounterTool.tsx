'use client';

import React, { useState, useMemo } from 'react';
import { TextEditor } from './TextEditor';
import { Settings2 } from 'lucide-react';

export function CharacterFrequencyCounterTool() {
  const [text, setText] = useState('');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [ignoreSpaces, setIgnoreSpaces] = useState(true);

  const freq = useMemo(() => {
    let t = text;
    if (!caseSensitive) t = t.toLowerCase();
    if (ignoreSpaces) t = t.replace(/\s/g, '');

    const map = new Map<string, number>();
    for (const char of Array.from(t)) {
      map.set(char, (map.get(char) || 0) + 1);
    }

    // Sort descending by count
    return Array.from(map.entries()).sort((a, b) => b[1] - a[1]);
  }, [text, caseSensitive, ignoreSpaces]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded border border-gray-200">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={caseSensitive}
            onChange={(e) => setCaseSensitive(e.target.checked)}
            className="w-4 h-4 text-[#414FA8] rounded border-gray-300 focus:ring-[#414FA8]"
          />
          Case Sensitive
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={ignoreSpaces}
            onChange={(e) => setIgnoreSpaces(e.target.checked)}
            className="w-4 h-4 text-[#414FA8] rounded border-gray-300 focus:ring-[#414FA8]"
          />
          Ignore Spaces/Newlines
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={text} onChange={setText} placeholder="Paste text here to analyze frequency..." />

        <div className="w-full bg-[#FAFAFC] rounded border border-gray-200 shadow-xs flex flex-col">
          <div className="px-4 py-2 border-b border-gray-200 bg-gray-100/50">
             <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Frequency Results</span>
          </div>
          <div className="p-4 overflow-auto min-h-[250px] max-h-[400px]">
            {freq.length === 0 ? (
              <span className="text-gray-400 italic text-sm">Results will appear here...</span>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {freq.map(([char, count], idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white p-2 rounded border border-gray-100 shadow-sm text-sm">
                    <span className="font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-800">{char}</span>
                    <span className="font-semibold text-[#414FA8]">{count}</span>
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
