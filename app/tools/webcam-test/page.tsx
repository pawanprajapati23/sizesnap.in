import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { WebcamTestTool } from '@/components/tool-ui/WebcamTestTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import {
  ChevronRight,
  HelpCircle,
  Video,
  Mic,
  Camera,
  CheckCircle2,
  Lock,
  Zap,
  Activity,
  Shield,
  Smartphone,
  Sliders,
  Laptop,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Webcam Test Online - Check Camera Resolution, FPS & Quality | SizeSnap',
  description:
    'Free online webcam test tool. Test your camera live preview, measure resolution (1080p, 720p, 4K), frame rate (FPS), take test snapshots, adjust lighting, and check readiness for Zoom, Google Meet & online exams. 100% private in browser.',
  keywords: [
    'webcam test',
    'webcam test online',
    'camera test',
    'camera test online',
    'check my camera',
    'test webcam resolution',
    'webcam fps test',
    'online camera checker for zoom',
    'google meet camera test',
    'tcs ion camera test online',
    'laptop camera test',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/webcam-test',
  },
  openGraph: {
    title: 'Webcam Test Online - Check Camera Resolution, FPS & Quality | SizeSnap',
    description:
      'Instantly check if your camera works online. Detect resolution, test FPS, take a photo, adjust brightness/contrast, and test compatibility for meetings and exams.',
    url: 'https://www.sizesnap.in/tools/webcam-test',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Webcam Test Online - Test Camera, FPS & Resolution | SizeSnap',
    description:
      'Test your webcam online for free. Check camera quality, lighting, real-time FPS, and resolution before interviews and exams.',
  },
};

const RELATED_SLUGS = [
  'mic-test',
  'document-scanner',
  'crop-image',
  'image-to-pdf',
  'passport-photo-maker',
  'compress-image',
];

const FAQS = [
  {
    q: 'How do I test my webcam using this tool?',
    a: 'Simply click the "Start Webcam Test" or "Test My Cam" button above. When your browser prompts for permission ("SizeSnap wants to use your camera"), click "Allow". Your live camera stream will immediately appear along with your camera resolution, real-time FPS, and aspect ratio.',
  },
  {
    q: 'Why is my webcam not turning on or showing an error?',
    a: 'Ensure you have granted camera permission in your browser address bar (look for the lock or camera icon on the left of the URL). Also check if another video app (such as Zoom, Microsoft Teams, Skype, or OBS Studio) is currently running and using your camera. Close other applications and click "Test My Cam" again.',
  },
  {
    q: 'How do I know if my camera is ready for Zoom, Google Meet, or TCS iON exams?',
    a: 'Look at the live video preview and the "Application Readiness Checklist". If your video is clear, smooth (24–30+ FPS), and shows an active resolution (e.g. 1280x720 HD or 1920x1080 Full HD), your camera is completely ready for professional meetings, remote interviews, and proctored university or corporate exams.',
  },
  {
    q: 'Is my webcam video recorded or uploaded to your servers?',
    a: 'No, never. All video processing, frame rendering, FPS measurement, and snapshot generation occur 100% locally in your web browser using HTML5 MediaDevices and Canvas APIs. Your video stream never leaves your phone or computer.',
  },
  {
    q: 'Can I switch between front, rear, and external USB webcams?',
    a: 'Yes. If your device has multiple cameras (such as an external Logitech USB webcam, built-in laptop camera, or mobile front/back cameras), use the "Select Camera Device" dropdown menu to switch between them instantly.',
  },
  {
    q: 'Can I take a test photo to check picture quality?',
    a: 'Yes! Click "Take Photo (3s Timer)" to start a 3-second countdown or click "Instant Photo" to capture a high-resolution snapshot. You can preview the image and download it to check sharpness and color reproduction.',
  },
];

export default function WebcamTestPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SizeSnap Webcam Test Online',
    url: 'https://www.sizesnap.in/tools/webcam-test',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description:
      'Free online webcam testing utility. Detect camera resolution, frame rate, lighting adjustment, and check video readiness for interviews and meetings.',
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
              <span className="text-gray-900 font-semibold">Webcam Test</span>
            </nav>

            {/* Title & Header Card */}
            <div className="bg-white p-5 sm:p-7 rounded-[6px] border border-gray-200 shadow-xs space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#EEF1FB] text-[#414FA8] text-xs font-bold uppercase tracking-wider">
                  <Video className="h-3.5 w-3.5" />
                  Hardware & System Test
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="h-3 w-3" />
                  100% Free & Private
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-gray-900 leading-tight">
                Webcam Test Online – Check Camera Resolution & FPS
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-3xl">
                Test your webcam directly inside your browser without installing third-party software.
                Measure live FPS, check exact camera resolution (1080p Full HD, 720p, 4K), test lighting and framing,
                take test photos, and verify video readiness before attending Zoom meetings, Google Meet interviews, or proctored online exams.
              </p>
            </div>

            {/* Interactive Webcam Tool Component */}
            <WebcamTestTool />

            {/* Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center shrink-0">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">Live FPS & Resolution</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Real-time hardware frame rate and exact pixel dimensions analyzer.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[6px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="h-9 w-9 rounded bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center shrink-0">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-gray-900">Lighting & Mirror Filters</h2>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Adjust brightness, contrast, and toggle mirror preview for ideal framing.
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
                    Zero video uploads. Everything runs locally on your device hardware.
                  </p>
                </div>
              </div>
            </div>

            {/* Step-by-Step Instructions & Exam Guide */}
            <div className="bg-white p-5 sm:p-7 rounded-[6px] border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-sm sm:text-base font-bold text-gray-900">
                How to Test and Fix Webcam Issues Before Online Meetings & Exams
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-gray-600 leading-relaxed">
                <div className="p-3.5 bg-gray-50 rounded border border-gray-100 space-y-1.5">
                  <span className="font-bold text-gray-900 block flex items-center gap-1.5">
                    <Laptop className="h-3.5 w-3.5 text-[#414FA8]" />
                    For Windows & Mac Laptops:
                  </span>
                  <p>
                    1. Ensure the physical privacy shutter on your laptop screen is slid open.
                  </p>
                  <p>
                    2. Check Windows Settings &gt; Privacy & Security &gt; Camera, and verify &ldquo;Allow apps to access your camera&rdquo; is turned ON.
                  </p>
                  <p>
                    3. If you have an external USB webcam, plug it directly into a high-speed USB port.
                  </p>
                </div>

                <div className="p-3.5 bg-gray-50 rounded border border-gray-100 space-y-1.5">
                  <span className="font-bold text-gray-900 block flex items-center gap-1.5">
                    <Smartphone className="h-3.5 w-3.5 text-[#414FA8]" />
                    For Android & iPhone Users:
                  </span>
                  <p>
                    1. Tap the lock/tune icon in the browser address bar (Chrome or Safari).
                  </p>
                  <p>
                    2. Set &ldquo;Camera Permissions&rdquo; to Allow.
                  </p>
                  <p>
                    3. Position your phone horizontally or vertically and check your lighting.
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
