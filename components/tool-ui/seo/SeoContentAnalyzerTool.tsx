'use client';

import React, { useState, useMemo } from 'react';
import { CodeEditor } from '../developer/CodeEditor';
import { AlertCircle, Target, Type, AlignLeft, Hash } from 'lucide-react';

export function SeoContentAnalyzerTool() {
  const [html, setHtml] = useState('');
  const [keyword, setKeyword] = useState('');

  const analysis = useMemo(() => {
    if (!html.trim()) return null;

    let textContent = '';
    let h1Count = 0;
    let h2Count = 0;
    let pCount = 0;
    let linkCount = 0;
    let internalLinks = 0;
    let externalLinks = 0;

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      textContent = doc.body.textContent || '';
      h1Count = doc.querySelectorAll('h1').length;
      h2Count = doc.querySelectorAll('h2').length;
      pCount = doc.querySelectorAll('p').length;

      const links = doc.querySelectorAll('a');
      linkCount = links.length;

      links.forEach(a => {
        const href = a.getAttribute('href') || '';
        if (href.startsWith('http')) externalLinks++;
        else internalLinks++;
      });

    } catch (e) {
      return null;
    }

    const words = textContent.toLowerCase().replace(/[^\w\s-]/g, ' ').split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    let keywordMentions = 0;
    let keywordDensity = 0;
    if (keyword.trim()) {
      const kw = keyword.toLowerCase().trim();
      const regex = new RegExp(`\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
      keywordMentions = (textContent.toLowerCase().match(regex) || []).length;
      if (wordCount > 0) {
        // Density is usually occurrences / total words * 100
        // If keyword has multiple words, this is a rough approximation
        keywordDensity = (keywordMentions / wordCount) * 100;
      }
    }

    return {
      wordCount,
      h1Count,
      h2Count,
      pCount,
      linkCount,
      internalLinks,
      externalLinks,
      keywordMentions,
      keywordDensity
    };
  }, [html, keyword]);

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded flex items-start gap-2 text-sm shadow-sm">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <p><strong>Disclaimer:</strong> This tool provides SizeSnap's custom heuristic analysis of HTML content. It does <strong>not</strong> produce a "Google Score". Good SEO depends on user intent, topic authority, and readability, not just keyword placement.</p>
      </div>

      <div className="flex flex-col gap-1.5 bg-white p-4 rounded border border-gray-200 shadow-sm max-w-sm">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Target Keyword (Optional)</label>
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
          placeholder="e.g. best coffee beans"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor value={html} onChange={setHtml} placeholder="Paste page HTML here..." label="HTML Source" />

        <div className="w-full bg-[#FAFAFC] rounded border border-gray-200 shadow-xs flex flex-col">
          <div className="px-4 py-2 border-b border-gray-200 bg-gray-100/50">
             <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Analysis Report</span>
          </div>
          <div className="p-4 overflow-auto min-h-[300px] max-h-[500px]">
            {!analysis ? (
              <span className="text-gray-400 italic text-sm">Report will appear here...</span>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded border border-gray-100 shadow-sm flex items-center gap-3">
                  <div className="bg-indigo-50 p-2 rounded text-[#414FA8]"><Type className="w-5 h-5" /></div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">{analysis.wordCount}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Words</div>
                  </div>
                </div>

                {keyword && (
                  <div className="bg-white p-3 rounded border border-gray-100 shadow-sm flex items-center gap-3">
                    <div className="bg-indigo-50 p-2 rounded text-[#414FA8]"><Target className="w-5 h-5" /></div>
                    <div>
                      <div className="text-xl font-bold text-gray-900">{analysis.keywordMentions} <span className="text-sm font-medium text-gray-500">({analysis.keywordDensity.toFixed(2)}%)</span></div>
                      <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Keyword Mentions</div>
                    </div>
                  </div>
                )}

                <div className="bg-white p-3 rounded border border-gray-100 shadow-sm flex items-center gap-3">
                  <div className={`p-2 rounded ${analysis.h1Count === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}><Hash className="w-5 h-5" /></div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">{analysis.h1Count}</div>
                    <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">H1 Tags</div>
                  </div>
                </div>

                <div className="bg-white p-3 rounded border border-gray-100 shadow-sm flex flex-col justify-center">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">H2 Tags</span>
                    <span className="font-bold">{analysis.h2Count}</span>
                  </div>
                  <div className="flex justify-between text-sm border-t border-gray-50 mt-1 pt-1">
                    <span className="text-gray-600">Paragraphs</span>
                    <span className="font-bold">{analysis.pCount}</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded border border-gray-100 shadow-sm flex flex-col justify-center sm:col-span-2">
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Link Profile</div>
                  <div className="flex gap-6 text-sm">
                    <div>Total: <span className="font-bold">{analysis.linkCount}</span></div>
                    <div>Internal: <span className="font-bold text-[#414FA8]">{analysis.internalLinks}</span></div>
                    <div>External: <span className="font-bold text-emerald-600">{analysis.externalLinks}</span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
