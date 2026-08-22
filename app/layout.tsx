import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister'
import PwaInstallBanner from '@/components/PwaInstallBanner'
import SessionDownloadTray from '@/components/SessionDownloadTray'

import Script from 'next/script'


import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata: Metadata = {
  metadataBase: new URL('https://sizesnap.in'),
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

import AdminLayoutWrapper from '@/components/AdminLayoutWrapper'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SizeSnap" />
        {/* Google Sitelinks Searchbox Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "SizeSnap",
              "url": "https://sizesnap.in",
              "description": "Free Online Image & PDF Utilities for Sarkari Exams, Dimensions Resizing, and PDF Merging.",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://sizesnap.in/?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
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
        
      </head>
      <body className={`bg-gray-50 text-gray-900 min-h-screen font-sans ${inter.variable}`}>
        <div className="flex flex-col min-h-screen">
          <AdminLayoutWrapper 
            header={<Header />}
            sidebar={<Sidebar />}
            footer={<Footer />}
          >
            {children}
          </AdminLayoutWrapper>
        <CookieConsent />
        {/* <ServiceWorkerRegister /> */}
        {/* <PwaInstallBanner /> */}
        <SessionDownloadTray />
        {/* Google Analytics */}
        <Script src="https://www.googletagmanager.com/gtag/js?id=G-EWE73QX6FS" strategy="lazyOnload" />
        <Script id="google-analytics" strategy="lazyOnload">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-EWE73QX6FS');`}
        </Script>
        {/* Google AdSense — Loaded standard for crawler verification during approval phase */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2945912073877101"
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />

        {/* Google Translate Integration */}
        <Script id="google-translate-init" strategy="lazyOnload">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'hi,mr,bn,te,ta,gu,ur,kn,or,ml,pa,en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element');
              
              new google.translate.TranslateElement({
                pageLanguage: 'en',
                includedLanguages: 'hi,mr,bn,te,ta,gu,ur,kn,or,ml,pa,en',
                layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
              }, 'google_translate_element_mobile');
            }
          `}
        </Script>
        <Script
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="lazyOnload"
        />

        </div>
      </body>
    </html>
  )
}
