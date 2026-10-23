import React from 'react';
import { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ImageToTextOcrTool } from '@/components/ImageToTextOcrTool';
import { ToolSeoContent } from '@/components/ToolSeoContent';
import { ALL_TOOLS } from '@/data/tools';
import { ToolButton } from '@/components/ToolButton';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Image to Text (OCR) Converter Online Free | SizeSnap',
  description:
    'Extract text from scanned documents, screenshots, book pages, and receipts online using browser-based AI OCR. Copy editable text or export to TXT. 100% private, no signup.',
  keywords: [
    'image to text ocr',
    'extract text from image online',
    'photo to text converter',
    'screenshot to text converter',
    'ocr online free no limit',
    'copy text from picture',
    'scanned document to editable text',
  ],
  alternates: {
    canonical: 'https://www.sizesnap.in/tools/image-to-text-ocr',
  },
};

const FAQS = [
  {
    question: 'How do I extract text from an image or screenshot online?',
    answer:
      'Upload or paste (Ctrl+V) your screenshot, scanned document, or photo into SizeSnap Image to Text (OCR). The neural optical character recognition engine analyzes characters in real time and displays clean, editable text that you can copy in one click.',
  },
  {
    question: 'Can this OCR tool extract text from low-quality or angled phone photos?',
    answer:
      'Yes. The engine includes pre-processing filters that automatically binarize contrast and sharpen faint letter strokes before running character recognition.',
  },
  {
    question: 'Is there a limit on how many images I can convert to text?',
    answer:
      'There are zero daily limits. Because OCR runs client-side in your browser, you can extract text from as many pages, bills, and study guides as you need.',
  },
  {
    question: 'Are my confidential documents, bills, or bank statements uploaded to a server?',
    answer:
      'No. The OCR neural model runs 100% client-side via WebAssembly in your browser. None of your sensitive invoice numbers, account details, or contracts are sent across the internet.',
  },
];

export default function ImageToTextOcrPage() {
  const relatedTools = ALL_TOOLS.filter((t) => t.categoryId === 'image' && t.slug !== 'image-to-text-ocr').slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
          <Link href="/" className="hover:text-[#414FA8] flex items-center gap-1 font-medium">
            <ArrowLeft className="h-3.5 w-3.5" /> All Tools
          </Link>
          <span>/</span>
          <span className="text-gray-800 font-semibold">Image to Text (OCR)</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
            Free Image to Text (OCR) Converter Online
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Instantly extract and copy editable text from screenshots, scanned PDFs, book pages, and receipts with zero server upload.
          </p>

          <ImageToTextOcrTool />
        </div>

        {/* Rich SEO Content */}
        <ToolSeoContent
          title="Image to Text (OCR) Converter"
          description="SizeSnap Image to Text (OCR) turns unsearchable pictures, textbook scans, and software screenshots into clean, editable digital text. Eliminate hours of manual typing—simply drop an image to copy text, formulas, addresses, and code snippets straight to your clipboard."
          howToSteps={[
            'Upload Image or Paste Screenshot: Drag and drop your image, or press Ctrl+V to paste directly from your clipboard.',
            'Automatic OCR Processing: The WebAssembly neural engine scans letter contours and layout columns.',
            'Review Editable Text: Inspect the extracted text inside the output box with line breaks preserved.',
            'Copy or Export: Click "Copy Text" to paste into Word/Notepad, or download as a .TXT file.',
          ]}
          features={[
            {
              title: 'High-Accuracy Neural Character Recognition',
              desc: 'Trained on modern print typography, tabular structures, and multi-column document formats.',
            },
            {
              title: 'Instant Clipboard Paste (Ctrl+V)',
              desc: 'Capture screen snippets using Snipping Tool and paste directly into the tool without saving files first.',
            },
            {
              title: 'Table & Paragraph Structure Retention',
              desc: 'Keeps indentation, list markers, and paragraph spacing intact for effortless document transfer.',
            },
            {
              title: '100% Client-Side Privacy Guarantee',
              desc: 'All optical character recognition executes in local browser memory. No data is stored or logged.',
            },
          ]}
          faqs={FAQS}
          keywords={[
            'Image to Text OCR',
            'Extract Text From Image Online',
            'Photo to Text Converter',
            'Screenshot to Text Converter',
            'OCR Online Free No Limit',
            'Copy Text From Picture',
            'Scanned Document to Editable Text',
          ]}
        />

        {relatedTools.length > 0 && (
          <div className="bg-white p-5 mt-6 rounded-[4px] border border-gray-200 shadow-xs">
            <h2 className="text-sm font-bold text-gray-800 mb-3 border-b border-gray-100 pb-2">
              Related Image &amp; Text Tools
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
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
