'use client';

import React, { useState } from 'react';
import { CalculatorInput } from './CalculatorInput';
import { CalculatorResult } from './CalculatorResult';
import { Disclaimer } from './Disclaimer';

export function EmiCalculatorTool() {
  const [principal, setPrincipal] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>('');
  const [tenure, setTenure] = useState<number | ''>('');
  const [tenureType, setTenureType] = useState<'yr' | 'mo'>('yr');

  let emi = 0;
  let totalInterest = 0;
  let totalPayment = 0;

  if (principal !== '' && rate !== '' && tenure !== '') {
    const P = Number(principal);
    const R = Number(rate) / 12 / 100; // monthly rate
    let N = Number(tenure);
    if (tenureType === 'yr') N = N * 12;

    if (P > 0 && N > 0) {
      if (R > 0) {
        emi = (P * R * Math.pow(1 + R, N)) / (Math.pow(1 + R, N) - 1);
      } else {
        emi = P / N; // 0% interest case
      }
      totalPayment = emi * N;
      totalInterest = totalPayment - P;
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CalculatorInput label="Loan Amount" value={principal} onChange={setPrincipal} />
          <CalculatorInput label="Interest Rate (Yearly)" value={rate} onChange={setRate} symbol="%" />
        </div>

        <div className="flex flex-col gap-1.5 w-full sm:w-1/2">
           <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Tenure</label>
           <div className="flex items-center">
             <input
               type="number"
               value={tenure}
               onChange={(e) => setTenure(parseFloat(e.target.value) || 0)}
               className="w-full bg-white border border-r-0 border-gray-300 rounded-l px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
             />
             <select
               value={tenureType}
               onChange={(e) => setTenureType(e.target.value as any)}
               className="bg-gray-50 border border-gray-300 rounded-r px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
             >
               <option value="yr">Years</option>
               <option value="mo">Months</option>
             </select>
           </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
          <CalculatorResult label="Monthly EMI" value={emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })} highlight />
          <CalculatorResult label="Total Interest" value={totalInterest.toLocaleString('en-IN', { maximumFractionDigits: 0 })} />
          <CalculatorResult label="Total Payment" value={totalPayment.toLocaleString('en-IN', { maximumFractionDigits: 0 })} />
        </div>
      </div>
      <Disclaimer>EMI figures are estimations based on standard amortization formulas. Actual bank EMIs may differ due to processing fees, insurance, changing floating rates, or advance EMIs.</Disclaimer>
    </div>
  );
}
