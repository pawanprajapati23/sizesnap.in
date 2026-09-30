import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { GenerateSignatureTool } from '@/components/tool-ui/GenerateSignatureTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Generate Digital Signature Online | SizeSnap',
  description: 'Draw and create your digital signature online for free. Download as transparent PNG or white background JPG for official documents and exam forms.',
};

const FAQS = [
  {
    q: 'Is it safe to draw my signature online?',
    a: 'Yes, absolutely. SizeSnap processes your drawing entirely inside your browser (Client-Side). Your signature is never sent to or stored on any server. It exists only on your device.',
  },
  {
    q: 'Can I download my signature with a transparent background?',
    a: 'Yes! You can choose to download your signature as a Transparent PNG (great for pasting onto digital PDFs) or a standard JPG with a white background (best for uploading to exam portals).',
  },
  {
    q: 'Can I change the ink color of my signature?',
    a: 'Yes, you can easily switch between standard Black, Blue, and Red ink colors before downloading your digital signature.',
  },
];

export default function GenerateSignaturePage() {
  const relatedTools = ALL_TOOLS.filter((t) => ['reduce-image-size-in-kb', 'passport-photo-maker', 'text-to-handwriting', 'add-watermark-pdf', 'merge-photo-signature'].includes(t.slug));

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#414FA8] flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> All Tools
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Generate Signature</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Generate Digital Signature
          </h1>
          <p className="text-sm text-gray-600 mb-6 leading-relaxed">
            Draw your signature digitally using your mouse, trackpad, or touchscreen. Perfect for PDF forms, online applications, and exam portals.
          </p>

          <GenerateSignatureTool />
          
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
             <ShieldCheck className="w-4 h-4 text-emerald-500" />
             No data is saved. 100% secure in your browser.
          </div>
        </div>

        {/* Comprehensive SEO Article Section */}
        <article className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs text-gray-700 mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
            How to Create a Digital Signature Online Free
            </h2>
            <p className="text-sm mb-5 leading-relaxed">
            Signing physical documents and scanning them is a hassle. SizeSnap's <strong>Digital Signature Maker</strong> lets you draw your e-signature smoothly using your device's touchscreen or mouse. Whether you need a transparent signature to stamp onto a PDF invoice, or a crisp black-ink signature on a white background for government forms (like SSC or UPSC), our tool gets the job done securely.
            </p>
            
            <h3 className="text-base font-bold text-gray-800 mb-3">Step-by-Step Guide to Draw Signature:</h3>
            <ol className="list-decimal pl-5 mb-6 space-y-2 text-sm">
            <li><strong>Draw on the Canvas:</strong> Use your mouse or finger to draw your signature in the blank white box provided.</li>
            <li><strong>Choose Ink Color:</strong> Click on Blue, Black, or Red ink to match official requirements.</li>
            <li><strong>Adjust Pen Thickness:</strong> Use the slider to make the stroke thinner or thicker depending on your preference.</li>
            <li><strong>Download Format:</strong> Select "Transparent PNG" if you plan to overlay it on a document, or "White Background JPG" if you need to upload it directly to an application portal.</li>
            </ol>

            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
            Why Use SizeSnap's E-Signature Tool?
            </h2>
            <p className="text-sm leading-relaxed">
            Unlike many other tools, we use high-fidelity HTML5 Canvas rendering for smooth, natural curves that look exactly like a real pen. Plus, for absolute privacy, the signature is rendered entirely within your browser. You don't have to worry about your signature being stolen because it is never transmitted over the internet to any server.
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
              Related Document Tools
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
