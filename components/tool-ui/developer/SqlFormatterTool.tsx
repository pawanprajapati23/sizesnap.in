'use client';

import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { CodeOutput } from './CodeOutput';

export function SqlFormatterTool() {
  const [input, setInput] = useState('');

  let output = '';
  let error = null;

  if (input.trim()) {
    try {
      // Basic SQL keyword newline insertion
      const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'LEFT JOIN', 'INNER JOIN', 'RIGHT JOIN', 'OUTER JOIN', 'JOIN', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'OFFSET', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE FROM'];

      let str = input.replace(/\s+/g, ' ');

      for (const kw of keywords) {
        // Find case-insensitive keywords and prefix with newline
        const regex = new RegExp(`\\b${kw}\\b`, 'gi');
        str = str.replace(regex, `\n${kw.toUpperCase()}`);
      }

      // Cleanup extra empty lines
      output = str.split('\n').filter(l => l.trim()).map(l => l.trim()).join('\n');
    } catch (e: any) {
      error = 'Error formatting SQL.';
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor value={input} onChange={setInput} placeholder="Paste raw SQL query here..." label="Raw SQL" />
        <CodeOutput value={output} error={error} label="Formatted SQL" filename="query.sql" />
      </div>
    </div>
  );
}
