"use client";

import React, { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import Link from 'next/link';

export default function SgpaToPercentage() {
  const [sgpa, setSgpa] = useState<string>('');
  const [multiplier, setMultiplier] = useState<string>('10');
  const [subtractFactor, setSubtractFactor] = useState<string>('7.5');
  const [formulaType, setFormulaType] = useState<'multiply' | 'multiply_subtract'>('multiply_subtract');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    setResult(null);
    const numSgpa = parseFloat(sgpa);
    const numMultiplier = parseFloat(multiplier);
    const numSubtract = parseFloat(subtractFactor);

    if (isNaN(numSgpa) || isNaN(numMultiplier) || (formulaType === 'multiply_subtract' && isNaN(numSubtract))) {
      setError('Please enter valid numbers.');
      return;
    }
    if (numSgpa < 0 || numSgpa > 10) {
      setError('SGPA typically ranges from 0 to 10.');
      return;
    }

    if (formulaType === 'multiply_subtract') {
      let res = (numSgpa * numMultiplier) - numSubtract;
      setResult(res > 0 ? res : 0);
    } else {
      setResult(numSgpa * numMultiplier);
    }
  };

  return (
    <CalculatorLayout
      title="SGPA to Percentage Calculator"
      description="Easily convert your semester SGPA to an overall percentage score according to your university's formula."
    >
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your SGPA</label>
              <input
                type="number"
                step="0.01"
                value={sgpa}
                onChange={(e) => setSgpa(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                placeholder="e.g. 7.8"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Formula Type</label>
              <select
                value={formulaType}
                onChange={(e) => setFormulaType(e.target.value as 'multiply' | 'multiply_subtract')}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
              >
                <option value="multiply_subtract">(SGPA × M) - S (Common in VTU, SPPU)</option>
                <option value="multiply">SGPA × M (Common multiplier)</option>
              </select>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Multiplier (M)</label>
                <input
                  type="number"
                  step="0.1"
                  value={multiplier}
                  onChange={(e) => setMultiplier(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                />
              </div>
              {formulaType === 'multiply_subtract' && (
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtract (S)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={subtractFactor}
                    onChange={(e) => setSubtractFactor(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                  />
                </div>
              )}
            </div>
            
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button
              onClick={calculate}
              className="w-full bg-[#414FA8] hover:bg-[#343f88] text-white font-medium py-2.5 px-4 rounded-md transition-colors mt-2"
            >
              Convert to Percentage
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 flex flex-col justify-center">
            <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Equivalent Percentage</h3>
            {result !== null ? (
              <div>
                <div className="text-4xl font-bold text-[#414FA8] mb-2">
                  {result.toFixed(2)}%
                </div>
                <p className="text-gray-600 text-sm">
                  Formula used: {formulaType === 'multiply_subtract' 
                    ? `(${parseFloat(sgpa)} × ${parseFloat(multiplier)}) - ${parseFloat(subtractFactor)}`
                    : `${parseFloat(sgpa)} × ${parseFloat(multiplier)}`
                  }
                </p>
              </div>
            ) : (
              <p className="text-gray-400 italic">Enter your SGPA and formula details to see your percentage.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Understanding SGPA Conversion</h2>
          <p className="text-gray-700">SGPA (Semester Grade Point Average) is commonly used to grade individual semesters. There is no universal formula to convert SGPA to a percentage. Universities like VTU or SPPU often use the formula <code>(SGPA × 10) - 7.5</code>. Other universities might simply multiply by a constant like 9.5 or 10. Always consult your university&apos;s official grading system guidelines.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Formulas</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100 text-[#414FA8] font-medium font-mono text-sm text-center">
              Formula 1: Percentage = (SGPA × 10) - 7.5
            </div>
            <div className="bg-gray-50 p-4 rounded-md border border-gray-100 text-[#414FA8] font-medium font-mono text-sm text-center">
              Formula 2: Percentage = SGPA × 9.5
            </div>
          </div>
        </section>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Related Calculators</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/cgpa-to-percentage" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">CGPA to Percentage</Link>
          <Link href="/cgpa-calculator" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">CGPA Calculator</Link>
        </div>
      </div>
    </CalculatorLayout>
  );
}
