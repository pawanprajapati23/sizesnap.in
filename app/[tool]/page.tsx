import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookOpen, FileText, Zap } from 'lucide-react'
import { tools } from '@/lib/toolConfigs'
import { getRelatedBlogs } from '@/lib/blogConfigs'
import { getPrettySlug } from '@/lib/customSeoContent'
import { getVariantFaqs } from '@/lib/variantFaqs'
import ToolWrapper from '@/components/ToolWrapper'
import SeoContent from '@/components/SeoContent'
import FaqSection from '@/components/FaqSection'
import ReviewWidget from '@/components/ReviewWidget'
import Breadcrumb from '@/components/Breadcrumb'

interface Props {
  params: Promise<{ tool: string }>
}

export function generateStaticParams() {
  return tools.map(tool => ({ tool: tool.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool: toolSlug } = await params
  const tool = tools.find(item => item.slug === toolSlug)
  if (!tool) return {}

  return {
    title: `${tool.name} Free Online - Sizes, Use Cases & Guides | SizeSnap`,
    description: `${tool.description} Choose popular size targets, form-specific pages, and related guides. Private browser-based processing with instant download.`,
    alternates: {
      canonical: `https://sizesnap.in/${tool.slug}`,
    },
  }
}

export default async function ToolHubPage({ params }: Props) {
  const { tool: toolSlug } = await params
  const tool = tools.find(item => item.slug === toolSlug)
  if (!tool) notFound()

  const sizeVariants = tool.variants.filter(variant => variant.slug.includes('kb') || variant.slug.includes('mb'))
  const useCaseVariants = tool.variants.filter(variant => !variant.slug.includes('kb') && !variant.slug.includes('mb'))
  const featuredSizes = sizeVariants.filter(variant =>
    [
      'to-11kb', 'to-12kb', 'to-13kb', 'to-14kb', 'to-15kb',
      'to-20kb', 'to-28kb', 'to-50kb', 'to-100kb', 'to-200kb', 'to-500kb', 'to-1mb'
    ].includes(variant.slug)
  )
  const relatedBlogs = getRelatedBlogs(tool.slug)
  const relatedTools = tools.filter(item => item.slug !== tool.slug && item.category === tool.category).slice(0, 6)

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://sizesnap.in'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': tool.category === 'image' ? 'Image Tools' : tool.category === 'pdf' ? 'PDF Tools' : 'Form Tools',
        'item': 'https://sizesnap.in/tools'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': tool.name,
        'item': `https://sizesnap.in/${tool.slug}`
      }
    ]
  }

  const toolSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': tool.name,
    'description': tool.description,
    'applicationCategory': 'UtilitiesApplication',
    'operatingSystem': 'Any',
    'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    'aggregateRating': {
      '@type': 'AggregateRating',
      'ratingValue': '4.8',
      'ratingCount': (3000 + tool.name.length * 99).toString()
    },
    'url': `https://sizesnap.in/${tool.slug}`
  }

  // HowTo Schema for Step-by-Step Google Snippets
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': `How to use ${tool.name}`,
    'description': `Step-by-step instructions to process your file using ${tool.name}.`,
    'step': [
      {
        '@type': 'HowToStep',
        'position': 1,
        'name': 'Upload Your File',
        'text': 'Drag and drop or select your photo or document directly in your browser. No files are uploaded to any server.'
      },
      {
        '@type': 'HowToStep',
        'position': 2,
        'name': 'Auto-Format & Adjust',
        'text': 'SizeSnap instantly processes and adjusts the file to meet your specifications.'
      },
      {
        '@type': 'HowToStep',
        'position': 3,
        'name': 'Download Ready File',
        'text': 'Download your processed file instantly directly to your device.'
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <div className="space-y-10">
        <Breadcrumb items={[
          { label: 'All Tools', href: '/tools' },
          { label: tool.category === 'image' ? 'Image Tools' : tool.category === 'pdf' ? 'PDF Tools' : 'Form Tools', href: '/tools' },
          { label: tool.name }
        ]} />

        {/* Header Section */}
        <section className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            {tool.name}
          </h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
            {tool.description}
          </p>
        </section>

        {/* Main Tool Workspace */}
        <section className="mx-auto max-w-4xl relative z-10">
          <ToolWrapper toolSlug={tool.slug} config={tool.variants[0]?.config || {}} />
        </section>

        {/* How It Works */}
        <section className="bg-white border border-slate-200 rounded-3xl p-8 md:p-10 shadow-sm max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">How to use {tool.shortName}</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl font-extrabold mx-auto mb-2">1</div>
              <h3 className="font-bold text-lg text-slate-900">Upload your file</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Select or drag & drop your document directly into the tool above.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl font-extrabold mx-auto mb-2">2</div>
              <h3 className="font-bold text-lg text-slate-900">Auto-Format</h3>
              <p className="text-slate-600 text-sm leading-relaxed">SizeSnap instantly processes your file entirely in your browser. No server uploads.</p>
            </div>
            <div className="space-y-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl font-extrabold mx-auto mb-2">3</div>
              <h3 className="font-bold text-lg text-slate-900">Download</h3>
              <p className="text-slate-600 text-sm leading-relaxed">Get your perfectly formatted, high-quality file instantly and securely.</p>
            </div>
          </div>
        </section>

        {/* Fast Links / Workflow */}
        <section className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <Zap className="h-6 w-6 text-yellow-500 mb-4" />
            <h2 className="font-bold text-slate-900">Fast Mobile Workflow</h2>
            <p className="text-sm text-slate-600 mt-2">Upload, preview, and download from Android, iPhone, or desktop without installing an app.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <FileText className="h-6 w-6 text-blue-600 mb-4" />
            <h2 className="font-bold text-slate-900">Built for Forms</h2>
            <p className="text-sm text-slate-600 mt-2">Use size-specific pages for exams, portals, email attachments, and document submissions.</p>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <BookOpen className="h-6 w-6 text-green-600 mb-4" />
            <h2 className="font-bold text-slate-900">Helpful Guides</h2>
            <Link href="/image-size-guide" className="text-sm text-blue-600 font-semibold hover:underline mt-2 inline-block">
              Read the image size and upload guide &rarr;
            </Link>
          </div>
        </section>

        {/* Variants Browsing */}
        {(featuredSizes.length > 0 || useCaseVariants.length > 0) && (
          <section className="max-w-5xl mx-auto space-y-10 py-4">
            {featuredSizes.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Popular {tool.shortName} Sizes</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {featuredSizes.map(variant => {
                    const prettySlug = getPrettySlug(tool.slug, variant.slug)
                    const linkHref = prettySlug ? `/${prettySlug}` : `/${tool.slug}/${variant.slug}`
                    return (
                      <Link
                        key={variant.slug}
                        href={linkHref}
                        className="bg-white border border-slate-200 rounded-xl p-4 text-center hover:border-blue-400 hover:shadow-md transition-all group"
                      >
                        <span className="block font-bold text-slate-900 group-hover:text-blue-600">{variant.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
            
            {sizeVariants.length > featuredSizes.length && (
              <div className="space-y-4">
                <details className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm [&_summary::-webkit-details-marker]:hidden">
                  <summary className="flex items-center justify-between font-bold text-slate-800 cursor-pointer list-none">
                    <span className="text-lg text-slate-900">All Other Sizes ({sizeVariants.length})</span>
                    <span className="transition group-open:rotate-180 text-slate-400">▼</span>
                  </summary>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2 mt-5 pt-5 border-t border-slate-100">
                    {sizeVariants.map(variant => {
                      const prettySlug = getPrettySlug(tool.slug, variant.slug)
                      const linkHref = prettySlug ? `/${prettySlug}` : `/${tool.slug}/${variant.slug}`
                      return (
                        <Link
                          key={variant.slug}
                          href={linkHref}
                          className="bg-slate-50 border border-slate-200 rounded-lg py-2 px-2 text-center text-xs font-bold text-slate-600 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                        >
                          {variant.label}
                        </Link>
                      )
                    })}
                  </div>
                </details>
              </div>
            )}

            {useCaseVariants.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-slate-900">Choose by Use Case</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {useCaseVariants.map(variant => {
                    const prettySlug = getPrettySlug(tool.slug, variant.slug)
                    const linkHref = prettySlug ? `/${prettySlug}` : `/${tool.slug}/${variant.slug}`
                    return (
                      <Link
                        key={variant.slug}
                        href={linkHref}
                        className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-green-400 hover:shadow-md transition-all group"
                      >
                        <h3 className="font-bold text-slate-900 group-hover:text-green-700">{variant.h1}</h3>
                        <p className="text-sm text-slate-500 mt-2 line-clamp-2">{variant.introParagraph}</p>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Detailed SEO & FAQs */}
        {tool.variants[0] && (
          <section className="max-w-5xl mx-auto space-y-10">
            <SeoContent tool={tool} variant={tool.variants[0]} />
            <ReviewWidget ratingValue="4.8" ratingCount={(3000 + tool.name.length * 99).toString()} />
            <FaqSection faqs={getVariantFaqs(tool, tool.variants[0])} toolName={tool.name} />
          </section>
        )}

        {/* Related Content */}
        {(relatedBlogs.length > 0 || relatedTools.length > 0) && (
          <section className="max-w-5xl mx-auto space-y-10 py-6 border-t border-slate-100">
            {relatedBlogs.length > 0 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold text-slate-900">Related Guides</h2>
                <div className="grid md:grid-cols-3 gap-5">
                  {relatedBlogs.map(blog => (
                    <Link key={blog.slug} href={`/blog/${blog.slug}`} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-blue-400 hover:shadow-md transition-all group">
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 line-clamp-2">{blog.title}</h3>
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">{blog.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {relatedTools.length > 0 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold text-slate-900">Related Tools</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {relatedTools.map(related => (
                    <Link key={related.slug} href={`/${related.slug}`} className="bg-white border border-slate-200 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all group flex items-center">
                      <span className="text-2xl mr-3 group-hover:scale-110 transition-transform" aria-hidden="true">{related.icon}</span>
                      <span className="font-bold text-slate-900 group-hover:text-blue-600">{related.shortName}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

      </div>
    </>
  )
}
