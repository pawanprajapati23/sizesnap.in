'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import FilterTabs, { TimeRange } from '@/app/admin/components/FilterTabs';
import { fetchUsage, aggregateWithin } from '@/lib/firebase';
import { ALL_TOOLS } from '@/data/tools';
import { TOOL_REDIRECT_MAP } from '@/data/tool-redirects';
import Link from 'next/link';
import {
  Search,
  RefreshCw,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export type ToolDiagnosticStat = {
  slug: string;
  name: string;
  route: string;
  categoryTitle: string;
  uses: number;
  downloads: number;
  conversionPct: number;
  errors: number;
  status: 'Healthy' | 'Warning' | 'Critical';
};

export type ViewMode = 'all' | 'active' | 'errors';

const CANONICAL_TOOLS = ALL_TOOLS.filter(
  (t) => !TOOL_REDIRECT_MAP[t.slug] && t.status !== 'draft' && t.status !== 'deprecated'
);

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

export function ToolsCatalogView({ initialMode = 'all' }: { initialMode?: ViewMode }) {
  const [activeRange, setActiveRange] = useState<TimeRange>('24h');
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);
  const [stats, setStats] = useState<ToolDiagnosticStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All Categories');

  const loadData = useCallback(async () => {
    try {
      const [usageRecords] = await Promise.all([
        fetchUsage('toolUsage'),
      ]);
      const ms = rangeToMs(activeRange);

      const perToolDlMap = (usageRecords['_downloads'] ?? {}) as unknown as Record<
        string,
        Record<string, number>
      >;
      const perToolErrMap = (usageRecords['_errors'] ?? {}) as unknown as Record<
        string,
        Record<string, number>
      >;

      const rows: ToolDiagnosticStat[] = CANONICAL_TOOLS.map((t) => {
        const usesMap = (usageRecords[t.slug] ?? {}) as unknown as Record<string, number>;
        const dlMap = perToolDlMap[t.slug] ?? {};
        const errFromUsage = perToolErrMap[t.slug] ? aggregateWithin(perToolErrMap[t.slug], ms) : 0;
        const uses = aggregateWithin(usesMap, ms);
        const downloads = aggregateWithin(dlMap, ms);
        const errors = errFromUsage;
        const conversionPct = uses > 0 ? Math.min(100, Math.round((downloads / uses) * 100)) : 0;

        let status: 'Healthy' | 'Warning' | 'Critical' = 'Healthy';
        const errorRate = uses > 0 ? errors / uses : 0;
        if (errors > 0) {
          status = errorRate > 0.1 || errors >= 20 ? 'Critical' : 'Warning';
        }

        const route =
          t.route ||
          (t.categoryTitle === 'Student Calculators' ? `/${t.slug}` : `/tools/${t.slug}`);

        return {
          slug: t.slug,
          name: t.name ?? t.slug,
          route,
          categoryTitle: t.categoryTitle || 'Utility',
          uses,
          downloads,
          conversionPct,
          errors,
          status,
        };
      }).sort((a, b) => {
        if (b.uses !== a.uses) return b.uses - a.uses;
        return b.errors - a.errors;
      });

      setStats(rows);
    } catch (err) {
      console.error('Failed to load tools diagnostics:', err);
    } finally {
      setLoading(false);
    }
  }, [activeRange]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const categories = useMemo(() => {
    const cats = new Set(stats.map((s) => s.categoryTitle));
    return ['All Categories', ...Array.from(cats).sort()];
  }, [stats]);

  const filteredStats = useMemo(() => {
    return stats.filter((stat) => {
      if (viewMode === 'active' && stat.uses === 0 && stat.downloads === 0) return false;
      if (viewMode === 'errors' && stat.errors === 0) return false;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        stat.name.toLowerCase().includes(q) ||
        stat.slug.toLowerCase().includes(q);
      const matchesCategory =
        selectedCategory === 'All Categories' || stat.categoryTitle === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [stats, viewMode, searchQuery, selectedCategory]);

  const totals = useMemo(() => {
    let uses = 0;
    let downloads = 0;
    let errors = 0;
    let activeCount = 0;
    for (const s of stats) {
      uses += s.uses;
      downloads += s.downloads;
      errors += s.errors;
      if (s.uses > 0) activeCount++;
    }
    const conv = uses > 0 ? Math.min(100, Math.round((downloads / uses) * 100)) : 0;
    return { uses, downloads, errors, activeCount, conv };
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Tools Catalog &amp; Diagnostics
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Unified usage, download conversion, and client-side error monitoring across{' '}
            <span className="font-mono font-semibold text-slate-700 tabular-nums">
              {CANONICAL_TOOLS.length}
            </span>{' '}
            canonical tools
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <FilterTabs
            active={activeRange}
            setActive={(range) => {
              setLoading(true);
              setActiveRange(range);
            }}
          />
          <button
            type="button"
            onClick={() => {
              setLoading(true);
              loadData();
            }}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <span className="text-xs font-medium text-slate-500">Canonical Tools</span>
          <p className="font-mono text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {CANONICAL_TOOLS.length}
          </p>
          <span className="text-[11px] text-slate-400 tabular-nums">
            {totals.activeCount} used in period
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <span className="text-xs font-medium text-slate-500">Total Processed</span>
          <p className="font-mono text-2xl font-bold text-slate-900 mt-1 tabular-nums">
            {totals.uses.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">Completed tool runs</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <span className="text-xs font-medium text-slate-500">Tool Downloads</span>
          <p className="font-mono text-2xl font-bold text-emerald-700 mt-1 tabular-nums">
            {totals.downloads.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400 tabular-nums">
            {totals.conv}% conversion rate
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <span className="text-xs font-medium text-slate-500">Client Errors</span>
          <p
            className={`font-mono text-2xl font-bold mt-1 tabular-nums ${
              totals.errors > 0 ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {totals.errors}
          </p>
          <span className="text-[11px] text-slate-400">
            {totals.errors === 0 ? 'All tools nominal' : 'Requires inspection'}
          </span>
        </div>
      </div>

      {/* Filter Bar & Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Segmented View Mode */}
          <div className="inline-flex p-1 rounded-lg bg-slate-200/70 self-start">
            {(
              [
                { id: 'all', label: `All Tools (${stats.length})` },
                { id: 'active', label: `Used in Window (${totals.activeCount})` },
                {
                  id: 'errors',
                  label: `With Errors (${stats.filter((s) => s.errors > 0).length})`,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setViewMode(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  viewMode === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Category Select */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1 max-w-xl">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filter by tool name or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Loading tool telemetry...
          </div>
        ) : filteredStats.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No tools match the current filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                  <th className="px-5 py-3">Tool Name &amp; Slug</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Processed</th>
                  <th className="px-4 py-3 text-right">Downloads</th>
                  <th className="px-4 py-3 text-right">Conversion</th>
                  <th className="px-4 py-3 text-right">Errors</th>
                  <th className="px-4 py-3">Health</th>
                  <th className="px-5 py-3 text-right">Route</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredStats.map((s) => (
                  <tr key={s.slug} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-3">
                      <div className="font-semibold text-slate-900">{s.name}</div>
                      <div className="font-mono text-[11px] text-slate-400">{s.route}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{s.categoryTitle}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900 tabular-nums">
                      {s.uses.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-700 tabular-nums">
                      {s.downloads.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-600 tabular-nums">
                      {s.uses > 0 ? `${s.conversionPct}%` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">
                      <span className={s.errors > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}>
                        {s.errors}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {s.status === 'Healthy' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Healthy</span>
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center gap-1 font-semibold ${
                            s.status === 'Critical' ? 'text-rose-600' : 'text-amber-600'
                          }`}
                        >
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{s.status}</span>
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        href={s.route}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline whitespace-nowrap"
                      >
                        <span>Open</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ToolsManagementPage() {
  return <ToolsCatalogView initialMode="all" />;
}
