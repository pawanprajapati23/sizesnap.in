'use client';

import React, { useState } from 'react';
import { Settings2, Copy, Trash2 } from 'lucide-react';

export function MetaDescriptionGeneratorTool() {
  const [description, setDescription] = useState('');

  // Approx pixel width using average font heuristics (Arial 13px)
  const calculateWidth = (text: string) => {
    let width = 0;
    for (let i = 0; i < text.length; i++) {
      const c = text[i].toLowerCase();
      if (c === 'i' || c === 'l' || c === '1' || c === 'j' || c === 'f') width += 4;
      else if (c === 'w' || c === 'm') width += 10;
      else if (c === text[i].toUpperCase() && c !== text[i].toLowerCase()) width += 8; // Caps
      else width += 6;
    }
    return width;
  };

  const charCount = description.length;
  const pxWidth = calculateWidth(description);

  // standard target is ~920px max on desktop, let's use 160 chars or ~900px as warning zones
  const isTooLong = charCount > 160 || pxWidth > 920;
  const isPerfect = charCount >= 120 && charCount <= 160 && pxWidth <= 920;

  const handleCopy = () => {
    navigator.clipboard.writeText(description).catch(console.error);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Description Editor</label>
          <div className="flex gap-2">
             <button onClick={handleCopy} className="text-gray-500 hover:text-[#414FA8] p-1 rounded" title="Copy"><Copy className="w-4 h-4" /></button>
             <button onClick={() => setDescription('')} className="text-gray-500 hover:text-red-500 p-1 rounded" title="Clear"><Trash2 className="w-4 h-4" /></button>
          </div>
        </div>

        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full bg-gray-50 border border-gray-300 rounded px-4 py-3 text-sm focus:outline-none focus:border-[#414FA8] h-32 resize-y"
          placeholder="Start writing your meta description..."
        />

        <div className="grid grid-cols-2 gap-4">
           <div className={`p-3 rounded border flex flex-col items-center justify-center ${isTooLong ? 'bg-red-50 border-red-200 text-red-700' : isPerfect ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
              <span className="text-2xl font-bold">{charCount}</span>
              <span className="text-xs font-semibold uppercase tracking-wider mt-1">Characters</span>
           </div>
           <div className={`p-3 rounded border flex flex-col items-center justify-center ${pxWidth > 920 ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-700'}`}>
              <span className="text-2xl font-bold">~{pxWidth}</span>
              <span className="text-xs font-semibold uppercase tracking-wider mt-1">Pixels Width</span>
           </div>
        </div>

        <p className="text-xs text-gray-500 text-center italic mt-2">
          Search snippets may be truncated depending on device and query. Pixel width is an approximation. There is no strict rule, but &lt;160 characters is generally safe.
        </p>
      </div>

      {description && (
        <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Google Desktop Preview (Approximate)</label>
          <div className="max-w-[600px] font-sans">
             <div className="text-[14px] text-[#202124] leading-snug">https://example.com/your-page-url</div>
             <div className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer leading-tight mt-1 mb-1">Your Page Title Appears Here</div>
             <div className="text-[14px] text-[#4d5156] leading-snug break-words">
                {description.length > 165 ? description.substring(0, 162) + '...' : description}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
