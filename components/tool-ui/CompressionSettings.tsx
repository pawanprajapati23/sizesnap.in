'use client';

import React from 'react';
import { Sliders, Sparkles, AlertCircle, Info, Loader2 } from 'lucide-react';

export type OutputFormatOption = 'original' | 'image/jpeg' | 'image/webp' | 'image/png';

interface CompressionSettingsProps {
  quality: number;
  onQualityChange: (value: number) => void;
  outputFormat: OutputFormatOption;
  onOutputFormatChange: (format: OutputFormatOption) => void;
  originalFormat: string;
  onCompress: () => void;
  isCompressing: boolean;
}

const PRESETS = [
  { label: 'Low (40%)', value: 40, hint: 'Smallest file' },
  { label: 'Balanced (70%)', value: 70, hint: 'Recommended' },
  { label: 'High (85%)', value: 85, hint: 'Crisp detail' },
  { label: 'Max (95%)', value: 95, hint: 'Near lossless' },
];

export function CompressionSettings({
  quality,
  onQualityChange,
  outputFormat,
  onOutputFormatChange,
  originalFormat,
  onCompress,
  isCompressing,
}: CompressionSettingsProps) {
  // Check format caveats
  const effectiveFormat =
    outputFormat === 'original' ? originalFormat : outputFormat;

  const isPng = effectiveFormat === 'image/png';
  const isJpgFromPng =
    originalFormat === 'image/png' && effectiveFormat === 'image/jpeg';

  return (
    <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-[#414FA8]" />
          <h3 className="text-sm font-bold text-gray-900">Compression Settings</h3>
        </div>
        <span className="text-xs font-semibold text-[#414FA8] bg-[#EEF1FB] px-2 py-0.5 rounded">
          Quality: {quality}%
        </span>
      </div>

      {/* Quality Slider & Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="quality-slider" className="text-xs font-semibold text-gray-700">
            Image Quality Level:
          </label>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-gray-400">Smaller Size</span>
            <span className="text-[11px] text-gray-300">⟷</span>
            <span className="text-[11px] text-gray-400">Higher Quality</span>
          </div>
        </div>

        {/* Range slider */}
        <div className="relative">
          <input
            id="quality-slider"
            type="range"
            min="5"
            max="100"
            step="1"
            value={quality}
            onChange={(e) => onQualityChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#414FA8]"
          />
          <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-1">
            <span>5%</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Presets Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
          {PRESETS.map((preset) => {
            const isSelected = quality === preset.value;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onQualityChange(preset.value)}
                className={`px-2.5 py-1.5 rounded-[4px] border text-center transition-all text-xs ${
                  isSelected
                    ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold ring-1 ring-[#414FA8]/30'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-[#9AA3C8] hover:bg-gray-50'
                }`}
              >
                <div className="leading-tight">{preset.label}</div>
                <div className="text-[10px] opacity-75 font-normal">{preset.hint}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Output Format Selector */}
      <div className="space-y-2 pt-2 border-t border-gray-100">
        <label className="block text-xs font-semibold text-gray-700">
          Target File Format:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { id: 'original', label: 'Original Format', hint: 'Match source' },
            { id: 'image/jpeg', label: 'JPG / JPEG', hint: 'Best for photos' },
            { id: 'image/webp', label: 'WebP', hint: 'Modern & light' },
            { id: 'image/png', label: 'PNG', hint: 'Lossless & transparent' },
          ].map((fmt) => {
            const isSelected = outputFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => onOutputFormatChange(fmt.id as OutputFormatOption)}
                className={`px-2.5 py-2 rounded-[4px] border text-left transition-all ${
                  isSelected
                    ? 'border-[#414FA8] bg-[#EEF1FB] text-[#414FA8] font-bold ring-1 ring-[#414FA8]/30'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-[#9AA3C8] hover:bg-gray-50'
                }`}
              >
                <div className="text-xs font-semibold">{fmt.label}</div>
                <div className="text-[10px] text-gray-500 font-normal">{fmt.hint}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advisory Notes on Format Caveats */}
      {isPng && (
        <div className="flex items-start gap-2 p-2.5 bg-blue-50 border border-blue-200 text-blue-800 text-[11px] rounded-[4px] leading-relaxed">
          <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
          <span>
            <strong>Note on PNG:</strong> PNG is a lossless format, so standard browser quality sliders have minimal effect on pure PNG bytes. For dramatic size reduction while preserving transparency, choose <strong>WebP</strong>.
          </span>
        </div>
      )}

      {isJpgFromPng && (
        <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-[11px] rounded-[4px] leading-relaxed">
          <AlertCircle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
          <span>
            <strong>Transparency Notice:</strong> JPG does not support transparent alpha channels. Transparent areas in your PNG will be filled with clean white background.
          </span>
        </div>
      )}

      {/* Main Compress Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onCompress}
          disabled={isCompressing}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] disabled:bg-gray-400 text-white font-semibold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          {isCompressing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin text-white" />
              <span>Compressing Image...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Compress Image Now</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
