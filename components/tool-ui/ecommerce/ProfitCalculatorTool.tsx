'use client';

import React, { useState } from 'react';
import { CalculatorInput } from '../calculator/CalculatorInput';
import { CalculatorResult } from '../calculator/CalculatorResult';

export function ProfitCalculatorTool() {
  const [sellingPrice, setSellingPrice] = useState('1000');
  const [productCost, setProductCost] = useState('400');
  const [shippingCost, setShippingCost] = useState('80');
  const [packagingCost, setPackagingCost] = useState('20');

  // Marketplaces usually charge a % commission + fixed closing/payment fees
  const [commissionPct, setCommissionPct] = useState('10');
  const [fixedFee, setFixedFee] = useState('20');

  // E.g. GST/Tax on the final product (some sellers need to back this out)
  const [taxPct, setTaxPct] = useState('18');

  const [result, setResult] = useState<{
    totalFees: number;
    taxes: number;
    totalCost: number;
    profit: number;
    margin: number;
    roi: number;
  } | null>(null);

  const calculate = () => {
    const sp = parseFloat(sellingPrice) || 0;
    const cost = parseFloat(productCost) || 0;
    const ship = parseFloat(shippingCost) || 0;
    const pack = parseFloat(packagingCost) || 0;
    const commPct = parseFloat(commissionPct) || 0;
    const fixed = parseFloat(fixedFee) || 0;
    const taxP = parseFloat(taxPct) || 0;

    // Commission is usually charged on the selling price
    const commissionVal = sp * (commPct / 100);
    const totalFees = commissionVal + fixed;

    // Depending on the country, tax might be inclusive or exclusive. We'll assume exclusive addition
    // or standard backward deduction. Let's assume SP is inclusive of GST.
    // Tax collected = SP - (SP / (1 + TaxPct/100))
    const taxAmount = sp - (sp / (1 + (taxP / 100)));

    const totalCostToSeller = cost + ship + pack + totalFees + taxAmount;

    const profit = sp - totalCostToSeller;
    const margin = sp > 0 ? (profit / sp) * 100 : 0;
    const roi = cost > 0 ? (profit / cost) * 100 : 0;

    setResult({
      totalFees,
      taxes: taxAmount,
      totalCost: totalCostToSeller,
      profit,
      margin,
      roi
    });
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">

      <div className="md:col-span-7 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6">
        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2">Sales & Cost Details</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <CalculatorInput label="Selling Price (Inclusive of Tax)" value={sellingPrice} onChange={setSellingPrice} placeholder="1000" />
           <CalculatorInput label="Product Sourcing Cost" value={productCost} onChange={setProductCost} placeholder="400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <CalculatorInput label="Shipping / Courier Cost" value={shippingCost} onChange={setShippingCost} placeholder="80" />
           <CalculatorInput label="Packaging Cost" value={packagingCost} onChange={setPackagingCost} placeholder="20" />
        </div>

        <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2 mt-2">Marketplace Fees & Taxes</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <CalculatorInput label="Commission (%)" value={commissionPct} onChange={setCommissionPct} placeholder="10" />
           <CalculatorInput label="Fixed/Payment Fee" value={fixedFee} onChange={setFixedFee} placeholder="20" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
           <CalculatorInput label="Product GST/Tax (%)" value={taxPct} onChange={setTaxPct} placeholder="18" />
        </div>

        <button
          onClick={calculate}
          className="w-full mt-4 py-3 bg-[#414FA8] text-white font-bold rounded-lg hover:bg-[#343f88] transition-colors"
        >
          Calculate Profit
        </button>
      </div>

      <div className="md:col-span-5">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm sticky top-6">
           <h3 className="font-bold text-gray-800 mb-6">Profit Breakdown</h3>

           {result ? (
             <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Fees:</span>
                  <span className="font-semibold text-gray-700">{result.totalFees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax Component:</span>
                  <span className="font-semibold text-gray-700">{result.taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm pb-4 border-b border-gray-200">
                  <span className="text-gray-500">Total Landed Cost:</span>
                  <span className="font-semibold text-gray-700">{result.totalCost.toFixed(2)}</span>
                </div>

                <div className={`p-4 rounded-lg flex flex-col gap-1 ${result.profit >= 0 ? 'bg-emerald-100 border border-emerald-200' : 'bg-red-100 border border-red-200'}`}>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70">Net Profit</span>
                  <span className={`text-3xl font-bold ${result.profit >= 0 ? 'text-emerald-800' : 'text-red-800'}`}>
                     {result.profit.toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-4">
                   <div className="bg-white p-3 rounded border border-gray-200">
                     <span className="block text-xs text-gray-500 mb-1">Margin</span>
                     <span className="font-bold text-gray-800">{result.margin.toFixed(1)}%</span>
                   </div>
                   <div className="bg-white p-3 rounded border border-gray-200">
                     <span className="block text-xs text-gray-500 mb-1">ROI</span>
                     <span className="font-bold text-gray-800">{result.roi.toFixed(1)}%</span>
                   </div>
                </div>
             </div>
           ) : (
             <div className="text-sm text-gray-400 text-center py-8">
               Enter your pricing and fees, then click calculate to see your profit breakdown.
             </div>
           )}
        </div>
      </div>

    </div>
  );
}
