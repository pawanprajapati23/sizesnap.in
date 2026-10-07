'use client';

// A thin wrapper around the Grade Calculator, since they share logic
// but often have distinct search intents. We'll reuse the exact UI from GradeCalculatorTool
// for simplicity and DRY.
import React from 'react';
import { GradeCalculatorTool } from './GradeCalculatorTool';

export function WeightedGradeCalculatorTool() {
  return (
    <div>
      <div className="mb-6 text-sm text-gray-600 bg-blue-50 p-4 rounded-lg border border-blue-100">
        <p><strong>Note:</strong> This tool calculates a weighted average. Enter the grade and weight (percentage) for each assignment, test, or category.</p>
      </div>
      <GradeCalculatorTool />
    </div>
  );
}
