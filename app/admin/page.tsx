'use client';
import { useEffect, useState } from 'react';
import FilterTabs, { TimeRange } from '@/app/admin/components/FilterTabs';
import StatCard from '@/app/admin/components/StatCard';
import { fetchUsage, aggregateWithin } from '@/lib/firebase';
import { ALL_TOOLS } from '@/data/tools';

const rangeToMs = (range: TimeRange) => {
  switch (range) {
    case '24h':
      return 24 * 60 * 60 * 1000;
    case '7d':
      return 7 * 24 * 60 * 60 * 1000;
    case '30d':
      return 30 * 24 * 60 * 60 * 1000;
    case '3m':
      return 90 * 24 * 60 * 60 * 1000;
  }
};

export default function AdminDashboard() {
  const [activeRange, setActiveRange] = useState<TimeRange>('24h');
  const [totalDownloads, setTotalDownloads] = useState(0);
  const [totalToolUses, setTotalToolUses] = useState(0);
  const [totalErrors, setTotalErrors] = useState(0);
  const [topTools, setTopTools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Tools count from local config
  const totalAvailableTools = ALL_TOOLS.length;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const dlRecords = await fetchUsage('downloads');
        const toolRecords = await fetchUsage('toolUsage');
        const errRecords = await fetchUsage('toolErrors');

        const ms = rangeToMs(activeRange);

        const downloads = aggregateWithin(dlRecords, ms);
        setTotalDownloads(downloads);

        let totalUses = 0;
        let tErrors = 0;

        const toolsData = ALL_TOOLS.map(t => {
          const rec = (toolRecords[t.slug] ?? {}) as unknown as Record<string, number>;
          const errs = (errRecords[t.slug] ?? {}) as unknown as Record<string, number>;

          const uses = aggregateWithin(rec, ms);
          const errors = aggregateWithin(errs, ms);

          totalUses += uses;
          tErrors += errors;

          return {
            ...t,
            uses,
            errors,
            // Assuming generic download distribution for demo in Top Tools if not tracked per-tool,
            // but requirements say "Download Rate" for tools. Since tracking only has global 'downloads',
            // we skip per-tool downloads unless explicitly needed or simulate 0.
            downloads: 0
          };
        });

        setTotalToolUses(totalUses);
        setTotalErrors(tErrors);

        // Sort top 10
        const sorted = toolsData.sort((a, b) => b.uses - a.uses).slice(0, 10);
        setTopTools(sorted);

      } catch (err) {
        console.error("Failed to fetch from Firebase:", err);
        setTotalDownloads(0);
        setTotalToolUses(0);
        setTotalErrors(0);
      }
      setLoading(false);
    }
    load();
  }, [activeRange]);

  const errorRate = totalToolUses > 0 ? ((totalErrors / totalToolUses) * 100).toFixed(2) + '%' : 'N/A';
  const downloadRate = totalToolUses > 0 ? ((totalDownloads / totalToolUses) * 100).toFixed(2) + '%' : 'N/A';

  return (
    <section className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📊 Admin Dashboard</h1>
        <FilterTabs active={activeRange} setActive={setActiveRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <StatCard title="Active Tools" value={totalAvailableTools} />
        <StatCard title="Tool Uses" value={loading ? '...' : totalToolUses} />
        <StatCard title="Downloads" value={loading ? '...' : totalDownloads} />
        <StatCard title="Download Rate" value={loading ? '...' : downloadRate} />
        <StatCard title="Tool Errors" value={loading ? '...' : totalErrors} />
        <StatCard title="Error Rate" value={loading ? '...' : errorRate} />
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Top Performing Tools</h2>

        {loading ? (
          <div className="text-center p-8 text-gray-500">Loading metrics...</div>
        ) : topTools.length === 0 || topTools[0].uses === 0 ? (
          <div className="text-center p-8 text-gray-500 bg-gray-50 rounded border border-gray-100">
            Not enough data for the selected period.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-[#EEF1FB] border-b border-gray-200">
                <tr>
                  <th className="p-4 text-xs font-bold text-[#414FA8] uppercase">Tool</th>
                  <th className="p-4 text-xs font-bold text-[#414FA8] uppercase">Category</th>
                  <th className="p-4 text-xs font-bold text-[#414FA8] uppercase text-right">Uses</th>
                  <th className="p-4 text-xs font-bold text-[#414FA8] uppercase text-right">Errors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topTools.map(t => (
                  <tr key={t.slug} className="hover:bg-gray-50">
                    <td className="p-4 text-sm font-medium text-gray-900">{t.name}</td>
                    <td className="p-4 text-sm text-gray-500">{t.categoryTitle}</td>
                    <td className="p-4 text-sm text-gray-900 font-semibold text-right">{t.uses}</td>
                    <td className="p-4 text-sm text-gray-500 text-right">{t.errors}</td>
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
