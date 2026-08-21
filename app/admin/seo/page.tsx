'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { TrendingUp, Download, AlertTriangle } from 'lucide-react'

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
     let md = `You are modifying the existing SizeSnap production codebase.

First inspect the current implementation.
Do not rebuild existing systems.
Use the following verified Search Console evidence.

# WEEKLY SEO REPORT
Period: ${timeRange}
Generated: ${date}

## PERFORMANCE
Clicks: ${data.overview.clicks}
Impressions: ${data.overview.impressions}
CTR: ${data.overview.ctr}%
Average Position: ${data.overview.position}

## HIGH PRIORITY OPPORTUNITIES
`
     
     data.opportunities.forEach((opp: any) => {
        md += `
PAGE: ${opp.page}
QUERY: ${opp.query}
IMPRESSIONS: ${opp.impressions}
CLICKS: ${opp.clicks}
CTR: ${opp.ctr}%
POSITION: ${opp.position}
RECOMMENDATION: ${opp.recommendation}
`
     })
     
     md += `
## SAFETY RULES
- Do not delete pages.
- Do not create duplicate pages.
- Do not change URLs unnecessarily.
- Do not change canonical URLs without strong evidence.
- Do not modify robots.txt automatically.
- Do not invent facts.
- Do not keyword stuff.
- Prefer improving existing pages.
- Preserve existing working tools.
- Run build/tests before finalizing changes.
`
     
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
            Connect your Google Search Console account via OAuth or Service Account to view real organic search metrics and discover actionable SEO opportunities.
          </p>
          <button className="px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-medium rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-sm">
            Connect Google Search Console
          </button>
          <p className="mt-4 text-[10px] text-zinc-400 max-w-sm">Requires read-only permissions (https://www.googleapis.com/auth/webmasters.readonly). Credentials must be configured securely in your environment variables.</p>
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

          {/* Opportunities Section Placeholder */}
          <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
             <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                   <AlertTriangle className="w-4 h-4 text-amber-500" /> Actionable Opportunities
                </h3>
             </div>
             <div className="p-5 text-sm text-zinc-600 dark:text-zinc-400">
                <p>Opportunities will appear here once GSC data is fully synced and processed.</p>
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
