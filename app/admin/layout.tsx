'use client';

import '@/app/globals.css';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const isLoginPage = pathname === '/admin/login';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {!isLoginPage && <Navbar />}
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Hidden on Login Page */}
          {!isLoginPage && (
            <aside className="w-64 bg-white border-r border-gray-200 shadow-sm flex flex-col hidden md:flex">
              <div className="p-5 border-b border-gray-200 flex flex-col items-center text-center bg-gray-50/50">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-sm mb-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/pawan.jpeg" alt="Pawan Prajapati" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-sm font-bold text-gray-900">Pawan Prajapati</h2>
                <a href="mailto:diplomawithbtech@gmail.com" className="text-xs text-gray-500 hover:text-[#414FA8] hover:underline mt-0.5">
                  diplomawithbtech@gmail.com
                </a>
              </div>
              <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <Link 
                  href="/admin" 
                  className={`flex items-center gap-3 px-4 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-[#EEF1FB] hover:text-[#414FA8] transition-colors ${pathname === '/admin' ? 'bg-[#EEF1FB] text-[#414FA8]' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  Dashboard
                </Link>
                <Link 
                  href="/admin/tools" 
                  className={`flex items-center gap-3 px-4 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-[#EEF1FB] hover:text-[#414FA8] transition-colors ${pathname === '/admin/tools' ? 'bg-[#EEF1FB] text-[#414FA8]' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Tools Management
                </Link>
                <Link
                  href="/admin/performance"
                  className={`flex items-center gap-3 px-4 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-[#EEF1FB] hover:text-[#414FA8] transition-colors ${pathname === '/admin/performance' ? 'bg-[#EEF1FB] text-[#414FA8]' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                  Tool Performance
                </Link>
                <Link
                  href="/admin/errors"
                  className={`flex items-center gap-3 px-4 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-[#EEF1FB] hover:text-[#414FA8] transition-colors ${pathname === '/admin/errors' ? 'bg-[#EEF1FB] text-[#414FA8]' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                  Tool Errors
                </Link>
                <Link
                  href="/admin/health"
                  className={`flex items-center gap-3 px-4 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-[#EEF1FB] hover:text-[#414FA8] transition-colors ${pathname === '/admin/health' ? 'bg-[#EEF1FB] text-[#414FA8]' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  Site Health
                </Link>
                <Link 
                  href="/admin/inbox" 
                  className={`flex items-center gap-3 px-4 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-[#EEF1FB] hover:text-[#414FA8] transition-colors ${pathname === '/admin/inbox' ? 'bg-[#EEF1FB] text-[#414FA8]' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                  User Inbox
                </Link>
                <Link
                  href="/admin/ads"
                  className={`flex items-center gap-3 px-4 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-[#EEF1FB] hover:text-[#414FA8] transition-colors ${pathname === '/admin/ads' ? 'bg-[#EEF1FB] text-[#414FA8]' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
                  Ads
                </Link>

                <Link
                  href="/admin/blog"
                  className={`flex items-center gap-3 px-4 py-2.5 text-gray-700 font-medium rounded-lg hover:bg-[#EEF1FB] hover:text-[#414FA8] transition-colors ${pathname === '/admin/blog' ? 'bg-[#EEF1FB] text-[#414FA8]' : ''}`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                  Blog Content
                </Link>
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
                </div>
              </nav>
            </aside>
          )}

          {/* Main Content */}
          <main className="flex-1 max-w-full p-4 sm:p-6 overflow-y-auto" id="admin-main">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
