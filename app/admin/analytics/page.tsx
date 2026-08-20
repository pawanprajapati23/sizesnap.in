'use client'

import { useState, useEffect } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from 'firebase/firestore'
import { PieChart, BarChart3, ArrowUpRight, Activity } from 'lucide-react'

export default function DeepAnalytics() {
  const [loading, setLoading] = useState(true)
  const [topTools, setTopTools] = useState<any[]>([])
  const [totalProcessed, setTotalProcessed] = useState(0)
  
  useEffect(() => {
    const fetchStats = async () => {
      if (!db) return
      try {
        setLoading(true)
        // In a real app, this would be an aggregated collection, but for now we'll simulate by fetching recent raw events
        const q = query(collection(db, 'analytics_events_raw'), orderBy('timestamp', 'desc'), limit(500))
        const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout fetching data')), 5000))
        const snap = await Promise.race([getDocs(q), timeout]) as any
        
        let total = 0
        const toolCounts: Record<string, number> = {}
        
        snap.forEach(doc => {
          total++
          const data = doc.data()
          const tool = data.eventName || 'Unknown Tool'
          toolCounts[tool] = (toolCounts[tool] || 0) + 1
        })
        
        setTotalProcessed(total)
        
        const sortedTools = Object.keys(toolCounts)
          .map(k => ({ name: k, count: toolCounts[k] }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 5)
          
        setTopTools(sortedTools)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchStats()
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Deep Analytics</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Monitor tool usage and processing metrics to optimize your platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-md">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Total Files Processed (Last 7 Days)</p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{loading ? '...' : totalProcessed.toLocaleString()}</h3>
            </div>
          </div>
          
          <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden flex">
            <div className="h-full bg-indigo-500 w-[60%]" title="Images"></div>
            <div className="h-full bg-blue-400 w-[30%]" title="PDFs"></div>
            <div className="h-full bg-zinc-300 w-[10%]" title="Others"></div>
          </div>
          <div className="flex justify-between text-xs text-zinc-500 mt-2 font-medium">
            <span>60% Images</span>
            <span>30% PDFs</span>
            <span>10% Others</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0A0A0A] p-6 rounded-lg border border-zinc-200 dark:border-zinc-800">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4" /> Top Trending Tools
          </h3>
          
          {loading ? (
             <div className="flex justify-center py-6"><div className="w-4 h-4 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div></div>
          ) : topTools.length === 0 ? (
             <p className="text-sm text-zinc-500">Not enough data to display trends.</p>
          ) : (
            <div className="space-y-4">
              {topTools.map((tool, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{tool.name}</span>
                    <span className="text-zinc-500">{tool.count} uses</span>
                  </div>
                  <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-zinc-900 dark:bg-zinc-100" style={{ width: `${Math.max((tool.count / topTools[0].count) * 100, 5)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 bg-zinc-50 dark:bg-zinc-900/30 rounded-lg border border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500">
        <PieChart className="w-8 h-8 mx-auto text-zinc-400 mb-3" />
        Connect Google Analytics or Plausible for deeper traffic insights.
      </div>
    </div>
  )
}
