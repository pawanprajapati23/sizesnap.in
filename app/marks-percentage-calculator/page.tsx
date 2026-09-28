"use client";

import React, { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import Link from 'next/link';

interface Subject {
  id: string;
  name: string;
  obtained: string;
  total: string;
}

export default function MarksPercentageCalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: 'Subject 1', obtained: '', total: '100' },
    { id: '2', name: 'Subject 2', obtained: '', total: '100' }
  ]);
  
  const addSubject = () => {
    setSubjects([...subjects, { id: Math.random().toString(), name: `Subject ${subjects.length + 1}`, obtained: '', total: '100' }]);
  };
  
  const removeSubject = (id: string) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter(sub => sub.id !== id));
    }
  };

  const updateSubject = (id: string, field: keyof Subject, value: string) => {
    setSubjects(subjects.map(sub => sub.id === id ? { ...sub, [field]: value } : sub));
  };

  const calculateResults = () => {
    let totalObtained = 0;
    let totalMax = 0;
    let isValid = true;

    subjects.forEach(sub => {
      const obt = parseFloat(sub.obtained);
      const tot = parseFloat(sub.total);
      if (isNaN(obt) || isNaN(tot) || obt < 0 || tot <= 0 || obt > tot) {
        isValid = false;
      } else {
        totalObtained += obt;
        totalMax += tot;
      }
    });

    if (!isValid || subjects.length === 0) return null;
    return {
      obtained: totalObtained,
      total: totalMax,
      percentage: (totalObtained / totalMax) * 100
    };
  };

  const results = calculateResults();

  return (
    <CalculatorLayout
      title="Marks Percentage Calculator"
      description="Calculate the total percentage of marks across multiple subjects with ease."
    >
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-700 hidden sm:grid">
            <div className="col-span-5">Subject Name</div>
            <div className="col-span-3">Obtained Marks</div>
            <div className="col-span-3">Maximum Marks</div>
            <div className="col-span-1"></div>
          </div>
          
          {subjects.map((sub, index) => {
            const obt = parseFloat(sub.obtained);
            const tot = parseFloat(sub.total);
            const valid = !isNaN(obt) && !isNaN(tot) && obt >= 0 && tot > 0 && obt <= tot;
            const perc = valid ? ((obt / tot) * 100).toFixed(1) : '-';
            
            return (
              <div key={sub.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-md sm:rounded-none">
                <div className="sm:col-span-5">
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
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={sub.total}
                      onChange={(e) => updateSubject(sub.id, 'total', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] text-sm"
                      placeholder="Total"
                    />
                    <span className="text-xs font-semibold text-gray-500 w-8 text-right hidden sm:block">{perc}%</span>
                  </div>
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
          <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wide border-b pb-2">Aggregate Result</h3>
          {results ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Obtained</p>
                <p className="text-2xl font-bold text-gray-900">{results.obtained}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Max Marks</p>
                <p className="text-2xl font-bold text-gray-900">{results.total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Overall Percentage</p>
                <p className="text-3xl font-extrabold text-[#414FA8]">{results.percentage.toFixed(2)}%</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 italic">Please fill in valid marks for all subjects to see the aggregate result. Obtained marks cannot exceed maximum marks.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">How to use</h2>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
          This calculator helps you find your overall percentage when you have marks from multiple subjects. Simply enter the name, obtained marks, and total marks for each subject. You can add or remove subjects as needed. The aggregate percentage is calculated automatically in real-time as you type, provided all inputs are valid.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Related Calculators</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/percentage-calculator" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">Basic Percentage</Link>
          <Link href="/exam-percentage-calculator" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">Exam Percentage</Link>
        </div>
      </div>
    </CalculatorLayout>
  );
}
