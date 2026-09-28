"use client";

import React, { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import Link from 'next/link';

export default function PercentageCalculator() {
  const [obtained, setObtained] = useState<string>('');
  const [total, setTotal] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    setResult(null);
    const numObtained = parseFloat(obtained);
    const numTotal = parseFloat(total);

    if (isNaN(numObtained) || isNaN(numTotal)) {
      setError('Please enter valid numbers.');
      return;
    }
    if (numTotal <= 0) {
      setError('Total marks must be greater than zero.');
      return;
    }
    if (numObtained < 0) {
      setError('Obtained marks cannot be negative.');
      return;
    }
    if (numObtained > numTotal) {
      setError('Obtained marks cannot be greater than total marks.');
      return;
    }

    setResult((numObtained / numTotal) * 100);
  };

  return (
    <CalculatorLayout
      title="Percentage Calculator"
      description="Calculate basic percentages quickly and easily for your exams or assignments."
    >
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Obtained Marks</label>
              <input
                type="number"
                value={obtained}
                onChange={(e) => setObtained(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                placeholder="e.g. 450"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Maximum Marks</label>
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                placeholder="e.g. 500"
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button
              onClick={calculate}
              className="w-full bg-[#414FA8] hover:bg-[#343f88] text-white font-medium py-2.5 px-4 rounded-md transition-colors"
            >
              Calculate Percentage
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Result</h3>
            {result !== null ? (
              <div>
                <div className="text-4xl font-bold text-[#414FA8] mb-2">
                  {result.toFixed(2)}%
                </div>
                <p className="text-gray-600">
                  You scored <span className="font-semibold text-gray-900">{parseFloat(obtained)}</span> out of <span className="font-semibold text-gray-900">{parseFloat(total)}</span> marks.
                </p>
              </div>
            ) : (
              <p className="text-gray-400 italic">Enter your marks and click calculate to see your percentage.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">How to use this calculator</h2>
          <p className="text-gray-700">Enter the marks you obtained in your exam or assignment, and the total possible maximum marks. Click calculate to find your exact percentage instantly.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Formula</h2>
          <div className="bg-gray-50 p-4 rounded-md font-mono text-sm border border-gray-100 mb-2 text-center text-[#414FA8] font-medium">
            Percentage = (Obtained Marks / Total Marks) × 100
          </div>
          <h3 className="font-semibold text-gray-900 mt-4 mb-2">Worked Example:</h3>
          <p className="text-gray-700">If you scored 420 out of 500 marks:</p>
          <ul className="list-disc pl-5 text-gray-700 mt-2 space-y-1">
            <li>Percentage = (420 / 500) × 100</li>
            <li>Percentage = 0.84 × 100</li>
            <li>Percentage = <strong>84%</strong></li>
          </ul>
        </section>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Related Calculators</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/cgpa-to-percentage" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">CGPA to Percentage</Link>
          <Link href="/marks-percentage-calculator" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">Subject-wise Marks Calculator</Link>
        </div>
      </div>
    </CalculatorLayout>
  );
}
