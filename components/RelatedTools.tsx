import React from 'react';
import { ALL_TOOLS } from '@/data/tools';
import { TOOL_REDIRECT_MAP } from '@/data/tool-redirects';
import { ToolButton } from '@/components/ToolButton';

interface RelatedToolsProps {
  category: string;
  currentSlug?: string;
}

const SOCIAL_SLUGS = new Set([
  'social-media-resizer',
  'crop-image',
  'resize-image-pixel',
  'image-framer',
  'blur-background',
  'remove-background',
]);

const EXAM_EXTRA_SLUGS = new Set([
  'passport-photo-maker',
  'pan-card-photo-resizer',
  'add-name-and-date-on-photo',
  'white-background-passport-photo',
  '200-dpi-converter',
  'photo-and-signature-joiner',
]);

export function RelatedTools({ category, currentSlug }: RelatedToolsProps) {
  // Find up to 4 canonical popular tools in the same category
  const relatedTools = ALL_TOOLS.filter((t) => {
    if (TOOL_REDIRECT_MAP[t.slug]) return false;
    if (currentSlug && t.slug === currentSlug) return false;

    if (category === 'Image') return t.categoryId === 'image';
    if (category === 'PDF') return t.categoryId === 'pdf';
    if (category === 'Compress') {
      return t.slug.includes('compress') || t.slug.includes('reduce') || t.slug.includes('kb-photo-size');
    }
    if (category === 'Resize') {
      return t.slug.includes('resize') || t.slug.includes('crop') || t.slug.includes('passport');
    }
    if (category === 'Social') return SOCIAL_SLUGS.has(t.slug);
    if (category === 'Exam') return t.categoryId === 'exam-tools' || EXAM_EXTRA_SLUGS.has(t.slug);
    return t.categoryId === category;
  }).slice(0, 4);

  if (relatedTools.length === 0) return null;

  return (
    <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mt-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">
        Related Tools
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {relatedTools.map((tool) => (
          <ToolButton key={tool.id} tool={tool} />
        ))}
      </div>
    </div>
  );
}
