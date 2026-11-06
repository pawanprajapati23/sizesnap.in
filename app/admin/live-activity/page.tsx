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
  ArrowRight,
  Search,
  Zap,
  Clock,
  Flame,
  HelpCircle,
  Filter,
  X,
  ExternalLink,
  ChevronRight,
  Sparkles
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

export default function LiveActivityPage() {
  const [activeRange, setActiveRange] = useState<TimeRange>('24h');
  const [loading, setLoading] = useState<boolean>(true);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  
  // Data states
  const [activityItems, setActivityItems] = useState<LiveActivityItem[]>([]);
  const [totalUses, setTotalUses] = useState<number>(0);
  const [totalDownloads, setTotalDownloads] = useState<number>(0);
  const [totalErrors, setTotalErrors] = useState<number>(0);
  const [topToolsData, setTopToolsData] = useState<Array<{
    slug: string;
    name: string;
    uses: number;
    downloads: number;
    conversion: number;
  }>>([]);

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ready_to_download' | 'downloaded' | 'error'>('all');
  const [selectedToolFilter, setSelectedToolFilter] = useState<string | null>(null);
  const [displayLimit, setDisplayLimit] = useState<number>(100);

  const loadData = useCallback(async () => {
    try {
      const ms = rangeToMs(activeRange);
      const now = Date.now();

      // Fetch high volume without artificial 60-limit
      const [toolRecords, dlRecords, errRecords, allLiveLogs] = await Promise.all([
        fetchUsage('toolUsage'),
        fetchUsage('downloads'),
        fetchUsage('toolErrors'),
        fetchLiveActivity(2000)
      ]);

      const dlToolRecords = (toolRecords['_downloads'] ?? {}) as unknown as Record<string, Record<string, number>>;
      const errToolRecords = (toolRecords['_errors'] ?? {}) as unknown as Record<string, Record<string, number>>;

      let calculatedUses = 0;
      let calculatedErrs = 0;
      let calculatedToolDls = 0;

      // Filter activity items to the selected time window (default: all sessions within last 24h)
      const timeFilteredLogs = allLiveLogs.filter(item => (now - item.timestamp) <= ms);

      // Calculate aggregated metrics for all tools
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
            const toolMeta = ALL_TOOLS.find(t => t.slug === key);
            const toolName = toolMeta ? toolMeta.name : key.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
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

      const globalDls = aggregateWithin(dlRecords, ms);
      const effectiveDls = Math.max(globalDls, calculatedToolDls);

      // Sort tools by uses descending to pick top 5
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

  // Calculate Ready-To-Download vs Downloaded counts
  const readyToDownloadCount = useMemo(() => {
    return activityItems.filter(item => item.status === 'success' && !item.downloaded).length;
  }, [activityItems]);

  const downloadedSessionsCount = useMemo(() => {
    return activityItems.filter(item => item.downloaded).length;
  }, [activityItems]);

  // Drop-off Analysis: find which tool has the highest "Ready to Download" count
  const dropOffAnalysis = useMemo(() => {
    const countsByTool: Record<string, { tool: string; toolName: string; readyCount: number; downloadedCount: number }> = {};

    activityItems.forEach(item => {
      const key = item.tool || 'unknown';
      if (!countsByTool[key]) {
        const meta = ALL_TOOLS.find(t => t.slug === key);
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

    return {
      worstTool,
      top3DropOffs: sorted.filter(t => t.readyCount > 0).slice(0, 3),
    };
  }, [activityItems]);

  // Filtered live feed items
  const filteredItems = useMemo(() => {
    return activityItems.filter(item => {
      // Status filter
      if (statusFilter === 'ready_to_download') {
        if (!(item.status === 'success' && !item.downloaded)) return false;
      } else if (statusFilter === 'downloaded') {
        if (!item.downloaded) return false;
      } else if (statusFilter === 'error') {
        if (item.status !== 'error') return false;
      }

      // Tool filter
      if (selectedToolFilter && item.tool !== selectedToolFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTool = (item.tool && item.tool.toLowerCase().includes(q));
        const matchesName = (item.toolName && item.toolName.toLowerCase().includes(q));
        const matchesType = (item.fileType && item.fileType.toLowerCase().includes(q));
        if (!matchesTool && !matchesName && !matchesType) return false;
      }

      return true;
    });
  }, [activityItems, statusFilter, selectedToolFilter, searchQuery]);

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
              Live Activity Console
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time feed of all sessions, conversion tracking & drop-off diagnostics
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <FilterTabs active={activeRange} setActive={setActiveRange} />
          
          <button
            onClick={() => {
              setLoading(true);
              loadData();
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
            title="Refresh now"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#414FA8]' : ''}`} />
            Refresh
          </button>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-2 text-xs font-semibold rounded-lg transition-colors border cursor-pointer ${
              autoRefresh 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-gray-50 text-gray-600 border-gray-200'
            }`}
          >
            Auto 15s: {autoRefresh ? 'ON' : 'PAUSED'}
          </button>
        </div>
      </div>

      {/* 4 Interactive KPI Cards (Click to Filter) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Processed */}
        <button
          onClick={() => {
            setStatusFilter('all');
            setSelectedToolFilter(null);
          }}
          className={`text-left p-5 rounded-xl border transition-all cursor-pointer bg-white ${
            statusFilter === 'all' && !selectedToolFilter
              ? 'border-blue-500 ring-2 ring-blue-500/20 shadow-sm'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Processed</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-gray-900">{totalUses.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
              <span>All sessions in {activeRange}</span>
              <span className="text-[10px] text-blue-600 font-semibold">View All</span>
            </div>
          </div>
        </button>

        {/* Card 2: Interactive Ready to Download Box */}
        <button
          onClick={() => {
            setStatusFilter(statusFilter === 'ready_to_download' ? 'all' : 'ready_to_download');
          }}
          className={`text-left p-5 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'ready_to_download'
              ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-500/30 shadow-md'
              : 'bg-white border-amber-200 hover:border-amber-400 hover:bg-amber-50/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <span>Ready to Download</span>
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">{readyToDownloadCount.toLocaleString()}</div>
            <div className="text-xs text-amber-700/80 mt-1 flex items-center justify-between font-medium">
              <span>{statusFilter === 'ready_to_download' ? 'Active Filter: ON' : 'Click to filter'}</span>
              <span className="text-[10px] font-bold underline">Filter List →</span>
            </div>
          </div>
        </button>

        {/* Card 3: Downloads Saved */}
        <button
          onClick={() => {
            setStatusFilter(statusFilter === 'downloaded' ? 'all' : 'downloaded');
          }}
          className={`text-left p-5 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'downloaded'
              ? 'bg-purple-50/80 border-purple-500 ring-2 ring-purple-500/30 shadow-md'
              : 'bg-white border-gray-200 hover:border-purple-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Downloads Saved</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-600">{totalDownloads.toLocaleString()}</div>
            <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
              <span>{downloadedSessionsCount} in live log</span>
              <span className="text-[10px] text-purple-600 font-semibold">Filter →</span>
            </div>
          </div>
        </button>

        {/* Card 4: Failed / Errors */}
        <button
          onClick={() => {
            setStatusFilter(statusFilter === 'error' ? 'all' : 'error');
          }}
          className={`text-left p-5 rounded-xl border transition-all cursor-pointer ${
            statusFilter === 'error'
              ? 'bg-red-50/80 border-red-500 ring-2 ring-red-500/30 shadow-md'
              : 'bg-white border-gray-200 hover:border-red-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Errors / Failed</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${totalErrors > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {totalErrors > 0 ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl sm:text-3xl font-extrabold ${totalErrors > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {totalErrors}
            </div>
            <div className="text-xs text-gray-500 mt-1 flex items-center justify-between">
              <span>{totalErrors === 0 ? 'All 100% healthy' : 'View failed'}</span>
              {totalErrors > 0 && <span className="text-[10px] text-red-600 font-semibold">Filter →</span>}
            </div>
          </div>
        </button>
      </div>

      {/* Top 5 Most Used Tools Leaderboard */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
              Top 5 Most Used Tools ({activeRange})
            </h2>
          </div>
          <span className="text-xs text-gray-500 font-medium">
            Ranked by total session submissions
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {topToolsData.length === 0 ? (
            <div className="col-span-full py-6 text-center text-xs text-gray-400">
              No tool usage recorded in this time range.
            </div>
          ) : (
            topToolsData.map((tool, idx) => {
              const isSelected = selectedToolFilter === tool.slug;
              return (
                <div
                  key={tool.slug}
                  className={`p-3.5 rounded-lg border transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#414FA8] bg-[#EEF1FB]/60 ring-1 ring-[#414FA8]'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        idx === 0 
                          ? 'bg-amber-400 text-amber-950 font-black' 
                          : idx === 1 
                          ? 'bg-slate-300 text-slate-800' 
                          : idx === 2 
                          ? 'bg-amber-700/20 text-amber-800' 
                          : 'bg-gray-200 text-gray-700'
                      }`}>
                        #{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                        {tool.conversion}% saved
                      </span>
                    </div>

                    <Link
                      href={`/tools/${tool.slug}`}
                      target="_blank"
                      className="text-xs font-bold text-gray-900 hover:text-[#414FA8] line-clamp-2 leading-tight"
                      title={tool.name}
                    >
                      {tool.name}
                    </Link>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-gray-200/80 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-gray-800">{tool.uses.toLocaleString()}</span>
                      <span className="text-[10px] text-gray-400 ml-1">uses</span>
                    </div>
                    <button
                      onClick={() => {
                        setSelectedToolFilter(isSelected ? null : tool.slug);
                      }}
                      className="text-[10px] font-semibold text-[#414FA8] hover:underline cursor-pointer"
                    >
                      {isSelected ? 'Clear Filter' : 'Filter feed'}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Drop-off Diagnostic: Most Ready-To-Download Without Saving Tool */}
      {dropOffAnalysis.worstTool && (
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50 border border-amber-300 rounded-xl p-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded bg-amber-500 text-white">
                    Drop-off Diagnostic Insight
                  </span>
                  <span className="text-xs font-semibold text-amber-900">
                    Highest Pending Downloads Found
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mt-1">
                  ⚠️ &quot;{dropOffAnalysis.worstTool.toolName}&quot; has {dropOffAnalysis.worstTool.readyCount} sessions stuck at &quot;Ready to download&quot;
                </h3>
                <p className="text-xs text-gray-600 mt-1 max-w-2xl leading-relaxed">
                  Iska matlab users ne photo/document process kiya lekin download button save nahi kiya. 
                  Check karein ki download button par click tracking ya output preview user ko theek se samajh aa raha hai ya nahi.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setSelectedToolFilter(dropOffAnalysis.worstTool!.tool);
                  setStatusFilter('ready_to_download');
                }}
                className="px-3.5 py-2 text-xs font-bold rounded-lg bg-amber-600 hover:bg-amber-700 text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <span>Filter &quot;{dropOffAnalysis.worstTool.tool}&quot;</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>

              <Link
                href={`/tools/${dropOffAnalysis.worstTool.tool}`}
                target="_blank"
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 transition-colors flex items-center gap-1"
              >
                <span>Open Tool</span>
                <ExternalLink className="w-3 h-3 text-amber-700" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Real-time Live Document Stream (All Sessions Without 60 Limit) */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Stream Header & Active Filters Bar */}
        <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-50/70 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#414FA8]" />
              <h2 className="text-sm font-bold text-gray-900">
                Recent Document Sessions ({activeRange})
              </h2>
              <span className="bg-[#EEF1FB] text-[#414FA8] text-xs px-2.5 py-0.5 rounded-full font-bold">
                {filteredItems.length} {filteredItems.length === 1 ? 'Session' : 'Sessions'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tool name or format..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414FA8]"
                />
              </div>
              <span className="text-[11px] text-gray-400 shrink-0 hidden sm:inline">
                Live: {lastRefreshed.toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Quick Filter Pills Row */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-200/60">
            <span className="text-[11px] font-semibold text-gray-400 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Filter by:
            </span>

            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All ({activityItems.length})
            </button>

            <button
              onClick={() => setStatusFilter('ready_to_download')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                statusFilter === 'ready_to_download'
                  ? 'bg-amber-500 text-white'
                  : 'bg-amber-100/70 text-amber-800 hover:bg-amber-100'
              }`}
            >
              <span>Ready to Download</span>
              <span className="text-[10px] px-1 py-0.2 rounded-full bg-white/20 font-bold">
                {readyToDownloadCount}
              </span>
            </button>

            <button
              onClick={() => setStatusFilter('downloaded')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
                statusFilter === 'downloaded'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-100/70 text-purple-800 hover:bg-purple-100'
              }`}
            >
              <span>Downloaded</span>
              <span className="text-[10px] px-1 py-0.2 rounded-full bg-white/20 font-bold">
                {downloadedSessionsCount}
              </span>
            </button>

            {selectedToolFilter && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold bg-indigo-100 text-indigo-800 border border-indigo-200">
                <span>Tool: {selectedToolFilter}</span>
                <button
                  onClick={() => setSelectedToolFilter(null)}
                  className="hover:text-indigo-950 cursor-pointer ml-1"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {(statusFilter !== 'all' || selectedToolFilter || searchQuery) && (
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setSelectedToolFilter(null);
                  setSearchQuery('');
                }}
                className="text-[11px] text-gray-500 hover:text-red-600 underline ml-auto cursor-pointer"
              >
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Live List */}
        <div className="p-4 sm:p-5">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3 animate-pulse" />
              <h3 className="text-sm font-bold text-gray-700">No matching sessions found</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                {statusFilter !== 'all' || selectedToolFilter || searchQuery
                  ? 'Try clearing active filters to see all recorded sessions.'
                  : 'As users resize photos or compress PDFs on SizeSnap, incoming activities will appear here automatically.'}
              </p>
              {(statusFilter !== 'all' || selectedToolFilter || searchQuery) && (
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setSelectedToolFilter(null);
                    setSearchQuery('');
                  }}
                  className="mt-3 px-3 py-1.5 text-xs font-semibold bg-[#414FA8] text-white rounded-lg hover:bg-[#343f87]"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="divide-y divide-gray-100">
                {filteredItems.slice(0, displayLimit).map((item) => {
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
                          className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
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
                              {item.targetKb && item.targetKb > 0 ? (
                                <span className="text-[11px] text-gray-400">
                                  (Target: {item.targetKb} KB)
                                </span>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:text-right shrink-0">
                        {item.downloaded ? (
                          <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded flex items-center gap-1 border border-purple-200">
                            <Download className="w-3.5 h-3.5" /> Downloaded ✅
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                            Ready to download
                          </span>
                        )}
                        <span className="text-[11px] text-gray-400 min-w-[55px] text-right font-medium">
                          {formatTimeAgo(item.timestamp)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Show more button if list exceeds display limit */}
              {filteredItems.length > displayLimit && (
                <div className="pt-4 text-center border-t border-gray-100">
                  <button
                    onClick={() => setDisplayLimit(prev => prev + 100)}
                    className="px-4 py-2 text-xs font-bold text-[#414FA8] bg-[#EEF1FB] hover:bg-[#dfe5f8] rounded-lg transition-colors cursor-pointer"
                  >
                    Load More Sessions ({filteredItems.length - displayLimit} remaining)
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
