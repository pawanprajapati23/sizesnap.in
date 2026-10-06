'use client';

import React, { useState } from 'react';
import { CodeOutput } from '../developer/CodeOutput';
import { Plus, Trash2, AlertCircle } from 'lucide-react';

export function HtaccessRedirectGeneratorTool() {
  const [redirects, setRedirects] = useState([
    { type: '301', oldPath: '/old-page', newUrl: 'https://example.com/new-page' }
  ]);

  const addRow = () => setRedirects([...redirects, { type: '301', oldPath: '', newUrl: '' }]);
  const removeRow = (idx: number) => setRedirects(redirects.filter((_, i) => i !== idx));
  const updateRow = (idx: number, key: string, val: string) => {
    const arr = [...redirects];
    (arr[idx] as any)[key] = val;
    setRedirects(arr);
  };

  let output = '<IfModule mod_rewrite.c>\n  RewriteEngine On\n\n';

  redirects.forEach(r => {
    if (!r.oldPath.trim() || !r.newUrl.trim()) return;

    // Naive format validation to prevent basic breaks
    let safePath = r.oldPath.trim();
    if (!safePath.startsWith('/')) safePath = '/' + safePath;
    // For rewrite rules, we usually match without the leading slash in the pattern in .htaccess
    const pattern = `^${safePath.substring(1).replace(/([.+?^${}()|\[\]\/\\])/g, '\\$1')}/?$`;

    output += `  RewriteRule ${pattern} ${r.newUrl.trim()} [R=${r.type},L]\n`;
  });

  output += '</IfModule>';

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded flex items-start gap-2 text-sm shadow-sm">
        <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
        <p><strong>Warning:</strong> This syntax is strictly for <strong>Apache</strong> servers using <code>.htaccess</code> files. This will not work on Nginx, Vercel, Netlify, or IIS. Ensure you have a backup of your .htaccess before applying.</p>
      </div>

      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-bold text-gray-800">Redirect Rules</h3>
          <button onClick={addRow} className="text-sm font-medium text-[#414FA8] flex items-center gap-1 hover:underline">
            <Plus className="w-4 h-4" /> Add Redirect
          </button>
        </div>

        <div className="space-y-4">
          {redirects.map((r, idx) => (
            <div key={idx} className="p-4 bg-gray-50 border border-gray-200 rounded relative flex flex-col sm:flex-row gap-4">
              {redirects.length > 1 && (
                <button onClick={() => removeRow(idx)} className="absolute top-2 right-2 sm:static sm:mt-8 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}

              <div className="flex flex-col gap-1.5 w-24 shrink-0">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</label>
                <select value={r.type} onChange={e => updateRow(idx, 'type', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-2 py-2 text-sm focus:outline-none focus:border-[#414FA8]">
                  <option value="301">301 (Perm)</option>
                  <option value="302">302 (Temp)</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Old Path</label>
                <input type="text" value={r.oldPath} onChange={e => updateRow(idx, 'oldPath', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="/old-category/page" />
              </div>

              <div className="flex flex-col gap-1.5 flex-1">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">New URL / Destination</label>
                <input type="url" value={r.newUrl} onChange={e => updateRow(idx, 'newUrl', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="https://example.com/new-page" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <CodeOutput value={output} label="Generated .htaccess Code" filename=".htaccess" minHeight="min-h-[250px]" />
    </div>
  );
}
