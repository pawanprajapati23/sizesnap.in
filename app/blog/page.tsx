import { Metadata } from 'next'
import Link from 'next/link'
import { blogs } from '@/lib/blogConfigs'

export const metadata: Metadata = {
  title: 'Blog & Resources | SizeSnap',
  description: 'Guides, tutorials, and document guidelines for online forms, PDF management, and photo resizing.'
}

export default function BlogIndex() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4 md:px-0">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Resources & Tutorials</h1>
      <p className="text-gray-600 mb-8">Detailed guides on fixing image size problems for official applications.</p>

      <div className="grid gap-6">
        {blogs.map(blog => (
          <Link href={`/blog/${blog.slug}`} key={blog.slug} className="block border border-gray-200 rounded-xl p-6 bg-white hover:shadow-md transition-shadow">
            <h2 className="text-xl font-bold text-blue-700 mb-2">{blog.title}</h2>
            <div className="text-sm text-gray-500 mb-3">{new Date(blog.date).toLocaleDateString()}</div>
            <p className="text-gray-700">{blog.excerpt}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
