import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { IdCardMergerTool } from '@/components/tool-ui/IdCardMergerTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, ShieldCheck, CreditCard, FileText, Printer } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Aadhaar & ID Card Front and Back Merger on 1 Page (JPG / PDF <100KB) | SizeSnap',
  description:
    'Combine Aadhaar Card, PAN Card, Voter ID, or Driving License Front and Back side photos onto a single A4 page or compact JPG/PDF under 50KB, 100KB, or 200KB. 100% private in-browser tool.',
  keywords: [
    'aadhaar card front and back merge on one page',
    'id card front back joiner online',
    'combine front and back image of aadhar card in one pdf under 100kb',
    'voter id front and back merger',
    'pan card front back joiner',
    'aadhar card both side on single page a4 print',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/id-card-front-back-merger',
  },
  openGraph: {
    title: 'Aadhaar & ID Card Front and Back Merger on Single Page | SizeSnap',
    description:
      'Merge Front and Back photos of Aadhaar, PAN, or Voter ID into one JPG or PDF under 100KB/200KB locally in your browser.',
    url: 'https://www.sizesnap.in/tools/id-card-front-back-merger',
  },
};

const RELATED_SLUGS = [
  'photo-and-signature-joiner',
  'pan-card-photo-resizer',
  'compress-pdf-140kb',
  'jpg-to-pdf-under-150kb',
  'cyber-cafe-passport-photo-maker',
  'remove-shadow-from-document',
];

const FAQS = [
  {
    q: 'How do I combine Aadhaar Card Front and Back side into one single JPG or PDF?',
    a: 'Upload your Front Side image in Box 1 and Back Side image in Box 2. Select your layout (Top & Bottom Compact for online form uploads, or A4 Page for printing), choose JPG or PDF output, pick your target KB size (e.g., 100 KB or 200 KB), and click Merge.',
  },
  {
    q: 'Is it safe to merge my Aadhaar Card or PAN Card on SizeSnap?',
    a: 'Yes, 100% safe. SizeSnap processes your ID card photos strictly inside your web browser using HTML5 Canvas and client-side PDF generation. Your Aadhaar or PAN card images are never uploaded to any server or cloud storage.',
  },
  {
    q: 'What file size limit is required for ID proof uploads in SSC, UPSC, and Bank forms?',
    a: 'Most Indian government recruitment and KYC portals require both sides of your identity card combined into a single JPG (between 20KB and 100KB) or a single-page PDF (under 150KB or 200KB). You can lock 50 KB, 100 KB, 150 KB, or 200 KB with one click.',
  },
  {
    q: 'Can cyber cafes print both sides of an Aadhaar card on a single A4 paper?',
    a: 'Yes! Select the "A4 Page (True ID Size for Xerox/Print)" layout option and click the "Print A4 Sheet" button to print both Front and Back at standard CR80 ID card dimensions on a single sheet.',
  },
];

export default function IdCardFrontBackMergerPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Aadhaar & ID Card Front and Back Merger Online',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        url: 'https://www.sizesnap.in/tools/id-card-front-back-merger',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />

        <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <Link href="/exam-tools" className="hover:text-[#414FA8] font-medium transition-colors">
              Exam &amp; ID Tools
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span className="text-gray-800 font-semibold">ID Card Front &amp; Back Merger</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
              {/* Hero Header */}
              <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 rounded">
                    100% Private Local KYC Utility
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#EEF1FB] text-[#414FA8] rounded">
                    JPG &amp; PDF Under 100KB / 200KB
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                  Aadhaar &amp; ID Card Front and Back Merger on Single Page
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                  Combine <strong>Front and Back side photos</strong> of your Aadhaar Card, PAN Card, Voter ID, or Driving License onto a single page. Export as a crisp <strong>JPG or PDF under 50KB, 100KB, or 200KB</strong> for government forms, bank KYC, or A4 cyber-cafe printing.
                </p>
              </div>

              {/* Interactive Tool */}
              <IdCardMergerTool />

              {/* Feature Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-[4px] border border-gray-200 text-xs text-gray-700">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-emerald-50 text-emerald-700 shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-gray-900">Zero Server Upload</span>
                    <span className="text-[11px] text-gray-500">ID cards stay 100% on your device</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-gray-900">JPG or PDF Export</span>
                    <span className="text-[11px] text-gray-500">Locked under 50KB, 100KB or 200KB</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-amber-50 text-amber-700 shrink-0">
                    <Printer className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold block text-gray-900">A4 Print Ready</span>
                    <span className="text-[11px] text-gray-500">True CR80 ID size for Xerox shops</span>
                  </div>
                </div>
              </div>

              {/* Bilingual Guide Section */}
              <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5">
                  <CreditCard className="h-4 w-4 text-[#414FA8]" />
                  <h2 className="text-sm sm:text-base font-bold text-gray-900">
                    Aadhaar Card Front &amp; Back Ek Page Par Kaise Jode? (Hindi / English Guide)
                  </h2>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Jab aap <strong>SSC, UPSC, Railway RRB, India Post GDS, Scholarship, ya Bank KYC</strong> form bharte hain, to portal par ID Proof upload karne ke liye sirf <strong>ek single file slot</strong> diya jata hai. Alag-alag Front aur Back photo upload karne par pichhla photo replace ho jata hai. Is tool se aap dono sides ko ek hi page par 100KB ya 200KB ke andar jod sakte hain:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-xs text-gray-700">
                  <li><strong>Step 1:</strong> Box 1 me Aadhaar/ID card ka <strong>Front Side</strong> photo select karein.</li>
                  <li><strong>Step 2:</strong> Box 2 me Aadhaar/ID card ka <strong>Back Side (Address wala हिस्सा)</strong> select karein.</li>
                  <li><strong>Step 3:</strong> Online form upload ke liye <strong>Top &amp; Bottom (Compact)</strong> chunein, ya print nikalne ke liye <strong>A4 Page</strong> chunein.</li>
                  <li><strong>Step 4:</strong> <strong>JPG</strong> ya <strong>PDF</strong> format aur <strong>≤ 100 KB</strong> ya <strong>≤ 200 KB</strong> select karke download karein.</li>
                </ol>
              </div>

              {/* Related Tools */}
              {relatedTools.length > 0 && (
                <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
                  <h2 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                    Related ID Card, Photo &amp; Document Tools
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                    {relatedTools.map((relTool) => (
                      <ToolButton key={relTool.id} tool={relTool} />
                    ))}
                  </div>
                </div>
              )}

              {/* FAQ Section */}
              <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <HelpCircle className="h-4 w-4 text-[#414FA8]" />
                  <h2 className="text-sm sm:text-base font-bold text-gray-900">
                    Frequently Asked Questions
                  </h2>
                </div>
                <div className="space-y-3.5">
                  {FAQS.map((faq, idx) => (
                    <div key={idx} className="border-b border-gray-100 pb-3 last:border-b-0 last:pb-0">
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1">
                        {faq.q}
                      </h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
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
