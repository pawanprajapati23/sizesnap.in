import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { SpeakerTestTool } from '@/components/tool-ui/SpeakerTestTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import {
  ChevronRight,
  HelpCircle,
  Volume2,
  Headphones,
  CheckCircle2,
  Lock,
  Activity,
  Zap,
  Smartphone,
  Laptop,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Speaker & Headphone Test Online - Left Right Stereo & Bass Sound Check | SizeSnap',
  description:
    'Free online speaker and headphone test tool. Test Left and Right stereo audio channels, check subwoofer bass frequencies (60Hz–120Hz), mid-range voice clarity, and frequency sweep in your browser. 100% free.',
  keywords: [
    'speaker test',
    'speaker test online',
    'headphone test online',
    'left right sound test',
    'stereo audio check',
    'headphone left right test',
    'bass test online',
    'audio frequency test',
    'earphone sound check',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/speaker-test',
  },
  openGraph: {
    title: 'Speaker & Headphone Test Online - Left Right Stereo & Bass Sound Check | SizeSnap',
    description:
      'Check if both left and right speakers or headphones are working properly. Test stereo separation, audio balance, and bass depth online.',
    url: 'https://www.sizesnap.in/tools/speaker-test',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Speaker Test Online - Left/Right Stereo & Bass Check | SizeSnap',
    description:
      'Test your speakers and headphones online. Check stereo channels, bass response, and sound balance.',
  },
};

const RELATED_SLUGS = [
  'mic-test',
  'webcam-test',
  'document-scanner',
  'crop-image',
  'image-to-pdf',
  'compress-image',
];

const FAQS = [
  {
    q: 'How do I test if my Left and Right headphones are working properly?',
    a: 'Put your headphones or earphones on. Click the "Test Left" button to play sound exclusively in the left earcup, and click "Test Right" to play sound in the right earcup. If sound plays from both sides during the Left test, your audio output is set to Mono instead of Stereo.',
  },
  {
    q: 'What should I do if one side of my headphones has no sound?',
    a: 'First, check the 3.5mm headphone jack or USB-C plug to make sure it is pushed completely into the socket. Next, check the "Stereo Balance" slider above to ensure balance is centered at 0. On Windows, check Settings > System > Sound and verify Left/Right balance is equal.',
  },
  {
    q: 'What is the Sub-Bass and Frequency Sweep test?',
    a: 'Human ears can typically hear sounds from 20 Hz (very deep bass) up to 20,000 Hz (high-pitched treble). Our Sub-Bass (60Hz) test checks if your speakers can deliver deep rumble without distortion or crackling. The Frequency Sweep smoothly sweeps from 40 Hz to 12,000 Hz to reveal any dips or distortion in your audio hardware.',
  },
  {
    q: 'Why does the sound play in both ears during the Left test?',
    a: 'This happens if "Mono Audio" is enabled in your operating system accessibility settings. On Windows, go to Settings > Accessibility > Audio > Turn off "Mono audio". On iPhone / iPad, go to Settings > Accessibility > Audio & Visual > Turn off "Mono Audio".',
  },
  {
    q: 'Can I test external Bluetooth speakers or soundbars?',
    a: 'Yes! Connect your Bluetooth speaker or soundbar to your device, select it as the active audio output in your system tray, and press the test buttons above.',
  },
];

export default function SpeakerTestPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SizeSnap Speaker & Headphone Test Online',
    url: 'https://www.sizesnap.in/tools/speaker-test',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description:
      'Free online speaker and headphone testing tool with Left/Right stereo audio separation, frequency sweep, and bass depth analyzer.',
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
              <span className="text-gray-900 font-semibold">Speaker Test</span>
            </nav>

            {/* Title & Header Card */}
            <div className="bg-white p-5 sm:p-7 rounded-[6px] border border-gray-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#EEF1FB] text-[#414FA8] text-xs font-bold uppercase tracking-wider">
                  <Volume2 className="h-3.5 w-3.5" />
                  Hardware & Audio Output Test
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="h-3 w-3" />
                  100% Free & In-Browser
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight">
                Speaker & Headphone Test Online – Left/Right Stereo & Bass Check
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
                Test your laptop speakers, desktop monitors, earphones, or Bluetooth headphones online.
                Check Left and Right stereo channel separation, test subwoofer bass depth, run an audio frequency sweep from 40Hz to 12kHz,
                and diagnose sound distortion before gaming, listening to music, or joining online meetings.
              </p>
            </div>

            {/* Interactive Speaker Test Component */}
            <SpeakerTestTool />

            {/* Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center shrink-0">
                  <Headphones className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">Left & Right Stereo Test</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Dedicated left and right channel audio panner to verify true stereo separation.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center shrink-0">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">Sub-Bass & Frequency Tones</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    60Hz deep bass, 1000Hz reference vocal, and continuous frequency sweeps.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center shrink-0">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">100% In-Browser Audio</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Synthesized locally via HTML5 Web Audio API. Zero bandwidth or download needed.
                  </p>
                </div>
              </div>
            </div>

            {/* Troubleshooting Guide */}
            <div className="bg-white p-5 sm:p-7 rounded-[6px] border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                How to Fix Speaker or Headphone Issues on Windows, Mac, and Mobile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 leading-relaxed">
                <div className="p-3.5 bg-gray-50 rounded border border-gray-100 space-y-1.5">
                  <span className="font-bold text-gray-900 block flex items-center gap-1.5">
                    <Laptop className="h-3.5 w-3.5 text-[#414FA8]" />
                    For Windows 10 & 11 Laptops:
                  </span>
                  <p>
                    1. Click the Speaker icon on your taskbar and check that the volume is not muted.
                  </p>
                  <p>
                    2. Go to <strong>Settings &gt; Sound &gt; Output</strong>, click your device, and ensure the Left/Right balance sliders are equal.
                  </p>
                  <p>
                    3. Turn off Audio Enhancements if you hear crackling or buzzing sounds.
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50 rounded border border-gray-100 space-y-1.5">
                  <span className="font-bold text-gray-900 block flex items-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5 text-[#414FA8]" />
                    For iPhone & Android:
                  </span>
                  <p>
                    1. Check if Bluetooth is accidentally connected to another speaker in another room.
                  </p>
                  <p>
                    2. Check physical volume buttons on the side of your device.
                  </p>
                  <p>
                    3. On iPhone: Settings &gt; Accessibility &gt; Audio/Visual &gt; ensure Balance slider is centered.
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
