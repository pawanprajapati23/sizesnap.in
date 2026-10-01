'use client';
import { useEffect, useState, useMemo } from 'react';
import FilterTabs, { TimeRange } from '@/app/admin/components/FilterTabs';
import { fetchUsage, aggregateWithin } from '@/lib/firebase';
import { ALL_TOOLS } from '@/data/tools';
import Link from 'next/link';

type PerfStat = {
  slug: string;
  name: string;
  categoryTitle: string;
  uses: number;
  errors: number;
};

const rangeToMs = (range: TimeRange) => {
  switch (range) {
    case '24h': return 24 * 60 * 60 * 1000;
    case '7d':  return 7 * 24 * 60 * 60 * 1000;
    case '30d': return 30 * 24 * 60 * 60 * 1000;
    case '3m':  return 90 * 24 * 60 * 60 * 1000;
  }
};

export default function ToolPerformancePage() {
  const [activeRange, setActiveRange] = useState<TimeRange>('24h');
  const [stats, setStats] = useState<PerfStat[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const usageRecords = await fetchUsage('toolUsage');
        const errorRecords = await fetchUsage('toolErrors');
        const ms = rangeToMs(activeRange);

        const newStats: PerfStat[] = ALL_TOOLS.map((t) => {
          const usesMap = (usageRecords[t.slug] ?? {}) as unknown as Record<string, number>;
          const errorsMap = (errorRecords[t.slug] ?? {}) as unknown as Record<string, number>;

          return {
            slug: t.slug,
            name: t.name ?? t.slug,
            categoryTitle: t.categoryTitle || 'Uncategorized',
            uses: aggregateWithin(usesMap, ms),
            errors: aggregateWithin(errorsMap, ms),
          };
        }).sort((a, b) => b.uses - a.uses);

        setStats(newStats);
      } catch (err) {
        console.error("Failed to fetch performance stats:", err);
      }
      setLoading(false);
    }
    load();
  }, [activeRange]);

  const categories = useMemo(() => {
    const cats = new Set(stats.map(s => s.categoryTitle));
    return ['All Categories', ...Array.from(cats)].sort();
  }, [stats]);

  const filteredStats = useMemo(() => {
    return stats.filter(stat => {
      const matchesSearch = stat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            stat.slug.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || stat.categoryTitle === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [stats, searchQuery, selectedCategory]);

  return (
    <section className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📈 Tool Performance</h1>
          <p className="text-sm text-gray-500 mt-1">Detailed usage and error metrics per tool</p>
        </div>
        <FilterTabs active={activeRange} setActive={setActiveRange} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search tools by name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#414FA8] focus:border-[#414FA8] sm:text-sm"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#414FA8] focus:border-[#414FA8] sm:text-sm bg-white"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            Loading performance statistics...
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredStats.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No tools found.
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-[#EEF1FB] border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase">Tool Name</th>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase">Category</th>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase text-right">Uses</th>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase text-right">Downloads</th>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase text-right">Download Rate</th>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase text-right">Errors</th>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase text-right">Error Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredStats.map((s) => {
                    // Global download tracking, simulate 0 since downloads aren't tracked per slug yet.
                    const dRate = 'N/A';
                    const errRate = s.uses > 0 ? ((s.errors / s.uses) * 100).toFixed(2) + '%' : 'N/A';
                    return (
                      <tr key={s.slug} className="hover:bg-gray-50 transition-colors group">
                        <td className="p-4 text-sm font-medium text-gray-900">
                          <Link href={`/tools/${s.slug}`} className="hover:underline hover:text-[#414FA8]">{s.name}</Link>
                        </td>
                        <td className="p-4 text-sm text-gray-500">{s.categoryTitle}</td>
                        <td className="p-4 text-sm text-gray-600 font-semibold text-right">{s.uses.toLocaleString()}</td>
                        <td className="p-4 text-sm text-gray-500 text-right">0</td>
                        <td className="p-4 text-sm text-gray-500 text-right">{dRate}</td>
                        <td className="p-4 text-sm text-red-600 font-semibold text-right">{s.errors}</td>
                        <td className="p-4 text-sm text-gray-500 text-right">{errRate}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
