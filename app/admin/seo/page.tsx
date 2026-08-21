'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { Download, AlertTriangle, TrendingUp, Search, FileText, ArrowUp, ArrowDown, Bot, CheckCircle } from 'lucide-react'

export default function SEOManagement() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('28days')
  const [showAllOpps, setShowAllOpps] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/admin/seo?timeRange=${timeRange}`)
        const json = await res.json()
        setData(json)
      } catch (err) {
        console.error("Failed to fetch SEO data", err)
      } finally {
        setLoading(false)
      }
    }

    let unsubscribeAuth: any;
    if (auth) {
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        unsubscribeAuth = onAuthStateChanged(auth, (user) => {
          if (user) fetchData();
        });
      });
    }
    return () => { if (unsubscribeAuth) unsubscribeAuth(); }
  }, [timeRange])

  const generateAntigravityTask = () => {
    if (!data?.actionPlan || data.actionPlan.length === 0) {
      alert("No action plan available.");
      return;
    }
    let prompt = "Please help me implement the following SEO recommendations:\n\n";
    data.actionPlan.forEach((opp: any, idx: number) => {
      prompt += `${idx + 1}. [${opp.priority}] Query: "${opp.query}" -> ${opp.action}\n`
    });
    const blob = new Blob([prompt], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SEO-Action-Plan-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
             SEO Growth Center
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time organic search intelligence and automated action plans.
          </p>
        </div>
        
        {data?.connected && (
          <div className="flex bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-lg border border-zinc-200 dark:border-zinc-800">
             {['7days', '28days', '3months'].map(tr => (
                <button 
                  key={tr}
                  onClick={() => setTimeRange(tr)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeRange === tr ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm' : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'}`}
                >
                  {tr === '7days' ? '7 Days' : tr === '28days' ? '28 Days' : '3 Months'}
                </button>
             ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div>
          <p className="text-sm text-zinc-500 mt-4">Analyzing Search Console Data...</p>
        </div>
      ) : !data?.connected ? (
        <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg p-10 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-6">
             <TrendingUp className="w-8 h-8 text-blue-500" />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">GSC Not Connected</h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto mb-8">
            Connect your Google Search Console account via OAuth to view real organic search metrics and discover actionable SEO opportunities.
          </p>
          <button 
            onClick={() => window.location.href = '/api/admin/oauth/start'}
            className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-sm"
          >
            Connect Google Search Console
          </button>
          {data?.error && <p className="mt-4 text-xs text-red-500">{data.error}</p>}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Total Clicks" value={data.overview?.current?.clicks || 0} change={data.overview?.changes?.clicks} higherIsBetter={true} />
            <MetricCard title="Total Impressions" value={data.overview?.current?.impressions || 0} change={data.overview?.changes?.impressions} higherIsBetter={true} />
            <MetricCard title="Average CTR" value={`${data.overview?.current?.ctr || 0}%`} change={data.overview?.changes?.ctr} higherIsBetter={true} />
            <MetricCard title="Average Position" value={data.overview?.current?.position || 0} change={data.overview?.changes?.position * -1} rawChange={data.overview?.changes?.position} higherIsBetter={true} />
          </div>

          <div className="flex items-center justify-between mt-8 mb-4">
             <h2 className="text-lg font-semibold flex items-center gap-2"><Bot className="w-5 h-5 text-indigo-500"/> This Week's SEO Action Plan</h2>
             <button 
               onClick={generateAntigravityTask}
               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
             >
               <Download className="w-4 h-4" /> Download Antigravity Task
             </button>
          </div>

          {/* Action Plan Cards */}
          <div className="grid grid-cols-1 gap-4">
             {data.actionPlan?.length > 0 ? (
                data.actionPlan.map((opp: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 flex flex-col md:flex-row gap-6">
                     <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${opp.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : opp.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                             {opp.priority} PRIORITY
                           </span>
                           <span className="text-xs text-zinc-500 font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{opp.type.replace(/_/g, ' ')}</span>
                        </div>
                        <div>
                           <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Query: "{opp.query}"</h3>
                           <p className="text-sm text-zinc-500">Page: {opp.page}</p>
                        </div>
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 border border-zinc-100 dark:border-zinc-800/50">
                           <span className="font-semibold block mb-1">Why this matters:</span>
                           {opp.reason}
                        </div>
                     </div>
                     <div className="w-full md:w-1/3 flex flex-col justify-between">
                        <div className="grid grid-cols-2 gap-4 mb-4">
                           <div>
                              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Impressions</p>
                              <p className="font-semibold">{opp.impressions}</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Clicks</p>
                              <p className="font-semibold">{opp.clicks}</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">CTR</p>
                              <p className="font-semibold">{opp.ctr}%</p>
                           </div>
                           <div>
                              <p className="text-[10px] text-zinc-500 uppercase tracking-wider">Position</p>
                              <p className="font-semibold">{opp.position}</p>
                           </div>
                        </div>
                        <div>
                           <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Recommended Action</p>
                           <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-start gap-1">
                             <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" /> {opp.action}
                           </p>
                        </div>
                     </div>
                  </div>
                ))
             ) : (
                <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg p-10 text-center text-zinc-500">
                  <CheckCircle className="w-10 h-10 mx-auto text-green-500 mb-4" />
                  <p>Your SEO is highly optimized. No critical action plan items for this period.</p>
                </div>
             )}
          </div>

          {/* Actionable Opportunities */}
          {data.opportunities?.length > 0 && (
             <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden mb-6">
                <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex justify-between items-center">
                   <h3 className="text-sm font-semibold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> More Opportunities
                   </h3>
                   {data.opportunities.length > 5 && (
                      <button onClick={() => setShowAllOpps(!showAllOpps)} className="text-xs text-blue-600 font-medium">
                         {showAllOpps ? 'Show Less' : `View all (${data.opportunities.length})`}
                      </button>
                   )}
                </div>
                <div className="p-0 text-sm text-zinc-600 dark:text-zinc-400">
                   <div className="overflow-x-auto">
                     <table className="w-full text-left">
                       <thead className="bg-zinc-50 dark:bg-zinc-900/20 text-xs uppercase font-medium">
                         <tr>
                           <th className="px-5 py-3">Query</th>
                           <th className="px-5 py-3 text-right">Imp.</th>
                           <th className="px-5 py-3 text-right">Clicks</th>
                           <th className="px-5 py-3 text-right">Pos.</th>
                           <th className="px-5 py-3">Recommendation</th>
                         </tr>
                       </thead>
                       <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                         {(showAllOpps ? data.opportunities : data.opportunities.slice(0, 5)).map((opp: any, idx: number) => (
                           <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30">
                             <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">{opp.query}</td>
                             <td className="px-5 py-3 text-right">{opp.impressions}</td>
                             <td className="px-5 py-3 text-right">{opp.clicks}</td>
                             <td className="px-5 py-3 text-right">{opp.position}</td>
                             <td className="px-5 py-3 text-zinc-500">{opp.action}</td>
                           </tr>
                         ))}
                       </tbody>
                     </table>
                   </div>
                </div>
             </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Top Queries */}
            <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
               <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                     <Search className="w-4 h-4 text-blue-500" /> Top Queries
                  </h3>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-zinc-50 dark:bg-zinc-900/20 text-xs uppercase font-medium">
                     <tr>
                       <th className="px-5 py-3">Query</th>
                       <th className="px-5 py-3 text-right">Clicks</th>
                       <th className="px-5 py-3 text-right">Imp.</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                     {data.topQueries?.slice(0, 10).map((row: any, idx: number) => (
                       <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30">
                         <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">{row.query}</td>
                         <td className="px-5 py-3 text-right">{row.clicks}</td>
                         <td className="px-5 py-3 text-right">{row.impressions}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>

            {/* Top Pages */}
            <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
               <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                  <h3 className="text-sm font-semibold flex items-center gap-2">
                     <FileText className="w-4 h-4 text-green-500" /> Top Pages
                  </h3>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-zinc-50 dark:bg-zinc-900/20 text-xs uppercase font-medium">
                     <tr>
                       <th className="px-5 py-3">Page</th>
                       <th className="px-5 py-3 text-right">Clicks</th>
                       <th className="px-5 py-3 text-right">Imp.</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                     {data.topPages?.slice(0, 10).map((row: any, idx: number) => (
                       <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30">
                         <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]" title={row.page}>{row.page}</td>
                         <td className="px-5 py-3 text-right">{row.clicks}</td>
                         <td className="px-5 py-3 text-right">{row.impressions}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MetricCard({ title, value, change, rawChange, higherIsBetter }: { title: string, value: any, change?: any, rawChange?: any, higherIsBetter?: boolean }) {
  const isPositive = parseFloat(change) > 0;
  const isNegative = parseFloat(change) < 0;
  
  // For average position, lower raw number is better, but the logic above passed change = prev - curr, so it's aligned.
  // We'll just display rawChange or change directly.
  let changeStr = change ? (parseFloat(change) > 0 ? `+${change}%` : `${change}%`) : null;
  if (rawChange) {
      changeStr = parseFloat(rawChange) > 0 ? `+${rawChange}` : `${rawChange}`;
  }

  const isGood = isPositive;
  const isBad = isNegative;

  return (
    <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0A0A0A] flex flex-col justify-between">
      <h3 className="text-zinc-500 dark:text-zinc-400 text-xs font-medium tracking-wide uppercase">{title}</h3>
      <div className="mt-2 flex items-baseline gap-2">
         <p className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">{typeof value === 'number' ? value.toLocaleString() : value}</p>
         {changeStr && parseFloat(change) !== 0 && (
            <span className={`flex items-center text-xs font-medium ${isGood ? 'text-green-500' : 'text-red-500'}`}>
               {isGood ? <ArrowUp className="w-3 h-3 mr-0.5" /> : <ArrowDown className="w-3 h-3 mr-0.5" />}
               {changeStr.replace('-', '')}
            </span>
         )}
      </div>
    </div>
  )
}
