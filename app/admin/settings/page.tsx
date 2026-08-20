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
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">Global Max Upload Size (MB)</label>
          <input 
            type="number" 
            defaultValue={10} 
            className="w-full px-3 py-2 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-md focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100 transition-all outline-none text-sm text-zinc-900 dark:text-zinc-100" 
          />
          <p className="text-xs text-zinc-500 mt-1">Prevents users from uploading massive files that crash the server.</p>
        </div>
        
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Maintenance Mode</h4>
              <p className="text-xs text-zinc-500">Temporarily disable file processing on all tools.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-zinc-900 dark:peer-checked:bg-zinc-100"></div>
            </label>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Google AdSense Master Switch</h4>
              <p className="text-xs text-zinc-500">Enable or disable all ads across the platform.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-zinc-200 peer-focus:outline-none rounded-full peer dark:bg-zinc-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-green-500"></div>
            </label>
          </div>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-md flex gap-3 mt-8">
          <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 shrink-0" />
          <div>
            <h4 className="text-sm font-medium text-amber-800 dark:text-amber-400">Cache Invalidation</h4>
            <p className="text-xs text-amber-700 dark:text-amber-500/80 mt-1 leading-relaxed">
              Saving these settings will automatically clear the server cache. Users might experience a slight delay on their next request.
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
