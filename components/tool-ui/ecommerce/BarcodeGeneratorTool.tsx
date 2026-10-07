'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Download } from 'lucide-react';
import JsBarcode from 'jsbarcode';

export function BarcodeGeneratorTool() {
  const [value, setValue] = useState('123456789012');
  const [format, setFormat] = useState('CODE128');
  const [width, setWidth] = useState(2);
  const [height, setHeight] = useState(100);
  const [displayValue, setDisplayValue] = useState(true);

  const svgRef = useRef<SVGSVGElement>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!svgRef.current) return;
    try {
      setError('');
      JsBarcode(svgRef.current, value || '0', {
        format: format,
        width: width,
        height: height,
        displayValue: displayValue,
        background: '#ffffff',
        lineColor: '#000000',
        margin: 10
      });
    } catch (e: unknown) {
      setError((e as Error).message || 'Invalid value for this barcode format');
    }
  }, [value, format, width, height, displayValue]);

  const downloadBarcode = () => {
    if (!svgRef.current || error) return;

    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if(ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const a = document.createElement('a');
        a.download = `barcode-${value}.png`;
        a.href = canvas.toDataURL('image/png');
        a.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8">
      <div className="md:col-span-7 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6">
         <div className="space-y-4">
            <div>
               <label className="text-sm font-bold text-gray-700 block mb-2">Barcode Value</label>
               <input
                 type="text"
                 value={value}
                 onChange={e => setValue(e.target.value)}
                 className="w-full bg-white border border-gray-300 rounded px-3 py-2 focus:ring-[#414FA8] focus:border-[#414FA8]"
                 placeholder="Enter SKU, UPC, or serial number"
               />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-sm font-bold text-gray-700 block mb-2">Format</label>
                 <select
                   value={format}
                   onChange={e => setFormat(e.target.value)}
                   className="w-full bg-white border border-gray-300 rounded px-3 py-2 focus:ring-[#414FA8] focus:border-[#414FA8]"
                 >
                   <option value="CODE128">CODE128 (Standard)</option>
                   <option value="CODE39">CODE39</option>
                   <option value="EAN13">EAN-13</option>
                   <option value="EAN8">EAN-8</option>
                   <option value="UPC">UPC</option>
                 </select>
               </div>
               <div className="flex items-center justify-center pt-6">
                 <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                   <input
                     type="checkbox"
                     checked={displayValue}
                     onChange={e => setDisplayValue(e.target.checked)}
                     className="w-4 h-4 text-[#414FA8] border-gray-300 rounded focus:ring-[#414FA8]"
                   />
                   Show Text Below
                 </label>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div>
                 <label className="text-sm font-bold text-gray-700 block mb-2">Line Width ({width})</label>
                 <input
                   type="range" min="1" max="4" step="1"
                   value={width} onChange={e => setWidth(parseInt(e.target.value))}
                   className="w-full"
                 />
               </div>
               <div>
                 <label className="text-sm font-bold text-gray-700 block mb-2">Height ({height}px)</label>
                 <input
                   type="range" min="30" max="200" step="10"
                   value={height} onChange={e => setHeight(parseInt(e.target.value))}
                   className="w-full"
                 />
               </div>
            </div>
         </div>
      </div>

      <div className="md:col-span-5 bg-gray-50 p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center justify-center gap-6">
         <div className="bg-white p-4 border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center w-full min-h-[150px]">
            <svg ref={svgRef}></svg>
         </div>
         {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
         <button
           onClick={downloadBarcode}
           disabled={!!error || !value}
           className="w-full flex items-center justify-center gap-2 py-3 bg-[#414FA8] text-white font-bold rounded-lg hover:bg-[#343f88] transition-colors disabled:opacity-50"
         >
           <Download className="w-5 h-5" />
           Download PNG
         </button>
      </div>
    </div>
  );
}
