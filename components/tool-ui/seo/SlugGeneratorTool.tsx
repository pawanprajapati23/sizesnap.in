'use client';

import React, { useState } from 'react';
import { CodeEditor } from '../developer/CodeEditor';
import { CodeOutput } from '../developer/CodeOutput';
import { Settings2 } from 'lucide-react';

export function SlugGeneratorTool() {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');

  let output = '';

  if (input) {
    // Basic slugification: lowercase, transliterate (naive), remove invalid chars, collapse spaces
    output = input.toLowerCase();

    // Naive transliteration for common accents (real slugify libs do this better, but this is lightweight and pure JS)
    output = output.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // Replace non-alphanumeric chars with separator
    output = output.replace(/[^a-z0-9]+/g, separator);

    // Trim separator from ends
    const sepEscaped = separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const trimRegex = new RegExp(`^${sepEscaped}+|${sepEscaped}+$`, 'g');
    output = output.replace(trimRegex, '');
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded border border-gray-200 shadow-sm flex items-center gap-4">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider flex items-center gap-1">
          <Settings2 className="w-3.5 h-3.5" /> Separator
        </label>
        <select
          value={separator}
          onChange={(e) => setSeparator(e.target.value)}
          className="bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#414FA8]"
        >
          <option value="-">Hyphen (-)</option>
          <option value="_">Underscore (_)</option>
          <option value="">None</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor value={input} onChange={setInput} placeholder="Enter article title, product name, or sentence..." label="Input Text" />
        <CodeOutput value={output} label="Generated URL Slug" />
      </div>
    </div>
  );
}
