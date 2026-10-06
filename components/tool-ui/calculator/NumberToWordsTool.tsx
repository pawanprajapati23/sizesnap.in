'use client';

import React, { useState } from 'react';
import { CalculatorInput } from './CalculatorInput';

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

function convertLessThanThousand(num: number): string {
  if (num === 0) return '';
  let str = '';
  if (num >= 100) {
    str += ONES[Math.floor(num / 100)] + ' Hundred ';
    num %= 100;
  }
  if (num >= 20) {
    str += TENS[Math.floor(num / 10)] + ' ';
    num %= 10;
  }
  if (num > 0) {
    str += ONES[num] + ' ';
  }
  return str.trim();
}

function convertIndian(numStr: string): string {
  let num = parseInt(numStr, 10);
  if (num === 0) return 'Zero';
  if (num < 0) return 'Negative ' + convertIndian(Math.abs(num).toString());

  let words = '';

  if (num >= 10000000) {
    words += convertLessThanThousand(Math.floor(num / 10000000)) + ' Crore ';
    num %= 10000000;
  }
  if (num >= 100000) {
    words += convertLessThanThousand(Math.floor(num / 100000)) + ' Lakh ';
    num %= 100000;
  }
  if (num >= 1000) {
    words += convertLessThanThousand(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }
  if (num > 0) {
    words += convertLessThanThousand(num);
  }
  return words.trim();
}

function convertInternational(numStr: string): string {
  let num = parseInt(numStr, 10);
  if (num === 0) return 'Zero';
  if (num < 0) return 'Negative ' + convertInternational(Math.abs(num).toString());

  let words = '';

  if (num >= 1000000000) {
    words += convertLessThanThousand(Math.floor(num / 1000000000)) + ' Billion ';
    num %= 1000000000;
  }
  if (num >= 1000000) {
    words += convertLessThanThousand(Math.floor(num / 1000000)) + ' Million ';
    num %= 1000000;
  }
  if (num >= 1000) {
    words += convertLessThanThousand(Math.floor(num / 1000)) + ' Thousand ';
    num %= 1000;
  }
  if (num > 0) {
    words += convertLessThanThousand(num);
  }
  return words.trim();
}

export function NumberToWordsTool() {
  const [numStr, setNumStr] = useState('');
  const [system, setSystem] = useState<'indian' | 'international'>('indian');

  let output = '';
  let error = '';

  if (numStr) {
    // Only allow digits and one minus sign at start
    if (!/^-?\d+$/.test(numStr)) {
       error = 'Please enter a valid whole integer.';
    } else if (numStr.length > 15) {
       error = 'Number is too large. Maximum 15 digits supported.';
    } else {
       if (system === 'indian') output = convertIndian(numStr);
       if (system === 'international') output = convertInternational(numStr);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-4">

        <div className="flex flex-col gap-1.5">
           <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Number</label>
           <input
             type="text"
             value={numStr}
             onChange={e => setNumStr(e.target.value)}
             className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-base focus:outline-none focus:border-[#414FA8] focus:ring-1 focus:ring-[#414FA8] font-mono"
             placeholder="e.g. 150000"
           />
        </div>

        <div className="flex gap-4 border-b border-gray-100 pb-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="radio" checked={system === 'indian'} onChange={() => setSystem('indian')} className="w-4 h-4 text-[#414FA8]" />
            Indian (Lakhs/Crores)
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="radio" checked={system === 'international'} onChange={() => setSystem('international')} className="w-4 h-4 text-[#414FA8]" />
            International (Millions)
          </label>
        </div>

        {error ? (
           <p className="text-red-500 text-sm font-medium">{error}</p>
        ) : (
           <div className="bg-indigo-50 border border-[#414FA8] text-[#414FA8] p-4 rounded text-lg font-bold min-h-[80px] break-words">
              {output || 'Output will appear here...'}
           </div>
        )}
      </div>
    </div>
  );
}
