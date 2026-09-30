import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { CompressPdfTool } from '@/components/tool-ui/CompressPdfTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compress PDF Online - Reduce PDF File Size Free | SizeSnap',
  description:
    'Compress and reduce PDF file size online for free. Choose Low, Recommended, or High compression presets. Ideal for government portals (SSC, UPSC) and email attachments. 100% private in browser.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/compress-pdf',
  },
  openGraph: {
    title: 'Compress PDF Online - Reduce PDF File Size Free | SizeSnap',
    description:
      'Reduce PDF file size quickly without watermarks, signup, or server uploads. Secure browser-based compression.',
    url: 'https://sizesnap.in/tools/compress-pdf',
  },
};

const RELATED_SLUGS = [
  'image-to-pdf',
  'pdf-to-images',
  'compress-image',
  'reduce-image-size-in-kb',
  'merge-pdf',
  'passport-photo-maker',
];

const FAQS = [
  {
    q: 'How do I compress a PDF file for government exam portals (SSC, UPSC, State PSC)?',
    a: 'Upload your PDF document, select "Visual & Image Compression" with the "Recommended" (120 DPI) or "High Compression" (96 DPI) preset, and click "Compress & Optimize PDF". This significantly downsamples image streams and scanned paperwork so it meets the strict 500KB or 1MB upload thresholds on official recruitment portals.',
  },
  {
    q: 'Does compressing a PDF guarantee a smaller file size?',
    a: 'Not always. If your PDF is already composed of clean vector text, subset fonts, or heavily compressed JPEG images, further compression may produce negligible reduction or even a slight increase in header metadata. SizeSnap provides honest before/after metrics so you can verify the exact file size before downloading.',
  },
  {
    q: 'What is the difference between "Visual & Image Compression" and "Structural Stream Optimizer"?',
    a: 'Structural Stream Optimizer strips redundant metadata and reorganizes cross-reference tables while keeping selectable text, fonts, and vector paths untouched. Visual & Image Compression renders each page to an optimized raster image, which achieves huge file reductions on scanned paperwork, photographs, and certificates, but flattens selectable text.',
  },
  {
    q: 'Are my confidential documents, bank statements, or certificates safe?',
    a: 'Yes, 100%. All PDF decoding, stream compression, and rendering are executed strictly inside your local web browser. Your confidential files never touch an external cloud server.',
  },
  {
    q: 'Can I compress password-protected or encrypted PDF documents?',
    a: 'Encrypted PDFs must be unlocked before compression because browser security sandboxes cannot parse password-protected stream objects without valid credentials.',
  },
];

export default function CompressPdfPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <Head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>
      <div className="min-h-screen flex flex-col bg-[#F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link href="/#directory" className="hover:text-[#414FA8] font-medium transition-colors">
            PDF Tools
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">Compress PDF</span>
        </nav>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Header Box */}
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                Compress PDF Online
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Reduce PDF file size while maintaining readability. Choose between visual downsampling for scanned documents or structural stream optimization. 100% private in your browser.
              </p>
            </div>

            {/* Interactive PDF Compression Engine */}
            <React.Suspense fallback={<div className="p-8 text-center text-sm text-gray-500">Loading SizeSnap PDF Compressor...</div>}>
              <CompressPdfTool />
            </React.Suspense>

            {/* Sister Tools Shortcut Links */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200">
              <span className="text-xs font-bold text-gray-800 block mb-2">
                Related PDF &amp; Document Tools:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/tools/image-to-pdf"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Image to PDF →
                </Link>
                <Link
                  href="/tools/pdf-to-images"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  PDF to Images →
                </Link>
                <Link
                  href="/tools/reduce-image-size-in-kb"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Reduce Image Size in KB →
                </Link>
                <Link
                  href="/tools/compress-image"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Compress Image →
                </Link>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-[4px] border border-gray-200 text-xs text-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">100% Private</span>
                  <span className="text-[11px] text-gray-500">Processed locally in browser</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">3 Presets + Custom</span>
                  <span className="text-[11px] text-gray-500">Low, Recommended, and High</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Honest Metrics</span>
                  <span className="text-[11px] text-gray-500">Real before &amp; after size reporting</span>
                </div>
              </div>
            </div>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                  Related PDF &amp; Image Tools
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {relatedTools.map((relTool) => (
                    <ToolButton key={relTool.id} tool={relTool} />
                  ))}
                </div>
              </div>
            )}

            {/* Comprehensive SEO Article Section */}
            <article className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs text-gray-700">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                How to Compress PDF Files Online Without Losing Quality
              </h2>
              <p className="text-sm mb-5 leading-relaxed">
                Whether you are trying to email a large scanned document or upload a resume to a government portal (like SSC, UPSC, or IBPS), large PDF files can be a massive headache. SizeSnap&apos;s <strong>PDF Compressor</strong> lets you easily reduce the file size of your documents directly in your browser. Because processing happens locally, your sensitive documents—like bank statements and legal forms—are <strong>never uploaded</strong> to any external server.
              </p>
              
              <h3 className="text-base font-bold text-gray-800 mb-3">Step-by-Step Compression Guide:</h3>
              <ol className="list-decimal pl-5 mb-6 space-y-2 text-sm">
                <li><strong>Upload Your PDF:</strong> Click the upload button to select the heavy PDF file you wish to shrink.</li>
                <li><strong>Choose Compression Mode:</strong> Select <em>Visual Downsampling</em> for scanned image-heavy PDFs (which often take up the most space) or <em>Structural Stream Optimizer</em> for text-based documents.</li>
                <li><strong>Set Compression Level:</strong> Pick from our presets: <strong>Low</strong> (high quality, minimal compression), <strong>Recommended</strong> (balanced), or <strong>High</strong> (maximum compression, perfect for strict 100KB/500KB portal limits).</li>
                <li><strong>Download Optimized File:</strong> Our engine will crunch the file size in seconds. Click download to get your newly optimized, lightweight PDF.</li>
              </ol>

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                Key Features of SizeSnap PDF Optimizer
              </h2>
              <ul className="list-disc pl-5 mb-6 space-y-2 text-sm">
                <li><strong>100% Client-Side Privacy:</strong> Your files never leave your device. Our JavaScript engine (powered by pdf-lib and pdf.js) does all the heavy lifting locally.</li>
                <li><strong>Dual-Engine Technology:</strong> We uniquely offer two compression methods. Structural optimization removes redundant metadata streams, while Visual downsampling actually recompresses embedded heavy images to lower DPIs (96, 120, or 150).</li>
                <li><strong>No Watermarks:</strong> Completely free to use with zero hidden fees, and we never add annoying watermarks to your documents.</li>
              </ul>
              
              <p className="text-sm leading-relaxed">
                If your PDF is still too large after compression, it might be because the original document contains extremely high-resolution images. In such cases, use our <em>High Compression</em> preset and slide the Image Quality down to 30%. SizeSnap remains the fastest, most private way to optimize your PDFs for web upload and fast email transmission.
              </p>
            </article>

            {/* FAQ Section */}
            <div className="mt-4 text-center">
  <Link href="/#directory" className="text-sm text-[#414FA8] hover:underline">Explore all tools →</Link>
</div>
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

          {/* Desktop Right Sidebar */}
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
