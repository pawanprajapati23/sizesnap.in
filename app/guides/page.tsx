import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GUIDES_LIST } from '@/data/guides';
import {
  BookOpen,
  ChevronRight,
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle2,
  Award,
  FileText,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Exam Photo, Signature & Exact KB Compression Guides (Hindi & English) | SizeSnap',
  description:
    'Step-by-step Hindi, Hinglish, and English tutorials on how to resize photos to 20KB-50KB, add Name & Date (DOP) for SSC/UPSC/NEET, resize signatures to 10KB-20KB, and compress PDFs under 100KB-200KB.',
  alternates: {
    canonical: 'https://www.sizesnap.in/guides',
  },
  openGraph: {
    title: 'Exam Photo, Signature & Exact KB Compression Guides | SizeSnap',
    description:
      'Complete English & Hinglish guides for SSC, UPSC, IBPS, Railway, NEET, PAN Card, and exact KB photo/PDF compression.',
    url: 'https://www.sizesnap.in/guides',
    type: 'website',
  },
};

export default function GuidesHubPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'SizeSnap Exam Photo, Signature & Compression Guides Hub',
    url: 'https://www.sizesnap.in/guides',
    description:
      'Bilingual (English and Hinglish) tutorials and official specification guides for Indian government exam photo resizing, signature compression, and PDF optimization.',
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: [
        ...GUIDES_LIST.map((g, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          name: g.title,
          url: `https://www.sizesnap.in/guides/${g.slug}`,
        })),
        {
          '@type': 'ListItem',
          position: GUIDES_LIST.length + 1,
          name: 'How to Compress an Image Without Losing Quality',
          url: 'https://www.sizesnap.in/guides/how-to-compress-image',
        },
      ],
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">Guides &amp; Tutorials Hub</span>
        </nav>

        {/* Hero Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EEF1FB] text-[#414FA8] text-xs font-bold uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5" />
            <span>English + Hinglish Step-by-Step Tutorials</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Govt Exam Photo, Signature &amp; Exact-KB Guides Hub
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 max-w-3xl leading-relaxed">
            Whether you want to know <strong>&ldquo;Mobile se photo ka size 20KB kaise kare&rdquo;</strong>, how to add <strong>Name &amp; Date (DOP)</strong> for UPSC/NEET, or how to shrink a marksheet PDF under <strong>100KB–140KB</strong> without blurring—each guide below combines official 2026 portal rules with 1-click tools.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-gray-100 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Official 2026 Portal Specifications</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Easy Hindi / Hinglish + English Steps</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Direct 1-Click Tool Launchers</span>
            </div>
          </div>
        </div>

        {/* Featured Bilingual Guides Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#414FA8]" /> High-Demand Exam &amp; KB Tutorials
            </h2>
            <span className="text-xs text-gray-500 font-medium">
              {GUIDES_LIST.length + 1} Comprehensive Guides
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {GUIDES_LIST.map((guide) => (
              <div
                key={guide.slug}
                className="bg-white rounded-[4px] border border-gray-200 hover:border-[#414FA8] hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#EEF1FB] text-[#414FA8]">
                      {guide.badge}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                      <Clock className="h-3 w-3" /> {guide.readTime}
                    </span>
                  </div>

                  <Link href={`/guides/${guide.slug}`} className="block group">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#414FA8] transition-colors leading-snug">
                      {guide.hindiTitle}
                    </h3>
                    <p className="text-xs font-medium text-gray-500 mt-0.5">
                      {guide.title}
                    </p>
                  </Link>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {guide.summary}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                  <Link
                    href={`/guides/${guide.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#414FA8] hover:underline"
                  >
                    <span>Read Full Guide</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>

                  <Link
                    href={guide.primaryToolHref}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-900 hover:bg-[#414FA8] text-white text-[11px] font-semibold transition-colors"
                  >
                    <span>{guide.primaryToolLabel}</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}

            {/* Existing Core Compression Guide */}
            <div className="bg-white rounded-[4px] border border-gray-200 hover:border-[#414FA8] hover:shadow-md transition-all p-5 sm:p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Fundamentals
                  </span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                    <Clock className="h-3 w-3" /> 3 min read
                  </span>
                </div>

                <Link href="/guides/how-to-compress-image" className="block group">
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#414FA8] transition-colors leading-snug">
                    How to Compress an Image Without Losing Quality
                  </h3>
                  <p className="text-xs font-medium text-gray-500 mt-0.5">
                    Understanding JPEG, PNG, and WebP Lossy vs. Lossless Optimization
                  </p>
                </Link>

                <p className="text-xs text-gray-600 leading-relaxed">
                  Discover the best quality settings, pixel dimensions, and formats to shrink images by up to 80% for websites, email attachments, and online portals while preserving crisp text and facial details.
                </p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <Link
                  href="/guides/how-to-compress-image"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#414FA8] hover:underline"
                >
                  <span>Read Full Guide</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href="/tools/compress-image"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-900 hover:bg-[#414FA8] text-white text-[11px] font-semibold transition-colors"
                >
                  <span>Open Image Compressor</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Direct Exam Resizer Quick Hub */}
        <div className="bg-white p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <Award className="h-5 w-5 text-[#414FA8]" /> Direct 1-Click Government Exam Resizers
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Jump straight to pre-configured photo, signature, thumb &amp; declaration presets:
              </p>
            </div>
            <Link
              href="/exams"
              className="inline-flex items-center gap-1 text-xs font-bold text-[#414FA8] hover:underline"
            >
              <span>View All 13+ Exam Boards</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs">
            {[
              { label: 'SSC CGL / CHSL / GD', href: '/exams/ssc-photo-signature-resizer' },
              { label: 'UPSC CSE / NDA / OTR', href: '/exams/upsc-photo-signature-resizer' },
              { label: 'IBPS & SBI Bank 4-in-1', href: '/exams/ibps-bank-photo-signature-resizer' },
              { label: 'Railway RRB (30-70KB)', href: '/exams/rrb-railway-photo-signature-resizer' },
              { label: 'NEET UG & JEE Main', href: '/exams/neet-jee-photo-signature-resizer' },
              { label: 'UP Police Bharti', href: '/exams/up-police-photo-resizer' },
              { label: 'Bihar BPSC & Police', href: '/exams/bihar-bpsc-police-photo-signature-resizer' },
              { label: 'Rajasthan SSO / REET', href: '/exams/rajasthan-rsmssb-reet-photo-signature-resizer' },
              { label: 'MPESB (Vyapam) MP', href: '/exams/mpesb-mp-police-photo-signature-resizer' },
              { label: 'India Post GDS', href: '/exams/india-post-gds-photo-signature-resizer' },
              { label: 'GATE & IIT JAM', href: '/exams/gate-iit-jam-photo-signature-resizer' },
              { label: 'PAN Card NSDL & UTI', href: '/exams/pan-card-nsdl-uti-photo-signature-resizer' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="p-2.5 rounded border border-gray-200 bg-gray-50/70 hover:bg-[#EEF1FB] hover:border-[#414FA8] hover:text-[#414FA8] font-semibold text-gray-700 flex items-center justify-between transition-colors"
              >
                <span className="truncate">{item.label}</span>
                <FileText className="h-3.5 w-3.5 shrink-0 opacity-60" />
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
