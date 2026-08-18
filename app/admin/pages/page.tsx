'use client'

import { FileText, Plus, LayoutTemplate } from 'lucide-react'

export default function PagesManagement() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Pages & Content</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage static pages, blog posts, and legal documents.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg shadow-sm transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Create Page
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-12 text-center">
           <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <LayoutTemplate className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
           </div>
           <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">CMS Module Not Activated</h3>
           <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
             The content management system is currently being provisioned for this workspace. Check back soon.
           </p>
           <button className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
             View Documentation
           </button>
        </div>
        
        {/* Placeholder skeleton rows */}
        <div className="border-t border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20 p-6 opacity-40">
           <div className="space-y-4">
             {[1, 2, 3].map(i => (
               <div key={i} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800">
                 <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                     <FileText className="w-5 h-5 text-slate-400" />
                   </div>
                   <div>
                     <div className="h-4 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-2"></div>
                     <div className="h-3 w-20 bg-slate-100 dark:bg-slate-800 rounded"></div>
                   </div>
                 </div>
                 <div className="h-8 w-24 bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  )
}
