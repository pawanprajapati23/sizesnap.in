'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import FilterTabs, { TimeRange } from '@/app/admin/components/FilterTabs';
import { fetchUsage, aggregateWithin, fetchLiveActivity, type LiveActivityItem } from '@/lib/firebase';
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
  Clock
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
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadData = useCallback(async () => {
    try {
      const ms = rangeToMs(activeRange);

      const [toolRecords, dlRecords, errRecords, liveLogs] = await Promise.all([
        fetchUsage('toolUsage'),
        fetchUsage('downloads'),
        fetchUsage('toolErrors'),
        fetchLiveActivity(60)
      ]);

      const dlToolRecords = (toolRecords['_downloads'] ?? {}) as unknown as Record<string, Record<string, number>>;
      const errToolRecords = (toolRecords['_errors'] ?? {}) as unknown as Record<string, Record<string, number>>;

      let calculatedUses = 0;
      let calculatedErrs = 0;
      let calculatedToolDls = 0;

      for (const [key, value] of Object.entries(toolRecords)) {
        if (key.startsWith('_')) continue;
        if (typeof value === 'object' && value) {
          calculatedUses += aggregateWithin(value as unknown as Record<string, number>, ms);
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

      setTotalUses(calculatedUses);
      setTotalDownloads(effectiveDls);
      setTotalErrors(calculatedErrs);
      setActivityItems(liveLogs);
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

  // Filtered live feed items
  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return activityItems;
    const q = searchQuery.toLowerCase();
    return activityItems.filter(item => 
      (item.tool && item.tool.toLowerCase().includes(q)) ||
      (item.toolName && item.toolName.toLowerCase().includes(q)) ||
      (item.fileType && item.fileType.toLowerCase().includes(q))
    );
  }, [activityItems, searchQuery]);

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
              Live Activity
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Real-time feed of files resized, compressed & downloaded by users
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

      {/* 3 Clean KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
            <div className="text-xs text-gray-500 mt-1">
              Files submitted across {activeRange}
            </div>
          </div>
        </div>

        {/* Card 2: Downloads Completed */}
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
              Users downloaded final document
            </div>
          </div>
        </div>

        {/* Card 3: Errors */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Failed / Errors</span>
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${totalErrors > 0 ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
              {totalErrors > 0 ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
          </div>
          <div className="mt-3">
            <div className={`text-2xl sm:text-3xl font-extrabold ${totalErrors > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {totalErrors}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {totalErrors === 0 ? 'All tools running smoothly' : `${totalErrors} issue(s) reported`}
            </div>
          </div>
        </div>
      </div>

      {/* Main Real-time Live Document Stream */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Stream Header & Search */}
        <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-50/70 flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#414FA8]" />
            <h2 className="text-sm font-bold text-gray-900">
              Recent Document Sessions
            </h2>
            <span className="bg-[#EEF1FB] text-[#414FA8] text-xs px-2 py-0.5 rounded-full font-bold">
              {filteredItems.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search tool name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#414FA8]"
              />
            </div>
            <span className="text-[11px] text-gray-400 shrink-0 hidden sm:inline">
              Refreshed: {lastRefreshed.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Live List */}
        <div className="p-4 sm:p-5">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center">
              <Activity className="w-10 h-10 text-gray-300 mx-auto mb-3 animate-pulse" />
              <h3 className="text-sm font-bold text-gray-700">Waiting for live sessions...</h3>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                As users resize photos or compress PDFs on SizeSnap, incoming activities will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredItems.map((item) => {
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
                        <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-1 rounded flex items-center gap-1">
                          <Download className="w-3.5 h-3.5" /> Downloaded ✅
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
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
          )}
        </div>
      </div>
    </div>
  );
}
