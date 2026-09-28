// app/admin/page.tsx
'use client';
import { useEffect, useState } from 'react';
import FilterTabs, { TimeRange } from '@/app/admin/components/FilterTabs';
import StatCard from '@/app/admin/components/StatCard';
import { fetchUsage, aggregateWithin } from '@/lib/firebase';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const dlRecords = await fetchUsage('downloads');
      const toolRecords = await fetchUsage('toolUsage');

      const ms = rangeToMs(activeRange);
      setTotalDownloads(aggregateWithin(dlRecords, ms));

      let total = 0;
      for (const slug of Object.keys(toolRecords)) {
        const rec = toolRecords[slug] as unknown as Record<string, number>;
        total += aggregateWithin(rec, ms);
      }
      setTotalToolUses(total);
      setLoading(false);
    }
    load();
  }, [activeRange]);

  return (
    <section className="max-w-4xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">📊 Admin Dashboard</h1>
      <FilterTabs active={activeRange} setActive={setActiveRange} />
      {loading ? (
        <p className="text-gray-600">Loading data…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard title="Total Downloads" value={totalDownloads} />
          <StatCard title="Total Tool Uses" value={totalToolUses} />
        </div>
      )}
    </section>
  );
}
