import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { CompressPdfTool } from '@/components/tool-ui/CompressPdfTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield } from 'lucide-react';
import { KbTargetPills } from '@/components/KbTargetPills';

export const metadata: Metadata = {
  title: 'Compress PDF Online - Reduce PDF File Size Free | SizeSnap',
  description:
    'Compress and reduce PDF file size online to exact KB targets (50KB, 100KB, 140KB, 200KB, 500KB). Ideal for government portals (SSC, UPSC, DigiLocker) and email attachments. 100% private in browser.',
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/compress-pdf',
  },
  openGraph: {
    title: 'Compress PDF Online - Reduce PDF File Size Free | SizeSnap',
    description:
      'Reduce PDF file size quickly without watermarks, signup, or server uploads. Secure browser-based compression.',
    url: 'https://www.sizesnap.in/tools/compress-pdf',
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
    q: 'How do I compress a PDF file to a specific KB size (e.g., 140KB, 200KB, 500KB) for govt portals?',
    a: 'Upload your PDF document, enter your exact target size in KB (or click quick presets like 100KB, 140KB, 200KB, 500KB, or 1MB), and click "Compress PDF". SizeSnap runs an automated multi-scale quality search locally to fit your document cleanly under portal upload limits.',
  },
  {
    q: 'Does compressing a PDF guarantee a smaller file size?',
    a: 'If your target KB is lower than your input PDF, SizeSnap automatically scales page resolution and JPEG compression until it reaches or approaches that target. For tiny multi-page limits (e.g. a 10-page document compressed under 100KB), image sharpness will be reduced to fit the byte budget, and SizeSnap shows exact before/after metrics before download.',
  },
  {
    q: 'Will text inside my compressed PDF remain selectable?',
    a: 'To hit strict KB targets required by SSC, UPSC, and scholarship portals reliably, SizeSnap renders PDF pages into optimized JPEG streams inside a clean PDF container. Visual appearance and print readability are preserved, while selectable vector text becomes image-based.',
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
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
                Reduce PDF file size to an exact KB target (e.g., 100KB, 140KB, 200KB, 500KB) with automatic scale and quality optimization. 100% private in your browser.
              </p>
            </div>

            {/* Quick PDF Target KB Presets Network */}
            <KbTargetPills type="pdf" activeSlug="compress-pdf" />

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
                  <span className="font-semibold block text-gray-800">Target Size in KB</span>
                  <span className="text-[11px] text-gray-500">Enter exactly how many KB you want</span>
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
                <li><strong>Enter Target Size:</strong> Simply type in the maximum size you need in KB (e.g., 100, 500, or 1000 for 1MB).</li>
                <li><strong>Let the Tool Work:</strong> Click &quot;Compress PDF&quot;. Our smart algorithm will automatically adjust the internal resolution and image quality to hit your target size.</li>
                <li><strong>Download Optimized File:</strong> Click download to get your newly optimized, lightweight PDF instantly.</li>
              </ol>

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                Key Features of SizeSnap PDF Optimizer
              </h2>
              <ul className="list-disc pl-5 mb-6 space-y-2 text-sm">
                <li><strong>100% Client-Side Privacy:</strong> Your files never leave your device. Our JavaScript engine (powered by pdf-lib and pdf.js) does all the heavy lifting locally.</li>
                <li><strong>Target KB Accuracy:</strong> Stop guessing with &quot;Low/High&quot; quality presets. Just tell us how many KB you want, and we&apos;ll do the math.</li>
                <li><strong>No Watermarks:</strong> Completely free to use with zero hidden fees, and we never add annoying watermarks to your documents.</li>
              </ul>
              
              <p className="text-sm leading-relaxed">
                If your original PDF is massive (like 20MB) and you try to compress it to 100KB, the algorithm will heavily reduce the image quality to achieve the target size. For best readability, we recommend setting realistic targets (like 500KB to 1MB) for multi-page scanned documents.
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
