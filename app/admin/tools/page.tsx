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
      setLoading(false);
    }
    load();
  }, [activeRange]);

  return (
    <section className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">🔧 Tool Usage</h1>
      <FilterTabs active={activeRange} setActive={setActiveRange} />
      {loading ? (
        <p className="text-gray-600">Loading tool stats…</p>
      ) : (
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Tool</th>
              <th className="p-2">Uses (selected period)</th>
            </tr>
          </thead>
          <tbody>
            {stats.map((s) => (
              <tr key={s.slug} className="border-b">
                <td className="p-2">{s.name}</td>
                <td className="p-2">{s.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
