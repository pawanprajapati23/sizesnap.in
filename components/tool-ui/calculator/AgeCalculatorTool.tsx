'use client';

import React, { useState } from 'react';
import { CalculatorResult } from './CalculatorResult';

export function AgeCalculatorTool() {
  const [dob, setDob] = useState('');
  const [targetDate, setTargetDate] = useState(() => new Date().toISOString().split('T')[0]);

  let y = 0, m = 0, d = 0;
  let totalMonths = 0, totalWeeks = 0, totalDays = 0;
  let error = '';

  if (dob && targetDate) {
    const b = new Date(dob);
    const t = new Date(targetDate);

    if (t < b) {
      error = 'Target date must be after Date of Birth.';
    } else {
      let bY = b.getFullYear();
      let bM = b.getMonth();
      let bD = b.getDate();

      let tY = t.getFullYear();
      let tM = t.getMonth();
      let tD = t.getDate();

      y = tY - bY;
      m = tM - bM;
      d = tD - bD;

      if (d < 0) {
        m--;
        // days in previous month
        const prevMonth = new Date(tY, tM, 0).getDate();
        d += prevMonth;
      }
      if (m < 0) {
        y--;
        m += 12;
      }

      const diffTime = Math.abs(t.getTime() - b.getTime());
      totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      totalWeeks = Math.floor(totalDays / 7);
      totalMonths = (y * 12) + m;
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Date of Birth</label>
             <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" />
          </div>
          <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Target Date</label>
             <input type="date" value={targetDate} onChange={e => setTargetDate(e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" />
          </div>
        </div>

        {error ? (
          <p className="text-red-600 text-sm font-medium">{error}</p>
        ) : (
          <div className="space-y-4 border-t border-gray-100 pt-4">
             <div className="grid grid-cols-3 gap-2">
                <CalculatorResult label="Years" value={y} highlight />
                <CalculatorResult label="Months" value={m} highlight />
                <CalculatorResult label="Days" value={d} highlight />
             </div>
             <div className="grid grid-cols-3 gap-2">
                <CalculatorResult label="Total Months" value={totalMonths.toLocaleString('en-US')} />
                <CalculatorResult label="Total Weeks" value={totalWeeks.toLocaleString('en-US')} />
                <CalculatorResult label="Total Days" value={totalDays.toLocaleString('en-US')} />
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
