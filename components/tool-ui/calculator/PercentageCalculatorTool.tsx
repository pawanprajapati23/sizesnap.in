'use client';

import React, { useState } from 'react';
import { CalculatorInput } from './CalculatorInput';
import { CalculatorResult } from './CalculatorResult';

export function PercentageCalculatorTool() {
  // Mode 1: What is X% of Y?
  const [m1X, setM1X] = useState<number | ''>('');
  const [m1Y, setM1Y] = useState<number | ''>('');
  const r1 = (m1X !== '' && m1Y !== '') ? (Number(m1X) / 100) * Number(m1Y) : 0;

  // Mode 2: X is what percent of Y?
  const [m2X, setM2X] = useState<number | ''>('');
  const [m2Y, setM2Y] = useState<number | ''>('');
  const r2 = (m2X !== '' && m2Y !== '' && Number(m2Y) !== 0) ? (Number(m2X) / Number(m2Y)) * 100 : 0;

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-4">
        <h3 className="font-bold text-gray-800 border-b pb-2">What is X% of Y?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CalculatorInput label="Percentage (X)" value={m1X} onChange={(v) => setM1X(v)} symbol="%" />
          <CalculatorInput label="Value (Y)" value={m1Y} onChange={(v) => setM1Y(v)} />
        </div>
        <CalculatorResult label={`${m1X || '0'}% of ${m1Y || '0'} is`} value={r1.toLocaleString('en-US', { maximumFractionDigits: 4 })} highlight />
      </div>

      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-4">
        <h3 className="font-bold text-gray-800 border-b pb-2">X is what percent of Y?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CalculatorInput label="Value (X)" value={m2X} onChange={(v) => setM2X(v)} />
          <CalculatorInput label="Total (Y)" value={m2Y} onChange={(v) => setM2Y(v)} />
        </div>
        <CalculatorResult label={`${m2X || '0'} is ${r2.toLocaleString('en-US', { maximumFractionDigits: 4 })}% of ${m2Y || '0'}`} value={`${r2.toLocaleString('en-US', { maximumFractionDigits: 4 })}%`} highlight />
      </div>
    </div>
  );
}
