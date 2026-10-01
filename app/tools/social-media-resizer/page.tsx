import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Sidebar } from '@/components/Sidebar';
import { SocialMediaResizer } from '@/components/tool-ui/SocialMediaResizer';
import FAQSection from '@/components/FAQSection';
import { RelatedTools } from '@/components/RelatedTools';

export const metadata: Metadata = {
  title: 'Social Media Image Resizer Online Free | SizeSnap',
  description:
    'Free online tool to resize photos for Instagram, Facebook, YouTube, LinkedIn, and WhatsApp. Exact presets for posts, stories, profile pics, and covers.',
  alternates: {
    canonical: 'https://sizesnap.in/tools/social-media-resizer',
  },
};

export default function SocialMediaResizerPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Tools', url: '/tools' },
    { name: 'Social Media Resizer', url: '/tools/social-media-resizer' },
  ];

  return (
    <>
      <div className="min-h-screen flex flex-col bg-[#F5F5F7]">
        <Navbar />

        <main className="flex-1 w-full max-w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-gray-400">/</span>}
                {idx < breadcrumbs.length - 1 ? (
                  <a href={crumb.url} className="hover:text-[#414FA8] transition-colors">{crumb.name}</a>
                ) : (
                  <span className="text-gray-800 font-semibold">{crumb.name}</span>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            <div className="w-full lg:col-span-8 xl:col-span-9 space-y-6">
              <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <h1 className="text-xl sm:text-2xl font-bold text-[#333333] tracking-tight mb-1.5">
                  Social Media Image Resizer
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 leading-normal">
                  Resize images precisely for Instagram, Facebook, YouTube, and more with exact pixel dimensions. All processing happens 100% offline in your browser.
                </p>
              </div>

              {/* Tool Component */}
              <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs">
                <SocialMediaResizer />
              </div>

              <div className="bg-white p-4 sm:p-6 rounded-[4px] border border-gray-200 shadow-xs mt-6">
                 <h2 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-100 pb-2">Why Use This Tool?</h2>
                 <p className="text-sm mb-4 leading-relaxed text-gray-700">
                   Social media platforms have strict dimension requirements for images. If you upload an image with incorrect dimensions, the platform might crop it poorly or stretch it, ruining the visual quality. This tool offers one-click presets to perfectly frame your photos for Instagram posts, YouTube thumbnails, Facebook covers, and more—without uploading any files to our servers.
                 </p>
                 <FAQSection />
              </div>

              <RelatedTools category="Social" currentSlug="social-media-resizer" />
            </div>

            <div className="w-full lg:col-span-4 xl:col-span-3">
              <Sidebar />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
