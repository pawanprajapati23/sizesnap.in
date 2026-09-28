'use client';

import React from 'react';
import { Trash2, FileImage, Maximize2 } from 'lucide-react';
import { formatBytes } from '@/lib/format-utils';

export interface ImageMetadata {
  file: File;
  previewUrl: string;
  width: number;
  height: number;
  size: number;
  name: string;
  type: string;
}

interface ImagePreviewCardProps {
  image: ImageMetadata;
  onReset: () => void;
}

export function ImagePreviewCard({ image, onReset }: ImagePreviewCardProps) {
  const formatLabel = image.type.replace('image/', '').toUpperCase() || 'IMAGE';

  return (
    <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Thumbnail Preview */}
        <div className="relative h-24 w-28 sm:h-28 sm:w-32 shrink-0 rounded-[4px] border border-gray-200 overflow-hidden bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:8px_8px] flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image.previewUrl}
            alt={image.name}
            className="max-h-full max-w-full object-contain"
          />
        </div>

        {/* Metadata info */}
        <div className="flex-1 w-full min-w-0 space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="inline-block px-1.5 py-0.5 text-[10px] font-bold rounded bg-[#EEF1FB] text-[#414FA8] border border-[#9AA3C8]/40">
              {formatLabel}
            </span>
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate" title={image.name}>
              {image.name}
            </h4>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Maximize2 className="h-3 w-3 text-gray-400" />
              <span>{image.width} × {image.height} px</span>
            </div>
            <div className="flex items-center gap-1">
              <FileImage className="h-3 w-3 text-gray-400" />
              <span className="font-semibold text-gray-700">{formatBytes(image.size)}</span>
            </div>
          </div>

          <p className="text-[11px] text-gray-400">
            Original file is untouched. Processing is done securely in memory.
          </p>
        </div>

        {/* Remove / Change Image Button */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] border border-gray-200 hover:border-red-300 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium transition-colors"
            title="Remove and choose another image"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Change</span>
          </button>
        </div>
      </div>
    </div>
  );
}
