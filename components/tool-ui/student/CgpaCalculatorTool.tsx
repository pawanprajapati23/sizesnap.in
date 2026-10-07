'use client';

import React, { useState } from 'react';
import { CalculatorInput } from '../calculator/CalculatorInput';
import { CalculatorResult } from '../calculator/CalculatorResult';
import { Plus, Trash2 } from 'lucide-react';

export function CgpaCalculatorTool() {
  const [semesters, setSemesters] = useState([{ sgpa: '', credits: '' }]);

  const addSemester = () => setSemesters([...semesters, { sgpa: '', credits: '' }]);
  const removeSemester = (idx: number) => setSemesters(semesters.filter((_, i) => i !== idx));

  const updateSemester = (idx: number, field: 'sgpa' | 'credits', val: string) => {
    const updated = [...semesters];
    updated[idx][field] = val;
    setSemesters(updated);
  };

  let totalCredits = 0;
  let totalPoints = 0;

  semesters.forEach(s => {
    const sg = parseFloat(s.sgpa);
    const cr = parseFloat(s.credits);
    if (!isNaN(sg) && !isNaN(cr) && cr > 0) {
      totalCredits += cr;
      totalPoints += sg * cr;
    }
  });

  const cgpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
  const percentage = cgpa > 0 ? (cgpa * 9.5) : 0; // Standard AICTE/CBSE approximation

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-bold text-gray-800">Semester SGPA Inputs</h3>
          <button onClick={addSemester} className="text-sm font-medium text-[#414FA8] flex items-center gap-1 hover:underline">
            <Plus className="w-4 h-4" /> Add Semester
          </button>
        </div>

        <div className="space-y-4">
          {semesters.map((sem, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row gap-4 items-end bg-gray-50 p-4 rounded border border-gray-100 relative">
              {semesters.length > 1 && (
                <button onClick={() => removeSemester(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="flex-1 w-full">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 block">Semester {idx + 1} SGPA</label>
                <input type="number" step="0.01" min="0" max="10" value={sem.sgpa} onChange={e => updateSemester(idx, 'sgpa', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="e.g. 8.5" />
              </div>
              <div className="flex-1 w-full">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 block">Credits</label>
                <input type="number" min="0" value={sem.credits} onChange={e => updateSemester(idx, 'credits', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="e.g. 20" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
          <CalculatorResult label="Overall CGPA" value={cgpa > 0 ? cgpa.toFixed(2) : '-'} highlight />
          <CalculatorResult label="Approx. Percentage" value={percentage > 0 ? `${percentage.toFixed(2)}%` : '-'} subValue="(Based on CGPA × 9.5)" />
        </div>
      </div>
    </div>
  );
}
