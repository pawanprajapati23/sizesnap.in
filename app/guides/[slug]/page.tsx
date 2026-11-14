import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GUIDES_LIST, getGuideBySlug } from '@/data/guides';
import {
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  BookOpen,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface GuidePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return GUIDES_LIST.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: 'Guide Not Found | SizeSnap',
    };
  }

  return {
    title: guide.metaTitle,
    description: guide.metaDescription,
    alternates: {
      canonical: `https://www.sizesnap.in/guides/${guide.slug}`,
    },
    openGraph: {
      title: guide.metaTitle,
      description: guide.metaDescription,
      url: `https://www.sizesnap.in/guides/${guide.slug}`,
      type: 'article',
    },
  };
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const otherGuides = GUIDES_LIST.filter((g) => g.slug !== guide.slug);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: guide.title,
        alternativeHeadline: guide.hindiTitle,
        description: guide.metaDescription,
        author: {
          '@type': 'Organization',
          name: 'SizeSnap',
          url: 'https://www.sizesnap.in',
        },
        publisher: {
          '@type': 'Organization',
          name: 'SizeSnap',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.sizesnap.in/logo.png',
          },
        },
        mainEntityOfPage: `https://www.sizesnap.in/guides/${guide.slug}`,
      },
      {
        '@type': 'HowTo',
        name: guide.title,
        description: guide.summary,
        step: guide.howToSteps.map((stepText, idx) => ({
          '@type': 'HowToStep',
          position: idx + 1,
          name: `Step ${idx + 1}`,
          text: stepText,
        })),
      },
      {
        '@type': 'FAQPage',
        mainEntity: guide.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.sizesnap.in/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Guides',
            item: 'https://www.sizesnap.in/guides',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: guide.title,
            item: `https://www.sizesnap.in/guides/${guide.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link href="/guides" className="hover:text-[#414FA8] font-medium transition-colors">
            Guides Hub
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold truncate">{guide.badge}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Guide Article (8 cols) */}
          <article className="lg:col-span-8 space-y-6">
            {/* Hero Header Card */}
            <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded bg-[#EEF1FB] text-[#414FA8]">
                  {guide.category}
                </span>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  {guide.badge}
                </span>
                <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono ml-auto">
                  <Clock className="h-3 w-3" /> {guide.readTime}
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight leading-snug">
                {guide.hindiTitle}
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-[#414FA8]">
                {guide.title}
              </p>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {guide.summary}
              </p>

              {/* Primary CTA Box */}
              <div className="p-4 bg-[#EEF1FB] border border-[#9AA3C8]/50 rounded-[4px] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                    <Zap className="h-4 w-4 text-[#414FA8]" /> Ready to resize or compress right now?
                  </span>
                  <p className="text-[11px] text-gray-600">
                    100% Free, instant browser processing with zero watermarks.
                  </p>
                </div>
                <Link
                  href={guide.primaryToolHref}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-[4px] bg-[#414FA8] hover:bg-[#343f88] text-white text-xs font-bold shadow-xs transition-colors shrink-0"
                >
                  <span>{guide.primaryToolLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Official Spec Comparison Table */}
            <div className="bg-white p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                {guide.specTable.caption}
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-50 text-gray-800 font-bold">
                      {guide.specTable.headers.map((h, i) => (
                        <th key={i} className="p-3 border border-gray-200">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-700">
                    {guide.specTable.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-gray-50/60">
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className={`p-3 border border-gray-200 ${
                              cIdx === 0 ? 'font-semibold text-gray-900' : cIdx === 1 ? 'font-mono font-semibold text-[#414FA8]' : ''
                            }`}
                          >
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step-by-Step HowTo Box */}
            <div className="bg-white p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Step-by-Step Tarika (How to Do It in 30 Seconds)
              </h2>
              <ol className="space-y-3">
                {guide.howToSteps.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded border border-gray-100 text-xs sm:text-sm text-gray-700"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#414FA8] text-white text-xs font-bold font-mono">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Detailed Sections */}
            <div className="bg-white p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-6">
              {guide.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2.5">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    {sec.heading}
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {sec.body}
                  </p>
                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul className="space-y-1.5 pt-1 text-xs sm:text-sm text-gray-700">
                      {sec.bullets.map((b, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            {/* FAQs */}
            <div className="bg-white p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-[#414FA8]" /> Frequently Asked Questions (Sawal-Jawab)
              </h2>
              <div className="space-y-3">
                {guide.faqs.map((faq, idx) => (
                  <div key={idx} className="p-3.5 bg-gray-50 rounded border border-gray-100 space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">{faq.q}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </article>

          {/* Right Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-4">
            {/* Related Tools Card */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#414FA8]">
                Related 1-Click Tools
              </h3>
              <div className="space-y-1.5">
                <Link
                  href={guide.primaryToolHref}
                  className="p-2.5 rounded bg-[#414FA8] text-white text-xs font-bold flex items-center justify-between shadow-2xs"
                >
                  <span>{guide.primaryToolLabel}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                {guide.secondaryTools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="p-2 rounded bg-gray-50 hover:bg-[#EEF1FB] hover:text-[#414FA8] text-xs font-medium text-gray-700 flex items-center justify-between transition-colors"
                  >
                    <span>{tool.label}</span>
                    <ArrowRight className="h-3 w-3 text-gray-400" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Other Guides Card */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-[#414FA8]" /> More Hindi &amp; English Guides
              </h3>
              <div className="space-y-2">
                {otherGuides.map((other) => (
                  <Link
                    key={other.slug}
                    href={`/guides/${other.slug}`}
                    className="block p-2.5 rounded bg-gray-50 hover:bg-[#EEF1FB] border border-gray-100 transition-colors group"
                  >
                    <div className="text-xs font-bold text-gray-800 group-hover:text-[#414FA8] line-clamp-2">
                      {other.hindiTitle}
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">
                      {other.title}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Privacy Note */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200 text-xs text-gray-600 space-y-1.5">
              <div className="flex items-center gap-1.5 font-bold text-gray-800">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>100% Client-Side Privacy</span>
              </div>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                All SizeSnap tools process your photos, signatures, and marksheet PDFs directly inside your browser. Zero server uploads.
              </p>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
