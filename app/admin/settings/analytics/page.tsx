'use client'

import { useState } from 'react'
import { Save, BarChart3, Database, RefreshCw } from 'lucide-react'

export default function AnalyticsSettings() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1000)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
           <BarChart3 className="w-6 h-6 text-indigo-500" />
           Analytics Configuration
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure telemetry, data retention, and external tracking tools.</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="space-y-2">
             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Google Analytics (GA4) ID</label>
             <input type="text" placeholder="G-XXXXXXXXXX" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white text-sm" />
           </div>
           <div className="space-y-2">
             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">PostHog Project API Key</label>
             <input type="text" placeholder="phc_..." className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white text-sm" />
           </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Data Retention Period (Internal DB)</label>
          <select className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white text-sm appearance-none">
            <option value="30">30 Days</option>
            <option value="90">90 Days (Recommended)</option>
            <option value="365">1 Year</option>
            <option value="forever">Forever (High Storage Cost)</option>
          </select>
        </div>

        <div className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl">
           <div className="mt-1"><Database className="w-5 h-5 text-indigo-500" /></div>
           <div className="flex-1">
             <h4 className="font-semibold text-slate-900 dark:text-white">Track Detailed Tool Usage</h4>
             <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Logs individual file sizes, compression times, and output formats to Firebase. May increase database reads/writes significantly.</p>
           </div>
           <label className="relative inline-flex items-center cursor-pointer mt-2">
             <input type="checkbox" className="sr-only peer" defaultChecked />
             <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
           </label>
        </div>
        
        <div className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl">
           <div className="mt-1"><RefreshCw className="w-5 h-5 text-indigo-500" /></div>
           <div className="flex-1">
             <h4 className="font-semibold text-slate-900 dark:text-white">Realtime Connection Tracking</h4>
             <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Enables WebSockets to monitor active user connections. Disable to save server resources.</p>
           </div>
           <label className="relative inline-flex items-center cursor-pointer mt-2">
             <input type="checkbox" className="sr-only peer" defaultChecked />
             <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
           </label>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium rounded-xl shadow-sm shadow-indigo-500/20 transition-all"
          >
            {isSaving ? <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  )
}
