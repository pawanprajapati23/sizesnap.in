'use client';

import React, { useState } from 'react';
import { CalculatorInput } from '../calculator/CalculatorInput';
import { CalculatorResult } from '../calculator/CalculatorResult';

export function MarksPercentageCalculatorTool() {
  const [obtained, setObtained] = useState<number | ''>('');
  const [total, setTotal] = useState<number | ''>('');

  let percent = 0;
  if (obtained !== '' && total !== '') {
    const o = Number(obtained);
    const t = Number(total);
    if (t > 0) percent = (o / t) * 100;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CalculatorInput label="Marks Obtained" value={obtained} onChange={setObtained} />
          <CalculatorInput label="Total Maximum Marks" value={total} onChange={setTotal} />
        </div>

        <div className="border-t border-gray-100 pt-4">
          <CalculatorResult label="Percentage" value={percent > 0 ? `${percent.toFixed(2)}%` : '-'} highlight />
        </div>
      </div>
    </div>
  );
}
