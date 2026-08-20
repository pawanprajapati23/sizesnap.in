'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (!auth) throw new Error('Firebase configuration missing (auth is undefined)')
      
      const cred = await signInWithEmailAndPassword(auth, email, password)
      
      // Enforce single active device per user
      const sessionId = crypto.randomUUID()
      if (db) {
        await setDoc(doc(db, 'admin_sessions', cred.user.uid), {
          sessionId,
          lastLogin: serverTimestamp(),
          uid: cred.user.uid
        })
      }
      localStorage.setItem('sizesnap_admin_session', sessionId)
      
      router.push('/admin')
    } catch (err: any) {
      setError(`${err.code || 'Error'}: ${err.message}.`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-black p-4 font-sans text-zinc-900 dark:text-zinc-100">
      <div className="max-w-[400px] w-full bg-white dark:bg-[#0A0A0A] p-8 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
        <div className="mb-8">
          <div className="w-10 h-10 bg-zinc-900 dark:bg-white text-white dark:text-black flex items-center justify-center font-bold text-lg rounded-md mb-6">
            S
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Sign in to SizeSnap</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1.5">Enter your admin credentials below</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 p-3 rounded-md text-sm mb-6 flex items-start">
            <AlertCircle className="w-4 h-4 mr-2 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Email address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-md focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all outline-none text-sm placeholder:text-zinc-400"
              placeholder="admin@sizesnap.in"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-md focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all outline-none text-sm placeholder:text-zinc-400"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black text-sm font-medium py-2.5 rounded-md transition-colors disabled:opacity-70 flex items-center justify-center mt-2 group"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin"></div>
            ) : (
              <>Sign In <ArrowRight className="w-4 h-4 ml-2 opacity-70 group-hover:translate-x-0.5 transition-transform" /></>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
