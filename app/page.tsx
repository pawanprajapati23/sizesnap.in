import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { HeroQuickDropzone } from '@/components/HeroQuickDropzone';
import { ToolDirectory } from '@/components/ToolDirectory';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import FAQSection from '@/components/FAQSection';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
      {/* Full-width blue navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
          {/* Main content: ~70% width on desktop, 100% on mobile */}
          <div className="w-full lg:col-span-8 xl:col-span-9">
            {/* Interactive Hero Quick Dropzone */}
            <HeroQuickDropzone />

            <ToolDirectory />
          
            {/* Popular Tools Section */}
            <section className="my-8">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Popular Tools</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/tools/compress-image" className="p-4 bg-white rounded shadow hover:bg-gray-50 transition">
                  Compress Image
                </Link>
                <Link href="/tools/compress-pdf" className="p-4 bg-white rounded shadow hover:bg-gray-50 transition">
                  Compress PDF
                </Link>
                <Link href="/tools/resize-image-pixel" className="p-4 bg-white rounded shadow hover:bg-gray-50 transition">
                  Resize Image (Pixel)
                </Link>
              </div>
            </section>
          </div>

          {/* Right sidebar: ~30% width on desktop, hidden on mobile */}
          <div className="w-full lg:col-span-4 xl:col-span-3">
            <Sidebar />
          </div>
        </div>
      </main>

      {/* SEO & AdSense Rich Content Section */}
      <section className="w-full bg-white border-t border-gray-200 mt-6 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Choose SizeSnap 2.0?</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            Welcome to SizeSnap, India's most trusted suite of free online utilities for students, professionals, and general web users. 
            Whether you are applying for SSC, UPSC, NEET, or local government exams, getting your photos and signatures to the exact requested size (like 20KB or 50KB) is crucial. 
            Unlike other platforms, SizeSnap operates 100% locally in your browser. This means your sensitive documents, government IDs, and biometric signatures are never uploaded to any cloud server, guaranteeing absolute privacy and security.
          </p>
          
                      <FAQSection />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                'mainEntity': [
                  {
                    '@type': 'Question',
                    'name': 'Is SizeSnap really free to use?',
                    'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes! SizeSnap is completely free. No hidden fees, no premium subscriptions, and no watermarks added to your exported files.' }
                  },
                  {
                    '@type': 'Question',
                    'name': 'Do any files get uploaded to a server?',
                    'acceptedAnswer': { '@type': 'Answer', 'text': 'No. All processing happens 100% in the browser using WebAssembly and HTML5 APIs. Your files never leave your device.' }
                  },
                  {
                    '@type': 'Question',
                    'name': 'Can I use SizeSnap for government exam photo requirements?',
                    'acceptedAnswer': { '@type': 'Answer', 'text': 'Absolutely. We provide exact‑KB presets (10KB‑50KB) to meet the strict size limits required by SSC, UPSC, NEET, and other Indian examination portals.' }
                  },
                  {
                    '@type': 'Question',
                    'name': 'Is it safe for professional use?',
                    'acceptedAnswer': { '@type': 'Answer', 'text': 'Yes. The app is client‑side only, contains no tracking pixels, and follows modern security practices. It can be used for business‑critical PDF compression without data leakage.' }
                  }
                ]
              }) }}
            />
        </div>
      </section>

      {/* Compact footer */}
      <Footer />
    </div>
  );
}
