'use client'

import { ShieldAlert, Server, Database, Cpu, CheckCircle2 } from 'lucide-react'

export default function SystemHealth() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">System Health</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Monitor infrastructure, database performance, and API limits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
          <Server className="w-8 h-8 text-emerald-500 mb-3" />
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Web Servers</h3>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Operational</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
          <Database className="w-8 h-8 text-emerald-500 mb-3" />
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Database Cluster</h3>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Operational</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center justify-center text-center">
          <Cpu className="w-8 h-8 text-emerald-500 mb-3" />
          <h3 className="font-semibold text-slate-900 dark:text-white mb-1">Background Workers</h3>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" /> Operational</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
        <ShieldAlert className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-4" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No Active Incidents</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md">
          All systems are running normally. Detailed metrics and tracing logs will appear here when configured.
        </p>
      </div>
    </div>
  )
}
