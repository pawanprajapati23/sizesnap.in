"use client";

import React, { useState, useEffect } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import Link from 'next/link';

export default function AttendanceCalculator() {
  const [conducted, setConducted] = useState<string>('');
  const [attended, setAttended] = useState<string>('');
  const [target, setTarget] = useState<string>('75');
  
  const [currentPercentage, setCurrentPercentage] = useState<number | null>(null);
  const [requiredClasses, setRequiredClasses] = useState<number | null>(null);
  const [canMiss, setCanMiss] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    setCurrentPercentage(null);
    setRequiredClasses(null);
    setCanMiss(null);

    if (!conducted || !attended || !target) return;

    const totalConducted = parseInt(conducted, 10);
    const totalAttended = parseInt(attended, 10);
    const targetPercent = parseFloat(target);

    if (isNaN(totalConducted) || isNaN(totalAttended) || isNaN(targetPercent)) {
      return;
    }
    
    if (totalConducted <= 0) {
      setError('Total conducted classes must be greater than 0.');
      return;
    }
    
    if (totalAttended < 0 || totalAttended > totalConducted) {
      setError('Attended classes cannot be negative or greater than conducted classes.');
      return;
    }
    
    if (targetPercent <= 0 || targetPercent > 100) {
      setError('Target percentage must be between 0 and 100.');
      return;
    }

    const currentPerc = (totalAttended / totalConducted) * 100;
    setCurrentPercentage(currentPerc);

    if (targetPercent === 100) {
      if (currentPerc === 100) {
        setRequiredClasses(0);
      } else {
        // Impossible to reach 100% if even one class is missed
        setRequiredClasses(-1);
      }
      setCanMiss(0);
      return;
    }

    if (currentPerc < targetPercent) {
      // Needs to attend more classes
      // required = ceil((target * total - 100 * attended) / (100 - target))
      const req = Math.ceil((targetPercent * totalConducted - 100 * totalAttended) / (100 - targetPercent));
      setRequiredClasses(req > 0 ? req : 0);
      setCanMiss(0);
    } else {
      // Can miss classes
      // classes to miss = floor((100 * attended - target * total) / target)
      const miss = Math.floor((100 * totalAttended - targetPercent * totalConducted) / targetPercent);
      setRequiredClasses(0);
      setCanMiss(miss > 0 ? miss : 0);
    }
  };

  return (
    <CalculatorLayout
      title="Attendance Calculator"
      description="Find out exactly how many classes you need to attend or can safely miss to maintain your target attendance."
    >
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Classes Conducted</label>
              <input
                type="number"
                value={conducted}
                onChange={(e) => setConducted(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                placeholder="e.g. 50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Classes Attended</label>
              <input
                type="number"
                value={attended}
                onChange={(e) => setAttended(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                placeholder="e.g. 35"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Attendance (%)</label>
              <input
                type="number"
                step="0.1"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                placeholder="e.g. 75"
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button
              onClick={calculate}
              className="w-full bg-[#414FA8] hover:bg-[#343f88] text-white font-medium py-2.5 px-4 rounded-md transition-colors mt-2"
            >
              Calculate Attendance
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 flex flex-col justify-center min-h-[250px]">
            {currentPercentage !== null ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wide">Current Attendance</h3>
                  <div className={`text-5xl font-bold ${currentPercentage >= parseFloat(target) ? 'text-green-600' : 'text-red-500'}`}>
                    {currentPercentage.toFixed(2)}%
                  </div>
                </div>

                <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm text-center">
                  {requiredClasses === -1 ? (
                    <p className="text-red-600 font-medium">It is impossible to reach 100% attendance because you have already missed a class.</p>
                  ) : requiredClasses !== null && requiredClasses > 0 ? (
                    <p className="text-gray-800">
                      You need to attend <span className="font-bold text-[#414FA8] text-lg">{requiredClasses}</span> more consecutive classes to reach your target of {target}%.
                    </p>
                  ) : canMiss !== null && canMiss > 0 ? (
                    <p className="text-gray-800">
                      You can safely miss <span className="font-bold text-green-600 text-lg">{canMiss}</span> consecutive classes and still maintain {target}% attendance.
                    </p>
                  ) : (
                    <p className="text-gray-800">You are exactly at your target attendance! Don&apos;t miss the next class.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-400 italic">Enter your attendance details to see how many classes you need to attend.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">How it works</h2>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
          This calculator uses the standard formula to determine the required classes: <code className="bg-gray-100 px-1 py-0.5 rounded text-sm text-pink-600">Required = ceil((Target × Total - 100 × Attended) / (100 - Target))</code>. It automatically adjusts for cases where you have surplus attendance and tells you exactly how many upcoming classes you can skip without dropping below the threshold.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Related Calculators</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/study-hours-calculator" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">Study Hours Calculator</Link>
          <Link href="/required-marks-calculator" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">Required Marks Calculator</Link>
        </div>
      </div>
    </CalculatorLayout>
  );
}
