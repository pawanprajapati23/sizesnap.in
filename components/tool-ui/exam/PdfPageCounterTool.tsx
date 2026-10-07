'use client';

import React, { useState } from 'react';
import { Upload, File as FileIcon, X } from 'lucide-react';

export function PdfPageCounterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== 'application/pdf') {
      setError('Please upload a valid PDF file.');
      return;
    }

    if (selected.size > 10 * 1024 * 1024) { // 10MB limit for safe client-side processing
      setError('File is too large. Please upload a PDF smaller than 10MB.');
      return;
    }

    setFile(selected);
    setError(null);
    setPageCount(null);
    setIsLoading(true);

    try {
      // Dynamic import to keep initial bundle size small as per Phase 0 rules
      const { PDFDocument } = await import('pdf-lib');
      const arrayBuffer = await selected.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPageCount(pdfDoc.getPageCount());
    } catch (err) {
      console.error(err);
      setError('Could not process this PDF file. It might be corrupted or encrypted.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPageCount(null);
    setError(null);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-6 items-center">

        {!file && (
          <div className="w-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 hover:border-[#414FA8] transition-colors relative cursor-pointer">
             <input
               type="file"
               accept="application/pdf"
               onChange={handleFileUpload}
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
             />
             <Upload className="w-10 h-10 text-gray-400 mb-4" />
             <p className="text-gray-700 font-medium mb-1">Click or drag PDF here to count pages</p>
             <p className="text-xs text-gray-500">Max size: 10MB (Processed securely in your browser)</p>
          </div>
        )}

        {error && (
          <div className="w-full p-4 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
            {error}
            <button onClick={reset} className="ml-4 underline hover:no-underline">Try again</button>
          </div>
        )}

        {file && !error && (
          <div className="w-full border border-gray-200 rounded-xl overflow-hidden shadow-sm">
             <div className="bg-gray-50 p-4 border-b border-gray-200 flex items-center justify-between">
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
                  title="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
             </div>

             <div className="p-8 flex flex-col items-center justify-center bg-white min-h-[200px]">
                {isLoading ? (
                  <div className="flex flex-col items-center gap-4 text-[#414FA8]">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#414FA8]"></div>
                    <p className="text-sm font-medium">Counting pages...</p>
                  </div>
                ) : (
                  pageCount !== null && (
                    <div className="text-center animate-fade-in">
                       <span className="block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Total Pages</span>
                       <span className="text-7xl font-bold font-mono text-[#414FA8]">{pageCount}</span>
                    </div>
                  )
                )}
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
