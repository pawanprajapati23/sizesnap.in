import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { PassportPhotoMaker } from '@/components/tool-ui/PassportPhotoMaker';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield, Sparkles } from 'lucide-react';
import { FAQSchema, SoftwareAppSchema } from '@/components/SeoSchemas';
import AdsterraAd from '@/components/AdsterraAd';

export const metadata: Metadata = {
  title: 'White Background Passport Photo Maker Online Free | SizeSnap',
  description:
    'Change photo background to pure white online for free. AI white background cutout for Indian Passport, US Visa, SSC, UPSC, and exam forms. 100% private in browser.',
  keywords: [
    'white background passport photo',
    'white background photo online free',
    'change photo background to white for passport',
    'white background photo converter',
    'make photo background white for exam',
    'passport size photo white background',
    'white background photo editor online',
    'ai white background photo maker',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/white-background-passport-photo',
  },
  openGraph: {
    title: 'White Background Passport Photo Maker Online Free | SizeSnap',
    description:
      'Free online tool to create pure white background passport photos for Indian Passport, Visa, SSC, and UPSC forms. 100% client-side AI.',
    url: 'https://www.sizesnap.in/tools/white-background-passport-photo',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'passport-photo-maker',
  'resize-image-3-5cm-4-5cm',
  'add-name-and-date-on-photo',
  'compress-image-between-20kb-to-50kb',
  'remove-background',
  'compress-image-to-50kb',
];

const FAQS = [
  {
    q: 'How to make a photo background pure white for passport online for free?',
    a: 'Upload your photo into SizeSnap. Use our one-click "White Background" tool to automatically remove messy backgrounds and replace them with solid pure white (#FFFFFF) compliant with international passport standards.',
  },
  {
    q: 'Photo ka background white kaise karein (फोटो का बैकग्राउंड सफेद कैसे करें)?',
    a: 'SizeSnap par apni photo upload karein. "White Background" option select karein, tool automatically AI se background cut karke clean white background laga dega. Phir aap 3.5x4.5cm passport size me download kar sakte hain.',
  },
  {
    q: 'Why do passport and exam authorities require pure white backgrounds?',
    a: 'Pure white backgrounds ensure maximum contrast between candidate hair/skin and the background, enabling biometric facial recognition algorithms to read facial landmarks without interference from room shadows or wallpapers.',
  },
  {
    q: 'Is this acceptable for Indian Passport Seva and US Visa applications?',
    a: 'Yes. SizeSnap produces clean, solid white backgrounds meeting ICAO (International Civil Aviation Organization) and Indian MEA Passport specifications.',
  },
  {
    q: 'Are my photographs kept confidential?',
    a: 'Yes. All image processing executes directly in your browser. No photos are uploaded or stored on any server.',
  },
];

export default function WhiteBackgroundPassportPhotoPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  return (
    <>
      <FAQSchema faqs={FAQS} />
      <SoftwareAppSchema
        name="SizeSnap White Background Passport Photo Maker"
        description="Free online tool to change photo background to pure white for Indian Passport, US Visa, SSC, and UPSC forms."
        url="https://www.sizesnap.in/tools/white-background-passport-photo"
      />

      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />

        <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <Link href="/image-tools" className="hover:text-[#414FA8] font-medium transition-colors">
              Image Tools
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span className="text-gray-800 font-semibold">White Background Photo</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">

              {/* Header Box */}
              <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-[#EEF1FB] text-[#414FA8] border border-[#9AA3C8]/40 rounded">
                    Pure White Background
                  </span>
                  <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                    ICAO Biometric Standard
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                  White Background Passport Photo Maker Online Free
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                  Turn any snapshot into an official passport photo with a clean white background. Perfect for Indian Passport, US Visa (2×2 inch), SSC, UPSC, and online exam applications.
                </p>

                <div className="flex flex-wrap gap-3 mt-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-1 rounded">
                    <Lock className="h-3 w-3" /> 100% Client-Side Privacy
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-1 rounded">
                    <Sparkles className="h-3 w-3" /> One-Click White Cutout
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded">
                    <Shield className="h-3 w-3" /> Zero Watermark
                  </div>
                </div>
              </div>

              {/* Tool Engine */}
              <PassportPhotoMaker />

              {/* In-content Ad */}
              <div className="overflow-hidden rounded-[4px] border border-gray-100 bg-white p-2 shadow-xs flex justify-center">
                <AdsterraAd dataKey="3bd154ece61c60859c2b8242ae85b927" width={728} height={90} className="w-full hidden md:flex" />
                <AdsterraAd dataKey="f509bd7d24a58ce7a176067713ca61df" width={320} height={50} className="w-full md:hidden flex" />
              </div>

              {/* Educational Article Section */}
              <article className="bg-white p-5 sm:p-7 rounded-[4px] border border-gray-200 shadow-xs text-gray-700 text-xs sm:text-sm leading-relaxed space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">
                  Why Passport and Visa Authorities Require White Backgrounds
                </h2>
                <p>
                  Government identity and travel documents require clear, shadow-free white backgrounds.
                  When photographs have textured walls, colored backdrops, or poor indoor lighting, automated
                  face scanning systems frequently reject the application with errors like{' '}
                  <span className="font-mono text-xs bg-red-50 text-red-600 px-1 py-0.5 rounded border border-red-200">
                    &quot;Unacceptable background contrast&quot;
                  </span>.
                </p>
                <p>
                  SizeSnap automatically isolates the candidate portrait, smooths edge hair contours, and
                  composites a solid, uniform pure white background (#FFFFFF) that passes automated consular
                  and exam verification.
                </p>
              </article>

              {/* FAQs Section */}
              <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-base sm:text-lg font-bold text-[#333333] mb-4 flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-[#414FA8]" />
                  Frequently Asked Questions
                </h2>
                <div className="divide-y divide-gray-100">
                  {FAQS.map((faq, idx) => (
                    <div key={idx} className="py-3.5 first:pt-0 last:pb-0">
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">{faq.q}</h3>
                      <p className="text-xs text-gray-600 leading-normal">{faq.a}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Related Tools */}
              <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-sm font-bold text-gray-800 mb-3">Related Image &amp; Exam Tools</h2>
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
