'use client';

import React, { useState } from 'react';
import { CalculatorInput } from './CalculatorInput';
import { CalculatorResult } from './CalculatorResult';

export function PercentageIncreaseCalculatorTool() {
  const [oldVal, setOldVal] = useState<number | ''>('');
  const [newVal, setNewVal] = useState<number | ''>('');

  let diff = 0;
  let percent = 0;
  let isIncrease = true;

  if (oldVal !== '' && newVal !== '') {
    const o = Number(oldVal);
    const n = Number(newVal);
    diff = n - o;
    if (o !== 0) {
      percent = (diff / o) * 100;
    }
    isIncrease = diff >= 0;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CalculatorInput label="Original Value" value={oldVal} onChange={(v) => setOldVal(v)} />
          <CalculatorInput label="New Value" value={newVal} onChange={(v) => setNewVal(v)} />
        </div>

        <CalculatorResult
          label={`Percentage ${isIncrease ? 'Increase' : 'Decrease'}`}
          value={`${Math.abs(percent).toLocaleString('en-US', { maximumFractionDigits: 4 })}%`}
          subValue={`Difference: ${Math.abs(diff).toLocaleString('en-US')}`}
          highlight
        />

        <div className="bg-gray-50 p-3 rounded border text-sm text-gray-600 font-mono text-center">
          Formula: ((New - Old) / |Old|) × 100
        </div>
      </div>
    </div>
  );
}
