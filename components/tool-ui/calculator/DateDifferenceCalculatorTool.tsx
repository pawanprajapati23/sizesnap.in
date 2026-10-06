'use client';

import React, { useState } from 'react';
import { CalculatorResult } from './CalculatorResult';

export function DateDifferenceCalculatorTool() {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');

  let y = 0, m = 0, d = 0;
  let totalDays = 0, totalWeeks = 0;

  if (date1 && date2) {
    let d1 = new Date(date1);
    let d2 = new Date(date2);

    // Always subtract smaller from larger
    if (d1 > d2) {
      const temp = d1;
      d1 = d2;
      d2 = temp;
    }

    let bY = d1.getFullYear();
    let bM = d1.getMonth();
    let bD = d1.getDate();

    let tY = d2.getFullYear();
    let tM = d2.getMonth();
    let tD = d2.getDate();

    y = tY - bY;
    m = tM - bM;
    d = tD - bD;

    if (d < 0) {
      m--;
      const prevMonth = new Date(tY, tM, 0).getDate();
      d += prevMonth;
    }
    if (m < 0) {
      y--;
      m += 12;
    }

    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    totalWeeks = parseFloat((totalDays / 7).toFixed(2));
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Start Date</label>
             <input type="date" value={date1} onChange={e => setDate1(e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" />
          </div>
          <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">End Date</label>
             <input type="date" value={date2} onChange={e => setDate2(e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" />
          </div>
        </div>

        <div className="space-y-4 border-t border-gray-100 pt-4">
           <div className="grid grid-cols-3 gap-2">
              <CalculatorResult label="Years" value={y} highlight />
              <CalculatorResult label="Months" value={m} highlight />
              <CalculatorResult label="Days" value={d} highlight />
           </div>
           <div className="grid grid-cols-2 gap-2">
              <CalculatorResult label="Total Days" value={totalDays.toLocaleString('en-US')} />
              <CalculatorResult label="Total Weeks" value={totalWeeks.toLocaleString('en-US')} />
           </div>
        </div>
      </div>
    </div>
  );
}
