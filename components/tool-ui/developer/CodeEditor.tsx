'use client';

import React from 'react';
import { Copy, Trash2 } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
  minHeight?: string;
}

export function CodeEditor({
  value,
  onChange,
  placeholder = 'Paste code here...',
  label = 'Input',
  minHeight = 'min-h-[300px]'
}: CodeEditorProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="w-full bg-[#1E1E1E] rounded-[4px] border border-gray-800 shadow-xs flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-[#252526]">
        <label className="text-xs font-semibold text-gray-300 uppercase tracking-wider">{label}</label>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/10 rounded transition-colors"
            title="Clear text"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-4 resize-y outline-none text-sm text-[#D4D4D4] font-mono leading-relaxed bg-transparent ${minHeight}`}
        spellCheck="false"
        autoCapitalize="off"
        autoComplete="off"
      />
    </div>
  );
}
