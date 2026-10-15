import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { PassportPhotoMaker } from '@/components/tool-ui/PassportPhotoMaker';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ChevronRight, HelpCircle, Lock, Zap, Shield } from 'lucide-react';
import { FAQSchema, SoftwareAppSchema } from '@/components/SeoSchemas';

export const metadata: Metadata = {
  title: 'Passport Photo Maker Online (3.5 x 4.5 cm) - SSC, UPSC, Govt Exams (20KB - 50KB) | SizeSnap',
  description:
    'Free online passport size photo maker. Resize & crop photos to official 3.5×4.5 cm, 2×2 inches (US Visa), stamp size, 20KB-50KB for SSC CGL, UPSC, PAN Card, admit cards with printable A4 sheets.',
  keywords: [
    'passport photo maker online',
    'passport size photo maker 3.5 x 4.5 cm',
    'ssc cgl photo resizer 20kb to 50kb',
    'passport photo with name and date',
    'upsc photo resizer online',
    'indian passport photo size in cm',
    'passport photo 20kb to 50kb online',
    'printable a4 passport photo sheet',
    'us visa photo maker 2x2 inches',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/passport-photo-maker',
  },
  openGraph: {
    title: 'Passport Photo Maker Online (3.5 x 4.5 cm) for SSC, UPSC, Govt Exams | SizeSnap',
    description:
      'Crop & resize photos to official 3.5×4.5 cm, 2×2 inch and 20KB to 50KB for SSC CGL, UPSC, Govt exams. Free printable A4 sheet.',
    url: 'https://www.sizesnap.in/tools/passport-photo-maker',
    type: 'website',
  },
};

const RELATED_SLUGS = [
  'reduce-image-size-in-kb',
  'resize-image-pixel',
  'compress-image',
  'resize-in-centimeters',
  'resize-image-3-5cm-4-5cm',
  'resize-signature',
];

const FAQS = [
  {
    q: 'What is the official photo size for an Indian Passport & Visa?',
    a: 'The standard Indian passport photo dimension is 3.5 cm × 4.5 cm (35 mm × 45 mm). At 300 DPI print quality, this equals 413 × 531 pixels. The face should occupy 70% to 80% of the photograph with a clear view of both ears and shoulders.',
  },
  {
    q: 'How do I resize a passport photo to 20KB – 50KB for SSC CGL & Govt exam portals?',
    a: 'Government exam portals like SSC (CGL, CHSL, MTS, GD), UPSC, and State PSC require photographs strictly between 20 KB and 50 KB. Once you crop your 3.5 × 4.5 cm photo here, use our "Reduce Image Size in KB" tool to compress it instantly to under 50KB without losing face clarity.',
  },
  {
    q: 'Can I use this for SSC, UPSC, Railway, and State PSC application forms?',
    a: 'Yes. Most government exams specify 3.5 × 4.5 cm dimensions and file sizes between 20KB and 50KB. SizeSnap applies precise biometric face guides and ensures the correct pixel resolution for error-free online portal submission.',
  },
  {
    q: 'What are the dimensions for US Visa and OCI card photos?',
    a: 'US Visa and OCI cards require a square 2 × 2 inches (51 mm × 51 mm) photograph. At 300 DPI, the digital dimensions are exactly 600 × 600 pixels against a plain white or off-white background.',
  },
  {
    q: 'How do I print multiple passport photos on an A4 sheet?',
    a: 'After framing your photo, click "Generate A4 Multi-Photo Sheet". SizeSnap arranges up to 30 copies on a standard A4 page with cutting guides. When printing, select "Actual Size" or "100% Scale" in your printer dialogue (never choose "Fit to page") to ensure accurate centimeter dimensions on paper.',
  },
  {
    q: 'Does SizeSnap upload or store my biometric photo on servers?',
    a: 'No. SizeSnap works 100% client-side inside your browser using HTML5 Canvas. Your personal photographs and biometric face data never leave your device and are never uploaded to any remote server.',
  },
];

export default function PassportPhotoMakerPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      {/* Structured Data for Google Rich Snippets */}
      <FAQSchema faqs={FAQS} />
      <SoftwareAppSchema
        name="SizeSnap Passport Photo Maker"
        description="Free online passport photo maker. Crop & resize photos to official 3.5x4.5 cm, 2x2 inches, and generate printable A4 sheets for SSC, UPSC, and visa forms."
        url="https://www.sizesnap.in/tools/passport-photo-maker"
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
          <span className="text-gray-800 font-semibold">Passport Photo Maker</span>
        </nav>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Header Box */}
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                Passport Photo Maker Online (3.5 × 4.5 cm)
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Crop and format photos for SSC, UPSC, Govt Exams, PAN Card &amp; Visas. Add Name &amp; Date of photo (DOP), compress to 20KB–50KB, and export printable A4 or 4×6 photo paper sheets.
              </p>
            </div>

            {/* Interactive Passport Photo Maker Engine */}
            <PassportPhotoMaker />


            {/* Internal Sister Tool Links */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200">
              <span className="text-xs font-bold text-gray-800 block mb-2">
                Need specific file size or pixel adjustments?
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/tools/reduce-image-size-kb"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Compress to 20KB / 50KB for Govt Portals →
                </Link>
                <Link
                  href="/tools/resize-image-pixel"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Resize Image by Pixels →
                </Link>
                <Link
                  href="/tools/compress-image"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  General Image Compressor →
                </Link>
              </div>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-white p-4 rounded-[4px] border border-gray-200 text-xs text-gray-700">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800 text-[11px] sm:text-xs">Name &amp; Date Strip</span>
                  <span className="text-[10px] text-gray-500">SSC &amp; Govt exam format</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800 text-[11px] sm:text-xs">20KB – 50KB Ready</span>
                  <span className="text-[10px] text-gray-500">Auto portal compressor</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800 text-[11px] sm:text-xs">A4 &amp; 4×6 Sheets</span>
                  <span className="text-[10px] text-gray-500">Cut-guides for printing</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Shield className="h-3.5 w-3.5" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800 text-[11px] sm:text-xs">100% Client-Side</span>
                  <span className="text-[10px] text-gray-500">Photos stay on your device</span>
                </div>
              </div>
            </div>

            {/* Related Tools */}
            {relatedTools.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
                <h2 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                  Related Passport, Exam &amp; Signature Tools
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {relatedTools.map((relTool) => (
                    <ToolButton key={relTool.id} tool={relTool} />
                  ))}
                </div>
              </div>
            )}

            {/* Comprehensive SEO Article Section (Inspired by Pi7) */}
            <article className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs text-gray-700">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                How to Make Passport Size Photos Online
              </h2>
              <p className="text-sm mb-5 leading-relaxed">
                Creating perfect passport-size images for government exams (SSC, UPSC, State PSC), university applications, or official documents is now effortless with the <strong>SizeSnap Passport Photo Maker</strong>. Our client-side tool allows you to crop, frame, and download highly accurate biometric photos instantly without uploading them to any external server.
              </p>
              
              <h3 className="text-base font-bold text-gray-800 mb-3">Step-by-Step Guide:</h3>
              <ol className="list-decimal pl-5 mb-6 space-y-2 text-sm">
                <li><strong>Upload Your Photo:</strong> Select a clear, front-facing image taken against a light or plain background.</li>
                <li><strong>Select Standard Size:</strong> Choose your required dimensions. We offer standard presets like <strong>3.5 × 4.5 cm (Indian Standard)</strong>, 2 × 2 inches (US Visa), or custom stamp sizes.</li>
                <li><strong>Align with Biometric Guides:</strong> Use our built-in face and shoulder guidelines to frame the photo perfectly according to official standards.</li>
                <li><strong>Download or Print:</strong> Download the single cropped image for online portal submissions, or generate a high-resolution <strong>A4 Sheet containing multiple copies</strong> ready for home or cyber-cafe printing.</li>
              </ol>

              <h3 className="text-base font-bold text-gray-800 mb-3">Essential File Size Adjustments</h3>
              <p className="text-sm mb-6 leading-relaxed">
                While framing your photo to the exact 3.5cm × 4.5cm dimensions is crucial, most online application portals (like SSC, IBPS, and RRB) also require strict file size limits, usually between <strong>20KB and 50KB</strong>. Once you download your passport photo, you can instantly run it through our <Link href="/tools/compress-image-to-50kb" className="text-[#414FA8] hover:underline font-medium">Compress to 50KB Tool</Link> to ensure it meets exact web upload specifications.
              </p>

              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">
                Key Features of SizeSnap Passport Photo Maker
              </h2>
              <ul className="list-disc pl-5 mb-6 space-y-2 text-sm">
                <li><strong>100% Privacy Preserved:</strong> Unlike other tools, your biometric face data is never uploaded to the cloud. Everything processes securely within your browser&apos;s memory using HTML5.</li>
                <li><strong>Auto-Generated Print Sheets:</strong> Preparing for a physical form submission? Generate an A4 print-ready layout containing up to 30 well-spaced copies with precision cut-lines.</li>
                <li><strong>Zero Loss of Quality:</strong> We use advanced local WASM algorithms to maintain high-resolution DPI suitable for studio-quality color printing.</li>
                <li><strong>Global Standard Sizes:</strong> Supports multi-country dimensions including India, USA, UK, Canada, and Custom ID formats.</li>
              </ul>
              
              <p className="text-sm leading-relaxed">
                Whether you are an Indian student applying for competitive exams, a cyber cafe owner looking for quick multi-print grids, or just someone needing an instant US visa photo, SizeSnap&apos;s Passport Size Photo Maker is the only utility you will ever need. Experience the convenience of generating compliant ID photos effortlessly while ensuring top-tier accuracy and total data security.
              </p>
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
