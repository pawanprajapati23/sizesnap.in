'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Zap, 
  Lock, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  Heart
} from 'lucide-react';

const KB_TAGS = [
  { label: '10 KB', href: '/tools/reduce-image-size-in-kb?target=10' },
  { label: '12 KB (Top)', href: '/tools/reduce-image-size-in-kb?target=12' },
  { label: '13 KB', href: '/tools/reduce-image-size-in-kb?target=13' },
  { label: '14 KB', href: '/tools/reduce-image-size-in-kb?target=14' },
  { label: '15 KB', href: '/tools/reduce-image-size-in-kb?target=15' },
  { label: '20 KB (SSC/Govt)', href: '/tools/reduce-image-size-in-kb?target=20' },
  { label: '25 KB', href: '/tools/reduce-image-size-in-kb?target=25' },
  { label: '28 KB', href: '/tools/reduce-image-size-in-kb?target=28' },
  { label: '30 KB (Sign)', href: '/tools/reduce-image-size-in-kb?target=30' },
  { label: '50 KB (Max Govt)', href: '/tools/reduce-image-size-in-kb?target=50' },
  { label: '100 KB', href: '/tools/reduce-image-size-in-kb?target=100' },
  { label: '140 KB', href: '/tools/reduce-image-size-in-kb?target=140' },
  { label: '200 KB', href: '/tools/reduce-image-size-in-kb?target=200' },
  { label: '300 KB (UPSC)', href: '/tools/reduce-image-size-in-kb?target=300' },
  { label: 'PDF 100 KB', href: '/tools/compress-pdf?target=100' },
  { label: 'PDF 200 KB', href: '/tools/compress-pdf?target=200' },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-white border-t border-gray-200">
      {/* 1. Value Proposition & Trust Badges Strip */}
      <div className="border-b border-gray-200 bg-[#FAFAFC] py-6 sm:py-8">
        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-start gap-3.5 p-3 rounded bg-white border border-gray-100 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Lightning In-Browser Speed</p>
                <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">
                  Local WebAssembly &amp; canvas engines resize files in under 100ms.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded bg-white border border-gray-100 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-emerald-50 text-emerald-600 shrink-0">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">100% Client-Side Privacy</p>
                <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">
                  Your ID, photo, and signature NEVER upload to external servers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded bg-white border border-gray-100 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-amber-50 text-amber-600 shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">No Watermark &bull; 100% Free</p>
                <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">
                  Clean official output ready for Sarkari portals without branding stamps.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3 rounded bg-white border border-gray-100 shadow-2xs">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-indigo-50 text-indigo-700 shrink-0">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Govt Portal Standards</p>
                <p className="text-[11px] text-gray-500 leading-relaxed mt-0.5">
                  Built to prevent photo/signature rejections on SSC, UPSC &amp; Police portals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Mega Multi-Column Directory */}
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand Info & Mission */}
          <div className="col-span-2 lg:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative flex h-8 w-8 items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="SizeSnap Logo"
                  width={30}
                  height={30}
                  className="h-full w-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-[22px] font-bold tracking-tight text-gray-900">
                sizesnap
              </span>
            </Link>
            <p className="text-xs text-gray-600 leading-relaxed">
              India&apos;s fastest precision image resizer, compressor and document scanner tool for government examinations, cyber cafes, and daily professional workflow.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Zero Cloud Storage Guarantee
              </span>
            </div>
          </div>

          {/* Col 1: Govt Exam Presets */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2 flex items-center justify-between">
              <span>Govt Exams Hub</span>
              <span className="text-[9px] bg-indigo-50 text-[#414FA8] font-bold px-1.5 py-0.5 rounded">
                NEW
              </span>
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link href="/exams/ssc-photo-signature-resizer" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  SSC CGL / CHSL / GD (20-50 KB)
                </Link>
              </li>
              <li>
                <Link href="/exams/upsc-photo-signature-resizer" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  UPSC OTR 10-Day (Name &amp; Date)
                </Link>
              </li>
              <li>
                <Link href="/exams/delhi-police-photo-resizer" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  Delhi Police Constable / SI
                </Link>
              </li>
              <li>
                <Link href="/exams/up-police-photo-resizer" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  UP Police Bharti (Black Ink Sign)
                </Link>
              </li>
              <li>
                <Link href="/exams/ibps-bank-photo-signature-resizer" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  IBPS Bank PO / Clerk / LTI
                </Link>
              </li>
              <li className="pt-1">
                <Link href="/exams" className="text-[#414FA8] font-semibold flex items-center gap-1 hover:underline">
                  <span>Explore All Exam Specs</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Compress by Exact KB */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2">
              Compress to Exact KB
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link href="/tools/reduce-image-size-in-kb?target=10" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  Reduce Image to 10 KB
                </Link>
              </li>
              <li>
                <Link href="/tools/reduce-image-size-in-kb?target=12" className="hover:text-[#414FA8] hover:underline transition-colors block font-medium text-gray-900">
                  Reduce Image to 12 KB (Top)
                </Link>
              </li>
              <li>
                <Link href="/tools/reduce-image-size-in-kb?target=14" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  Reduce Image to 14 KB
                </Link>
              </li>
              <li>
                <Link href="/tools/reduce-image-size-in-kb?target=20" className="hover:text-[#414FA8] hover:underline transition-colors block font-medium text-gray-900">
                  Reduce Image to 20 KB (Govt)
                </Link>
              </li>
              <li>
                <Link href="/tools/reduce-image-size-in-kb?target=30" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  Reduce Image to 30 KB (Sign)
                </Link>
              </li>
              <li>
                <Link href="/tools/reduce-image-size-in-kb?target=50" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  Reduce Image to 50 KB
                </Link>
              </li>
              <li>
                <Link href="/tools/reduce-image-size-in-kb?target=100" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  Reduce Image to 100 KB
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Utilities */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2">
              Tools &amp; Utilities
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link href="/tools/passport-photo-maker" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  Passport Size Photo Maker
                </Link>
              </li>
              <li>
                <Link href="/tools/resize-signature" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  Online Signature Resizer
                </Link>
              </li>
              <li>
                <Link href="/tools/black-and-white" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  Document Scanner &amp; B&amp;W Filter
                </Link>
              </li>
              <li>
                <Link href="/tools/square-crop" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  WhatsApp DP Square Crop (1:1)
                </Link>
              </li>
              <li>
                <Link href="/tools/compress-pdf" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  Compress PDF in KB
                </Link>
              </li>
              <li>
                <Link href="/tools/bulk-resize" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  Bulk Image Resizer
                </Link>
              </li>
              <li>
                <Link href="/tools/image-to-pdf" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  Image to PDF Maker
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: SizeSnap & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 border-b border-gray-100 pb-2">
              About &amp; Trust
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li>
                <Link href="/about" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  About SizeSnap
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  Privacy Policy (Client-Side)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-[#414FA8] hover:underline transition-colors block">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/#directory" className="hover:text-[#414FA8] hover:underline transition-colors block font-medium text-indigo-700">
                  Full Tool Directory &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Interactive Target KB Cloud (Internal Linking Engine) */}
        <div className="mt-10 pt-8 border-t border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">
              Popular File Size Targets &bull; 1-Click Fast Navigation:
            </span>
            <span className="text-[11px] text-gray-400">
              Pre-configured target sliders for zero guesswork
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {KB_TAGS.map((tag) => (
              <Link
                key={tag.label}
                href={tag.href}
                className="text-xs px-2.5 py-1 rounded-[3px] bg-gray-50 border border-gray-200 text-gray-700 hover:text-[#414FA8] hover:border-[#414FA8] hover:bg-[#EEF1FB] transition-all font-medium"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </div>

        {/* 4. Disclaimer Note for Cyber Cafes & Candidates */}
        <div className="mt-8 p-3.5 rounded bg-indigo-50/50 border border-indigo-100/70 text-[11px] text-gray-600 leading-relaxed">
          <strong className="text-gray-800 font-semibold">Important Notice for Cyber Cafes &amp; Applicants:</strong>{' '}
          SizeSnap is an independent client-side utility built for precision document sizing. All image rendering and compression takes place inside your browser memory using the HTML5 Canvas API. We do not transmit or store candidate photos, signatures, or biometric records on any web server. Always verify final file details against the official recruitment notification before submitting.
        </div>

        {/* 5. Copyright Bar */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3">
          <p>&copy; {new Date().getFullYear()} SizeSnap. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
            <span>Crafted with</span>
            <Heart className="h-3 w-3 text-red-500 fill-current" />
            <span>for Indian students, cyber cafes &amp; job seekers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
