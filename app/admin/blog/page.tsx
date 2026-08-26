'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore'
import { PenTool, Trash2, Edit } from 'lucide-react'

export default function BlogManager() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', slug: '', excerpt: '' })

  const fetchPosts = async () => {
    if (!db) return
    try {
      setLoading(true)
      const q = query(collection(db, 'blog_posts'), orderBy('timestamp', 'desc'))
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout fetching data')), 5000))
      const snap = await Promise.race([getDocs(q), timeout]) as any
      const data: any[] = []
      snap.forEach((d: any) => data.push({ id: d.id, ...d.data() }))
      setPosts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!db) return
    try {
      setIsAdding(true)
      await addDoc(collection(db, 'blog_posts'), {
        ...newPost,
        published: true,
        timestamp: serverTimestamp()
      })
      setNewPost({ title: '', slug: '', excerpt: '' })
      await fetchPosts()
    } catch (err) {
      alert('Error adding post. Check permissions.')
    } finally {
      setIsAdding(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!db || !confirm('Delete this blog post?')) return
    try {
      await deleteDoc(doc(db, 'blog_posts', id))
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      alert('Error deleting. Check permissions.')
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Blog CMS</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Publish articles and guides to drive organic SEO traffic.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <form onSubmit={handleAdd} className="bg-white dark:bg-[#0A0A0A] p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-4">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-4">
              <PenTool className="w-4 h-4" /> Draft New Post
            </h3>
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Article Title</label>
              <input required type="text" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})} placeholder="e.g. How to resize SSC Photo" className="w-full px-3 py-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-md focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none text-sm text-zinc-900 dark:text-zinc-100" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">URL Slug</label>
              <input required type="text" value={newPost.slug} onChange={e => setNewPost({...newPost, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} placeholder="e.g. ssc-photo-resize-guide" className="w-full px-3 py-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-md focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none text-sm text-zinc-900 dark:text-zinc-100" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Short Excerpt (Meta Description)</label>
              <textarea required rows={3} value={newPost.excerpt} onChange={e => setNewPost({...newPost, excerpt: e.target.value})} placeholder="A quick summary of the article for Google search results..." className="w-full px-3 py-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-md focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 outline-none text-sm text-zinc-900 dark:text-zinc-100 resize-none"></textarea>
            </div>

            <button disabled={isAdding} type="submit" className="w-full mt-2 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black text-sm font-medium rounded-md transition-colors disabled:opacity-70">
              {isAdding ? 'Publishing...' : 'Publish Article'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 bg-white dark:bg-[#0A0A0A] rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/10">
            <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <PenTool className="w-4 h-4" /> Published Articles
            </h3>
          </div>
          {loading ? (
            <div className="flex justify-center py-20"><div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div></div>
          ) : posts.length === 0 ? (
            <div className="text-center text-zinc-500 text-sm py-20">No articles published yet.</div>
          ) : (
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50 max-h-[500px] overflow-y-auto">
              {posts.map(post => (
                <div key={post.id} className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                  <div>
                    <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{post.title}</h4>
                    <p className="text-xs text-zinc-500 mt-1 max-w-md truncate">{post.excerpt}</p>
                    <p className="text-[10px] text-zinc-400 mt-2 font-medium">/blog/{post.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(post.id)} className="p-2 text-zinc-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
