'use client';

import React, { useState } from 'react';
import { CalculatorInput } from '../calculator/CalculatorInput';
import { CalculatorResult } from '../calculator/CalculatorResult';

export function AttendanceCalculatorTool() {
  const [held, setHeld] = useState<number | ''>('');
  const [attended, setAttended] = useState<number | ''>('');

  let percent = 0;
  if (held !== '' && attended !== '') {
    const h = Number(held);
    const a = Number(attended);
    if (h > 0) percent = (a / h) * 100;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CalculatorInput label="Total Classes Held" value={held} onChange={setHeld} />
          <CalculatorInput label="Classes Attended" value={attended} onChange={setAttended} />
        </div>

        <div className="border-t border-gray-100 pt-4">
          <CalculatorResult label="Current Attendance" value={percent > 0 ? `${percent.toFixed(2)}%` : '-'} highlight />
        </div>
      </div>
    </div>
  );
}
