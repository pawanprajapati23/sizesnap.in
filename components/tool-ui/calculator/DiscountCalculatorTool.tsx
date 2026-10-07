'use client';

import React, { useState } from 'react';
import { CalculatorInput } from './CalculatorInput';
import { CalculatorResult } from './CalculatorResult';
import { Disclaimer } from './Disclaimer';

export function DiscountCalculatorTool() {
  const [price, setPrice] = useState<number | ''>('');
  const [discount, setDiscount] = useState<number | ''>('');

  let saved = 0;
  let final = 0;

  if (price !== '' && discount !== '') {
    const p = Number(price);
    const d = Number(discount);
    saved = p * (d / 100);
    final = p - saved;
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-white p-6 rounded border border-gray-200 shadow-sm flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CalculatorInput label="Original Price" value={price} onChange={setPrice} />
          <CalculatorInput label="Discount (%)" value={discount} onChange={setDiscount} symbol="%" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
          <CalculatorResult label="You Save" value={saved.toLocaleString('en-US', { maximumFractionDigits: 2 })} />
          <CalculatorResult label="Final Price" value={final.toLocaleString('en-US', { maximumFractionDigits: 2 })} highlight />
        </div>
      </div>
      <Disclaimer>This tool estimates discounts strictly based on entered numbers. Additional taxes, shipping, or vendor-specific limitations are not factored into this calculation.</Disclaimer>
    </div>
  );
}
