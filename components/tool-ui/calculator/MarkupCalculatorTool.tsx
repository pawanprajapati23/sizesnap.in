'use client';

import React, { useState } from 'react';
import { CalculatorInput } from './CalculatorInput';
import { CalculatorResult } from './CalculatorResult';
import { Disclaimer } from './Disclaimer';

export function MarkupCalculatorTool() {
  const [cost, setCost] = useState<number | ''>('');
  const [markup, setMarkup] = useState<number | ''>('');

  let revenue = 0;
  let profit = 0;

  if (cost !== '' && markup !== '') {
    const c = Number(cost);
    const m = Number(markup);
    profit = c * (m / 100);
    revenue = c + profit;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CalculatorInput label="Cost" value={cost} onChange={setCost} />
          <CalculatorInput label="Markup (%)" value={markup} onChange={setMarkup} symbol="%" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
          <CalculatorResult label="Profit Amount" value={profit.toLocaleString('en-US', { maximumFractionDigits: 2 })} />
          <CalculatorResult label="Selling Price" value={revenue.toLocaleString('en-US', { maximumFractionDigits: 2 })} highlight />
        </div>
      </div>
      <Disclaimer>Calculations are basic estimations and do not constitute financial advice.</Disclaimer>
    </div>
  );
}
