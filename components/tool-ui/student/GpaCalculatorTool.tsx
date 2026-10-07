'use client';

import React, { useState } from 'react';
import { CalculatorResult } from '../calculator/CalculatorResult';
import { Plus, Trash2 } from 'lucide-react';

export function GpaCalculatorTool() {
  const [subjects, setSubjects] = useState([{ grade: 'A', credits: '' }]);

  const addSubject = () => setSubjects([...subjects, { grade: 'A', credits: '' }]);
  const removeSubject = (idx: number) => setSubjects(subjects.filter((_, i) => i !== idx));

  const updateSubject = (idx: number, field: 'grade' | 'credits', val: string) => {
    const updated = [...subjects];
    updated[idx][field] = val;
    setSubjects(updated);
  };

  const gradePoints: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };

  let totalCredits = 0;
  let totalPoints = 0;

  subjects.forEach(s => {
    const cr = parseFloat(s.credits);
    const pt = gradePoints[s.grade];
    if (!isNaN(cr) && cr > 0 && pt !== undefined) {
      totalCredits += cr;
      totalPoints += pt * cr;
    }
  });

  const gpa = totalCredits > 0 ? (totalPoints / totalCredits) : 0;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="flex items-center justify-between border-b pb-2">
          <h3 className="font-bold text-gray-800">Calculate GPA (4.0 Scale)</h3>
          <button onClick={addSubject} className="text-sm font-medium text-[#414FA8] flex items-center gap-1 hover:underline">
            <Plus className="w-4 h-4" /> Add Subject
          </button>
        </div>

        <div className="space-y-4">
          {subjects.map((sub, idx) => (
            <div key={idx} className="flex gap-4 items-end bg-gray-50 p-4 rounded border border-gray-100 relative">
              {subjects.length > 1 && (
                <button onClick={() => removeSubject(idx)} className="absolute top-2 right-2 text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 block">Grade</label>
                <select value={sub.grade} onChange={e => updateSubject(idx, 'grade', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]">
                  {Object.keys(gradePoints).map(g => <option key={g} value={g}>{g} ({gradePoints[g]})</option>)}
                </select>
              </div>
              <div className="flex-1">
                <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1 block">Credits</label>
                <input type="number" min="0" value={sub.credits} onChange={e => updateSubject(idx, 'credits', e.target.value)} className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]" placeholder="e.g. 3" />
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4">
          <CalculatorResult label="Semester GPA" value={gpa > 0 ? gpa.toFixed(2) : '-'} highlight />
        </div>
      </div>
    </div>
  );
}
