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
  const [loading, setLoading] = useState(true);

  // Tools count from local config
  const totalAvailableTools = ALL_TOOLS.length;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
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
      } catch (err) {
        console.error("Failed to fetch from Firebase:", err);
        // Fallback to 0 if firebase isn't working
        setTotalDownloads(0);
        setTotalToolUses(0);
      }
      setLoading(false);
    }
    load();
  }, [activeRange]);

  return (
    <section className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">📊 Admin Dashboard</h1>
        <FilterTabs active={activeRange} setActive={setActiveRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Available Tools" value={totalAvailableTools} />
        <StatCard title="Total Tool Uses" value={loading ? '...' : totalToolUses} />
        <StatCard title="Total Downloads" value={loading ? '...' : totalDownloads} />
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Welcome to SizeSnap Admin</h2>
        <p className="text-gray-600">
          This dashboard shows your platform&apos;s real-time analytics. Usage data is aggregated from Firebase based on user activity.
        </p>
        {(totalDownloads === 0 && totalToolUses === 0 && !loading) && (
          <div className="mt-4 p-4 bg-amber-50 text-amber-800 border border-amber-200 rounded-md text-sm">
            <strong>Note:</strong> No usage data found for the selected time range. This could mean either no users have used tools recently, or Firebase is not fully configured/tracking correctly yet.
          </div>
        )}
      </div>
    </section>
  );
}
