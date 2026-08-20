'use client'

import { useState, useEffect } from 'react'
import { PieChart, BarChart3, Activity, Smartphone, Monitor, Globe, TrendingDown, Users, DownloadCloud } from 'lucide-react'

export default function DeepAnalytics() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<any>(null)
  
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/deep-analytics')
        const data = await res.json()
        if (data.success) {
           setStats(data.stats)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
    
    // Refresh live users every 10 seconds
    const interval = setInterval(fetchStats, 10000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !stats) {
    return <div className="flex h-[50vh] items-center justify-center"><div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div></div>
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Deep Analytics (30 Days)</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Monitor tool usage, conversion drops, and traffic sources.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-full">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs font-semibold text-green-700 dark:text-green-400">{stats?.liveUsers || 0} Active Now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Conversion Rate */}
        <div className="bg-white dark:bg-[#0A0A0A] p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md">
               <TrendingDown className="w-4 h-4" />
             </div>
             <span className="text-xs font-medium text-zinc-500">Success Rate</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats?.conversionRate}%</h3>
            <p className="text-xs text-zinc-500 mt-1">{stats?.totalOpens} Opens &rarr; {stats?.totalDownloads} Downloads</p>
          </div>
        </div>

        {/* Bandwidth Saved */}
        <div className="bg-white dark:bg-[#0A0A0A] p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md">
               <DownloadCloud className="w-4 h-4" />
             </div>
             <span className="text-xs font-medium text-zinc-500">Data Saved</span>
          </div>
          <div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats?.bandwidthSavedGB} GB</h3>
            <p className="text-xs text-zinc-500 mt-1">Total user bandwidth saved</p>
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white dark:bg-[#0A0A0A] p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col justify-between lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
             <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md">
               <Smartphone className="w-4 h-4" />
             </div>
             <span className="text-xs font-medium text-zinc-500">Device Traffic</span>
          </div>
          <div>
            <div className="flex justify-between items-end mb-2">
               <div>
                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats?.mobilePercentage}% <span className="text-sm font-medium text-zinc-500">Mobile</span></h3>
               </div>
               <div className="text-right">
                  <h3 className="text-lg font-bold text-zinc-700 dark:text-zinc-300">{100 - (stats?.mobilePercentage || 0)}% <span className="text-xs font-medium text-zinc-500">Desktop</span></h3>
               </div>
            </div>
            <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden flex">
              <div className="h-full bg-blue-500 transition-all duration-1000" style={{ width: `${stats?.mobilePercentage || 0}%` }}></div>
              <div className="h-full bg-zinc-300 dark:bg-zinc-600 transition-all duration-1000" style={{ width: `${100 - (stats?.mobilePercentage || 0)}%` }}></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Traffic Sources */}
        <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-6">
            <Globe className="w-4 h-4 text-zinc-400" /> Traffic Sources
          </h3>
          <div className="space-y-4">
            {stats?.sources && Object.entries(stats.sources).map(([source, count]: any, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">{source}</span>
                  <span className="text-zinc-500">{count} visits</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full bg-zinc-900 dark:bg-zinc-100" style={{ width: `${Math.max((count / stats.totalOpens) * 100, 2)}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel Drop-off Note */}
        <div className="p-6 bg-zinc-50 dark:bg-zinc-900/30 rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center items-center text-center">
          <PieChart className="w-10 h-10 text-zinc-300 dark:text-zinc-700 mb-4" />
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">Google Analytics Recommended</h3>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm leading-relaxed mb-4">
            While this dashboard estimates traffic based on tool events, connecting Google Analytics or PostHog will provide true bounce rates, session durations, and user demographics.
          </p>
          <button className="text-xs font-medium px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
            Configure Tracking IDs
          </button>
        </div>
      </div>
    </div>
  )
}
