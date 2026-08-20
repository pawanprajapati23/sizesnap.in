'use client'

import { useState } from 'react'
import { MessageSquare } from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { usePathname } from 'next/navigation'

export default function FeedbackWidget() {
  const [feedback, setFeedback] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const pathname = usePathname()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedback.trim()) return

    setStatus('sending')
    try {
      if (db) {
        await addDoc(collection(db, 'user_feedback'), {
          message: feedback,
          pageUrl: pathname || 'Unknown Page',
          timestamp: serverTimestamp(),
          read: false
        })
      }
      setStatus('success')
      setFeedback('')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (err) {
      console.error('Error sending feedback:', err)
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mt-8 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-5 h-5 text-indigo-500" />
        <h3 className="font-bold text-slate-800 text-sm">Have feedback or need a new feature?</h3>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us what you think..."
          className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-800"
          disabled={status === 'sending' || status === 'success'}
          required
        />
        <button
          type="submit"
          disabled={status === 'sending' || status === 'success' || !feedback.trim()}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center min-w-[80px]"
        >
          {status === 'sending' ? 'Sending...' : status === 'success' ? 'Sent!' : 'Send'}
        </button>
      </form>
      {status === 'error' && <p className="text-xs text-red-500 mt-2">Failed to send feedback. Please try again.</p>}
    </div>
  )
}
