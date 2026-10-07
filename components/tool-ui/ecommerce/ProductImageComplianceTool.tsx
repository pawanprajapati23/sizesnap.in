'use client';

import React, { useState } from 'react';
import { Upload, Image as ImageIcon, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface ComplianceResult {
  name: string;
  passed: boolean;
  message: string;
}

export function ProductImageComplianceTool() {
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [results, setResults] = useState<ComplianceResult[]>([]);

  const [marketplace, setMarketplace] = useState<'amazon' | 'shopify' | 'etsy'>('amazon');

  const analyzeImage = (file: File, url: string, mkt: string) => {
    const img = new Image();
    img.onload = () => {
      const w = img.width;
      const h = img.height;
      const sizeKB = file.size / 1024;
      const ratio = w / h;

      const newResults: ComplianceResult[] = [];

      // File Size Check
      if (sizeKB > 10000) {
        newResults.push({ name: 'File Size', passed: false, message: `${(sizeKB/1024).toFixed(1)}MB is too large (Max 10MB).` });
      } else {
        newResults.push({ name: 'File Size', passed: true, message: `${Math.round(sizeKB)} KB is acceptable.` });
      }

      // Dimensions & Ratio Check
      if (mkt === 'amazon') {
        if (w < 1000 || h < 1000) {
           newResults.push({ name: 'Dimensions', passed: false, message: `Image is ${w}x${h}. Amazon recommends at least 1000px for zoom.` });
        } else {
           newResults.push({ name: 'Dimensions', passed: true, message: `Image is ${w}x${h} (Supports zoom).` });
        }

        if (Math.abs(ratio - 1) > 0.05) {
           newResults.push({ name: 'Aspect Ratio', passed: false, message: `Ratio is ${ratio.toFixed(2)}. Amazon prefers 1:1 square.` });
        } else {
           newResults.push({ name: 'Aspect Ratio', passed: true, message: `Perfect 1:1 square ratio.` });
        }
      } else if (mkt === 'etsy') {
        if (w < 2000) {
           newResults.push({ name: 'Dimensions', passed: false, message: `Image width is ${w}px. Etsy recommends 2000px wide.` });
        } else {
           newResults.push({ name: 'Dimensions', passed: true, message: `Width ${w}px meets Etsy recommendations.` });
        }
      } else {
        // Shopify / Generic
        if (w < 800 || h < 800) {
           newResults.push({ name: 'Dimensions', passed: false, message: `Image is ${w}x${h}. Recommend at least 800x800 for e-commerce.` });
        } else {
           newResults.push({ name: 'Dimensions', passed: true, message: `Dimensions (${w}x${h}) are good.` });
        }
      }

      // Format Check
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        newResults.push({ name: 'File Format', passed: false, message: `${file.type} may not be supported by all marketplaces.` });
      } else {
        newResults.push({ name: 'File Format', passed: true, message: `Valid ${file.type.split('/')[1].toUpperCase()} format.` });
      }

      setResults(newResults);
    };
    img.src = url;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    setFile(selected);
    const url = URL.createObjectURL(selected);
    setImageUrl(url);

    analyzeImage(selected, url, marketplace);
  };

  const handleMarketplaceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const mkt = e.target.value as 'amazon' | 'shopify' | 'etsy';
    setMarketplace(mkt);
    if (file && imageUrl) {
      analyzeImage(file, imageUrl, mkt);
    }
  };

  const reset = () => {
    setFile(null);
    setImageUrl('');
    setResults([]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3 text-blue-800 text-sm">
         <AlertTriangle className="w-5 h-5 shrink-0" />
         <p><strong>Note:</strong> This tool performs technical dimension, ratio, and size checks based on general marketplace guidelines. It does not use AI to check for pure-white backgrounds, prohibited watermarks, or offensive content.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6">
         <div>
            <label className="text-sm font-bold text-gray-700 block mb-2">Check Compliance For:</label>
            <select
              value={marketplace}
              onChange={handleMarketplaceChange}
              className="w-full sm:w-64 bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-[#414FA8] focus:border-[#414FA8] block p-2.5"
            >
              <option value="amazon">Amazon (Main Image)</option>
              <option value="etsy">Etsy (Listing Photo)</option>
              <option value="shopify">Shopify / Generic Store</option>
            </select>
         </div>

         {!file ? (
            <div className="w-full flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer relative">
               <input
                 type="file"
                 accept="image/jpeg, image/png, image/webp"
                 onChange={handleFileUpload}
                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               />
               <Upload className="w-10 h-10 text-gray-400 mb-4" />
               <h3 className="font-bold text-gray-700 mb-1">Upload Product Image</h3>
               <p className="text-sm text-gray-500">Fast, local compliance check.</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="flex flex-col items-center gap-4">
                  <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center relative">
                     <img src={imageUrl} alt="Product preview" className="max-w-full max-h-full object-contain" />
                  </div>
                  <button onClick={reset} className="text-sm text-[#414FA8] font-medium hover:underline">
                    Check Another Image
                  </button>
               </div>

               <div className="space-y-4">
                  <h3 className="font-bold text-lg text-gray-800 border-b border-gray-100 pb-2">Technical Analysis</h3>

                  <div className="space-y-3">
                     {results.map((r, i) => (
                        <div key={i} className={`p-4 rounded-lg border ${r.passed ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'} flex gap-3`}>
                           <div className="shrink-0 mt-0.5">
                             {r.passed ? <CheckCircle2 className="w-5 h-5 text-emerald-500" /> : <XCircle className="w-5 h-5 text-red-500" />}
                           </div>
                           <div>
                             <h4 className={`text-sm font-bold ${r.passed ? 'text-emerald-800' : 'text-red-800'}`}>{r.name}</h4>
                             <p className={`text-sm mt-0.5 ${r.passed ? 'text-emerald-600' : 'text-red-600'}`}>{r.message}</p>
                           </div>
                        </div>
                     ))}
                  </div>

               </div>
            </div>
         )}
      </div>
    </div>
  );
}
