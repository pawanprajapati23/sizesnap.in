'use client'

import { useState, useEffect } from 'react'

export default function AdminUgcBlogsPage() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/admin/ugc-blogs')
      const data = await res.json()
      if (data.blogs) setBlogs(data.blogs)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleAction = async (id: string, action: 'approved' | 'rejected') => {
    try {
      await fetch('/api/admin/ugc-blogs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: action })
      })
      fetchBlogs() // Refresh list
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">UGC Blogs Approval</h1>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : blogs.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
          No pending blogs to review.
        </div>
      ) : (
        <div className="space-y-6">
          {blogs.map(blog => (
            <div key={blog.id} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold">{blog.title}</h2>
                  <p className="text-sm text-gray-500">By {blog.authorName} on {new Date(blog.submittedAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(blog.id, 'rejected')} className="px-4 py-2 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200">
                    Reject
                  </button>
                  <button onClick={() => handleAction(blog.id, 'approved')} className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
                    Approve
                  </button>
                </div>
              </div>
              <div className="prose max-w-none bg-gray-50 p-4 rounded-lg border border-gray-100 overflow-y-auto max-h-64" dangerouslySetInnerHTML={{ __html: blog.content }} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
