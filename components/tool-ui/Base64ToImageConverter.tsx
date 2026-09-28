'use client';

import React, { useState, useEffect } from 'react';
import { formatBytes } from '@/lib/format-utils';
import {
  Download,
  AlertCircle,
  ShieldCheck,
  Image as ImageIcon,
  CheckCircle2,
  Trash2,
  Sparkles,
} from 'lucide-react';

export function Base64ToImageConverter() {
  const [inputText, setInputText] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{
    width: number;
    height: number;
    size: number;
    format: string;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fileName, setFileName] = useState('sizesnap-decoded-image');

  // Detect and resolve Base64 string into valid Data URI
  const decodeBase64 = (rawInput: string) => {
    setErrorMsg(null);
    const trimmed = rawInput.trim();
    if (!trimmed) {
      setImageSrc(null);
      setImageMeta(null);
      return;
    }

    let finalDataUrl = trimmed;

    // Check if it already has a data URL prefix
    if (!trimmed.startsWith('data:image/')) {
      // Auto-detect format by common Base64 magic headers
      let detectedMime = 'image/png';
      if (trimmed.startsWith('/9j/')) detectedMime = 'image/jpeg';
      else if (trimmed.startsWith('iVBORw0KGgo')) detectedMime = 'image/png';
      else if (trimmed.startsWith('R0lGOD')) detectedMime = 'image/gif';
      else if (trimmed.startsWith('UklGR')) detectedMime = 'image/webp';
      else if (trimmed.startsWith('PHN2Zy') || trimmed.startsWith('PD94bWw')) detectedMime = 'image/svg+xml';

      finalDataUrl = `data:${detectedMime};base64,${trimmed}`;
    }

    const img = new Image();
    img.onload = () => {
      // Calculate approximate byte size from base64 length
      const base64Content = finalDataUrl.split(',')[1] || '';
      const approximateBytes = Math.round((base64Content.length * 3) / 4);

      // Extract format
      const mimeMatch = finalDataUrl.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,/);
      const mimeType = mimeMatch ? mimeMatch[1] : 'image/png';
      const ext = mimeType.replace('image/', '').replace('+xml', '');

      setImageSrc(finalDataUrl);
      setImageMeta({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
        size: approximateBytes,
        format: ext.toUpperCase(),
      });
      setErrorMsg(null);
    };

    img.onerror = () => {
      setImageSrc(null);
      setImageMeta(null);
      setErrorMsg('Invalid Base64 string. Please check that the data is not corrupted or truncated.');
    };

    img.src = finalDataUrl;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText) {
        decodeBase64(inputText);
      } else {
        setImageSrc(null);
        setImageMeta(null);
        setErrorMsg(null);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [inputText]);

  const clearAll = () => {
    setInputText('');
    setImageSrc(null);
    setImageMeta(null);
    setErrorMsg(null);
  };

  const handleDownload = () => {
    if (!imageSrc || !imageMeta) return;

    let ext = imageMeta.format.toLowerCase();
    if (ext === 'jpeg') ext = 'jpg';
    if (ext === 'svg') ext = 'svg';

    const a = document.createElement('a');
    a.href = imageSrc;
    a.download = `${fileName || 'decoded-image'}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Sample data URL button for quick testing
  const loadSample = () => {
    // 64x64 blue square PNG
    const sample =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAQAAAAAYLlVAAAAPklEQVR42u3PMQEAAAwCoNm/9FL4gAAGm3QEAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBgbdgAUQkAAH1z8kYAAAAAElFTkSuQmCC';
    setInputText(sample);
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

      {/* Input Textarea Panel */}
      <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-2">
          <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
            Paste Base64 or Data URI String:
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadSample}
              className="inline-flex items-center gap-1 text-xs text-[#414FA8] hover:underline font-semibold"
            >
              <Sparkles className="h-3 w-3" />
              <span>Load Sample</span>
            </button>
            {inputText && (
              <>
                <span className="text-gray-300">|</span>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  <span>Clear</span>
                </button>
              </>
            )}
          </div>
        </div>

        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Paste your Base64 string here (e.g. data:image/png;base64,iVBORw0KGgo... or raw Base64)"
          rows={6}
          className="w-full p-3 font-mono text-[11px] bg-[#FAFAFC] border border-gray-300 rounded text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#414FA8] focus:border-[#414FA8] resize-y"
        />

        <div className="flex flex-wrap items-center justify-between text-[11px] text-gray-400">
          <span>Supports Data URIs and Raw Base64 strings</span>
          <span>Characters: {inputText.length.toLocaleString()}</span>
        </div>
      </div>

      {/* Decoded Image Output Card */}
      {imageSrc && imageMeta && (
        <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900">
                  Base64 Decoded Successfully!
                </h3>
                <p className="text-xs text-gray-500">
                  Detected format: {imageMeta.format} • {imageMeta.width} × {imageMeta.height} px • {formatBytes(imageMeta.size)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-xs font-bold text-[#414FA8] bg-[#EEF1FB] border border-[#9AA3C8]/40 rounded-full">
                {imageMeta.format} • {imageMeta.width}×{imageMeta.height}
              </span>
            </div>
          </div>

          {/* Image Display */}
          <div className="flex justify-center p-4 bg-[#FAFAFC] border border-gray-200 rounded overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt="Decoded base64"
              className="max-h-72 max-w-full object-contain rounded shadow-xs"
            />
          </div>

          {/* Download filename input & button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <div className="w-full sm:w-auto flex-1">
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Save File Name:
              </label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter filename"
                className="w-full px-3 py-2 text-xs border border-gray-300 rounded bg-white text-gray-800 focus:outline-none focus:border-[#414FA8]"
              />
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="w-full sm:w-auto self-end flex items-center justify-center gap-2 py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-[4px] shadow-xs transition-colors cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download {imageMeta.format} File</span>
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 pt-1 text-[11px] text-gray-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>Decoded entirely in your browser memory. No data sent to any server.</span>
          </div>
        </div>
      )}
    </div>
  );
}
