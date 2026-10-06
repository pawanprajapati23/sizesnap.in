'use client';

import React, { useState } from 'react';
import { CalculatorInput } from './CalculatorInput';
import { CalculatorResult } from './CalculatorResult';

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

export function RatioCalculatorTool() {
  const [a, setA] = useState<number | ''>('');
  const [b, setB] = useState<number | ''>('');

  let result = '';
  if (a !== '' && b !== '' && Number(a) === Math.floor(Number(a)) && Number(b) === Math.floor(Number(b))) {
    const numA = Number(a);
    const numB = Number(b);
    if (numA === 0 && numB === 0) {
      result = '0 : 0';
    } else {
      const divisor = gcd(numA, numB);
      result = `${numA / divisor} : ${numB / divisor}`;
    }
  } else if (a !== '' && b !== '') {
    result = 'Decimals not simplified'; // basic simplification works best on integers
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <h3 className="font-bold text-gray-800 border-b pb-2">Simplify Ratio</h3>
        <div className="flex items-center gap-4">
          <CalculatorInput label="A" value={a} onChange={(v) => setA(v)} />
          <span className="text-2xl font-bold text-gray-400 mt-4">:</span>
          <CalculatorInput label="B" value={b} onChange={(v) => setB(v)} />
        </div>
        <CalculatorResult label="Simplified Ratio" value={result || '-'} highlight />
      </div>
    </div>
  );
}
