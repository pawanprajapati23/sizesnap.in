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
        <a
          href="https://uplcm.com/4/11257112"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full min-h-[250px] bg-gradient-to-br from-[#414FA8] to-[#6a75c9] rounded-[4px] flex flex-col items-center justify-center p-6 text-center shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden block"
          aria-label="Sponsor Advertisement"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 transform group-hover:scale-110 transition-transform duration-500"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white opacity-5 rounded-full -ml-8 -mb-8 transform group-hover:scale-110 transition-transform duration-500"></div>
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            </div>
            <h4 className="text-white font-bold text-lg mb-2 leading-tight">Boost Performance</h4>
            <p className="text-white/90 text-xs mb-5 px-2 leading-relaxed">Optimize your workflow with our recommended premium tools.</p>
            <span className="bg-white text-[#414FA8] font-bold text-sm py-2 px-6 rounded-full group-hover:bg-[#F2F4FC] transition-colors">
              Start Now
            </span>
          </div>
        </a>
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
