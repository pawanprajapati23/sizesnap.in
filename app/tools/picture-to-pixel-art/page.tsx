import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { PictureToPixelArtTool } from '@/components/tool-ui/PictureToPixelArtTool';
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
  Palette,
  Grid,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Picture to Pixel Art Converter Online Free - 8-Bit Photo Maker | SizeSnap',
  description:
    'Convert picture to pixel art online for free. Turn photos into retro 8-bit, 16-bit, Game Boy, and arcade pixel art. Adjust pixel size and color palettes. 100% private in browser.',
  keywords: [
    'picture to pixel art',
    'art pixel',
    'image to pixel art',
    'convert picture to pixel art',
    'photo to 8 bit',
    'pixel art generator from image',
    'turn photo into pixel art',
    '8 bit photo maker online free',
    'retro pixel art converter',
    'game boy photo filter',
    'arcade pixel art maker',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/picture-to-pixel-art',
  },
  openGraph: {
    title: 'Picture to Pixel Art Converter Online Free - 8-Bit Photo Maker | SizeSnap',
    description:
      'Turn photos into retro 8-bit, 16-bit, Game Boy & arcade pixel art online free. Instant crisp PNG download.',
    url: 'https://www.sizesnap.in/tools/picture-to-pixel-art',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Picture to Pixel Art Converter Online Free | SizeSnap',
    description:
      'Turn photos into retro 8-bit, Game Boy & arcade pixel art instantly in browser.',
  },
};

const FAQS = [
  {
    q: 'How do I convert a photo into pixel art online for free?',
    a: 'Upload your photo (JPG, PNG, or WebP) above. SizeSnap instantly downsamples and quantizes image coordinates into retro pixel blocks. Select your favorite pixel granularity (e.g. 8-bit or 16-bit) and color palette, then click "Download Pixel Art PNG".',
  },
  {
    q: 'What retro color palettes are available?',
    a: 'SizeSnap offers 5 distinct styles: Full 24-bit original color, 8-bit Arcade NES (16-color retro palette), Game Boy Classic (4-shade olive green), Cyberpunk Neon (vibrant synthwave tones), and 1-bit high-contrast monochrome.',
  },
  {
    q: 'Will the downloaded pixel art image look blurry when enlarged?',
    a: 'No! Our rendering engine disables bicubic and bilinear smoothing (nearest-neighbor scaling). Every individual square pixel retains crisp, sharp geometric edges at full display resolution without blur.',
  },
  {
    q: 'Are my personal photos uploaded to any external server?',
    a: 'No. All rasterization and color quantization happen 100% locally on your computer or phone using HTML5 Canvas. Your photos never leave your device.',
  },
];

const RELATED_SLUGS = [
  'convert-black-image-to-white',
  'image-color-picker',
  'flip-image',
  'crop-image',
  'compress-image',
  'image-filters',
];

export default function PictureToPixelArtPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Picture to Pixel Art Converter',
        url: 'https://www.sizesnap.in/tools/picture-to-pixel-art',
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'All',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'Free online tool to convert pictures and photos into retro 8-bit, 16-bit, Game Boy, and arcade pixel art.',
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
            name: 'Picture to Pixel Art',
            item: 'https://www.sizesnap.in/tools/picture-to-pixel-art',
          },
        ],
      },
      {
        '@type': 'HowTo',
        name: 'How to Convert Picture to Pixel Art Online',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Upload Photo',
            text: 'Drop or select any portrait, game screenshot, or landscape picture.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Choose Pixel Size & Palette',
            text: 'Select 8-bit, Retro, or Chunky pixel sizes, and choose from Game Boy, Arcade, or Cyberpunk palettes.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Download Pixel Art',
            text: 'Click "Download Pixel Art PNG" or Copy to Clipboard.',
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
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <Link href="/image-tools" className="hover:text-[#414FA8] font-medium transition-colors">
              Image Tools
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <span className="text-gray-800 font-semibold">Picture to Pixel Art</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
              {/* Header Box */}
              <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-xs">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-[#414FA8]">
                    <Sparkles className="w-3.5 h-3.5" /> Retro 8-Bit Generator
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5" /> 100% Private Browser Processing
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 mb-2">
                  Picture to Pixel Art (8-Bit Photo Maker Online Free)
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
                  Transform any photo, profile picture, or illustration into authentic retro pixel art. Customize block size, switch between NES Arcade and Game Boy palettes, and download crisp, non-blurry PNGs.
                </p>
              </div>

              {/* Tool Component */}
              <PictureToPixelArtTool />

              {/* Guide Article */}
              <article className="bg-white p-6 sm:p-8 rounded-xl border border-gray-200 shadow-xs space-y-6 text-gray-700">
                <section>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Palette className="w-5 h-5 text-[#414FA8]" /> Authentic Retro Video Game Aesthetics
                  </h2>
                  <p className="text-sm leading-relaxed mb-3">
                    Pixel art evokes nostalgic memories of classic 1980s and 1990s arcade cabinets, Game Boy classics, and 16-bit consoles. Creating pixel art from scratch can take hours of meticulous manual dot placement.
                  </p>
                  <p className="text-sm leading-relaxed">
                    SizeSnap’s <strong>Picture to Pixel Art generator</strong> automates this workflow in real time. It performs color clustering and nearest-neighbor spatial downsampling to preserve the recognizable contour of faces, pets, and landscapes while giving them an authentic retro gaming aesthetic.
                  </p>
                </section>

                <section className="border-t border-gray-100 pt-5">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Grid className="w-5 h-5 text-[#414FA8]" /> Features & Retro Palettes
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                      <h3 className="font-bold text-gray-900 text-sm mb-1">🎮 Arcade & NES</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        16 classic gaming colors designed for vintage platformer sprites and arcade avatars.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                      <h3 className="font-bold text-gray-900 text-sm mb-1">👾 Game Boy Classic</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Iconic 4-shade greenish palette replicating original 1989 handheld gaming screens.
                      </p>
                    </div>
                    <div className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                      <h3 className="font-bold text-gray-900 text-sm mb-1">🌆 Cyberpunk Neon</h3>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Vibrant magenta, cyan, and deep purple tones for futuristic retro-wave aesthetics.
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
