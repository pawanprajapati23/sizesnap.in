'use client'

import { usePathname } from 'next/navigation'
import { 
  Settings, Paintbrush, Wrench, BarChart3, Search, Shield, 
  Users, Bell, Mail, HardDrive, Zap, Lock, Flag, Link, 
  MessageSquare, AlertTriangle, FileClock 
} from 'lucide-react'
import LinkComponent from 'next/link'

const SETTINGS_MODULES = [
  { id: 'general', name: 'General', href: '/admin/settings', icon: Settings },
  { id: 'branding', name: 'Branding', href: '/admin/settings/branding', icon: Paintbrush },
  { id: 'tools', name: 'Tools', href: '/admin/settings/tools', icon: Wrench },
  { id: 'analytics', name: 'Analytics', href: '/admin/settings/analytics', icon: BarChart3 },
  { id: 'seo', name: 'SEO', href: '/admin/settings/seo', icon: Search },
  { id: 'security', name: 'Security', href: '/admin/settings/security', icon: Shield },
  { id: 'roles', name: 'Admin & Roles', href: '/admin/settings/roles', icon: Users },
  { id: 'notifications', name: 'Notifications', href: '/admin/settings/notifications', icon: Bell },
  { id: 'email', name: 'Email', href: '/admin/settings/email', icon: Mail },
  { id: 'storage', name: 'Storage & Files', href: '/admin/settings/storage', icon: HardDrive },
  { id: 'performance', name: 'Performance', href: '/admin/settings/performance', icon: Zap },
  { id: 'privacy', name: 'Privacy', href: '/admin/settings/privacy', icon: Lock },
  { id: 'feature-flags', name: 'Feature Flags', href: '/admin/settings/feature-flags', icon: Flag },
  { id: 'integrations', name: 'Integrations', href: '/admin/settings/integrations', icon: Link },
  { id: 'system-messages', name: 'System Messages', href: '/admin/settings/system-messages', icon: MessageSquare },
  { id: 'maintenance', name: 'Maintenance', href: '/admin/settings/maintenance', icon: AlertTriangle },
  { id: 'audit-logs', name: 'Audit Logs', href: '/admin/settings/audit-logs', icon: FileClock },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Global Control Center</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-2xl text-sm">
          Manage workspace preferences, system configurations, and security policies. 
          Changes made here affect the entire Sizesnap platform.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Settings Navigation */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 p-3 sticky top-24">
            <nav className="space-y-0.5 max-h-[calc(100vh-140px)] overflow-y-auto pr-2 custom-scrollbar">
              {SETTINGS_MODULES.map((item) => {
                const isActive = pathname === item.href || (item.id === 'general' && pathname === '/admin/settings')
                const Icon = item.icon
                return (
                  <LinkComponent
                    key={item.id}
                    href={item.href}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 group ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 ring-1 ring-indigo-500/10 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'}`} />
                    {item.name}
                  </LinkComponent>
                )
              })}
            </nav>
          </div>
        </div>
        
        {/* Settings Content Area */}
        <div className="flex-1 w-full min-w-0">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 p-6 sm:p-8 relative overflow-hidden">
             {children}
          </div>
        </div>
      </div>
    </div>
  )
}
