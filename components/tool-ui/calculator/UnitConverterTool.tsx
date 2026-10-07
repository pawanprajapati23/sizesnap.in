'use client';

import React, { useState, useEffect } from 'react';
import { CalculatorInput } from './CalculatorInput';

// Conversion architectures mapping bases
const UNITS = {
  Length: {
    base: 'm',
    rates: { mm: 0.001, cm: 0.01, m: 1, km: 1000, inch: 0.0254, foot: 0.3048, yard: 0.9144, mile: 1609.344 }
  },
  Weight: {
    base: 'g',
    rates: { mg: 0.001, g: 1, kg: 1000, ounce: 28.34952, pound: 453.59237, stone: 6350.29318 }
  },
  Area: {
    base: 'sqm',
    rates: { 'square meter': 1, 'square kilometer': 1000000, 'square foot': 0.092903, acre: 4046.85642, hectare: 10000 }
  },
  Volume: {
    base: 'l',
    rates: { ml: 0.001, liter: 1, gallon: 3.78541, cup: 0.236588 }
  },
  Digital: {
    base: 'byte',
    // Using decimal storage units as explicitly requested (1 KB = 1000 bytes)
    rates: { bit: 0.125, byte: 1, KB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12 }
  },
  Time: {
    base: 'sec',
    rates: { second: 1, minute: 60, hour: 3600, day: 86400, week: 604800 }
  }
};

const TEMP_UNITS = ['Celsius', 'Fahrenheit', 'Kelvin'];

export function UnitConverterTool() {
  const [category, setCategory] = useState<string>('Length');

  const [val1, setVal1] = useState<number | ''>('');
  const [unit1, setUnit1] = useState<string>('m');

  const [val2, setVal2] = useState<number | ''>('');
  const [unit2, setUnit2] = useState<string>('cm');

  // Change category resets units safely
  useEffect(() => {
    if (category === 'Temperature') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnit1('Celsius');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnit2('Fahrenheit');
    } else {
      const keys = Object.keys((UNITS as any)[category].rates);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnit1(keys[0]);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUnit2(keys[1] || keys[0]);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVal1('');
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVal2('');
  }, [category]);

  const handleVal1Change = (v: number) => {
    setVal1(v);
    if (isNaN(v)) { // eslint-disable-next-line react-hooks/set-state-in-effect
    setVal2(''); return; }

    if (category === 'Temperature') {
      let c = 0;
      if (unit1 === 'Celsius') c = v;
      if (unit1 === 'Fahrenheit') c = (v - 32) * 5/9;
      if (unit1 === 'Kelvin') c = v - 273.15;

      let r = 0;
      if (unit2 === 'Celsius') r = c;
      if (unit2 === 'Fahrenheit') r = (c * 9/5) + 32;
      if (unit2 === 'Kelvin') r = c + 273.15;
      setVal2(Number(r.toFixed(6)));
    } else {
      const rates = (UNITS as any)[category].rates;
      const baseValue = v * rates[unit1];
      const res = baseValue / rates[unit2];
      setVal2(Number(res.toPrecision(10))); // avoid float artifacts
    }
  };

  const handleVal2Change = (v: number) => {
    setVal2(v);
    if (isNaN(v)) { // eslint-disable-next-line react-hooks/set-state-in-effect
    setVal1(''); return; }

    if (category === 'Temperature') {
      let c = 0;
      if (unit2 === 'Celsius') c = v;
      if (unit2 === 'Fahrenheit') c = (v - 32) * 5/9;
      if (unit2 === 'Kelvin') c = v - 273.15;

      let r = 0;
      if (unit1 === 'Celsius') r = c;
      if (unit1 === 'Fahrenheit') r = (c * 9/5) + 32;
      if (unit1 === 'Kelvin') r = c + 273.15;
      setVal1(Number(r.toFixed(6)));
    } else {
      const rates = (UNITS as any)[category].rates;
      const baseValue = v * rates[unit2];
      const res = baseValue / rates[unit1];
      setVal1(Number(res.toPrecision(10)));
    }
  };

  // Re-run conversion if units change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (val1 !== '') handleVal1Change(Number(val1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit1, unit2]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">

        <div className="flex flex-col gap-1.5 w-full sm:w-1/2 mx-auto mb-2">
           <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">Category</label>
           <select
             value={category}
             onChange={(e) => setCategory(e.target.value)}
             className="w-full bg-gray-50 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#414FA8]"
           >
             {Object.keys(UNITS).map(c => <option key={c} value={c}>{c}</option>)}
             <option value="Temperature">Temperature</option>
           </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center relative">
          <div className="flex flex-col gap-2">
            <CalculatorInput label="From" value={val1} onChange={handleVal1Change} />
            <select value={unit1} onChange={e => setUnit1(e.target.value)} className="w-full bg-indigo-50 border border-indigo-200 rounded px-3 py-2 text-sm text-[#414FA8] font-medium focus:outline-none">
              {category === 'Temperature' ? TEMP_UNITS.map(u => <option key={u} value={u}>{u}</option>) : Object.keys((UNITS as any)[category].rates).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>

          <div className="hidden sm:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-gray-400 font-bold text-xl">=</div>

          <div className="flex flex-col gap-2">
            <CalculatorInput label="To" value={val2} onChange={handleVal2Change} />
            <select value={unit2} onChange={e => setUnit2(e.target.value)} className="w-full bg-indigo-50 border border-indigo-200 rounded px-3 py-2 text-sm text-[#414FA8] font-medium focus:outline-none">
              {category === 'Temperature' ? TEMP_UNITS.map(u => <option key={u} value={u}>{u}</option>) : Object.keys((UNITS as any)[category].rates).map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>

      </div>
    </div>
  );
}
