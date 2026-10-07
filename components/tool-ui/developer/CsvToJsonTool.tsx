'use client';

import React, { useState } from 'react';
import { CodeEditor } from './CodeEditor';
import { CodeOutput } from './CodeOutput';
import { Settings2 } from 'lucide-react';

export function CsvToJsonTool() {
  const [input, setInput] = useState('');

  let output = '';
  let error = null;

  // Extremely basic, safe CSV parser that handles quotes correctly
  const parseCSV = (str: string) => {
    const arr: string[][] = [];
    let quote = false;
    let row = 0, col = 0;

    for (let c = 0; c < str.length; c++) {
      let cc = str[c], nc = str[c+1];
      arr[row] = arr[row] || [];
      arr[row][col] = arr[row][col] || '';

      if (cc === '"' && quote && nc === '"') {
        arr[row][col] += cc; ++c; continue;
      }
      if (cc === '"') { quote = !quote; continue; }
      if (cc === ',' && !quote) { ++col; continue; }
      if (cc === '\n' && !quote) { ++row; col = 0; continue; }
      if (cc === '\r' && !quote) {
        if (nc === '\n') { ++c; } // \r\n
        ++row; col = 0; continue;
      }
      arr[row][col] += cc;
    }
    return arr.filter(r => r.length > 0 && r.some(cell => cell.trim() !== ''));
  };

  if (input.trim()) {
    try {
      const rows = parseCSV(input);
      if (rows.length < 2) {
         throw new Error("CSV must contain at least a header row and one data row.");
      }

      const headers = rows[0];
      const jsonArr = [];

      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        const obj: Record<string, any> = {};
        for (let j = 0; j < headers.length; j++) {
          const val = row[j] || '';
          // Attempt numeric conversion safely if it looks like a number
          if (val !== '' && !isNaN(Number(val)) && val.trim() === val) {
            obj[headers[j]] = Number(val);
          } else if (val.toLowerCase() === 'true' || val.toLowerCase() === 'false') {
            obj[headers[j]] = val.toLowerCase() === 'true';
          } else {
            obj[headers[j]] = val;
          }
        }
        jsonArr.push(obj);
      }

      output = JSON.stringify(jsonArr, null, 2);
    } catch (e: any) {
      error = e.message || 'Invalid CSV format.';
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CodeEditor value={input} onChange={setInput} placeholder="Paste CSV here (with headers)..." label="CSV Input" />
        <CodeOutput value={output} error={error} label="JSON Output" filename="data.json" />
      </div>
    </div>
  );
}
