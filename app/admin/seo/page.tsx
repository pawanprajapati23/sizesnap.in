'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { Download, AlertTriangle, TrendingUp, Search, FileText, ArrowUp, ArrowDown, Bot, CheckCircle, MessageSquare, Activity, Target } from 'lucide-react'

export default function SEOManagement() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('28days')
  const [showAllOpps, setShowAllOpps] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchData()
  }, [timeRange])

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

  const generateAntigravityTask = () => {
    if (!data?.actionPlan || data.actionPlan.length === 0) {
      alert("No action plan available.");
      return;
    }
    
    const date = new Date().toISOString().split('T')[0]
    const { current, changes } = data.overview;
    
    const formatChange = (val: any) => {
       const num = parseFloat(val);
       if (isNaN(num) || num === 0) return '(No change)';
       return num > 0 ? `(+${val}%)` : `(${val}%)`;
    };
    
    let md = `# SizeSnap SEO Growth Task\n\n`;
    md += `**Project:** SizeSnap\n`;
    md += `**Period:** ${timeRange === '7days' ? '7 Days' : timeRange === '28days' ? '28 Days' : '3 Months'}\n`;
    md += `**Generated:** ${date}\n\n`;
    
    md += `## 1. Overall Performance Summary\n`;
    md += `- **Total Clicks:** ${current.clicks.toLocaleString()} ${formatChange(changes.clicks)}\n`;
    md += `- **Total Impressions:** ${current.impressions.toLocaleString()} ${formatChange(changes.impressions)}\n`;
    md += `- **Average CTR:** ${current.ctr}% ${formatChange(changes.ctr)}\n`;
    md += `- **Average Position:** ${current.position} (Change: ${parseFloat(changes.position) > 0 ? '+' : ''}${changes.position})\n\n`;
    
    md += `## 2. Priority SEO Opportunities\n\n`;
    
    data.actionPlan.forEach((opp: any, idx: number) => {
       md += `### ${idx + 1}. [${opp.priority} PRIORITY] Target: ${opp.page}\n`;
       md += `- **Query:** "${opp.query}"\n`;
       md += `- **Type:** ${opp.type.replace(/_/g, ' ')}\n`;
       md += `- **Evidence:** ${opp.impressions} impressions | ${opp.clicks} clicks | CTR: ${opp.ctr}% | Pos: ${opp.position}\n`;
       
       if (opp.uses > 0 || opp.feedback > 0) {
          md += `- **User Signals:** `;
          if (opp.uses > 0) md += `${opp.uses} recorded tool uses. `;
          if (opp.feedback > 0) md += `${opp.feedback} related user feedback requests. `;
          md += `\n`;
       }
       
       md += `- **Why it matters:** ${opp.reason.split(' Tool usage:')[0]}\n`;
       md += `- **Recommended Action:** ${opp.action}\n\n`;
    });
    
    md += `## 3. Strict Antigravity Instructions & Safety Rules\n`;
    md += `Please implement the above recommendations strictly adhering to the following rules:\n`;
    md += `1. **Inspect First**: Always read the existing codebase and relevant components before making changes.\n`;
    md += `2. **No Duplication**: Do not create duplicate pages. Prefer improving existing pages (e.g., adding deeper content, optimizing H1/titles).\n`;
    md += `3. **No Deletion**: Do not delete existing URLs or break existing routing.\n`;
    md += `4. **Internal Linking**: If adding internal links, use only real, existing routes on the site. Do not invent URLs.\n`;
    md += `5. **No Fake Data**: Do not invent facts, fake statistics, search volumes, or fake user reviews.\n`;
    md += `6. **No Keyword Stuffing**: Keep all content natural, helpful, and user-centric.\n`;
    md += `7. **Protect Existing Features**: Do not break the Google OAuth system, Firebase analytics, feedback systems, or existing tool functionalities.\n`;
    md += `8. **No Unapproved Deployments**: Do not automatically deploy to production. Prepare recommendations for review.\n\n`;
    
    md += `## 4. Final Verification Checklist\n`;
    md += `- [ ] Code changes implemented according to recommendations.\n`;
    md += `- [ ] \`npm run lint\` passes with no new errors.\n`;
    md += `- [ ] \`npm run build\` successfully compiles the optimized production build.\n`;
    md += `- [ ] Affected pages tested locally (no crashes/UI breaks).\n`;
    md += `- [ ] Git diff reviewed to ensure no unintended breakages.\n`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SizeSnap-SEO-Task-${date}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  const updateActionStatus = async (opp: any, newStatus: string) => {
     try {
        await fetch('/api/admin/seo-action', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ id: opp.id, status: newStatus, actionData: opp })
        })
        fetchData() // Refresh to get updated stats
     } catch(e) {
        alert("Failed to update status")
     }
  }

  const updateFeedbackStatus = async (id: string, newStatus: string) => {
     try {
        await fetch('/api/admin/feedback-status', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ id, status: newStatus })
        })
        fetchData()
     } catch(e) {
        alert("Failed to update feedback")
     }
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
             SEO Growth Engine V2
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time organic search intelligence combined with actual product usage.
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

      {/* Tabs */}
      {data?.connected && (
         <div className="flex border-b border-zinc-200 dark:border-zinc-800">
            {['overview', 'tracker', 'feedback'].map(tab => (
               <button 
                 key={tab} onClick={() => setActiveTab(tab)}
                 className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab ? 'border-zinc-900 dark:border-white text-zinc-900 dark:text-white' : 'border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300'}`}
               >
                 {tab === 'overview' ? 'Growth Dashboard' : tab === 'tracker' ? 'Action Tracker' : 'User Requests'}
               </button>
            ))}
         </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div>
          <p className="text-sm text-zinc-500 mt-4">Analyzing GSC, Tool Usage, and Feedback...</p>
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
        <>
        {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard title="Total Clicks" value={data.overview?.current?.clicks || 0} change={data.overview?.changes?.clicks} higherIsBetter={true} />
            <MetricCard title="Total Impressions" value={data.overview?.current?.impressions || 0} change={data.overview?.changes?.impressions} higherIsBetter={true} />
            <MetricCard title="Average CTR" value={`${data.overview?.current?.ctr || 0}%`} change={data.overview?.changes?.ctr} higherIsBetter={true} />
            <MetricCard title="Average Position" value={data.overview?.current?.position || 0} change={data.overview?.changes?.position * -1} rawChange={data.overview?.changes?.position} higherIsBetter={true} />
          </div>

          <div className="flex items-center justify-between mt-8 mb-4">
             <h2 className="text-lg font-semibold flex items-center gap-2"><Bot className="w-5 h-5 text-indigo-500"/> 🔥 Top Actions This Week</h2>
             <button 
               onClick={generateAntigravityTask}
               className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
             >
               <Download className="w-4 h-4" /> Generate Antigravity Task
             </button>
          </div>

          {/* Action Plan Cards */}
          <div className="grid grid-cols-1 gap-4">
             {data.actionPlan?.length > 0 ? (
                data.actionPlan.map((opp: any, idx: number) => (
                  <div key={idx} className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 flex flex-col md:flex-row gap-6 relative overflow-hidden">
                     {opp.status === 'Done' && <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">COMPLETED</div>}
                     <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2">
                           <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${opp.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : opp.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                             {opp.priority} PRIORITY
                           </span>
                           <span className="text-xs text-zinc-500 font-medium bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">{opp.type.replace(/_/g, ' ')}</span>
                           <select 
                              value={opp.status} 
                              onChange={(e) => updateActionStatus(opp, e.target.value)}
                              className="ml-auto text-xs bg-zinc-100 dark:bg-zinc-800 border-none rounded px-2 py-1 outline-none"
                           >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Done">Done</option>
                              <option value="Ignored">Ignored</option>
                           </select>
                        </div>
                        <div>
                           <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">Improve: {opp.page}</h3>
                           <p className="text-sm text-zinc-500">Query: "{opp.query}"</p>
                        </div>
                        <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-lg text-sm text-zinc-700 dark:text-zinc-300 border border-zinc-100 dark:border-zinc-800/50">
                           <span className="font-semibold block mb-1">Why this matters:</span>
                           {opp.reason}
                        </div>
                     </div>
                     <div className="w-full md:w-1/3 flex flex-col justify-between">
                        {opp.status === 'Done' && opp.beforeStats && opp.afterStats ? (
                           <div className="mb-4 bg-green-50/50 dark:bg-green-900/10 p-3 rounded-lg border border-green-100 dark:border-green-900/30">
                              <p className="text-[10px] text-green-600 dark:text-green-400 uppercase tracking-wider mb-2 font-semibold">Results (Before vs After)</p>
                              <div className="grid grid-cols-2 gap-2 text-xs">
                                 <div>Imp: {opp.beforeStats.impressions} → <span className="font-bold">{opp.afterStats.impressions}</span></div>
                                 <div>Clk: {opp.beforeStats.clicks} → <span className="font-bold">{opp.afterStats.clicks}</span></div>
                                 <div>Pos: {opp.beforeStats.position} → <span className="font-bold">{opp.afterStats.position}</span></div>
                                 <div>CTR: {opp.beforeStats.ctr}% → <span className="font-bold">{opp.afterStats.ctr}%</span></div>
                              </div>
                           </div>
                        ) : (
                           <div className="grid grid-cols-2 gap-4 mb-4">
                              <div><p className="text-[10px] text-zinc-500 uppercase tracking-wider">Impressions</p><p className="font-semibold">{opp.impressions}</p></div>
                              <div><p className="text-[10px] text-zinc-500 uppercase tracking-wider">Clicks</p><p className="font-semibold">{opp.clicks}</p></div>
                              <div><p className="text-[10px] text-zinc-500 uppercase tracking-wider">CTR</p><p className="font-semibold">{opp.ctr}%</p></div>
                              <div><p className="text-[10px] text-zinc-500 uppercase tracking-wider">Position</p><p className="font-semibold">{opp.position}</p></div>
                           </div>
                        )}
                        <div>
                           <p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1">Recommended Action</p>
                           <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 flex items-start gap-1">
                             <Target className="w-4 h-4 mt-0.5 shrink-0" /> {opp.action}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
               <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"><h3 className="text-sm font-semibold flex items-center gap-2"><Search className="w-4 h-4 text-blue-500" /> Top Queries</h3></div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-zinc-50 dark:bg-zinc-900/20 text-xs uppercase font-medium"><tr><th className="px-5 py-3">Query</th><th className="px-5 py-3 text-right">Clicks</th><th className="px-5 py-3 text-right">Imp.</th></tr></thead>
                   <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                     {data.topQueries?.slice(0, 10).map((row: any, idx: number) => (<tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30"><td className="px-5 py-3 font-medium">{row.query}</td><td className="px-5 py-3 text-right">{row.clicks}</td><td className="px-5 py-3 text-right">{row.impressions}</td></tr>))}
                   </tbody>
                 </table>
               </div>
            </div>
            <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
               <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"><h3 className="text-sm font-semibold flex items-center gap-2"><FileText className="w-4 h-4 text-green-500" /> Top Pages</h3></div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                   <thead className="bg-zinc-50 dark:bg-zinc-900/20 text-xs uppercase font-medium"><tr><th className="px-5 py-3">Page</th><th className="px-5 py-3 text-right">Clicks</th><th className="px-5 py-3 text-right">Imp.</th></tr></thead>
                   <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                     {data.topPages?.slice(0, 10).map((row: any, idx: number) => (<tr key={idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30"><td className="px-5 py-3 font-medium truncate max-w-[200px]" title={row.page}>{row.page}</td><td className="px-5 py-3 text-right">{row.clicks}</td><td className="px-5 py-3 text-right">{row.impressions}</td></tr>))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
        </div>
        )}

        {activeTab === 'tracker' && (
           <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"><h3 className="text-sm font-semibold flex items-center gap-2"><Activity className="w-4 h-4 text-blue-500" /> SEO Action History</h3></div>
              <div className="p-0 text-sm">
                  {data.actionTracker?.length > 0 ? (
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-zinc-50 dark:bg-zinc-900/20 text-xs uppercase font-medium">
                            <tr><th className="px-5 py-3">Date</th><th className="px-5 py-3">Query</th><th className="px-5 py-3">Action</th><th className="px-5 py-3">Status</th></tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {data.actionTracker.map((act: any) => (
                              <tr key={act.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30">
                                <td className="px-5 py-3 text-zinc-500 whitespace-nowrap">{new Date(act.createdAt).toLocaleDateString()}</td>
                                <td className="px-5 py-3 font-medium">{act.query}</td>
                                <td className="px-5 py-3 text-zinc-500 max-w-sm truncate" title={act.action}>{act.action}</td>
                                <td className="px-5 py-3">
                                   <select value={act.status} onChange={(e) => updateActionStatus(act, e.target.value)} className="text-xs bg-transparent border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1">
                                      <option value="Pending">Pending</option>
                                      <option value="In Progress">In Progress</option>
                                      <option value="Done">Done</option>
                                      <option value="Ignored">Ignored</option>
                                   </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                     </div>
                  ) : (<div className="p-10 text-center text-zinc-500">No actions tracked yet. Mark an action as "In Progress" to track it here.</div>)}
              </div>
           </div>
        )}

        {activeTab === 'feedback' && (
           <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50"><h3 className="text-sm font-semibold flex items-center gap-2"><MessageSquare className="w-4 h-4 text-purple-500" /> User Requests & Feedback Signals</h3></div>
              <div className="p-0 text-sm">
                  {data.feedbackList?.length > 0 ? (
                     <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead className="bg-zinc-50 dark:bg-zinc-900/20 text-xs uppercase font-medium">
                            <tr><th className="px-5 py-3">Date</th><th className="px-5 py-3">Tool</th><th className="px-5 py-3">Feedback</th><th className="px-5 py-3">Status</th></tr>
                          </thead>
                          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                            {data.feedbackList.map((fb: any) => (
                              <tr key={fb.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30">
                                <td className="px-5 py-3 text-zinc-500 whitespace-nowrap">{new Date(fb.timestamp).toLocaleDateString()}</td>
                                <td className="px-5 py-3 font-medium">{fb.toolSlug || 'Unknown'}</td>
                                <td className="px-5 py-3 text-zinc-600 dark:text-zinc-300 max-w-md">{fb.message}</td>
                                <td className="px-5 py-3">
                                   <select value={fb.status || 'Reviewed'} onChange={(e) => updateFeedbackStatus(fb.id, e.target.value)} className="text-xs bg-transparent border border-zinc-200 dark:border-zinc-700 rounded px-2 py-1">
                                      <option value="Reviewed">Reviewed</option>
                                      <option value="Planned">Planned</option>
                                      <option value="Implemented">Implemented</option>
                                      <option value="Rejected">Rejected</option>
                                   </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                     </div>
                  ) : (<div className="p-10 text-center text-zinc-500">No user feedback in this period.</div>)}
              </div>
           </div>
        )}
        </>
      )}
    </div>
  )
}

function MetricCard({ title, value, change, rawChange, higherIsBetter }: { title: string, value: any, change?: any, rawChange?: any, higherIsBetter?: boolean }) {
  const isPositive = parseFloat(change) > 0;
  const isNegative = parseFloat(change) < 0;
  let changeStr = change ? (parseFloat(change) > 0 ? `+${change}%` : `${change}%`) : null;
  if (rawChange) changeStr = parseFloat(rawChange) > 0 ? `+${rawChange}` : `${rawChange}`;
  const isGood = isPositive;
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
