'use client'

import { useState, useEffect } from 'react'
import { Check, X, Edit, Save } from 'lucide-react'

export function UgcBlogApprover() {
  const [blogs, setBlogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ title: '', excerpt: '', content: '' })

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

  const handleAction = async (id: string, action: 'approved' | 'rejected', updatedData?: any) => {
    try {
      await fetch('/api/admin/ugc-blogs', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: action, updatedData })
      })
      setEditingId(null)
      fetchBlogs()
    } catch (err) {
      console.error(err)
    }
  }

  const startEdit = (blog: any) => {
    setEditingId(blog.id)
    setEditForm({ title: blog.title, excerpt: blog.excerpt, content: blog.content })
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
          {blogs.map(blog => {
            const isEditing = editingId === blog.id
            return (
            <div key={blog.id} className="p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0A0A0A] shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-1">
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={editForm.title} 
                      onChange={e => setEditForm({...editForm, title: e.target.value})}
                      className="w-full text-md font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900 px-3 py-1.5 rounded border border-zinc-300 dark:border-zinc-700 focus:outline-none"
                    />
                  ) : (
                    <h3 className="text-md font-semibold text-zinc-900 dark:text-zinc-100">{blog.title}</h3>
                  )}
                  <p className="text-xs text-zinc-500 mt-1">Submitted by <span className="font-medium text-zinc-700 dark:text-zinc-300">{blog.authorName}</span> • {new Date(blog.submittedAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={() => setEditingId(null)} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-md transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handleAction(blog.id, 'approved', editForm)} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-md transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" /> Save & Approve
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => startEdit(blog)} 
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:text-zinc-300 text-xs font-medium rounded-md transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5" /> Edit
                      </button>
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
                    </>
                  )}
                </div>
              </div>
              
              {isEditing ? (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Excerpt (SEO Description)</label>
                    <textarea 
                      value={editForm.excerpt}
                      onChange={e => setEditForm({...editForm, excerpt: e.target.value})}
                      className="w-full mt-1 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900 p-3 rounded border border-zinc-300 dark:border-zinc-700 focus:outline-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Content (HTML/Markdown)</label>
                    <textarea 
                      value={editForm.content}
                      onChange={e => setEditForm({...editForm, content: e.target.value})}
                      className="w-full mt-1 text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50 dark:bg-zinc-900 p-3 rounded border border-zinc-300 dark:border-zinc-700 focus:outline-none font-mono"
                      rows={10}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-sm text-zinc-700 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-900/50 p-4 rounded-md border border-zinc-100 dark:border-zinc-800/50 overflow-y-auto max-h-48 prose prose-sm dark:prose-invert" 
                     dangerouslySetInnerHTML={{ __html: blog.content }} 
                />
              )}
            </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
