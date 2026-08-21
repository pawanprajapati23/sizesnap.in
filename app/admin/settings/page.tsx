'use client'

import { useState, useEffect } from 'react'

export default function GeneralSettings() {
  const [activeTab, setActiveTab] = useState('general')
  const [gscConnected, setGscConnected] = useState(false)

  useEffect(() => {
    // Check GSC status
    fetch('/api/admin/seo')
      .then(res => res.json())
      .then(data => {
         if (data.success && data.connected) {
            setGscConnected(true)
         }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Settings</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Manage platform configuration and integrations.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {['General', 'SEO Defaults', 'Integrations', 'Admin Account'].map(tab => {
               const id = tab.toLowerCase().replace(' ', '-')
               return (
                 <button 
                   key={id}
                   onClick={() => setActiveTab(id)}
                   className={`text-left px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${activeTab === id ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white' : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
                 >
                   {tab}
                 </button>
               )
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'general' && (
            <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-6">
               <h2 className="text-lg font-semibold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-4">General Settings</h2>
               <div className="space-y-4 max-w-md">
                 <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Site Name</label>
                    <input type="text" defaultValue="SizeSnap" className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Support Email</label>
                    <input type="email" defaultValue="support@sizesnap.in" className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                 </div>
                 <button className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
                   Save Changes
                 </button>
               </div>
            </div>
          )}

          {activeTab === 'seo-defaults' && (
            <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-6">
               <h2 className="text-lg font-semibold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-4">SEO Defaults</h2>
               <div className="space-y-4 max-w-md">
                 <p className="text-sm text-zinc-500">Configure fallback meta tags for pages without specific SEO settings.</p>
                 <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">Default Title Suffix</label>
                    <input type="text" defaultValue=" | SizeSnap" className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
                 </div>
                 <button className="px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors">
                   Save Changes
                 </button>
               </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-6">
               <h2 className="text-lg font-semibold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-4">Integrations</h2>
               <div className="space-y-4">
                 
                 <div className="flex items-center justify-between p-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center font-bold text-blue-500">G</div>
                       <div>
                         <p className="font-medium text-zinc-900 dark:text-zinc-100">Google Search Console</p>
                         <p className="text-xs text-zinc-500">Required for SEO metrics</p>
                       </div>
                    </div>
                    <div>
                       {gscConnected ? (
                         <span className="flex items-center gap-1.5 text-sm font-medium text-green-600 dark:text-green-400">
                           <span className="w-2 h-2 rounded-full bg-green-500"></span> Connected
                         </span>
                       ) : (
                         <span className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400">
                           <span className="w-2 h-2 rounded-full border-2 border-zinc-400 dark:border-zinc-500"></span> Not Connected
                         </span>
                       )}
                    </div>
                 </div>

               </div>
            </div>
          )}

          {activeTab === 'admin-account' && (
            <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 space-y-6">
               <h2 className="text-lg font-semibold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-800 pb-4">Admin Account</h2>
               <div className="space-y-4 max-w-md">
                 <p className="text-sm text-zinc-500">Manage your administrative credentials.</p>
                 <button className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-white text-sm font-medium rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm">
                   Change Password
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
