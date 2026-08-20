'use client'

import { useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore'
import { ArrowUpRight, ArrowDownRight, Users, Activity, Download, MousePointerClick, Zap, Target, TrendingUp, Clock } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    toolOpens: 0,
    downloads: 0,
    activeNow: 0,
    recentEvents: [] as any[]
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribeAuth: any;
    let interval: any;

    async function fetchStats() {
      if (!db) {
         setStats({
            toolOpens: 0,
            downloads: 0,
            activeNow: 0,
            recentEvents: []
         })
         setLoading(false)
         return
      }
      
      try {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const eventsRef = collection(db, 'analytics_events_raw')
        const q = query(eventsRef, where('timestamp', '>=', Timestamp.fromDate(today)))
        
        const snapshot = await getDocs(q)
        
        let opens = 0
        let downloads = 0
        let recent = 0
        const fiveMinsAgo = Date.now() - (5 * 60 * 1000)
        const recentList: any[] = []

        snapshot.forEach((doc) => {
          const data = doc.data()
          if (data.eventName === 'tool_open') opens++
          if (data.eventName === 'tool_download') downloads++
          
          if (data.timestamp && data.timestamp.toMillis() > fiveMinsAgo) {
            recent++
            recentList.push({
               id: doc.id,
               ...data,
               timeMs: data.timestamp.toMillis()
            })
          }
        })

        recentList.sort((a, b) => b.timeMs - a.timeMs)

        setStats({
          toolOpens: opens,
          downloads: downloads,
          activeNow: recent,
          recentEvents: recentList.slice(0, 10)
        })
      } catch (err) {
        console.error("Error fetching stats:", err)
        setStats({
            toolOpens: 0,
            downloads: 0,
            activeNow: 0,
            recentEvents: []
         })
      } finally {
        setLoading(false)
      }
    }

    if (auth) {
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          if (user) {
            fetchStats();
            interval = setInterval(fetchStats, 15000);
          } else {
            window.location.href = '/admin/login';
          }
        });
      });
    } else {
      setLoading(false);
    }

    return () => {
      if (unsubscribeAuth) unsubscribeAuth();
      if (interval) clearInterval(interval);
    }
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="Active Users (5m)" value={loading ? "..." : stats.activeNow} change="+12.5%" isPositive={true} icon={Users} trend="up" />
        <MetricCard title="Tool Uses (Today)" value={loading ? "..." : stats.toolOpens} change="+5.2%" isPositive={true} icon={Activity} trend="up" />
        <MetricCard title="Downloads (Today)" value={loading ? "..." : stats.downloads} change="-2.1%" isPositive={false} icon={Download} trend="down" />
        <MetricCard 
          title="Conversion Rate" 
          value={loading ? "..." : stats.toolOpens > 0 ? `${Math.round((stats.downloads / stats.toolOpens) * 100)}%` : "0%"} 
          change="+1.4%" 
          isPositive={true} 
          icon={Target} 
          trend="up"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 p-6 sm:p-8 flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Revenue & Engagement</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Daily metrics across all tools</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
              <button className="px-4 py-1.5 text-sm font-medium bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-md shadow-sm">7 Days</button>
              <button className="px-4 py-1.5 text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">30 Days</button>
            </div>
          </div>
          
          <div className="flex-1 min-h-[250px] flex items-end gap-2 sm:gap-4 mt-4">
             {[40, 65, 45, 80, 55, 90, 75].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col justify-end group">
                   <div className="relative w-full rounded-t-xl bg-indigo-500/20 dark:bg-indigo-500/10 hover:bg-indigo-500/30 dark:hover:bg-indigo-500/20 transition-all duration-300" style={{ height: '100%' }}>
                      <div className="absolute bottom-0 w-full rounded-t-xl bg-gradient-to-t from-indigo-600 to-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all duration-500 ease-out group-hover:from-indigo-500 group-hover:to-indigo-300" style={{ height: `${height}%` }}></div>
                   </div>
                   <div className="text-center mt-3 text-xs font-medium text-slate-400">
                     {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                   </div>
                </div>
             ))}
          </div>
        </div>

        {/* Real-time Activity Feed */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 p-6 sm:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center">
               Live Activity
            </h2>
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4">
            {stats.recentEvents.map((evt, i) => (
              <div key={evt.id || i} className="flex gap-4 group">
                <div className="relative flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${evt.eventName === 'tool_download' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'}`}>
                    {evt.eventName === 'tool_download' ? <Download className="w-4 h-4" /> : <MousePointerClick className="w-4 h-4" />}
                  </div>
                  {i !== stats.recentEvents.length - 1 && (
                    <div className="w-px h-full bg-slate-200 dark:bg-slate-800 mt-2"></div>
                  )}
                </div>
                <div className="pb-4">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                    {evt.toolName || evt.toolSlug || 'Tool Usage'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" />
                    {evt.timeMs ? Math.round((Date.now() - evt.timeMs) / 1000) + 's ago' : 'Just now'} 
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    {evt.eventName === 'tool_download' ? 'Download complete' : 'Started tool'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      
      {/* AI Growth Insights */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 dark:from-slate-900 dark:to-slate-950 rounded-3xl shadow-lg border border-slate-800 p-8 relative overflow-hidden text-white">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transform translate-x-4 -translate-y-4">
          <Zap className="w-48 h-48 text-indigo-400" />
        </div>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-indigo-500/20 rounded-lg">
             <TrendingUp className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-xl font-bold">Growth Intelligence</h2>
        </div>
        <p className="text-slate-400 text-sm mb-8 max-w-xl">AI-driven insights analyzing your traffic patterns and user behavior to recommend high-impact improvements.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GrowthItem 
            priority="CRITICAL" 
            title="Image Compressor SEO" 
            reason="High impressions but low CTR on Google. Update meta title to include 'Free' and 'No Quality Loss'."
            impact="+15% Traffic"
          />
          <GrowthItem 
            priority="HIGH" 
            title="PDF Converter Drop-off" 
            reason="Mobile users are abandoning the conversion step. Consider optimizing the loading state UI."
            impact="+8% Conversions"
          />
          <GrowthItem 
            priority="MEDIUM" 
            title="New Content Opportunity" 
            reason="Searches for 'Video to GIF' are trending among your active users. Consider building this tool next."
            impact="New Revenue"
          />
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, change, isPositive, icon: Icon, trend }: any) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200/60 dark:border-slate-800/60 relative overflow-hidden group hover:border-indigo-500/30 dark:hover:border-indigo-400/30 transition-colors">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6" strokeWidth={2} />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${isPositive ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/50' : 'text-rose-700 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/50'}`}>
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {change}
        </div>
      </div>
      <div>
        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
        <div className="flex items-baseline gap-2 mt-2">
           <p className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</p>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-16 opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
           {trend === 'up' ? (
              <path d="M0,100 L20,80 L40,85 L60,40 L80,60 L100,0 L100,100 Z" fill="currentColor" />
           ) : (
              <path d="M0,0 L20,30 L40,20 L60,70 L80,50 L100,100 L0,100 Z" fill="currentColor" />
           )}
        </svg>
      </div>
    </div>
  )
}

function GrowthItem({ priority, title, reason, impact }: any) {
  const isCritical = priority === 'CRITICAL'
  const isHigh = priority === 'HIGH'
  
  const badgeClass = isCritical ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : isHigh ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'

  return (
    <div className="bg-slate-800/50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800 transition-colors group">
      <div className="flex items-center justify-between mb-4">
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md tracking-wider border ${badgeClass}`}>
          {priority}
        </span>
        <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
          <ArrowUpRight className="w-3 h-3" /> {impact}
        </span>
      </div>
      <h4 className="font-bold text-white text-lg mb-2 group-hover:text-indigo-300 transition-colors">{title}</h4>
      <p className="text-sm text-slate-400 leading-relaxed">{reason}</p>
    </div>
  )
}
