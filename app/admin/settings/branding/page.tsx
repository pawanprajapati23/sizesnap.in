'use client'

import { useState } from 'react'
import { Save, UploadCloud } from 'lucide-react'

export default function BrandingSettings() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1000)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Branding & Identity</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Configure logos, colors, and visual themes for the platform.</p>
      </div>

      <div className="space-y-8 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Primary Logo (Light Mode)</label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center shadow-sm border border-slate-200 dark:border-slate-700 mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5 text-indigo-500" />
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Click to upload</p>
              <p className="text-xs text-slate-500 mt-1">SVG, PNG, or JPG (max 2MB)</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Primary Logo (Dark Mode)</label>
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer bg-slate-900 group">
              <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center shadow-sm border border-slate-700 mb-3 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-5 h-5 text-indigo-400" />
              </div>
              <p className="text-sm font-medium text-white">Click to upload</p>
              <p className="text-xs text-slate-400 mt-1">White or light variants</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Brand Colors</label>
          <div className="flex flex-wrap gap-4">
             <div className="space-y-2">
               <div className="text-xs font-medium text-slate-500">Primary</div>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700" style={{ backgroundColor: '#4f46e5' }}></div>
                 <input type="text" defaultValue="#4F46E5" className="w-24 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none uppercase" />
               </div>
             </div>
             <div className="space-y-2">
               <div className="text-xs font-medium text-slate-500">Accent</div>
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700" style={{ backgroundColor: '#ec4899' }}></div>
                 <input type="text" defaultValue="#EC4899" className="w-24 px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-sm outline-none uppercase" />
               </div>
             </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium rounded-xl shadow-sm shadow-indigo-500/20 transition-all"
          >
            {isSaving ? <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? 'Saving...' : 'Save Branding'}
          </button>
        </div>
      </div>
    </div>
  )
}
