'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import FilterTabs, { TimeRange } from '@/app/admin/components/FilterTabs';
import { fetchUsage, aggregateWithin, fetchLiveActivity, type LiveActivityItem } from '@/lib/firebase';
import { ALL_TOOLS } from '@/data/tools';
import Link from 'next/link';
import {
  Activity,
  CheckCircle2,
  Download,
  AlertTriangle,
  RefreshCw,
  FileText,
  ImageIcon,
  Clock,
  ArrowRight,
  Search,
  ShieldCheck,
  Zap,
  TrendingDown,
  ChevronRight
} from 'lucide-react';

const rangeToMs = (range: TimeRange): number => {
  switch (range) {
    case '24h': return 24 * 60 * 60 * 1000;
    case '7d':  return 7 * 24 * 60 * 60 * 1000;
    case '30d': return 30 * 24 * 60 * 60 * 1000;
    case '3m':  return 90 * 24 * 60 * 60 * 1000;
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

interface ToolFunnelStat {
  slug: string;
  name: string;
  category: string;
  uses: number;
  downloads: number;
  errors: number;
  conversionRate: number;
  status: 'Healthy' | 'Moderate' | 'Low';
}

export default function LiveActivityPage() {
  const [activeRange, setActiveRange] = useState<TimeRange>('24h');
  const [loading, setLoading] = useState<boolean>(true);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  
  // Data states
  const [activityItems, setActivityItems] = useState<LiveActivityItem[]>([]);
  const [toolStats, setToolStats] = useState<ToolFunnelStat[]>([]);
  const [totalUses, setTotalUses] = useState<number>(0);
  const [totalDownloads, setTotalDownloads] = useState<number>(0);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  
  // Active view tab: 'feed' or 'tools'
  const [activeTab, setActiveTab] = useState<'feed' | 'tools'>('feed');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadData = useCallback(async () => {
    try {
      const ms = rangeToMs(activeRange);

      // Fetch usage, downloads, errors, and live activity in parallel
      const [toolRecords, dlRecords, errRecords, liveLogs] = await Promise.all([
        fetchUsage('toolUsage'),
        fetchUsage('downloads'),
        fetchUsage('toolErrors'),
        fetchLiveActivity(50)
      ]);

      const dlToolRecords = (toolRecords['_downloads'] ?? {}) as unknown as Record<string, Record<string, number>>;
      const errToolRecords = (toolRecords['_errors'] ?? {}) as unknown as Record<string, Record<string, number>>;

      let calculatedUses = 0;
      let calculatedDls = aggregateWithin(dlRecords, ms);
      let calculatedErrs = 0;

      const stats: ToolFunnelStat[] = ALL_TOOLS.map((t) => {
        const usesMap = (toolRecords[t.slug] ?? {}) as unknown as Record<string, number>;
        const uses = aggregateWithin(usesMap, ms);
        calculatedUses += uses;

        // Tool-specific real downloads from _downloads node
        const tDlMap = (dlToolRecords[t.slug] ?? {}) as unknown as Record<string, number>;
        const tDl = aggregateWithin(tDlMap, ms);

        // Tool errors
        const tErrMap = (errToolRecords[t.slug] ?? (errRecords[t.slug] ?? {})) as unknown as Record<string, number>;
        const errs = aggregateWithin(tErrMap, ms);
        calculatedErrs += errs;

        const effectiveDls = tDl;
        const conversionRate = uses > 0 ? Math.min(100, Math.round((effectiveDls / uses) * 100)) : 0;

        let status: 'Healthy' | 'Moderate' | 'Low' = 'Healthy';
        if (uses > 0 && conversionRate < 40) status = 'Low';
        else if (uses > 0 && conversionRate < 70) status = 'Moderate';

        return {
          slug: t.slug,
          name: t.name || t.slug,
          category: t.categoryTitle || 'General',
          uses,
          downloads: effectiveDls,
          errors: errs,
          conversionRate,
          status
        };
      }).sort((a, b) => b.uses - a.uses);

      setTotalUses(calculatedUses);
      const sumToolDls = stats.reduce((acc, curr) => acc + curr.downloads, 0);
      setTotalDownloads(Math.max(calculatedDls, sumToolDls));
      setTotalErrors(calculatedErrs);
      setToolStats(stats);
      setActivityItems(liveLogs);
      setLastRefreshed(new Date());
    } catch (err) {
      console.error('Failed to load live activity data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeRange]);

  useEffect(() => {
    setLoading(true);
    loadData();
  }, [loadData]);

  // Periodic auto-refresh every 15s if enabled
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadData();
    }, 15000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadData]);

  // Success rate computation
  const successRate = useMemo(() => {
    if (totalUses === 0) return 100;
    const successCount = Math.max(0, totalUses - totalErrors);
    return Math.min(100, parseFloat(((successCount / totalUses) * 100).toFixed(1)));
  }, [totalUses, totalErrors]);

  // Download conversion rate
  const downloadRate = useMemo(() => {
    if (totalUses === 0) return 0;
    return Math.min(100, parseFloat(((totalDownloads / totalUses) * 100).toFixed(1)));
  }, [totalUses, totalDownloads]);

  // Filtered tool list
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return toolStats;
    const q = searchQuery.toLowerCase();
    return toolStats.filter(t => t.name.toLowerCase().includes(q) || t.slug.toLowerCase().includes(q));
  }, [toolStats, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              {autoRefresh && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-3 w-3 ${autoRefresh ? 'bg-emerald-500' : 'bg-gray-400'}`}></span>
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
              Live Activity & Conversion Funnel
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time verification: Are users successfully resizing, compressing, and downloading their documents?
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FilterTabs active={activeRange} setActive={setActiveRange} />
          
          <button
            onClick={() => {
              setLoading(true);
              loadData();
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Refresh now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#414FA8]' : ''}`} />
            Refresh
          </button>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors border ${
              autoRefresh 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}
          >
            Auto 15s: {autoRefresh ? 'ON' : 'PAUSED'}
          </button>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Processed */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Processed</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{totalUses.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span>Files submitted across {activeRange}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Success Rate */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Success Rate</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">{successRate}%</div>
            <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
              <span>{totalErrors === 0 ? '0 errors reported' : `${totalErrors} error logged`}</span>
            </div>
          </div>
        </div>

        {/* Card 3: Downloads Completed */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Downloads Saved</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Download className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">{totalDownloads.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1">
              <span>{downloadRate}% final download rate</span>
            </div>
          </div>
        </div>

        {/* Card 4: System Health */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Privacy & Health</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-gray-900 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              100% Operational
            </div>
            <div className="text-xs text-gray-500 mt-1">
              <span>Client-side local processing</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Conversion Funnel Flow */}
      <div className="bg-white p-5 sm:p-6 rounded-xl border border-gray-200 shadow-xs">
        <h2 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#414FA8]" />
          User Journey & Conversion Funnel
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
          {/* Step 1 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-500">STEP 1: UPLOAD & PROCESS</span>
              <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded">100%</span>
            </div>
            <div className="text-xl font-bold text-gray-900">{totalUses.toLocaleString()}</div>
            <p className="text-xs text-gray-500 mt-1">Users initiated photo/PDF compression</p>
            <div className="w-full bg-gray-200 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-blue-600 h-full rounded-full w-full"></div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-emerald-800">STEP 2: TARGET ACHIEVED</span>
              <span className="text-xs font-semibold text-emerald-800 bg-emerald-200/60 px-2 py-0.5 rounded">
                {successRate}%
              </span>
            </div>
            <div className="text-xl font-bold text-emerald-900">
              {Math.max(0, totalUses - totalErrors).toLocaleString()}
            </div>
            <p className="text-xs text-emerald-700 mt-1">Successfully reached desired KB & DPI</p>
            <div className="w-full bg-emerald-200 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: `${successRate}%` }}></div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-purple-50/60 border border-purple-200 rounded-lg p-4 relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-purple-800">STEP 3: FILE DOWNLOADED</span>
              <span className="text-xs font-semibold text-purple-800 bg-purple-200/60 px-2 py-0.5 rounded">
                {downloadRate}%
              </span>
            </div>
            <div className="text-xl font-bold text-purple-900">{totalDownloads.toLocaleString()}</div>
            <p className="text-xs text-purple-700 mt-1">User saved output document to device</p>
            <div className="w-full bg-purple-200 h-2 rounded-full mt-3 overflow-hidden">
              <div className="bg-purple-600 h-full rounded-full" style={{ width: `${downloadRate}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher: Live Stream vs Tool-by-Tool Stats */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-gray-200 bg-gray-50/70 p-2 gap-2">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'feed'
                ? 'bg-white text-[#414FA8] shadow-xs border border-gray-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Clock className="w-4 h-4" />
            Live Processing Stream (Recent Sessions)
            {activityItems.length > 0 && (
              <span className="bg-[#EEF1FB] text-[#414FA8] text-[10px] px-2 py-0.5 rounded-full font-bold">
                {activityItems.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-colors ${
              activeTab === 'tools'
                ? 'bg-white text-[#414FA8] shadow-xs border border-gray-200'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Zap className="w-4 h-4" />
            Tool-by-Tool Conversion Table ({toolStats.filter(t => t.uses > 0).length} Active)
          </button>
        </div>

        {/* Tab 1: Live Processing Feed */}
        {activeTab === 'feed' && (
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-gray-500">
                Showing real-time compression telemetry. Only metadata (sizes & target) is recorded; zero files leave the user&apos;s browser.
              </div>
              <span className="text-[11px] text-gray-400">
                Last checked: {lastRefreshed.toLocaleTimeString()}
              </span>
            </div>

            {activityItems.length === 0 ? (
              <div className="py-12 text-center">
                <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3 animate-pulse" />
                <h3 className="text-sm font-bold text-gray-700">Waiting for live events...</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                  As users resize photos or compress PDFs on SizeSnap, incoming successful runs and downloads will appear here in real time.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {activityItems.map((item) => {
                  const isSuccess = item.status === 'success';
                  const hasReduction = item.inputKb && item.outputKb && item.inputKb > item.outputKb;
                  const reductionPct = hasReduction
                    ? Math.round(((item.inputKb! - item.outputKb!) / item.inputKb!) * 100)
                    : 0;

                  return (
                    <div
                      key={item.id}
                      className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/80 px-3 rounded-lg transition-colors"
                    >
                      <div className="flex items-start sm:items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                            isSuccess
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {item.fileType === 'pdf' ? (
                            <FileText className="w-4 h-4" />
                          ) : (
                            <ImageIcon className="w-4 h-4" />
                          )}
                        </div>

                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <Link
                              href={`/tools/${item.tool}`}
                              target="_blank"
                              className="text-xs font-bold text-gray-900 hover:text-[#414FA8] hover:underline"
                            >
                              {item.toolName || item.tool}
                            </Link>
                            <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                              {item.fileType || 'file'}
                            </span>
                            {isSuccess ? (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Target Achieved
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-700 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> {item.errorMessage || 'Failed'}
                              </span>
                            )}
                          </div>

                          {/* Size reduction info */}
                          {isSuccess && item.inputKb && item.outputKb ? (
                            <div className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                              <span className="line-through text-gray-400">{formatSize(item.inputKb)}</span>
                              <ArrowRight className="w-3 h-3 text-gray-400" />
                              <span className="font-bold text-gray-800">{formatSize(item.outputKb)}</span>
                              {reductionPct > 0 && (
                                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                                  -{reductionPct}%
                                </span>
                              )}
                              {item.targetKb && item.targetKb > 0 && (
                                <span className="text-[11px] text-gray-400">
                                  (Target: {item.targetKb} KB)
                                </span>
                              )}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:text-right shrink-0">
                        {item.downloaded ? (
                          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded flex items-center gap-1">
                            <Download className="w-3.5 h-3.5" /> Downloaded ✅
                          </span>
                        ) : (
                          <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                            Ready to download
                          </span>
                        )}
                        <span className="text-[11px] text-gray-400 min-w-[55px] text-right">
                          {formatTimeAgo(item.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Tool-by-Tool Table */}
        {activeTab === 'tools' && (
          <div className="p-4 sm:p-5">
            <div className="mb-4 flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tool by name or slug..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414FA8]"
                />
              </div>
              <div className="text-xs text-gray-500">
                Sorted by most active tools in <span className="font-bold text-gray-700">{activeRange}</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 uppercase border-y border-gray-200">
                    <th className="py-2.5 px-3 font-semibold">Tool Name</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Category</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Processed</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Downloads</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Conversion</th>
                    <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTools.filter(t => t.uses > 0).map((tool) => (
                    <tr key={tool.slug} className="hover:bg-gray-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <Link
                          href={`/tools/${tool.slug}`}
                          target="_blank"
                          className="font-bold text-gray-900 hover:text-[#414FA8] flex items-center gap-1.5"
                        >
                          {tool.name}
                          <ChevronRight className="w-3 h-3 text-gray-400" />
                        </Link>
                        <span className="text-[10px] text-gray-400 block font-mono mt-0.5">
                          /tools/{tool.slug}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="text-[11px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          {tool.category}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-gray-900">
                        {tool.uses.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-purple-700">
                        {tool.downloads.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-bold">
                        <span className={tool.conversionRate >= 70 ? 'text-emerald-700' : 'text-gray-700'}>
                          {tool.conversionRate}%
                        </span>
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            tool.status === 'Healthy'
                              ? 'bg-emerald-50 text-emerald-700'
                              : tool.status === 'Moderate'
                              ? 'bg-amber-50 text-amber-700'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {tool.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredTools.filter(t => t.uses > 0).length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        No active tools recorded in this time range.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
