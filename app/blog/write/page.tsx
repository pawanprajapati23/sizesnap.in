'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function WriteBlogPage() {
  const [title, setTitle] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [content, setContent] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !authorName || !content) return

    setStatus('submitting')
    try {
      // Basic text to HTML conversion for paragraphs
      const htmlContent = content.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p}</p>`).join('')
      
      const res = await fetch('/api/ugc-blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          authorName,
          content: htmlContent
        })
      })

      if (res.ok) {
        setStatus('success')
        setTimeout(() => router.push('/blog'), 3000)
      } else {
        setStatus('error')
      }
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Write a Guest Post</h1>
        <p className="text-gray-600">Share your tips on exams, document formatting, or career advice. All submissions are reviewed by our team before publishing.</p>
      </div>

      {status === 'success' ? (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold mb-2">Submitted Successfully! 🎉</h3>
          <p>Thank you for contributing. Our team will review your post shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
            <input 
              type="text" 
              required
              value={authorName}
              onChange={e => setAuthorName(e.target.value)}
              placeholder="e.g. Rahul Kumar"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Post Title</label>
            <input 
              type="text" 
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="How to clear SSC CGL in first attempt..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-lg font-medium focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Content (Markdown/Text)</label>
            <textarea 
              required
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={12}
              placeholder="Write your article here..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-y"
            />
            <p className="text-xs text-gray-500 mt-2">Use double line breaks for new paragraphs. We will format the HTML automatically.</p>
          </div>

          {status === 'error' && (
            <p className="text-red-600 text-sm font-medium">Something went wrong. Please try again.</p>
          )}

          <button 
            type="submit" 
            disabled={status === 'submitting'}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
          >
            {status === 'submitting' ? 'Submitting...' : 'Submit for Review'}
          </button>
        </form>
      )}
    </div>
  )
}
