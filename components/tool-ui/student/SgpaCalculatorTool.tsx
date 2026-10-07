'use client';

import React, { useState } from 'react';
import { CalculatorResult } from '../calculator/CalculatorResult';
import { Plus, Trash2 } from 'lucide-react';

export function SgpaCalculatorTool() {
  const [subjects, setSubjects] = useState([{ gradePoint: '', credits: '' }]);

  const addSubject = () => setSubjects([...subjects, { gradePoint: '', credits: '' }]);
  const removeSubject = (idx: number) => setSubjects(subjects.filter((_, i) => i !== idx));

  const updateSubject = (idx: number, field: 'gradePoint' | 'credits', val: string) => {
    const updated = [...subjects];
    updated[idx][field] = val;
    setSubjects(updated);
  };

  let totalCredits = 0;
  let totalPoints = 0;

  subjects.forEach(s => {
    const gp = parseFloat(s.gradePoint);
    const cr = parseFloat(s.credits);
    if (!isNaN(gp) && !isNaN(cr) && cr > 0) {
      totalCredits += cr;
      totalPoints += gp * cr;
    }
  });

  const sgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
  const percentage = sgpa > 0 ? ((sgpa * 10) - 7.5) : 0; // Standard VTU/Indian uni approximation

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-bold text-gray-800">Calculate SGPA (10.0 Scale)</h3>
          <button onClick={addSubject} className="text-sm font-medium text-[#414FA8] flex items-center gap-1 hover:underline">
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>

        <div className="space-y-4">
          {subjects.map((sub, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-4 items-end bg-gray-50 p-4 rounded border border-gray-100 relative">
              {subjects.length > 1 && (
                <button onClick={() => removeSubject(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="flex-1 w-full">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 block">Grade Point (out of 10)</label>
                <input type="number" step="1" min="0" max="10" value={sub.gradePoint} onChange={e => updateSubject(idx, 'gradePoint', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="e.g. 8" />
              </div>
              <div className="flex-1 w-full">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 block">Credits</label>
                <input type="number" min="0" value={sub.credits} onChange={e => updateSubject(idx, 'credits', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="e.g. 4" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
          <CalculatorResult label="Semester SGPA" value={sgpa > 0 ? sgpa.toFixed(2) : '-'} highlight />
          <CalculatorResult label="Approx. Percentage" value={percentage > 0 ? `${percentage.toFixed(2)}%` : '-'} subValue="(Based on SGPA × 10 - 7.5)" />
        </div>
      </div>
    </div>
  );
}
