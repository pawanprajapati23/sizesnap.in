'use client';

import React, { useState } from 'react';
import { CalculatorInput } from './CalculatorInput';
import { CalculatorResult } from './CalculatorResult';

export function PercentageDifferenceCalculatorTool() {
  const [val1, setVal1] = useState<number | ''>('');
  const [val2, setVal2] = useState<number | ''>('');

  let diff = 0;
  let percent = 0;

  if (val1 !== '' && val2 !== '') {
    const v1 = Number(val1);
    const v2 = Number(val2);
    diff = Math.abs(v1 - v2);
    const avg = (v1 + v2) / 2;
    if (avg !== 0) {
      percent = (diff / Math.abs(avg)) * 100;
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CalculatorInput label="Value A" value={val1} onChange={(v) => setVal1(v)} />
          <CalculatorInput label="Value B" value={val2} onChange={(v) => setVal2(v)} />
        </div>

        <CalculatorResult
          label="Percentage Difference"
          value={`${percent.toLocaleString('en-US', { maximumFractionDigits: 4 })}%`}
          subValue={`Absolute Difference: ${diff.toLocaleString('en-US')}`}
          highlight
        />

        <div className="bg-gray-50 p-3 rounded border text-sm text-gray-600 font-mono text-center">
          Formula: (|A - B| / ((A + B) / 2)) × 100
        </div>
      </div>
    </div>
  );
}
