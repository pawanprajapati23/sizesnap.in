import React from 'react';
import Link from 'next/link';
import { SIDEBAR_QUICK_LINKS } from '@/data/tools';

export function Sidebar() {
  return (
    <aside className="hidden lg:block w-full space-y-6" aria-label="Quick Tools and Information">
      {/* Quick Tools Box */}
      <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
          <h3 className="text-xs font-bold text-[#414FA8] uppercase tracking-wider">
            Quick Tools
          </h3>
          <span className="text-[11px] text-gray-400 font-medium">Shortcuts</span>
        </div>

        {/* 2-column compact grid of quick links */}
        <div className="grid grid-cols-2 gap-2">
          {SIDEBAR_QUICK_LINKS.map((link) => (
            <Link prefetch={false}
              key={link.title}
              href={`/tools/${link.slug}`}
              className="flex items-center justify-center text-center p-2 rounded-[4px] border border-[#9AA3C8] bg-white hover:border-[#414FA8] hover:bg-[#F2F4FC] hover:text-[#414FA8] text-[#333333] transition-colors duration-150 min-h-[46px] group"
              title={link.title}
            >
              <span className="text-[12px] font-medium leading-tight line-clamp-2 group-hover:text-[#414FA8]">
                {link.title}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Reserved Advertisement Placeholder */}
      <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs">
        <div className="text-center mb-2">
          <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">
            Advertisement
          </span>
        </div>
        <div
          className="w-full min-h-[280px] bg-[#F9FAFB] border border-dashed border-gray-300 rounded-[4px] flex flex-col items-center justify-center p-4 text-center select-none"
          aria-label="Reserved Advertisement Slot"
        >
          <div className="w-10 h-10 rounded-full bg-gray-200/70 flex items-center justify-center text-gray-400 mb-2">
            <span className="text-xs font-mono">AD</span>
          </div>
          <p className="text-xs text-gray-400 font-medium">Responsive Ad Space</p>
          <p className="text-[11px] text-gray-400 mt-1">300 × 250 / 300 × 600 Slot</p>
        </div>
      </div>

      {/* Fast Utility Tip Box */}
      <div className="bg-[#EEF1FB] p-3.5 rounded-[4px] border border-[#9AA3C8]/40">
        <p className="text-xs font-semibold text-[#414FA8] mb-1">
          100% Free &amp; Private
        </p>
        <p className="text-[11px] text-gray-600 leading-relaxed">
          SizeSnap processes images locally in your browser when possible. Fast, secure, and no watermark added.
        </p>
      </div>
    </aside>
  );
}
