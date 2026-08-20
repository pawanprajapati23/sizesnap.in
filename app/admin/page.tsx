'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore'
import { Users, Download, Activity, MessageSquare, Clock, ArrowUpRight } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    totalDownloads: 0
  })
  
  const [toolStats, setToolStats] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState<'24hr' | '7day' | '30day' | '3month'>('24hr')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribeAuth: any;
    
    async function fetchData() {
      if (!db) return
      
      try {
        setLoading(true)
        
        // Time calculations
        const now = new Date()
        const todayStart = new Date(now)
        todayStart.setHours(0, 0, 0, 0)

        let rangeStart = new Date(now)
        if (timeRange === '24hr') rangeStart.setHours(now.getHours() - 24)
        if (timeRange === '7day') rangeStart.setDate(now.getDate() - 7)
        if (timeRange === '30day') rangeStart.setDate(now.getDate() - 30)
        if (timeRange === '3month') rangeStart.setMonth(now.getMonth() - 3)

        const eventsRef = collection(db, 'analytics_events_raw')
        
        // Helper to add timeout to getDocs
        const fetchWithTimeout = async (q: any) => {
          const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout fetching data')), 5000))
          return Promise.race([getDocs(q), timeout]) as Promise<any>
        }

        // Get events for the selected range (limited to 1000 to prevent browser crash/infinite loading)
        const rangeQ = query(eventsRef, where('timestamp', '>=', Timestamp.fromDate(rangeStart)), limit(1000))
        const rangeSnap = await fetchWithTimeout(rangeQ)
        
        // Get today's events for the static "Today" stat
        const todayQ = query(eventsRef, where('timestamp', '>=', Timestamp.fromDate(todayStart)), limit(1000))
        const todaySnap = await fetchWithTimeout(todayQ)

        let rangeVisitors = 0
        let rangeDownloads = 0
        let todayVisitors = 0
        
        const toolCounts: Record<string, number> = {}

        rangeSnap.forEach((doc: any) => {
          const data = doc.data()
          if (data.eventName === 'tool_open') {
             rangeVisitors++
             const tool = data.toolName || data.toolSlug || 'Unknown'
             toolCounts[tool] = (toolCounts[tool] || 0) + 1
          }
          if (data.eventName === 'tool_download') {
             rangeDownloads++
          }
        })

        todaySnap.forEach((doc: any) => {
          if (doc.data().eventName === 'tool_open') {
             todayVisitors++
          }
        })

        const sortedTools = Object.entries(toolCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)

        setStats({
          totalVisitors: rangeVisitors,
          todayVisitors: todayVisitors,
          totalDownloads: rangeDownloads
        })
        
        setToolStats(sortedTools)

        // Fetch Feedback Messages
        const msgRef = collection(db, 'user_feedback')
        const msgQ = query(msgRef, orderBy('timestamp', 'desc'), limit(50))
        const msgSnap = await fetchWithTimeout(msgQ)
        const loadedMsgs: any[] = []
        msgSnap.forEach((doc: any) => {
           loadedMsgs.push({ id: doc.id, ...doc.data() })
        })
        setMessages(loadedMsgs)

      } catch (err) {
        console.warn("Could not fetch some data, possibly due to permission rules or network.", err)
      } finally {
        setLoading(false)
      }
    }

    if (auth) {
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          if (user) {
            fetchData();
          } else {
            window.location.href = '/admin/login';
          }
        });
      });
    }

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
    }
  }, [timeRange])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Overview Header with Time Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Analytics</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Real-time usage metrics and user feedback.</p>
         </div>
         <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-md border border-zinc-200 dark:border-zinc-800">
            {(['24hr', '7day', '30day', '3month'] as const).map(tr => (
               <button 
                 key={tr}
                 onClick={() => setTimeRange(tr)}
                 className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${timeRange === tr ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm border border-zinc-200 dark:border-zinc-700' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
               >
                 {tr === '24hr' ? '24h' : tr === '7day' ? '7d' : tr === '30day' ? '30d' : '3m'}
               </button>
            ))}
         </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title={`Visitors (${timeRange})`} value={loading ? "..." : stats.totalVisitors} />
        <MetricCard title="Today's Visitors" value={loading ? "..." : stats.todayVisitors} />
        <MetricCard title={`Downloads (${timeRange})`} value={loading ? "..." : stats.totalDownloads} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Tool Analytics */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col">
          <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
             <h2 className="text-sm font-semibold">Tool Usage</h2>
          </div>
          {loading ? (
             <div className="flex-1 flex items-center justify-center py-10"><div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div></div>
          ) : toolStats.length === 0 ? (
             <div className="text-center text-zinc-500 text-sm py-10">No data found for this period.</div>
          ) : (
             <div className="flex-1 overflow-y-auto max-h-[300px]">
               <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 sticky top-0 border-b border-zinc-200 dark:border-zinc-800">
                     <tr>
                        <th className="px-5 py-3 font-medium">Tool Name</th>
                        <th className="px-5 py-3 font-medium text-right">Uses</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                     {toolStats.map((tool, i) => (
                        <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                           <td className="px-5 py-3 font-medium capitalize text-zinc-900 dark:text-zinc-200">{tool.name.replace(/-/g, ' ')}</td>
                           <td className="px-5 py-3 text-right text-zinc-600 dark:text-zinc-400">{tool.count}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             </div>
          )}
        </div>

        {/* User Feedback Messages */}
        <div className="bg-white dark:bg-[#0A0A0A] rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col">
          <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
             <h2 className="text-sm font-semibold">Recent Feedback</h2>
          </div>
          {loading ? (
             <div className="flex-1 flex items-center justify-center py-10"><div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div></div>
          ) : messages.length === 0 ? (
             <div className="text-center text-zinc-500 text-sm py-10">No messages received yet.</div>
          ) : (
             <div className="flex-1 overflow-y-auto max-h-[300px] divide-y divide-zinc-100 dark:divide-zinc-800/50">
               {messages.map((msg, i) => (
                  <div key={i} className="p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                     <div className="flex items-center justify-between mb-2 text-xs">
                        <span className="text-zinc-500">{msg.timestamp ? new Date(msg.timestamp.toMillis()).toLocaleString() : 'Just now'}</span>
                        <a href={msg.pageUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 truncate max-w-[200px]" title={msg.pageUrl}>
                           {(() => {
                              try {
                                 return new URL(msg.pageUrl || 'https://sizesnap.in').pathname
                              } catch {
                                 return msg.pageUrl || 'Unknown'
                              }
                           })()} <ArrowUpRight className="w-3 h-3" />
                        </a>
                     </div>
                     <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed">{msg.message}</p>
                  </div>
               ))}
             </div>
          )}
        </div>

      </div>
    </div>
  )
}

function MetricCard({ title, value }: { title: string, value: any }) {
  return (
    <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0A0A0A] flex flex-col">
      <h3 className="text-zinc-500 dark:text-zinc-400 text-xs font-medium tracking-wide uppercase">{title}</h3>
      <p className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mt-2">{value}</p>
    </div>
  )
}
