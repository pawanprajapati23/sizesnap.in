'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Zap, Lock } from 'lucide-react';

const KB_TAGS = [
  { label: '10 KB', href: '/tools/reduce-image-size-in-kb?target=10' },
  { label: '20 KB (Govt)', href: '/tools/reduce-image-size-in-kb?target=20' },
  { label: '30 KB (Sign)', href: '/tools/reduce-image-size-in-kb?target=30' },
  { label: '50 KB', href: '/tools/reduce-image-size-in-kb?target=50' },
  { label: '100 KB', href: '/tools/reduce-image-size-in-kb?target=100' },
  { label: '300 KB (UPSC)', href: '/tools/reduce-image-size-in-kb?target=300' },
  { label: 'PDF 100 KB', href: '/tools/compress-pdf?target=100' },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-[#0B0F19] border-t border-gray-800 text-gray-300 font-sans relative overflow-hidden">
      
      {/* 1. Value Proposition & Trust Badges Strip (Dark Theme) */}
      <div className="bg-[#111827] border-b border-gray-800 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="p-2.5 bg-gray-800 rounded-full text-blue-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-100">100% Client-Side Safe</h3>
            <p className="text-[11px] text-gray-400 max-w-[250px]">Files never leave your browser. Zero server uploads.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-2.5 bg-gray-800 rounded-full text-amber-400">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-100">WASM Powered Speed</h3>
            <p className="text-[11px] text-gray-400 max-w-[250px]">Instant compression utilizing local device power.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="p-2.5 bg-gray-800 rounded-full text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-gray-100">Forever Free</h3>
            <p className="text-[11px] text-gray-400 max-w-[250px]">No hidden limits, no paywalls, no watermarks.</p>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand & Description (Takes up 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-5">
            <Link prefetch={false} href="/" className="inline-block group">
              <div className="flex items-center gap-2.5">
                <Image src="/logo.png" alt="SizeSnap Logo" width={32} height={32} className="w-8 h-8 opacity-90 group-hover:opacity-100 transition-opacity" />
                <span className="text-xl font-bold text-white tracking-tight">Size<span className="text-[#6366F1]">Snap</span></span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              The smartest, fastest, and most secure toolkit for resizing images and PDFs perfectly tailored for Indian Government Exams, University portals, and quick daily utility.
            </p>
          </div>

          {/* Compress Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-100 tracking-wide">Image Resizer</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link prefetch={false} href="/tools/compress-image-to-20kb" className="hover:text-[#6366F1] transition-colors">Compress image to 20kb</Link></li>
              <li><Link prefetch={false} href="/tools/compress-image-to-50kb" className="hover:text-[#6366F1] transition-colors">Compress image to 50kb</Link></li>
              <li><Link prefetch={false} href="/tools/compress-image-to-100kb" className="hover:text-[#6366F1] transition-colors">Compress image to 100kb</Link></li>
              <li><Link prefetch={false} href="/tools/compress-image" className="hover:text-[#6366F1] transition-colors">Free image compressor</Link></li>
              <li><Link prefetch={false} href="/tools/reduce-image-size-in-kb" className="hover:text-[#6366F1] transition-colors">Reduce image size in kb</Link></li>
            </ul>
          </div>

          {/* Utilities */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-gray-100 tracking-wide">Top Utilities</h4>
            <ul className="space-y-2.5 text-sm text-gray-400">
              <li><Link prefetch={false} href="/tools/passport-photo-maker" className="hover:text-[#6366F1] transition-colors">Passport photo maker online</Link></li>
              <li><Link prefetch={false} href="/tools/compress-pdf" className="hover:text-[#6366F1] transition-colors">Compress pdf to 100kb online free</Link></li>
              <li><Link prefetch={false} href="/exams" className="hover:text-[#6366F1] transition-colors">Photo size for SSC & UPSC</Link></li>
              <li><Link prefetch={false} href="/tools/image-to-pdf" className="hover:text-[#6366F1] transition-colors">JPG to PDF</Link></li>
              <li><Link prefetch={false} href="/#directory" className="hover:text-[#6366F1] transition-colors font-medium">All Tools &rarr;</Link></li>
            </ul>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs text-gray-500 uppercase tracking-wider mr-2">Quick Tags:</span>
            {KB_TAGS.map((tag) => (
              <Link prefetch={false}
                key={tag.label}
                href={tag.href}
                className="text-xs px-3 py-1.5 rounded bg-gray-800/50 hover:bg-[#6366F1] hover:text-white border border-gray-700/50 text-gray-400 transition-all font-medium"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Copyright Bar (Pi7 style) */}
      <div className="bg-[#06090F] border-t border-gray-800 pb-8 sm:pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
            <p>&copy; 2026 SizeSnap.in. All rights reserved.</p>
            <div className="flex items-center flex-wrap gap-4 font-medium tracking-wide">
              <Link prefetch={false} href="/about" className="hover:text-gray-300 transition-colors">About Us</Link>
              <Link prefetch={false} href="/contact" className="hover:text-gray-300 transition-colors">Contact</Link>
              <Link prefetch={false} href="/privacy-policy" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <Link prefetch={false} href="/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
