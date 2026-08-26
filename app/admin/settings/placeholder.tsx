'use client'

import { Shield, Zap, Wrench, BarChart3, Search, Users, Bell, Mail, HardDrive, Lock, Link, MessageSquare, AlertTriangle, FileClock } from 'lucide-react'
import { usePathname } from 'next/navigation'

export default function SettingsPlaceholder() {
  const pathname = usePathname()
  const currentPath = pathname.split('/').pop() || ''
  
  const getIcon = () => {
    switch(currentPath) {
       case 'analytics': return <BarChart3 className="w-12 h-12 text-slate-300 dark:text-slate-600" />
       case 'seo': return <Search className="w-12 h-12 text-slate-300 dark:text-slate-600" />
       case 'security': return <Shield className="w-12 h-12 text-slate-300 dark:text-slate-600" />
       case 'roles': return <Users className="w-12 h-12 text-slate-300 dark:text-slate-600" />
       case 'notifications': return <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600" />
       case 'email': return <Mail className="w-12 h-12 text-slate-300 dark:text-slate-600" />
       case 'storage': return <HardDrive className="w-12 h-12 text-slate-300 dark:text-slate-600" />
       case 'performance': return <Zap className="w-12 h-12 text-slate-300 dark:text-slate-600" />
       case 'privacy': return <Lock className="w-12 h-12 text-slate-300 dark:text-slate-600" />
       case 'integrations': return <Link className="w-12 h-12 text-slate-300 dark:text-slate-600" />
       case 'system-messages': return <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600" />
       case 'maintenance': return <AlertTriangle className="w-12 h-12 text-slate-300 dark:text-slate-600" />
       case 'audit-logs': return <FileClock className="w-12 h-12 text-slate-300 dark:text-slate-600" />
       case 'tools': return <Wrench className="w-12 h-12 text-slate-300 dark:text-slate-600" />
       default: return <Shield className="w-12 h-12 text-slate-300 dark:text-slate-600" />
    }
  }

  const getTitle = () => {
     return currentPath.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-100 dark:border-slate-800">
         {getIcon()}
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{getTitle()} Configuration</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
        This configuration module is currently being built and will be available in the next platform update.
      </p>
      <div className="inline-flex items-center px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
        Status: In Development
      </div>
    </div>
  )
}
