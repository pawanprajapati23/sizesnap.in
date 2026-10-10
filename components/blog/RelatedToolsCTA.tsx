import React from 'react';
import { ALL_TOOLS } from '@/data/tools';
import Link from 'next/link';

export default function RelatedToolsCTA({ toolSlugs }: { toolSlugs: string[] }) {
  const tools = toolSlugs
    .map(slug => ALL_TOOLS.find(t => t.slug === slug))
    .filter(t => t !== undefined);

  if (tools.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {tools.map(tool => (
        <div key={tool.id} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex items-center justify-between group hover:border-[#414FA8] transition-colors">
          <div>
            <h4 className="font-bold text-gray-900 group-hover:text-[#414FA8] transition-colors mb-1">{tool.name}</h4>
            <p className="text-sm text-gray-500 line-clamp-1">{tool.shortDescription || tool.shortDesc}</p>
          </div>
          <Link
            href={`/tools/${tool.slug}`}
            className="flex-shrink-0 ml-4 px-5 py-2 bg-[#EEF1FB] text-[#414FA8] text-sm font-semibold rounded-lg hover:bg-[#414FA8] hover:text-white transition-colors"
          >
            Use Tool
          </Link>
        </div>
      ))}
    </div>
  );
}
