import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EXAM_PRESETS } from '@/data/exam-presets';
import {
  FileCheck,
  ChevronRight,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Award,
  Layers,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Indian Govt Exam Photo & Signature Resizer Hub (SSC, UPSC, Police, Bank) | SizeSnap',
  description:
    'Free 1-click photo and signature resizer for all Indian government exams. Exact 20KB-50KB limits, 3.5x4.5cm dimensions, and Name & Date (DOP) stamping for SSC CGL, UPSC OTR, Delhi Police, UP Police, and IBPS.',
  alternates: {
    canonical: 'https://sizesnap.in/exams',
  },
  openGraph: {
    title: 'Indian Govt Exam Photo & Signature Resizer Hub | SizeSnap',
    description:
      'Official dimension presets for SSC, UPSC, Delhi Police, UP Police, and Banking exams. 100% free, private in browser.',
    url: 'https://sizesnap.in/exams',
  },
};

export default function ExamsHubPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">Government Exam Presets</span>
        </nav>

        {/* Hero Header */}
        <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs relative overflow-hidden">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EEF1FB] text-[#414FA8] text-xs font-bold uppercase tracking-wider">
              <Award className="h-3.5 w-3.5" />
              <span>Official Recruitment Specifications 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#333333] tracking-tight">
              Indian Govt Exam Photo &amp; Signature Resizer Hub
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Every month, thousands of SSC, UPSC, and State Police job application forms get rejected due to incorrect photo dimensions, blurry signatures, or missing Date of Photo (DOP). SizeSnap provides 1-click official presets guaranteed to pass online portal validation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-100 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Zero Rejection Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Name &amp; Date (DOP) Stamp Generator</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>100% In-Browser Privacy</span>
            </div>
          </div>
        </div>

        {/* 1-Click Multi-Document Exam Kit Banner */}
        <div className="bg-gradient-to-r from-[#1E293B] via-[#0F172A] to-[#1E293B] text-white p-6 sm:p-7 rounded-[4px] border border-slate-700 shadow-md relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
                <Sparkles className="h-3.5 w-3.5" />
                <span>New Multi-Document Suite</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                1-Click Multi-Document Exam Application Kit
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Resize your <strong>Photo, Signature, and Left Thumb Impression</strong> together in a single window. No need to visit separate pages. Official portal dimensions with individual 1-click downloads.
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href="/exams/exam-application-kit"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-[4px] bg-[#414FA8] hover:bg-[#34408A] text-white text-xs sm:text-sm font-bold shadow-lg transition-all"
              >
                <span>Open Multi-Document Kit</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Exam Cards Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Layers className="h-5 w-5 text-[#414FA8]" /> Select Your Target Examination
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              {EXAM_PRESETS.length} Official Presets Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {EXAM_PRESETS.map((exam) => (
              <div
                key={exam.id}
                className="bg-white rounded-[4px] border border-gray-200 hover:border-[#414FA8] hover:shadow-md transition-all flex flex-col justify-between group p-5"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[#EEF1FB] text-[#414FA8]">
                      {exam.badge}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {exam.documents.length} Formats
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#414FA8] transition-colors">
                      {exam.name}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">
                      {exam.authority}
                    </p>
                  </div>

                  <p className="text-xs text-gray-600 leading-normal line-clamp-2">
                    {exam.summary}
                  </p>

                  {/* Documents Summary Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exam.documents.map((doc) => (
                      <span
                        key={doc.id}
                        className="text-[10px] bg-gray-50 border border-gray-200 text-gray-700 px-2 py-0.5 rounded font-mono"
                      >
                        {doc.title}: {doc.minKb}-{doc.maxKb}KB
                      </span>
                    ))}
                  </div>

                  {/* Popular For */}
                  <div className="text-[11px] text-gray-500 pt-2 border-t border-gray-100">
                    <span className="font-semibold text-gray-700">Covers:</span>{' '}
                    {exam.popularFor.join(', ')}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-gray-100">
                  <Link
                    href={`/exams/${exam.slug}`}
                    className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 bg-[#414FA8] group-hover:bg-[#343f88] text-white text-xs font-semibold rounded-[4px] shadow-xs transition-colors"
                  >
                    <span>Open {exam.shortTitle} Resizer</span>
                    <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Official Dimension Reference Table */}
        <div className="bg-white p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900">
            Quick Reference: India Govt Exam Photo &amp; Signature Dimensions (2026)
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700 border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-800 font-bold">
                  <th className="py-2.5 px-3">Exam Board</th>
                  <th className="py-2.5 px-3">Photo Dimensions</th>
                  <th className="py-2.5 px-3">Photo File Size</th>
                  <th className="py-2.5 px-3">Signature Specs</th>
                  <th className="py-2.5 px-3">Special Requirement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 font-semibold text-gray-900">SSC (CGL, CHSL, GD)</td>
                  <td className="py-2.5 px-3 font-mono">3.5 × 4.5 cm (350×450 px)</td>
                  <td className="py-2.5 px-3 font-semibold text-[#414FA8]">20 KB – 50 KB</td>
                  <td className="py-2.5 px-3 font-mono">4.0 × 2.0 cm (10–20 KB)</td>
                  <td className="py-2.5 px-3 text-gray-500">No cap or dark spectacles</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 font-semibold text-gray-900">UPSC (CSE, NDA, CDS)</td>
                  <td className="py-2.5 px-3 font-mono">350×350 to 1000×1000 px</td>
                  <td className="py-2.5 px-3 font-semibold text-[#414FA8]">20 KB – 300 KB</td>
                  <td className="py-2.5 px-3 font-mono">350×350 min (20–300 KB)</td>
                  <td className="py-2.5 px-3 text-amber-700 font-medium">Name &amp; Date within 10 days</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 font-semibold text-gray-900">Delhi Police Constable</td>
                  <td className="py-2.5 px-3 font-mono">3.5 × 4.5 cm (350×450 px)</td>
                  <td className="py-2.5 px-3 font-semibold text-[#414FA8]">20 KB – 50 KB</td>
                  <td className="py-2.5 px-3 font-mono">4.0 × 2.0 cm (10–20 KB)</td>
                  <td className="py-2.5 px-3 text-gray-500">Pure white background</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 font-semibold text-gray-900">UP Police Bharti</td>
                  <td className="py-2.5 px-3 font-mono">35 × 45 mm (350×450 px)</td>
                  <td className="py-2.5 px-3 font-semibold text-[#414FA8]">20 KB – 50 KB</td>
                  <td className="py-2.5 px-3 font-mono">3.5 × 1.5 cm (5–20 KB)</td>
                  <td className="py-2.5 px-3 text-gray-500">Strictly black ink signature</td>
                </tr>
                <tr className="hover:bg-gray-50/50">
                  <td className="py-2.5 px-3 font-semibold text-gray-900">IBPS / SBI Banking</td>
                  <td className="py-2.5 px-3 font-mono">200 × 230 px</td>
                  <td className="py-2.5 px-3 font-semibold text-[#414FA8]">20 KB – 50 KB</td>
                  <td className="py-2.5 px-3 font-mono">140 × 60 px (10–20 KB)</td>
                  <td className="py-2.5 px-3 text-gray-500">Thumb (20-50KB) &amp; Decl (50-100KB)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Common FAQs */}
        <div className="bg-white p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-[#414FA8]" /> Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-gray-50 rounded border border-gray-100 space-y-1">
              <h3 className="font-bold text-gray-800">
                Can I resize my signature on mobile phone?
              </h3>
              <p className="text-gray-600">
                Yes! SizeSnap runs 100% locally in your mobile browser. Simply take a photo of your signature with your phone camera, upload it here, and our tool auto-crops and compresses it to the exact 10KB-20KB limit.
              </p>
            </div>
            <div className="p-3 bg-gray-50 rounded border border-gray-100 space-y-1">
              <h3 className="font-bold text-gray-800">
                How does SizeSnap add Name &amp; Date of Photo (DOP)?
              </h3>
              <p className="text-gray-600">
                Our tool draws a crisp white bar across the bottom 20% of your photograph and writes your full name and date in bold black uppercase text, meeting official UPSC OTR and State Commission norms.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className || 'h-4 w-4'}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
