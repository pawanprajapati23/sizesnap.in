import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { MouseTestTool } from '@/components/tool-ui/MouseTestTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import {
  ChevronRight,
  HelpCircle,
  Mouse,
  CheckCircle2,
  Lock,
  Activity,
  Timer,
  Zap,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mouse Test Online - Check Left/Right Click, Scroll Wheel & CPS Speed | SizeSnap',
  description:
    'Free online mouse test tool. Test Left click, Right click, Middle click, and scroll wheel. Detect double click switch chatter and test CPS (Clicks Per Second) speed online. 100% free.',
  keywords: [
    'mouse test',
    'mouse test online',
    'check mouse buttons',
    'left click test',
    'right click test online',
    'mouse scroll wheel test',
    'cps test online',
    'mouse double click test',
    'mouse chatter test',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/mouse-test',
  },
  openGraph: {
    title: 'Mouse Test Online - Check Left/Right Click, Scroll Wheel & CPS Speed | SizeSnap',
    description:
      'Test your computer mouse buttons, scroll wheel, double-click accuracy, and click speed (CPS) online.',
    url: 'https://www.sizesnap.in/tools/mouse-test',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mouse Test Online - Test All Mouse Buttons & CPS | SizeSnap',
    description:
      'Free online mouse tester. Test left/right clicks, middle click, scroll wheel, and clicks per second.',
  },
};

const RELATED_SLUGS = [
  'keyboard-test',
  'dead-pixel-test',
  'speaker-test',
  'mic-test',
  'webcam-test',
  'document-scanner',
];

const FAQS = [
  {
    q: 'How do I test my mouse buttons using this tool?',
    a: 'Hover your cursor over the test pad above and click any button on your mouse (Left click, Right click, Middle scroll wheel click, or side buttons). The visual 2D mouse graphic will light up in green and count every click registered.',
  },
  {
    q: 'How do I test the mouse scroll wheel?',
    a: 'Place your cursor over the test area and scroll up and down. The counters for Scroll Up (▲) and Scroll Down (▼) will count every step and confirm if your scroll encoder is functioning without skipping.',
  },
  {
    q: 'What is mouse switch chatter / double-clicking defect?',
    a: 'As mechanical micro-switches age, their metal contact leaves can corrode or wear out, causing a single click to physically register as two rapid clicks (under 80ms apart). Our tool monitors the exact millisecond gap between clicks and flags switch chatter warnings automatically.',
  },
  {
    q: 'What is a good CPS (Clicks Per Second) score?',
    a: 'Most regular users click at 4 to 6 CPS. Gamers practicing jitter clicking or butterfly clicking can achieve 8 to 12+ CPS. Our built-in CPS speed test calculates your average score over 5 or 10 seconds.',
  },
  {
    q: 'Why does Right-Click not open the normal context menu on this page?',
    a: 'We intercept the browser context menu within the test box so you can comfortably test your Right Mouse button without annoying menus popping up.',
  },
];

export default function MouseTestPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SizeSnap Mouse Test Online',
    url: 'https://www.sizesnap.in/tools/mouse-test',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description:
      'Free online mouse testing utility for Left/Right/Middle clicks, scroll wheel counter, switch chatter detector, and CPS click speed test.',
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
              <span className="text-gray-900 font-semibold">Mouse Test</span>
            </nav>

            {/* Title & Header Card */}
            <div className="bg-white p-5 sm:p-7 rounded-[6px] border border-gray-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#EEF1FB] text-[#414FA8] text-xs font-bold uppercase tracking-wider">
                  <Mouse className="h-3.5 w-3.5" />
                  Hardware & Pointer Test
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="h-3 w-3" />
                  100% Free & Private
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight">
                Mouse Test Online – Check Left/Right Click, Scroll & CPS Speed
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
                Test your computer mouse buttons, trackpad, and scroll wheel online.
                Verify Left Click, Right Click, Middle Scroll Wheel, and side buttons, detect accidental double-click switch chatter,
                and measure your CPS (Clicks Per Second) clicking speed for competitive gaming.
              </p>
            </div>

            {/* Interactive Mouse Tool Component */}
            <MouseTestTool />

            {/* Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center shrink-0">
                  <Mouse className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">All Button Diagnostics</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Left, Right, Middle, Scroll Up, Scroll Down, and Side Thumb buttons.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center shrink-0">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">Switch Chatter Detector</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Detect faulty micro-switch bounce and accidental double-clicks.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center shrink-0">
                  <Timer className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">CPS Click Speed Test</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Test your clicking speed in 5s or 10s intervals with gamer ranks.
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
