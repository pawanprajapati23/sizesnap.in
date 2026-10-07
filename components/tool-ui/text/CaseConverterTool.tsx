'use client';

import React, { useState } from 'react';
import { TextEditor } from './TextEditor';
import { TextOutput } from './TextOutput';
import { Settings2, Type } from 'lucide-react';

export function CaseConverterTool() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<string>('upper');

  const convertCase = () => {
    if (!text) return '';
    switch (mode) {
      case 'upper': return text.toUpperCase();
      case 'lower': return text.toLowerCase();
      case 'title':
        return text.toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      case 'sentence':
        return text.toLowerCase().replace(/(^\s*\w|[.!?]\s+\w)/g, c => c.toUpperCase());
      case 'camel':
        return text.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
          return index === 0 ? word.toLowerCase() : word.toUpperCase();
        }).replace(/\s+/g, '');
      case 'pascal':
        return text.replace(/(\w)(\w*)/g, (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase()).replace(/\s+/g, '');
      case 'snake':
        return text.replace(/\W+/g, ' ').split(/ |\B(?=[A-Z])/).map(word => word.toLowerCase()).join('_');
      case 'kebab':
        return text.replace(/\W+/g, ' ').split(/ |\B(?=[A-Z])/).map(word => word.toLowerCase()).join('-');
      default: return text;
    }
  };

  const output = convertCase();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 mb-4 bg-white p-3 rounded border border-gray-200">
        <div className="w-full flex items-center gap-2 mb-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <Settings2 className="w-4 h-4" /> Mode
        </div>
        {[
          { id: 'upper', label: 'UPPERCASE' },
          { id: 'lower', label: 'lowercase' },
          { id: 'title', label: 'Title Case' },
          { id: 'sentence', label: 'Sentence case' },
          { id: 'camel', label: 'camelCase' },
          { id: 'pascal', label: 'PascalCase' },
          { id: 'snake', label: 'snake_case' },
          { id: 'kebab', label: 'kebab-case' },
        ].map(m => (
          <button
            key={m.id}
            onClick={() => setMode(m.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors border ${mode === m.id ? 'bg-[#414FA8] text-white border-[#414FA8]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={text} onChange={setText} placeholder="Enter text to convert..." />
        <TextOutput value={output} />
      </div>
    </div>
  );
}
