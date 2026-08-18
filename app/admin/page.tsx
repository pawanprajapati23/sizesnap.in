'use client'

import { auth } from '@/lib/firebase'

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Logged in as <span className="font-medium text-slate-900 dark:text-white">{auth?.currentUser?.email}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Placeholder metric cards */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Visitors Today</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">--</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Tool Uses</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">--</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">Active Users</h3>
          <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">--</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
          <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">System Health</h3>
          <p className="text-3xl font-bold text-green-600 mt-2">100%</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">Analytics coming soon</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          Phase 4 will introduce asynchronous event tracking to populate these cards with real-time data without slowing down the public tools.
        </p>
      </div>
    </div>
  )
}
