'use client';

import React, { useState } from 'react';
import { CalculatorInput } from '../calculator/CalculatorInput';
import { CalculatorResult } from '../calculator/CalculatorResult';

export function StudyHoursCalculatorTool() {
  const [days, setDays] = useState<number | ''>('');
  const [hoursPerDay, setHoursPerDay] = useState<number | ''>('');

  let totalHours = 0;
  if (days !== '' && hoursPerDay !== '') {
    totalHours = Number(days) * Number(hoursPerDay);
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CalculatorInput label="Days Until Exam" value={days} onChange={setDays} />
          <CalculatorInput label="Study Hours per Day" value={hoursPerDay} onChange={setHoursPerDay} />
        </div>

        <div className="border-t border-gray-100 pt-4">
          <CalculatorResult label="Total Available Study Hours" value={totalHours > 0 ? totalHours : '-'} highlight />
        </div>
      </div>
    </div>
  );
}
