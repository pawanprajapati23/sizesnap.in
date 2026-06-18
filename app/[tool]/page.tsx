import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookOpen, FileText, ShieldCheck, Zap } from 'lucide-react'
import { tools } from '@/lib/toolConfigs'
import { getRelatedBlogs } from '@/lib/blogConfigs'

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
    ['to-20kb', 'to-50kb', 'to-100kb', 'to-200kb', 'to-500kb', 'to-1mb'].includes(variant.slug)
  )
  const relatedBlogs = getRelatedBlogs(tool.slug)
  const relatedTools = tools.filter(item => item.slug !== tool.slug && item.category === tool.category).slice(0, 6)

  return (
    <div className="space-y-10">
      <section className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="text-4xl" aria-hidden="true">{tool.icon}</div>
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{tool.name}</h1>
            <p className="text-gray-600 max-w-3xl leading-relaxed">{tool.description}</p>
            <p className="text-sm font-medium text-green-700 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" />
              No files are uploaded. Everything is processed in your browser.
            </p>
          </div>
        </div>
      </section>

      {featuredSizes.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Popular {tool.shortName} Sizes</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {featuredSizes.map(variant => (
              <Link
                key={variant.slug}
                href={`/${tool.slug}/${variant.slug}`}
                className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <span className="block font-bold text-gray-900">{variant.label}</span>
                <span className="block text-xs text-gray-500 mt-1">Instant download</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {useCaseVariants.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Choose by Use Case</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {useCaseVariants.map(variant => (
              <Link
                key={variant.slug}
                href={`/${tool.slug}/${variant.slug}`}
                className="bg-white border border-gray-200 rounded-lg p-5 hover:border-green-300 hover:bg-green-50 transition-colors"
              >
                <h3 className="font-semibold text-gray-900">{variant.h1}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{variant.introParagraph}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="grid md:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <Zap className="h-5 w-5 text-yellow-500 mb-3" />
          <h2 className="font-semibold text-gray-900">Fast Mobile Workflow</h2>
          <p className="text-sm text-gray-600 mt-2">Upload, preview, and download from Android, iPhone, or desktop without installing an app.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <FileText className="h-5 w-5 text-blue-600 mb-3" />
          <h2 className="font-semibold text-gray-900">Built for Forms</h2>
          <p className="text-sm text-gray-600 mt-2">Use size-specific pages for exams, portals, email attachments, and document submissions.</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <BookOpen className="h-5 w-5 text-green-600 mb-3" />
          <h2 className="font-semibold text-gray-900">Helpful Guides</h2>
          <Link href="/image-size-guide" className="text-sm text-blue-700 hover:underline mt-2 inline-block">
            Read the image size and upload guide
          </Link>
        </div>
      </section>

      {relatedBlogs.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Related Guides</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {relatedBlogs.map(blog => (
              <Link key={blog.slug} href={`/blog/${blog.slug}`} className="bg-white border border-gray-200 rounded-lg p-5 hover:border-blue-300 transition-colors">
                <h3 className="font-semibold text-gray-900">{blog.title}</h3>
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{blog.excerpt}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedTools.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">Related Tools</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {relatedTools.map(related => (
              <Link key={related.slug} href={`/${related.slug}`} className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                <span className="text-xl mr-2" aria-hidden="true">{related.icon}</span>
                <span className="font-medium text-gray-900">{related.shortName}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
