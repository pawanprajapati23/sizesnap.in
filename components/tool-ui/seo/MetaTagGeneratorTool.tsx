'use client';

import React, { useState } from 'react';
import { CodeOutput } from '../developer/CodeOutput';

export function MetaTagGeneratorTool() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [author, setAuthor] = useState('');
  const [robots, setRobots] = useState('index, follow');
  const [canonical, setCanonical] = useState('');
  const [themeColor, setThemeColor] = useState('#ffffff');
  const [language, setLanguage] = useState('en');

  let output = '<head>\n';

  if (language) output += `  <meta http-equiv="Content-Language" content="${language}" />\n`;
  if (title) output += `  <title>${title}</title>\n`;
  if (description) output += `  <meta name="description" content="${description.replace(/"/g, '&quot;')}" />\n`;
  if (author) output += `  <meta name="author" content="${author.replace(/"/g, '&quot;')}" />\n`;
  if (themeColor) output += `  <meta name="theme-color" content="${themeColor}" />\n`;
  if (robots) output += `  <meta name="robots" content="${robots}" />\n`;
  output += `  <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n`;
  if (canonical) output += `  <link rel="canonical" href="${canonical.replace(/"/g, '&quot;')}" />\n`;

  output += '</head>';

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="flex flex-col gap-1.5 md:col-span-2">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Page Title</label>
             <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="Enter page title..." />
           </div>
           <div className="flex flex-col gap-1.5 md:col-span-2">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Meta Description</label>
             <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8] h-20 resize-y" placeholder="Brief summary of the page..." />
           </div>

           <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Canonical URL</label>
             <input type="url" value={canonical} onChange={e => setCanonical(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="https://example.com/page" />
           </div>
           <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Author (Optional)</label>
             <input type="text" value={author} onChange={e => setAuthor(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="John Doe" />
           </div>

           <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Robots</label>
             <select value={robots} onChange={e => setRobots(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]">
                <option value="index, follow">Index, Follow (Recommended)</option>
                <option value="noindex, follow">No-Index, Follow</option>
                <option value="index, nofollow">Index, No-Follow</option>
                <option value="noindex, nofollow">No-Index, No-Follow</option>
             </select>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-1.5">
               <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Language</label>
               <input type="text" value={language} onChange={e => setLanguage(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="en" />
             </div>
             <div className="flex flex-col gap-1.5">
               <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Theme Color</label>
               <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded h-[38px] p-1 cursor-pointer" />
             </div>
           </div>
        </div>
      </div>

      <CodeOutput value={output} label="Generated Meta Tags" filename="meta-tags.html" />
    </div>
  );
}
