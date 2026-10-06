'use client';

import React, { useState } from 'react';
import { CalculatorInput } from './CalculatorInput';
import { CalculatorResult } from './CalculatorResult';

export function SimpleInterestCalculatorTool() {
  const [principal, setPrincipal] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>('');
  const [time, setTime] = useState<number | ''>('');

  let interest = 0;
  let total = 0;

  if (principal !== '' && rate !== '' && time !== '') {
    const P = Number(principal);
    const R = Number(rate);
    const T = Number(time);
    interest = (P * R * T) / 100;
    total = P + interest;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CalculatorInput label="Principal Amount" value={principal} onChange={setPrincipal} />
          <CalculatorInput label="Annual Interest Rate" value={rate} onChange={setRate} symbol="%" />
          <CalculatorInput label="Time (Years)" value={time} onChange={setTime} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
          <CalculatorResult label="Total Interest" value={interest.toLocaleString('en-US', { maximumFractionDigits: 2 })} />
          <CalculatorResult label="Total Amount" value={total.toLocaleString('en-US', { maximumFractionDigits: 2 })} highlight />
        </div>
      </div>
    </div>
  );
}
