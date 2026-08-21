'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore'
import { Users, Download, Activity, MessageSquare, Clock, ArrowUpRight } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalVisitors: 0,
    todayVisitors: 0,
    totalDownloads: 0,
    feedbackCount: 0,
    organicClicks: null as number | null
  })
  
  const [toolStats, setToolStats] = useState<any[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState<'24hr' | '7day' | '30day' | '3month'>('30day')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/admin/dashboard?timeRange=${timeRange}`)
        const data = await res.json()
        
        if (data.success) {
          setStats(data.stats)
          setToolStats(data.toolStats)
          setMessages(data.messages)
        }
      } catch (err) {
        console.warn("Network error or API failed:", err)
      } finally {
        setLoading(false)
      }
    }

    let unsubscribeAuth: any;
    if (auth) {
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          if (user) fetchData();
          else window.location.href = '/admin/login';
        });
      });
    }
    return () => { if (unsubscribeAuth) unsubscribeAuth(); }
  }, [timeRange])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Dashboard</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Overview of SizeSnap performance.</p>
         </div>
         <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-md border border-zinc-200 dark:border-zinc-800">
            {(['24hr', '7day', '30day', '3month'] as const).map(tr => (
               <button 
                 key={tr}
                 onClick={() => setTimeRange(tr)}
                 className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${timeRange === tr ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm border border-zinc-200 dark:border-zinc-700' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
               >
                 {tr === '24hr' ? 'Today' : tr === '7day' ? '7d' : tr === '30day' ? '30d' : '3m'}
               </button>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Tool Uses" value={loading ? "..." : stats.totalVisitors} />
        <MetricCard title="Downloads" value={loading ? "..." : stats.totalDownloads} />
        <MetricCard title="Feedback" value={loading ? "..." : stats.feedbackCount} />
        <MetricCard title="Organic Clicks" value={stats.organicClicks === null ? "GSC Not Connected" : stats.organicClicks} isText={stats.organicClicks === null} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-[#0A0A0A] rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col">
          <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
             <h2 className="text-sm font-semibold">Top Tools</h2>
          </div>
          {loading ? (
             <div className="flex-1 flex items-center justify-center py-10"><div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div></div>
          ) : toolStats.length === 0 ? (
             <div className="text-center text-zinc-500 text-sm py-10">No data found for this period.</div>
          ) : (
             <div className="flex-1 overflow-y-auto max-h-[350px]">
               <table className="w-full text-sm text-left">
                  <thead className="text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 sticky top-0 border-b border-zinc-200 dark:border-zinc-800">
                     <tr>
                        <th className="px-5 py-3 font-medium">Tool Name</th>
                        <th className="px-5 py-3 font-medium text-right">Uses</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                     {toolStats.slice(0, 10).map((tool, i) => (
                        <tr key={i} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                           <td className="px-5 py-3 font-medium capitalize text-zinc-900 dark:text-zinc-200">{tool.name.replace(/-/g, ' ')}</td>
                           <td className="px-5 py-3 text-right text-zinc-600 dark:text-zinc-400">{tool.count.toLocaleString()}</td>
                        </tr>
                     ))}
                  </tbody>
               </table>
             </div>
          )}
        </div>

        <div className="bg-white dark:bg-[#0A0A0A] rounded-lg border border-zinc-200 dark:border-zinc-800 flex flex-col">
          <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
             <h2 className="text-sm font-semibold">Recent Feedback</h2>
             <a href="/admin/feedback" className="text-xs text-blue-600 hover:underline">View All</a>
          </div>
          {loading ? (
             <div className="flex-1 flex items-center justify-center py-10"><div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div></div>
          ) : messages.length === 0 ? (
             <div className="text-center text-zinc-500 text-sm py-10">No messages received yet.</div>
          ) : (
             <div className="flex-1 overflow-y-auto max-h-[350px] divide-y divide-zinc-100 dark:divide-zinc-800/50">
               {messages.slice(0, 5).map((msg, i) => (
                  <div key={i} className="p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                     <div className="flex items-center justify-between mb-2 text-xs">
                        <span className="text-zinc-500">{msg.timestamp ? new Date(msg.timestamp).toLocaleDateString() : 'Just now'}</span>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-sm text-[10px] font-medium ${msg.read ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>{msg.read ? 'Read' : 'New'}</span>
                          <a href={msg.pageUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 truncate max-w-[150px]" title={msg.pageUrl}>
                             {(() => {
                                try { return new URL(msg.pageUrl || 'https://sizesnap.in').pathname } 
                                catch { return msg.pageUrl || 'Unknown' }
                             })()} <ArrowUpRight className="w-3 h-3" />
                          </a>
                        </div>
                     </div>
                     <p className="text-sm text-zinc-800 dark:text-zinc-200 line-clamp-2">{msg.message}</p>
                  </div>
               ))}
             </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, isText }: { title: string, value: any, isText?: boolean }) {
  return (
    <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0A0A0A] flex flex-col">
      <h3 className="text-zinc-500 dark:text-zinc-400 text-xs font-medium tracking-wide uppercase">{title}</h3>
      <p className={`mt-2 tracking-tight ${isText ? 'text-sm font-medium text-zinc-500' : 'text-3xl font-semibold text-zinc-900 dark:text-zinc-50'}`}>{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
  )
}
