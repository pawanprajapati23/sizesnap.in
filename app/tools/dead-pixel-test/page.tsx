import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { DeadPixelTestTool } from '@/components/tool-ui/DeadPixelTestTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import {
  ChevronRight,
  HelpCircle,
  Monitor,
  Eye,
  CheckCircle2,
  Lock,
  Activity,
  Zap,
  Smartphone,
  Laptop,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dead Pixel Test Online - Check Monitor & Screen for Stuck Pixels | SizeSnap',
  description:
    'Free online dead pixel test tool. Inspect your monitor, laptop screen, TV, or smartphone for dead, stuck, or hot pixels using pure full-screen colors (Black, White, Red, Green, Blue, Gray). Check backlight bleed & refresh rate (Hz). 100% free.',
  keywords: [
    'dead pixel test',
    'dead pixel test online',
    'screen test online',
    'stuck pixel test',
    'check dead pixels monitor',
    'laptop screen test online',
    'lcd dead pixel check',
    'backlight bleed test',
    'screen color test',
    'dead pixel finder',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/dead-pixel-test',
  },
  openGraph: {
    title: 'Dead Pixel Test Online - Check Monitor & Screen for Stuck Pixels | SizeSnap',
    description:
      'Inspect your screen in full-screen colors. Spot dead pixels, stuck sub-pixels, and IPS backlight bleed on monitors, laptops, and phones.',
    url: 'https://www.sizesnap.in/tools/dead-pixel-test',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dead Pixel Test Online - Find Dead & Stuck Pixels | SizeSnap',
    description:
      'Free online screen test. Fullscreen color patterns to detect dead or stuck pixels and screen uniformity.',
  },
};

const RELATED_SLUGS = [
  'keyboard-test',
  'speaker-test',
  'mic-test',
  'webcam-test',
  'document-scanner',
  'crop-image',
];

const FAQS = [
  {
    q: 'How do I test my screen for dead or stuck pixels?',
    a: 'Click the "Start Full-Screen Test" button. Your screen will display pure solid colors (Pure Black, Pure White, Red, Green, Blue, and Gray). Carefully inspect your display row by row. Click anywhere or press the Right Arrow key on your keyboard to cycle through each color.',
  },
  {
    q: 'What is the difference between a Dead Pixel and a Stuck Pixel?',
    a: 'A dead pixel has a failed transistor and appears as a permanent black dot on bright or white backgrounds. A stuck pixel has one or more sub-pixel RGB transistors locked on, appearing as a tiny red, green, or blue dot on a dark or black background. Stuck pixels can often be revived, whereas dead pixels are usually permanent hardware defects.',
  },
  {
    q: 'Can a stuck pixel be fixed?',
    a: 'Sometimes, yes! Stuck pixels can occasionally unstick after cycling through rapid RGB color changes or by running a high-speed pixel flasher for a few hours. Dead pixels (completely unpowered black spots) usually cannot be repaired and require warranty replacement.',
  },
  {
    q: 'How many dead pixels are acceptable under manufacturer warranty?',
    a: 'Most monitor and laptop manufacturers follow ISO 9241-307 (Class 1 or Class 2). Generally, Class 2 permits 2 to 5 dead/stuck pixels per million pixels before qualifying for an exchange. Premium brands like Apple, Dell UltraSharp, or ASUS ProArt often offer zero-bright-dot warranties.',
  },
  {
    q: 'How do I test for Backlight Bleeding and IPS Glow?',
    a: 'Turn off the lights in your room so the surroundings are completely dark. Switch to the "Pure Black" test screen. Look at the edges and corners of your screen. If you see bright yellowish, bluish, or white light leaking in from the bezels, your screen has backlight bleeding.',
  },
  {
    q: 'Does this test work on smartphones, tablets, and smart TVs?',
    a: 'Yes! Simply open this page in your phone, tablet, or TV web browser, tap "Start Full-Screen Test", and tap anywhere on the screen to switch colors.',
  },
];

export default function DeadPixelTestPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SizeSnap Dead Pixel Test Online',
    url: 'https://www.sizesnap.in/tools/dead-pixel-test',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description:
      'Free online screen and dead pixel test utility with pure RGB full-screen patterns, refresh rate detection, and backlight bleed diagnostics.',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <main className="lg:col-span-3 space-y-8">
            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <Link href="/" className="hover:text-[#414FA8] transition-colors">
                Home
              </Link>
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <Link href="/tools" className="hover:text-[#414FA8] transition-colors">
                Tools
              </Link>
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <span className="text-gray-900 font-semibold">Dead Pixel Test</span>
            </nav>

            {/* Title & Header Card */}
            <div className="bg-white p-5 sm:p-7 rounded-[6px] border border-gray-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#EEF1FB] text-[#414FA8] text-xs font-bold uppercase tracking-wider">
                  <Monitor className="h-3.5 w-3.5" />
                  Display & Screen Quality Test
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="h-3 w-3" />
                  100% Free & In-Browser
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight">
                Dead Pixel Test Online – Check Monitor & Laptop Screen
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
                Inspect your computer monitor, laptop display, TV, or smartphone screen for dead, stuck, or bright pixels.
                Switch through pure full-screen RGB and monochrome colors, verify color uniformity, detect IPS glow and backlight bleeding,
                and inspect screen refresh rate (Hz) and resolution before return windows or warranty periods expire.
              </p>
            </div>

            {/* Interactive Dead Pixel Test Component */}
            <DeadPixelTestTool />

            {/* Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center shrink-0">
                  <Monitor className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">Pure Full-Screen Colors</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Black, White, Red, Green, Blue, Cyan, Magenta, Yellow, and 50% Gray.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center shrink-0">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">Live Refresh Rate (Hz)</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Real-time hardware display refresh rate measurement and resolution detector.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center shrink-0">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">100% In-Browser & Private</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Zero installations. Works instantly on laptops, monitors, phones, and TVs.
                  </p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Test Guide */}
            <div className="bg-white p-5 sm:p-7 rounded-[6px] border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                How to Test a New or Used Monitor/Laptop for Screen Defects
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 leading-relaxed">
                <div className="p-3.5 bg-gray-50 rounded border border-gray-100 space-y-1.5">
                  <span className="font-bold text-gray-900 block flex items-center gap-1.5">
                    <Laptop className="h-3.5 w-3.5 text-[#414FA8]" />
                    Clean Your Screen First:
                  </span>
                  <p>
                    Before testing, gently wipe your screen with a microfiber cloth to remove dust particles. A tiny speck of dust on the screen can easily look like a dead pixel!
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50 rounded border border-gray-100 space-y-1.5">
                  <span className="font-bold text-gray-900 block flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5 text-[#414FA8]" />
                    Scan Row by Row:
                  </span>
                  <p>
                    Enter full-screen mode and view your screen from a normal sitting distance of 18–24 inches. Move your eyes slowly from top-left to bottom-right across every color pattern.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                  Popular Paired Tools
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {relatedTools.map((tool) => (
                    <ToolButton key={tool.id} tool={tool} />
                  ))}
                </div>
              </div>
            )}

            {/* FAQ Section */}
            <div className="bg-white p-5 sm:p-7 rounded-[6px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <HelpCircle className="h-4 w-4 text-[#414FA8]" />
                <h2 className="text-sm sm:text-base font-bold text-gray-900">
                  Frequently Asked Questions (FAQs)
                </h2>
              </div>
              <div className="space-y-4 divide-y divide-gray-100">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className={idx > 0 ? 'pt-4' : ''}>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1">
                      {faq.q}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <Sidebar />
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
