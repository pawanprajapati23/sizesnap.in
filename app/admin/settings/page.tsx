'use client'

import { useState } from 'react'
import { Save, AlertCircle } from 'lucide-react'

export default function GeneralSettings() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1000)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">General Settings</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Basic configuration for your Sizesnap platform.</p>
      </div>

      <div className="max-w-2xl bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-6">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Platform Name</label>
          <input 
            type="text" 
            defaultValue="SizeSnap" 
            className="w-full px-3 py-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-md focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all outline-none text-sm text-zinc-900 dark:text-zinc-100" 
          />
        </div>
        
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Support Email</label>
          <input 
            type="email" 
            defaultValue="support@sizesnap.in" 
            className="w-full px-3 py-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-md focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all outline-none text-sm text-zinc-900 dark:text-zinc-100" 
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Default Language</label>
          <select className="w-full px-3 py-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-md focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all outline-none text-sm text-zinc-900 dark:text-zinc-100 appearance-none">
            <option value="en">English (US)</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
        
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Timezone</label>
          <select className="w-full px-3 py-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-md focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all outline-none text-sm text-zinc-900 dark:text-zinc-100 appearance-none">
            <option value="UTC">UTC (Coordinated Universal Time)</option>
            <option value="EST">EST (Eastern Standard Time)</option>
            <option value="IST">IST (Indian Standard Time)</option>
          </select>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-md flex gap-3 mt-8">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400">System Re-initialization</h4>
            <p className="text-xs text-amber-700 dark:text-amber-500/80 mt-1 leading-relaxed">
              Changing the default timezone will affect all analytics data aggregation going forward. Existing data will remain in UTC.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 text-white dark:text-black text-sm font-medium rounded-md transition-colors disabled:opacity-70"
          >
            {isSaving ? (
               <div className="w-4 h-4 mr-2 border-2 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin"></div>
            ) : (
               <Save className="w-4 h-4 mr-2" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
