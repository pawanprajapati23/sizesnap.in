'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User, signOut } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { LayoutDashboard, Activity, Wrench, FileText, Search, Settings, LogOut, ShieldAlert } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }
    
    let unsubscribeSession: () => void;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        
        // Single session enforcement
        if (db) {
           unsubscribeSession = onSnapshot(doc(db, 'admin_settings', 'active_session'), (docSnap) => {
              if (docSnap.exists()) {
                 const data = docSnap.data()
                 const currentSession = localStorage.getItem('sizesnap_admin_session')
                 if (data.sessionId && data.sessionId !== currentSession) {
                    console.log('Another device logged in. Logging out...')
                    alert('You have been logged out because this admin account was accessed from another device.')
                    signOut(auth)
                 }
              }
           })
        }
      } else {
        setUser(null)
        if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      }
      setLoading(false)
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeSession) unsubscribeSession()
    }
  }, [pathname, router])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans selection:bg-indigo-500/30 relative">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800/60 flex flex-col shadow-xl lg:shadow-sm z-50 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-6 py-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 bg-indigo-600 flex items-center justify-center">
               <img src="/logo.png" alt="SizeSnap Logo" className="absolute inset-0 w-full h-full object-cover bg-white" onError={(e) => { e.currentTarget.style.display = 'none' }} />
               <span className="text-white font-bold text-sm z-0">S</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">SizeSnap</h2>
              <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mt-0.5">Admin Portal</p>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white">
            ✕
          </button>
        </div>
        
        <div className="px-4 pb-4 overflow-y-auto">
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
            onClick={() => auth.signOut()}
            className="flex items-center justify-center w-full px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-200 group"
          >
            <LogOut className="mr-2 w-4 h-4 group-hover:scale-110 transition-transform" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white capitalize truncate max-w-[200px] sm:max-w-xs">
              {pathname === '/admin' ? 'Dashboard Overview' : pathname.split('/').pop()?.replace('-', ' ')}
            </h1>
          </div>
          <div className="flex items-center gap-4 hidden sm:flex">
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
               System Operational
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-50/50 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
