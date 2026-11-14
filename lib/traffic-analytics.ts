import { ref, get, set, push, query, limitToLast, orderByKey } from 'firebase/database';
import { db, fetchUsage, aggregateWithin } from '@/lib/firebase';

export type TimeRange = '24h' | '30d' | '3m';

export interface TrafficVisitRecord {
  id: string;
  path: string;
  visitorId: string;
  device: 'desktop' | 'mobile' | 'tablet';
  timestamp: number;
}

export interface TimeSeriesBucket {
  label: string;
  timestamp: number;
  visits: number;
  uniqueUsers: number;
}

export interface TopPageStat {
  path: string;
  visits: number;
  percentage: number;
}

export interface TrafficReport {
  timeframe: TimeRange;
  timeframeLabel: string;
  totalVisits: number;
  uniqueVisitors: number;
  totalToolUses: number;
  totalDownloads: number;
  topPages: TopPageStat[];
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
    desktopPct: number;
    mobilePct: number;
    tabletPct: number;
  };
  timeSeries: TimeSeriesBucket[];
  recentVisits: TrafficVisitRecord[];
}

function detectDevice(): 'desktop' | 'mobile' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const ua = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua) || (width >= 768 && width <= 1024)) {
    return 'tablet';
  }
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua
    ) ||
    width < 768
  ) {
    return 'mobile';
  }
  return 'desktop';
}

function getOrSetVisitorId(): string {
  if (typeof window === 'undefined') return 'session';
  try {
    const existing = localStorage.getItem('sizesnap_vid');
    if (existing && existing.length >= 10) {
      return existing;
    }
    const created = `vid_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem('sizesnap_vid', created);
    return created;
  } catch {
    return `vid_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  }
}

// In-memory debounce cache: prevent spamming duplicate hit within 5 seconds on same route
let lastLoggedPath = '';
let lastLoggedTime = 0;

export async function recordPageVisit(path: string): Promise<void> {
  if (typeof window === 'undefined') return;

  // Never track internal admin routes or static assets
  if (
    path.startsWith('/admin') ||
    path.startsWith('/api') ||
    path.startsWith('/_next') ||
    path.includes('.')
  ) {
    return;
  }

  const now = Date.now();
  if (path === lastLoggedPath && now - lastLoggedTime < 5000) {
    return;
  }
  lastLoggedPath = path;
  lastLoggedTime = now;

  try {
    const visitorId = getOrSetVisitorId();
    const device = detectDevice();

    const visitsRef = ref(db, 'trafficVisits');
    const newVisitRef = push(visitsRef);

    await set(newVisitRef, {
      id: newVisitRef.key,
      path: path.slice(0, 160),
      visitorId,
      device,
      timestamp: now,
    });
  } catch {
    // Non-blocking telemetry
  }
}

export async function getTrafficAnalyticsReport(timeframe: TimeRange): Promise<TrafficReport> {
  const now = Date.now();
  let startTime = now - 24 * 60 * 60 * 1000;
  let timeframeLabel = 'Last 24 Hours';

  if (timeframe === '30d') {
    startTime = now - 30 * 24 * 60 * 60 * 1000;
    timeframeLabel = 'Last 30 Days';
  } else if (timeframe === '3m') {
    startTime = now - 90 * 24 * 60 * 60 * 1000;
    timeframeLabel = 'Last 3 Months (90 Days)';
  }

  const ms = now - startTime;

  // 1. Fetch visits from Realtime Database
  const rawVisits: TrafficVisitRecord[] = [];

  try {
    // Query latest 2000 visits
    const visitsQuery = query(ref(db, 'trafficVisits'), limitToLast(2000));
    const snap = await get(visitsQuery);
    if (snap.exists()) {
      const data = snap.val();
      if (data && typeof data === 'object') {
        Object.entries(data).forEach(([key, val]: [string, any]) => {
          if (val && typeof val === 'object') {
            const ts = Number(val.timestamp || 0);
            if (ts >= startTime) {
              rawVisits.push({
                id: val.id || key,
                path: val.path || '/',
                visitorId: val.visitorId || 'unknown',
                device: val.device || 'desktop',
                timestamp: ts,
              });
            }
          }
        });
      }
    }
  } catch (error) {
    console.error('Failed to query trafficVisits:', error);
  }

  // Sort descending by timestamp
  rawVisits.sort((a, b) => b.timestamp - a.timestamp);

  // 2. Fetch tool uses and downloads for cross-correlation
  let totalToolUses = 0;
  let totalDownloads = 0;

  try {
    const [toolRecords, dlRecords] = await Promise.all([
      fetchUsage('toolUsage'),
      fetchUsage('downloads'),
    ]);

    totalDownloads = aggregateWithin(dlRecords, ms);

    for (const [key, records] of Object.entries(toolRecords)) {
      if (!key.startsWith('_') && typeof records === 'object' && records !== null) {
        totalToolUses += aggregateWithin(records as Record<string, number>, ms);
      }
    }
  } catch {
    // Ignore if fetchUsage fails
  }

  // 3. Aggregate Unique Visitors, Page Hits, Devices
  const uniqueVisitorIds = new Set<string>();
  const pageHits: Record<string, number> = {};
  let desktopCount = 0;
  let mobileCount = 0;
  let tabletCount = 0;

  for (const v of rawVisits) {
    uniqueVisitorIds.add(v.visitorId);
    pageHits[v.path] = (pageHits[v.path] || 0) + 1;

    if (v.device === 'mobile') mobileCount++;
    else if (v.device === 'tablet') tabletCount++;
    else desktopCount++;
  }

  const totalVisits = rawVisits.length;
  const uniqueVisitors = uniqueVisitorIds.size;

  // Top Pages
  const topPages: TopPageStat[] = Object.entries(pageHits)
    .map(([path, count]) => ({
      path,
      visits: count,
      percentage: totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0,
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10);

  // Device Breakdown
  const deviceTotal = desktopCount + mobileCount + tabletCount || 1;
  const deviceBreakdown = {
    desktop: desktopCount,
    mobile: mobileCount,
    tablet: tabletCount,
    desktopPct: totalVisits > 0 ? Math.round((desktopCount / deviceTotal) * 100) : 0,
    mobilePct: totalVisits > 0 ? Math.round((mobileCount / deviceTotal) * 100) : 0,
    tabletPct: totalVisits > 0 ? Math.round((tabletCount / deviceTotal) * 100) : 0,
  };

  // Time Series Buckets
  const timeSeries: TimeSeriesBucket[] = [];

  if (timeframe === '24h') {
    // 24 one-hour buckets
    const bucketDuration = 60 * 60 * 1000;
    for (let i = 23; i >= 0; i--) {
      const bucketStart = now - (i + 1) * bucketDuration;
      const bucketEnd = now - i * bucketDuration;
      const bucketDate = new Date(bucketEnd);
      const label = bucketDate.toLocaleTimeString('en-IN', { hour: 'numeric', hour12: true });

      const inBucket = rawVisits.filter((v) => v.timestamp >= bucketStart && v.timestamp < bucketEnd);
      const bucketUniq = new Set(inBucket.map((v) => v.visitorId)).size;

      timeSeries.push({
        label,
        timestamp: bucketEnd,
        visits: inBucket.length,
        uniqueUsers: bucketUniq,
      });
    }
  } else if (timeframe === '30d') {
    // 30 one-day buckets
    const bucketDuration = 24 * 60 * 60 * 1000;
    for (let i = 29; i >= 0; i--) {
      const bucketStart = now - (i + 1) * bucketDuration;
      const bucketEnd = now - i * bucketDuration;
      const bucketDate = new Date(bucketEnd);
      const label = bucketDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });

      const inBucket = rawVisits.filter((v) => v.timestamp >= bucketStart && v.timestamp < bucketEnd);
      const bucketUniq = new Set(inBucket.map((v) => v.visitorId)).size;

      timeSeries.push({
        label,
        timestamp: bucketEnd,
        visits: inBucket.length,
        uniqueUsers: bucketUniq,
      });
    }
  } else {
    // 3m: 12 weekly buckets
    const bucketDuration = 7 * 24 * 60 * 60 * 1000;
    for (let i = 12; i >= 0; i--) {
      const bucketStart = now - (i + 1) * bucketDuration;
      const bucketEnd = now - i * bucketDuration;
      const bucketDate = new Date(bucketEnd);
      const label = `Wk ${bucketDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}`;

      const inBucket = rawVisits.filter((v) => v.timestamp >= bucketStart && v.timestamp < bucketEnd);
      const bucketUniq = new Set(inBucket.map((v) => v.visitorId)).size;

      timeSeries.push({
        label,
        timestamp: bucketEnd,
        visits: inBucket.length,
        uniqueUsers: bucketUniq,
      });
    }
  }

  return {
    timeframe,
    timeframeLabel,
    totalVisits,
    uniqueVisitors,
    totalToolUses,
    totalDownloads,
    topPages,
    deviceBreakdown,
    timeSeries,
    recentVisits: rawVisits.slice(0, 20),
  };
}
