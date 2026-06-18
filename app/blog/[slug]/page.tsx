import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { blogs } from '@/lib/blogConfigs'

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
    description: blog.excerpt
  }
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params
  const blog = blogs.find(b => b.slug === resolvedParams.slug)

  if (!blog) notFound()

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 md:px-0">
      <div className="mb-8">
         <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>
         <div className="text-gray-500">{new Date(blog.date).toLocaleDateString()}</div>
      </div>
      <div 
        className="prose prose-blue max-w-none text-gray-800"
        dangerouslySetInnerHTML={{ __html: blog.content }} 
      />
    </div>
  )
}
