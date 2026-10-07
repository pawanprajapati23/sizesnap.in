import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { CompressPdfTool } from '@/components/tool-ui/CompressPdfTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { HelpCircle, Lock, Zap, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Compress PDF to 140KB Online Free | SizeSnap',
  description:
    'Easily compress PDF to 140KB online for free. Ideal for strict government exams, signature uploads, and fast file sharing. 100% private in browser.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/compress-pdf-140kb',
  },
};

const RELATED_SLUGS = [
  'compress-pdf',
  'image-to-pdf',
  'pdf-to-images',
  'compress-image-to-10kb',
  'reduce-image-size-in-kb',
];

const FAQS = [
  {
    q: 'How to compress PDF to 140KB online?',
    a: 'Simply upload your PDF file above, and the tool will automatically target 140KB. Click "Compress PDF" and download your extremely optimized 140KB PDF file instantly.',
  },
  {
    q: 'Will the text be readable if I compress a PDF to 140KB?',
    a: '140KB is a very common requirement for uploading marksheets, ID proofs, and certificates on various government recruitment portals (like SSC, UPSC, and State PSCs). Our smart algorithm ensures that your scanned documents remain completely readable while meeting the 140KB threshold.',
  },
  {
    q: 'Is my data safe when compressing PDFs?',
    a: 'Yes! SizeSnap uses 100% client-side compression. Your PDF never leaves your device and is not uploaded to any external server. It is fully secure and private.',
  },
];

export default function CompressPdf140kbPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans selection:bg-[#414FA8]/20">
      <Navbar />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#414FA8]/5 to-transparent rounded-bl-full -z-10 pointer-events-none" />
              <div className="mb-4 flex items-center gap-2 text-sm text-gray-500">
                <Link href="/" className="hover:text-[#414FA8] transition-colors">Home</Link>
                <span>/</span>
                <Link href="/tools" className="hover:text-[#414FA8] transition-colors">Tools</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">Compress PDF to 140KB</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
                Compress PDF to 140KB
              </h1>
              <p className="text-base sm:text-lg text-gray-600 max-w-3xl leading-relaxed">
                Need your PDF exactly at 140KB? Our tool instantly shrinks your file to meet strict size limits for government job applications, exam portals, and signature uploads.
              </p>
            </div>

            {/* Tool Area */}
            <div id="tool-area" className="scroll-mt-24">
              <CompressPdfTool initialTargetKB={140} />
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
                  <span className="text-[11px] text-gray-500">Auto-set to 140KB</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Honest Metrics</span>
                  <span className="text-[11px] text-gray-500">Real before & after size</span>
                </div>
              </div>
            </div>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                  Related PDF & Image Tools
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
                Why Compress PDF to 140KB?
              </h2>
              <p className="text-sm mb-5 leading-relaxed">
                Many online portals, specifically for competitive exams and government forms in India, require you to upload ID proofs or marksheets in PDF format that is strictly under 150KB or exactly 140KB. Our dedicated <strong>140KB PDF Compressor</strong> ensures your file passes these exact size checks without trial and error.
              </p>
              
              <h3 className="text-base font-bold text-gray-800 mb-3">Step-by-Step Guide:</h3>
              <ol className="list-decimal pl-5 mb-6 space-y-2 text-sm">
                <li><strong>Upload Your PDF:</strong> Click the upload area to select the PDF file you need to shrink.</li>
                <li><strong>Verify Target Size:</strong> The tool is pre-configured to target 140KB. You can tweak it if needed.</li>
                <li><strong>Let the Tool Work:</strong> Click &quot;Compress PDF&quot;. The tool adjusts the file to meet the exact 140KB threshold.</li>
                <li><strong>Download Optimized File:</strong> Instantly save the compressed file and upload it to your portal.</li>
              </ol>

            </article>

            {/* FAQ Section */}
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
  );
}
