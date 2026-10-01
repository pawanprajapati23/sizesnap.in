import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { KbCompressor } from '@/components/tool-ui/KbCompressor';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, Lock, Zap, Shield, HelpCircle } from 'lucide-react';
import { RelatedTools } from '@/components/RelatedTools';

interface FaqItem {
  q: string;
  a: string;
}

interface ExactKbPageProps {
  targetKb: number;
  title: string;
  description: string;
  breadcrumbs: { name: string; url: string }[];
  relatedSlugs: string[];
  faqs: FaqItem[];
  articleHtml?: React.ReactNode;
}

export function ExactKbPage({
  targetKb,
  title,
  description,
  breadcrumbs,
  relatedSlugs,
  faqs,
  articleHtml
}: ExactKbPageProps) {
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

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
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
                <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                  {title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                  {description}
                </p>

                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                    <Lock className="h-3 w-3" /> 100% Secure
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">
                    <Zap className="h-3 w-3" /> Local Processing
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded">
                    <Shield className="h-3 w-3" /> No Watermark
                  </div>
                </div>
              </div>

              {/* Tool core */}
              <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <KbCompressor initialTargetKb={targetKb} />
              </div>

              {/* Dynamic Article Section */}
              {articleHtml && (
                <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-[#414FA8]">
                  {articleHtml}
                </div>
              )}

              {/* FAQ Section */}
              {faqs && faqs.length > 0 && (
                <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="h-4 w-4 text-[#414FA8]" />
                    <h2 className="text-sm sm:text-base font-bold text-gray-900">FAQs</h2>
                  </div>
                  <div className="space-y-3.5">
                    {faqs.map((faq, idx) => (
                      <div key={idx} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">{faq.q}</h3>
                        <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <RelatedTools category="Compress" currentSlug={`compress-image-to-${targetKb}kb`} />
            </div>

            <div className="w-full lg:col-span-4 xl:col-span-3">
              <Sidebar />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
