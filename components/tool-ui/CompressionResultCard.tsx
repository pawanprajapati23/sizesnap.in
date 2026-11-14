'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Download, CheckCircle2, Eye, ShieldCheck, Share2, Printer, Award } from 'lucide-react';
import { formatBytes, calculateSavings } from '@/lib/format-utils';
import { trackDownload } from '@/lib/firebase';

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
  result,
  onReset,
  onAdjustSettings,
}: CompressionResultCardProps) {
  const [activeTab, setActiveTab] = useState<'compressed' | 'original' | 'split'>('compressed');
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const savings = calculateSavings(originalSize, result.size);
  const resultKb = result.size / 1024;

  // Determine portal compliance badge automatically based on output KB
  const complianceBadge = (() => {
    if (resultKb >= 10 && resultKb <= 20.5) {
      return 'PASS: SSC, IBPS & GDS Signature Range (10KB–20KB)';
    }
    if (resultKb > 20.5 && resultKb <= 50.5) {
      return 'PASS: SSC, UPSC, Police & Bank Photo Range (20KB–50KB)';
    }
    if (resultKb > 50.5 && resultKb <= 100.5) {
      return 'PASS: Rajasthan SSO, IBPS Declaration & UPSC Range (50KB–100KB)';
    }
    return `Verified Output: ${resultKb.toFixed(1)} KB`;
  })();

  const handleDownload = () => {
    trackDownload('compress-image');
    const link = document.createElement('a');
    link.href = result.url;
    link.download = result.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNativeShare = async () => {
    try {
      const file = new File([result.blob], result.filename, { type: result.format || 'image/jpeg' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: result.filename,
          text: `Resized to ${formatBytes(result.size)} (${result.width}x${result.height}px) via SizeSnap.in`,
        });
        return;
      }
    } catch {
      // fallback to download
    }
    setShareStatus('File ready—use Download to share on WhatsApp');
    setTimeout(() => setShareStatus(null), 3000);
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
            <p className="text-xs text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
              <Award className="h-3.5 w-3.5 shrink-0" />
              <span>{complianceBadge}</span>
            </p>
          </div>
        </div>

        {/* Savings Badge */}
        {savings.isSmaller ? (
          <span className="self-start sm:self-auto px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full tabular-nums">
            Saved {savings.percent}% ({formatBytes(savings.savedBytes)})
          </span>
        ) : (
          <span className="self-start sm:self-auto px-2.5 py-1 text-xs font-semibold text-[#414FA8] bg-[#EEF1FB] border border-[#9AA3C8]/50 rounded-full tabular-nums">
            Exact Target Locked ({formatBytes(result.size)})
          </span>
        )}
      </div>

      {/* Comparison Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F9FAFB] p-3.5 rounded-[4px] border border-gray-200 text-center tabular-nums">
        <div className="p-2">
          <span className="block text-[11px] text-gray-500 font-medium">Original Size</span>
          <span className="text-xs sm:text-sm font-bold text-gray-800 font-mono">
            {formatBytes(originalSize)}
          </span>
        </div>

        <div className="p-2">
          <span className="block text-[11px] text-[#414FA8] font-medium">Output Size</span>
          <span className="text-xs sm:text-sm font-bold text-[#414FA8] font-mono">
            {formatBytes(result.size)}
          </span>
        </div>

        <div className="p-2">
          <span className="block text-[11px] text-gray-500 font-medium">Dimensions</span>
          <span className="text-xs sm:text-sm font-semibold text-gray-700 font-mono">
            {result.width} × {result.height} px
          </span>
        </div>

        <div className="p-2">
          <span className="block text-[11px] text-gray-500 font-medium">File Format</span>
          <span className="text-xs sm:text-sm font-semibold text-gray-700 uppercase font-mono">
            {result.format.replace('image/', '')}
          </span>
        </div>
      </div>

      {/* Visual Preview Section with Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
            <Eye className="h-3.5 w-3.5 text-gray-500" /> Before / After Inspector
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
              Output
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
        <div className="rounded-[4px] border border-gray-200 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:10px_10px] p-3 sm:p-4 min-h-[220px] flex items-center justify-center overflow-hidden tabular-nums">
          {activeTab === 'compressed' && (
            <div className="text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={result.url}
                alt="Compressed result"
                className="max-h-[340px] max-w-full rounded object-contain mx-auto shadow-xs"
              />
              <span className="inline-block mt-2 text-[11px] text-gray-500 font-medium font-mono">
                Compressed output ({formatBytes(result.size)} • {result.width}×{result.height}px)
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
              <span className="inline-block mt-2 text-[11px] text-gray-500 font-medium font-mono">
                Original source ({formatBytes(originalSize)})
              </span>
            </div>
          )}

          {activeTab === 'split' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div className="text-center">
                <span className="block text-[11px] font-semibold text-gray-600 mb-1 font-mono">
                  Original: {formatBytes(originalSize)}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={originalUrl}
                  alt="Original"
                  className="max-h-[240px] max-w-full rounded object-contain mx-auto border border-gray-200 bg-white"
                />
              </div>
              <div className="text-center">
                <span className="block text-[11px] font-semibold text-[#414FA8] mb-1 font-mono">
                  Output: {formatBytes(result.size)}
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={result.url}
                  alt="Compressed"
                  className="max-h-[240px] max-w-full rounded object-contain mx-auto border border-gray-200 bg-white"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {shareStatus && (
        <div className="text-xs text-[#414FA8] bg-[#EEF1FB] px-3 py-2 rounded border border-[#9AA3C8]/40 text-center font-medium">
          {shareStatus}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
        <button
          type="button"
          onClick={handleDownload}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer"
        >
          <Download className="h-4 w-4" />
          <span>Download Image ({formatBytes(result.size)})</span>
        </button>

        <button
          type="button"
          onClick={handleNativeShare}
          className="w-full sm:w-auto px-3.5 py-3 rounded-[4px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          title="Share file directly on mobile"
        >
          <Share2 className="h-3.5 w-3.5 text-[#414FA8]" />
          <span>Share</span>
        </button>

        <button
          type="button"
          onClick={onAdjustSettings}
          className="w-full sm:w-auto px-3.5 py-3 rounded-[4px] border border-[#9AA3C8] bg-white hover:bg-[#EEF1FB] hover:border-[#414FA8] text-[#414FA8] text-xs font-semibold transition-colors cursor-pointer"
        >
          Adjust KB
        </button>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-3.5 py-3 rounded-[4px] border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-medium transition-colors cursor-pointer"
        >
          New File
        </button>
      </div>

      {/* Pro Cyber-Cafe & Multi-Doc Quick Handoff */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100 text-[11px] text-gray-500">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
          <span>100% Client-Side Private (Zero Server Upload)</span>
        </div>
        <Link
          href="/tools/cyber-cafe-passport-photo-maker"
          className="inline-flex items-center gap-1 font-semibold text-[#414FA8] hover:underline"
        >
          <Printer className="h-3 w-3" />
          <span>Arrange on 4×6 / A4 Print Sheet →</span>
        </Link>
      </div>
    </div>
  );
}
