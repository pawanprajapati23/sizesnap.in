'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface DropzoneUploadProps {
  onFileSelect: (file: File) => void;
  acceptedFormats?: string[];
  maxSizeMB?: number;
}

const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function DropzoneUpload({
  onFileSelect,
  acceptedFormats = ['JPG', 'JPEG', 'PNG', 'WebP'],
  maxSizeMB = 50,
}: DropzoneUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSelectFile = useCallback((file: File) => {
    setErrorMessage(null);

    // Validate mime type
    if (!SUPPORTED_MIME_TYPES.includes(file.type)) {
      setErrorMessage(
        `Unsupported file type (${file.type || 'unknown'}). Please upload a JPG, JPEG, PNG, or WebP image.`
      );
      return;
    }

    // Validate size
    const maxBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setErrorMessage(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is ${maxSizeMB}MB.`
      );
      return;
    }

    onFileSelect(file);
  }, [maxSizeMB, onFileSelect]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelectFile(e.target.files[0]);
    }
  };

  // Allow pasting an image from clipboard anywhere on page
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const file = e.clipboardData.files[0];
        if (file.type.startsWith('image/')) {
          validateAndSelectFile(file);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [validateAndSelectFile]);

  return (
    <div className="w-full space-y-3">
      {errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-[4px] animate-in fade-in duration-150">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <p className="flex-1">{errorMessage}</p>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-xs font-semibold text-red-800 hover:underline"
          >
            Dismiss
          </button>
        </div>
      )}

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-[4px] border-2 border-dashed transition-all duration-150 cursor-pointer select-none ${
          isDragOver
            ? 'border-[#414FA8] bg-[#EEF1FB]/60 ring-2 ring-[#414FA8]/30 scale-[0.995]'
            : 'border-[#9AA3C8] bg-[#FAFAFC] hover:border-[#414FA8] hover:bg-[#F2F4FC]'
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        aria-label="Upload image area. Drag and drop file or click to select."
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp"
          onChange={handleInputChange}
          className="sr-only"
          aria-hidden="true"
        />

        <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#EEF1FB] border border-[#9AA3C8]/40 text-[#414FA8] mb-4 shadow-2xs group-hover:scale-105 transition-transform">
          <Upload className="h-7 w-7 text-[#414FA8]" />
        </div>

        <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-1">
          Select or Drop Image Here
        </h3>
        <p className="text-xs text-gray-500 mb-4 max-w-sm">
          Drag &amp; drop your image, paste from clipboard (Ctrl+V), or browse from device.
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#414FA8] hover:bg-[#343f88] active:bg-[#2b3470] text-white text-xs sm:text-sm font-semibold rounded-[4px] shadow-xs transition-colors"
        >
          <ImageIcon className="h-4 w-4" />
          <span>Browse File</span>
        </button>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] text-gray-400">
          <span>Supported: {acceptedFormats.join(', ')}</span>
          <span>•</span>
          <span>Max: {maxSizeMB}MB</span>
          <span>•</span>
          <span className="text-[#414FA8] font-medium">100% Client-side</span>
        </div>
      </div>
    </div>
  );
}
