'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { TrendingUp, Download, AlertTriangle, Search, FileText, Calendar } from 'lucide-react'

export default function SEOGrowthCenter() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('28days')

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
     if (!data || !data.connected || !data.opportunities) return;
     
     // Generate markdown content
     const date = new Date().toISOString().split('T')[0]
     let md = `You are modifying the existing SizeSnap production codebase.\n\nFirst inspect the current implementation.\nDo not rebuild existing systems.\nUse the following verified Search Console evidence.\n\n# WEEKLY SEO REPORT\nPeriod: ${timeRange}\nGenerated: ${date}\n\n## PERFORMANCE\nClicks: ${data.overview.clicks}\nImpressions: ${data.overview.impressions}\nCTR: ${data.overview.ctr}%\nAverage Position: ${data.overview.position}\n\n## HIGH PRIORITY OPPORTUNITIES\n`
     
     data.opportunities.forEach((opp: any) => {
        md += `\nPAGE: ${opp.page}\nQUERY: ${opp.query}\nIMPRESSIONS: ${opp.impressions}\nCLICKS: ${opp.clicks}\nCTR: ${opp.ctr}%\nPOSITION: ${opp.position}\nRECOMMENDATION: ${opp.recommendation}\n`
     })
     
     md += `\n## SAFETY RULES\n- Do not delete pages.\n- Do not create duplicate pages.\n- Do not change URLs unnecessarily.\n- Do not change canonical URLs without strong evidence.\n- Do not modify robots.txt automatically.\n- Do not invent facts.\n- Do not keyword stuff.\n- Prefer improving existing pages.\n- Preserve existing working tools.\n- Run build/tests before finalizing changes.\n`
     
     // Download file
     const blob = new Blob([md], { type: 'text/markdown' })
     const url = URL.createObjectURL(blob)
     const a = document.createElement('a')
     a.href = url
     a.download = `sizesnap-weekly-seo-${date}.md`
     document.body.appendChild(a)
     a.click()
     document.body.removeChild(a)
     URL.revokeObjectURL(url)
  }

  if (loading) {
     return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div></div>
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
             SEO Growth Center
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real Google Search Console data and actionable opportunities.
          </p>
        </div>
        {data?.connected && (
           <div className="flex bg-zinc-100 dark:bg-zinc-900/50 p-1 rounded-md border border-zinc-200 dark:border-zinc-800">
              {(['7days', '28days', '3months'] as const).map(tr => (
                 <button 
                   key={tr}
                   onClick={() => setTimeRange(tr)}
                   className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-colors ${timeRange === tr ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 shadow-sm border border-zinc-200 dark:border-zinc-700' : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
                 >
                   {tr === '7days' ? '7 Days' : tr === '28days' ? '28 Days' : '3 Months'}
                 </button>
              ))}
           </div>
        )}
      </div>

      {!data?.connected ? (
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
            <MetricCard title="Total Clicks" value={data.overview?.clicks || 0} />
            <MetricCard title="Total Impressions" value={data.overview?.impressions || 0} />
            <MetricCard title="Average CTR" value={`${data.overview?.ctr || 0}%`} />
            <MetricCard title="Average Position" value={data.overview?.position || 0} />
          </div>

          <div className="flex items-center justify-between mt-8 mb-4">
             <h2 className="text-lg font-semibold">Weekly SEO Report</h2>
             <button 
               onClick={generateAntigravityTask}
               className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
             >
               <Download className="w-4 h-4" /> Download Antigravity Task
             </button>
          </div>

          {/* Actionable Opportunities */}
          <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden mb-6">
             <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                   <AlertTriangle className="w-4 h-4 text-amber-500" /> Actionable Opportunities
                </h3>
             </div>
             <div className="p-0 text-sm text-zinc-600 dark:text-zinc-400">
                {data.opportunities?.length > 0 ? (
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
                        {data.opportunities.map((opp: any, idx: number) => (
                          <tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30">
                            <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100">{opp.query}</td>
                            <td className="px-5 py-3 text-right">{opp.impressions}</td>
                            <td className="px-5 py-3 text-right">{opp.clicks}</td>
                            <td className="px-5 py-3 text-right">{opp.position}</td>
                            <td className="px-5 py-3 text-zinc-500">{opp.recommendation}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-5">No opportunities found for the selected period.</div>
                )}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                         <td className="px-5 py-3 font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[200px]" title={row.page}>{row.page.replace('https://sizesnap.in', '') || '/'}</td>
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

function MetricCard({ title, value }: { title: string, value: any }) {
  return (
    <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0A0A0A] flex flex-col">
      <h3 className="text-zinc-500 dark:text-zinc-400 text-xs font-medium tracking-wide uppercase">{title}</h3>
      <p className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 mt-2">{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
  )
}
