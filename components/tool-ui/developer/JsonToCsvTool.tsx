'use client';

import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { CodeOutput } from './CodeOutput';
import { Settings2, AlertCircle } from 'lucide-react';

export function JsonToCsvTool() {
  const [input, setInput] = useState('');

  let output = '';
  let error = null;
  let warn = '';

  if (input.trim()) {
    try {
      let data = JSON.parse(input);

      // Ensure data is an array
      if (!Array.isArray(data)) {
        if (typeof data === 'object' && data !== null) {
          // If it's a single object, wrap it in an array
          data = [data];
          warn = 'Wrapped single JSON object into an array for CSV conversion.';
        } else {
          throw new Error('Input must be a JSON array of objects.');
        }
      }

      if (data.length > 0) {
        // Extract headers from all objects to ensure no missing columns
        const headersSet = new Set<string>();
        data.forEach((row: any) => {
          if (row && typeof row === 'object') {
            Object.keys(row).forEach(k => headersSet.add(k));
          }
        });

        const headers = Array.from(headersSet);

        // Escape CSV cell helper
        const escapeCell = (val: any): string => {
          if (val === null || val === undefined) return '';
          let str = typeof val === 'object' ? JSON.stringify(val) : String(val);
          // If contains comma, quote, or newline -> enclose in quotes and escape internal quotes
          if (str.includes(',') || str.includes('"') || str.includes('\\n')) {
            str = '"' + str.replace(/"/g, '""') + '"';
          }
          return str;
        };

        const csvRows = [];
        csvRows.push(headers.map(escapeCell).join(','));

        for (const row of data) {
          if (row && typeof row === 'object') {
            const rowValues = headers.map(header => escapeCell(row[header]));
            csvRows.push(rowValues.join(','));
          } else {
            // Primitive inside array
            csvRows.push(escapeCell(row));
          }
        }

        output = csvRows.join('\n');
      } else {
        output = '/* Empty JSON array */';
      }
    } catch (e: any) {
      error = e.message || 'Invalid JSON input.';
    }
  }

  return (
    <div className="space-y-6">
      {warn && !error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded flex items-start gap-2 text-sm shadow-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{warn}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor value={input} onChange={setInput} placeholder="Paste JSON Array here..." label="JSON Input" />
        <CodeOutput value={output} error={error} label="CSV Output" filename="converted.csv" />
      </div>
    </div>
  );
}
