"use client";

import React, { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import Link from 'next/link';

export default function RequiredMarksCalculator() {
  const [totalMaxMarks, setTotalMaxMarks] = useState<string>('');
  const [marksObtained, setMarksObtained] = useState<string>('');
  const [remainingMaxMarks, setRemainingMaxMarks] = useState<string>('');
  const [targetPercentage, setTargetPercentage] = useState<string>('');
  
  const [requiredMarks, setRequiredMarks] = useState<number | null>(null);
  const [status, setStatus] = useState<'achievable' | 'unachievable' | 'already_achieved' | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    setRequiredMarks(null);
    setStatus(null);

    const totalMax = parseFloat(totalMaxMarks);
    const obtained = parseFloat(marksObtained);
    const remainingMax = parseFloat(remainingMaxMarks);
    const targetPerc = parseFloat(targetPercentage);

    if (isNaN(totalMax) || isNaN(obtained) || isNaN(remainingMax) || isNaN(targetPerc)) {
      setError('Please fill in all fields with valid numbers.');
      return;
    }
    if (totalMax <= 0 || remainingMax <= 0) {
      setError('Total max marks and remaining max marks must be greater than 0.');
      return;
    }
    if (obtained < 0) {
      setError('Marks obtained cannot be negative.');
      return;
    }
    if (obtained > totalMax) {
      setError('Marks obtained cannot exceed total maximum marks so far.');
      return;
    }
    if (targetPerc <= 0 || targetPerc > 100) {
      setError('Target percentage must be between 0 and 100.');
      return;
    }

    const overallMaxMarks = totalMax + remainingMax;
    const targetMarks = (targetPerc / 100) * overallMaxMarks;
    
    if (obtained >= targetMarks) {
      setStatus('already_achieved');
      setRequiredMarks(0);
      return;
    }

    const marksNeeded = targetMarks - obtained;

    if (marksNeeded > remainingMax) {
      setStatus('unachievable');
      setRequiredMarks(marksNeeded);
      return;
    }

    setStatus('achievable');
    setRequiredMarks(marksNeeded);
  };

  return (
    <CalculatorLayout
      title="Required Marks Calculator"
      description="Find out exactly how many marks you need in your remaining exams to achieve your target percentage."
    >
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks (Exams Taken)</label>
              <input
                type="number"
                value={totalMaxMarks}
                onChange={(e) => setTotalMaxMarks(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                placeholder="e.g. 300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marks Obtained So Far</label>
              <input
                type="number"
                value={marksObtained}
                onChange={(e) => setMarksObtained(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                placeholder="e.g. 210"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Marks (Remaining Exams)</label>
              <input
                type="number"
                value={remainingMaxMarks}
                onChange={(e) => setRemainingMaxMarks(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                placeholder="e.g. 200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Overall Target Percentage (%)</label>
              <input
                type="number"
                step="0.1"
                value={targetPercentage}
                onChange={(e) => setTargetPercentage(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                placeholder="e.g. 80"
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button
              onClick={calculate}
              className="w-full bg-[#414FA8] hover:bg-[#343f88] text-white font-medium py-2.5 px-4 rounded-md transition-colors mt-2"
            >
              Calculate Required Marks
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 flex flex-col justify-center min-h-[300px]">
            {status ? (
              <div className="space-y-6 text-center">
                {status === 'already_achieved' && (
                  <div>
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Target Already Achieved!</h3>
                    <p className="text-gray-600">You have already secured enough marks to hit your target of {targetPercentage}%. Any marks you get now will only increase your percentage further.</p>
                  </div>
                )}
                
                {status === 'unachievable' && (
                  <div>
                    <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Target Unachievable</h3>
                    <p className="text-gray-600">You need <span className="font-bold text-red-600">{Math.ceil(requiredMarks!)}</span> marks, but the remaining exams are only worth <span className="font-bold">{remainingMaxMarks}</span> marks. The highest percentage you can achieve is {(((parseFloat(marksObtained) + parseFloat(remainingMaxMarks)) / (parseFloat(totalMaxMarks) + parseFloat(remainingMaxMarks))) * 100).toFixed(1)}%.</p>
                  </div>
                )}

                {status === 'achievable' && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Required Marks</h3>
                    <div className="text-5xl font-bold text-[#414FA8] mb-4">
                      {Math.ceil(requiredMarks!)}
                    </div>
                    <p className="text-gray-600">
                      You need to score at least <span className="font-bold text-gray-900">{Math.ceil(requiredMarks!)}</span> out of <span className="font-bold text-gray-900">{remainingMaxMarks}</span> in your remaining exams to hit your target of {targetPercentage}%.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Exact decimal marks needed: {requiredMarks!.toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <p className="text-gray-400 italic">Enter your current marks and your goal to see what you need to score.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">How to use this calculator</h2>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
          If you have completed some of your exams and are wondering how much you need to score in the remaining ones to get a specific final grade, this tool is for you. Enter the total marks for the exams you&apos;ve already taken, the marks you scored in them, the total marks for the upcoming exams, and your target overall percentage. The calculator will tell you the exact minimum marks required to hit that target.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Related Calculators</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/percentage-calculator" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">Percentage Calculator</Link>
          <Link href="/exam-percentage-calculator" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">Exam Percentage</Link>
        </div>
      </div>
    </CalculatorLayout>
  );
}
