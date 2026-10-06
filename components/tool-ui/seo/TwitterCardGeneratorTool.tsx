'use client';

import React, { useState } from 'react';
import { CodeOutput } from '../developer/CodeOutput';

export function TwitterCardGeneratorTool() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [image, setImage] = useState('');
  const [site, setSite] = useState('');
  const [creator, setCreator] = useState('');
  const [cardType, setCardType] = useState('summary_large_image');

  let output = '';

  if (title || description || url || image) {
    output = '<!-- Twitter Card Meta Tags -->\n';
    if (cardType) output += `<meta name="twitter:card" content="${cardType}" />\n`;
    if (site) output += `<meta name="twitter:site" content="${site.replace(/"/g, '&quot;')}" />\n`;
    if (creator) output += `<meta name="twitter:creator" content="${creator.replace(/"/g, '&quot;')}" />\n`;
    if (title) output += `<meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />\n`;
    if (description) output += `<meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />\n`;
    if (image) output += `<meta name="twitter:image" content="${image.replace(/"/g, '&quot;')}" />\n`;
    if (url) output += `<meta property="twitter:url" content="${url.replace(/"/g, '&quot;')}" />\n`;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

           <div className="flex flex-col gap-1.5 md:col-span-2">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Card Type</label>
             <select value={cardType} onChange={e => setCardType(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]">
                <option value="summary_large_image">Summary with Large Image (Recommended)</option>
                <option value="summary">Summary (Small thumbnail)</option>
                <option value="app">App</option>
                <option value="player">Player</option>
             </select>
           </div>

           <div className="flex flex-col gap-1.5 md:col-span-2">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Twitter Title</label>
             <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="Enter title..." />
           </div>
           <div className="flex flex-col gap-1.5 md:col-span-2">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Twitter Description</label>
             <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8] h-20 resize-y" placeholder="Brief summary of the page..." />
           </div>

           <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Twitter Image URL</label>
             <input type="url" value={image} onChange={e => setImage(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="https://example.com/image.jpg" />
           </div>
           <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Twitter URL</label>
             <input type="url" value={url} onChange={e => setUrl(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="https://example.com/page" />
           </div>

           <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Site Username</label>
             <input type="text" value={site} onChange={e => setSite(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="@sizesnap" />
           </div>
           <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Creator Username</label>
             <input type="text" value={creator} onChange={e => setCreator(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="@author" />
           </div>
        </div>
      </div>

      <CodeOutput value={output} label="Generated Twitter Card Tags" filename="twitter-tags.html" />
    </div>
  );
}
