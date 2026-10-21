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
  Sun,
  Contrast,
  ExternalLink,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Remove Shadow from Document Online Free - Clean PDF & Photo Shadow Remover | SizeSnap',
  description:
    'Remove camera shadows, dark gradients, and phone glare from document photos and PDFs online free. Auto-crop edges, whiten paper background, and enhance text contrast for SSC, UPSC, and govt portal uploads.',
  keywords: [
    'remove shadow from document',
    'pdf shadow remover online',
    'remove shadow from pdf',
    'pdf shadow remover online free',
    'scanner black and white',
    'black and white scan',
    'remove shadow from document photo',
    'shadow remover from pdf',
    'document shadow remover free',
    'clean document photo online',
    'whiten document background',
    'remove shadow from certificate photo',
    'scan filter online',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/remove-shadow-from-document',
  },
  openGraph: {
    title: 'Remove Shadow from Document Online Free - Clean PDF & Photo Shadow Remover | SizeSnap',
    description:
      'Instantly remove mobile camera shadows from certificates, marksheets, and PDFs. Whiten background and make text 100% crisp. 100% private in browser.',
    url: 'https://www.sizesnap.in/tools/remove-shadow-from-document',
    siteName: 'SizeSnap',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Remove Shadow from Document Online Free | SizeSnap',
    description:
      'Free online tool to eliminate camera shadows, auto-crop borders, and whiten document paper backgrounds for exam portals.',
  },
};

const RELATED_SLUGS = [
  'document-scanner',
  'crop-image',
  'image-to-pdf',
  'compress-pdf-140kb',
  'compress-pdf',
  'compress-image',
];

const FAQS = [
  {
    q: 'How does the SizeSnap Shadow Remover remove dark shadows from document photos?',
    a: 'When you capture a document with your smartphone, your hands or phone often cast dark shadows across the paper. SizeSnap uses two intelligent steps: (1) Computer Vision (OpenCV) detects the four corners of your document to crop away unwanted dark tables, bedsheets, and surrounding shadows; (2) The "Remove Shadow (B&W)" algorithm analyzes luminance gradients, stretches contrast to turn grayish shadowed areas into pure clean white paper, and enhances dark ink vectors so handwriting and stamps become razor-sharp.',
  },
  {
    q: 'Why do recruitment portals (SSC, UPSC, State PSC) reject documents with shadows?',
    a: 'Government job portals utilize automated Optical Character Recognition (OCR) software and strict manual document verification (DV). When a marksheet or caste certificate has dark shadows or uneven lighting, automated scanners fail to read roll numbers, birth dates, and serial codes, resulting in instant application rejection. Removing shadows guarantees 100% legibility.',
  },
  {
    q: 'Can I remove shadows from multi-page PDFs or marksheets?',
    a: 'Yes! You can upload or scan multiple pages sequentially. For each page, click "Remove Shadow (B&W)" on the preview screen to whiten the background and eliminate shadows. You can reorder, rotate, or re-scan any page, and then export all clean pages together as a single multi-page PDF.',
  },
  {
    q: 'Is my confidential Aadhaar card or marksheet uploaded to any server?',
    a: 'Never. SizeSnap operates 100% locally inside your web browser using HTML5 Canvas and WebAssembly. Your photos, certificates, and documents are processed entirely on your phone or computer and are never uploaded to any remote server or stored in any database.',
  },
  {
    q: 'What is the best way to avoid casting shadows while taking document photos?',
    a: 'For best results: (1) Place the document near a natural light source like an open window rather than directly underneath a single overhead ceiling light; (2) Hold the phone slightly tilted if necessary and use SizeSnap perspective correction to flatten it automatically; (3) Zoom in 1.5x–2x from a slightly greater distance so your hands do not block the light.',
  },
  {
    q: 'Can I switch back to color if I do not want pure black & white?',
    a: 'Yes. The "Remove Shadow (B&W)" button acts as a toggle. Clicking it once applies adaptive shadow removal and contrast enhancement. Clicking it again instantly restores the full-color scan without losing your perspective crop.',
  },
];

export default function RemoveShadowFromDocumentPage() {
  const relatedTools = ALL_TOOLS.filter((t) => RELATED_SLUGS.includes(t.slug));

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        '@id': 'https://www.sizesnap.in/tools/remove-shadow-from-document#webapp',
        name: 'SizeSnap Document Shadow Remover',
        url: 'https://www.sizesnap.in/tools/remove-shadow-from-document',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
        featureList: [
          'Automatic document corner detection',
          'Eliminate phone camera shadows',
          'Adaptive paper background whitening',
          'Crisp text contrast enhancement',
          'Multi-page PDF and JPG export',
          '100% client-side privacy protection',
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: 'https://www.sizesnap.in/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Image Tools',
            item: 'https://www.sizesnap.in/image-tools',
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Remove Shadow from Document',
            item: 'https://www.sizesnap.in/tools/remove-shadow-from-document',
          },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a,
          },
        })),
      },
      {
        '@type': 'HowTo',
        name: 'How to Remove Shadow from Document Photos Online Free',
        description:
          'Step-by-step guide to remove camera shadows and whiten paper backgrounds for clean PDF uploads.',
        step: [
          {
            '@type': 'HowToStep',
            position: 1,
            name: 'Upload Photo or Open Camera',
            text: 'Upload your document photo or use your smartphone camera to snap your marksheet or certificate.',
          },
          {
            '@type': 'HowToStep',
            position: 2,
            name: 'Auto-Crop Away Dark Borders',
            text: 'SizeSnap detects the paper corners automatically. Drag the corner handles to crop away tables, fingers, and dark edges.',
          },
          {
            '@type': 'HowToStep',
            position: 3,
            name: 'Click Remove Shadow (B&W)',
            text: 'Click the Remove Shadow button in the toolbar to whiten dark shadow gradients and sharpen all text and signatures.',
          },
          {
            '@type': 'HowToStep',
            position: 4,
            name: 'Export Clean PDF or JPG',
            text: 'Download the shadow-free document as a single or multi-page PDF ready for instant exam submission.',
          },
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] font-sans selection:bg-[#414FA8]/20">
      <Navbar />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6 sm:space-y-8">
            {/* Header Card */}
            <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-[#414FA8]/10 via-[#414FA8]/5 to-transparent rounded-bl-full -z-10 pointer-events-none" />

              {/* Breadcrumb */}
              <div className="mb-4 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <Link href="/" className="hover:text-[#414FA8] transition-colors">Home</Link>
                <span>/</span>
                <Link href="/image-tools" className="hover:text-[#414FA8] transition-colors">Image Tools</Link>
                <span>/</span>
                <span className="text-gray-900 font-medium">Remove Shadow from Document</span>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EEF1FB] text-[#414FA8] border border-[#414FA8]/20">
                  <Sparkles className="w-3.5 h-3.5" /> Adaptive Shadow Removal &amp; Paper Whitener
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Private
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                Remove Shadow from Document Online Free
              </h1>
              <p className="text-sm sm:text-base text-gray-600 max-w-3xl leading-relaxed">
                Eliminate annoying mobile phone shadows, uneven lighting gradients, and grayish backgrounds from certificates, marksheets, and IDs. Auto-detect document edges, whiten paper, and export clean PDFs ready for official verification.
              </p>
            </div>

            {/* Interactive Scanner Tool with Shadow Removal */}
            <div id="tool-area" className="scroll-mt-24">
              <DocumentScannerTool />
            </div>

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white p-4 rounded-[4px] border border-gray-200 text-xs text-gray-700">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Sun className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Shadow &amp; Glare Eraser</span>
                  <span className="text-[11px] text-gray-500">Eliminates camera hand &amp; phone shadows</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Contrast className="h-4 w-4" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">Clean White Paper Contrast</span>
                  <span className="text-[11px] text-gray-500">Whitens background &amp; sharpens text</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-[#EEF1FB] text-[#414FA8] shrink-0">
                  <Lock className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <span className="font-semibold block text-gray-800">100% Private in Browser</span>
                  <span className="text-[11px] text-gray-500">Zero uploads, works completely on-device</span>
                </div>
              </div>
            </div>

            {/* In-Depth Educational Guide */}
            <article className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs text-gray-700 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  Why Phone Camera Shadows Cause Document Verification (DV) Failures
                </h2>
                <p className="text-sm leading-relaxed text-gray-600">
                  When taking a quick smartphone photo of an educational marksheet, Aadhaar card, or government certificate, overhead lights naturally project a dark shadow of your hands or phone onto the paper. On government exam portals like SSC CGL, UPSC Civil Services, and state police recruitment boards, high-speed automated document screening algorithms reject shadowed scans as illegible or tampered.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-[4px] border border-red-200 bg-red-50/50 space-y-1.5">
                  <h3 className="text-sm font-bold text-red-900 flex items-center gap-1.5">
                    ❌ Unprocessed Photo with Shadows
                  </h3>
                  <ul className="text-xs text-red-800 space-y-1 list-disc pl-4">
                    <li>Dark shadow gradient across marksheet roll numbers</li>
                    <li>Skewed perspective angles caused by holding phone diagonally</li>
                    <li>Tablecloth or bedsheet texture visible in background</li>
                    <li>Automated portal OCR fails to extract certificate details</li>
                  </ul>
                </div>

                <div className="p-4 rounded-[4px] border border-emerald-200 bg-emerald-50/50 space-y-1.5">
                  <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-1.5">
                    ✅ SizeSnap Shadow-Removed Output
                  </h3>
                  <ul className="text-xs text-emerald-800 space-y-1 list-disc pl-4">
                    <li>Pure white paper background with zero shadow gradients</li>
                    <li>Flatsheet perspective correction equivalent to flatbed scanners</li>
                    <li>Clean, dark ink lines for signatures, seals, and text</li>
                    <li>Guaranteed acceptance on SSC, UPSC, and state recruitment portals</li>
                  </ul>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  How to Whiten Paper &amp; Remove Shadows in 3 Easy Steps
                </h3>
                <ol className="list-decimal pl-5 space-y-2.5 text-sm text-gray-600">
                  <li>
                    <strong>Upload or Snap:</strong> Choose a photo of your certificate or tap &quot;Start Camera&quot; to take a live photo.
                  </li>
                  <li>
                    <strong>Adjust Corners:</strong> SizeSnap automatically highlights document edges. Adjust the 4 corner handles to isolate the paper from background objects.
                  </li>
                  <li>
                    <strong>Apply &quot;Remove Shadow (B&W)&quot;:</strong> Click the magic wand button on the preview screen. Dark shadows instantly turn to bright white paper, and dark text is sharpened.
                  </li>
                </ol>
              </div>
            </article>

            {/* Related Tools Grid */}
            <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-4 w-4 text-[#414FA8]" />
                  <h2 className="text-sm sm:text-base font-bold text-gray-900">
                    Related Document &amp; Photo Tools
                  </h2>
                </div>
                <Link
                  href="/tools"
                  className="text-xs font-semibold text-[#414FA8] hover:underline inline-flex items-center gap-1"
                >
                  All Tools <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {relatedTools.map((tool) => (
                  <ToolButton key={tool.id} tool={tool} />
                ))}
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white p-6 sm:p-8 rounded-[4px] border border-gray-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
                <HelpCircle className="h-5 w-5 text-[#414FA8]" />
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {FAQS.map((faq, index) => (
                  <div key={index} className="py-4 first:pt-0 last:pb-0">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1.5 flex items-start gap-2">
                      <span className="text-[#414FA8] font-bold">Q.</span>
                      {faq.q}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-5">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:col-span-4 xl:col-span-3">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
