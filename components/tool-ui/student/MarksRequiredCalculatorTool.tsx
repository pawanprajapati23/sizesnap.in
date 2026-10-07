'use client';

import React, { useState } from 'react';
import { CalculatorInput } from '../calculator/CalculatorInput';
import { CalculatorResult } from '../calculator/CalculatorResult';

export function MarksRequiredCalculatorTool() {
  const [currentGrade, setCurrentGrade] = useState('');
  const [targetGrade, setTargetGrade] = useState('');
  const [finalWeight, setFinalWeight] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const calculate = () => {
    setError('');
    setResult(null);

    const current = parseFloat(currentGrade);
    const target = parseFloat(targetGrade);
    const weight = parseFloat(finalWeight);

    if (isNaN(current) || isNaN(target) || isNaN(weight)) {
      setError('Please enter valid numbers in all fields.');
      return;
    }

    if (weight <= 0 || weight >= 100) {
      setError('Final exam weight must be greater than 0% and less than 100%.');
      return;
    }

    // Formula: (Target - Current * (1 - Weight)) / Weight
    const weightDec = weight / 100;
    const required = (target - current * (1 - weightDec)) / weightDec;

    setResult(required);
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="space-y-4">
          <CalculatorInput
            label="Current Grade (%)"
            value={currentGrade}
            onChange={setCurrentGrade}
            placeholder="e.g. 85"
          />
          <CalculatorInput
            label="Target Grade (%)"
            value={targetGrade}
            onChange={setTargetGrade}
            placeholder="e.g. 90"
          />
          <CalculatorInput
            label="Weight of Final Exam (%)"
            value={finalWeight}
            onChange={setFinalWeight}
            placeholder="e.g. 30"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full py-3 bg-[#414FA8] text-white font-bold rounded-lg hover:bg-[#343f88] transition-colors"
        >
          Calculate Required Marks
        </button>

        {error && <div className="text-red-500 text-sm font-medium">{error}</div>}

        {result !== null && (
          <div className="pt-4 border-t border-gray-100">
            <CalculatorResult
              label="Marks Required on Final Exam"
              value={`${result.toFixed(2)}%`}
              subtext={result > 100 ? "Note: This is over 100%, meaning it might be impossible unless there is extra credit." : result <= 0 ? "You've already secured your target grade!" : "You can do it! Focus on your study plan."}
            />
          </div>
        )}
      </div>
    </div>
  );
}
