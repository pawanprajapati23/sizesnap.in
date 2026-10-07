'use client';

import React, { useState } from 'react';
import { TextEditor } from '../text/TextEditor';
import { TextOutput } from '../text/TextOutput';

export function EmailTextFormatterTool() {
  const [text, setText] = useState('');
  const [removeReplies, setRemoveReplies] = useState(true);

  let output = '';

  if (text) {
    let lines = text.split('\n');

    if (removeReplies) {
      lines = lines.filter(l => !l.trim().startsWith('>'));
    }

    output = lines.join('\n').replace(/\n{3,}/g, '\n\n');
    output = output.split('\n').map(l => l.trim()).join('\n');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 bg-white p-4 rounded border border-gray-200">
        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
          <input
            type="checkbox"
            checked={removeReplies}
            onChange={(e) => setRemoveReplies(e.target.checked)}
            className="w-4 h-4 text-[#414FA8] rounded border-gray-300 focus:ring-[#414FA8]"
          />
          Remove quoted replies (lines starting with &gt;)
        </label>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TextEditor value={text} onChange={setText} placeholder="Paste messy email thread here..." />
        <TextOutput value={output} />
      </div>
    </div>
  );
}
