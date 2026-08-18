'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // If firebase is not initialized properly, stop here.
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
        // If they are not logged in and not already on the login page, redirect them.
        if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [router, pathname])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  // If on login page, just render the page without the dashboard sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Render Dashboard Layout for authenticated users
  if (!user) return null

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar - Placeholder for now */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-6 hidden md:block">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-8">SizeSnap Admin</h2>
        <nav className="space-y-4">
          <a href="/admin" className="block text-blue-600 font-medium">Dashboard</a>
          <a href="#" className="block text-slate-600 dark:text-slate-400 hover:text-blue-600">Analytics</a>
          <a href="#" className="block text-slate-600 dark:text-slate-400 hover:text-blue-600">SEO Tools</a>
          <button 
            onClick={() => auth?.signOut()}
            className="block text-red-600 font-medium mt-12 hover:underline"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}
