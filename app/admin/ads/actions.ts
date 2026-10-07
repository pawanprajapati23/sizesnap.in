'use server';

export async function fetchAdsterraStats() {
  const apiKey = process.env.ADSTERRA_API;

  if (!apiKey) {
    return { error: 'ADSTERRA_API environment variable is not set.' };
  }

  try {
    const finishDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Pass group_by=date to ensure we get a daily breakdown
    const url = `https://api3.adsterratools.com/publisher/stats.json?start_date=${startDate}&finish_date=${finishDate}&group_by=date`;
    
    const res = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'X-API-Key': apiKey,
      },
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
