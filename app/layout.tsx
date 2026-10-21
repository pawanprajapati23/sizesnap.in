import type { Metadata } from 'next';
import Script from 'next/script';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import dynamic from 'next/dynamic';

const FeedbackWidget = dynamic(() => import('@/components/FeedbackWidget'));
const AnalyticsTracker = dynamic(() => import('@/components/AnalyticsTracker'));

import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.sizesnap.in'),
  title: 'SizeSnap - Free Image Compressor, Resizer & PDF Tools',
  description: 'Compress, resize, convert and edit images and PDFs online with free SizeSnap tools.',
  alternates: {
    canonical: 'https://www.sizesnap.in/',
  },
  openGraph: {
    title: 'SizeSnap - Free Image Compressor, Resizer & PDF Tools',
    description: 'Compress, resize, convert and edit images and PDFs online with free SizeSnap tools.',
    url: 'https://www.sizesnap.in/',
    siteName: 'SizeSnap',
    type: 'website',
    images: [
      {
        url: 'https://www.sizesnap.in/logo.png',
        width: 1200,
        height: 630,
        alt: 'SizeSnap - Free Image Compressor, Resizer & PDF Tools',
      },
    ],
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
    images: ['https://www.sizesnap.in/logo.png'],
  },
  verification: {
    google:
      process.env.NEXT_PUBLIC_GSC_VERIFICATION &&
      process.env.NEXT_PUBLIC_GSC_VERIFICATION !== 'your-verification-code-here'
        ? process.env.NEXT_PUBLIC_GSC_VERIFICATION
        : undefined,
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
        '@id': 'https://www.sizesnap.in/#website',
        url: 'https://www.sizesnap.in/',
        name: 'SizeSnap',
        description: 'Free Online Image Compressor, Resizer, Converter & PDF Tools',
      },
      {
        '@type': 'WebApplication',
        name: 'SizeSnap Image & PDF Utilities',
        url: 'https://www.sizesnap.in/',
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
              strategy="lazyOnload"
            />
            <Script id="google-analytics" strategy="lazyOnload">
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

        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
