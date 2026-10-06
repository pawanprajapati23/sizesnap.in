'use client';

import React, { useState } from 'react';
import { CalculatorInput } from './CalculatorInput';
import { CalculatorResult } from './CalculatorResult';
import { Disclaimer } from './Disclaimer';

export function GstCalculatorTool() {
  const [amount, setAmount] = useState<number | ''>('');
  const [rate, setRate] = useState<number>(18);
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive');

  let gstAmount = 0;
  let netAmount = 0;
  let grossAmount = 0;

  if (amount !== '') {
    const a = Number(amount);
    const r = Number(rate);

    if (mode === 'exclusive') {
      // Adding GST
      netAmount = a;
      gstAmount = a * (r / 100);
      grossAmount = netAmount + gstAmount;
    } else {
      // Removing GST
      grossAmount = a;
      gstAmount = a - (a * (100 / (100 + r)));
      netAmount = grossAmount - gstAmount;
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <CalculatorInput label="Amount" value={amount} onChange={setAmount} />

          <div className="flex flex-col gap-1.5 w-full sm:w-48">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">GST Rate</label>
            <div className="flex items-center gap-2">
               <select
                 value={rate}
                 onChange={(e) => setRate(Number(e.target.value))}
                 className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
               >
                 <option value={0}>0%</option>
                 <option value={5}>5%</option>
                 <option value={12}>12%</option>
                 <option value={18}>18%</option>
                 <option value={28}>28%</option>
               </select>
            </div>
          </div>
        </div>

        <div className="flex gap-4 border-t border-gray-100 pt-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="radio" checked={mode === 'exclusive'} onChange={() => setMode('exclusive')} className="w-4 h-4 text-[#414FA8]" />
            Add GST (Exclusive)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="radio" checked={mode === 'inclusive'} onChange={() => setMode('inclusive')} className="w-4 h-4 text-[#414FA8]" />
            Remove GST (Inclusive)
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
          <CalculatorResult label="Net Amount" value={netAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })} />
          <CalculatorResult label="GST Amount" value={gstAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })} />
          <CalculatorResult label="Total (Gross)" value={grossAmount.toLocaleString('en-IN', { maximumFractionDigits: 2 })} highlight />
        </div>
      </div>
      <Disclaimer>Rates vary by item and state jurisdiction. This tool calculates pure percentages and should not be used as official tax software. Consult a CA for business filings.</Disclaimer>
    </div>
  );
}
