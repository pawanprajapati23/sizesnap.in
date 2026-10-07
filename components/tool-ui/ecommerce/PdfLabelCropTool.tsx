'use client';

import React, { useState } from 'react';
import { Upload, File as FileIcon, Download, X, AlertCircle } from 'lucide-react';

export function PdfLabelCropTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  // Label configuration
  const [cropConfig, setCropConfig] = useState<'a4-to-thermal' | 'split-a4' | 'extract-shipping'>('a4-to-thermal');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== 'application/pdf') {
      setError('Please upload a valid PDF label file.');
      return;
    }

    setFile(selected);
    setError(null);
    setDownloadUrl(null);
  };

  const processLabels = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const { PDFDocument } = await import('pdf-lib');
      const arrayBuffer = await file.arrayBuffer();
      const originalPdf = await PDFDocument.load(arrayBuffer);
      const originalPages = originalPdf.getPages();

      const newPdf = await PDFDocument.create();

      if (cropConfig === 'a4-to-thermal') {
        // Typical workflow: A4 page with a 4x6 label taking up part of it.
        // We'll crop out the standard top-left/top-half 4x6 section (often approx 288x432 pts).
        for (const page of originalPages) {
          const { width, height } = page.getSize();

          // Assuming a standard A4 (595x842) where the 4x6 label (288x432) is placed.
          // Adjust crop box. Usually labels are at the top half.
          const cropWidth = 288;
          const cropHeight = 432;

          // Embed the page into the new document scaled/cropped
          const embeddedPage = await newPdf.embedPage(page, {
            left: 0,
            right: cropWidth,
            bottom: height - cropHeight,
            top: height,
          });

          const newPage = newPdf.addPage([cropWidth, cropHeight]);
          newPage.drawPage(embeddedPage, { x: 0, y: 0 });
        }
      } else if (cropConfig === 'split-a4') {
        // Splits one A4 containing 4 labels (quadrants) into 4 separate pages
        for (const page of originalPages) {
          const { width, height } = page.getSize();
          const halfW = width / 2;
          const halfH = height / 2;

          const quadrants = [
            { l: 0, r: halfW, b: halfH, t: height }, // Top Left
            { l: halfW, r: width, b: halfH, t: height }, // Top Right
            { l: 0, r: halfW, b: 0, t: halfH }, // Bottom Left
            { l: halfW, r: width, b: 0, t: halfH }, // Bottom Right
          ];

          for (const q of quadrants) {
             const embedded = await newPdf.embedPage(page, { left: q.l, right: q.r, bottom: q.b, top: q.t });
             const newPage = newPdf.addPage([halfW, halfH]);
             newPage.drawPage(embedded, { x: 0, y: 0 });
          }
        }
      } else {
        // generic copy for demo purposes if other config selected
        const copiedPages = await newPdf.copyPages(originalPdf, originalPdf.getPageIndices());
        copiedPages.forEach(p => newPdf.addPage(p));
      }

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      setDownloadUrl(URL.createObjectURL(blob));

    } catch (err) {
      console.error(err);
      setError('Could not process this PDF file. It might be encrypted or corrupted.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setFile(null);
    setDownloadUrl(null);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6">

        {!file ? (
          <div className="w-full flex flex-col items-center justify-center p-10 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors relative cursor-pointer">
             <input
               type="file"
               accept="application/pdf"
               onChange={handleFileUpload}
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
             />
             <Upload className="w-12 h-12 text-gray-400 mb-4" />
             <h3 className="text-lg font-bold text-gray-800 mb-1">Upload Shipping Label PDF</h3>
             <p className="text-sm text-gray-500">Auto-crop A4 sheets to 4x6 thermal format locally</p>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="bg-gray-50 p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                   <div className="p-2 bg-white rounded shadow-sm border border-gray-100">
                      <FileIcon className="w-6 h-6 text-[#414FA8]" />
                   </div>
                   <div className="truncate">
                      <p className="text-sm font-semibold text-gray-800 truncate">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                   </div>
                </div>
                <button
                  onClick={reset}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
             </div>

             <div className="space-y-3">
               <label className="text-sm font-bold text-gray-700 block">Select Label Format Action</label>
               <select
                 value={cropConfig}
                 onChange={e => setCropConfig(e.target.value as 'a4-to-thermal' | 'split-a4' | 'extract-shipping')}
                 className="w-full bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-[#414FA8] focus:border-[#414FA8] block p-3"
               >
                 <option value="a4-to-thermal">Crop top-left A4 label to 4x6 Thermal format</option>
                 <option value="split-a4">Split one A4 page with 4 labels into four 4x6 pages</option>
               </select>
             </div>

             {error && (
               <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 flex gap-2">
                 <AlertCircle className="w-5 h-5 shrink-0" />
                 {error}
               </div>
             )}

             {!downloadUrl ? (
                <button
                  onClick={processLabels}
                  disabled={isProcessing}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#414FA8] text-white font-bold rounded-lg hover:bg-[#343f88] transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing Label...' : 'Format & Crop Label'}
                </button>
             ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 flex flex-col items-center justify-center gap-4">
                   <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                     <Download className="w-6 h-6" />
                   </div>
                   <div className="text-center">
                     <h4 className="font-bold text-emerald-800">Ready to Print</h4>
                     <p className="text-sm text-emerald-600 mt-1">Your cropped thermal labels are ready.</p>
                   </div>
                   <a
                     href={downloadUrl}
                     download={`formatted-labels-${Date.now()}.pdf`}
                     className="px-6 py-2.5 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm"
                   >
                     Download PDF
                   </a>
                </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
}
