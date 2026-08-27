import { Metadata } from 'next'
import Link from 'next/link'
import { blogs } from '@/lib/blogConfigs'
import { getApprovedUgcBlogs } from '@/lib/ugcBlogStore'

export const revalidate = 3600 // ISR: Rebuild every hour

export const metadata: Metadata = {
  title: 'Blog, Guides & PDF Optimization Tutorials | SizeSnap',
  description: 'Guides, tutorials, and document guidelines for online forms, PDF management, and photo resizing.',
  alternates: {
    canonical: 'https://sizesnap.in/blog',
  }
}

export default async function BlogIndex() {
  const staticBlogs = blogs.map(b => ({ ...b, isUgc: false, dateStr: b.date }))
  const ugcBlogs = []
  
  try {
    const fetchedUgc = await getApprovedUgcBlogs()
    for (const b of fetchedUgc) {
      ugcBlogs.push({
        slug: b.slug,
        title: b.title,
        excerpt: b.excerpt,
        content: b.content,
        dateStr: b.approvedAt || b.submittedAt,
        author: b.authorName,
        isUgc: true
      })
    }
  } catch (error) {
    console.error('Failed to load UGC blogs', error)
  }

  const allBlogs = [...ugcBlogs, ...staticBlogs].sort((a, b) => new Date(b.dateStr).getTime() - new Date(a.dateStr).getTime())

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources & Tutorials</h1>
          <p className="text-gray-600">Detailed guides on fixing image size problems for official applications.</p>
        </div>
        <Link href="/blog/write" className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 shadow-sm shrink-0 whitespace-nowrap">
          ✍️ Write a Guest Post
        </Link>
      </div>

      <div className="grid gap-6">
        {allBlogs.map(blog => {
          const wordsCount = blog.content.split(/\s+/).length
          const readTime = Math.max(1, Math.ceil(wordsCount / 200))
          return (
            <Link href={`/blog/${blog.slug}`} key={blog.slug} className="block border border-gray-200 rounded-xl p-6 bg-white hover:shadow-md transition-shadow group relative overflow-hidden">
              {blog.isUgc && (
                <div className="absolute top-0 right-0 bg-emerald-100 text-emerald-800 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                  Community Post
                </div>
              )}
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">{blog.title}</h2>
              <div className="text-xs text-gray-500 mb-3 flex items-center gap-3">
                <span>📅 {new Date(blog.dateStr).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="h-1 w-1 rounded-full bg-gray-300" />
                <span>⏱️ {readTime} min read</span>
                {blog.author && (
                  <>
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    <span className="font-medium text-gray-700">By {blog.author}</span>
                  </>
                )}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{blog.excerpt}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
