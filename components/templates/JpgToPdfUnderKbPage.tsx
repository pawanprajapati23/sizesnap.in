import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { ImageToPdfConverter } from '@/components/tool-ui/ImageToPdfConverter';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, Lock, Zap, Shield, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';
import { RelatedTools } from '@/components/RelatedTools';
import AdsterraAd from '@/components/AdsterraAd';

interface FaqItem {
  q: string;
  a: string;
}

interface JpgToPdfUnderKbPageProps {
  targetKb: number;
  title: string;
  description: string;
  breadcrumbs: { name: string; url: string }[];
  relatedSlugs: string[];
  faqs: FaqItem[];
  articleHtml?: React.ReactNode;
}

export function JpgToPdfUnderKbPage({
  targetKb,
  title,
  description,
  breadcrumbs,
  relatedSlugs,
  faqs,
  articleHtml,
}: JpgToPdfUnderKbPageProps) {
  const relatedTools = ALL_TOOLS.filter((t) => relatedSlugs.includes(t.slug));

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: title,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '2860',
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `https://www.sizesnap.in${crumb.url}`,
    })),
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Convert JPG to PDF Under ${targetKb} KB Online Free`,
    description: `Step-by-step instructions to convert your JPG/JPEG images, marksheets, and certificates into a single PDF strictly under ${targetKb} KB.`,
    step: [
      {
        '@type': 'HowToStep',
        name: 'Upload JPG / JPEG Photos',
        text: 'Select or drag-and-drop one or multiple JPG, PNG, or scanned document images.',
        position: 1,
      },
      {
        '@type': 'HowToStep',
        name: `Set Size Limit Under ${targetKb} KB`,
        text: `Target size is pre-configured to strictly under ${targetKb} KB. Customize page size (A4 / Letter) or margins if needed.`,
        position: 2,
      },
      {
        '@type': 'HowToStep',
        name: 'Convert & Download PDF',
        text: `Click Convert to PDF. Your PDF is generated locally in your browser strictly under ${targetKb} KB without uploading to any server.`,
        position: 3,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />

        <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="h-3 w-3 text-gray-400" />}
                {idx < breadcrumbs.length - 1 ? (
                  <Link href={crumb.url} className="hover:text-[#414FA8] font-medium transition-colors">
                    {crumb.name}
                  </Link>
                ) : (
                  <span className="text-gray-800 font-semibold">{crumb.name}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">

              {/* Header section */}
              <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-[#EEF1FB] text-[#414FA8] border border-[#9AA3C8]/40 rounded">
                    Under {targetKb} KB PDF Tool
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                    100% Client-Side Privacy
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                  {title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                  {description}
                </p>

                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                    <Lock className="h-3 w-3" /> Zero Server Uploads
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">
                    <Zap className="h-3 w-3" /> Strictly Under {targetKb} KB
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded">
                    <Shield className="h-3 w-3" /> Crisp Text Quality
                  </div>
                </div>
              </div>

              {/* Tool core */}
              <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <ImageToPdfConverter initialTargetMaxKb={targetKb} />
              </div>

              {/* Quick KB Switcher */}
              <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-2">
                  Convert JPG to PDF by Exact KB Limits:
                </h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  {[
                    { label: 'JPG to PDF Under 100 KB', href: '/tools/jpg-to-pdf-under-100kb', kb: 100 },
                    { label: 'JPG to PDF Under 150 KB', href: '/tools/jpg-to-pdf-under-150kb', kb: 150 },
                    { label: 'JPG to PDF Under 200 KB', href: '/tools/jpg-to-pdf-under-200kb', kb: 200 },
                    { label: 'JPG to PDF Under 500 KB', href: '/tools/jpg-to-pdf-under-500kb', kb: 500 },
                    { label: 'Compress PDF', href: '/tools/compress-pdf', kb: 0 },
                    { label: 'Document Scanner', href: '/tools/document-scanner', kb: 0 },
                  ].map((btn) => (
                    <Link
                      key={btn.label}
                      href={btn.href}
                      className={`px-3 py-1.5 rounded-[4px] transition-colors border font-medium ${
                        btn.kb === targetKb
                          ? 'bg-[#414FA8] text-white border-[#414FA8] shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-[#EEF1FB] hover:border-[#414FA8] hover:text-[#414FA8]'
                      }`}
                    >
                      {btn.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* In-content Ad */}
              <div className="my-6">
                <AdsterraAd dataKey="3bd154ece61c60859c2b8242ae85b927" width={728} height={90} className="w-full hidden md:flex" />
                <AdsterraAd dataKey="f509bd7d24a58ce7a176067713ca61df" width={320} height={50} className="w-full md:hidden flex" />
              </div>

              {/* Detailed Article Section */}
              {articleHtml && (
                <article className="bg-white p-5 sm:p-7 rounded-[4px] border border-gray-200 shadow-xs text-gray-700 text-xs sm:text-sm leading-relaxed space-y-4">
                  {articleHtml}
                </article>
              )}

              {/* FAQ Section */}
              <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-base sm:text-lg font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-[#414FA8]" />
                  Frequently Asked Questions
                </h2>
                <div className="divide-y divide-gray-100">
                  {faqs.map((faq, i) => (
                    <div key={i} className="py-3.5 first:pt-0 last:pb-0">
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">
                        {faq.q}
                      </h3>
                      <p className="text-xs text-gray-600 leading-normal">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Tools Grid */}
              <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-sm font-bold text-gray-800 mb-3">
                  Related Online PDF & Image Tools
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {relatedTools.map((t) => (
                    <ToolButton key={t.id} tool={t} />
                  ))}
                </div>
              </div>

            </div>

            {/* Sidebar */}
            <div className="w-full lg:col-span-4 xl:col-span-3 space-y-6">
              <Sidebar />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
