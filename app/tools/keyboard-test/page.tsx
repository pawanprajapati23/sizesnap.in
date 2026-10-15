import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { KeyboardTestTool } from '@/components/tool-ui/KeyboardTestTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import {
  ChevronRight,
  HelpCircle,
  Keyboard,
  Laptop,
  CheckCircle2,
  Lock,
  Activity,
  Zap,
  Sliders,
  Volume2,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Keyboard Test Online - Check Laptop & Mechanical Keys, Anti-Ghosting | SizeSnap',
  description:
    'Free online keyboard test tool. Test laptop and mechanical keyboard keys, check sticky or broken keys, detect anti-ghosting and simultaneous key rollover, with live virtual keyboard highlighting. 100% private in browser.',
  keywords: [
    'keyboard test',
    'keyboard test online',
    'key test',
    'laptop keyboard test',
    'check keyboard keys online',
    'mechanical keyboard test',
    'keyboard ghosting test',
    'anti ghosting test online',
    'test keys online',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/keyboard-test',
  },
  openGraph: {
    title: 'Keyboard Test Online - Check Laptop & Mechanical Keys, Anti-Ghosting | SizeSnap',
    description:
      'Test every key on your laptop or external keyboard. Live virtual keyboard highlights pressed keys, tests multiple simultaneous inputs, and checks key chatter.',
    url: 'https://www.sizesnap.in/tools/keyboard-test',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keyboard Test Online - Test All Keyboard Keys & Anti-Ghosting | SizeSnap',
    description:
      'Free online keyboard tester. Press keys to highlight on virtual keyboard and detect broken or sticky keys.',
  },
};

const RELATED_SLUGS = [
  'speaker-test',
  'mic-test',
  'webcam-test',
  'document-scanner',
  'crop-image',
  'compress-image',
];

const FAQS = [
  {
    q: 'How do I test my keyboard keys online?',
    a: 'Simply start pressing keys on your physical laptop or desktop keyboard. As you press each key, the corresponding virtual key on the screen will light up bright green. Working keys remain highlighted in dark green so you can easily track which keys you have tested.',
  },
  {
    q: 'What is Keyboard Ghosting and how do I test it?',
    a: 'Ghosting happens when cheap or older keyboards fail to register certain keys when multiple keys are pressed simultaneously. To test for anti-ghosting, press and hold multiple gaming keys together (for example, W + A + S + D + Shift + Space). If all keys light up together, your keyboard supports multi-key rollover (anti-ghosting).',
  },
  {
    q: 'Why does pressing F5 or Space scroll or refresh the page?',
    a: 'Our keyboard tester automatically intercepts default browser actions (such as F5 refresh, Tab navigation, and Space scrolling) so you can test function keys without disrupting your session.',
  },
  {
    q: 'Are my keystrokes or passwords recorded or uploaded?',
    a: 'No! Absolutely never. The keyboard test operates strictly within your local browser memory using JavaScript keydown and keyup events. No keystroke logging or data transmission takes place.',
  },
  {
    q: 'How do I test a second-hand or refurbished laptop keyboard before buying?',
    a: 'Open this tool on the laptop and press every single key row by row (Function row, Numbers, QWERTY rows, Arrow keys). If any key does not light up green or requires excessive force to register, that key switch is defective or dirty.',
  },
];

export default function KeyboardTestPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SizeSnap Keyboard Test Online',
    url: 'https://www.sizesnap.in/tools/keyboard-test',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description:
      'Free online keyboard testing utility with virtual visual keyboard, anti-ghosting rollover detection, and typing sound feedback.',
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
              <span className="text-gray-900 font-semibold">Keyboard Test</span>
            </nav>

            {/* Title & Header Card */}
            <div className="bg-white p-5 sm:p-7 rounded-[6px] border border-gray-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#EEF1FB] text-[#414FA8] text-xs font-bold uppercase tracking-wider">
                  <Keyboard className="h-3.5 w-3.5" />
                  Hardware & Input Test
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="h-3 w-3" />
                  100% Free & Private
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight">
                Keyboard Test Online – Check Laptop & Mechanical Keys
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
                Test every key on your laptop, Mac, Windows, or mechanical keyboard online.
                Press keys to watch them illuminate on the virtual keyboard, verify sticky or dead keys, check anti-ghosting rollover,
                and inspect key codes and key chatter before buying second-hand laptops or gaming equipment.
              </p>
            </div>

            {/* Interactive Keyboard Tool Component */}
            <KeyboardTestTool />

            {/* Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center shrink-0">
                  <Keyboard className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">Visual Key Highlighter</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Real-time realistic virtual keyboard illuminates pressed keys instantly.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center shrink-0">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">Anti-Ghosting Tester</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Detect simultaneous multi-key rollover support for competitive gaming.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center shrink-0">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">100% In-Browser Private</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Zero keystrokes logged or uploaded. Completely secure and client-side.
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
