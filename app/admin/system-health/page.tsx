'use client'

import { ShieldAlert, Server, Database, Cpu, CheckCircle2 } from 'lucide-react'

export default function SystemHealth() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">System Health</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Monitor infrastructure, database performance, and API limits.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
          <Server className="w-6 h-6 text-zinc-900 dark:text-zinc-100 mb-3" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Web Servers</h3>
          <p className="text-xs text-green-600 dark:text-green-500 font-medium flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Operational</p>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
          <Database className="w-6 h-6 text-zinc-900 dark:text-zinc-100 mb-3" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Database Cluster</h3>
          <p className="text-xs text-green-600 dark:text-green-500 font-medium flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Operational</p>
        </div>
        <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
          <Cpu className="w-6 h-6 text-zinc-900 dark:text-zinc-100 mb-3" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">Background Workers</h3>
          <p className="text-xs text-green-600 dark:text-green-500 font-medium flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Operational</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0A0A0A] rounded-lg border border-zinc-200 dark:border-zinc-800 p-8 flex flex-col items-center justify-center min-h-[300px] text-center">
        <div className="w-12 h-12 rounded-full bg-zinc-50 dark:bg-zinc-900/50 flex items-center justify-center mb-4 border border-zinc-200 dark:border-zinc-800">
          <ShieldAlert className="w-6 h-6 text-zinc-400 dark:text-zinc-500" />
        </div>
        <h2 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">No Active Incidents</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed">
          All systems are running normally. Detailed metrics and tracing logs will appear here when configured.
        </p>
      </div>
    </div>
  )
}
