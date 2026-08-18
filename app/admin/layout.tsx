'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, User } from 'firebase/auth'
import { LayoutDashboard, Activity, Wrench, FileText, Search, Settings, LogOut, ShieldAlert } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="w-10 h-10 border-4 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!user) return null

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Tools Analytics', href: '/admin/tools', icon: Wrench },
    { name: 'Pages & Content', href: '/admin/pages', icon: FileText },
    { name: 'SEO & Search', href: '/admin/seo', icon: Search },
    { name: 'System Health', href: '/admin/system-health', icon: ShieldAlert },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans selection:bg-indigo-500/30">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/60 flex flex-col hidden lg:flex shadow-sm z-10">
        <div className="px-6 py-8 flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 bg-indigo-600 flex items-center justify-center">
             <img src="/logo.png" alt="SizeSnap Logo" className="absolute inset-0 w-full h-full object-cover bg-white" onError={(e) => { e.currentTarget.style.display = 'none' }} />
             <span className="text-white font-bold text-sm z-0">S</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">SizeSnap</h2>
            <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-0.5">Admin Portal</p>
          </div>
        </div>
        
        <div className="px-4 pb-4">
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-3">Main Navigation</div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin')
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-indigo-50/80 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300 shadow-sm ring-1 ring-indigo-500/10'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <item.icon className={`mr-3 w-5 h-5 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'}`} strokeWidth={isActive ? 2.5 : 2} />
                  {item.name}
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
                </a>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="flex items-center px-3 py-3 mb-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl ring-1 ring-slate-200/50 dark:ring-slate-800/50">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm mr-3 shadow-inner">
              {user.email ? user.email.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden flex-1">
              <div className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate">
                Admin User
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {user.email}
              </div>
            </div>
          </div>
          <button 
            onClick={() => auth?.signOut()}
            className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200 group"
          >
            <LogOut className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between px-8 sticky top-0 z-20">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white capitalize">
              {pathname === '/admin' ? 'Dashboard Overview' : pathname.split('/').pop()?.replace('-', ' ')}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               System Operational
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
