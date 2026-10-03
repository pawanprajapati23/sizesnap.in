import React from 'react';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ALL_TOOLS, getToolBySlug, type ToolItem } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import { ArrowLeft, Upload, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

interface ToolPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const TOOL_REDIRECT_MAP: Record<string, string> = {
  'compress-image-to-20kb': '/tools/reduce-image-size-in-kb?target=20',
  'compress-image-to-50kb': '/tools/reduce-image-size-in-kb?target=50',
  'compress-image-to-100kb': '/tools/reduce-image-size-in-kb?target=100',
  'ssc-photo-resize': '/exams/ssc-photo-signature-resizer',
  'upsc-photo': '/exams/upsc-photo-signature-resizer',
  'psc-photo': '/exams/ssc-photo-signature-resizer',
  'resize-signature': '/exams/ssc-photo-signature-resizer?type=signature',
  'resize-image-3-5cm-4-5cm': '/tools/passport-photo-maker',
  'resize-in-centimeters': '/tools/passport-photo-maker',
  'resize-image-in-centimeter': '/tools/passport-photo-maker',
  'resize-in-millimeters': '/tools/passport-photo-maker',
  'resize-in-inches': '/tools/passport-photo-maker',
  'square-crop': '/tools/crop-image',
  'circle-crop': '/tools/crop-image',
  'freehand-crop': '/tools/crop-image',
  'crop-png': '/tools/crop-image',
  'webp-to-jpg': '/tools/png-to-jpg',
  'jpg-to-webp': '/tools/image-to-webp',
  'merge-pdfs': '/tools/merge-pdf',
  'view-metadata': '/tools/image-metadata-viewer',
  'edit-metadata': '/tools/image-metadata-viewer',
  'remove-metadata': '/tools/image-metadata-viewer',
  'resize-image-by-pixel': '/tools/resize-image-pixel',
  'pan-card': '/tools/passport-photo-maker',
  'grayscale-image': '/tools/image-filters?mode=grayscale',
  'black-and-white': '/tools/image-filters?mode=bw',
  'blur-image': '/tools/image-filters?mode=blur',
  'unblur-image': '/tools/image-filters?mode=sharpen',
  'motion-blur': '/tools/image-filters?mode=blur',
  'pixelate-image': '/tools/image-filters?mode=pixelate',
  'picture-to-pixel-art': '/tools/image-filters?mode=pixelate',
  'deep-fry-photo': '/tools/image-filters?mode=deepfry',
  'censor-photo': '/tools/image-filters?mode=pixelate',
  'blur-face': '/tools/image-filters?mode=blur',
  'beautify-image': '/tools/image-filters?mode=sepia',
  'add-border-to-image': '/tools/image-framer?mode=border',
  'add-white-border-to-image': '/tools/image-framer?mode=border',
  'round-corners': '/tools/image-framer?mode=round',
  'change-aspect-ratio': '/tools/crop-image',
  'increase-image-quality': '/tools/image-upscaler',
  'convert-dpi-200-300-600': '/tools/image-upscaler',
  'check-image-dpi': '/tools/image-upscaler',
  'super-resolution': '/tools/image-upscaler',
  'upscale-image-with-ai': '/tools/image-upscaler',
  'a4-size': '/tools/passport-photo-maker',
  'add-text-to-image': '/tools/image-watermark?type=text',
  'add-logo-to-image': '/tools/image-watermark?type=logo',
  'watermark-images': '/tools/image-watermark?type=logo',
  'add-name-dob-on-photo': '/tools/image-watermark?type=text',
};

const DEDICATED_TOOL_SLUGS = [
  'compress-image',
  'reduce-image-size-in-kb',
  'reduce-image-size-kb',
  'resize-image-pixel',
  'passport-photo-maker',
  'image-to-pdf',
  'pdf-to-images',
  'compress-pdf',
  'jpg-to-png',
  'png-to-jpg',
  'bulk-image-resizer',
  'merge-pdf',
  'split-pdf',
  'rotate-pdf',
  'delete-pdf-pages',
  'extract-pdf-pages',
  'add-page-numbers-pdf',
  'add-watermark-pdf',
  'crop-image',
  'flip-image',
  'rotate-image',
  'image-to-webp',
  'image-to-avif',
  'image-to-base64',
  'base64-to-image',
  'image-color-picker',
  'image-metadata-viewer',
  'favicon-generator',
  'image-filters',
  'image-framer',
  'image-upscaler',
  'image-watermark',
  'text-to-handwriting',
  'image-to-text-ocr',
  'increase-image-size-in-kb',
  'generate-signature',
];

export async function generateStaticParams() {
  return ALL_TOOLS.filter((tool) => !DEDICATED_TOOL_SLUGS.includes(tool.slug)).map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found - SizeSnap',
    };
  }

  return {
    title: `${tool.name} - Free Online Tool | SizeSnap`,
    description: tool.shortDescription || `Use SizeSnap ${tool.name} online for free. Fast, high-quality, privacy-focused image and document processing without watermark.`,
    alternates: {
      canonical: `https://sizesnap.in/tools/${tool.slug}`,
    },
  };
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
  const { slug } = await params;

  // Check smart redirect map first
  if (TOOL_REDIRECT_MAP[slug]) {
    redirect(TOOL_REDIRECT_MAP[slug]);
  }

  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  // Related tools from the same category
  const relatedTools = ALL_TOOLS.filter(
    (t) => t.categoryId === tool.categoryId && t.slug !== tool.slug
  ).slice(0, 6);

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://sizesnap.in/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tool.categoryTitle,
        item: `https://sizesnap.in/${tool.categoryId}-tools`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.name,
        item: `https://sizesnap.in/tools/${tool.slug}`,
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#414FA8] flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> All Tools
          </Link>
          <span>/</span>
          <span>{tool.categoryTitle}</span>
          <span>/</span>
          <span className="text-gray-800 font-semibold">{tool.name}</span>
        </div>

        {/* Tool Header Box */}
        <div className="bg-white p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
            <div>
              <span className="text-[11px] font-semibold text-[#414FA8] uppercase tracking-wider bg-[#EEF1FB] px-2 py-0.5 rounded">
                {tool.categoryTitle}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                {tool.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {tool.shortDescription || `Fast, secure and free online tool for ${tool.name.toLowerCase()}.`}
              </p>
            </div>
            <Link
              href="/#directory"
              className="inline-flex items-center justify-center self-start sm:self-auto px-3.5 py-2 text-xs font-medium text-[#414FA8] bg-[#EEF1FB] border border-[#9AA3C8] rounded hover:bg-[#E2E7F8] transition-colors"
            >
              Browse other tools
            </Link>
          </div>

          {/* Interactive Workspace Shell Placeholder */}
          <div className="mt-4 border-2 border-dashed border-[#9AA3C8] rounded-md p-8 sm:p-12 text-center bg-[#FAFAFC] hover:bg-white transition-colors">
            <div className="max-w-md mx-auto flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#EEF1FB] text-[#414FA8] flex items-center justify-center mb-4 shadow-xs">
                <Upload className="h-6 w-6" />
              </div>
              <h2 className="text-base font-bold text-gray-800 mb-1">
                Select your image or file to begin
              </h2>
              <p className="text-xs text-gray-500 mb-5">
                Drag and drop files here, or click to choose from your computer or phone.
              </p>
              <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-[#414FA8] text-white text-xs sm:text-sm font-semibold rounded shadow-sm hover:bg-[#343f88] active:scale-[0.98] transition-all">
                <Upload className="h-4 w-4" />
                <span>Choose File</span>
                <input type="file" className="sr-only" />
              </label>
              <p className="text-[11px] text-gray-400 mt-3">
                Supports JPG, PNG, WEBP, GIF, PDF (Max 25MB). No account needed.
              </p>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-5 border-t border-gray-100 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Instant browser processing</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>100% private, files stay safe</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Zero watermark &amp; unlimited use</span>
            </div>
          </div>
        </div>

        {/* Related Category Tools */}
        {relatedTools.length > 0 && (
          <div className="bg-white p-5 rounded-[4px] border border-gray-200 shadow-xs">
            <h2 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">
              More {tool.categoryTitle} Tools
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {relatedTools.map((relTool) => (
                <ToolButton key={relTool.id} tool={relTool} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
      </div>
    </>
  );
}
