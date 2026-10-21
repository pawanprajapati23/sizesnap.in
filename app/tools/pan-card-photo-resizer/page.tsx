import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { PanCardResizerTool } from '@/components/tool-ui/PanCardResizerTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import {
  ChevronRight,
  HelpCircle,
  Lock,
  Zap,
  Shield,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  ArrowRight,
  FileCheck,
  Camera,
  PenTool,
} from 'lucide-react';
import { FAQSchema, SoftwareAppSchema, HowToSchema } from '@/components/SeoSchemas';

export const metadata: Metadata = {
  title: 'PAN Card Photo & Signature Resizer Online Free (213x213 px, 300 DPI) | SizeSnap',
  description:
    'Free online PAN card photo and signature resizer for NSDL and UTIITSL portals. Resize photo to 213x213 pixels (under 50KB) and signature to 400x213 pixels (under 30KB) with 300 DPI. 100% client-side private.',
  keywords: [
    'pan card photo resizer',
    'pan card photo size',
    'pan card signature resizer',
    '213x213 photo resizer',
    'pan card photo and signature resize online',
    'pan card photo resize 300 dpi',
    'nsdl pan card photo size',
    'uti pan card photo resizer',
    'resize image to pan card size',
    'pan card signature size 400x213',
    'pan card photo maker free',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/pan-card-photo-resizer',
  },
  openGraph: {
    title: 'PAN Card Photo & Signature Resizer Online Free (213x213 px, 300 DPI) | SizeSnap',
    description:
      'Online PAN card photo (213x213 px, <50KB) and signature (400x213 px, <30KB) resizer for NSDL & UTIITSL. 300 DPI, zero upload, 100% free.',
    url: 'https://www.sizesnap.in/tools/pan-card-photo-resizer',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PAN Card Photo & Signature Resizer Online Free | SizeSnap',
    description:
      'Instant NSDL & UTIITSL PAN card photo (213x213) and signature (400x213) resizer with 300 DPI.',
  },
};

const RELATED_SLUGS = [
  'passport-photo-maker',
  'resize-image-3-5cm-4-5cm',
  'compress-image-to-20kb',
  'compress-image-to-50kb',
  'photo-and-signature-joiner',
  'reduce-image-size-in-kb',
];

const FAQS = [
  {
    q: 'What are the exact photo specifications for NSDL and UTIITSL PAN Card applications?',
    a: 'For both Protean (NSDL) and UTIITSL online PAN card applications, your photograph must be exactly 213 × 213 pixels (or 3.5 cm × 2.5 cm), formatted at 300 DPI in color, with a file size strictly under 50 KB (SizeSnap recommends between 25 KB and 40 KB for optimal clarity and instant server acceptance).',
  },
  {
    q: 'What are the required dimensions for a PAN card signature upload?',
    a: 'The PAN card signature must be 400 × 213 pixels (or 2 cm × 4.5 cm) at 300 DPI resolution. The file size must be strictly under 30 KB (SizeSnap targets ~20 KB). The signature should be signed with black ink on plain white paper for sharp contrast.',
  },
  {
    q: 'Why does the NSDL / UTI portal show "Invalid File Dimension or DPI" error?',
    a: 'The Protean and UTIITSL portal upload engines validate the pixel header and DPI metadata. If your image resolution is 72 DPI (standard mobile camera default) or the pixel canvas is not exactly 213×213, the portal instantly rejects it. SizeSnap automatically formats your image to exact 213×213 pixels and 300 DPI to guarantee 100% acceptance.',
  },
  {
    q: 'Is my Aadhaar card or PAN applicant photo uploaded to any third-party server?',
    a: 'Never. SizeSnap runs entirely inside your web browser using HTML5 Canvas client-side technology. Your biometric photographs and legal signatures never leave your device and are never transmitted over the internet or saved on any database.',
  },
  {
    q: 'How do I take a clear photo of my signature for PAN card upload?',
    a: 'Sign clearly using a black ballpoint or gel pen on a clean, unlined white sheet of paper. Take a photo in bright, even daylight without shadows or flash reflection. Upload it to SizeSnap\'s PAN Card Signature tool, which will automatically crop, sharpen, and compress it to the exact 400×213 px and <30KB standard.',
  },
  {
    q: 'What is the difference between NSDL and UTIITSL photo requirements?',
    a: 'Both government agencies follow the identical technical specifications: 213×213 px photo (<50KB) and 400×213 px signature (<30KB) at 300 DPI in JPEG/JPG format. SizeSnap images comply with both portals seamlessly.',
  },
];

const HOW_TO_STEPS = [
  'Select either the "PAN Card Photo" (213×213 px) or "PAN Card Signature" (400×213 px) tab.',
  'Upload or drag-and-drop your image file (JPG, PNG, or WebP).',
  'Adjust the zoom/crop alignment slider so your face or signature is neatly centered.',
  'Verify the target file size (under 50KB for photo, under 30KB for signature).',
  'Click "Download" to save your portal-ready 300 DPI JPEG image instantly.',
];

export default function PanCardResizerPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      {/* Google Structured Data / Rich Snippets */}
      <FAQSchema faqs={FAQS} />
      <SoftwareAppSchema
        name="SizeSnap PAN Card Photo & Signature Resizer"
        description="Free online PAN card photo (213x213 px, under 50KB) and signature (400x213 px, under 30KB) resizer for NSDL and UTIITSL portals with 300 DPI resolution."
        url="https://www.sizesnap.in/tools/pan-card-photo-resizer"
      />
      <HowToSchema
        name="How to Resize Photo & Signature for PAN Card (NSDL / UTIITSL)"
        description="Step-by-step instructions to convert your photo to 213x213 px under 50KB and signature to 400x213 px under 30KB for PAN card registration."
        stepByStep={HOW_TO_STEPS}
      />

      <Navbar />

      <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-[#414FA8] font-medium transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <Link href="/#directory" className="hover:text-[#414FA8] font-medium transition-colors">
            Image Tools
          </Link>
          <ChevronRight className="h-3 w-3 text-gray-400" />
          <span className="text-gray-800 font-semibold">PAN Card Photo Resizer</span>
        </nav>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Header Box */}
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 bg-[#EEF1FB] text-[#414FA8] text-[11px] font-bold rounded uppercase tracking-wide">
                  Official NSDL &amp; UTIITSL Spec
                </span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-semibold rounded border border-emerald-200">
                  300 DPI Guaranteed
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                PAN Card Photo &amp; Signature Resizer Online Free
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Resize photo to exact <strong>213 × 213 pixels (under 50KB)</strong> and signature to{' '}
                <strong>400 × 213 pixels (under 30KB)</strong> at <strong>300 DPI</strong>. Zero distortion,
                guaranteed portal acceptance for Protean (NSDL) and UTIITSL. 100% browser-side private.
              </p>
            </div>

            {/* Interactive PAN Card Resizer Component */}
            <PanCardResizerTool />

            {/* Official Specifications Table */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#414FA8]" />
                Official PAN Card Document Requirements (NSDL &amp; UTIITSL)
              </h2>
              <p className="text-xs text-gray-600 mb-4">
                Both Protean (formerly NSDL e-Gov) and UTIITSL adhere to strict technical guidelines. Any deviation
                in pixels or file size results in an immediate upload error on the portal.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-gray-200 rounded">
                  <thead className="bg-gray-50 text-gray-700 font-semibold border-b border-gray-200">
                    <tr>
                      <th className="p-3">Document Type</th>
                      <th className="p-3">Pixel Dimensions</th>
                      <th className="p-3">Physical Size</th>
                      <th className="p-3">Resolution (DPI)</th>
                      <th className="p-3">Max File Size</th>
                      <th className="p-3">Format</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-gray-600">
                    <tr className="hover:bg-gray-50/50">
                      <td className="p-3 font-bold text-gray-900 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#414FA8]" />
                        Applicant Photo
                      </td>
                      <td className="p-3 font-semibold text-[#414FA8]">213 × 213 px</td>
                      <td className="p-3">3.5 × 2.5 cm</td>
                      <td className="p-3 font-semibold">300 DPI</td>
                      <td className="p-3 font-bold text-emerald-700">&lt; 50 KB</td>
                      <td className="p-3">JPEG / JPG</td>
                    </tr>
                    <tr className="hover:bg-gray-50/50">
                      <td className="p-3 font-bold text-gray-900 flex items-center gap-1.5">
                        <PenTool className="w-3.5 h-3.5 text-[#414FA8]" />
                        Applicant Signature
                      </td>
                      <td className="p-3 font-semibold text-[#414FA8]">400 × 213 px</td>
                      <td className="p-3">2.0 × 4.5 cm</td>
                      <td className="p-3 font-semibold">300 DPI</td>
                      <td className="p-3 font-bold text-emerald-700">&lt; 30 KB</td>
                      <td className="p-3">JPEG / JPG</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Step-by-Step Guide */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#414FA8]" />
                How to Resize Photo &amp; Signature for PAN Card Online
              </h2>
              <ol className="list-decimal list-inside space-y-2.5 text-xs sm:text-sm text-gray-600 leading-relaxed">
                {HOW_TO_STEPS.map((step, idx) => (
                  <li key={idx} className="pl-1">
                    <span className="font-semibold text-gray-800">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-[#EEF1FB] flex items-center justify-center text-[#414FA8] shrink-0 mt-0.5">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900">100% Client-Side Private</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Your photo &amp; signature never leave your device. All processing happens in your browser.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900">Exact 300 DPI Resolution</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Preconfigured to 300 DPI to eliminate &quot;Invalid DPI&quot; rejection errors on NSDL &amp; UTI.
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-[4px] border border-gray-200 shadow-xs flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-900">Instant 1-Click Export</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Automatic iterative compression ensures file size remains strictly under 50KB / 30KB.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Tools Grid */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h2 className="text-sm sm:text-base font-bold text-gray-900 mb-3">
                Related Document &amp; Exam Tools
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {relatedTools.map((tool) => (
                  <Link
                    key={tool.id}
                    href={`/tools/${tool.slug}`}
                    className="p-3 border border-gray-200 rounded-[4px] hover:border-[#414FA8] hover:shadow-xs transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <span className="text-xs font-bold text-gray-800 group-hover:text-[#414FA8] block mb-1">
                        {tool.name}
                      </span>
                      <span className="text-[11px] text-gray-500 line-clamp-2">
                        {tool.shortDescription}
                      </span>
                    </div>
                    <span className="text-[10px] font-semibold text-[#414FA8] mt-2 flex items-center gap-1">
                      Open Tool <ArrowRight className="w-2.5 h-2.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#414FA8]" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Frequently Asked Questions (PAN Card Photo &amp; Signature)
                </h2>
              </div>
              <div className="space-y-4 divide-y divide-gray-100">
                {FAQS.map((faq, index) => (
                  <div key={index} className={index > 0 ? 'pt-4' : ''}>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5">{faq.q}</h3>
                    <p className="text-xs text-gray-600 leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="w-full lg:col-span-4 xl:col-span-3">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
