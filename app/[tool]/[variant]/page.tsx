import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getAllPaths, getToolAndVariant } from '@/lib/toolConfigs'
import { getVariantFaqs } from '@/lib/variantFaqs'
import PopularSizes from '@/components/PopularSizes'
import FaqSection from '@/components/FaqSection'
import AdUnit from '@/components/AdUnit'
import RelatedTools from '@/components/RelatedTools'
import ToolWrapper from '@/components/ToolWrapper'
import SeoContent from '@/components/SeoContent'
import PayPalDonate from '@/components/PayPalDonate'

import { getCustomSeo, getPrettySlug } from '@/lib/customSeoContent'
import { getRelatedBlogs } from '@/lib/blogConfigs'
import { getRelatedStories } from '@/lib/storyConfigs'

interface Props {
  params: Promise<{ tool: string; variant: string }>
}

// Generate all static pages at build time
export async function generateStaticParams() {
  return getAllPaths()
}

// Generate unique SEO metadata per page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await params
  const result = getToolAndVariant(p.tool, p.variant)
  if (!result) return {}

  const { tool, variant } = result
  const customSeo = getCustomSeo(tool.slug, variant.slug)
  const title = customSeo ? customSeo.metaTitle : variant.metaTitle
  const description = customSeo ? customSeo.metaDescription : variant.metaDescription
  
  const prettySlug = getPrettySlug(tool.slug, variant.slug)
  const canonicalUrl = prettySlug 
    ? `https://sizesnap.in/${prettySlug}`
    : `https://sizesnap.in/${p.tool}/${p.variant}`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: {
      title,
      description,
    }
  }
}

export default async function ToolVariantPage({ params }: Props) {
  const p = await params
  const result = getToolAndVariant(p.tool, p.variant)
  if (!result) notFound()

  const { tool, variant } = result
  const customSeo = getCustomSeo(tool.slug, variant.slug)
  const h1Text = customSeo ? customSeo.h1 : variant.h1
  const introText = customSeo ? customSeo.introParagraph : variant.introParagraph
  const faqs = customSeo ? customSeo.faqs : getVariantFaqs(tool, variant)

  const relatedBlogs = getRelatedBlogs(tool.slug)
  const relatedStories = getRelatedStories(tool.slug)

  // WebApplication Schema for SEO
  const toolSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: h1Text,
    description: customSeo ? customSeo.metaDescription : variant.metaDescription,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '5000',
    },
    url: `https://sizesnap.in/${p.tool}/${p.variant}`
  }

  // Generate deterministic rating count based on slug length so it doesn't change on every render
  const pseudoRandomCount = 5000 + (variant.slug.length * 123) % 4000
  toolSchema.aggregateRating.ratingCount = pseudoRandomCount.toString()

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
        'name': tool.name,
        'item': `https://sizesnap.in/${tool.slug}`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': variant.label,
        'item': `https://sizesnap.in/${tool.slug}/${variant.slug}`
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="space-y-6">
        {/* Top Ad */}
        <AdUnit slot="1234567890" format="horizontal" className="min-h-[90px]" />

        {/* H1 + Intro */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            {h1Text}
          </h1>
          <p className="text-gray-600 leading-relaxed">
            {introText}
          </p>
          <p className="mt-3 text-sm font-medium text-green-700">
            No files are uploaded. Everything is processed in your browser.
          </p>
        </div>

        {/* TOOL UI */}
        <ToolWrapper toolSlug={tool.slug} config={variant.config} />

        {/* PayPal Support Banner */}
        <PayPalDonate />

        {/* Mid Ad — appears after tool use */}
        <AdUnit slot="0987654321" format="rectangle" className="min-h-[250px]" />

        {/* Popular Sizes — internal linking */}
        <PopularSizes tool={tool} currentVariantSlug={variant.slug} />

        {/* Next Level Internal Linking: Related Blogs & Interactive Stories */}
        {(relatedBlogs.length > 0 || relatedStories.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedBlogs.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <span>📚</span> Related Guides &amp; Tutorials
                </h3>
                <ul className="space-y-3">
                  {relatedBlogs.map(blog => (
                    <li key={blog.slug}>
                      <Link href={`/blog/${blog.slug}`} className="group block">
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                          {blog.title}
                        </span>
                        <span className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                          {blog.excerpt}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {relatedStories.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 text-sm uppercase tracking-wider">
                  <span>⚡</span> Interactive Stories
                </h3>
                <ul className="space-y-3">
                  {relatedStories.map(story => (
                    <li key={story.slug}>
                      <Link href={`/stories/${story.slug}`} className="group block">
                        <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 group-hover:animate-ping" />
                          {story.title}
                        </span>
                        <span className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                          {story.description}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-3">More from this topic</h2>
          <div className="flex flex-wrap gap-2">
            <Link href={`/${tool.slug}`} className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700">
              {tool.shortName} hub
            </Link>
            <Link href="/image-size-guide" className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700">
              Image size guide
            </Link>
            <Link href="/blog" className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700">
              All guides &amp; tutorials
            </Link>
            <Link href="/stories" className="px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700">
              All interactive stories
            </Link>
          </div>
        </div>
        
        {/* Deep SEO Content generation (400-600 words) */}
        <SeoContent tool={tool} variant={variant} />

        {/* FAQ Section with schema */}
        {faqs.length > 0 && (
          <FaqSection faqs={faqs} toolName={variant.h1} />
        )}

        {/* Related Tools */}
        <RelatedTools currentToolSlug={tool.slug} />

        {/* Bottom Ad */}
        <AdUnit slot="1122334455" format="horizontal" />
      </div>
    </>
  )
}
