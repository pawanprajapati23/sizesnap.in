'use client';

import React, { useState } from 'react';
import { CalculatorInput } from './CalculatorInput';
import { CalculatorResult } from './CalculatorResult';
import { Disclaimer } from './Disclaimer';

export function ProfitMarginCalculatorTool() {
  const [cost, setCost] = useState<number | ''>('');
  const [revenue, setRevenue] = useState<number | ''>('');

  let profit = 0;
  let margin = 0;
  let markup = 0;

  if (cost !== '' && revenue !== '') {
    const c = Number(cost);
    const r = Number(revenue);
    profit = r - c;
    if (r !== 0) margin = (profit / r) * 100;
    if (c !== 0) markup = (profit / c) * 100;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CalculatorInput label="Cost (COGS)" value={cost} onChange={setCost} />
          <CalculatorInput label="Selling Price (Revenue)" value={revenue} onChange={setRevenue} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-gray-100 pt-4">
          <CalculatorResult label="Gross Profit" value={profit.toLocaleString('en-US', { maximumFractionDigits: 2 })} highlight />
          <CalculatorResult label="Margin (%)" value={margin.toLocaleString('en-US', { maximumFractionDigits: 2 }) + '%'} />
          <CalculatorResult label="Markup (%)" value={markup.toLocaleString('en-US', { maximumFractionDigits: 2 }) + '%'} />
        </div>
      </div>
      <Disclaimer>Calculations are basic estimations and do not account for variable operating expenses, taxes, or inflation.</Disclaimer>
    </div>
  );
}
