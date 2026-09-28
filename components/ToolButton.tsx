import Link from 'next/link';
import React from 'react';
import type { ToolItem } from '@/data/tools';

interface ToolButtonProps {
  tool: ToolItem;
  className?: string;
  isSidebar?: boolean;
}

export function ToolButton({ tool, className = '', isSidebar = false }: ToolButtonProps) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      title={tool.name}
      className={`group relative flex items-center justify-center text-center rounded-[4px] border border-[#9AA3C8] bg-white transition-all duration-150 ease-in-out hover:border-[#414FA8] hover:bg-[#F2F4FC] hover:shadow-xs active:bg-[#E8ECF8] focus-visible:outline-2 focus-visible:outline-[#414FA8] focus-visible:outline-offset-1 select-none overflow-hidden ${
        isSidebar
          ? 'min-h-[46px] px-2 py-1.5'
          : 'min-h-[50px] sm:min-h-[54px] px-2.5 py-1.5'
      } ${className}`}
    >
      <span
        className={`font-medium text-[#333333] group-hover:text-[#414FA8] line-clamp-2 leading-tight transition-colors duration-150 ${
          isSidebar ? 'text-xs sm:text-[12.5px]' : 'text-xs sm:text-[13px]'
        }`}
      >
        {tool.name}
      </span>
    </Link>
  );
}
