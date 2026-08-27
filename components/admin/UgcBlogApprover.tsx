'use client'

import { useState, useEffect } from 'react'
import { Check, X, Edit, Save, Trash2, ArrowLeft } from 'lucide-react'

export function UgcBlogApprover() {
  const [pendingBlogs, setPendingBlogs] = useState<any[]>([])
  const [approvedBlogs, setApprovedBlogs] = useState<any[]>([])
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
      if (data.pendingBlogs) setPendingBlogs(data.pendingBlogs)
      if (data.approvedBlogs) setApprovedBlogs(data.approvedBlogs)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleAction = async (id: string, action: 'approved' | 'rejected' | 'pending', updatedData?: any) => {
    if (action === 'rejected' && !confirm('Are you sure you want to delete this blog?')) return;
    
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

  const renderBlogCard = (blog: any, isApprovedSection: boolean) => {
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
              <h3 className="text-md font-semibold text-zinc-900 dark:text-zinc-100">
                {blog.title}
                {isApprovedSection && (
                  <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                    Live
                  </span>
                )}
              </h3>
            )}
            <p className="text-xs text-zinc-500 mt-1">
              By <span className="font-medium text-zinc-700 dark:text-zinc-300">{blog.authorName}</span> • 
              {isApprovedSection ? ` Approved on ${new Date(blog.approvedAt).toLocaleDateString()}` : ` Submitted on ${new Date(blog.submittedAt).toLocaleString()}`}
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2 shrink-0">
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
                  <Save className="w-3.5 h-3.5" /> Save Changes
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
                
                {isApprovedSection ? (
                  <>
                    <button 
                      onClick={() => handleAction(blog.id, 'pending')} 
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-600 dark:bg-amber-950/30 dark:hover:bg-amber-900/50 dark:text-amber-400 text-xs font-medium rounded-md transition-colors"
                      title="Move back to pending (unpublish)"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Unpublish
                    </button>
                    <button 
                      onClick={() => handleAction(blog.id, 'rejected')} 
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-950/30 dark:hover:bg-red-900/50 dark:text-red-400 text-xs font-medium rounded-md transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </>
                ) : (
                  <>
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
  }

  return (
    <div className="mt-10 space-y-12">
      {/* PENDING SECTION */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-500"></span> Pending Reviews
        </h2>
        
        {loading ? (
          <p className="text-sm text-zinc-500">Loading...</p>
        ) : pendingBlogs.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-[#0A0A0A]/50 text-zinc-500 text-sm">
            No pending blogs to review.
          </div>
        ) : (
          <div className="space-y-4">
            {pendingBlogs.map(blog => renderBlogCard(blog, false))}
          </div>
        )}
      </section>

      {/* APPROVED SECTION */}
      <section>
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Published & Live
        </h2>
        
        {loading ? (
          <p className="text-sm text-zinc-500">Loading...</p>
        ) : approvedBlogs.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-[#0A0A0A]/50 text-zinc-500 text-sm">
            No published UGC blogs yet.
          </div>
        ) : (
          <div className="space-y-4">
            {approvedBlogs.map(blog => renderBlogCard(blog, true))}
          </div>
        )}
      </section>
    </div>
  )
}
