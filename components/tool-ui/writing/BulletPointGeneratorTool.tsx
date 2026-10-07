'use client';

import React, { useState } from 'react';
import { TextEditor } from '../text/TextEditor';
import { TextOutput } from '../text/TextOutput';

export function BulletPointGeneratorTool() {
  const [text, setText] = useState('');
  const [bullet, setBullet] = useState('•');
  const [cleanExisting, setCleanExisting] = useState(true);

  let output = '';

  if (text) {
    let lines = text.split('\n');

    if (cleanExisting) {
      lines = lines.map(l => l.replace(/^[\s\-*•]+/, ''));
    }

    output = lines.map(l => {
      if (l.trim() === '') return '';
      return `${bullet} ${l}`;
    }).join('\n');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded border border-gray-200">
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Bullet Style:</label>
          <select
            value={bullet}
            onChange={(e) => setBullet(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#414FA8]"
          >
            <option value="•">Standard (•)</option>
            <option value="-">Dash (-)</option>
            <option value="*">Asterisk (*)</option>
            <option value="→">Arrow (→)</option>
            <option value="✓">Check (✓)</option>
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer border-l pl-4 border-gray-200">
          <input type="checkbox" checked={cleanExisting} onChange={(e) => setCleanExisting(e.target.checked)} className="w-4 h-4 text-[#414FA8] rounded border-gray-300" />
          Remove existing bullets first
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={text} onChange={setText} placeholder="Paste list of items here..." />
        <TextOutput value={output} />
      </div>
    </div>
  );
}
