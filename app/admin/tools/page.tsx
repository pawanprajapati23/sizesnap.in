// app/admin/tools/page.tsx
'use client';
import { useEffect, useState } from 'react';
import FilterTabs, { TimeRange } from '@/app/admin/components/FilterTabs';
import { fetchUsage, aggregateWithin } from '@/lib/firebase';
import { ALL_TOOLS } from '@/data/tools';

type ToolStat = {
  slug: string;
  name: string;
  count: number;
};

const rangeToMs = (range: TimeRange) => {
  switch (range) {
    case '24h': return 24 * 60 * 60 * 1000;
    case '7d':  return 7 * 24 * 60 * 60 * 1000;
    case '30d': return 30 * 24 * 60 * 60 * 1000;
    case '3m':  return 90 * 24 * 60 * 60 * 1000;
  }
};

export default function ToolsUsage() {
  const [activeRange, setActiveRange] = useState<TimeRange>('24h');
  const [stats, setStats] = useState<ToolStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const allRecords = await fetchUsage('toolUsage');
        const ms = rangeToMs(activeRange);
        const newStats: ToolStat[] = ALL_TOOLS.map((t) => {
          const records = (allRecords[t.slug] ?? {}) as unknown as Record<string, number>;
          return {
            slug: t.slug,
            name: t.name ?? t.slug,
            count: aggregateWithin(records, ms),
          };
        }).sort((a, b) => b.count - a.count);
        setStats(newStats);
      } catch (err) {
        console.error("Failed to fetch from Firebase:", err);
        // Fallback to show all tools with 0 count
        const fallbackStats = ALL_TOOLS.map(t => ({ slug: t.slug, name: t.name ?? t.slug, count: 0 }));
        setStats(fallbackStats);
      }
      setLoading(false);
    }
    load();
  }, [activeRange]);

  return (
    <section className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">🔧 Tools Management</h1>
        <FilterTabs active={activeRange} setActive={setActiveRange} />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500 font-medium">
            <svg className="animate-spin h-8 w-8 text-[#414FA8] mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading tool statistics...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#EEF1FB] border-b border-gray-200">
                <tr>
                  <th className="p-4 text-sm font-bold text-[#414FA8] uppercase tracking-wider">Tool Name</th>
                  <th className="p-4 text-sm font-bold text-[#414FA8] uppercase tracking-wider text-right">Uses (Selected Period)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stats.map((s) => (
                  <tr key={s.slug} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-sm font-medium text-gray-900">{s.name}</td>
                    <td className="p-4 text-sm text-gray-600 font-semibold text-right">{s.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
