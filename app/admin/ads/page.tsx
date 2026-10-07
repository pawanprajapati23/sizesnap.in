import React from 'react';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

async function getAdsterraStats() {
  const apiKey = process.env.ADSTERRA_API;

  if (!apiKey) {
    return { error: 'ADSTERRA_API environment variable is not set.' };
  }

  try {
    // Add date range for the last 7 days as default query
    const finishDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    const url = `https://api3.adsterratools.com/publisher/stats.json?start_date=${startDate}&finish_date=${finishDate}`;
    
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': apiKey,
      },
      // Ensure we don't cache to get fresh stats
      cache: 'no-store', 
    });

    if (!res.ok) {
      let errorMsg = `${res.status} ${res.statusText}`;
      try {
        const errData = await res.json();
        errorMsg += ` - ${JSON.stringify(errData)}`;
      } catch(e) {}
      return { error: `Failed to fetch from Adsterra API: ${errorMsg}` };
    }

    const data = await res.json();
    return { data };
  } catch (err: any) {
    return { error: err.message || 'An unexpected error occurred.' };
  }
}

export default async function AdsAdminPage() {
  const stats = await getAdsterraStats();

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Adsterra API Statistics</h1>
        <p className="text-gray-600">
          View your ad performance, impressions, and revenue directly from Adsterra.
        </p>
      </div>

      {stats.error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 font-medium">
                {stats.error}
              </p>
              {stats.error.includes('ADSTERRA_API') && (
                <p className="mt-2 text-sm text-red-600">
                  Please add <code>ADSTERRA_API</code> to your environment variables in Vercel.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              API Response (Last 7 Days)
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Statistics returned by Adsterra Publisher API.
            </p>
          </div>
          <div className="px-4 py-5 sm:p-6 bg-gray-50">
            {stats.data && Array.isArray(stats.data.items || stats.data) ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 bg-white border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      {Object.keys((stats.data.items || stats.data)[0] || {}).map((key) => (
                        <th key={key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {key.replace(/_/g, ' ')}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {(stats.data.items || stats.data).map((row: any, i: number) => (
                      <tr key={i} className="hover:bg-gray-50">
                        {Object.values(row).map((val: any, j: number) => (
                          <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <pre className="text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap break-all bg-white p-4 rounded border border-gray-200 shadow-inner">
                {JSON.stringify(stats.data, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
