'use client'

import { useState } from 'react'
import { Save, Search, Globe, Globe2 } from 'lucide-react'

export default function SEOSettings() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => setIsSaving(false), 1000)
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
           <Search className="w-6 h-6 text-indigo-500" />
           SEO & Discovery
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage global meta tags, robots.txt, and sitemap settings.</p>
      </div>

      <div className="space-y-6 max-w-3xl">
        <div className="space-y-4">
           <div className="space-y-2">
             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Global Meta Title Suffix</label>
             <input type="text" defaultValue=" | SizeSnap Free Tools" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white text-sm" />
           </div>
           <div className="space-y-2">
             <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Default Meta Description</label>
             <textarea rows={3} defaultValue="Free online image compressor, PDF converter, and developer tools. Fast, secure, and privacy-focused." className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all text-slate-900 dark:text-white text-sm custom-scrollbar" />
           </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
           <div className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl">
             <div className="mt-1"><Globe className="w-5 h-5 text-indigo-500" /></div>
             <div className="flex-1">
               <h4 className="font-semibold text-slate-900 dark:text-white">Auto-generate Sitemap</h4>
               <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Updates sitemap.xml automatically when tools are added.</p>
             </div>
             <label className="relative inline-flex items-center cursor-pointer mt-2">
               <input type="checkbox" className="sr-only peer" defaultChecked />
               <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
             </label>
          </div>
          
          <div className="flex items-start gap-4 p-5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl">
             <div className="mt-1"><Globe2 className="w-5 h-5 text-indigo-500" /></div>
             <div className="flex-1">
               <h4 className="font-semibold text-slate-900 dark:text-white">Search Engine Indexing</h4>
               <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Allows search engines to crawl and index your pages.</p>
             </div>
             <label className="relative inline-flex items-center cursor-pointer mt-2">
               <input type="checkbox" className="sr-only peer" defaultChecked />
               <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-600"></div>
             </label>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-medium rounded-xl shadow-sm shadow-indigo-500/20 transition-all"
          >
            {isSaving ? <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-4 h-4 mr-2" />}
            {isSaving ? 'Saving...' : 'Save SEO Rules'}
          </button>
        </div>
      </div>
    </div>
  )
}
