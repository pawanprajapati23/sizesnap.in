"use client";

import React, { useState } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import Link from 'next/link';

export default function CgpaToPercentage() {
  const [cgpa, setCgpa] = useState<string>('');
  const [multiplier, setMultiplier] = useState<string>('9.5');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    setResult(null);
    const numCgpa = parseFloat(cgpa);
    const numMultiplier = parseFloat(multiplier);

    if (isNaN(numCgpa) || isNaN(numMultiplier)) {
      setError('Please enter valid numbers.');
      return;
    }
    if (numCgpa < 0 || numCgpa > 10) {
      setError('CGPA usually ranges between 0 and 10.');
      return;
    }
    if (numMultiplier <= 0) {
      setError('Multiplier must be greater than zero.');
      return;
    }

    setResult(numCgpa * numMultiplier);
  };

  return (
    <CalculatorLayout
      title="CGPA to Percentage Calculator"
      description="Convert your CGPA to percentage using standard university multipliers."
    >
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your CGPA</label>
              <input
                type="number"
                step="0.01"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                placeholder="e.g. 8.4"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Conversion Multiplier</label>
              <input
                type="number"
                step="0.1"
                value={multiplier}
                onChange={(e) => setMultiplier(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                placeholder="e.g. 9.5"
              />
              <p className="text-xs text-gray-500 mt-1">Default is 9.5 (used by CBSE and many Indian universities). Adjust according to your institution&apos;s formula.</p>
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button
              onClick={calculate}
              className="w-full bg-[#414FA8] hover:bg-[#343f88] text-white font-medium py-2.5 px-4 rounded-md transition-colors"
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
                  Formula used: {parseFloat(cgpa)} × {parseFloat(multiplier)}
                </p>
              </div>
            ) : (
              <p className="text-gray-400 italic">Enter your CGPA and click convert to see your percentage.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 space-y-6">
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">How to use this calculator</h2>
          <p className="text-gray-700">Enter your CGPA (Cumulative Grade Point Average) and the conversion multiplier specified by your university. While 9.5 is a common multiplier in India, conversion formulas vary significantly between universities. Always verify the official rules of your institution before submitting official documents.</p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Formula</h2>
          <div className="bg-gray-50 p-4 rounded-md font-mono text-sm border border-gray-100 mb-2 text-center text-[#414FA8] font-medium">
            Percentage = CGPA × Conversion Multiplier
          </div>
          <h3 className="font-semibold text-gray-900 mt-4 mb-2">Worked Example (using 9.5 multiplier):</h3>
          <p className="text-gray-700">If your CGPA is 8.2:</p>
          <ul className="list-disc pl-5 text-gray-700 mt-2 space-y-1">
            <li>Percentage = 8.2 × 9.5</li>
            <li>Percentage = <strong>77.9%</strong></li>
          </ul>
        </section>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Related Calculators</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/sgpa-to-percentage" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">SGPA to Percentage</Link>
          <Link href="/cgpa-calculator" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">Calculate CGPA</Link>
        </div>
      </div>
    </CalculatorLayout>
  );
}
