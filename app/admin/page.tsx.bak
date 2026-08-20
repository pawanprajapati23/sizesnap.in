'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { collection, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore'
import { Users, Download, Activity, MessageSquare, Clock } from 'lucide-react'

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
        
        // Get all events for the selected range
        const rangeQ = query(eventsRef, where('timestamp', '>=', Timestamp.fromDate(rangeStart)))
        const rangeSnap = await getDocs(rangeQ)
        
        // Get today's events for the static "Today" stat
        const todayQ = query(eventsRef, where('timestamp', '>=', Timestamp.fromDate(todayStart)))
        const todaySnap = await getDocs(todayQ)

        let rangeVisitors = 0
        let rangeDownloads = 0
        let todayVisitors = 0
        
        const toolCounts: Record<string, number> = {}

        rangeSnap.forEach(doc => {
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

        todaySnap.forEach(doc => {
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
        const msgSnap = await getDocs(msgQ)
        const loadedMsgs: any[] = []
        msgSnap.forEach(doc => {
           loadedMsgs.push({ id: doc.id, ...doc.data() })
        })
        setMessages(loadedMsgs)

      } catch (err) {
        console.error("Error fetching data:", err)
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
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl">
      
      {/* Overview Header with Time Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
         <div>
            <h1 className="text-2xl font-bold text-slate-800">Analytics Dashboard</h1>
            <p className="text-slate-500 text-sm">Real-time usage and user feedback</p>
         </div>
         <div className="flex bg-slate-100 rounded-lg p-1">
            {(['24hr', '7day', '30day', '3month'] as const).map(tr => (
               <button 
                 key={tr}
                 onClick={() => setTimeRange(tr)}
                 className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${timeRange === tr ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
               >
                 {tr === '24hr' ? 'Last 24 Hours' : tr === '7day' ? '7 Days' : tr === '30day' ? '30 Days' : '3 Months'}
               </button>
            ))}
         </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard title={`Total Visitors (${timeRange})`} value={loading ? "..." : stats.totalVisitors} icon={Users} color="indigo" />
        <MetricCard title="Today's Visitors" value={loading ? "..." : stats.todayVisitors} icon={Activity} color="emerald" />
        <MetricCard title={`Downloads (${timeRange})`} value={loading ? "..." : stats.totalDownloads} icon={Download} color="blue" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Tool Analytics */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <Activity className="w-5 h-5 text-indigo-500" /> Tool Usage Analytics
          </h2>
          {loading ? (
             <div className="flex-1 flex items-center justify-center py-10"><div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div></div>
          ) : toolStats.length === 0 ? (
             <div className="text-center text-slate-500 py-10">No tool usage data found for this period.</div>
          ) : (
             <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
               {toolStats.map((tool, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                     <span className="font-semibold text-slate-700 capitalize text-sm">{tool.name.replace(/-/g, ' ')}</span>
                     <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold">{tool.count} uses</span>
                  </div>
               ))}
             </div>
          )}
        </div>

        {/* User Feedback Messages */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
             <MessageSquare className="w-5 h-5 text-emerald-500" /> Recent User Feedback
          </h2>
          {loading ? (
             <div className="flex-1 flex items-center justify-center py-10"><div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div></div>
          ) : messages.length === 0 ? (
             <div className="text-center text-slate-500 py-10">No messages received yet.</div>
          ) : (
             <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
               {messages.map((msg, i) => (
                  <div key={i} className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                     <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1"><Clock className="w-3 h-3"/> {msg.timestamp ? new Date(msg.timestamp.toMillis()).toLocaleString() : 'Just now'}</span>
                        <span className="text-xs font-semibold text-slate-500 truncate max-w-[150px]" title={msg.pageUrl}>{msg.pageUrl}</span>
                     </div>
                     <p className="text-sm text-slate-700 font-medium">{msg.message}</p>
                  </div>
               ))}
             </div>
          )}
        </div>

      </div>
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, color }: any) {
  const colorMap: any = {
     indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
     emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
     blue: 'bg-blue-50 text-blue-600 border-blue-100'
  }
  return (
    <div className={`p-6 rounded-2xl border ${colorMap[color]}`}>
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-slate-600 font-semibold text-sm">{title}</h3>
        <Icon className="w-6 h-6 opacity-80" />
      </div>
      <p className="text-4xl font-bold tracking-tight">{value}</p>
    </div>
  )
}
