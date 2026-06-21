import { Metadata } from 'next'
import Link from 'next/link'
import { blogs } from '@/lib/blogConfigs'

export const metadata: Metadata = {
  title: 'Blog & Resources | SizeSnap',
  description: 'Guides, tutorials, and document guidelines for online forms, PDF management, and photo resizing.',
  alternates: {
    canonical: 'https://sizesnap.in/blog',
  }
}

export default function BlogIndex() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources & Tutorials</h1>
      <p className="text-gray-600 mb-8">Detailed guides on fixing image size problems for official applications.</p>

      <div className="grid gap-6">
        {blogs.map(blog => {
          const wordsCount = blog.content.split(/\s+/).length
          const readTime = Math.max(1, Math.ceil(wordsCount / 200))
          return (
            <Link href={`/blog/${blog.slug}`} key={blog.slug} className="block border border-gray-200 rounded-xl p-6 bg-white hover:shadow-md transition-shadow group">
              <h2 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">{blog.title}</h2>
              <div className="text-xs text-gray-500 mb-3 flex items-center gap-3">
                <span>📅 {new Date(blog.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="h-1 w-1 rounded-full bg-gray-300" />
                <span>⏱️ {readTime} min read</span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed">{blog.excerpt}</p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
