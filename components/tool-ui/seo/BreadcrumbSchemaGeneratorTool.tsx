'use client';

import React, { useState } from 'react';
import { CodeOutput } from '../developer/CodeOutput';
import { Plus, Trash2 } from 'lucide-react';

export function BreadcrumbSchemaGeneratorTool() {
  const [crumbs, setCrumbs] = useState([
    { name: 'Home', url: 'https://example.com/' },
    { name: 'Category', url: 'https://example.com/category' }
  ]);

  const addCrumb = () => {
    setCrumbs([...crumbs, { name: '', url: '' }]);
  };

  const removeCrumb = (index: number) => {
    setCrumbs(crumbs.filter((_, i) => i !== index));
  };

  const updateCrumb = (index: number, key: 'name' | 'url', value: string) => {
    const updated = [...crumbs];
    updated[index][key] = value;
    setCrumbs(updated);
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.filter(c => c.name.trim()).map((c, i) => {
      const item: any = {
        '@type': 'ListItem',
        position: i + 1,
        name: c.name.trim()
      };
      if (c.url.trim()) item.item = c.url.trim();
      return item;
    })
  };

  let output = '';
  if (schema.itemListElement.length > 0) {
    output = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-bold text-gray-800">Breadcrumb Levels</h3>
          <button onClick={addCrumb} className="text-sm font-medium text-[#414FA8] flex items-center gap-1 hover:underline">
            <Plus className="w-4 h-4" /> Add Level
          </button>
        </div>

        <div className="space-y-4">
          {crumbs.map((crumb, idx) => (
            <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded relative flex flex-col sm:flex-row gap-4">
              {crumbs.length > 1 && (
                <button onClick={() => removeCrumb(idx)} className="absolute top-2 right-2 sm:static sm:mt-8 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="flex flex-col gap-1.5 flex-1 pr-6 sm:pr-0">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Name (Level {idx + 1})</label>
                <input type="text" value={crumb.name} onChange={e => updateCrumb(idx, 'name', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="e.g. Home" />
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">URL</label>
                <input type="url" value={crumb.url} onChange={e => updateCrumb(idx, 'url', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="https://example.com" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <CodeOutput value={output} label="Generated BreadcrumbList Schema" filename="breadcrumb-schema.json" minHeight="min-h-[250px]" />
    </div>
  );
}
