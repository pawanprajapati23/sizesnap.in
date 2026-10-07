'use client';
import { useEffect, useState } from 'react';
import FilterTabs, { TimeRange } from '@/app/admin/components/FilterTabs';
import { fetchAdPerformance, aggregateWithin } from '@/lib/firebase';

type AdStat = {
  slotId: string;
  name: string;
  impressions: number;
};

const rangeToMs = (range: TimeRange) => {
  switch (range) {
    case '24h': return 24 * 60 * 60 * 1000;
    case '7d':  return 7 * 24 * 60 * 60 * 1000;
    case '30d': return 30 * 24 * 60 * 60 * 1000;
    case '3m':  return 90 * 24 * 60 * 60 * 1000;
  }
};

const AD_SLOTS = [
  { id: '85ed548f0bf183422998f8047970a2a4', name: 'Desktop Top (728x90)' },
  { id: 'ca152145b204618e473e042be63e3d3f', name: 'Sidebar 1 (300x250)' },
  { id: '659f8c8577a79eebec41bc223cf58238', name: 'Sidebar 2 (300x250)' },
  { id: 'ca0f9b6cdfb1c50e263ab26bb94c1f93', name: 'Mobile Sticky (320x50)' },
];

export default function AdsDashboardPage() {
  const [activeRange, setActiveRange] = useState<TimeRange>('24h');
  const [stats, setStats] = useState<AdStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const adRecords = await fetchAdPerformance();
        const ms = rangeToMs(activeRange);

        const newStats: AdStat[] = AD_SLOTS.map((slot) => {
          const impressionsMap = (adRecords[slot.id]?.impressions ?? {}) as unknown as Record<string, number>;

          return {
            slotId: slot.id,
            name: slot.name,
            impressions: aggregateWithin(impressionsMap, ms),
          };
        }).sort((a, b) => b.impressions - a.impressions);

        setStats(newStats);
      } catch (err) {
        console.error("Failed to fetch ad performance stats:", err);
      }
      setLoading(false);
    }
    load();
  }, [activeRange]);

  const totalImpressions = stats.reduce((sum, s) => sum + s.impressions, 0);

  return (
    <section className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">📊 Ad Performance</h1>
          <p className="text-sm text-gray-500 mt-1">Track which ad placements are performing best</p>
        </div>
        <FilterTabs active={activeRange} setActive={setActiveRange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total Impressions</h3>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? '-' : totalImpressions.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 mt-2">Across all active ad slots</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Top Performing Ad</h3>
          <p className="text-xl font-bold text-[#414FA8] truncate">
            {loading ? '-' : (stats[0]?.impressions > 0 ? stats[0].name : 'N/A')}
          </p>
          <p className="text-xs text-gray-400 mt-2">Highest impression count</p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Active Slots</h3>
          <p className="text-3xl font-bold text-gray-900">
            {AD_SLOTS.length}
          </p>
          <p className="text-xs text-gray-400 mt-2">Currently being tracked</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        {loading ? (
          <div className="p-12 text-center text-gray-500 font-medium">
            Loading ad statistics...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead className="bg-[#EEF1FB] border-b border-gray-200">
                <tr>
                  <th className="p-4 text-xs font-bold text-[#414FA8] uppercase">Ad Placement</th>
                  <th className="p-4 text-xs font-bold text-[#414FA8] uppercase">Slot ID</th>
                  <th className="p-4 text-xs font-bold text-[#414FA8] uppercase text-right">Impressions</th>
                  <th className="p-4 text-xs font-bold text-[#414FA8] uppercase text-right">% of Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {stats.map((s) => {
                  const percentage = totalImpressions > 0 
                    ? ((s.impressions / totalImpressions) * 100).toFixed(1) + '%' 
                    : '0%';
                    
                  return (
                    <tr key={s.slotId} className="hover:bg-gray-50 transition-colors group">
                      <td className="p-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {s.name}
                      </td>
                      <td className="p-4 text-sm text-gray-500 font-mono text-xs">
                        {s.slotId}
                      </td>
                      <td className="p-4 text-sm text-gray-600 font-semibold text-right whitespace-nowrap">
                        {s.impressions.toLocaleString()}
                      </td>
                      <td className="p-4 text-sm text-gray-500 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <span className="w-12 text-right">{percentage}</span>
                          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[#414FA8] rounded-full" 
                              style={{ width: percentage }}
                            />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
