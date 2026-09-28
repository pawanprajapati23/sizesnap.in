"use client";

import React, { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import Link from 'next/link';

interface ExamSubject {
  id: string;
  name: string;
  obtained: string;
  max: string;
}

export default function ExamPercentageCalculator() {
  const [subjects, setSubjects] = useState<ExamSubject[]>([
    { id: '1', name: 'Mathematics', obtained: '', max: '100' },
    { id: '2', name: 'Science', obtained: '', max: '100' },
    { id: '3', name: 'English', obtained: '', max: '100' }
  ]);
  
  const addSubject = () => {
    setSubjects([...subjects, { id: Math.random().toString(), name: `Subject ${subjects.length + 1}`, obtained: '', max: '100' }]);
  };
  
  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(sub => sub.id !== id));
    }
  };

  const updateSubject = (id: string, field: keyof ExamSubject, value: string) => {
    setSubjects(subjects.map(sub => sub.id === id ? { ...sub, [field]: value } : sub));
  };

  const calculateResults = () => {
    let totalObtained = 0;
    let totalMax = 0;
    let isValid = true;

    subjects.forEach(sub => {
      const obt = parseFloat(sub.obtained);
      const max = parseFloat(sub.max);
      if (isNaN(obt) || isNaN(max) || obt < 0 || max <= 0 || obt > max) {
        isValid = false;
      } else {
        totalObtained += obt;
        totalMax += max;
      }
    });

    if (!isValid || subjects.length === 0) return null;
    return {
      obtained: totalObtained,
      total: totalMax,
      percentage: (totalObtained / totalMax) * 100,
      subjectCount: subjects.length
    };
  };

  const results = calculateResults();

  return (
    <CalculatorLayout
      title="Exam Percentage Calculator"
      description="Calculate your overall exam percentage across multiple subjects."
    >
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-12 gap-3 text-sm font-medium text-gray-700 hidden sm:grid">
            <div className="col-span-4">Subject</div>
            <div className="col-span-3">Obtained Marks</div>
            <div className="col-span-3">Max Marks</div>
            <div className="col-span-1">Result</div>
            <div className="col-span-1"></div>
          </div>
          
          {subjects.map((sub) => {
            const obt = parseFloat(sub.obtained);
            const max = parseFloat(sub.max);
            const valid = !isNaN(obt) && !isNaN(max) && obt >= 0 && max > 0 && obt <= max;
            const perc = valid ? ((obt / max) * 100).toFixed(1) : '-';
            
            return (
              <div key={sub.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-gray-50 sm:bg-transparent p-4 sm:p-0 rounded-md sm:rounded-none">
                <div className="sm:col-span-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1 sm:hidden">Subject Name</label>
                  <input
                    type="text"
                    value={sub.name}
                    onChange={(e) => updateSubject(sub.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] text-sm"
                    placeholder="Subject Name"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-gray-500 mb-1 sm:hidden">Obtained Marks</label>
                  <input
                    type="number"
                    value={sub.obtained}
                    onChange={(e) => updateSubject(sub.id, 'obtained', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] text-sm"
                    placeholder="Obtained"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-xs font-medium text-gray-500 mb-1 sm:hidden">Max Marks</label>
                  <input
                    type="number"
                    value={sub.max}
                    onChange={(e) => updateSubject(sub.id, 'max', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] text-sm"
                    placeholder="Max"
                  />
                </div>
                <div className="sm:col-span-1 hidden sm:flex items-center justify-center">
                  <span className={`text-sm font-semibold ${valid ? 'text-[#414FA8]' : 'text-gray-400'}`}>
                    {perc !== '-' ? `${perc}%` : '-'}
                  </span>
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    onClick={() => removeSubject(sub.id)}
                    disabled={subjects.length <= 1}
                    className="text-red-500 hover:text-red-700 disabled:opacity-30 p-2 rounded-md hover:bg-red-50"
                    title="Remove subject"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
                <div className="sm:hidden flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">Subject Percentage</span>
                  <span className={`text-sm font-bold ${valid ? 'text-[#414FA8]' : 'text-gray-400'}`}>
                    {perc !== '-' ? `${perc}%` : '-'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={addSubject}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-[#414FA8] hover:text-[#343f88] bg-[#EEF1FB] px-4 py-2 rounded-md transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Add Subject
        </button>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-5 uppercase tracking-wide border-b border-gray-200 pb-2">Final Exam Result</h3>
          {results ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Subjects</p>
                <p className="text-xl font-bold text-gray-900">{results.subjectCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Total Obtained</p>
                <p className="text-xl font-bold text-gray-900">{results.obtained}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Total Max</p>
                <p className="text-xl font-bold text-gray-900">{results.total}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase mb-1">Overall Percentage</p>
                <p className="text-2xl font-extrabold text-[#414FA8]">{results.percentage.toFixed(2)}%</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 italic text-sm">Please fill in valid marks for all subjects to calculate your final exam result.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Formula</h2>
        <div className="bg-gray-50 p-4 rounded-md border border-gray-100 text-[#414FA8] font-medium font-mono text-sm text-center">
          Overall Exam Percentage = (Total Marks Obtained / Total Max Marks) × 100
        </div>
        <p className="text-gray-700 mt-4 text-sm">
          Unlike a simple average of percentages, this calculator correctly weighs subjects by their maximum marks. A subject worth 200 marks has double the impact on your final percentage compared to a subject worth 100 marks.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Related Calculators</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/marks-percentage-calculator" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">Marks Percentage Calculator</Link>
          <Link href="/required-marks-calculator" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">Required Marks Calculator</Link>
        </div>
      </div>
    </CalculatorLayout>
  );
}
