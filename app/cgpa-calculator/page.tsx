"use client";

import React, { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import Link from 'next/link';

interface Subject {
  id: string;
  name: string;
  gradePoints: string;
  credits: string;
}

export default function CgpaCalculator() {
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: 'Subject 1', gradePoints: '', credits: '' },
    { id: '2', name: 'Subject 2', gradePoints: '', credits: '' },
    { id: '3', name: 'Subject 3', gradePoints: '', credits: '' },
  ]);
  
  const addSubject = () => {
    setSubjects([...subjects, { id: Math.random().toString(), name: `Subject ${subjects.length + 1}`, gradePoints: '', credits: '' }]);
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
    let totalCreditPoints = 0;
    let totalCredits = 0;
    let isValid = true;

    subjects.forEach(sub => {
      const gp = parseFloat(sub.gradePoints);
      const cr = parseFloat(sub.credits);
      if (isNaN(gp) || isNaN(cr) || gp < 0 || cr <= 0) {
        isValid = false;
      } else {
        totalCreditPoints += (gp * cr);
        totalCredits += cr;
      }
    });

    if (!isValid || totalCredits === 0) return null;
    return {
      cgpa: totalCreditPoints / totalCredits,
      totalCredits,
      totalCreditPoints
    };
  };

  const results = calculateResults();

  return (
    <CalculatorLayout
      title="CGPA Calculator"
      description="Calculate your overall Cumulative Grade Point Average (CGPA) from your semester grades, grade points, and credits."
    >
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-12 gap-2 text-sm font-medium text-gray-700 hidden sm:grid">
            <div className="col-span-6">Subject / Semester Name</div>
            <div className="col-span-3">Grade Points / SGPA</div>
            <div className="col-span-2">Credits</div>
            <div className="col-span-1"></div>
          </div>
          
          {subjects.map((sub) => (
            <div key={sub.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-gray-50 sm:bg-transparent p-3 sm:p-0 rounded-md sm:rounded-none">
              <div className="sm:col-span-6">
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
                <label className="block text-xs font-medium text-gray-500 mb-1 sm:hidden">Grade Points</label>
                <input
                  type="number"
                  step="0.01"
                  value={sub.gradePoints}
                  onChange={(e) => updateSubject(sub.id, 'gradePoints', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] text-sm"
                  placeholder="e.g. 8.5"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-500 mb-1 sm:hidden">Credits</label>
                <input
                  type="number"
                  step="0.5"
                  value={sub.credits}
                  onChange={(e) => updateSubject(sub.id, 'credits', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] text-sm"
                  placeholder="e.g. 4"
                />
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
          ))}
        </div>

        <button
          onClick={addSubject}
          className="mb-8 flex items-center gap-2 text-sm font-medium text-[#414FA8] hover:text-[#343f88] bg-[#EEF1FB] px-4 py-2 rounded-md transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Add Subject / Semester
        </button>

        <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wide border-b pb-2">Your CGPA Result</h3>
          {results ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="col-span-1 sm:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Final CGPA</p>
                <p className="text-4xl font-extrabold text-[#414FA8]">{results.cgpa.toFixed(2)}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Total Credits</p>
                  <p className="text-lg font-bold text-gray-900">{results.totalCredits}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Total Points</p>
                  <p className="text-lg font-bold text-gray-900">{results.totalCreditPoints.toFixed(2)}</p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 italic">Please fill in valid grade points and credits for all rows to see your CGPA.</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Understanding CGPA</h2>
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            CGPA is a credit-weighted average, not a simple average. This means a subject with 4 credits impacts your final CGPA twice as much as a subject with 2 credits. You can use this calculator to combine multiple subjects for a semester SGPA, or combine multiple semesters (using SGPA and total semester credits) to find your overall degree CGPA.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Formula</h2>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-100 text-[#414FA8] font-medium font-mono text-sm text-center">
            CGPA = Sum(Grade Points × Credits) / Sum(Credits)
          </div>
        </section>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Related Calculators</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/cgpa-to-percentage" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">CGPA to Percentage</Link>
          <Link href="/sgpa-to-percentage" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">SGPA to Percentage</Link>
        </div>
      </div>
    </CalculatorLayout>
  );
}
