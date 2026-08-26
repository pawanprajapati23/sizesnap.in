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
      images: [
        {
          url: 'https://sizesnap.in/logo.png',
          width: 512,
          height: 512,
          alt: blog.title,
        }
      ]
    }
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const blog = blogs.find(b => b.slug === resolvedParams.slug)

  if (!blog) notFound()

  const relatedStories = getRelatedStories(blog.slug)

  // Determine relevant tools based on blog content/slug
  const isPdfBlog = blog.slug.toLowerCase().includes('pdf')
  const isPhotoBlog = blog.slug.toLowerCase().includes('photo') || blog.slug.toLowerCase().includes('signature') || blog.slug.toLowerCase().includes('resize')

  const recommendedTools = []
  if (isPdfBlog) {
    recommendedTools.push({
      name: 'Compress PDF to 100KB',
      desc: 'Compress and shrink your PDF files under 100KB for application forms.',
      href: '/compress-pdf-to-100kb',
      icon: '📄'
    })
    recommendedTools.push({
      name: 'Compress PDF to 200KB',
      desc: 'Shrink scanned documents under 200KB limit brackets.',
      href: '/compress-pdf-to-200kb',
      icon: '🗜️'
    })
  } else if (isPhotoBlog) {
    recommendedTools.push({
      name: 'Resize Image to 50KB',
      desc: 'Resize your passport photo or signature image under 50KB.',
      href: '/resize-image-to-50kb',
      icon: '🖼️'
    })
    recommendedTools.push({
      name: 'SSC Exam Photo Resizer',
      desc: 'Format passport photo to standard 3.5x4.5cm for SSC.',
      href: '/image-size-for-ssc-form',
      icon: '🛂'
    })
    recommendedTools.push({
      name: 'Resize Signature to 20KB',
      desc: 'Scale scanned signature strictly under 20KB for uploads.',
      href: '/resize-signature-for-ssc',
      icon: '✍️'
    })
  } else {
    recommendedTools.push({
      name: 'Resize Image to 50KB',
      desc: 'Resize any image in KB or MB without quality loss.',
      href: '/resize-image-to-50kb',
      icon: '🖼️'
    })
    recommendedTools.push({
      name: 'Compress PDF to 100KB',
      desc: 'Reduce PDF file size online free.',
      href: '/compress-pdf-to-100kb',
      icon: '📄'
    })
  }

  const blogSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': blog.title,
    'description': blog.excerpt,
    'datePublished': blog.date,
    'dateModified': blog.date,
    'author': {
      '@type': 'Person',
      'name': 'Pawan Prajapati',
      'url': 'https://sizesnap.in/about-us#founder'
    },
    'image': 'https://sizesnap.in/logo.png',
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

  // Generate TOC
  const tocMatches = [...blog.content.matchAll(/<h2>(.*?)<\/h2>/g)];
  const toc = tocMatches.map((match, index) => {
    const title = match[1].replace(/<[^>]+>/g, '').trim();
    const id = `heading-${index}`;
    return { title, id, original: match[0], innerHTML: match[1] };
  });

  let modifiedContent = blog.content;
  toc.forEach(({ id, original, innerHTML }) => {
    modifiedContent = modifiedContent.replace(original, `<h2 id="${id}" class="scroll-mt-20">${innerHTML}</h2>`);
  });

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
           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">{blog.title}</h1>
           <div className="text-xs text-gray-500 flex items-center gap-3">
             <span>📅 {new Date(blog.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
             <span className="h-1 w-1 rounded-full bg-gray-300" />
             <span>⏱️ {Math.max(1, Math.ceil(blog.content.split(/\s+/).length / 200))} min read</span>
           </div>
        </div>

        {toc.length > 0 && (
          <div className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Table of Contents</h2>
            <ul className="space-y-2">
              {toc.map(({ title, id }) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-sm text-blue-600 hover:underline">{title}</a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div 
          className="prose prose-blue max-w-none text-gray-800"
          dangerouslySetInnerHTML={{ __html: modifiedContent }} 
        />

        {/* Author Bio Box */}
        <div className="mt-12 bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col md:flex-row gap-6 items-center md:items-start">
          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-sm">
            <img src="/pawan.jpeg" alt="Pawan Prajapati" className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Written by Pawan Prajapati</h3>
            <p className="text-sm text-gray-600 mb-2">Founder & Developer at SizeSnap</p>
            <p className="text-xs text-gray-500">
              Last updated on {new Date(blog.date).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {recommendedTools.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🔧</span> Recommended Tools for this Guide
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedTools.map(tool => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center gap-3 p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                    {tool.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-950 group-hover:text-blue-600 transition-colors">
                      {tool.name}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1 font-normal">
                      {tool.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

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
                      width={48}
                      height={64}
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
