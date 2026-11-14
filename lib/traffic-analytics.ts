import { ref, get, set, push, query, limitToLast } from 'firebase/database';
import { db, fetchUsage, aggregateWithin } from '@/lib/firebase';
import { ALL_TOOLS } from '@/data/tools';
import { TOOL_REDIRECT_MAP } from '@/data/tool-redirects';

export type TimeRange = '24h' | '7d' | '30d' | '3m';

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

export interface TopToolStat {
  slug: string;
  name: string;
  categoryTitle: string;
  uses: number;
  downloads: number;
  conversionPct: number;
  errors: number;
}

export interface TrafficReport {
  timeframe: TimeRange;
  timeframeLabel: string;
  totalVisits: number;
  uniqueVisitors: number;
  totalToolUses: number;
  totalDownloads: number;
  totalErrors: number;
  conversionRatePct: number;
  topPages: TopPageStat[];
  topTools: TopToolStat[];
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

const CANONICAL_TOOLS = ALL_TOOLS.filter(
  (t) => !TOOL_REDIRECT_MAP[t.slug] && t.status !== 'draft' && t.status !== 'deprecated'
);

export async function getTrafficAnalyticsReport(timeframe: TimeRange): Promise<TrafficReport> {
  const now = Date.now();
  let startTime = now - 24 * 60 * 60 * 1000;
  let timeframeLabel = 'Last 24 Hours';

  if (timeframe === '7d') {
    startTime = now - 7 * 24 * 60 * 60 * 1000;
    timeframeLabel = 'Last 7 Days';
  } else if (timeframe === '30d') {
    startTime = now - 30 * 24 * 60 * 60 * 1000;
    timeframeLabel = 'Last 30 Days';
  } else if (timeframe === '3m') {
    startTime = now - 90 * 24 * 60 * 60 * 1000;
    timeframeLabel = 'Last 90 Days';
  }

  const ms = now - startTime;

  // 1. Fetch visits from Realtime Database
  const rawVisits: TrafficVisitRecord[] = [];

  try {
    const visitsQuery = query(ref(db, 'trafficVisits'), limitToLast(2500));
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

  rawVisits.sort((a, b) => b.timestamp - a.timestamp);

  // 2. Fetch tool uses, per-tool downloads, and errors
  let totalToolUses = 0;
  let totalDownloads = 0;
  let totalErrors = 0;
  const topToolsList: TopToolStat[] = [];

  try {
    const [toolRecords, dlRecords, errRecords] = await Promise.all([
      fetchUsage('toolUsage'),
      fetchUsage('downloads'),
      fetchUsage('toolErrors'),
    ]);

    const perToolDlMap = (toolRecords['_downloads'] ?? {}) as unknown as Record<
      string,
      Record<string, number>
    >;
    const perToolErrMap = (toolRecords['_errors'] ?? {}) as unknown as Record<
      string,
      Record<string, number>
    >;

    let summedToolDownloads = 0;

    for (const [key, records] of Object.entries(toolRecords)) {
      if (key.startsWith('_') || typeof records !== 'object' || records === null) continue;
      const uses = aggregateWithin(records as unknown as Record<string, number>, ms);
      const dls = perToolDlMap[key] ? aggregateWithin(perToolDlMap[key], ms) : 0;
      const errsFromToolUsage = perToolErrMap[key] ? aggregateWithin(perToolErrMap[key], ms) : 0;
      const errsFromLegacy =
        errRecords[key] && typeof errRecords[key] === 'object'
          ? aggregateWithin(errRecords[key] as unknown as Record<string, number>, ms)
          : 0;
      const errs = Math.max(errsFromToolUsage, errsFromLegacy);

      totalToolUses += uses;
      summedToolDownloads += dls;
      totalErrors += errs;

      if (uses > 0 || dls > 0 || errs > 0) {
        const meta = CANONICAL_TOOLS.find((t) => t.slug === key) || ALL_TOOLS.find((t) => t.slug === key);
        topToolsList.push({
          slug: key,
          name: meta ? meta.name : key.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          categoryTitle: meta?.categoryTitle || 'Utility',
          uses,
          downloads: dls,
          conversionPct: uses > 0 ? Math.min(100, Math.round((dls / uses) * 100)) : 0,
          errors: errs,
        });
      }
    }

    const globalDownloads = aggregateWithin(dlRecords, ms);
    totalDownloads = Math.max(globalDownloads, summedToolDownloads);
  } catch {
    // Ignore if fetchUsage fails
  }

  topToolsList.sort((a, b) => b.uses - a.uses);

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

  const topPages: TopPageStat[] = Object.entries(pageHits)
    .map(([path, count]) => ({
      path,
      visits: count,
      percentage: totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0,
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 10);

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
  } else if (timeframe === '7d') {
    const bucketDuration = 24 * 60 * 60 * 1000;
    for (let i = 6; i >= 0; i--) {
      const bucketStart = now - (i + 1) * bucketDuration;
      const bucketEnd = now - i * bucketDuration;
      const bucketDate = new Date(bucketEnd);
      const label = bucketDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric' });

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

  const conversionRatePct =
    totalToolUses > 0 ? Math.min(100, Math.round((totalDownloads / totalToolUses) * 100)) : 0;

  return {
    timeframe,
    timeframeLabel,
    totalVisits,
    uniqueVisitors,
    totalToolUses,
    totalDownloads,
    totalErrors,
    conversionRatePct,
    topPages,
    topTools: topToolsList.slice(0, 10),
    deviceBreakdown,
    timeSeries,
    recentVisits: rawVisits.slice(0, 20),
  };
}
