'use client';

import React, { useState } from 'react';
import { CalculatorResult } from './CalculatorResult';

export function TimeDurationCalculatorTool() {
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:00');

  let hours = 0;
  let mins = 0;
  let totalMins = 0;

  if (start && end) {
    const [sH, sM] = start.split(':').map(Number);
    const [eH, eM] = end.split(':').map(Number);

    let startTotal = sH * 60 + sM;
    let endTotal = eH * 60 + eM;

    // Handle crossing midnight
    if (endTotal < startTotal) {
      endTotal += 24 * 60;
    }

    totalMins = endTotal - startTotal;
    hours = Math.floor(totalMins / 60);
    mins = totalMins % 60;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Start Time</label>
             <input type="time" value={start} onChange={e => setStart(e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" />
          </div>
          <div className="flex flex-col gap-1.5">
             <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">End Time</label>
             <input type="time" value={end} onChange={e => setEnd(e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-4">
          <CalculatorResult label="Hours" value={hours} highlight />
          <CalculatorResult label="Minutes" value={mins} highlight />
        </div>
      </div>
    </div>
  );
}
