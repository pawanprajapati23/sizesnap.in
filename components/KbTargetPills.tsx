import React from 'react';
import Link from 'next/link';
import { Target, FileText, Sparkles } from 'lucide-react';

interface KbTargetPillsProps {
  type?: 'image' | 'pdf';
  activeSlug?: string;
  className?: string;
}

const IMAGE_PILLS = [
  { label: '10 KB', href: '/tools/compress-image-to-10kb', slug: 'compress-image-to-10kb', badge: 'Signature' },
  { label: '12 KB', href: '/tools/compress-image-to-12kb', slug: 'compress-image-to-12kb', badge: 'Trending' },
  { label: '13 KB', href: '/tools/compress-image-to-13kb', slug: 'compress-image-to-13kb' },
  { label: '14 KB', href: '/tools/14kb-photo-size', slug: '14kb-photo-size', badge: 'High Intent' },
  { label: '15 KB', href: '/tools/compress-image-to-15kb', slug: 'compress-image-to-15kb' },
  { label: '20 KB', href: '/tools/compress-image-to-20kb', slug: 'compress-image-to-20kb', badge: 'SSC/UPSC' },
  { label: '28 KB', href: '/tools/compress-image-to-28kb', slug: 'compress-image-to-28kb' },
  { label: '30 KB', href: '/tools/compress-image-to-30kb', slug: 'compress-image-to-30kb', badge: 'UTIITSL' },
  { label: '40 KB', href: '/tools/compress-image-to-40kb', slug: 'compress-image-to-40kb' },
  { label: '50 KB', href: '/tools/compress-image-to-50kb', slug: 'compress-image-to-50kb', badge: 'Popular' },
  { label: '60 KB', href: '/tools/60kb-photo-size', slug: '60kb-photo-size' },
  { label: '100 KB', href: '/tools/compress-image-to-100kb', slug: 'compress-image-to-100kb', badge: 'Admit Card' },
  { label: '150 KB', href: '/tools/compress-image-to-150kb', slug: 'compress-image-to-150kb' },
  { label: '200 KB', href: '/tools/compress-image-to-200kb', slug: 'compress-image-to-200kb', badge: 'State PSC' },
  { label: '500 KB', href: '/tools/compress-image-to-500kb', slug: 'compress-image-to-500kb' },
  { label: '20KB–50KB Range', href: '/tools/compress-image-between-20kb-to-50kb', slug: 'compress-image-between-20kb-to-50kb', badge: 'Govt Range' },
  { label: '10KB–20KB Range', href: '/tools/compress-image-between-10kb-to-20kb', slug: 'compress-image-between-10kb-to-20kb' },
];

const PDF_PILLS = [
  { label: '12 KB PDF', href: '/tools/compress-pdf-12kb', slug: 'compress-pdf-12kb' },
  { label: '50 KB PDF', href: '/tools/compress-pdf-50kb', slug: 'compress-pdf-50kb' },
  { label: '100 KB PDF', href: '/tools/compress-pdf-100kb', slug: 'compress-pdf-100kb', badge: 'Popular' },
  { label: '140 KB PDF', href: '/tools/compress-pdf-140kb', slug: 'compress-pdf-140kb', badge: 'Govt Exams' },
  { label: '200 KB PDF', href: '/tools/compress-pdf-200kb', slug: 'compress-pdf-200kb' },
  { label: '300 KB PDF', href: '/tools/compress-pdf-300kb', slug: 'compress-pdf-300kb' },
  { label: '500 KB PDF', href: '/tools/compress-pdf-500kb', slug: 'compress-pdf-500kb' },
];

export function KbTargetPills({ type = 'image', activeSlug, className = '' }: KbTargetPillsProps) {
  const pills = type === 'pdf' ? PDF_PILLS : IMAGE_PILLS;
  const title = type === 'pdf' ? 'Quick PDF Target Sizes (Govt Portals)' : 'Quick Target KB Sizes (Official Exam Presets)';

  return (
    <div className={`bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-bold text-gray-900 flex items-center gap-1.5">
          {type === 'pdf' ? <FileText className="w-4 h-4 text-[#414FA8]" /> : <Target className="w-4 h-4 text-[#414FA8]" />}
          <span>{title}</span>
        </h3>
        <span className="text-[11px] text-gray-500 hidden sm:inline-flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-500" /> Exact KB target in 1-click
        </span>
      </div>

      <div className="flex flex-wrap gap-2 text-xs">
        {pills.map((pill) => {
          const isActive = activeSlug === pill.slug;
          return (
            <Link
              key={pill.slug}
              href={pill.href}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] transition-all font-medium border text-xs ${
                isActive
                  ? 'bg-[#414FA8] text-white border-[#414FA8] shadow-xs'
                  : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-[#EEF1FB] hover:border-[#414FA8] hover:text-[#414FA8]'
              }`}
            >
              <span>{pill.label}</span>
              {pill.badge && (
                <span
                  className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase tracking-tight ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                  }`}
                >
                  {pill.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
