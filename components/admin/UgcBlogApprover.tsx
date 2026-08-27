'use client'

import { useState, useEffect } from 'react'
import { Check, X } from 'lucide-react'

export function UgcBlogApprover() {
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
      fetchBlogs()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="mt-10">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Pending Guest Posts (UGC)</h2>
      
      {loading ? (
        <p className="text-sm text-zinc-500">Loading pending requests...</p>
      ) : blogs.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-[#0A0A0A]/50 text-zinc-500 text-sm">
          No pending blogs to review.
        </div>
      ) : (
        <div className="space-y-4">
          {blogs.map(blog => (
            <div key={blog.id} className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0A0A0A] shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <h3 className="text-md font-semibold text-zinc-900 dark:text-zinc-100">{blog.title}</h3>
                  <p className="text-xs text-zinc-500 mt-1">Submitted by <span className="font-medium text-zinc-700 dark:text-zinc-300">{blog.authorName}</span> • {new Date(blog.submittedAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => handleAction(blog.id, 'rejected')} 
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-900/50 dark:text-red-400 text-xs font-medium rounded-md transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                  <button 
                    onClick={() => handleAction(blog.id, 'approved')} 
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/50 dark:text-emerald-400 text-xs font-medium rounded-md transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                </div>
              </div>
              <div className="text-sm text-zinc-700 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-md border border-zinc-100 dark:border-zinc-800/50 overflow-y-auto max-h-48 prose prose-sm dark:prose-invert" 
                   dangerouslySetInnerHTML={{ __html: blog.content }} 
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
