import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { DocumentScannerTool } from '@/components/tool-ui/DocumentScannerTool';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import {
  ChevronRight,
  HelpCircle,
  Lock,
  Camera,
  FileText,
  CheckCircle2,
  Zap,
  ShieldCheck,
  Smartphone,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Free Online Document Scanner - Mobile Camera Scan to PDF | SizeSnap',
  description:
    'Free online document scanner with mobile camera auto-crop & edge detection. Scan multiple paper pages, flatten perspective, remove shadow background, and export to clean multi-page PDF. 100% private, no signup, no watermark.',
  keywords: [
    'document scanner online',
    'scanner black and white',
    'remove shadow from document',
    'document scanner bw filter',
    'mobile camera document scanner',
    'camscanner online free',
    'scan document to pdf with camera',
    'free camscanner alternative no watermark',
    'auto crop document scanner online',
    'phone camera scanner',
    'multi page document scanner',
    'perspective correction document scanner',
    'scan paper to pdf offline browser',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/document-scanner',
  },
  openGraph: {
    title: 'Free Online Document Scanner - Mobile Camera Scan to PDF | SizeSnap',
    description:
      'Turn your phone camera into a smart document scanner. Auto-detect corners, crop table background, scan multiple pages, and download as clean PDF. 100% private in browser.',
    url: 'https://www.sizesnap.in/tools/document-scanner',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Document Scanner - Scan to PDF | SizeSnap',
    description:
      'Smart mobile document scanner with auto-crop & perspective correction. Scan multiple pages to PDF. Free, fast & 100% private.',
  },
};

const RELATED_SLUGS = [
  'crop-image',
  'image-to-pdf',
  'compress-pdf',
  'merge-pdf',
  'passport-photo-maker',
  'compress-image',
];

const FAQS = [
  {
    q: 'How does the SizeSnap Document Scanner work?',
    a: 'SizeSnap uses advanced computer vision (OpenCV.js) directly inside your web browser. When you aim your phone camera or upload a photo of a document, the tool automatically detects the 4 corners of the paper, crops away the bedsheet or table background, corrects the perspective angle to make it flat, sharpens the text, and lets you combine multiple pages into a clean PDF.',
  },
  {
    q: 'Is my document uploaded to any external server or cloud?',
    a: 'No, absolutely not. All edge detection, perspective warping, image cropping, and PDF compilation run 100% locally on your device hardware using HTML5 Canvas, WebAssembly, and JavaScript. Your confidential documents, Aadhaar cards, marksheets, and bank receipts never leave your phone or computer.',
  },
  {
    q: 'Can I scan multiple pages and combine them into one PDF?',
    a: 'Yes! After scanning or uploading your first page, simply click the "+ Add Page" button. You can scan up to 30 pages sequentially. You can preview, reorder pages with "Move Left" / "Move Right" buttons, re-scan any page if blurry, or delete unwanted pages before exporting as a single multi-page PDF.',
  },
  {
    q: 'Is this document scanner completely free without any watermark?',
    a: 'Yes, 100% free with no watermark. Unlike commercial apps like CamScanner that insert annoying "Scanned with CamScanner" watermarks or limit pages behind paywalls, SizeSnap produces completely clean, professional PDF documents without branding or hidden fees.',
  },
  {
    q: 'Can I manually adjust the corners if the auto-detection is not exact?',
    a: 'Yes. After capturing or uploading an image, the tool highlights the detected document boundary with 4 corner handles (Top-Left, Top-Right, Bottom-Right, Bottom-Left). You can easily drag any handle with your finger or mouse to fit the exact document edges before applying the final scan.',
  },
  {
    q: 'What should I do if my photo has heavy shadows or low contrast?',
    a: 'For best results, place the paper document on a contrasting background (e.g. white paper on a dark table or bedsheet), avoid placing your phone directly under a single overhead light bulb to prevent hand shadows, and keep the phone as parallel to the document as possible.',
  },
  {
    q: 'Which file formats can I download?',
    a: 'You can download your scans in three convenient formats: (1) Multi-page PDF containing all scanned pages in sequence, (2) ZIP archive containing high-resolution JPG images of each page, or (3) Single JPG image of any individual page.',
  },
];

export default function DocumentScannerPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  // JSON-LD Structured Data
  const jsonLdWebapp = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'SizeSnap Document Scanner',
    url: 'https://www.sizesnap.in/tools/document-scanner',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All (Mobile Android, iOS, Windows, macOS, Linux)',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
    description:
      'Free online document scanner with auto edge detection, perspective flattening, multi-page scan, and clean PDF export. Zero server uploads.',
    featureList: [
      'Mobile phone camera live edge detection',
      'Auto-perspective crop to flatten tilted document photos',
      'Multi-page scanning with page reordering and re-scan',
      'Single-click export to multi-page PDF or ZIP',
      '100% client-side privacy without watermarks',
    ],
  };

  const jsonLdFaq = {
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

  const jsonLdHowTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Scan Documents to PDF with Your Phone Camera Online',
    description:
      'Step-by-step tutorial on scanning paper documents, auto-cropping backgrounds, and downloading a clean PDF using SizeSnap.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Open Camera or Upload Photo',
        text: 'Click "Open Camera" to use your mobile camera or "Upload Image" to choose an existing photo of your document.',
      },
      {
        '@type': 'HowToStep',
        name: 'Auto-Detect Corners & Adjust',
        text: 'SizeSnap automatically detects the four corners of your document. Drag the corner handles if fine adjustment is needed.',
      },
      {
        '@type': 'HowToStep',
        name: 'Add Additional Pages',
        text: 'Tap "+ Add Page" to continue scanning remaining pages of your document or certificate.',
      },
      {
        '@type': 'HowToStep',
        name: 'Reorder & Export PDF',
        text: 'Review pages in the thumbnail strip, arrange order if necessary, and click "Download as PDF".',
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      {/* Structured Data Script Tags */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebapp) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
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
          <span className="text-gray-800 font-semibold">Document Scanner</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
            {/* Header Hero Card */}
            <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-[#414FA8] bg-[#EEF1FB] rounded">
                  Free CamScanner Alternative
                </span>
                <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" /> 100% In-Browser Privacy
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-2">
                Mobile Camera Document Scanner with Auto-Crop
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                Scan tilted paper documents with your phone camera. SizeSnap automatically detects the 4 corners, crops out the bedsheet or table background, corrects perspective distortion, and lets you add multiple pages to export a clean, watermark-free PDF.
              </p>
            </div>

            {/* Main Interactive Scanner Tool */}
            <DocumentScannerTool />

            {/* Quick Cross Links */}
            <div className="bg-white p-4 rounded-[4px] border border-gray-200">
              <span className="text-xs font-bold text-gray-800 block mb-2">
                Frequently Paired Tools:
              </span>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/tools/image-to-pdf"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Images to PDF →
                </Link>
                <Link
                  href="/tools/compress-pdf"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Compress PDF →
                </Link>
                <Link
                  href="/tools/crop-image"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Crop Image →
                </Link>
                <Link
                  href="/tools/merge-pdf"
                  className="px-3 py-1.5 rounded bg-[#EEF1FB] text-[#414FA8] hover:bg-[#E2E7F8] font-medium border border-[#9AA3C8]/40 transition-colors"
                >
                  Merge PDFs →
                </Link>
              </div>
            </div>

            {/* Core Feature Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-[4px] border border-gray-200 text-xs text-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">100% Confidential</span>
                  <span className="text-[11px] text-gray-500">Zero cloud uploads, completely offline</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Camera className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Smart Edge Detection</span>
                  <span className="text-[11px] text-gray-500">Auto-detects paper corners & flattens</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Multi-Page PDF</span>
                  <span className="text-[11px] text-gray-500">Scan 1 to 30 pages in single file</span>
                </div>
              </div>
            </div>

            {/* Step-by-Step Tutorial Card (High SEO Value) */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <BookOpen className="h-5 w-5 text-[#414FA8]" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  How to Scan Paper Documents with Phone Camera Online
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                <div className="p-3.5 rounded bg-[#FAFAFC] border border-gray-200 flex flex-col justify-between">
                  <div>
                    <span className="h-6 w-6 rounded-full bg-[#414FA8] text-white text-xs font-bold flex items-center justify-center mb-2">
                      1
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1">
                      Snap or Upload
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Tap &quot;Open Camera&quot; to take a live photo or &quot;Upload Image&quot; from your gallery.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded bg-[#FAFAFC] border border-gray-200 flex flex-col justify-between">
                  <div>
                    <span className="h-6 w-6 rounded-full bg-[#414FA8] text-white text-xs font-bold flex items-center justify-center mb-2">
                      2
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1">
                      Auto Edge Crop
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Our vision algorithm finds paper corners and removes surrounding table or bedsheet area.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded bg-[#FAFAFC] border border-gray-200 flex flex-col justify-between">
                  <div>
                    <span className="h-6 w-6 rounded-full bg-[#414FA8] text-white text-xs font-bold flex items-center justify-center mb-2">
                      3
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1">
                      Add More Pages
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Need multiple pages? Tap &quot;+ Add Page&quot; to scan page 2, 3, and so on.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 rounded bg-[#FAFAFC] border border-gray-200 flex flex-col justify-between">
                  <div>
                    <span className="h-6 w-6 rounded-full bg-[#414FA8] text-white text-xs font-bold flex items-center justify-center mb-2">
                      4
                    </span>
                    <h3 className="text-xs sm:text-sm font-bold text-gray-800 mb-1">
                      Download PDF
                    </h3>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Export all pages into a crisp, high-resolution PDF or ZIP archive instantly.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Table: SizeSnap vs CamScanner vs Traditional Apps */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Sparkles className="h-5 w-5 text-[#414FA8]" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Why SizeSnap is the Best Free CamScanner Alternative
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#FAFAFC] border-b border-gray-200 text-gray-700">
                      <th className="p-2.5 font-bold">Feature</th>
                      <th className="p-2.5 font-bold text-[#414FA8] bg-[#EEF1FB]/60">SizeSnap Scanner</th>
                      <th className="p-2.5 font-bold text-gray-500">CamScanner App</th>
                      <th className="p-2.5 font-bold text-gray-500">Other Web Scanners</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-600">
                    <tr>
                      <td className="p-2.5 font-semibold text-gray-800">Watermark Free</td>
                      <td className="p-2.5 text-emerald-600 font-bold bg-[#EEF1FB]/30">✓ 100% Clean (No Watermark)</td>
                      <td className="p-2.5 text-red-500 font-medium">✗ Adds &quot;Scanned with CamScanner&quot;</td>
                      <td className="p-2.5 text-amber-600">Varies (Often watermarked)</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-gray-800">Server Privacy</td>
                      <td className="p-2.5 text-emerald-600 font-bold bg-[#EEF1FB]/30">✓ Zero Server Uploads (100% Local)</td>
                      <td className="p-2.5 text-red-500 font-medium">✗ Uploads to China/Cloud servers</td>
                      <td className="p-2.5 text-red-500">✗ Uploaded to backend server</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-gray-800">Account / Sign-Up</td>
                      <td className="p-2.5 text-emerald-600 font-bold bg-[#EEF1FB]/30">✓ Not Required (Instant access)</td>
                      <td className="p-2.5 text-gray-500">Requires phone / email login</td>
                      <td className="p-2.5 text-gray-500">Often requires sign-up</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-gray-800">Multi-Page PDF</td>
                      <td className="p-2.5 text-emerald-600 font-bold bg-[#EEF1FB]/30">✓ Free up to 30 pages</td>
                      <td className="p-2.5 text-amber-600">Limited on free tier</td>
                      <td className="p-2.5 text-gray-500">Single page only</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-semibold text-gray-800">Auto Perspective Flattening</td>
                      <td className="p-2.5 text-emerald-600 font-bold bg-[#EEF1FB]/30">✓ OpenCV.js Computer Vision</td>
                      <td className="p-2.5 text-emerald-600">✓ Supported</td>
                      <td className="p-2.5 text-red-500">✗ Manual crop only</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Popular Use Cases Section */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <Layers className="h-5 w-5 text-[#414FA8]" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Common Document Scanning Use Cases
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                <div className="p-3.5 rounded-[4px] border border-gray-200 bg-[#FAFAFC] space-y-1.5">
                  <h3 className="font-bold text-gray-800 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#414FA8]" />
                    Government Exam & Job Applications
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Scan 10th/12th marksheets, degree certificates, Aadhaar cards, caste certificates, and domicile documents directly from your bed or desk without visiting a cyber cafe.
                  </p>
                </div>

                <div className="p-3.5 rounded-[4px] border border-gray-200 bg-[#FAFAFC] space-y-1.5">
                  <h3 className="font-bold text-gray-800 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#414FA8]" />
                    College Notes & Assignment Submissions
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Photograph handwritten notebook pages, align edges automatically, and compile a sequential multi-page PDF for LMS or classroom uploads.
                  </p>
                </div>

                <div className="p-3.5 rounded-[4px] border border-gray-200 bg-[#FAFAFC] space-y-1.5">
                  <h3 className="font-bold text-gray-800 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#414FA8]" />
                    Bills, Invoices & Medical Prescriptions
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Keep digital copies of pharmacy receipts, clinic prescriptions, utility bills, and rental agreements stored safely as searchable PDF documents.
                  </p>
                </div>

                <div className="p-3.5 rounded-[4px] border border-gray-200 bg-[#FAFAFC] space-y-1.5">
                  <h3 className="font-bold text-gray-800 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#414FA8]" />
                    KYC & Banking Documents
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Scan cancelled cheques, bank passbook front pages, PAN cards, and voter IDs in pristine clarity with guaranteed 100% offline security.
                  </p>
                </div>
              </div>
            </div>

            {/* Related Tools Shelf */}
            {relatedTools.length > 0 && (
              <div className="bg-white p-4 sm:p-5 rounded-[4px] border border-gray-200 shadow-xs">
                <h3 className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">
                  Related Editing & PDF Tools
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5">
                  {relatedTools.map((relTool) => (
                    <ToolButton key={relTool.id} tool={relTool} />
                  ))}
                </div>
              </div>
            )}

            {/* Comprehensive FAQ Section */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <HelpCircle className="h-5 w-5 text-[#414FA8]" />
                <h2 className="text-base sm:text-lg font-bold text-gray-900">
                  Frequently Asked Questions (FAQ)
                </h2>
              </div>

              <div className="space-y-4">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="border-b border-gray-100 pb-3.5 last:border-b-0 last:pb-0">
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900 mb-1.5">
                      {faq.q}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
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
