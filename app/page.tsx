import Link from 'next/link'
import AdUnit from '@/components/AdUnit'
import HomeSearch from '@/components/HomeSearch'
import { stories } from '@/lib/storyConfigs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SizeSnap — Free Online Image & PDF Tools | Resize, Compress, Convert',
  description: 'SizeSnap offers free online tools to resize images, compress PDFs, create passport photos, and more. No signup required. Works on mobile. 100% private — files stay on your device.',
  metadataBase: new URL('https://sizesnap.in'),
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': 'SizeSnap',
            'url': 'https://sizesnap.in',
            'potentialAction': {
              '@type': 'SearchAction',
              'target': 'https://sizesnap.in/?q={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          })
        }}
      />
      <div className="space-y-10">
      {/* Hero */}
      <div className="text-center pt-12 pb-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl text-white px-6 shadow-md relative">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Free Online Image & PDF Tools
        </h1>
        <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-8">
          Resize images, compress PDFs, create passport photos — all free, instant,
          and 100% private. No signup needed.
        </p>
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          <Link href="/resize-image/to-50kb"
            className="bg-white text-blue-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition-colors shadow-sm">
            Resize Image to 50KB
          </Link>
          <Link href="/compress-pdf/to-100kb"
            className="bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-400 transition-colors border border-blue-400">
            Compress PDF to 100KB
          </Link>
          <Link href="/image-size-guide"
            className="bg-blue-900/30 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-900/50 transition-colors border border-blue-400/30">
            Image Size Guide 2026
          </Link>
        </div>
      </div>

      <HomeSearch />

      <AdUnit slot="homepage-top" format="horizontal" />

      <section className="rounded-3xl bg-slate-950/95 border border-slate-800 p-8 shadow-2xl text-white">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-400">Featured Story</p>
            <h2 className="mt-4 text-3xl font-bold">Avoid SSC Photo Rejection</h2>
            <p className="mt-3 max-w-3xl text-slate-300">Learn the exact SSC photo upload rules and avoid common form rejection mistakes.</p>
          </div>
          <Link href={`/stories/${stories[0].slug}`}
            className="inline-flex items-center justify-center rounded-full bg-yellow-400 px-6 py-3 text-sm font-bold uppercase tracking-[0.16em] text-slate-950 shadow-lg hover:bg-yellow-300 transition"
          >
            Read Story
          </Link>
        </div>
      </section>

      <AdUnit slot="homepage-bottom" format="horizontal" />

      {/* Trust Signals */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        {[
          { icon: '🔒', title: '100% Private', desc: 'Files stay on your device' },
          { icon: '⚡', title: 'Instant', desc: 'Results in 1–3 seconds' },
          { icon: '📱', title: 'Mobile Ready', desc: 'Works on any device' },
          { icon: '🆓', title: 'Always Free', desc: 'No hidden charges' },
        ].map(item => (
          <div key={item.title} className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col justify-center items-center shadow-sm">
            <div className="text-3xl mb-3">{item.icon}</div>
            <p className="font-semibold text-gray-800 text-sm">{item.title}</p>
            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </section>
    </div>
    </>
  )
}
