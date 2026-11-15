'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import FilterTabs, { TimeRange } from '@/app/admin/components/FilterTabs';
import {
  fetchUsage,
  aggregateWithin,
  fetchLiveActivity,
  type LiveActivityItem,
} from '@/lib/firebase';
import { ALL_TOOLS } from '@/data/tools';
import Link from 'next/link';
import {
  CheckCircle2,
  Download,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Search,
  Clock,
  X,
  ArrowUpRight,
} from 'lucide-react';

const rangeToMs = (range: TimeRange): number => {
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

function formatTimeAgo(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 15) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

function formatSize(kb: number): string {
  if (kb >= 1024) {
    return `${(kb / 1024).toFixed(2)} MB`;
  }
  return `${Math.round(kb)} KB`;
}

export default function LiveActivityPage() {
  const [activeRange, setActiveRange] = useState<TimeRange>('24h');
  const [loading, setLoading] = useState<boolean>(true);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const [activityItems, setActivityItems] = useState<LiveActivityItem[]>([]);
  const [totalUses, setTotalUses] = useState<number>(0);
  const [totalDownloads, setTotalDownloads] = useState<number>(0);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [topToolsData, setTopToolsData] = useState<
    Array<{
      slug: string;
      name: string;
      uses: number;
      downloads: number;
      conversion: number;
    }>
  >([]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'ready_to_download' | 'downloaded' | 'error'
  >('all');
  const [selectedToolFilter, setSelectedToolFilter] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState<number>(100);

  const loadData = useCallback(async () => {
    try {
      const ms = rangeToMs(activeRange);
      const now = Date.now();

      const [toolRecords, allLiveLogs] = await Promise.all([
        fetchUsage('toolUsage'),
        fetchLiveActivity(2000),
      ]);

      const dlToolRecords = (toolRecords['_downloads'] ?? {}) as unknown as Record<
        string,
        Record<string, number>
      >;
      const errToolRecords = (toolRecords['_errors'] ?? {}) as unknown as Record<
        string,
        Record<string, number>
      >;

      let calculatedUses = 0;
      let calculatedErrs = 0;
      let calculatedToolDls = 0;

      const timeFilteredLogs = allLiveLogs.filter((item) => now - item.timestamp <= ms);

      const toolPerformanceList: Array<{
        slug: string;
        name: string;
        uses: number;
        downloads: number;
        conversion: number;
      }> = [];

      for (const [key, value] of Object.entries(toolRecords)) {
        if (key.startsWith('_')) continue;
        if (typeof value === 'object' && value) {
          const uses = aggregateWithin(value as unknown as Record<string, number>, ms);
          calculatedUses += uses;

          const toolDls = dlToolRecords[key]
            ? aggregateWithin(dlToolRecords[key] as unknown as Record<string, number>, ms)
            : 0;

          if (uses > 0) {
            const toolMeta = ALL_TOOLS.find((t) => t.slug === key);
            const toolName = toolMeta
              ? toolMeta.name
              : key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
            const conversion = uses > 0 ? Math.min(100, Math.round((toolDls / uses) * 100)) : 0;

            toolPerformanceList.push({
              slug: key,
              name: toolName,
              uses,
              downloads: toolDls,
              conversion,
            });
          }
        }
      }

      for (const [, value] of Object.entries(dlToolRecords)) {
        if (typeof value === 'object' && value) {
          calculatedToolDls += aggregateWithin(value as unknown as Record<string, number>, ms);
        }
      }

      for (const [, value] of Object.entries(errToolRecords)) {
        if (typeof value === 'object' && value) {
          calculatedErrs += aggregateWithin(value as unknown as Record<string, number>, ms);
        }
      }

      const globalDls = dlToolRecords['_total']
        ? aggregateWithin(dlToolRecords['_total'] as unknown as Record<string, number>, ms)
        : 0;
      const effectiveDls = Math.max(globalDls, calculatedToolDls);

      toolPerformanceList.sort((a, b) => b.uses - a.uses);
      setTopToolsData(toolPerformanceList.slice(0, 5));

      setTotalUses(calculatedUses);
      setTotalDownloads(effectiveDls);
      setTotalErrors(calculatedErrs);
      setActivityItems(timeFilteredLogs);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to load live activity data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeRange]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadData();
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadData]);

  const readyToDownloadCount = useMemo(() => {
    return activityItems.filter((item) => item.status === 'success' && !item.downloaded).length;
  }, [activityItems]);

  const downloadedSessionsCount = useMemo(() => {
    return activityItems.filter((item) => item.downloaded).length;
  }, [activityItems]);

  const dropOffAnalysis = useMemo(() => {
    const countsByTool: Record<
      string,
      { tool: string; toolName: string; readyCount: number; downloadedCount: number }
    > = {};

    activityItems.forEach((item) => {
      const key = item.tool || 'unknown';
      if (!countsByTool[key]) {
        const meta = ALL_TOOLS.find((t) => t.slug === key);
        countsByTool[key] = {
          tool: key,
          toolName: item.toolName || meta?.name || key,
          readyCount: 0,
          downloadedCount: 0,
        };
      }
      if (item.status === 'success' && !item.downloaded) {
        countsByTool[key].readyCount++;
      } else if (item.downloaded) {
        countsByTool[key].downloadedCount++;
      }
    });

    const sorted = Object.values(countsByTool).sort((a, b) => b.readyCount - a.readyCount);
    const worstTool = sorted.length > 0 && sorted[0].readyCount > 0 ? sorted[0] : null;

    return { worstTool };
  }, [activityItems]);

  const filteredItems = useMemo(() => {
    return activityItems.filter((item) => {
      if (statusFilter === 'ready_to_download') {
        if (!(item.status === 'success' && !item.downloaded)) return false;
      } else if (statusFilter === 'downloaded') {
        if (!item.downloaded) return false;
      } else if (statusFilter === 'error') {
        if (item.status !== 'error') return false;
      }

      if (selectedToolFilter && item.tool !== selectedToolFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTool = item.tool && item.tool.toLowerCase().includes(q);
        const matchesName = item.toolName && item.toolName.toLowerCase().includes(q);
        const matchesType = item.fileType && item.fileType.toLowerCase().includes(q);
        if (!matchesTool && !matchesName && !matchesType) return false;
      }

      return true;
    });
  }, [activityItems, statusFilter, selectedToolFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Live Conversion Stream
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 tabular-nums">
            <span>Real-time document processing &amp; download drop-off diagnostics</span>
            <span aria-hidden="true">·</span>
            <span>Synced {lastRefreshed.toLocaleTimeString()}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors border cursor-pointer whitespace-nowrap ${
              autoRefresh
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            Auto-Poll (15s): {autoRefresh ? 'Active' : 'Paused'}
          </button>
        </div>
      </div>

      {/* 4 Interactive KPI Filter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          type="button"
          onClick={() => {
            setStatusFilter('all');
            setSelectedToolFilter(null);
          }}
          className={`text-left p-5 rounded-xl border transition-colors cursor-pointer bg-white ${
            statusFilter === 'all' && !selectedToolFilter
              ? 'border-slate-900 ring-1 ring-slate-900'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-medium text-slate-500">Total Processed</span>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 mt-1.5 tabular-nums">
            {totalUses.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">All sessions in {activeRange}</div>
        </button>

        <button
          type="button"
          onClick={() =>
            setStatusFilter(statusFilter === 'ready_to_download' ? 'all' : 'ready_to_download')
          }
          className={`text-left p-5 rounded-xl border transition-colors cursor-pointer bg-white ${
            statusFilter === 'ready_to_download'
              ? 'border-amber-600 ring-1 ring-amber-600'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-medium text-slate-500">Pending Download</span>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-amber-600 mt-1.5 tabular-nums">
            {readyToDownloadCount.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1">Processed but not saved yet</div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'downloaded' ? 'all' : 'downloaded')}
          className={`text-left p-5 rounded-xl border transition-colors cursor-pointer bg-white ${
            statusFilter === 'downloaded'
              ? 'border-emerald-700 ring-1 ring-emerald-700'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-medium text-slate-500">Downloaded</span>
          <div className="font-mono text-2xl sm:text-3xl font-bold text-emerald-700 mt-1.5 tabular-nums">
            {totalDownloads.toLocaleString()}
          </div>
          <div className="text-xs text-slate-400 mt-1 tabular-nums">
            {downloadedSessionsCount} verified in live log
          </div>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter(statusFilter === 'error' ? 'all' : 'error')}
          className={`text-left p-5 rounded-xl border transition-colors cursor-pointer bg-white ${
            statusFilter === 'error'
              ? 'border-rose-600 ring-1 ring-rose-600'
              : 'border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-xs font-medium text-slate-500">Failed Runs</span>
          <div
            className={`font-mono text-2xl sm:text-3xl font-bold mt-1.5 tabular-nums ${
              totalErrors > 0 ? 'text-rose-600' : 'text-slate-900'
            }`}
          >
            {totalErrors}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {totalErrors === 0 ? 'Zero client errors' : 'Click to inspect failures'}
          </div>
        </button>
      </div>

      {/* Top 5 Tools Strip */}
      {topToolsData.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900">
              Highest Volume Tools ({activeRange})
            </h2>
            <span className="text-xs text-slate-400">Click any tool to filter stream</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {topToolsData.map((tool, idx) => {
              const isSelected = selectedToolFilter === tool.slug;
              return (
                <button
                  key={tool.slug}
                  type="button"
                  onClick={() => setSelectedToolFilter(isSelected ? null : tool.slug)}
                  className={`p-3.5 rounded-lg border text-left transition-colors cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-900'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono tabular-nums mb-1">
                      <span className={isSelected ? 'text-slate-300' : 'text-slate-400'}>
                        0{idx + 1}
                      </span>
                      <span className={isSelected ? 'text-emerald-300' : 'text-emerald-700 font-semibold'}>
                        {tool.conversion}% saved
                      </span>
                    </div>
                    <div className="text-xs font-semibold line-clamp-1">{tool.name}</div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-slate-200/40 flex items-center justify-between text-[11px] font-mono tabular-nums">
                    <span>{tool.uses.toLocaleString()} runs</span>
                    <span className="underline">{isSelected ? 'Reset' : 'Filter'}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Drop-off Diagnostic Notice */}
      {dropOffAnalysis.worstTool && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-semibold text-amber-900 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Conversion Drop-Off Insight</span>
            </div>
            <p className="text-xs text-slate-700">
              <strong>{dropOffAnalysis.worstTool.toolName}</strong> has{' '}
              <strong className="font-mono tabular-nums">
                {dropOffAnalysis.worstTool.readyCount}
              </strong>{' '}
              processed sessions where the user has not clicked Download yet.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setSelectedToolFilter(dropOffAnalysis.worstTool!.tool);
                setStatusFilter('ready_to_download');
              }}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-700 hover:bg-amber-800 text-white transition-colors cursor-pointer whitespace-nowrap"
            >
              Inspect Sessions
            </button>
            <Link
              href={`/tools/${dropOffAnalysis.worstTool.tool}`}
              target="_blank"
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-100 transition-colors inline-flex items-center gap-1 whitespace-nowrap"
            >
              <span>Open Tool</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}

      {/* Live Document Sessions Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/60 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div className="inline-flex p-1 rounded-lg bg-slate-200/70 self-start">
            {(
              [
                { id: 'all', label: `All (${activityItems.length})` },
                { id: 'ready_to_download', label: `Pending (${readyToDownloadCount})` },
                { id: 'downloaded', label: `Downloaded (${downloadedSessionsCount})` },
                {
                  id: 'error',
                  label: `Errors (${activityItems.filter((i) => i.status === 'error').length})`,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-md">
            {selectedToolFilter && (
              <button
                type="button"
                onClick={() => setSelectedToolFilter(null)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 text-white whitespace-nowrap cursor-pointer"
              >
                <span>{selectedToolFilter}</span>
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search tool or file format..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900"
              />
            </div>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            No matching conversion sessions in this window.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                  <th className="px-5 py-3">Tool &amp; Format</th>
                  <th className="px-4 py-3">Size Compression</th>
                  <th className="px-4 py-3">Process State</th>
                  <th className="px-4 py-3">Download State</th>
                  <th className="px-5 py-3 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredItems.slice(0, displayLimit).map((item) => {
                  const isSuccess = item.status === 'success';
                  const hasReduction =
                    item.inputKb && item.outputKb && item.inputKb > item.outputKb;
                  const reductionPct = hasReduction
                    ? Math.round(((item.inputKb! - item.outputKb!) / item.inputKb!) * 100)
                    : 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3">
                        <Link
                          href={`/tools/${item.tool}`}
                          target="_blank"
                          className="font-semibold text-slate-900 hover:text-indigo-600 hover:underline"
                        >
                          {item.toolName || item.tool}
                        </Link>
                        <div className="text-[11px] text-slate-400 uppercase mt-0.5">
                          {item.fileType || 'file'}
                        </div>
                      </td>

                      <td className="px-4 py-3 font-mono tabular-nums text-slate-600">
                        {isSuccess && item.inputKb && item.outputKb ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400">{formatSize(item.inputKb)}</span>
                            <ArrowRight className="w-3 h-3 text-slate-400" />
                            <span className="font-semibold text-slate-900">
                              {formatSize(item.outputKb)}
                            </span>
                            {reductionPct > 0 && (
                              <span className="text-emerald-700 font-semibold">
                                (-{reductionPct}%)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {isSuccess ? (
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Completed</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-600 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>{item.errorMessage || 'Failed'}</span>
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {item.downloaded ? (
                          <span className="inline-flex items-center gap-1 text-slate-900 font-semibold">
                            <Download className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Downloaded</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Ready to download</span>
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3 text-right font-mono text-slate-400 tabular-nums whitespace-nowrap">
                        {formatTimeAgo(item.timestamp)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {filteredItems.length > displayLimit && (
              <div className="p-4 text-center border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDisplayLimit((prev) => prev + 100)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer tabular-nums"
                >
                  Load More ({filteredItems.length - displayLimit} remaining)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
