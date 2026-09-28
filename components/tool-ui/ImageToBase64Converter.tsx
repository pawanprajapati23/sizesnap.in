'use client';

import React, { useState, useRef } from 'react';
import { formatBytes } from '@/lib/format-utils';
import {
  Upload,
  FilePlus,
  Trash2,
  Copy,
  Check,
  Download,
  AlertCircle,
  ShieldCheck,
  Code,
  FileText,
  FileCode,
} from 'lucide-react';

interface EncodedImage {
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  rawBase64: string;
  width: number;
  height: number;
}

export function ImageToBase64Converter() {
  const [encoded, setEncoded] = useState<EncodedImage | null>(null);
  const [activeTab, setActiveTab] = useState<'data-url' | 'raw' | 'html' | 'css'>('data-url');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setErrorMsg(null);
    if (!file.type.startsWith('image/')) {
      setErrorMsg('Please select a valid image file (JPG, PNG, WebP, SVG, GIF).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const rawBase64 = dataUrl.split(',')[1] || '';

      const img = new Image();
      img.onload = () => {
        setEncoded({
          name: file.name,
          size: file.size,
          type: file.type || 'image/png',
          dataUrl,
          rawBase64,
          width: img.naturalWidth || img.width,
          height: img.naturalHeight || img.height,
        });
      };
      img.onerror = () => {
        setEncoded({
          name: file.name,
          size: file.size,
          type: file.type || 'image/png',
          dataUrl,
          rawBase64,
          width: 0,
          height: 0,
        });
      };
      img.src = dataUrl;
    };
    reader.onerror = () => setErrorMsg('Failed to read file.');
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const clearAll = () => {
    setEncoded(null);
    setErrorMsg(null);
    setCopiedTab(null);
  };

  const getCurrentSnippet = (): string => {
    if (!encoded) return '';
    switch (activeTab) {
      case 'data-url':
        return encoded.dataUrl;
      case 'raw':
        return encoded.rawBase64;
      case 'html':
        return `<img src="${encoded.dataUrl}" alt="${encoded.name.replace(/\.[^/.]+$/, '')}" width="${encoded.width}" height="${encoded.height}" />`;
      case 'css':
        return `background-image: url("${encoded.dataUrl}");`;
    }
  };

  const copyToClipboard = async (tabKey: string, textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedTab(tabKey);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = textToCopy;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopiedTab(tabKey);
      setTimeout(() => setCopiedTab(null), 2000);
    }
  };

  const downloadTextFile = () => {
    if (!encoded) return;
    const text = getCurrentSnippet();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${encoded.name.replace(/\.[^/.]+$/, '')}-base64.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[4px]">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <p className="flex-1">{errorMsg}</p>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-xs font-semibold text-red-800 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Upload Dropzone */}
      {!encoded ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[4px] border-2 border-dashed border-[#9AA3C8] bg-[#FAFAFC] hover:border-[#414FA8] hover:bg-[#F2F4FC] transition-colors cursor-pointer select-none"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.jpg,.jpeg,.png,.webp,.svg,.gif,.bmp"
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
            className="sr-only"
          />
          <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-4">
            <Code className="h-7 w-7" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
            Select or Drag an Image to Encode to Base64
          </h3>
          <p className="text-xs text-gray-500 mb-4 max-w-sm">
            Convert JPG, PNG, WebP, SVG, and GIF files to Data URI, Raw Base64 string, HTML &lt;img&gt;, or CSS background-image snippet.
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs sm:text-sm font-semibold rounded-[4px] shadow-xs transition-colors"
          >
            <FilePlus className="h-4 w-4" />
            <span>Select Image File</span>
          </button>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
            <span>Data URI &amp; Raw Base64</span>
            <span>•</span>
            <span>HTML &amp; CSS code snippets</span>
            <span>•</span>
            <span>100% Client-Side</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-[4px] border border-gray-200 shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="h-12 w-12 rounded border border-gray-200 bg-[#FAFAFC] overflow-hidden flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={encoded.dataUrl}
                  alt={encoded.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate max-w-xs sm:max-w-md" title={encoded.name}>
                  {encoded.name}
                </h3>
                <p className="text-[11px] text-gray-500">
                  {encoded.width > 0 ? `${encoded.width} × ${encoded.height} px • ` : ''}
                  Original: {formatBytes(encoded.size)} • Base64: {formatBytes(encoded.dataUrl.length)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-[#9AA3C8] hover:border-[#414FA8] bg-white hover:bg-[#EEF1FB] text-[#414FA8] text-xs font-semibold transition-colors"
              >
                <FilePlus className="h-3.5 w-3.5" />
                <span>Replace Image</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.jpg,.jpeg,.png,.webp,.svg,.gif,.bmp"
                onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
                className="sr-only"
              />

              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-[4px] border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Snippet Output Tabs */}
          <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2.5">
              <div className="flex flex-wrap gap-1.5">
                {[
                  { key: 'data-url', label: 'Data URI (data:image/...)', icon: FileText },
                  { key: 'raw', label: 'Raw Base64 Only', icon: FileCode },
                  { key: 'html', label: 'HTML <img> Tag', icon: Code },
                  { key: 'css', label: 'CSS background-image', icon: Code },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded transition-colors ${
                      activeTab === tab.key
                        ? 'bg-[#414FA8] text-white font-bold'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <tab.icon className="h-3 w-3" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => copyToClipboard(activeTab, getCurrentSnippet())}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#414FA8] hover:bg-[#343f88] text-white text-xs font-semibold rounded-[4px] transition-colors"
                >
                  {copiedTab === activeTab ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Snippet</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={downloadTextFile}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-[4px] border border-gray-200 transition-colors"
                  title="Download as .txt"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download .txt</span>
                </button>
              </div>
            </div>

            {/* Code Box */}
            <div className="relative">
              <textarea
                readOnly
                value={getCurrentSnippet()}
                rows={9}
                className="w-full p-3 font-mono text-[11px] bg-[#FAFAFC] border border-gray-200 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#414FA8] resize-y"
              />
              <div className="text-[11px] text-gray-400 mt-1 flex justify-between items-center">
                <span>Total Characters: {getCurrentSnippet().length.toLocaleString()}</span>
                <span>Click textarea, press Ctrl+A / Cmd+A to select all</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>100% Client-Side Base64 encoding. Images are not transferred across the internet.</span>
          </div>
        </div>
      )}
    </div>
  );
}
