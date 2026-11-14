'use client';

import '@/app/globals.css';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import AdminGuard from '@/components/AdminGuard';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import {
  LayoutDashboard,
  Activity,
  Wrench,
  HeartPulse,
  Inbox,
  BookOpen,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

const NAV_GROUPS = [
  {
    groupLabel: 'Analytics & Telemetry',
    items: [
      { href: '/admin', label: 'Overview & Traffic', icon: LayoutDashboard },
      { href: '/admin/live-activity', label: 'Live Conversions', icon: Activity },
      { href: '/admin/tools', label: 'Tools & Diagnostics', icon: Wrench },
    ],
  },
  {
    groupLabel: 'Content & Operations',
    items: [
      { href: '/admin/blog', label: 'Blog CMS', icon: BookOpen },
      { href: '/admin/inbox', label: 'User Inbox', icon: Inbox },
      { href: '/admin/health', label: 'Route Health', icon: HeartPulse },
    ],
  },
];

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'Overview & Visitor Traffic',
  '/admin/live-activity': 'Live Conversion Stream',
  '/admin/tools': 'Tools Catalog & Diagnostics',
  '/admin/performance': 'Tools Catalog & Diagnostics',
  '/admin/errors': 'Tools Catalog & Diagnostics',
  '/admin/blog': 'Blog Content Manager',
  '/admin/inbox': 'User Feedback Inbox',
  '/admin/health': 'Route Latency & Health Probe',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  const currentTitle =
    (pathname && PAGE_TITLES[pathname]) ||
    (pathname?.startsWith('/admin/blog/edit') ? 'Article Editor' : 'Admin Console');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoginPage) {
    return <AdminGuard>{children}</AdminGuard>;
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans antialiased">
        {/* Top Bar Contract: Zone 1 (Brand + Breadcrumb), Zone 2 (Spacer/Context), Zone 3 (Primary Actions) */}
        <header className="sticky top-0 z-40 h-14 w-full bg-white border-b border-slate-200">
          <div className="flex h-full items-center justify-between gap-8 px-4 sm:px-6">
            {/* Left: Mobile Drawer Button + Single-Line Brand & Breadcrumb */}
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <Link
                href="/admin"
                className="flex items-center gap-2.5 text-sm font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="SizeSnap"
                  referrerPolicy="no-referrer"
                  className="w-6 h-6 object-contain"
                />
                <span>SizeSnap Console</span>
              </Link>

              <span className="hidden sm:inline text-slate-300" aria-hidden="true">
                /
              </span>
              <span className="hidden sm:inline text-sm font-medium text-slate-600 truncate">
                {currentTitle}
              </span>
            </div>

            {/* Right: Public Site Link + Account + Sign Out */}
            <div className="flex items-center gap-4 shrink-0">
              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
              >
                <span>Open Public Site</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>

              <span className="text-slate-200" aria-hidden="true">
                |
              </span>

              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-600 whitespace-nowrap">
                <span className="font-semibold text-slate-900">Pawan Prajapati</span>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-medium text-slate-700 hover:text-rose-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title="Sign out of Admin Console"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Workspace Shell: 240px Sidebar + Main Content Viewport */}
        <div className="flex flex-1 relative">
          {mobileMenuOpen && (
            <div
              className="fixed inset-0 bg-slate-900/40 z-30 md:hidden"
              onClick={() => setMobileMenuOpen(false)}
            />
          )}

          <aside
            className={`fixed md:static inset-y-0 left-0 z-30 w-60 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-150 ease-out ${
              mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}
          >
            <nav className="p-4 space-y-6">
              {NAV_GROUPS.map((group) => (
                <div key={group.groupLabel} className="space-y-1">
                  <div className="px-3 pb-1.5 text-[11px] font-semibold text-slate-400 tracking-wide">
                    {group.groupLabel}
                  </div>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      pathname === item.href ||
                      (item.href === '/admin/tools' &&
                        (pathname === '/admin/performance' || pathname === '/admin/errors')) ||
                      (item.href === '/admin/blog' && pathname?.startsWith('/admin/blog'));

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                          isActive
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>

            <div className="p-4 border-t border-slate-200 text-xs text-slate-500 space-y-1">
              <div className="font-semibold text-slate-800 truncate">sizesnap.in</div>
              <div className="text-[11px] text-slate-400 truncate">100% Client-Side Engine</div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8" id="admin-main">
            <div className="max-w-6xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
