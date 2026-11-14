'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import Link from 'next/link';
import {
  Users,
  Eye,
  Wrench,
  Download,
  RefreshCw,
  ArrowUpRight,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react';
import {
  getTrafficAnalyticsReport,
  type TimeRange,
  type TrafficReport,
} from '@/lib/traffic-analytics';

const TIMEFRAMES: { key: TimeRange; label: string }[] = [
  { key: '24h', label: '24 Hours' },
  { key: '7d', label: '7 Days' },
  { key: '30d', label: '30 Days' },
  { key: '3m', label: '90 Days' },
];

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

  const maxBucketVisits =
    report?.timeSeries.reduce((max, b) => Math.max(max, b.visits), 0) || 1;

  return (
    <div className="space-y-6">
      {/* 1. Executive Header & Segmented Timeframe Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Traffic &amp; Conversion Overview
          </h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 tabular-nums">
            <span>Window: {report?.timeframeLabel || 'Last 24 Hours'}</span>
            <span aria-hidden="true">·</span>
            <span>
              Updated{' '}
              {lastRefreshed.toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex p-1 rounded-lg bg-slate-100 border border-slate-200">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.key}
                type="button"
                onClick={() => {
                  setLoading(true);
                  setTimeframe(tf.key);
                }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                  timeframe === tf.key
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            disabled={loading || isPending}
            onClick={() => {
              setLoading(true);
              loadAnalytics(timeframe);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors disabled:opacity-50 cursor-pointer whitespace-nowrap"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                loading || isPending ? 'animate-spin text-slate-900' : 'text-slate-500'
              }`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. Primary 4-Column KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Unique Visitors</span>
            <Users className="h-4 w-4 text-slate-400" />
          </div>
          <p className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {loading && !report ? '—' : (report?.uniqueVisitors ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">Distinct browser sessions</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Total Pageviews</span>
            <Eye className="h-4 w-4 text-slate-400" />
          </div>
          <p className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {loading && !report ? '—' : (report?.totalVisits ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500">Total route hits logged</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Files Processed</span>
            <Wrench className="h-4 w-4 text-slate-400" />
          </div>
          <p className="font-mono text-2xl sm:text-3xl font-bold text-slate-900 tabular-nums">
            {loading && !report ? '—' : (report?.totalToolUses ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 tabular-nums">
            {report?.totalErrors ?? 0} client errors recorded
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Files Downloaded</span>
            <Download className="h-4 w-4 text-slate-400" />
          </div>
          <p className="font-mono text-2xl sm:text-3xl font-bold text-emerald-700 tabular-nums">
            {loading && !report ? '—' : (report?.totalDownloads ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-slate-500 tabular-nums">
            {report?.conversionRatePct ?? 0}% download conversion rate
          </p>
        </div>
      </div>

      {/* 3. Traffic Trend Bar Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-900">Visitor Traffic Trend</h2>
            <p className="text-xs text-slate-500">
              Pageview distribution across {report?.timeframeLabel || 'selected window'}
            </p>
          </div>

          <div className="text-xs font-mono tabular-nums text-slate-600">
            {hoveredBucket ? (
              <span>
                <strong>{hoveredBucket.label}</strong> · {hoveredBucket.visits} views ·{' '}
                {hoveredBucket.uniqueUsers} unique visitors
              </span>
            ) : (
              <span className="text-slate-400">Hover any bar to inspect interval volume</span>
            )}
          </div>
        </div>

        <div className="pt-2 pb-2 border-b border-slate-100">
          <div className="h-40 w-full flex items-end gap-1 sm:gap-1.5">
            {report?.timeSeries && report.timeSeries.length > 0 ? (
              report.timeSeries.map((bucket, idx) => {
                const heightPct = Math.max(
                  Math.round((bucket.visits / maxBucketVisits) * 100),
                  bucket.visits > 0 ? 8 : 3
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
                      className={`w-full max-w-[26px] rounded-t transition-opacity ${
                        bucket.visits > 0
                          ? 'bg-slate-900 group-hover:bg-indigo-600'
                          : 'bg-slate-100'
                      }`}
                    />
                  </div>
                );
              })
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                No traffic intervals recorded yet.
              </div>
            )}
          </div>

          <div className="flex justify-between pt-2 text-[11px] text-slate-400 font-mono tabular-nums">
            <span>{report?.timeSeries[0]?.label || 'Start'}</span>
            <span>
              {report?.timeSeries[Math.floor((report?.timeSeries.length || 0) / 2)]?.label || 'Mid'}
            </span>
            <span>{report?.timeSeries[(report?.timeSeries.length || 1) - 1]?.label || 'Now'}</span>
          </div>
        </div>
      </div>

      {/* 4. Two-Column Split: Top Visited Pages & Device Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Top Visited Pages</h2>
              <p className="text-xs text-slate-500">Most viewed routes in {report?.timeframeLabel}</p>
            </div>
            <span className="text-xs text-slate-400 font-mono tabular-nums">
              Top {report?.topPages.length || 0}
            </span>
          </div>

          {report?.topPages && report.topPages.length > 0 ? (
            <div className="space-y-3">
              {report.topPages.map((page, idx) => (
                <div key={page.path} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate max-w-[70%]">
                      <span className="font-mono text-slate-400 text-[11px] w-5 tabular-nums">
                        {idx + 1}.
                      </span>
                      <Link
                        href={page.path}
                        target="_blank"
                        className="font-medium text-slate-900 hover:text-indigo-600 hover:underline truncate"
                      >
                        {page.path === '/' ? '/ (Homepage)' : page.path}
                      </Link>
                    </div>
                    <div className="font-mono text-slate-600 tabular-nums">
                      <strong>{page.visits.toLocaleString()}</strong> · {page.percentage}%
                    </div>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      style={{ width: `${page.percentage}%` }}
                      className="h-full rounded-full bg-slate-800"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-8 text-center">
              No pageviews recorded in this timeframe yet.
            </p>
          )}
        </div>

        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Device Distribution</h2>
              <p className="text-xs text-slate-500">Visitor client breakdown</p>
            </div>

            <div className="space-y-3.5">
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Smartphone className="h-3.5 w-3.5 text-slate-500" />
                    <span>Mobile</span>
                  </span>
                  <span className="font-mono text-slate-600 tabular-nums">
                    {report?.deviceBreakdown.mobile ?? 0} ({report?.deviceBreakdown.mobilePct ?? 0}%)
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${report?.deviceBreakdown.mobilePct ?? 0}%` }}
                    className="h-full rounded-full bg-slate-900"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Monitor className="h-3.5 w-3.5 text-slate-500" />
                    <span>Desktop</span>
                  </span>
                  <span className="font-mono text-slate-600 tabular-nums">
                    {report?.deviceBreakdown.desktop ?? 0} ({report?.deviceBreakdown.desktopPct ?? 0}%)
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${report?.deviceBreakdown.desktopPct ?? 0}%` }}
                    className="h-full rounded-full bg-indigo-600"
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <Tablet className="h-3.5 w-3.5 text-slate-500" />
                    <span>Tablet</span>
                  </span>
                  <span className="font-mono text-slate-600 tabular-nums">
                    {report?.deviceBreakdown.tablet ?? 0} ({report?.deviceBreakdown.tabletPct ?? 0}%)
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    style={{ width: `${report?.deviceBreakdown.tabletPct ?? 0}%` }}
                    className="h-full rounded-full bg-slate-400"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Need full tool-by-tool diagnostics?</span>
            <Link
              href="/admin/tools"
              className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
            >
              Open Tools Catalog →
            </Link>
          </div>
        </div>
      </div>

      {/* 5. Top Performing Tools Table (Unified in Same Timeframe) */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Top Performing Tools</h2>
            <p className="text-xs text-slate-500">
              Ranked by processing volume in {report?.timeframeLabel || 'selected window'}
            </p>
          </div>
          <Link
            href="/admin/tools"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline whitespace-nowrap"
          >
            View All Tools →
          </Link>
        </div>

        {report?.topTools && report.topTools.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                  <th className="px-6 py-3">Tool Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Processed</th>
                  <th className="px-4 py-3 text-right">Downloads</th>
                  <th className="px-4 py-3 text-right">Conversion</th>
                  <th className="px-6 py-3 text-right">Errors</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {report.topTools.map((tool) => (
                  <tr key={tool.slug} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-900">
                      <Link
                        href={`/tools/${tool.slug}`}
                        target="_blank"
                        className="hover:text-indigo-600 hover:underline inline-flex items-center gap-1"
                      >
                        <span>{tool.name}</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400" />
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{tool.categoryTitle}</td>
                    <td className="px-4 py-3 text-right font-mono font-semibold text-slate-900 tabular-nums">
                      {tool.uses.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-emerald-700 font-semibold tabular-nums">
                      {tool.downloads.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-slate-600 tabular-nums">
                      {tool.conversionPct}%
                    </td>
                    <td className="px-6 py-3 text-right font-mono tabular-nums">
                      <span className={tool.errors > 0 ? 'text-rose-600 font-semibold' : 'text-slate-400'}>
                        {tool.errors}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-500">
            No tool processing sessions recorded in this timeframe.
          </div>
        )}
      </div>

      {/* 6. Recent Live Visitor Stream */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Recent Visitor Log</h2>
            <p className="text-xs text-slate-500">Latest 20 pageviews captured in real time</p>
          </div>
          <Link
            href="/admin/live-activity"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline whitespace-nowrap"
          >
            Live Conversion Stream →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-500 font-semibold">
                <th className="px-6 py-3">Time</th>
                <th className="px-4 py-3">Route Visited</th>
                <th className="px-4 py-3">Session ID</th>
                <th className="px-6 py-3 text-right">Device</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {report?.recentVisits && report.recentVisits.length > 0 ? (
                report.recentVisits.map((visit) => {
                  const visitDate = new Date(visit.timestamp);
                  return (
                    <tr key={visit.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-2.5 font-mono text-slate-500 whitespace-nowrap tabular-nums">
                        {visitDate.toLocaleTimeString('en-IN', {
                          hour: '2-digit',
                          minute: '2-digit',
                          second: '2-digit',
                        })}
                      </td>
                      <td className="px-4 py-2.5 font-medium text-slate-900">
                        <Link
                          href={visit.path}
                          target="_blank"
                          className="hover:text-indigo-600 hover:underline inline-flex items-center gap-1"
                        >
                          <span>{visit.path}</span>
                          <ArrowUpRight className="h-3 w-3 text-slate-400" />
                        </Link>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-slate-500 tabular-nums">
                        #{visit.visitorId.slice(-6)}
                      </td>
                      <td className="px-6 py-2.5 text-right text-slate-600 capitalize">
                        {visit.device}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-400">
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
