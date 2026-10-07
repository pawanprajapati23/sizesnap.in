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
          className="w-full h-[250px] bg-white border-[3px] border-[#EEF1FB] hover:border-blue-500 rounded-lg flex flex-col items-center justify-between p-5 text-center shadow-sm hover:shadow-xl transition-all group relative overflow-hidden block"
          aria-label="Sponsored Link"
        >
          {/* Subtle ad label */}
          <span className="absolute top-2 right-2 text-[9px] text-gray-400 uppercase font-bold tracking-wider">Ad</span>
          
          <div className="flex flex-col items-center justify-center h-full w-full mt-2">
            {/* Attention grabbing icon with bounce animation */}
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-blue-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
              </svg>
            </div>
            
            <h4 className="text-gray-900 font-extrabold text-[22px] mb-1 leading-tight tracking-tight">Your Tool is Ready</h4>
            <p className="text-gray-500 text-[13px] mb-4 font-medium">Click below to continue</p>
            
            {/* High CTR Green Button with pulse effect */}
            <div className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold text-lg py-3.5 px-6 rounded-md shadow-[0_4px_14px_0_rgba(16,185,129,0.39)] transition-colors relative overflow-hidden">
              <span className="relative z-10 flex items-center justify-center gap-2">
                START NOW
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path></svg>
              </span>
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
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
