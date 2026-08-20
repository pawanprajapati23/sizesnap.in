'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, User, signOut } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { LayoutDashboard, LogOut } from 'lucide-react'

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
        
        // Single session enforcement (skip on login page to prevent race condition during login)
        if (db && pathname !== '/admin/login') {
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
      <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] dark:bg-black">
        <div className="w-5 h-5 border-2 border-zinc-900 dark:border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!user) return null

  const navItems = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  ]

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-black flex font-sans selection:bg-zinc-200 dark:selection:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" 
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#FAFAFA] dark:bg-black border-r border-zinc-200 dark:border-zinc-800 flex flex-col z-50 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-7 h-7 bg-white rounded-md border border-zinc-200 dark:border-zinc-800 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
               <img src="/logo.png" alt="SizeSnap Logo" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
               <span className="absolute inset-0 flex items-center justify-center text-zinc-900 font-bold text-xs -z-10">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">SizeSnap</span>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="lg:hidden p-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
            ✕
          </button>
        </div>
        
        <div className="px-3 pb-4 flex-1 overflow-y-auto mt-4">
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/admin')
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive
                      ? 'bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-900 dark:text-zinc-50 font-medium'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-zinc-50'
                  }`}
                >
                  <item.icon className={`mr-3 w-4 h-4 ${isActive ? 'text-zinc-900 dark:text-white' : 'text-zinc-400'}`} strokeWidth={isActive ? 2 : 1.5} />
                  {item.name}
                </a>
              )
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between group">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-600 dark:text-zinc-300 text-xs font-medium border border-zinc-300 dark:border-zinc-700">
                {user.email ? user.email.charAt(0).toUpperCase() : 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-medium truncate">{user.email}</p>
                <p className="text-[10px] text-zinc-500">Admin</p>
              </div>
            </div>
            <button 
              onClick={() => auth.signOut()}
              className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white dark:bg-[#0A0A0A] border-l border-transparent sm:border-zinc-200 sm:dark:border-zinc-800 lg:border-l-0 sm:rounded-tl-2xl lg:rounded-none lg:shadow-none shadow-sm shadow-zinc-200/20">
        <header className="h-14 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden -ml-2 p-2 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
            </button>
            <h1 className="text-sm font-semibold capitalize">
              {pathname === '/admin' ? 'Overview' : pathname.split('/').pop()?.replace('-', ' ')}
            </h1>
          </div>
          <div className="flex items-center">
             <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 px-2 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-[#FAFAFA] dark:bg-black">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
               Production
             </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
