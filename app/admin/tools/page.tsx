'use client'

import { useEffect, useState } from 'react'
import { auth } from '@/lib/firebase'
import { Wrench, CheckCircle } from 'lucide-react'
import { tools as configTools } from '@/lib/toolConfigs'

export default function ToolManagement() {
  const [stats, setStats] = useState<Record<string, { uses: number, downloads: number, feedback: number }>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/admin/tools-data')
        const data = await res.json()
        if (data.success) {
          setStats(data.stats)
        }
      } catch (err) {
        console.error("Failed to fetch tool stats", err)
      } finally {
        setLoading(false)
      }
    }

    let unsubscribeAuth: any;
    if (auth) {
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        unsubscribeAuth = onAuthStateChanged(auth as any, (user) => {
          if (user) fetchStats();
        });
      });
    }
    return () => { if (unsubscribeAuth) unsubscribeAuth(); }
  }, [])

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
             Tool Management
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Overview of all dynamic SizeSnap tools and their usage.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0A0A0A] rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        {loading ? (
           <div className="flex items-center justify-center py-20"><div className="w-5 h-5 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin"></div></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-zinc-600 dark:text-zinc-400">
              <thead className="text-xs text-zinc-500 bg-zinc-50 dark:bg-zinc-900/50 sticky top-0 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">Tool Name</th>
                  <th scope="col" className="px-5 py-3 font-medium">Category</th>
                  <th scope="col" className="px-5 py-3 font-medium text-right">Uses</th>
                  <th scope="col" className="px-5 py-3 font-medium text-right">Downloads</th>
                  <th scope="col" className="px-5 py-3 font-medium text-right">Feedback</th>
                  <th scope="col" className="px-5 py-3 font-medium text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/50">
                {configTools.map((tool, idx) => {
                   // Try to match the slug in stats
                   const matchedEntry = Object.entries(stats).find(([k]) => k.includes(tool.slug));
                   const toolStat = stats[tool.slug] || (matchedEntry ? matchedEntry[1] : { uses: 0, downloads: 0, feedback: 0 });
                   
                   return (
                      <tr key={tool.slug || idx} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                        <td className="px-5 py-3">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                            <span>{tool.icon}</span> {tool.name}
                          </p>
                          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">/{tool.slug}</p>
                        </td>
                        <td className="px-5 py-3 capitalize">{tool.category}</td>
                        <td className="px-5 py-3 text-right font-medium">{toolStat.uses.toLocaleString()}</td>
                        <td className="px-5 py-3 text-right font-medium">{toolStat.downloads.toLocaleString()}</td>
                        <td className="px-5 py-3 text-right font-medium">{toolStat.feedback.toLocaleString()}</td>
                        <td className="px-5 py-3 text-right">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm text-[10px] font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800/50">
                             <CheckCircle className="w-3 h-3" /> Active
                          </span>
                        </td>
                      </tr>
                   )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
