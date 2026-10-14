'use client';

import React, { useState, useRef } from 'react';
import { Upload, Loader2, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
}

export default function ImageUpload({ value, onChange, folder = 'blog-covers' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file (JPG, PNG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    setError('');
    setProgress(30);

    try {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

      // 1. Direct Cloudinary Upload (Zero Vercel server load)
      if (cloudName && uploadPreset) {
        setProgress(50);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', uploadPreset);
        if (folder) formData.append('folder', folder);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData?.error?.message || 'Failed to upload image to Cloudinary');
        }

        const data = await res.json();
        onChange(data.secure_url);
        setUploading(false);
        setProgress(100);
        setTimeout(() => setProgress(0), 500);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // 2. Fallback: Compress locally as optimized WebP if Cloudinary env vars not set
      const img = new globalThis.Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Max dimensions
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 675;
        
        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          // Compress as WebP with 0.7 quality
          const compressedBase64 = canvas.toDataURL('image/webp', 0.7);
          
          onChange(compressedBase64);
          setUploading(false);
          setProgress(100);
          setTimeout(() => setProgress(0), 500);
          if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
          throw new Error('Failed to get canvas context');
        }
        URL.revokeObjectURL(objectUrl);
      };
      
      img.onerror = () => {
        setError('Failed to read image file');
        setUploading(false);
        setProgress(0);
        URL.revokeObjectURL(objectUrl);
      };
      
      img.src = objectUrl;
    } catch (err) {
      console.error(err);
      setError('An unexpected error occurred');
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-video group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Uploaded preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-gray-900 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-gray-100"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onChange('')}
              className="bg-red-500 text-white px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors
            ${uploading ? 'bg-gray-50 border-gray-300' : 'bg-gray-50 border-gray-300 hover:bg-[#EEF1FB] hover:border-[#414FA8]'}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 text-[#414FA8] animate-spin mb-2" />
              <p className="text-sm font-medium text-gray-700">Uploading {progress}%...</p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-[#414FA8] mb-3">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-gray-900">Click to upload cover image</p>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP up to 5MB</p>
            </>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleUpload}
        disabled={uploading}
      />
      
      {/* Optional URL manual input for fallback */}
      {!value && !uploading && (
        <div className="flex items-center gap-2 mt-2">
          <span className="text-xs text-gray-400">or paste URL:</span>
          <input
            type="text"
            placeholder="https://..."
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 text-xs px-2 py-1.5 bg-white border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-[#414FA8]"
          />
        </div>
      )}
    </div>
  );
}
