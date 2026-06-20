import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { blogs } from '@/lib/blogConfigs'
import { getRelatedStories } from '@/lib/storyConfigs'

export function generateStaticParams() {
  return blogs.map((blog) => ({
    slug: blog.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params
  const blog = blogs.find(b => b.slug === resolvedParams.slug)
  if (!blog) return {}

  return {
    title: `${blog.title} | SizeSnap Blog`,
    description: blog.excerpt,
    alternates: {
      canonical: `https://sizesnap.in/blog/${resolvedParams.slug}`
    },
    openGraph: {
      title: `${blog.title} | SizeSnap Blog`,
      description: blog.excerpt,
      type: 'article',
      url: `https://sizesnap.in/blog/${resolvedParams.slug}`,
      publishedTime: blog.date,
    }
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const blog = blogs.find(b => b.slug === resolvedParams.slug)

  if (!blog) notFound()

  const relatedStories = getRelatedStories(blog.slug)

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': blog.title,
    'description': blog.excerpt,
    'datePublished': blog.date,
    'dateModified': blog.date,
    'author': {
      '@type': 'Organization',
      'name': 'SizeSnap',
      'url': 'https://sizesnap.in'
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'SizeSnap',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://sizesnap.in/logo.png'
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `https://sizesnap.in/blog/${blog.slug}`
    }
  }

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
        'name': 'Blog',
        'item': 'https://sizesnap.in/blog'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': blog.title,
        'item': `https://sizesnap.in/blog/${blog.slug}`
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="max-w-3xl mx-auto py-12 px-4 md:px-0">
        <div className="mb-8">
           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
           <div className="text-gray-500">{new Date(blog.date).toLocaleDateString()}</div>
        </div>
        <div 
          className="prose prose-blue max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: blog.content }} 
        />

        {relatedStories.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>⚡</span> Quick &amp; Interactive Web Stories
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedStories.map(story => (
                <Link
                  key={story.slug}
                  href={`/stories/${story.slug}`}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="relative w-12 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={story.coverImage}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-950 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {story.title}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 font-normal">
                      {story.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
