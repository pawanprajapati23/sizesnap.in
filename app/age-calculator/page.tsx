"use client";

import React, { useState, useEffect } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import Link from 'next/link';

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalDays: number;
}

export default function AgeCalculator() {
  const [dob, setDob] = useState<string>('');
  const [targetDate, setTargetDate] = useState<string>(() => {
    // Only access Date on client-side or ignore if hydrating, but Next.js usually hydrates Date fine if we use it consistently or we could just leave it empty and let user select. Let's initialize to today.
    try { return new Date().toISOString().split('T')[0]; } catch(e) { return ''; }
  });
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    setResult(null);

    if (!dob || !targetDate) return;

    const d1 = new Date(dob);
    const d2 = new Date(targetDate);

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      setError('Please enter valid dates.');
      return;
    }

    if (d1 > d2) {
      setError('Date of birth cannot be after the target date.');
      return;
    }

    let years = d2.getFullYear() - d1.getFullYear();
    let months = d2.getMonth() - d1.getMonth();
    let days = d2.getDate() - d1.getDate();

    if (days < 0) {
      months--;
      // Get number of days in the previous month of the target date
      const prevMonth = new Date(d2.getFullYear(), d2.getMonth(), 0);
      days += prevMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate totals
    let totalMonths = years * 12 + months;
    
    // Calculate exact total days without approximation
    const timeDiff = d2.getTime() - d1.getTime();
    const totalDays = Math.floor(timeDiff / (1000 * 3600 * 24));

    setResult({ years, months, days, totalMonths, totalDays });
  };

  return (
    <CalculatorLayout
      title="Age Calculator"
      description="Calculate your exact age in years, months, and days for exam forms, applications, and general use."
    >
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                value={dob}
                max={targetDate}
                onChange={(e) => setDob(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age at Date of</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button
              onClick={calculate}
              className="w-full bg-[#414FA8] hover:bg-[#343f88] text-white font-medium py-2.5 px-4 rounded-md transition-colors mt-2"
            >
              Calculate Age
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 flex flex-col justify-center min-h-[250px]">
            {result ? (
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Exact Age</h3>
                  <div className="text-3xl font-bold text-[#414FA8]">
                    {result.years} <span className="text-xl text-gray-600 font-medium">years</span>,{' '}
                    {result.months} <span className="text-xl text-gray-600 font-medium">months</span>,{' '}
                    {result.days} <span className="text-xl text-gray-600 font-medium">days</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-center border-t border-gray-200 pt-4">
                  <div className="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Total Months</p>
                    <p className="text-xl font-bold text-gray-800">{result.totalMonths}</p>
                  </div>
                  <div className="bg-white p-3 rounded shadow-sm border border-gray-100">
                    <p className="text-xs text-gray-500 uppercase tracking-wide">Total Days</p>
                    <p className="text-xl font-bold text-gray-800">{result.totalDays}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-400 italic">Select your date of birth to calculate your exact age.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Why accurate age calculation matters</h2>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
          Many government exams, college applications, and scholarship forms require your exact age on a specific cutoff date. This calculator accounts for leap years and varying month lengths, unlike simple calculators that divide by 365. This ensures your application is never rejected due to a 1-day miscalculation.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Related Calculators</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/percentage-calculator" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">Percentage Calculator</Link>
          <Link href="/attendance-calculator" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">Attendance Calculator</Link>
        </div>
      </div>
    </CalculatorLayout>
  );
}
