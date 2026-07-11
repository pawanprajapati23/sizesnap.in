import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import NativeBanner from '@/components/NativeBanner'

import Script from 'next/script'


export const metadata: Metadata = {
  title: 'SizeSnap — Free Online Image & PDF Tools',
  description: 'Free online tools to resize images, compress PDFs, and more. No signup, no watermark, works on mobile. Visit sizesnap.in',
  keywords: 'image resizer, pdf compressor, compress image, resize photo online free, sizesnap',
  openGraph: {
    type: 'website',
    siteName: 'SizeSnap',
    url: 'https://sizesnap.in',
    images: [
      {
        url: 'https://sizesnap.in/logo.png',
        width: 512,
        height: 512,
        alt: 'SizeSnap — Free Online Image & PDF Tools Logo',
      }
    ],
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/logo.png',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SizeSnap — Free Online Image & PDF Tools',
    description: 'Free online tools to resize images, compress PDFs, and more. No signup, no watermark, works on mobile.',
    images: ['https://sizesnap.in/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SizeSnap" />
        {/* Knowledge Graph Schemas for Brand Owner / Founder */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "SizeSnap",
              "url": "https://sizesnap.in",
              "logo": "https://sizesnap.in/logo.png",
              "founder": {
                "@type": "Person",
                "name": "Pawan Prajapati",
                "jobTitle": "Owner & Founder",
                "alumniOf": {
                  "@type": "EducationalOrganization",
                  "name": "B.Tech"
                },
                "description": "Pawan Prajapati is the founder and owner (malik) of SizeSnap.in. He is a B.Tech student preparing for SDE (Software Development Engineer) roles.",
                "sameAs": [
                  "https://github.com/pawanprajapati23"
                ]
              }
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Pawan Prajapati",
              "jobTitle": "Founder & Owner of SizeSnap",
              "description": "Pawan Prajapati is the owner of SizeSnap, a B.Tech student preparing for Software Development Engineer (SDE) roles.",
              "url": "https://sizesnap.in",
              "sameAs": [
                "https://github.com/pawanprajapati23"
              ]
            })
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-gray-50 text-gray-900 min-h-screen">
        <Header />
        <NativeBanner />
        <div className="max-w-7xl mx-auto px-4 py-6 flex gap-6">
          {/* Sidebar — hidden on mobile, visible on lg+ */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <Sidebar />
          </aside>
          {/* Main content */}
          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
        <Footer />
        <CookieConsent />
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-EWE73QX6FS" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-EWE73QX6FS');`}
        </Script>
        {/* Google AdSense — Loaded standard for crawler verification during approval phase */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5696239388754680"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        {/* PWA Service Worker Registration */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('Service Worker registration successful with scope: ', registration.scope);
                  },
                  function(err) {
                    console.log('Service Worker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
