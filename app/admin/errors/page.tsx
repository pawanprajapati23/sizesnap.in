'use client';
import { useEffect, useState } from 'react';
import FilterTabs, { TimeRange } from '@/app/admin/components/FilterTabs';
import { fetchUsage, aggregateWithin } from '@/lib/firebase';
import { ALL_TOOLS } from '@/data/tools';
import Link from 'next/link';

type ErrorStat = {
  slug: string;
  name: string;
  uses: number;
  errors: number;
  status: 'Healthy' | 'Warning' | 'Critical';
};

const rangeToMs = (range: TimeRange) => {
  switch (range) {
    case '24h': return 24 * 60 * 60 * 1000;
    case '7d':  return 7 * 24 * 60 * 60 * 1000;
    case '30d': return 30 * 24 * 60 * 60 * 1000;
    case '3m':  return 90 * 24 * 60 * 60 * 1000;
  }
};

export default function ToolErrorsPage() {
  const [activeRange, setActiveRange] = useState<TimeRange>('24h');
  const [stats, setStats] = useState<ErrorStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const usageRecords = await fetchUsage('toolUsage');
        const errorRecords = await fetchUsage('toolErrors');
        const ms = rangeToMs(activeRange);

        const newStats: ErrorStat[] = ALL_TOOLS.map((t) => {
          const usesMap = (usageRecords[t.slug] ?? {}) as unknown as Record<string, number>;
          const errorsMap = (errorRecords[t.slug] ?? {}) as unknown as Record<string, number>;

          const uses = aggregateWithin(usesMap, ms);
          const errors = aggregateWithin(errorsMap, ms);

          let status: 'Healthy' | 'Warning' | 'Critical' = 'Healthy';
          const errorRate = uses > 0 ? errors / uses : 0;

          if (errors > 0) {
            if (errorRate > 0.1 || errors > 50) status = 'Critical';
            else status = 'Warning';
          }

          return {
            slug: t.slug,
            name: t.name ?? t.slug,
            uses,
            errors,
            status
          };
        }).sort((a, b) => b.errors - a.errors);

        setStats(newStats);
      } catch (err) {
        console.error("Failed to fetch error stats:", err);
      }
      setLoading(false);
    }
    load();
  }, [activeRange]);

  const StatusBadge = ({ status }: { status: string }) => {
    if (status === 'Critical') return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Critical</span>;
    if (status === 'Warning') return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Warning</span>;
    return <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">Healthy</span>;
  };

  return (
    <section className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🚨 Tool Errors Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time client-side error monitoring</p>
        </div>
        <FilterTabs active={activeRange} setActive={setActiveRange} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            Loading error statistics...
          </div>
        ) : (
          <div className="overflow-x-auto">
            {stats.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No error records found.
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-[#EEF1FB] border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase">Tool Name</th>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase text-right">Errors</th>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase text-right">Error Rate</th>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {stats.filter(s => s.uses > 0 || s.errors > 0).map((s) => {
                    const errRate = s.uses > 0 ? ((s.errors / s.uses) * 100).toFixed(2) + '%' : 'N/A';
                    return (
                      <tr key={s.slug} className="hover:bg-gray-50 transition-colors group">
                        <td className="p-4 text-sm font-medium text-gray-900">
                          <Link href={`/tools/${s.slug}`} className="hover:underline hover:text-[#414FA8]">{s.name}</Link>
                        </td>
                        <td className="p-4 text-sm text-red-600 font-bold text-right">{s.errors}</td>
                        <td className="p-4 text-sm text-gray-500 text-right">{errRate}</td>
                        <td className="p-4 text-center">
                          <StatusBadge status={s.status} />
                        </td>
                      </tr>
                    );
                  })}
                  {stats.filter(s => s.uses === 0 && s.errors === 0).length === stats.length && (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500">0 errors recorded in selected period.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
