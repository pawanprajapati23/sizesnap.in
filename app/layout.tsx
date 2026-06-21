import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'

import Script from 'next/script'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SizeSnap — Free Online Image & PDF Tools',
  description: 'Free online tools to resize images, compress PDFs, and more. No signup, no watermark, works on mobile. Visit sizesnap.in',
  keywords: 'image resizer, pdf compressor, compress image, resize photo online free, sizesnap',
  openGraph: {
    type: 'website',
    siteName: 'SizeSnap',
    url: 'https://sizesnap.in',
  },
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/logo.png',
  }
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
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen`}>
        <Header />
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
        {/* Google AdSense */}
        <Script 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5696239388754680" 
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  )
}
