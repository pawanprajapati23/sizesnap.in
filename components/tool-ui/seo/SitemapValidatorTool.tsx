'use client';

import React, { useState } from 'react';
import { CodeEditor } from '../developer/CodeEditor';
import { CodeOutput } from '../developer/CodeOutput';
import { CheckCircle2, XCircle } from 'lucide-react';

export function SitemapValidatorTool() {
  const [input, setInput] = useState('');

  let isValid = false;
  let errorMessage = '';
  let urlCount = 0;
  let analysis = '';

  if (input.trim()) {
    try {
      const parser = new DOMParser();
      // Parse XML. DOMParser returns an error document if it fails instead of throwing.
      const doc = parser.parseFromString(input, "application/xml");

      const parseError = doc.getElementsByTagName("parsererror");
      if (parseError.length > 0) {
        throw new Error("Invalid XML structure: " + parseError[0].textContent);
      }

      const urlset = doc.getElementsByTagName("urlset");
      if (urlset.length === 0) {
        throw new Error("Missing <urlset> root element.");
      }

      const urls = doc.getElementsByTagName("url");
      urlCount = urls.length;

      const locs = doc.getElementsByTagName("loc");
      if (locs.length !== urlCount) {
         throw new Error(`Mismatch: Found ${urlCount} <url> tags but ${locs.length} <loc> tags.`);
      }

      const seen = new Set<string>();
      let duplicates = 0;

      for (let i = 0; i < locs.length; i++) {
        const locText = locs[i].textContent?.trim() || '';
        if (!locText.startsWith('http')) {
          throw new Error(`Invalid URL found at index ${i + 1}: ${locText}`);
        }
        if (seen.has(locText)) {
          duplicates++;
        }
        seen.add(locText);
      }

      isValid = true;
      analysis = `XML is well-formed.\nRoot: <urlset>\nTotal URLs (<loc>): ${urlCount}\nUnique URLs: ${seen.size}\nDuplicates Found: ${duplicates}`;

    } catch (e: any) {
      isValid = false;
      errorMessage = e.message || 'SyntaxError: Invalid XML';
    }
  }

  return (
    <div className="space-y-6">
      {input.trim() && (
        <div className={`p-4 rounded border flex items-start gap-3 shadow-sm ${isValid ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          {isValid ? <CheckCircle2 className="w-6 h-6 shrink-0" /> : <XCircle className="w-6 h-6 shrink-0" />}
          <div>
            <h3 className="font-bold">{isValid ? 'Valid XML Sitemap' : 'Validation Failed'}</h3>
            {!isValid && <p className="text-sm font-mono mt-1 opacity-90">{errorMessage}</p>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor
          value={input}
          onChange={setInput}
          placeholder="Paste sitemap.xml contents here..."
          label="Sitemap XML Input"
        />
        <CodeOutput value={analysis} label="Validation Report" />
      </div>
    </div>
  );
}
