'use client';

import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';

export function SkuGeneratorTool() {
  const [prefix, setPrefix] = useState('TSHIRT');
  const [attributes, setAttributes] = useState('RED-XL');
  const [includeDate, setIncludeDate] = useState(false);
  const [randomSuffixLen, setRandomSuffixLen] = useState(4);
  const [separator, setSeparator] = useState('-');

  const [generatedSkus, setGeneratedSkus] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = (count: number) => {
    const results = [];
    const dateStr = includeDate ? new Date().toISOString().slice(2, 10).replace(/-/g, '') : '';

    for (let i = 0; i < count; i++) {
       const parts = [];
       if (prefix) parts.push(prefix.toUpperCase().replace(/\s+/g, separator));
       if (attributes) parts.push(attributes.toUpperCase().replace(/\s+/g, separator));
       if (dateStr) parts.push(dateStr);

       if (randomSuffixLen > 0) {
         const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
         let suffix = '';
         for (let j = 0; j < randomSuffixLen; j++) suffix += chars.charAt(Math.floor(Math.random() * chars.length));
         parts.push(suffix);
       }

       results.push(parts.join(separator));
    }
    setGeneratedSkus(results);
    setCopiedIndex(null);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6">
         <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2">SKU Pattern Configuration</h3>

         <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">Product Prefix</label>
              <input type="text" value={prefix} onChange={e => setPrefix(e.target.value)} placeholder="e.g. TSHIRT, MUG" className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#414FA8] focus:ring-[#414FA8]" />
            </div>

            <div>
              <label className="text-sm font-bold text-gray-700 block mb-1">Attributes (Optional)</label>
              <input type="text" value={attributes} onChange={e => setAttributes(e.target.value)} placeholder="e.g. RED-XL, V2" className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#414FA8] focus:ring-[#414FA8]" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-sm font-bold text-gray-700 block mb-1">Separator</label>
                 <select value={separator} onChange={e => setSeparator(e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#414FA8] focus:ring-[#414FA8]">
                   <option value="-">Hyphen (-)</option>
                   <option value="_">Underscore (_)</option>
                   <option value=".">Dot (.)</option>
                   <option value="">None</option>
                 </select>
               </div>
               <div>
                 <label className="text-sm font-bold text-gray-700 block mb-1">Random Suffix Length</label>
                 <input type="number" min="0" max="10" value={randomSuffixLen} onChange={e => setRandomSuffixLen(parseInt(e.target.value))} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:border-[#414FA8] focus:ring-[#414FA8]" />
               </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
               <input type="checkbox" id="incDate" checked={includeDate} onChange={e => setIncludeDate(e.target.checked)} className="rounded border-gray-300 text-[#414FA8] focus:ring-[#414FA8] w-4 h-4" />
               <label htmlFor="incDate" className="text-sm font-medium text-gray-700">Include Date (YYMMDD)</label>
            </div>
         </div>

         <div className="flex gap-3 mt-2">
            <button onClick={() => generate(1)} className="flex-1 py-2.5 bg-[#414FA8] text-white font-bold rounded hover:bg-[#343f88] transition-colors">Generate 1</button>
            <button onClick={() => generate(5)} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold border border-gray-200 rounded hover:bg-gray-200 transition-colors">Generate 5</button>
         </div>
      </div>

      <div className="md:col-span-6 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
         <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4 flex items-center justify-between">
           Generated SKUs
           {generatedSkus.length > 0 && (
             <button onClick={() => generate(generatedSkus.length)} className="text-xs text-gray-500 hover:text-[#414FA8] flex items-center gap-1">
               <RefreshCw className="w-3 h-3" /> Reroll
             </button>
           )}
         </h3>

         {generatedSkus.length === 0 ? (
           <div className="flex-1 flex items-center justify-center text-sm text-gray-400 italic">Configure pattern and generate.</div>
         ) : (
           <div className="space-y-2 overflow-y-auto max-h-[300px] pr-1">
              {generatedSkus.map((sku, i) => (
                 <div key={i} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded font-mono text-sm shadow-sm group">
                    <span className="text-gray-800 break-all">{sku}</span>
                    <button
                      onClick={() => copyToClipboard(sku, i)}
                      className="ml-3 p-1.5 text-gray-400 hover:text-[#414FA8] hover:bg-indigo-50 rounded transition-colors shrink-0"
                      title="Copy SKU"
                    >
                      {copiedIndex === i ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                 </div>
              ))}
           </div>
         )}
      </div>
    </div>
  );
}
