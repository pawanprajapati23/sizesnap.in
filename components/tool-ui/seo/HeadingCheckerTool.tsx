'use client';

import React, { useState } from 'react';
import { CodeEditor } from '../developer/CodeEditor';
import { CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';

export function HeadingCheckerTool() {
  const [html, setHtml] = useState('');

  let headings: { tag: string; text: string; level: number }[] = [];
  let error = '';
  let warnings: string[] = [];

  if (html.trim()) {
    try {
      const parser = new DOMParser();
      // Parse safely without executing scripts
      const doc = parser.parseFromString(html, 'text/html');

      const elements = Array.from(doc.querySelectorAll('h1, h2, h3, h4, h5, h6'));

      let h1Count = 0;
      let lastLevel = 0;

      elements.forEach(el => {
        const tag = el.tagName.toLowerCase();
        const level = parseInt(tag.replace('h', ''), 10);
        headings.push({ tag, text: el.textContent?.trim() || '<empty>', level });

        if (level === 1) h1Count++;

        // Detect skipped heading levels
        if (lastLevel > 0 && level > lastLevel + 1) {
          warnings.push(`Skipped heading level: ${tag} used immediately after h${lastLevel}`);
        }
        lastLevel = level;
      });

      if (h1Count === 0) warnings.push("No H1 tag found. An H1 is highly recommended.");
      if (h1Count > 1) warnings.push(`Found ${h1Count} H1 tags. Multiple H1s are allowed in HTML5, but standard SEO practice usually recommends exactly one.`);

    } catch (e) {
      error = 'Could not parse HTML safely.';
    }
  }

  return (
    <div className="space-y-6">

      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded flex items-start gap-2 text-sm shadow-sm">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <p>Paste the raw HTML of your webpage. This tool securely parses the HTML structure locally and extracts the exact heading hierarchy (H1-H6) to check for missing levels or missing H1s.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor value={html} onChange={setHtml} placeholder="Paste HTML source code here..." label="HTML Source" />

        <div className="w-full bg-[#FAFAFC] rounded border border-gray-200 shadow-xs flex flex-col">
          <div className="px-4 py-2 border-b border-gray-200 bg-gray-100/50">
             <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Heading Hierarchy</span>
          </div>
          <div className="p-4 overflow-auto min-h-[300px] max-h-[500px]">
            {error ? (
              <span className="text-red-500">{error}</span>
            ) : !html.trim() ? (
              <span className="text-gray-400 italic text-sm">Hierarchy will appear here...</span>
            ) : headings.length === 0 ? (
              <span className="text-gray-500 font-medium">No headings found in the provided HTML.</span>
            ) : (
              <div className="space-y-4">
                {warnings.length > 0 && (
                  <div className="bg-orange-50 border border-orange-200 rounded p-3 text-sm text-orange-800 space-y-1">
                    {warnings.map((w, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" /> <span>{w}</span>
                      </div>
                    ))}
                  </div>
                )}
                {warnings.length === 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded p-3 text-sm text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Looks good! No structure warnings.
                  </div>
                )}

                <div className="space-y-2 mt-4 border-t border-gray-100 pt-4">
                  {headings.map((h, i) => (
                    <div
                      key={i}
                      className={`text-sm py-1.5 px-2 rounded border border-gray-100 bg-white shadow-sm flex items-start gap-3`}
                      style={{ marginLeft: `${(h.level - 1) * 1.5}rem` }}
                    >
                      <span className={`font-mono font-bold text-[10px] px-1.5 py-0.5 rounded uppercase ${h.level === 1 ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100 text-gray-600'}`}>{h.tag}</span>
                      <span className="text-gray-800 break-all pt-0.5">{h.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
