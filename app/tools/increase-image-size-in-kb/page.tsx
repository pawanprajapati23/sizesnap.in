import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { IncreaseImageSizeTool } from '@/components/tool-ui/IncreaseImageSizeTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Increase Image Size in KB (Exact Size) | SizeSnap',
  description: 'Increase your photo or signature size to a specific KB (e.g. 50KB, 100KB, 200KB) online for free without losing quality. Perfect for govt portals.',
};

const FAQS = [
  {
    q: 'Why do I need to increase image size in KB?',
    a: 'Many official portals like SSC, UPSC, and passport applications have a minimum size requirement (e.g., must be between 20KB and 50KB). If your scanned signature is 10KB, the portal will reject it, and you must increase its size to at least 20KB.',
  },
  {
    q: 'Will increasing the file size ruin the image quality?',
    a: 'No! SizeSnap uses smart upscaling and high-quality JPEG rendering to increase file size without causing blur or pixelation. We preserve the original clarity.',
  },
  {
    q: 'How does this tool increase the KB of a photo?',
    a: 'Our algorithm safely increases the image dimensions and applies maximum JPEG quality to organically increase the file size. If needed, we add safe, standard padding that all portals accept.',
  },
];

export default function IncreaseImageSizePage() {
  const relatedTools = ALL_TOOLS.filter((t) => ['reduce-image-size-in-kb', 'passport-photo-maker', 'generate-signature', 'compress-image', 'resize-image-pixel'].includes(t.slug));

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#414FA8] flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> All Tools
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Increase Image Size in KB</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Increase Image Size in KB
          </h1>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Upload your photo or signature, enter the target file size (e.g. 100 KB), and our smart algorithm will upscale it to hit that exact size requirement without blurriness. 
          </p>

          <IncreaseImageSizeTool />
          
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
             <ShieldCheck className="w-4 h-4 text-emerald-500" />
             Processed locally in your browser. 100% private.
          </div>
        </div>

        {/* Comprehensive SEO Article Section */}
        <article className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs text-gray-700 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
            How to Increase Photo Size in KB Online (Target KB)
            </h2>
            <p className="text-sm mb-5 leading-relaxed">
            Sometimes your scanned passport photo or signature is too small. Government job portals like SSC, UPSC, and IBPS often have strict minimum size limits (for example, &quot;Image size must be between 20KB and 50KB&quot;). If your photo is just 12KB, the system will throw an error. SizeSnap&apos;s <strong>Increase Image Size</strong> tool allows you to safely enlarge your photo to hit the exact target KB without installing heavy software like Photoshop.
            </p>
            
            <h3 className="text-base font-bold text-gray-800 mb-3">Step-by-Step Guide to Enlarge Image Size:</h3>
            <ol className="list-decimal pl-5 mb-6 space-y-2 text-sm">
            <li><strong>Upload Your Image:</strong> Click to browse and upload the small JPG/PNG file you want to increase.</li>
            <li><strong>Enter Target Size:</strong> Type the desired size in KB (e.g., 50, 100, or 200).</li>
            <li><strong>Upscale &amp; Expand:</strong> Click the button. Our tool will optimize the image dimensions and quality to smoothly reach your requested size.</li>
            <li><strong>Download:</strong> Your newly enlarged, portal-ready image will be downloaded instantly.</li>
            </ol>

            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
            Why Do You Need to Increase KB?
            </h2>
            <p className="text-sm leading-relaxed">
            Most forms use automated scripts to verify uploads. If an image is too small (e.g., under 10KB), the script assumes it&apos;s low quality or corrupted. By organically increasing the DPI (Dots Per Inch), scaling up the dimensions, and maximizing the JPEG quality factor, SizeSnap ensures your application form accepts the document on the first try.
            </p>
        </article>

        {/* FAQ Section */}
        <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <HelpCircle className="h-5 w-5 text-[#414FA8]" />
            <h2 className="text-base font-bold text-gray-900">
                Frequently Asked Questions
            </h2>
            </div>
            <div className="space-y-4">
            {FAQS.map((faq, idx) => (
                <div key={idx} className="border-b border-gray-50 pb-3 last:border-b-0 last:pb-0">
                <h3 className="text-sm font-semibold text-gray-800 mb-1">{faq.q}</h3>
                <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
            ))}
            </div>
        </div>

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <div className="bg-white p-5 rounded-[4px] border border-gray-200 shadow-xs">
            <h2 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">
              Related Photo Resizing Tools
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
              {relatedTools.map((relTool) => (
                <ToolButton key={relTool.id} tool={relTool} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
