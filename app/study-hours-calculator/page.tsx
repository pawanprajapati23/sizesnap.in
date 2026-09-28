"use client";

import React, { useState, useEffect } from 'react';
import CalculatorLayout from '@/components/CalculatorLayout';
import Link from 'next/link';

export default function StudyHoursCalculator() {
  const [totalTopics, setTotalTopics] = useState<string>('');
  const [completedTopics, setCompletedTopics] = useState<string>('');
  const [hoursPerTopic, setHoursPerTopic] = useState<string>('');
  const [daysRemaining, setDaysRemaining] = useState<string>('');
  const [dailyAvailableHours, setDailyAvailableHours] = useState<string>('');

  const [result, setResult] = useState<{
    remainingTopics: number;
    totalHoursNeeded: number;
    hoursNeededPerDay: number;
    isPossible: boolean;
    daysNeeded: number;
  } | null>(null);

  const [error, setError] = useState<string>('');

  const calculate = () => {
    setError('');
    setResult(null);

    if (!totalTopics || !completedTopics || !hoursPerTopic || !daysRemaining || !dailyAvailableHours) {
      return;
    }

    const tTotal = parseInt(totalTopics, 10);
    const tCompleted = parseInt(completedTopics, 10);
    const hPerTopic = parseFloat(hoursPerTopic);
    const dRemaining = parseInt(daysRemaining, 10);
    const dAvailableHours = parseFloat(dailyAvailableHours);

    if (isNaN(tTotal) || isNaN(tCompleted) || isNaN(hPerTopic) || isNaN(dRemaining) || isNaN(dAvailableHours)) {
      return;
    }
    if (tTotal <= 0 || hPerTopic <= 0 || dRemaining <= 0 || dAvailableHours <= 0) {
      setError('Values must be greater than zero.');
      return;
    }
    if (tCompleted < 0 || tCompleted > tTotal) {
      setError('Completed topics cannot be negative or greater than total topics.');
      return;
    }
    if (dAvailableHours > 24) {
      setError('Daily available hours cannot exceed 24.');
      return;
    }

    const remainingTopics = tTotal - tCompleted;
    const totalHoursNeeded = remainingTopics * hPerTopic;
    const hoursNeededPerDay = totalHoursNeeded / dRemaining;
    const isPossible = hoursNeededPerDay <= dAvailableHours;
    const daysNeeded = totalHoursNeeded / dAvailableHours;

    setResult({
      remainingTopics,
      totalHoursNeeded,
      hoursNeededPerDay,
      isPossible,
      daysNeeded
    });
  };

  return (
    <CalculatorLayout
      title="Study Hours Calculator"
      description="Plan your study schedule and find out how many hours you need to study each day to finish your syllabus before the exam."
    >
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Topics / Chapters</label>
              <input
                type="number"
                value={totalTopics}
                onChange={(e) => setTotalTopics(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                placeholder="e.g. 20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Topics Completed So Far</label>
              <input
                type="number"
                value={completedTopics}
                onChange={(e) => setCompletedTopics(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                placeholder="e.g. 5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Hours per Topic</label>
              <input
                type="number"
                step="0.5"
                value={hoursPerTopic}
                onChange={(e) => setHoursPerTopic(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                placeholder="e.g. 2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Days Remaining Until Exam</label>
              <input
                type="number"
                value={daysRemaining}
                onChange={(e) => setDaysRemaining(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                placeholder="e.g. 14"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Available Study Hours per Day</label>
              <input
                type="number"
                step="0.5"
                max="24"
                value={dailyAvailableHours}
                onChange={(e) => setDailyAvailableHours(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-[#414FA8] focus:border-[#414FA8] transition-colors"
                placeholder="e.g. 4"
              />
            </div>
            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
            <button
              onClick={calculate}
              className="w-full bg-[#414FA8] hover:bg-[#343f88] text-white font-medium py-2.5 px-4 rounded-md transition-colors mt-2"
            >
              Calculate Study Hours
            </button>
          </div>

          <div className="bg-gray-50 rounded-lg p-6 border border-gray-100 flex flex-col justify-center min-h-[350px]">
            {result ? (
              <div className="space-y-6">
                
                {result.remainingTopics === 0 ? (
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">You&apos;re All Set!</h3>
                    <p className="text-gray-600">You have completed all your topics. Use the remaining {daysRemaining} days for revision!</p>
                  </div>
                ) : (
                  <>
                    <div className="text-center">
                      <h3 className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">Daily Target</h3>
                      <div className={`text-4xl font-bold ${result.isPossible ? 'text-[#414FA8]' : 'text-red-600'}`}>
                        {result.hoursNeededPerDay.toFixed(1)} <span className="text-xl text-gray-600 font-medium">hrs/day</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">To finish {result.remainingTopics} topics in {daysRemaining} days</p>
                    </div>

                    <div className="bg-white p-4 rounded-md border border-gray-200 shadow-sm text-center">
                      {result.isPossible ? (
                        <p className="text-green-700 font-medium flex items-center justify-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          Your plan is achievable!
                        </p>
                      ) : (
                        <p className="text-red-600 font-medium flex items-center justify-center gap-2 text-left">
                          <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                          Not enough time. You need {result.hoursNeededPerDay.toFixed(1)} hrs/day, but only have {dailyAvailableHours}.
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center border-t border-gray-200 pt-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Total Study Hours Needed</p>
                        <p className="text-lg font-bold text-gray-900">{result.totalHoursNeeded.toFixed(1)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Days Needed (at {dailyAvailableHours} hrs/day)</p>
                        <p className="text-lg font-bold text-gray-900">{Math.ceil(result.daysNeeded)}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-400 italic">Enter your study schedule details to see your daily target.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 mt-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Disclaimer</h2>
        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
          This study hours calculator is a planning tool designed to help you organize your time effectively. It assumes consistent study speed and does not guarantee examination success or results. Make sure to account for breaks, revision time, and unexpected delays in your schedule.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 sm:p-8 mt-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Related Calculators</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/attendance-calculator" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">Attendance Calculator</Link>
          <Link href="/required-marks-calculator" className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md text-sm font-medium text-gray-700 transition-colors">Required Marks Calculator</Link>
        </div>
      </div>
    </CalculatorLayout>
  );
}
