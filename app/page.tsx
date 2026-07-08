import Link from 'next/link'
import AdUnit from '@/components/AdUnit'
import HomeSearch from '@/components/HomeSearch'
import ExamPresetCalculator from '@/components/ExamPresetCalculator'
import { stories } from '@/lib/storyConfigs'
import { blogs } from '@/lib/blogConfigs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SizeSnap — Free Online Image & PDF Tools | Resize, Compress, Convert',
  description: 'SizeSnap offers free online tools to resize images, compress PDFs, create passport photos, and more. No signup required. Works on mobile. 100% private — files stay on your device.',
  metadataBase: new URL('https://sizesnap.in'),
  alternates: {
    canonical: 'https://sizesnap.in',
  },
  openGraph: {
    title: 'SizeSnap — Free Online Image & PDF Tools | Resize, Compress, Convert',
    description: 'SizeSnap offers free online tools to resize images, compress PDFs, create passport photos, and more. No signup required. Works on mobile. 100% private.',
    url: 'https://sizesnap.in',
    type: 'website',
  }
}

export default function HomePage() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'SizeSnap',
    'url': 'https://sizesnap.in',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://sizesnap.in/?q={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  }

  const homeFaqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: "Is SizeSnap safe to use for sensitive documents like Aadhaar or Passport photos?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Yes, absolutely. Unlike other online compressors, SizeSnap is 100% client-side. All processing happens locally on your device within your browser. Your images and documents are never uploaded to any external server, ensuring complete privacy."
        }
      },
      {
        '@type': 'Question',
        name: "How does SizeSnap resize images under 50KB or 100KB without making them blurry?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "SizeSnap uses smart resizing algorithms (like canvas interpolation and quality scaling) to strip metadata and reduce file weight while keeping the face details, text lines, and signatures sharp and readable."
        }
      },
      {
        '@type': 'Question',
        name: "Is there a limit on how many files I can compress daily?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "No. SizeSnap is completely free to use. Since all operations run locally on your device, we don't have heavy server bandwidth costs, allowing us to keep it unlimited, ad-supported, and free from signups."
        }
      },
      {
        '@type': 'Question',
        name: "Does this tool work on mobile phones?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Yes. SizeSnap is fully responsive and optimized to run on all modern mobile browsers (Chrome, Safari, Firefox) on both Android and iOS devices."
        }
      }
    ]
  }

  const appSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': 'SizeSnap Image & PDF Tools',
    'operatingSystem': 'All',
    'applicationCategory': 'UtilitiesApplication',
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.8',
      'ratingCount': '9560'
    },
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    },
    'url': 'https://sizesnap.in'
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <div className="space-y-10">
      {/* Hero */}
      <div className="text-center py-8 px-5 md:py-16 md:px-10 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 rounded-3xl text-white shadow-2xl relative overflow-hidden border border-white/10">
        {/* Glow ambient background lights */}
        <div className="absolute top-0 left-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-subtle" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none animate-pulse-subtle" />
        
        {/* Sleek top badge */}
        <div className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-400/25 px-3 py-1 rounded-full text-blue-300 text-[10px] font-black tracking-widest uppercase mb-4 animate-pulse-subtle">
          ⚡ 100% Client-Side &amp; Secure
        </div>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mb-4">
          Free Online <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">Image &amp; PDF Tools</span>
        </h1>
        
        <p className="text-slate-300 text-sm md:text-lg max-w-xl mx-auto mb-6 md:mb-8 font-medium leading-relaxed">
          Resize, compress, crop, and convert files locally in your browser. Your private documents never touch any servers.
        </p>

        {/* Action badges only on tablet/desktop to save vertical space on mobile */}
        <div className="hidden sm:flex flex-wrap gap-3 justify-center">
          <Link href="/resize-image/to-50kb"
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs hover:from-blue-600 hover:to-indigo-700 transition-all shadow-md">
            Resize Image to 50KB
          </Link>
          <Link href="/compress-pdf/to-100kb"
            className="bg-white/10 hover:bg-white/15 text-white font-bold px-5 py-2.5 rounded-xl text-xs border border-white/10 transition-all">
            Compress PDF to 100KB
          </Link>
          <Link href="/image-size-guide"
            className="bg-slate-900/60 hover:bg-slate-800 text-slate-300 font-bold px-5 py-2.5 rounded-xl text-xs border border-slate-800/80 transition-all">
            Image Size Guide 2026
          </Link>
        </div>
      </div>

      <HomeSearch />

      <ExamPresetCalculator />

      {/* Modern Web Stories Circle Carousel Widget */}
      <section className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-1.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
            Interactive Web Stories
          </h2>
          <Link href="/stories" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
            View All →
          </Link>
        </div>
        <div className="flex gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {stories.map(story => (
            <Link
              key={story.slug}
              href={`/stories/${story.slug}`}
              className="flex flex-col items-center gap-2 flex-shrink-0 group focus:outline-none"
            >
              {/* Outer Glowing Gradient Ring */}
              <div className="w-16 h-16 rounded-full p-[2.5px] bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 group-hover:rotate-45 transition-transform duration-500 shadow-md">
                {/* Inner Border Ring */}
                <div className="w-full h-full rounded-full border-[2.5px] border-white overflow-hidden bg-gray-100 relative">
                  <img
                    src={story.coverImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                    width={64}
                    height={64}
                  />
                </div>
              </div>
              <span className="text-[11px] font-bold text-gray-700 text-center max-w-[80px] line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                {story.title.replace('Passport Photo Rejection: ', '').replace('SSC CGL Form ', '')}
              </span>
            </Link>
          ))}
        </div>
      </section>

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

      {/* Latest Guides & Tutorials */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-1.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse" />
            Latest Guides &amp; Tutorials
          </h2>
          <Link href="/blog" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
            Read All Guides →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.slice(0, 3).map(blog => {
            const readTime = Math.max(1, Math.ceil(blog.content.split(/\s+/).length / 200))
            return (
              <Link
                key={blog.slug}
                href={`/blog/${blog.slug}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="text-xs text-gray-500 mb-2 flex items-center gap-2 font-medium">
                    <span>📅 {new Date(blog.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    <span>⏱️ {readTime} min read</span>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-normal">
                    {blog.excerpt}
                  </p>
                </div>
                <div className="text-xs font-bold text-blue-600 group-hover:underline mt-4 flex items-center gap-1">
                  Read Guide <span>→</span>
                </div>
              </Link>
            )
          })}
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

      {/* Homepage FAQs Section with FAQPage Schema */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm space-y-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(homeFaqSchema) }}
        />
        <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-500 flex items-center gap-1.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-green-600 animate-pulse" />
          Frequently Asked Questions (FAQs)
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "Is SizeSnap safe to use for sensitive documents like Aadhaar or Passport photos?",
              a: "Yes, absolutely. Unlike other online compressors, SizeSnap is 100% client-side. All processing happens locally on your device within your browser. Your images and documents are never uploaded to any external server, ensuring complete privacy."
            },
            {
              q: "How does SizeSnap resize images under 50KB or 100KB without making them blurry?",
              a: "SizeSnap uses smart resizing algorithms (like canvas interpolation and quality scaling) to strip metadata and reduce file weight while keeping the face details, text lines, and signatures sharp and readable."
            },
            {
              q: "Is there a limit on how many files I can compress daily?",
              a: "No. SizeSnap is completely free to use. Since all operations run locally on your device, we don't have heavy server bandwidth costs, allowing us to keep it unlimited, ad-supported, and free from signups."
            },
            {
              q: "Does this tool work on mobile phones?",
              a: "Yes. SizeSnap is fully responsive and optimized to run on all modern mobile browsers (Chrome, Safari, Firefox) on both Android and iOS devices."
            }
          ].map((item, idx) => (
            <details key={idx} className="group border border-gray-100 rounded-xl p-4 bg-gray-50/50 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex items-center justify-between font-semibold text-gray-900 cursor-pointer list-none text-sm">
                <span>{item.q}</span>
                <span className="transition group-open:rotate-180">
                  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-xs text-gray-600 leading-relaxed font-normal">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
    </>
  )
}
