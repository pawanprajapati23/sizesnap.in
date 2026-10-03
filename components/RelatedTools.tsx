import React from 'react';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';

interface RelatedToolsProps {
  category: string;
  currentSlug?: string;
}

export function RelatedTools({ category, currentSlug }: RelatedToolsProps) {
  // Find up to 4 popular tools in the same broad category
  const relatedTools = ALL_TOOLS.filter((t) => {
    if (currentSlug && t.slug === currentSlug) return false;

    if (category === 'Image') return t.categoryTitle.includes('Image') || t.categoryId === 'exam' || t.categoryId === 'pdf';
    if (category === 'PDF') return t.categoryId === 'image';
    if (category === 'Compress') return t.slug.includes('compress') || t.slug.includes('reduce');
    if (category === 'Resize') return t.slug.includes('resize') || t.slug.includes('crop') || t.categoryId === 'calculator';
    if (category === 'Social') return t.categoryId === 'calculator';
    if (category === 'Exam') return t.categoryId === 'pdf';
    return false;
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
