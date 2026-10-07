'use client';

import React, { useState } from 'react';
import { CalculatorInput } from '../calculator/CalculatorInput';
import { CalculatorResult } from '../calculator/CalculatorResult';
import { Plus, Trash2 } from 'lucide-react';

export function GradeCalculatorTool() {
  const [assignments, setAssignments] = useState([
    { id: '1', name: 'Assignment 1', grade: '', weight: '' },
    { id: '2', name: 'Midterm', grade: '', weight: '' }
  ]);

  const [result, setResult] = useState<{ overallGrade: number, letterGrade: string } | null>(null);
  const [error, setError] = useState('');

  const addAssignment = () => {
    setAssignments([...assignments, { id: Date.now().toString(), name: `Assignment ${assignments.length + 1}`, grade: '', weight: '' }]);
  };

  const updateAssignment = (id: string, field: 'name' | 'grade' | 'weight', value: string) => {
    setAssignments(assignments.map(a => a.id === id ? { ...a, [field]: value } : a));
    setResult(null);
    setError('');
  };

  const removeAssignment = (id: string) => {
    setAssignments(assignments.filter(a => a.id !== id));
    setResult(null);
    setError('');
  };

  const calculate = () => {
    setError('');
    setResult(null);

    let totalWeight = 0;
    let weightedSum = 0;

    for (const a of assignments) {
      if (!a.grade || !a.weight) continue; // skip empty ones
      const g = parseFloat(a.grade);
      const w = parseFloat(a.weight);

      if (isNaN(g) || isNaN(w) || g < 0 || w < 0) {
        setError('Please enter valid positive numbers for all filled fields.');
        return;
      }

      totalWeight += w;
      weightedSum += (g * w);
    }

    if (totalWeight === 0) {
      setError('Please enter at least one assignment with a weight greater than 0.');
      return;
    }

    const overallGrade = weightedSum / totalWeight;
    let letterGrade = 'F';
    if (overallGrade >= 90) letterGrade = 'A';
    else if (overallGrade >= 80) letterGrade = 'B';
    else if (overallGrade >= 70) letterGrade = 'C';
    else if (overallGrade >= 60) letterGrade = 'D';

    setResult({ overallGrade, letterGrade });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6">

        <div className="space-y-3">
          <div className="grid grid-cols-12 gap-3 pb-2 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-5 sm:col-span-6">Assignment (Optional)</div>
            <div className="col-span-3 sm:col-span-2 text-center">Grade (%)</div>
            <div className="col-span-3 sm:col-span-3 text-center">Weight (%)</div>
            <div className="col-span-1"></div>
          </div>

          {assignments.map((a, i) => (
            <div key={a.id} className="grid grid-cols-12 gap-3 items-center">
              <div className="col-span-5 sm:col-span-6">
                <input
                  type="text"
                  value={a.name}
                  onChange={(e) => updateAssignment(a.id, 'name', e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8] focus:bg-white transition-colors"
                  placeholder="e.g. Midterm"
                />
              </div>
              <div className="col-span-3 sm:col-span-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={a.grade}
                  onChange={(e) => updateAssignment(a.id, 'grade', e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
                  placeholder="95"
                />
              </div>
              <div className="col-span-3 sm:col-span-3 relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={a.weight}
                  onChange={(e) => updateAssignment(a.id, 'weight', e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 pr-7 text-sm focus:outline-none focus:border-[#414FA8]"
                  placeholder="20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">%</span>
              </div>
              <div className="col-span-1 flex justify-end">
                <button
                  onClick={() => removeAssignment(a.id)}
                  disabled={assignments.length <= 1}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50 disabled:hover:bg-transparent"
                  title="Remove"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4 pt-2">
          <button
            onClick={addAssignment}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-[#414FA8] bg-indigo-50 hover:bg-indigo-100 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Assignment
          </button>

          <button
            onClick={calculate}
            className="px-6 py-2.5 bg-[#414FA8] text-white text-sm font-bold rounded-md hover:bg-[#343f88] transition-colors"
          >
            Calculate Grade
          </button>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        {result && (
          <div className="mt-4 pt-6 border-t border-gray-100">
            <CalculatorResult
              label="Overall Current Grade"
              value={`${result.overallGrade.toFixed(2)}%`}
              subtext={`Estimated Letter Grade: ${result.letterGrade}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
