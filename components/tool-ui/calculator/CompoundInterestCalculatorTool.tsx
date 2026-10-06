'use client';

import React, { useState } from 'react';
import { CalculatorInput } from './CalculatorInput';
import { CalculatorResult } from './CalculatorResult';
import { Disclaimer } from './Disclaimer';

export function CompoundInterestCalculatorTool() {
  const [principal, setPrincipal] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>('');
  const [time, setTime] = useState<number | ''>('');
  const [freq, setFreq] = useState<number>(1); // yearly

  let interest = 0;
  let total = 0;

  if (principal !== '' && rate !== '' && time !== '') {
    const P = Number(principal);
    const R = Number(rate) / 100;
    const T = Number(time);
    const n = Number(freq);

    total = P * Math.pow(1 + (R / n), n * T);
    interest = total - P;
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CalculatorInput label="Principal Amount" value={principal} onChange={setPrincipal} />
          <CalculatorInput label="Annual Interest Rate" value={rate} onChange={setRate} symbol="%" />
          <CalculatorInput label="Time (Years)" value={time} onChange={setTime} />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Compound Frequency</label>
            <select
              value={freq}
              onChange={(e) => setFreq(Number(e.target.value))}
              className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
            >
              <option value={1}>Yearly</option>
              <option value={2}>Half-Yearly</option>
              <option value={4}>Quarterly</option>
              <option value={12}>Monthly</option>
              <option value={365}>Daily</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
          <CalculatorResult label="Total Interest" value={interest.toLocaleString('en-US', { maximumFractionDigits: 2 })} />
          <CalculatorResult label="Total Amount" value={total.toLocaleString('en-US', { maximumFractionDigits: 2 })} highlight />
        </div>
      </div>
      <Disclaimer>Calculations are theoretical mathematically based on continuous uninterrupted compounding. Real-world accounts may have differing payout schedules.</Disclaimer>
    </div>
  );
}
