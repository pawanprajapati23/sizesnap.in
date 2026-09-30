import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { KbCompressor } from '@/components/tool-ui/KbCompressor';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, Lock, Zap, Shield, HelpCircle } from 'lucide-react';

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

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: crumb.name,
      item: crumb.url,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />

        <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
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
              <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                  {title}
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                  {description}
                </p>
              </div>

              <React.Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Loading SizeSnap Compressor...</div>}>
                <KbCompressor initialTargetKb={targetKb} />
              </React.Suspense>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-[4px] border border-gray-200 text-xs text-gray-700">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0"><Lock className="h-3.5 w-3.5" /></div>
                  <div><span className="font-semibold block text-gray-800">100% Secure</span><span className="text-[11px] text-gray-500">Files stay on device</span></div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0"><Zap className="h-3.5 w-3.5" /></div>
                  <div><span className="font-semibold block text-gray-800">Fast Process</span><span className="text-[11px] text-gray-500">WASM accelerated</span></div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0"><Shield className="h-3.5 w-3.5" /></div>
                  <div><span className="font-semibold block text-gray-800">Exam Ready</span><span className="text-[11px] text-gray-500">Fits SSC/UPSC specs</span></div>
                </div>
              </div>

              {relatedTools.length > 0 && (
                <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
                  <h2 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                    Related Tools
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                    {relatedTools.map((relTool) => <ToolButton key={relTool.id} tool={relTool} />)}
                  </div>
                </div>
              )}

              {articleHtml && (
                <article className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs text-gray-700">
                  {articleHtml}
                </article>
              )}

              {faqs && faqs.length > 0 && (
                <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
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
