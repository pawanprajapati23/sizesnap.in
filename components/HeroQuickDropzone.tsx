'use client';

import React, { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Upload, 
  Sparkles, 
  FileCheck, 
  ShieldCheck, 
  Zap, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Image as ImageIcon 
} from 'lucide-react';

interface PresetItem {
  id: string;
  name: string;
  shortDesc: string;
  url: string;
  badge?: string;
  targetKb?: number;
}

const POPULAR_PRESETS: PresetItem[] = [
  {
    id: 'all-in-one-kit',
    name: 'Multi-Doc Exam Kit',
    shortDesc: 'Photo + Sign + Thumb simultaneously',
    url: '/exams/exam-application-kit',
    badge: '1-Click All',
  },
  {
    id: 'ssc',
    name: 'SSC Photo (20-50 KB)',
    shortDesc: '3.5 x 4.5 cm / CGL, CHSL, GD',
    url: '/exams/ssc-photo-signature-resizer',
    badge: 'Popular',
  },
  {
    id: 'ssc-sign',
    name: 'SSC Signature (10-20 KB)',
    shortDesc: '140 x 60 px black ink',
    url: '/exams/ssc-photo-signature-resizer?type=signature',
  },
  {
    id: 'upsc',
    name: 'UPSC Photo + Name/Date',
    shortDesc: 'OTR 10-day compliant',
    url: '/exams/upsc-photo-signature-resizer',
    badge: 'Mandatory',
  },
  {
    id: 'kb-20',
    name: 'Compress to 20 KB',
    shortDesc: 'Exact KB target',
    url: '/tools/reduce-image-size-in-kb?target=20',
    targetKb: 20,
  },
  {
    id: 'kb-50',
    name: 'Compress to 50 KB',
    shortDesc: 'Standard Govt limit',
    url: '/tools/reduce-image-size-in-kb?target=50',
    targetKb: 50,
  },
  {
    id: 'square-dp',
    name: 'WhatsApp DP (1:1)',
    shortDesc: 'Square crop without blur',
    url: '/tools/square-crop',
  },
  {
    id: 'scanner',
    name: 'Document Scanner (B&W)',
    shortDesc: 'Shadow removal & contrast',
    url: '/tools/black-and-white',
  },
];

export function HeroQuickDropzone() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPreset, setSelectedPreset] = useState<PresetItem>(POPULAR_PRESETS[0]);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (JPG, PNG, WebP).');
      return;
    }
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Save to sessionStorage so destination page can instantly retrieve it
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      try {
        sessionStorage.setItem('sizesnap_cached_image', base64);
        sessionStorage.setItem('sizesnap_cached_filename', file.name);
      } catch {
        // quota exceeded fallback
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleProceed = () => {
    setIsProcessing(true);
    router.push(selectedPreset.url);
  };

  return (
    <div className="bg-white rounded-[6px] border border-gray-200/90 shadow-xs overflow-hidden mb-6">
      {/* Top Banner Headline */}
      <div className="bg-gradient-to-r from-[#1E255E] via-[#2A3580] to-[#414FA8] px-4 py-3.5 sm:px-6 sm:py-4 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="inline-flex items-center gap-1 bg-[#F59E0B] text-gray-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              <Zap className="h-3 w-3 fill-current" /> Instant Resizer
            </span>
            <span className="text-xs text-indigo-100 font-medium hidden sm:inline">
              100% In-Browser &bull; No Uploads
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight">
            Drop Your Photo or Signature to Resize Instantly
          </h2>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-indigo-100 bg-white/10 px-2.5 py-1 rounded">
            <Lock className="h-3.5 w-3.5 text-emerald-300" />
            <span>Private &amp; Secure</span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {/* Step 1: Preset Pill Selector */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
              <span>1. Select Target Preset or Format:</span>
            </label>
            <span className="text-[11px] text-gray-500">Click any preset to auto-configure</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {POPULAR_PRESETS.map((preset) => {
              const isSelected = selectedPreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedPreset(preset)}
                  className={`text-xs px-3 py-1.5 rounded-[4px] font-medium transition-all flex items-center gap-1.5 border text-left ${
                    isSelected
                      ? 'bg-[#414FA8] text-white border-[#414FA8] shadow-xs ring-2 ring-[#414FA8]/20'
                      : 'bg-[#FAFAFC] text-gray-700 border-gray-200 hover:border-[#414FA8] hover:bg-white'
                  }`}
                >
                  <span>{preset.name}</span>
                  {preset.badge && (
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                        isSelected
                          ? 'bg-amber-400 text-gray-900'
                          : 'bg-indigo-50 text-[#414FA8]'
                      }`}
                    >
                      {preset.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Interactive Drag & Drop Area */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-[6px] p-6 sm:p-8 text-center cursor-pointer transition-all duration-150 ${
            isDragging
              ? 'border-[#414FA8] bg-[#EEF1FB]/60 scale-[0.99]'
              : selectedFile
              ? 'border-emerald-400 bg-emerald-50/20'
              : 'border-[#9AA3C8] bg-[#FAFAFC] hover:border-[#414FA8] hover:bg-[#F2F4FC]'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
            className="sr-only"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleFile(e.target.files[0]);
              }
            }}
          />

          {selectedFile && previewUrl ? (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-left">
              <div className="relative h-20 w-20 rounded border border-gray-300 overflow-hidden bg-white shrink-0 shadow-2xs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="Selected Preview"
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="space-y-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-700 font-bold text-xs">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Image Ready: {selectedFile.name}</span>
                </div>
                <p className="text-[11px] text-gray-500">
                  Original: {(selectedFile.size / 1024).toFixed(1)} KB &bull; Target:{' '}
                  <strong className="text-gray-900">{selectedPreset.name}</strong>
                </p>
                <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProceed();
                    }}
                    disabled={isProcessing}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs font-bold rounded-[4px] shadow-xs transition-colors"
                  >
                    <span>{isProcessing ? 'Opening...' : `Open in ${selectedPreset.name}`}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="text-xs text-gray-500 hover:text-red-600 px-3 py-2 border border-gray-200 rounded-[4px] bg-white transition-colors"
                  >
                    Choose Different Image
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-3 group-hover:scale-105 transition-transform shadow-2xs">
                <Upload className="h-5 w-5 text-[#414FA8]" />
              </div>

              <p className="text-sm font-bold text-gray-900 mb-0.5">
                Drop your image here, paste from clipboard (Ctrl+V), or{' '}
                <span className="text-[#414FA8] underline underline-offset-2">Browse</span>
              </p>
              <p className="text-xs text-gray-500 mb-2">
                Currently configured for:{' '}
                <strong className="text-[#414FA8]">{selectedPreset.name}</strong> ({selectedPreset.shortDesc})
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] text-gray-400">
                <span>Supports JPG, PNG, WebP</span>
                <span>&bull;</span>
                <span>Max 50MB</span>
                <span>&bull;</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                  <ShieldCheck className="h-3 w-3" /> Zero Server Uploads
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Trust & Assurance Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-gray-100 text-center sm:text-left">
          <div className="flex items-center gap-2 p-1.5 rounded bg-gray-50/70 border border-gray-100">
            <Zap className="h-3.5 w-3.5 text-[#414FA8] shrink-0" />
            <span className="text-[11px] font-medium text-gray-700">&lt;0.1s Fast In-Browser</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded bg-gray-50/70 border border-gray-100">
            <Lock className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span className="text-[11px] font-medium text-gray-700">100% Private (No Cloud)</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded bg-gray-50/70 border border-gray-100">
            <FileCheck className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <span className="text-[11px] font-medium text-gray-700">Official Portal Specs</span>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded bg-gray-50/70 border border-gray-100">
            <Sparkles className="h-3.5 w-3.5 text-amber-500 shrink-0" />
            <span className="text-[11px] font-medium text-gray-700">No Watermark &bull; Free</span>
          </div>
        </div>
      </div>
    </div>
  );
}
