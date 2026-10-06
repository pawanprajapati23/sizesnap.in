'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';

export function SerpSnippetPreviewTool() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [isMobile, setIsMobile] = useState(false);

  const calculateWidth = (text: string) => {
    let width = 0;
    for (let i = 0; i < text.length; i++) {
      const c = text[i].toLowerCase();
      if (c === 'i' || c === 'l' || c === '1' || c === 'j' || c === 'f') width += 4;
      else if (c === 'w' || c === 'm') width += 10;
      else if (c === text[i].toUpperCase() && c !== text[i].toLowerCase()) width += 8;
      else width += 6;
    }
    return width;
  };

  const titlePx = calculateWidth(title);
  const descPx = calculateWidth(description);

  // desktop title ~600px, mobile ~400px (approx)
  // desktop desc ~920px (2 lines), mobile ~600px (approx)

  const titleLimit = isMobile ? 400 : 600;
  const descLimit = isMobile ? 600 : 920;

  const titleTruncated = titlePx > titleLimit ? title.substring(0, isMobile ? 50 : 60) + '...' : title;
  const descTruncated = descPx > descLimit ? description.substring(0, isMobile ? 110 : 155) + '...' : description;

  const displayUrl = url ? url.replace(/^https?:\/\//, '').split('/')[0] + ' › ' + url.replace(/^https?:\/\//, '').split('/').slice(1).join(' › ') : 'example.com';

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Editor */}
        <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-4">
           <h3 className="font-bold text-gray-800 border-b pb-2">Snippet Editor</h3>

           <div className="flex flex-col gap-1.5">
             <div className="flex justify-between items-center">
               <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Page Title</label>
               <span className={`text-xs font-semibold ${titlePx > titleLimit ? 'text-red-500' : 'text-emerald-600'}`}>{titlePx} / {titleLimit}px</span>
             </div>
             <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="Enter title tag..." />
           </div>

           <div className="flex flex-col gap-1.5">
             <div className="flex justify-between items-center">
               <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Meta Description</label>
               <span className={`text-xs font-semibold ${descPx > descLimit ? 'text-red-500' : 'text-emerald-600'}`}>{descPx} / {descLimit}px</span>
             </div>
             <textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8] h-24 resize-y" placeholder="Enter meta description..." />
           </div>

           <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">URL</label>
             <input type="text" value={url} onChange={e => setUrl(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="https://example.com/page" />
           </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col gap-4">
           <div className="flex items-center gap-4 bg-white p-3 rounded border border-gray-200">
             <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
               <input type="radio" checked={!isMobile} onChange={() => setIsMobile(false)} className="w-4 h-4 text-[#414FA8]" /> Desktop
             </label>
             <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
               <input type="radio" checked={isMobile} onChange={() => setIsMobile(true)} className="w-4 h-4 text-[#414FA8]" /> Mobile
             </label>
           </div>

           <div className={`bg-white p-6 rounded border border-gray-200 shadow-sm font-sans mx-auto w-full ${isMobile ? 'max-w-[400px]' : 'max-w-[650px]'}`}>
             <div className="flex items-center gap-3 border-b border-gray-100 pb-3 mb-4 text-sm text-gray-500">
               <Search className="w-4 h-4" /> Google Search Preview
             </div>

             {isMobile ? (
               <div className="flex flex-col gap-1.5">
                 <div className="flex items-center gap-2">
                   <div className="w-7 h-7 bg-gray-200 rounded-full shrink-0"></div>
                   <div className="flex flex-col leading-tight">
                     <span className="text-[14px] text-[#202124]">{url ? url.replace(/^https?:\/\//, '').split('/')[0] : 'Example'}</span>
                     <span className="text-[12px] text-[#4d5156]">{displayUrl}</span>
                   </div>
                 </div>
                 <div className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer leading-tight mt-1">{titleTruncated || 'Please enter a title'}</div>
                 <div className="text-[14px] text-[#4d5156] leading-snug break-words mt-1">{descTruncated || 'Please enter a meta description to see how it looks in the search results.'}</div>
               </div>
             ) : (
               <div className="flex flex-col gap-0.5">
                 <div className="flex items-center gap-2 mb-1">
                   <div className="w-6 h-6 bg-gray-200 rounded-full shrink-0"></div>
                   <div className="flex flex-col leading-tight">
                     <span className="text-[14px] text-[#202124]">{url ? url.replace(/^https?:\/\//, '').split('/')[0] : 'Example Site'}</span>
                     <span className="text-[12px] text-[#4d5156]">{displayUrl}</span>
                   </div>
                 </div>
                 <div className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer leading-tight">{titleTruncated || 'Please enter a title'}</div>
                 <div className="text-[14px] text-[#4d5156] leading-snug break-words mt-1 w-full max-w-[600px]">{descTruncated || 'Please enter a meta description to see how it looks in the search results.'}</div>
               </div>
             )}
           </div>

           <p className="text-xs text-gray-500 italic text-center px-4">
             * This is an approximation. Google actively rewrites titles and descriptions depending on user search queries and device screens. No pixel-width calculation is perfectly identical to live rendering.
           </p>
        </div>
      </div>
    </div>
  );
}
