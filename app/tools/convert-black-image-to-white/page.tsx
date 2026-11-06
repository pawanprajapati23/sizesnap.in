import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { BlackToWhiteConverter } from '@/components/tool-ui/BlackToWhiteConverter';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import {
  ChevronRight,
  HelpCircle,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  ArrowRight,
  SunMedium,
  CheckCircle2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Convert Black Image to White - Black to White PNG Online Free | SizeSnap',
  description:
    'Convert black images, logos, icons & text to pure white online for free. Turn black logo into white transparent PNG for dark mode websites, invert colors, or make black and white. 100% private in browser.',
  keywords: [
    'black to white',
    'convert black image to white',
    'black to white image converter',
    'convert black logo to white',
    'black to white png',
    'convert black to white online free',
    'black to white transparent png',
    'invert black image to white',
    'change black image to white',
    'black logo to white png converter',
    'turn black drawing to white',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/convert-black-image-to-white',
  },
  openGraph: {
    title: 'Convert Black Image to White - Black to White PNG Online Free | SizeSnap',
    description:
      'Free online tool to turn black logos, text & graphics into pure white transparent PNG or invert image colors. 100% private.',
    url: 'https://www.sizesnap.in/tools/convert-black-image-to-white',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Convert Black Image to White Online Free | SizeSnap',
    description:
      'Turn black logos, icons & line art into pure white transparent PNGs instantly.',
  },
};

const FAQS = [
  {
    q: 'How do I convert a black logo or icon into white transparent PNG?',
    a: 'Upload your black logo, icon, or drawing above. SizeSnap automatically analyzes darkness, turns black and dark pixels into pure white (#FFFFFF), and clears out light backgrounds into transparency. Toggle the Dark preview background to view your crisp white logo, then click "Download White PNG".',
  },
  {
    q: 'Can I invert colors so white becomes black and black becomes white?',
    a: 'Yes. Switch the Mode selector to "Invert Colors". This creates a negative transformation where all dark pixels become bright white and light pixels turn dark, perfect for blueprints, scanned contracts, and dark mode UI assets.',
  },
  {
    q: 'What is the Sensitivity slider used for?',
    a: 'The sensitivity slider lets you control the threshold between dark and light pixels. If your black logo has soft gray anti-aliased edges, adjusting the sensitivity ensures the white output has razor-sharp, smooth contours without rough halos.',
  },
  {
    q: 'Are my logos, graphic designs, or private signatures uploaded to a server?',
    a: 'No, never. All pixel-level mathematical calculations take place 100% inside your web browser via HTML5 Canvas. Your proprietary branding assets and photos never touch our servers.',
  },
];

const RELATED_SLUGS = [
  'image-color-picker',
  'flip-image',
  'remove-background',
  'crop-image',
  'compress-image',
  'image-to-pdf',
];

export default function ConvertBlackImageToWhitePage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Convert Black Image to White Online',
        url: 'https://www.sizesnap.in/tools/convert-black-image-to-white',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'Free online tool to convert black logos, text, drawings, and icons into pure white transparent PNG or invert image colors.',
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.sizesnap.in',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Image Tools',
            item: 'https://www.sizesnap.in/image-tools',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Convert Black Image to White',
            item: 'https://www.sizesnap.in/tools/convert-black-image-to-white',
          },
        ],
      },
      {
        '@type': 'HowTo',
        name: 'How to Convert Black Image or Logo to White Online',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Upload Black Image',
            text: 'Drop or select your black logo, icon, or drawing file (PNG, JPG, or WebP).',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Adjust Mode & Sensitivity',
            text: 'Choose "Black to White (Transparent)" or "Invert Colors", and fine-tune sensitivity.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Download White PNG',
            text: 'Preview on dark background and click "Download White PNG" or Copy to Clipboard.',
          },
        ],
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
            <span className="text-gray-800 font-semibold">Convert Black Image to White</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            {/* Main content: ~70% width on desktop */}
            <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
              {/* Header Box */}
              <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-xs">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-[#414FA8]">
                    <Sparkles className="w-3.5 h-3.5" /> High-Resolution Converter
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Private Browser Processing
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2">
                  Convert Black Image to White (Black to White PNG)
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
                  Turn black logos, icons, signatures, sketches, and typography into pure white transparent PNG files or invert colors with 1-click. Ideal for dark mode web design, branding, and printing.
                </p>
              </div>

              {/* Interactive Tool Component */}
              <BlackToWhiteConverter />

              {/* Comprehensive SEO Content & Guide */}
              <article className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs space-y-6 text-gray-700">
                <section>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#414FA8]" /> Why Convert Black Images & Logos to White?
                  </h2>
                  <p className="text-sm leading-relaxed mb-3">
                    Graphic designers, web developers, and digital creators often possess black logos or dark vector icons (<code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">#000000</code>). However, modern web applications, mobile apps, and presentation decks increasingly favor <strong>dark mode themes</strong> and colored headers where a black logo becomes completely invisible.
                  </p>
                  <p className="text-sm leading-relaxed">
                    Instead of firing up heavy desktop editors like Photoshop or Illustrator, SizeSnap allows you to convert any black asset into a <strong>pure white transparent PNG</strong> (<code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">#FFFFFF</code>) in milliseconds directly in your browser.
                  </p>
                </section>

                <section className="border-t border-gray-100 pt-5">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#414FA8]" /> 3 Powerful Conversion Modes
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                      <h3 className="font-bold text-gray-900 text-sm mb-1">1. Black to White (Transparent)</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Converts dark pixels to white while turning bright backgrounds transparent. Perfect for logos and icons.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                      <h3 className="font-bold text-gray-900 text-sm mb-1">2. Invert Colors (Negative)</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Flips color values across the spectrum. Black becomes white, white becomes black. Great for blueprint scans.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                      <h3 className="font-bold text-gray-900 text-sm mb-1">3. Pure Monochrome B&W</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        High-contrast binarization that separates dark ink strokes from paper noise for documents and signatures.
                      </p>
                    </div>
                  </div>
                </section>

                {/* FAQ Accordion Section */}
                <section className="border-t border-gray-100 pt-5">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#414FA8]" /> Frequently Asked Questions
                  </h2>
                  <div className="space-y-3">
                    {FAQS.map((faq, idx) => (
                      <details
                        key={idx}
                        className="group bg-gray-50/70 hover:bg-gray-50 rounded-lg p-3.5 border border-gray-200/80 transition-colors cursor-pointer"
                      >
                        <summary className="font-semibold text-xs sm:text-sm text-gray-900 list-none flex items-center justify-between">
                          <span>{faq.q}</span>
                          <span className="text-gray-400 group-open:rotate-180 transition-transform ml-2">▼</span>
                        </summary>
                        <p className="text-xs sm:text-sm text-gray-600 mt-2.5 pt-2.5 border-t border-gray-200/60 leading-relaxed">
                          {faq.a}
                        </p>
                      </details>
                    ))}
                  </div>
                </section>
              </article>

              {/* Related Tools */}
              {relatedTools.length > 0 && (
                <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-xs">
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                    <span>Related Image Utilities</span>
                    <Link href="/image-tools" className="text-xs text-[#414FA8] hover:underline flex items-center gap-1">
                      View All <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {relatedTools.map((t) => (
                      <ToolButton key={t.slug} tool={t} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar: ~30% width on desktop */}
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
