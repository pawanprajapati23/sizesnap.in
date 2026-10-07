'use client';
import React, { useState } from 'react';
import { DollarSign, Eye, MousePointerClick, TrendingUp, Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import { fetchAdsterraStats } from './actions';

export default function AdsAdminPage() {
  const [stats, setStats] = useState<{data?: any, error?: string} | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetchData = async () => {
    setLoading(true);
    setStats(null);
    try {
      const result = await fetchAdsterraStats();
      setStats(result);
    } catch (err: any) {
      setStats({ error: err.message || 'Failed to fetch data' });
    } finally {
      setLoading(false);
    }
  };

  // Calculate aggregate metrics
  let totalRevenue = 0;
  let totalImpressions = 0;
  let totalClicks = 0;
  let avgCpm = 0;
  let dataRows: any[] = [];
  
  if (stats && !stats.error && stats.data) {
    const rawItems = Array.isArray(stats.data.items) ? stats.data.items : (Array.isArray(stats.data) ? stats.data : []);
    
    if (rawItems.length > 0) {
      dataRows = rawItems;
      
      rawItems.forEach((row: any) => {
        const rev = parseFloat(row.revenue || row.money || 0);
        const imp = parseInt(row.impressions || row.views || 0, 10);
        const clk = parseInt(row.clicks || 0, 10);
        
        if (!isNaN(rev)) totalRevenue += rev;
        if (!isNaN(imp)) totalImpressions += imp;
        if (!isNaN(clk)) totalClicks += clk;
      });
      
      if (totalImpressions > 0) {
        avgCpm = (totalRevenue / totalImpressions) * 1000;
      }
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-[#414FA8]" />
            Adsterra Revenue Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time monetization performance and statistics for the last 7 days.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>Last 7 Days</span>
          </div>
          <button 
            onClick={handleFetchData}
            disabled={loading}
            className="flex items-center gap-2 bg-[#414FA8] hover:bg-[#343f88] text-white px-5 py-2.5 rounded-lg font-medium shadow-sm transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Fetching...' : 'Fetch Data'}
          </button>
        </div>
      </div>

      {!stats && !loading && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center flex flex-col items-center justify-center">
          <div className="bg-[#EEF1FB] p-4 rounded-full mb-4">
            <TrendingUp className="w-10 h-10 text-[#414FA8]" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Data Loaded Yet</h3>
          <p className="text-gray-500 max-w-md">
            Click the "Fetch Data" button above to pull the latest performance statistics directly from Adsterra API.
          </p>
        </div>
      )}

      {loading && !stats && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center flex flex-col items-center justify-center">
          <RefreshCw className="w-10 h-10 text-[#414FA8] animate-spin mb-4" />
          <h3 className="text-lg font-medium text-gray-900">Connecting to Adsterra API...</h3>
          <p className="text-gray-500 mt-1">This will just take a moment.</p>
        </div>
      )}

      {stats?.error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
          <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-800">Connection Error</h3>
            <p className="text-sm text-red-700 mt-1">
              {stats.error}
            </p>
            {stats.error.includes('ADSTERRA_API') && (
              <div className="mt-3 bg-white/60 p-3 rounded text-sm text-red-800 border border-red-100">
                Please add <code>ADSTERRA_API</code> to your environment variables in Vercel to see your statistics.
              </div>
            )}
          </div>
        </div>
      )}

      {stats && !stats.error && (
        <>
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Revenue Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign className="w-16 h-16 text-green-600" />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-green-100 p-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-700" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">Total Revenue</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${totalRevenue.toFixed(2)}
              </p>
              <div className="mt-2 text-xs text-green-600 font-medium bg-green-50 w-fit px-2 py-1 rounded">
                + Earnings (7d)
              </div>
            </div>

            {/* Impressions Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Eye className="w-16 h-16 text-blue-600" />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-700" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">Impressions</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totalImpressions.toLocaleString()}
              </p>
              <div className="mt-2 text-xs text-gray-500 font-medium bg-gray-50 w-fit px-2 py-1 rounded">
                Total Ad Views
              </div>
            </div>

            {/* Clicks Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <MousePointerClick className="w-16 h-16 text-purple-600" />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <MousePointerClick className="w-5 h-5 text-purple-700" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">Clicks</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {totalClicks.toLocaleString()}
              </p>
              <div className="mt-2 text-xs text-gray-500 font-medium bg-gray-50 w-fit px-2 py-1 rounded">
                Ad Engagements
              </div>
            </div>

            {/* CPM Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp className="w-16 h-16 text-orange-600" />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-orange-100 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-700" />
                </div>
                <h3 className="text-sm font-medium text-gray-600">Average CPM</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                ${avgCpm.toFixed(3)}
              </p>
              <div className="mt-2 text-xs text-gray-500 font-medium bg-gray-50 w-fit px-2 py-1 rounded">
                Cost Per 1000
              </div>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden mt-6">
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Daily Performance Report
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Detailed breakdown of your Adsterra statistics.
                </p>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              {dataRows.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50/50">
                    <tr>
                      {Object.keys(dataRows[0]).map((key) => {
                        // Skip complex nested objects in header if any
                        if (typeof dataRows[0][key] === 'object' && dataRows[0][key] !== null) return null;
                        
                        return (
                          <th key={key} className="px-6 py-4 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                            {key.replace(/_/g, ' ')}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {dataRows.map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50/80 transition-colors">
                        {Object.entries(row).map(([key, val]: [string, any], j: number) => {
                          if (typeof val === 'object' && val !== null) return null;
                          
                          // Style revenue column specially
                          const isRevenue = key.toLowerCase() === 'revenue' || key.toLowerCase() === 'money';
                          const isDate = key.toLowerCase() === 'date';
                          
                          return (
                            <td key={j} className={`px-6 py-4 whitespace-nowrap text-sm ${
                              isRevenue ? 'text-green-600 font-bold' : 
                              isDate ? 'text-gray-900 font-medium' : 
                              'text-gray-600'
                            }`}>
                              {isRevenue && typeof val === 'number' ? `$${val.toFixed(2)}` : 
                               isRevenue && typeof val === 'string' && !val.includes('$') ? `$${parseFloat(val).toFixed(2)}` :
                               String(val)}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <AlertCircle className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No Data Available</h3>
                  <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                    We couldn't find any statistics for the selected date range. Please ensure your ad placements are active.
                  </p>
                  
                  {/* Raw Fallback if items was empty but data wasn't an array */}
                  {stats.data && typeof stats.data === 'object' && !Array.isArray(stats.data) && !Array.isArray(stats.data.items) && (
                     <div className="mt-8 text-left">
                       <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Raw API Response (Fallback):</p>
                       <pre className="text-xs text-gray-700 bg-gray-50 p-4 rounded border border-gray-200 overflow-auto max-h-64 break-all whitespace-pre-wrap">
                         {JSON.stringify(stats.data, null, 2)}
                       </pre>
                     </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
