import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { MicTestTool } from '@/components/tool-ui/MicTestTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import {
  ChevronRight,
  HelpCircle,
  Mic,
  Video,
  Volume2,
  CheckCircle2,
  Lock,
  Zap,
  Activity,
  Shield,
  Smartphone,
  Radio,
  Laptop,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mic Test Online - Test Microphone Sound, Volume & Echo Playback | SizeSnap',
  description:
    'Free online microphone test tool. Check your mic input volume with live sound waveforms, measure decibel levels, record and listen to voice echo playback, and verify readiness for Zoom, Google Meet & online exams. 100% private in browser.',
  keywords: [
    'mic test',
    'mic test online',
    'microphone test',
    'microphone test online',
    'check mic sound',
    'test my microphone',
    'mic echo test',
    'online mic recorder playback',
    'mic test for zoom',
    'google meet mic test',
    'tcs ion microphone test',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/mic-test',
  },
  openGraph: {
    title: 'Mic Test Online - Test Microphone Sound, Volume & Echo Playback | SizeSnap',
    description:
      'Test your microphone live online. Watch voice sound waves, test input volume levels, and listen to instant voice echo playback before important calls and interviews.',
    url: 'https://www.sizesnap.in/tools/mic-test',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mic Test Online - Test Microphone Sound & Volume | SizeSnap',
    description:
      'Free online mic test tool. Test live audio waveform, record voice echo playback, and verify mic health before meetings.',
  },
};

const RELATED_SLUGS = [
  'webcam-test',
  'document-scanner',
  'crop-image',
  'image-to-pdf',
  'passport-photo-maker',
  'compress-image',
];

const FAQS = [
  {
    q: 'How do I test my microphone using this tool?',
    a: 'Click the "Test My Mic" button. When prompted by your browser ("SizeSnap wants to use your microphone"), click "Allow". Then speak naturally into your microphone or headset. You will see the live waveform dance and the volume meter bar light up with your voice.',
  },
  {
    q: 'What is the Voice Playback & Echo Test?',
    a: 'The Echo Test allows you to record 5 seconds of your voice and immediately hear it played back through your speakers or headphones. This helps you check your voice clarity, background noise, room echo, and ensure you do not sound robotic or muffled to others.',
  },
  {
    q: 'Why is the microphone volume bar not moving when I speak?',
    a: 'Common reasons include: (1) Your headset or laptop has a physical hardware mute switch or button that is turned on, (2) Microphone permission was blocked in the browser address bar, or (3) The wrong microphone input is selected in the "Select Microphone" dropdown.',
  },
  {
    q: 'Is my voice recorded or stored on your servers?',
    a: 'No. All audio analysis, waveform generation, and echo playback run 100% locally inside your web browser via the HTML5 Web Audio API. No audio recordings are ever uploaded, saved, or transmitted to any external server.',
  },
  {
    q: 'What should my volume level be for Zoom or Google Meet meetings?',
    a: 'When speaking normally, your volume meter should reach between 40% and 75% (in the green and yellow zones). If it stays below 20%, you may sound too quiet to listeners. If it consistently hits 100% (red zone), your voice is clipping and you should move the mic slightly away from your mouth.',
  },
  {
    q: 'Can I test Bluetooth headphones or external USB microphones?',
    a: 'Yes. Connect your Bluetooth headset (like AirPods, Boat, Sony) or USB condenser microphone, and select it from the "Select Microphone" dropdown menu to test it directly.',
  },
];

export default function MicTestPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SizeSnap Microphone Test Online',
    url: 'https://www.sizesnap.in/tools/mic-test',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description:
      'Free online microphone test tool with live audio waveform visualization, decibel volume metering, and 5-second voice playback echo check.',
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
              <span className="text-gray-900 font-semibold">Microphone Test</span>
            </nav>

            {/* Title & Header Card */}
            <div className="bg-white p-5 sm:p-7 rounded-[6px] border border-gray-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#EEF1FB] text-[#414FA8] text-xs font-bold uppercase tracking-wider">
                  <Mic className="h-3.5 w-3.5" />
                  Hardware & Audio Test
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="h-3 w-3" />
                  100% Free & Private
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight">
                Mic Test Online – Check Microphone Sound, Volume & Echo
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
                Test your computer, headset, or smartphone microphone online. View your live voice waveform in real time,
                measure decibel volume levels, record and hear your voice through instant echo playback,
                and ensure crystal-clear audio before attending Zoom meetings, Google Meet interviews, Discord gaming, or online exams.
              </p>
            </div>

            {/* Interactive Mic Tool Component */}
            <MicTestTool />

            {/* Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center shrink-0">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">Live Sound Waveform</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Real-time HTML5 oscilloscope waveform and animated dB volume meter.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center shrink-0">
                  <Radio className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">Voice Echo Playback</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Record 5 seconds of your speech to hear your exact voice clarity.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center shrink-0">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">100% Client-Side Private</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Zero server uploads. Your voice is processed strictly in your local browser.
                  </p>
                </div>
              </div>
            </div>

            {/* Troubleshooting Guide */}
            <div className="bg-white p-5 sm:p-7 rounded-[6px] border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                How to Fix Microphone Not Working or Low Volume on Windows & Mac
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 leading-relaxed">
                <div className="p-3.5 bg-gray-50 rounded border border-gray-100 space-y-1.5">
                  <span className="font-bold text-gray-900 block flex items-center gap-1.5">
                    <Laptop className="h-3.5 w-3.5 text-[#414FA8]" />
                    For Windows 10 & 11:
                  </span>
                  <p>
                    1. Go to <strong>Settings &gt; Sound &gt; Input</strong> and ensure your headset/mic is selected as the default device.
                  </p>
                  <p>
                    2. Check <strong>Privacy & Security &gt; Microphone</strong> and confirm &ldquo;Let apps access your microphone&rdquo; is ON.
                  </p>
                  <p>
                    3. Right-click the Speaker icon on your taskbar, open Sound Settings, and increase Input Volume to 80–100%.
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50 rounded border border-gray-100 space-y-1.5">
                  <span className="font-bold text-gray-900 block flex items-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5 text-[#414FA8]" />
                    For Mac & Mobile:
                  </span>
                  <p>
                    1. On Mac: Open <strong>System Settings &gt; Privacy & Security &gt; Microphone</strong> and enable access for your browser.
                  </p>
                  <p>
                    2. On iPhone / Android: Tap the lock icon in Chrome/Safari address bar and grant Microphone permission.
                  </p>
                  <p>
                    3. If using wired headphones, ensure the 3.5mm jack or Type-C adapter is firmly plugged in.
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
