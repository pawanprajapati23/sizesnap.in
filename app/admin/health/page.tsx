'use client';

import { useState } from 'react';
import { Play, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

type HealthResult = {
  route: string;
  status: number;
  healthy: boolean;
  ms: number;
  error?: string;
};

type HealthCheckResponse = {
  timestamp: number;
  results: HealthResult[];
};

export default function SiteHealthPage() {
  const [data, setData] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runHealthCheck = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/admin/health-check');
      if (!res.ok) throw new Error('Health check endpoint returned an error');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Route Latency &amp; Health Probe
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            On-demand HTTP HEAD verification across core hubs, sitemaps, and random canonical tools
          </p>
        </div>

        <button
          type="button"
          onClick={runHealthCheck}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg disabled:opacity-50 transition-colors cursor-pointer whitespace-nowrap"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Probing Routes...</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5" />
              <span>Run Health Probe</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-medium">
          Error: {error}
        </div>
      )}

      {!data && !loading && !error && (
        <div className="bg-white p-12 text-center border border-slate-200 rounded-xl space-y-2">
          <p className="text-sm font-semibold text-slate-900">Ready to probe live routes</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click &ldquo;Run Health Probe&rdquo; above to measure HTTP status codes and response latency across key routes.
          </p>
        </div>
      )}

      {data && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 bg-slate-50/70 border-b border-slate-200 text-xs text-slate-600 flex justify-between items-center tabular-nums">
            <span>Probed at {new Date(data.timestamp).toLocaleTimeString('en-IN')}</span>
            <span className="font-mono font-semibold text-slate-900">
              {data.results.filter((r) => r.healthy).length} / {data.results.length} Passing (200 OK)
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-white border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="px-6 py-3">Route Path</th>
                  <th className="px-4 py-3">HTTP Status</th>
                  <th className="px-6 py-3 text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.results.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-3 font-mono font-medium text-slate-900">{r.route}</td>
                    <td className="px-4 py-3">
                      {r.healthy ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold font-mono tabular-nums">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{r.status} OK</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-600 font-semibold font-mono tabular-nums">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>{r.status} Error</span>
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-600 text-right font-mono tabular-nums">
                      {r.ms} ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
