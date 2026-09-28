'use client';

import React, { useState } from 'react';
import { Download, RefreshCw, CheckCircle2, ArrowRight, Eye, ShieldCheck } from 'lucide-react';
import { formatBytes, calculateSavings } from '@/lib/format-utils';

export interface CompressedResult {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  size: number;
  format: string;
  filename: string;
}

interface CompressionResultCardProps {
  originalSize: number;
  originalUrl: string;
  originalWidth: number;
  originalHeight: number;
  result: CompressedResult;
  onReset: () => void;
  onAdjustSettings: () => void;
}

export function CompressionResultCard({
  originalSize,
  originalUrl,
  originalWidth,
  originalHeight,
  result,
  onReset,
  onAdjustSettings,
}: CompressionResultCardProps) {
  const [activeTab, setActiveTab] = useState<'compressed' | 'original' | 'split'>('compressed');

  const savings = calculateSavings(originalSize, result.size);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-5">
      {/* Header status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900">
              Compression Complete!
            </h3>
            <p className="text-xs text-gray-500">
              Your compressed image is ready to download.
            </p>
          </div>
        </div>

        {/* Savings Badge */}
        {savings.isSmaller ? (
          <span className="self-start sm:self-auto px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full">
            Saved {savings.percent}% ({formatBytes(savings.savedBytes)})
          </span>
        ) : (
          <span className="self-start sm:self-auto px-2.5 py-1 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 rounded-full">
            Same or similar size
          </span>
        )}
      </div>

      {/* Comparison Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F9FAFB] p-3.5 rounded-[4px] border border-gray-200 text-center">
        <div className="p-2">
          <span className="block text-[11px] text-gray-500 font-medium">Original Size</span>
          <span className="text-xs sm:text-sm font-bold text-gray-800">
            {formatBytes(originalSize)}
          </span>
        </div>

        <div className="p-2">
          <span className="block text-[11px] text-[#414FA8] font-medium">Compressed Size</span>
          <span className="text-xs sm:text-sm font-bold text-[#414FA8]">
            {formatBytes(result.size)}
          </span>
        </div>

        <div className="p-2">
          <span className="block text-[11px] text-gray-500 font-medium">Dimensions</span>
          <span className="text-xs sm:text-sm font-semibold text-gray-700">
            {result.width} × {result.height} px
          </span>
        </div>

        <div className="p-2">
          <span className="block text-[11px] text-gray-500 font-medium">File Format</span>
          <span className="text-xs sm:text-sm font-semibold text-gray-700 uppercase">
            {result.format.replace('image/', '')}
          </span>
        </div>
      </div>

      {/* Visual Preview Section with Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-gray-500" /> Image Preview
          </span>

          <div className="inline-flex rounded-[4px] border border-gray-200 bg-gray-100 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('compressed')}
              className={`px-2.5 py-1 rounded-[3px] font-medium transition-colors ${
                activeTab === 'compressed'
                  ? 'bg-white text-[#414FA8] shadow-2xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Compressed
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('original')}
              className={`px-2.5 py-1 rounded-[3px] font-medium transition-colors ${
                activeTab === 'original'
                  ? 'bg-white text-[#414FA8] shadow-2xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Original
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('split')}
              className={`px-2.5 py-1 rounded-[3px] font-medium transition-colors ${
                activeTab === 'split'
                  ? 'bg-white text-[#414FA8] shadow-2xs font-semibold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Side by Side
            </button>
          </div>
        </div>

        {/* Preview Frame */}
        <div className="rounded-[4px] border border-gray-200 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:10px_10px] p-3 sm:p-4 min-h-[220px] flex items-center justify-center overflow-hidden">
          {activeTab === 'compressed' && (
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.url}
                alt="Compressed result"
                className="max-h-[340px] max-w-full rounded object-contain mx-auto shadow-xs"
              />
              <span className="inline-block mt-2 text-[11px] text-gray-500 font-medium">
                Compressed output ({formatBytes(result.size)})
              </span>
            </div>
          )}

          {activeTab === 'original' && (
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={originalUrl}
                alt="Original file"
                className="max-h-[340px] max-w-full rounded object-contain mx-auto shadow-xs"
              />
              <span className="inline-block mt-2 text-[11px] text-gray-500 font-medium">
                Original source ({formatBytes(originalSize)})
              </span>
            </div>
          )}

          {activeTab === 'split' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="text-center">
                <span className="block text-[11px] font-semibold text-gray-600 mb-1">
                  Original: {formatBytes(originalSize)}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={originalUrl}
                  alt="Original"
                  className="max-h-[240px] max-w-full rounded object-contain mx-auto border border-gray-200"
                />
              </div>
              <div className="text-center">
                <span className="block text-[11px] font-semibold text-[#414FA8] mb-1">
                  Compressed: {formatBytes(result.size)}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.url}
                  alt="Compressed"
                  className="max-h-[240px] max-w-full rounded object-contain mx-auto border border-gray-200"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          type="button"
          onClick={handleDownload}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>Download Compressed Image</span>
        </button>

        <button
          type="button"
          onClick={onAdjustSettings}
          className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-[#9AA3C8] bg-white hover:bg-[#EEF1FB] hover:border-[#414FA8] text-[#414FA8] text-xs font-semibold transition-colors"
        >
          Adjust Settings
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-4 py-3 rounded-[4px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors"
        >
          New Image
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
        <span>Processed directly on your device. Never saved on our servers.</span>
      </div>
    </div>
  );
}
