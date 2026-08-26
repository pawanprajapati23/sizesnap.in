'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { collection, query, getDocs, orderBy, limit, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { MessageSquare, ArrowUpRight, Trash2, CheckCircle } from 'lucide-react'

export default function FeedbackManager() {
  const [messages, setMessages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMessages = async () => {
    if (!db) return
    try {
      setLoading(true)
      const msgRef = collection(db, 'user_feedback')
      const msgQ = query(msgRef, orderBy('timestamp', 'desc'), limit(100))
      const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout fetching data')), 5000))
      const msgSnap = await Promise.race([getDocs(msgQ), timeout]) as any
      const loadedMsgs: any[] = []
      msgSnap.forEach((doc: any) => {
         loadedMsgs.push({ id: doc.id, ...doc.data() })
      })
      setMessages(loadedMsgs)
    } catch (err) {
      console.error("Error fetching feedback:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [])

  const handleMarkResolved = async (id: string, currentStatus: boolean) => {
    if (!db) return
    try {
      await updateDoc(doc(db, 'user_feedback', id), {
        read: !currentStatus
      })
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: !currentStatus } : m))
    } catch (err) {
      console.error("Failed to update status", err)
      alert("Failed to update status. Check permissions.")
    }
  }

  const handleDelete = async (id: string) => {
    if (!db || !confirm('Are you sure you want to delete this feedback?')) return
    try {
      await deleteDoc(doc(db, 'user_feedback', id))
      setMessages(prev => prev.filter(m => m.id !== id))
    } catch (err) {
      console.error("Failed to delete", err)
      alert("Failed to delete. Check permissions.")
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">User Feedback</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage and resolve feedback submitted by users.</p>
        </div>
        <button onClick={fetchMessages} className="text-xs font-medium px-3 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
          Refresh
        </button>
      </div>

      <div className="bg-white dark:bg-[#0A0A0A] rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {loading ? (
           <div className="flex items-center justify-center py-20"><div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div></div>
        ) : messages.length === 0 ? (
           <div className="text-center text-zinc-500 text-sm py-20">No feedback messages found.</div>
        ) : (
           <div className="divide-y divide-zinc-100 dark:divide-zinc-800/50 max-h-[70vh] overflow-y-auto">
             {messages.map((msg, i) => (
                <div key={msg.id || i} className={`p-5 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-4 ${msg.read ? 'bg-zinc-50/50 dark:bg-zinc-900/10' : 'bg-white dark:bg-[#0A0A0A]'}`}>
                   <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 text-xs">
                         {msg.read ? (
                           <span className="px-2 py-0.5 rounded-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">Resolved</span>
                         ) : (
                           <span className="px-2 py-0.5 rounded-sm bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-medium">New</span>
                         )}
                         <span className="text-zinc-500">{msg.timestamp ? new Date(msg.timestamp.toMillis()).toLocaleString() : 'Just now'}</span>
                         <a href={msg.pageUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 truncate max-w-[200px]" title={msg.pageUrl}>
                            {(() => {
                               try {
                                  return new URL(msg.pageUrl || 'https://sizesnap.in').pathname
                               } catch {
                                  return msg.pageUrl || 'Unknown'
                               }
                            })()} <ArrowUpRight className="w-3 h-3" />
                         </a>
                      </div>
                      <p className={`text-sm leading-relaxed ${msg.read ? 'text-zinc-500 dark:text-zinc-500' : 'text-zinc-900 dark:text-zinc-200'}`}>
                         {msg.message}
                      </p>
                   </div>
                   <div className="flex items-center gap-2 sm:self-start">
                      <button 
                         onClick={() => handleMarkResolved(msg.id, msg.read)}
                         className={`p-2 rounded-md border transition-colors ${msg.read ? 'border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-900 dark:hover:text-white' : 'border-green-200 dark:border-green-900/50 bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50'}`}
                         title={msg.read ? "Mark as Unread" : "Mark as Resolved"}
                      >
                         <CheckCircle className="w-4 h-4" />
                      </button>
                      <button 
                         onClick={() => handleDelete(msg.id)}
                         className="p-2 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                         title="Delete Feedback"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>
             ))}
           </div>
        )}
      </div>
    </div>
  )
}
