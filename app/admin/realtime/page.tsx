'use client'

import { Activity, Radio, Signal, Users, RefreshCw } from 'lucide-react'

export default function RealtimePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-in fade-in zoom-in duration-500">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 flex items-center justify-center relative z-10">
          <Radio className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">Realtime Analytics</h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8 text-lg">
        Monitor active users, live tool usage, and server connections as they happen in milliseconds.
      </p>
      
      <div className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-not-allowed opacity-80">
        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
        Connecting to WebSocket...
      </div>
      
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl w-full">
         <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm opacity-50">
            <Users className="w-6 h-6 text-slate-400 mb-3 mx-auto" />
            <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded mx-auto mb-2 animate-pulse"></div>
            <div className="text-xs text-slate-500 font-medium">Live Users</div>
         </div>
         <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm opacity-50">
            <Activity className="w-6 h-6 text-slate-400 mb-3 mx-auto" />
            <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded mx-auto mb-2 animate-pulse"></div>
            <div className="text-xs text-slate-500 font-medium">Events / sec</div>
         </div>
         <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm opacity-50">
            <Signal className="w-6 h-6 text-slate-400 mb-3 mx-auto" />
            <div className="h-6 w-12 bg-slate-200 dark:bg-slate-800 rounded mx-auto mb-2 animate-pulse"></div>
            <div className="text-xs text-slate-500 font-medium">Latency</div>
         </div>
      </div>
    </div>
  )
}
