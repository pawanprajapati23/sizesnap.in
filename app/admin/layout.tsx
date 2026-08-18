'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { LayoutDashboard, Activity, Wrench, FileText, Search, Users, Settings, LogOut } from 'lucide-react'

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

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Realtime', href: '/admin/realtime', icon: Activity },
    { name: 'Tools Analytics', href: '/admin/tools', icon: Wrench },
    { name: 'Pages & Content', href: '/admin/pages', icon: FileText },
    { name: 'SEO & Search', href: '/admin/seo', icon: Search },
    { name: 'System Health', href: '/admin/system-health', icon: Activity },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col hidden md:flex">
        <div className="p-6">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">SizeSnap</h2>
          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Admin Workspace</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon className={`mr-3 w-5 h-5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
                {item.name}
              </a>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center px-4 py-3 mb-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold text-sm mr-3">
              A
            </div>
            <div className="overflow-hidden text-ellipsis text-sm font-medium text-slate-700 dark:text-slate-300">
              Admin
            </div>
          </div>
          <button 
            onClick={() => auth?.signOut()}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
          >
            <LogOut className="mr-3 w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-8 shrink-0">
          <h1 className="text-lg font-semibold text-slate-800 dark:text-white">Dashboard</h1>
        </header>
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-900/50">
          {children}
        </div>
      </main>
    </div>
  )
}
