'use client';

import React from 'react';
import { Copy, Download } from 'lucide-react';
import { trackDownload } from '@/lib/firebase';

interface TextOutputProps {
  value: string;
  label?: string;
  minHeight?: string;
  filename?: string;
}

export function TextOutput({
  value,
  label = 'Output Text',
  minHeight = 'min-h-[250px]',
  filename = 'sizesnap-output.txt'
}: TextOutputProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleDownload = () => {
    if (!value) return;
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    trackDownload().catch(console.error);
  };

  return (
    <div className="w-full bg-[#FAFAFC] rounded-[4px] border border-gray-200 shadow-xs flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-100/50">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">{label}</label>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-600 hover:text-[#414FA8] hover:bg-indigo-50 rounded transition-colors flex items-center gap-1.5"
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
            <span className="text-xs font-medium hidden sm:inline">Copy</span>
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 text-gray-600 hover:text-[#414FA8] hover:bg-indigo-50 rounded transition-colors flex items-center gap-1.5"
            title="Download TXT"
          >
            <Download className="h-4 w-4" />
            <span className="text-xs font-medium hidden sm:inline">Save</span>
          </button>
        </div>
      </div>
      <div className={`w-full p-4 overflow-auto text-sm text-gray-800 ${minHeight} whitespace-pre-wrap font-mono`}>
        {value || <span className="text-gray-400 italic">Output will appear here...</span>}
      </div>
    </div>
  );
}
