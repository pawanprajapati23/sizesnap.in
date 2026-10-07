'use client';

import React, { useState } from 'react';
import { CodeOutput } from '../developer/CodeOutput';
import { Plus, Trash2 } from 'lucide-react';

export function HreflangGeneratorTool() {
  const [links, setLinks] = useState([
    { lang: 'en', region: '', url: 'https://example.com/en' },
    { lang: 'x-default', region: '', url: 'https://example.com/' }
  ]);

  const addLink = () => setLinks([...links, { lang: '', region: '', url: '' }]);
  const removeLink = (idx: number) => setLinks(links.filter((_, i) => i !== idx));
  const updateLink = (idx: number, key: string, val: string) => {
    const arr = [...links];
    (arr[idx] as any)[key] = val;
    setLinks(arr);
  };

  let output = '';
  links.forEach(l => {
    if (!l.url.trim() || !l.lang.trim()) return;
    const hreflang = l.lang === 'x-default' ? 'x-default' : `${l.lang.toLowerCase()}${l.region ? '-' + l.region.toUpperCase() : ''}`;
    output += `<link rel="alternate" hreflang="${hreflang}" href="${l.url.replace(/"/g, '&quot;')}" />\n`;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-bold text-gray-800">Alternate Links</h3>
          <button onClick={addLink} className="text-sm font-medium text-[#414FA8] flex items-center gap-1 hover:underline">
            <Plus className="w-4 h-4" /> Add Locale
          </button>
        </div>

        <div className="space-y-4">
          {links.map((l, idx) => (
            <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded relative flex flex-col sm:flex-row gap-4">
              {links.length > 1 && (
                <button onClick={() => removeLink(idx)} className="absolute top-2 right-2 sm:static sm:mt-8 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div className="flex gap-2">
                <div className="flex flex-col gap-1.5 w-24">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Lang Code</label>
                  <input type="text" value={l.lang} onChange={e => updateLink(idx, 'lang', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="en" />
                </div>
                <div className="flex flex-col gap-1.5 w-24">
                  <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Region (Opt)</label>
                  <input type="text" value={l.region} onChange={e => updateLink(idx, 'region', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="US" disabled={l.lang === 'x-default'} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Absolute URL</label>
                <input type="url" value={l.url} onChange={e => updateLink(idx, 'url', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="https://example.com/en-us" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <CodeOutput value={output.trim()} label="Generated Hreflang Tags" filename="hreflang.html" minHeight="min-h-[200px]" />
    </div>
  );
}
