'use client';

import React, { useState } from 'react';
import { CodeOutput } from '../developer/CodeOutput';

export function CanonicalUrlGeneratorTool() {
  const [url, setUrl] = useState('');
  let output = '';
  let error = '';

  if (url.trim()) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      error = 'Canonical URL must be an absolute URL starting with http:// or https://';
    } else {
      // Escape safely
      const escaped = url.trim().replace(/"/g, '&quot;');
      output = `<link rel="canonical" href="${escaped}" />`;
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded flex items-start gap-2 text-sm shadow-sm">
        <p><strong>Note:</strong> A canonical tag tells search engines which version of a URL is the master copy. It prevents duplicate content issues. It must be placed in the <code>&lt;head&gt;</code> of your HTML document.</p>
      </div>

      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-4">
         <div className="flex flex-col gap-1.5">
           <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Preferred (Canonical) URL</label>
           <input
             type="url"
             value={url}
             onChange={e => setUrl(e.target.value)}
             className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
             placeholder="https://example.com/preferred-page"
           />
         </div>
      </div>

      <CodeOutput value={output} error={error} label="Canonical Tag Output" />
    </div>
  );
}
