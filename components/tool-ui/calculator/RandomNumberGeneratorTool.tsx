'use client';

import React, { useState } from 'react';
import { CalculatorInput } from './CalculatorInput';
import { RefreshCw } from 'lucide-react';

export function RandomNumberGeneratorTool() {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [count, setCount] = useState<number>(1);
  const [unique, setUnique] = useState(false);
  const [output, setOutput] = useState<number[]>([]);
  const [error, setError] = useState('');

  const generate = () => {
    setError('');
    let mx = Number(max);
    let mn = Number(min);
    let c = Number(count);

    if (mn > mx) {
      const t = mn; mn = mx; mx = t;
    }
    if (c < 1) c = 1;
    if (c > 10000) {
      setError('Maximum 10,000 numbers generated at once.');
      return;
    }

    const range = mx - mn + 1;
    if (unique && c > range) {
      setError(`Cannot generate ${c} unique numbers in a range of ${range}.`);
      return;
    }

    const res: number[] = [];

    if (unique) {
      // Using Set for uniqueness
      const set = new Set<number>();
      while (set.size < c) {
        // Safe random integer
        const rnd = Math.floor(Math.random() * range) + mn;
        set.add(rnd);
      }
      res.push(...Array.from(set));
    } else {
      for (let i = 0; i < c; i++) {
        res.push(Math.floor(Math.random() * range) + mn);
      }
    }

    setOutput(res);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CalculatorInput label="Min Value" value={min} onChange={(v) => setMin(v)} />
          <CalculatorInput label="Max Value" value={max} onChange={(v) => setMax(v)} />
          <CalculatorInput label="Quantity" value={count} onChange={(v) => setCount(v)} max="10000" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-100 pt-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={unique}
              onChange={(e) => setUnique(e.target.checked)}
              className="w-4 h-4 text-[#414FA8] rounded border-gray-300 focus:ring-[#414FA8]"
            />
            Ensure unique numbers
          </label>
          <button
            onClick={generate}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-[#414FA8] text-white rounded hover:bg-[#343f88] transition-colors text-sm font-semibold"
          >
            <RefreshCw className="w-4 h-4" /> Generate
          </button>
        </div>

        {error && <p className="text-red-600 text-sm font-medium">{error}</p>}

        {output.length > 0 && (
          <div className="mt-2">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2 block">Generated Numbers</label>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded font-mono text-gray-800 text-sm max-h-64 overflow-auto whitespace-pre-wrap leading-relaxed break-words">
              {output.join(', ')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
