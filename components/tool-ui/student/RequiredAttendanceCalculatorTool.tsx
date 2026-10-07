'use client';

import React, { useState } from 'react';
import { CalculatorInput } from '../calculator/CalculatorInput';
import { CalculatorResult } from '../calculator/CalculatorResult';

export function RequiredAttendanceCalculatorTool() {
  const [held, setHeld] = useState<number | ''>('');
  const [attended, setAttended] = useState<number | ''>('');
  const [target, setTarget] = useState<number | ''>('');

  let message = '';
  let required = 0;
  let status: 'ok' | 'bunk' | 'attend' = 'ok';

  if (held !== '' && attended !== '' && target !== '') {
    const h = Number(held);
    const a = Number(attended);
    const t = Number(target) / 100;

    const currentPercent = h > 0 ? (a / h) : 0;

    if (currentPercent >= t) {
      // You can bunk
      let maxBunk = 0;
      while ((a / (h + maxBunk + 1)) >= t) {
        maxBunk++;
      }
      required = maxBunk;
      status = 'bunk';
      message = `You can skip the next ${maxBunk} classes and still maintain ${target}%.`;
    } else {
      // You need to attend
      let classesToAttend = 0;
      while (((a + classesToAttend + 1) / (h + classesToAttend + 1)) < t) {
        classesToAttend++;
      }
      classesToAttend++; // the loop breaks right before it hits the target
      required = classesToAttend;
      status = 'attend';
      message = `You need to attend ${classesToAttend} more classes to reach ${target}%.`;
    }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <CalculatorInput label="Classes Held" value={held} onChange={setHeld} />
          <CalculatorInput label="Classes Attended" value={attended} onChange={setAttended} />
          <CalculatorInput label="Target %" value={target} onChange={setTarget} symbol="%" />
        </div>

        {message && (
          <div className={`p-4 rounded border flex items-center justify-center text-center shadow-sm ${status === 'bunk' ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
             <div>
               <span className={`text-4xl font-bold ${status === 'bunk' ? 'text-emerald-600' : 'text-amber-600'}`}>{required}</span>
               <p className={`mt-2 font-medium ${status === 'bunk' ? 'text-emerald-800' : 'text-amber-800'}`}>{message}</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
