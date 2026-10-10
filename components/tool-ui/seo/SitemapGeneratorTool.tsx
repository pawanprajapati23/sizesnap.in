'use client';

import React, { useState } from 'react';
import { CodeOutput } from '../developer/CodeOutput';
import { TextEditor } from '../text/TextEditor';
import { AlertCircle } from 'lucide-react';

export function SitemapGeneratorTool() {
  const [urlsText, setUrlsText] = useState('');
  const [lastMod, setLastMod] = useState(true);

  let output = '';
  let error = '';
  let count = 0;

  if (urlsText.trim()) {
    const urls = urlsText.split('\n').map(u => u.trim()).filter(Boolean);
    count = urls.length;

    if (count > 50000) {
      error = 'Maximum 50,000 URLs supported locally to prevent browser crashes.';
    } else {
      const today = new Date().toISOString().split('T')[0];
      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      for (const u of urls) {
        // Basic URL validation
        if (!u.startsWith('http')) {
          error = 'One or more URLs are invalid (must start with http:// or https://)';
          break;
        }

        // Escape XML entities safely
        const escapedUrl = u.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

        xml += `  <url>\n    <loc>${escapedUrl}</loc>\n`;
        if (lastMod) {
          xml += `    <lastmod>${today}</lastmod>\n`;
        }
        xml += `  </url>\n`;
      }

      xml += `</urlset>`;
      if (!error) output = xml;
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded flex items-start gap-2 text-sm shadow-sm">
        <AlertCircle className="w-5 h-5 shrink-0" />
        <p>This tool manually builds a static XML sitemap from a list of URLs. It does not crawl your site. Modern frameworks (like Next.js) often generate sitemaps dynamically.</p>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded border border-gray-200 shadow-sm">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={lastMod}
            onChange={(e) => setLastMod(e.target.checked)}
            className="w-4 h-4 text-[#414FA8] rounded border-gray-300 focus:ring-[#414FA8]"
          />
          Include &lt;lastmod&gt; tag (Today&apos;s Date)
        </label>
        {count > 0 && <span className="ml-auto text-sm font-semibold text-[#414FA8]">{count} URLs found</span>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={urlsText} onChange={setUrlsText} placeholder="Paste absolute URLs here (one per line)...&#10;https://example.com/&#10;https://example.com/about" label="URL List" />
        <CodeOutput value={output} error={error} label="sitemap.xml Output" filename="sitemap.xml" />
      </div>
    </div>
  );
}
