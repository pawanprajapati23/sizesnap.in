'use client';

import React from 'react';

interface CalculatorResultProps {
  label: string;
  value: string | number;
  subValue?: string;
  highlight?: boolean;
}

export function CalculatorResult({ label, value, subValue, highlight = false }: CalculatorResultProps) {
  return (
    <div className={`p-4 rounded border flex flex-col items-center justify-center shadow-sm ${highlight ? 'bg-indigo-50 border-[#414FA8]' : 'bg-gray-50 border-gray-200'}`}>
      <span className={`text-2xl sm:text-3xl font-bold ${highlight ? 'text-[#414FA8]' : 'text-gray-900'} break-all text-center`}>{value}</span>
      <span className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mt-1 text-center font-semibold">{label}</span>
      {subValue && <span className="text-xs text-gray-400 mt-1 text-center">{subValue}</span>}
    </div>
  );
}
