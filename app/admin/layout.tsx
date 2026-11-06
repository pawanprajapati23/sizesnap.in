'use client';

import '@/app/globals.css';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { 
  LayoutDashboard, 
  Activity, 
  Wrench, 
  TrendingUp, 
  AlertTriangle, 
  HeartPulse, 
  Inbox, 
  BookOpen, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  ShieldCheck 
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/live-activity', label: 'Live Activity', icon: Activity },
  { href: '/admin/tools', label: 'Tools Management', icon: Wrench },
  { href: '/admin/performance', label: 'Tool Performance', icon: TrendingUp },
  { href: '/admin/errors', label: 'Tool Errors', icon: AlertTriangle },
  { href: '/admin/health', label: 'Site Health', icon: HeartPulse },
  { href: '/admin/inbox', label: 'User Inbox', icon: Inbox },
  { href: '/admin/blog', label: 'Blog Content', icon: BookOpen },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
        {/* Dedicated Admin Header - Isolated from public website */}
        {!isLoginPage && (
          <header className="sticky top-0 z-40 w-full bg-slate-900 text-white border-b border-slate-800 shadow-md">
            <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
              {/* Left Section: Mobile Toggle & Brand */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                  aria-label="Toggle navigation drawer"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 p-1.5 flex items-center justify-center border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.png" alt="SizeSnap Logo" className="w-full h-full object-contain" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base tracking-tight text-white">SizeSnap</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      <ShieldCheck className="w-3 h-3" /> Admin
                    </span>
                  </div>
                </div>

                {/* System Status Indicator (Hidden on mobile) */}
                <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs text-slate-400">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span>System Live</span>
                </div>
              </div>

              {/* Right Section: View Public Site + Profile + Logout */}
              <div className="flex items-center gap-3 sm:gap-4">
                <Link
                  href="/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-all border border-slate-700/80 shadow-sm"
                  title="Open live public website in new tab"
                >
                  <span>Public Site</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                {/* Profile Pill */}
                <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-800">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-700 bg-slate-800 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/pawan.jpeg" alt="Pawan Prajapati" className="w-full h-full object-cover" />
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-bold text-slate-200 leading-tight">Pawan Prajapati</p>
                    <p className="text-[10px] text-slate-400 leading-tight">Super Admin</p>
                  </div>
                </div>

                {/* Quick Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="Logout from Admin"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>
        )}

        {/* Admin Shell Body */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* Mobile Sidebar Overlay Backdrop */}
          {!isLoginPage && mobileMenuOpen && (
            <div 
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-30 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar (Desktop Persistent + Mobile Drawer) */}
          {!isLoginPage && (
            <aside
              className={`
                fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 shadow-lg md:shadow-none flex flex-col transition-transform duration-200 ease-in-out
                ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
              `}
            >
              {/* Profile Card Header */}
              <div className="p-5 border-b border-slate-100 flex flex-col items-center text-center bg-slate-50/70">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md mb-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/pawan.jpeg" alt="Pawan Prajapati" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-sm font-bold text-slate-900">Pawan Prajapati</h2>
                <a
                  href="mailto:diplomawithbtech@gmail.com"
                  className="text-xs text-slate-500 hover:text-indigo-600 hover:underline mt-0.5 truncate max-w-full px-2"
                >
                  diplomawithbtech@gmail.com
                </a>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-700 shadow-xs border border-indigo-100'
                          : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                <div className="pt-3 mt-3 border-t border-slate-100">
                  <Link
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-3.5 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 rounded-lg transition-colors md:hidden"
                  >
                    <span className="flex items-center gap-2">
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Public Site
                    </span>
                    <span className="text-[10px] text-slate-400">sizesnap.in</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors mt-1"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Logout</span>
                  </button>
                </div>
              </nav>
            </aside>
          )}

          {/* Main Dashboard Content Area */}
          <main className="flex-1 max-w-full p-4 sm:p-6 lg:p-8 overflow-y-auto bg-[#F8FAFC]" id="admin-main">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
