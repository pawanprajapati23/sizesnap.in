'use client';

import React from 'react';

interface CalculatorInputProps {
  label: string;
  value: number | string;
  onChange: (val: number) => void;
  type?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  step?: string;
  symbol?: string;
}

export function CalculatorInput({ label, value, onChange, type = 'number', placeholder = '0', min, max, step, symbol }: CalculatorInputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">{label}</label>
      <div className="relative flex items-center">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className={`w-full bg-white border border-gray-300 rounded px-3 py-2 text-base sm:text-sm focus:outline-none focus:border-[#414FA8] focus:ring-1 focus:ring-[#414FA8] ${symbol ? 'pr-8' : ''}`}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
        />
        {symbol && <span className="absolute right-3 text-gray-400 text-sm font-medium">{symbol}</span>}
      </div>
    </div>
  );
}
