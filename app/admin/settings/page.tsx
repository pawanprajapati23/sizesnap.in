'use client'

import { Settings2, User, Bell, Shield, Key } from 'lucide-react'

export default function Settings() {
  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your workspace preferences and account configurations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 rounded-xl">
            <User className="w-4 h-4" /> Profile
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
            <Settings2 className="w-4 h-4" /> Workspace
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
            <Bell className="w-4 h-4" /> Notifications
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
            <Shield className="w-4 h-4" /> Security
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded-xl transition-colors">
            <Key className="w-4 h-4" /> API Keys
          </button>
        </div>
        
        <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8">
           <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Profile Settings</h2>
           
           <div className="space-y-6 opacity-60 pointer-events-none">
             <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Display Name</label>
               <input type="text" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg" placeholder="Admin User" disabled />
             </div>
             
             <div>
               <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
               <input type="email" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg" placeholder="admin@sizesnap.in" disabled />
             </div>

             <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
               <button className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg shadow-sm">Save Changes</button>
             </div>
           </div>
           
           <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/30 rounded-xl flex gap-3">
             <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
             <div>
               <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">Read-Only Mode</h4>
               <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-1">Settings modifications are currently disabled in this demo environment.</p>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}
