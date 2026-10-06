'use client';

import React from 'react';
import { Copy, Download } from 'lucide-react';
import { trackDownload } from '@/lib/firebase';

interface CodeOutputProps {
  value: string;
  label?: string;
  minHeight?: string;
  filename?: string;
  error?: string | null;
}

export function CodeOutput({
  value,
  label = 'Output',
  minHeight = 'min-h-[300px]',
  filename = 'output.txt',
  error
}: CodeOutputProps) {
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
    <div className={`w-full rounded-[4px] border shadow-xs flex flex-col overflow-hidden ${error ? 'border-red-800 bg-[#3A1D1D]' : 'border-gray-800 bg-[#1E1E1E]'}`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b ${error ? 'border-red-900 bg-[#4A2323]' : 'border-gray-700 bg-[#252526]'}`}>
        <label className={`text-xs font-semibold uppercase tracking-wider ${error ? 'text-red-300' : 'text-gray-300'}`}>
          {error ? 'Error' : label}
        </label>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            disabled={!!error || !value}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-50 flex items-center gap-1.5"
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
            <span className="text-xs font-medium hidden sm:inline">Copy</span>
          </button>
          <button
            onClick={handleDownload}
            disabled={!!error || !value}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors disabled:opacity-50 flex items-center gap-1.5"
            title="Download file"
          >
            <Download className="h-4 w-4" />
            <span className="text-xs font-medium hidden sm:inline">Save</span>
          </button>
        </div>
      </div>
      <div className={`w-full p-4 overflow-auto text-sm font-mono leading-relaxed ${minHeight} ${error ? 'text-red-200' : 'text-[#D4D4D4]'} whitespace-pre-wrap`}>
        {error ? error : (value || <span className="text-gray-500 italic">Output will appear here...</span>)}
      </div>
    </div>
  );
}
