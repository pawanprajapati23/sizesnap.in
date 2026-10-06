'use client';

import React, { useState, useMemo } from 'react';
import { CalculatorResult } from './CalculatorResult';

export function AverageCalculatorTool() {
  const [input, setInput] = useState('');

  const stats = useMemo(() => {
    // split by comma or newline, trim, parse, filter valid numbers
    const tokens = input.split(/[\n,]/).map(t => t.trim()).filter(t => t !== '');
    const nums = tokens.map(t => Number(t)).filter(n => !isNaN(n));

    let sum = 0;
    let mean = 0;
    if (nums.length > 0) {
      sum = nums.reduce((a, b) => a + b, 0);
      mean = sum / nums.length;
    }

    return { count: nums.length, sum, mean, ignored: tokens.length - nums.length };
  }, [input]);

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col lg:flex-row gap-6">
        <div className="flex-1 flex flex-col gap-2">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Numbers (comma or newline separated)</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-48 bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8] focus:ring-1 focus:ring-[#414FA8] resize-none"
            placeholder="e.g. 10, 20, 30\n40\n50"
          />
          {stats.ignored > 0 && <p className="text-xs text-amber-600 font-medium">Ignored {stats.ignored} invalid entries.</p>}
        </div>

        <div className="w-full lg:w-72 flex flex-col gap-3">
          <CalculatorResult label="Average (Mean)" value={stats.mean.toLocaleString('en-US', { maximumFractionDigits: 4 })} highlight />
          <div className="grid grid-cols-2 gap-3">
            <CalculatorResult label="Sum" value={stats.sum.toLocaleString('en-US', { maximumFractionDigits: 4 })} />
            <CalculatorResult label="Count" value={stats.count} />
          </div>
        </div>
      </div>
    </div>
  );
}
