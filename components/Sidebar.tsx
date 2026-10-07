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
