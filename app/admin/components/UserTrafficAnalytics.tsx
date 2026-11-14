'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import Link from 'next/link';
import {
  Users,
  Eye,
  Wrench,
  Download,
  RefreshCw,
  Globe,
  Sparkles,
  ArrowUpRight,
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  Activity,
} from 'lucide-react';
import {
  getTrafficAnalyticsReport,
  type TimeRange,
  type TrafficReport,
} from '@/lib/traffic-analytics';

export function UserTrafficAnalytics() {
  const [timeframe, setTimeframe] = useState<TimeRange>('24h');
  const [report, setReport] = useState<TrafficReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [hoveredBucket, setHoveredBucket] = useState<{
    label: string;
    visits: number;
    uniqueUsers: number;
  } | null>(null);

  const loadAnalytics = useCallback((selectedTf: TimeRange) => {
    setLoading(true);
    startTransition(async () => {
      try {
        const data = await getTrafficAnalyticsReport(selectedTf);
        setReport(data);
        setLastRefreshed(new Date());
      } catch (err) {
        console.error('Failed to load traffic analytics:', err);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    loadAnalytics(timeframe);
  }, [timeframe, loadAnalytics]);

  const maxBucketVisits = report?.timeSeries.reduce((max, b) => Math.max(max, b.visits), 0) || 1;

  return (
    <div className="space-y-8">
      {/* 1. Header & Timeframe Filter Control Bar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-0.5 text-xs font-semibold text-indigo-700 border border-indigo-200">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Real-Time Visitor Telemetry</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              User Traffic &amp; Visitor Analytics
            </h2>
            <p className="text-sm text-slate-600">
              Live monitoring of users arriving, pages viewed, and tool actions across SizeSnap.
            </p>
          </div>

          {/* Timeframe Filter Buttons: 24hr, 30 day, 3 month */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setTimeframe('24h')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  timeframe === '24h'
                    ? 'bg-indigo-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                24 Hours
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('30d')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  timeframe === '30d'
                    ? 'bg-indigo-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                30 Days
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('3m')}
                className={`px-3.5 py-1.5 rounded-lg transition-all ${
                  timeframe === '3m'
                    ? 'bg-indigo-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3 Months
              </button>
            </div>

            <button
              type="button"
              disabled={loading || isPending}
              onClick={() => loadAnalytics(timeframe)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading || isPending ? 'animate-spin text-indigo-600' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Active Filter: <strong>{report?.timeframeLabel || '24 Hours'}</strong></span>
          </span>
          <span>Last sync: {lastRefreshed.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
        </div>
      </div>

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Unique Users */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Unique Users</span>
            <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="font-mono text-3xl font-extrabold text-slate-900 tabular-nums">
            {report?.uniqueVisitors ?? 0}
          </p>
          <p className="text-xs text-slate-500">
            Distinct visitor devices arriving on site
          </p>
        </div>

        {/* Metric 2: Total Page Visits */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Page Visits</span>
            <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Eye className="h-5 w-5" />
            </div>
          </div>
          <p className="font-mono text-3xl font-extrabold text-emerald-700 tabular-nums">
            {report?.totalVisits ?? 0}
          </p>
          <p className="text-xs text-slate-500">
            Total page hits logged in this window
          </p>
        </div>

        {/* Metric 3: Tool Actions */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tool Uses</span>
            <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Wrench className="h-5 w-5" />
            </div>
          </div>
          <p className="font-mono text-3xl font-extrabold text-amber-600 tabular-nums">
            {report?.totalToolUses ?? 0}
          </p>
          <p className="text-xs text-slate-500">
            Total processing actions performed
          </p>
        </div>

        {/* Metric 4: Total Downloads */}
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Downloads</span>
            <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
              <Download className="h-5 w-5" />
            </div>
          </div>
          <p className="font-mono text-3xl font-extrabold text-purple-700 tabular-nums">
            {report?.totalDownloads ?? 0}
          </p>
          <p className="text-xs text-slate-500">
            Files downloaded by visitors
          </p>
        </div>
      </div>

      {/* 3. Interactive Visual Traffic Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Visitor Traffic Trend
            </h3>
            <p className="text-xs text-slate-500">
              Activity progression across {report?.timeframeLabel}
            </p>
          </div>

          {/* Legend / Hover display */}
          <div className="flex items-center gap-4 text-xs">
            {hoveredBucket ? (
              <div className="rounded-lg bg-slate-900 text-white px-3 py-1 flex items-center gap-3 font-mono">
                <span className="font-semibold text-amber-400">{hoveredBucket.label}:</span>
                <span>Visits: <strong>{hoveredBucket.visits}</strong></span>
                <span>Users: <strong>{hoveredBucket.uniqueUsers}</strong></span>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-indigo-600" />
                  <span>Total Pageviews</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-3 w-3 rounded bg-amber-500" />
                  <span>Unique Users</span>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-4 pb-2 border-b border-slate-100">
          <div className="h-44 w-full flex items-end gap-1 sm:gap-2">
            {report?.timeSeries && report.timeSeries.length > 0 ? (
              report.timeSeries.map((bucket, idx) => {
                const heightPct = Math.max(
                  Math.round((bucket.visits / maxBucketVisits) * 100),
                  bucket.visits > 0 ? 8 : 2
                );
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredBucket(bucket)}
                    onMouseLeave={() => setHoveredBucket(null)}
                    className="flex-1 h-full flex flex-col justify-end items-center group cursor-pointer"
                  >
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full max-w-[28px] rounded-t-sm transition-all duration-300 ${
                        bucket.visits > 0
                          ? 'bg-gradient-to-t from-indigo-700 to-indigo-500 group-hover:from-amber-600 group-hover:to-amber-500'
                          : 'bg-slate-100'
                      }`}
                    />
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                Listening for visits... Browse any page to log telemetry.
              </div>
            )}
          </div>

          {/* X-Axis Labels */}
          <div className="flex justify-between pt-2 text-[10px] sm:text-xs text-slate-400 font-mono">
            <span>{report?.timeSeries[0]?.label || 'Start'}</span>
            <span>{report?.timeSeries[Math.floor((report?.timeSeries.length || 0) / 2)]?.label || 'Mid'}</span>
            <span>{report?.timeSeries[(report?.timeSeries.length || 1) - 1]?.label || 'Now'}</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 italic">
          Tip: Hover over any vertical bar to inspect exact visit counts and unique user volume for that interval.
        </p>
      </div>

      {/* 4. Two-Column Analytics: Top Visited Pages & Device Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Top Pages Visited */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Top Visited Pages &amp; Tools
              </h3>
              <p className="text-xs text-slate-500">Most engaged URLs within {report?.timeframeLabel}</p>
            </div>
            <Globe className="h-4 w-4 text-slate-400" />
          </div>

          {report?.topPages && report.topPages.length > 0 ? (
            <div className="space-y-3">
              {report.topPages.map((page, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate max-w-[70%]">
                      <span className="font-mono text-slate-400 text-[11px] w-4">{idx + 1}.</span>
                      <Link
                        href={page.path}
                        target="_blank"
                        className="font-medium text-indigo-700 hover:underline truncate"
                      >
                        {page.path === '/' ? '/ (Home)' : page.path}
                      </Link>
                    </div>
                    <div className="font-mono text-slate-600">
                      <strong>{page.visits}</strong> visits ({page.percentage}%)
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${page.percentage}%` }}
                      className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-indigo-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center">
              No page visits recorded in this timeframe yet.
            </p>
          )}
        </div>

        {/* Right: Device Breakdown */}
        <div className="lg:col-span-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Device Breakdown
            </h3>
            <p className="text-xs text-slate-500">Hardware categories used by visitors</p>
          </div>

          {/* Devices Progress */}
          <div className="space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Monitor className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Desktop</span>
                </span>
                <span className="font-mono text-slate-600">
                  {report?.deviceBreakdown.desktop} ({report?.deviceBreakdown.desktopPct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${report?.deviceBreakdown.desktopPct}%` }}
                  className="h-full rounded-full bg-indigo-600"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Smartphone className="h-3.5 w-3.5 text-amber-500" />
                  <span>Mobile</span>
                </span>
                <span className="font-mono text-slate-600">
                  {report?.deviceBreakdown.mobile} ({report?.deviceBreakdown.mobilePct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${report?.deviceBreakdown.mobilePct}%` }}
                  className="h-full rounded-full bg-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-700">
                  <Tablet className="h-3.5 w-3.5 text-purple-600" />
                  <span>Tablet</span>
                </span>
                <span className="font-mono text-slate-600">
                  {report?.deviceBreakdown.tablet} ({report?.deviceBreakdown.tabletPct}%)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${report?.deviceBreakdown.tabletPct}%` }}
                  className="h-full rounded-full bg-purple-600"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2">
            <span className="text-xs font-semibold text-slate-700 block">Performance Conversion</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-lg bg-white border border-slate-200 p-2.5">
                <p className="text-slate-500 text-[11px]">Tool Uses</p>
                <p className="font-mono text-lg font-bold text-indigo-700">{report?.totalToolUses ?? 0}</p>
              </div>
              <div className="rounded-lg bg-white border border-slate-200 p-2.5">
                <p className="text-slate-500 text-[11px]">Downloads</p>
                <p className="font-mono text-lg font-bold text-emerald-700">{report?.totalDownloads ?? 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Recent Live Visitor Stream Table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Recent Live Visitor Stream
            </h3>
            <p className="text-xs text-slate-500">
              Latest individual page hits received in real-time
            </p>
          </div>
          <Clock className="h-4 w-4 text-slate-400" />
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Page / Tool Visited</th>
                <th className="px-4 py-3">Visitor Identity</th>
                <th className="px-4 py-3">Device</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {report?.recentVisits && report.recentVisits.length > 0 ? (
                report.recentVisits.map((visit) => {
                  const visitDate = new Date(visit.timestamp);
                  return (
                    <tr key={visit.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">
                        {visitDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                      <td className="px-4 py-2.5 font-sans font-medium text-indigo-700">
                        <Link href={visit.path} target="_blank" className="hover:underline flex items-center gap-1">
                          <span>{visit.path}</span>
                          <ArrowUpRight className="h-3 w-3 text-slate-400" />
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 font-sans text-slate-600">
                        <span className="text-xs">
                          Visitor ({visit.visitorId.slice(-6)})
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase text-[10px] font-bold">
                          {visit.device === 'mobile' ? (
                            <Smartphone className="h-3 w-3 text-amber-500" />
                          ) : visit.device === 'tablet' ? (
                            <Tablet className="h-3 w-3 text-purple-600" />
                          ) : (
                            <Monitor className="h-3 w-3 text-indigo-600" />
                          )}
                          <span>{visit.device}</span>
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-slate-400 font-sans">
                    No visitor logs recorded in this timeframe yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
