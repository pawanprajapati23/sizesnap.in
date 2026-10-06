'use client';

import React from 'react';
import { Copy, Trash2 } from 'lucide-react';

interface TextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  label?: string;
  minHeight?: string;
}

export function TextEditor({
  value,
  onChange,
  placeholder = 'Type or paste your text here...',
  label = 'Input Text',
  minHeight = 'min-h-[250px]'
}: TextEditorProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <div className="w-full bg-white rounded-[4px] border border-gray-200 shadow-xs flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50/50">
        <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">{label}</label>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-500 hover:text-[#414FA8] hover:bg-indigo-50 rounded transition-colors"
            title="Copy to clipboard"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={handleClear}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
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
        className={`w-full p-4 resize-y outline-none text-sm text-gray-800 ${minHeight} bg-transparent`}
        spellCheck="false"
      />
    </div>
  );
}
