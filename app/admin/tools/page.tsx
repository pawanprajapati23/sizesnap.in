'use client';
import { useEffect, useState, useMemo } from 'react';
import FilterTabs, { TimeRange } from '@/app/admin/components/FilterTabs';
import { fetchUsage, aggregateWithin } from '@/lib/firebase';
import { ALL_TOOLS } from '@/data/tools';
import Link from 'next/link';

type ToolStat = {
  slug: string;
  name: string;
  categoryTitle: string;
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
  
  // Advanced features state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

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
            categoryTitle: t.categoryTitle || 'Uncategorized',
            count: aggregateWithin(records, ms),
          };
        }).sort((a, b) => b.count - a.count);
        setStats(newStats);
      } catch (err) {
        console.error("Failed to fetch from Firebase:", err);
        const fallbackStats = ALL_TOOLS.map(t => ({ 
          slug: t.slug, 
          name: t.name ?? t.slug, 
          categoryTitle: t.categoryTitle || 'Uncategorized',
          count: 0 
        }));
        setStats(fallbackStats);
      }
      setLoading(false);
    }
    load();
  }, [activeRange]);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(stats.map(s => s.categoryTitle));
    return ['All Categories', ...Array.from(cats)].sort();
  }, [stats]);

  // Filter and Search logic
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
          <h1 className="text-2xl font-bold text-gray-900">🔧 Tools Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track usage of {ALL_TOOLS.length} active tools</p>
        </div>
        <FilterTabs active={activeRange} setActive={setActiveRange} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {/* Advanced Toolbar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search tools by name or slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-[#414FA8] focus:border-[#414FA8] sm:text-sm"
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
          <div className="p-12 text-center text-gray-500 font-medium flex flex-col items-center">
            <svg className="animate-spin h-8 w-8 text-[#414FA8] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Loading real-time tool statistics...
          </div>
        ) : (
          <div className="overflow-x-auto">
            {filteredStats.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                No tools found matching your filters.
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead className="bg-[#EEF1FB] border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase tracking-wider w-[40%]">Tool Name</th>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase tracking-wider w-[30%]">Category</th>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase tracking-wider text-right w-[15%]">Uses</th>
                    <th className="p-4 text-xs font-bold text-[#414FA8] uppercase tracking-wider text-center w-[15%]">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {filteredStats.map((s) => (
                    <tr key={s.slug} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-4 text-sm font-medium text-gray-900">
                        {s.name}
                        <div className="text-xs text-gray-400 font-normal mt-0.5">/{s.slug}</div>
                      </td>
                      <td className="p-4 text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {s.categoryTitle}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-600 font-semibold text-right">
                        {s.count.toLocaleString()}
                      </td>
                      <td className="p-4 text-center">
                        <Link 
                          href={s.categoryTitle === 'Student Calculators' ? `/${s.slug}` : `/tools/${s.slug}`}
                          target="_blank"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md text-[#414FA8] bg-[#EEF1FB] hover:bg-[#d6def7] transition-colors"
                        >
                          View Live
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
