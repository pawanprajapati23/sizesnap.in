'use client';
import { useState } from 'react';

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
      if (!res.ok) throw new Error('Health check endpoint failed');
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
    setLoading(false);
  };

  return (
    <section className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">🩺 Technical Site Health</h1>
          <p className="text-sm text-gray-500 mt-1">On-demand production health check. Pings important routes and random tools.</p>
        </div>
        <button
          onClick={runHealthCheck}
          disabled={loading}
          className="px-4 py-2 bg-[#414FA8] text-white text-sm font-medium rounded shadow hover:bg-[#323d83] disabled:opacity-50 transition"
        >
          {loading ? 'Checking...' : 'Run Health Check'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-md mb-6">
          <strong className="font-semibold">Error:</strong> {error}
        </div>
      )}

      {!data && !loading && !error && (
        <div className="bg-white p-12 text-center border border-gray-200 rounded-xl shadow-sm">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
             <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <p className="font-medium text-gray-900 mb-1">Health check has not been run yet.</p>
          <p className="text-sm text-gray-500">Click the button above to run a fresh production health check.</p>
        </div>
      )}

      {data && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 text-sm text-gray-600 flex justify-between items-center">
            <span>Last checked: {new Date(data.timestamp).toLocaleString()}</span>
            <span className="font-medium">
               {data.results.filter(r => r.healthy).length} / {data.results.length} Healthy
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white border-b border-gray-100">
                <tr>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase">Route</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase text-center">Status</th>
                  <th className="p-4 text-xs font-bold text-gray-500 uppercase text-right">Latency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.results.map((r, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="p-4 text-sm font-medium text-gray-900 font-mono">
                      {r.route}
                    </td>
                    <td className="p-4 text-center">
                       {r.healthy ? (
                         <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800">
                           {r.status} OK
                         </span>
                       ) : (
                         <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                           {r.status} Error
                         </span>
                       )}
                    </td>
                    <td className="p-4 text-sm text-gray-600 text-right font-mono">
                      {r.ms}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
