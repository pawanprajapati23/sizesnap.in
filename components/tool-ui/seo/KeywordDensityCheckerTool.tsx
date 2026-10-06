'use client';

import React, { useState, useMemo } from 'react';
import { TextEditor } from '../text/TextEditor';
import { AlertCircle } from 'lucide-react';

export function KeywordDensityCheckerTool() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    if (!text.trim()) return null;

    // Normalize text: lowercase, remove punctuation except hyphens maybe
    const normalized = text.toLowerCase().replace(/[^\w\s-]/g, ' ');
    const words = normalized.split(/\s+/).filter(w => w.length > 2); // filter tiny words
    const wordCount = text.trim().split(/\s+/).length;

    const freq = new Map<string, number>();
    for (const w of words) {
      freq.set(w, (freq.get(w) || 0) + 1);
    }

    // Sort
    const sorted = Array.from(freq.entries()).sort((a, b) => b[1] - a[1]).slice(0, 20);

    return { wordCount, topWords: sorted };
  }, [text]);

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded flex items-start gap-2 text-sm shadow-sm">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <p><strong>Note:</strong> There is no "perfect" keyword density. Modern search engines use semantic analysis rather than strict frequency counts. Use this tool to spot unnatural keyword stuffing or ensure your primary topics are mentioned, but always prioritize natural reading.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={text} onChange={setText} placeholder="Paste your article or page text here..." label="Content to Analyze" />

        <div className="w-full bg-[#FAFAFC] rounded border border-gray-200 shadow-xs flex flex-col">
          <div className="px-4 py-2 border-b border-gray-200 bg-gray-100/50 flex justify-between items-center">
             <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Top Keywords</span>
             {stats && <span className="text-xs font-medium text-[#414FA8]">{stats.wordCount} Total Words</span>}
          </div>
          <div className="p-4 overflow-auto min-h-[300px] max-h-[500px]">
            {!stats ? (
              <span className="text-gray-400 italic text-sm">Analysis will appear here...</span>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-[1fr_60px_80px] gap-2 text-xs font-semibold text-gray-500 uppercase pb-2 border-b border-gray-200">
                  <span>Keyword (&gt;2 chars)</span>
                  <span className="text-right">Count</span>
                  <span className="text-right">Density</span>
                </div>
                {stats.topWords.map(([word, count], idx) => {
                  const density = ((count / stats.wordCount) * 100).toFixed(2);
                  return (
                    <div key={idx} className="grid grid-cols-[1fr_60px_80px] gap-2 items-center text-sm py-1 border-b border-gray-100 last:border-0">
                      <span className="font-medium text-gray-800 break-all">{word}</span>
                      <span className="text-right text-gray-600">{count}</span>
                      <span className={`text-right font-semibold ${Number(density) > 5 ? 'text-red-500' : 'text-[#414FA8]'}`}>{density}%</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
