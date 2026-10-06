'use client';

import React, { useState } from 'react';
import { CodeOutput } from '../developer/CodeOutput';

export function OpenGraphGeneratorTool() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [siteName, setSiteName] = useState('');
  const [type, setType] = useState('website');

  let output = '';

  if (title || description || url || image || siteName) {
    output = '<!-- Open Graph Meta Tags -->\n';
    if (title) output += `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />\n`;
    if (description) output += `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />\n`;
    if (type) output += `<meta property="og:type" content="${type}" />\n`;
    if (url) output += `<meta property="og:url" content="${url.replace(/"/g, '&quot;')}" />\n`;
    if (image) output += `<meta property="og:image" content="${image.replace(/"/g, '&quot;')}" />\n`;
    if (siteName) output += `<meta property="og:site_name" content="${siteName.replace(/"/g, '&quot;')}" />\n`;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="flex flex-col gap-1.5 md:col-span-2">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">OG Title</label>
             <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="Enter title..." />
           </div>
           <div className="flex flex-col gap-1.5 md:col-span-2">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">OG Description</label>
             <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8] h-20 resize-y" placeholder="Brief summary of the page..." />
           </div>

           <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">OG URL</label>
             <input type="url" value={url} onChange={e => setUrl(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="https://example.com/page" />
           </div>
           <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">OG Image URL</label>
             <input type="url" value={image} onChange={e => setImage(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="https://example.com/image.jpg" />
           </div>

           <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Site Name</label>
             <input type="text" value={siteName} onChange={e => setSiteName(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="e.g. SizeSnap" />
           </div>
           <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</label>
             <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]">
                <option value="website">Website</option>
                <option value="article">Article</option>
                <option value="profile">Profile</option>
                <option value="video.movie">Video</option>
             </select>
           </div>
        </div>
      </div>

      <CodeOutput value={output} label="Generated Open Graph Tags" filename="og-tags.html" />
      <p className="text-xs text-gray-500 text-center italic mt-2 max-w-2xl mx-auto">
        Note: Social platforms (Facebook, LinkedIn) cache these tags. If you update them, use their respective debugging tools to scrape the new tags. Previews are subject to platform-specific UI changes.
      </p>
    </div>
  );
}
