import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import AnalyticsTracker from '@/components/AnalyticsTracker';
import FeedbackWidget from '@/components/FeedbackWidget';
import AdsterraAd from '@/components/AdsterraAd';

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://sizesnap.in'),
  title: 'SizeSnap - Free Image Compressor, Resizer & PDF Tools',
  description: 'Compress, resize, convert and edit images and PDFs online with free SizeSnap tools.',
  alternates: {
    canonical: 'https://sizesnap.in/',
  },
  openGraph: {
    title: 'SizeSnap - Free Image Compressor, Resizer & PDF Tools',
    description: 'Compress, resize, convert and edit images and PDFs online with free SizeSnap tools.',
    url: 'https://sizesnap.in/',
    siteName: 'SizeSnap',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/logo.png', type: 'image/png' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/logo.png' },
    ],
    shortcut: ['/logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SizeSnap - Free Image Compressor, Resizer & PDF Tools',
    description: 'Compress, resize, convert and edit images and PDFs online with free SizeSnap tools.',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || '', // e.g., 'your-verification-code'
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://sizesnap.in/#website',
        url: 'https://sizesnap.in/',
        name: 'SizeSnap',
        description: 'Free Online Image Compressor, Resizer, Converter & PDF Tools',
        potentialAction: {
          '@type': 'SearchAction',
          target: 'https://sizesnap.in/?q={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebApplication',
        name: 'SizeSnap Image & PDF Utilities',
        url: 'https://sizesnap.in/',
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'All',
        browserRequirements: 'Requires JavaScript. Requires HTML5.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    ],
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#F5F5F7] text-[#333333] font-sans antialiased" suppressHydrationWarning>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
              `}
            </Script>
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Google AdSense */}
        {process.env.NEXT_PUBLIC_ADSENSE_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_ID}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
        <AnalyticsTracker />
        <FeedbackWidget />
        {children}
        
        {/* Mobile Sticky Ad Banner (320x50) */}
        <div className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-center bg-white border-t border-gray-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb-safe">
          <AdsterraAd dataKey="f509bd7d24a58ce7a176067713ca61df" width={320} height={50} />
        </div>

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
