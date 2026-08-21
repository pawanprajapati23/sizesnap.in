import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '28days'

    // Get tokens from secure storage
    const tokenDoc = await adminDb.collection('admin_settings').doc('google_oauth').get()
    
    if (!tokenDoc.exists) {
       return NextResponse.json({ 
          success: true, 
          connected: false 
       })
    }

    const { tokens } = tokenDoc.data() as any
    if (!tokens || !tokens.access_token) {
       return NextResponse.json({ success: true, connected: false })
    }

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
    const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://sizesnap.in/api/admin/oauth/callback'

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return NextResponse.json({ success: false, connected: false, error: "Missing OAuth credentials" }, { status: 500 })
    }

    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    )

    // Set credentials and handle automatic refresh token persistence
    oauth2Client.setCredentials(tokens)
    
    oauth2Client.on('tokens', async (newTokens) => {
      const updatedTokens = { ...tokens, ...newTokens }
      await adminDb.collection('admin_settings').doc('google_oauth').set({
        tokens: updatedTokens,
        updatedAt: new Date().toISOString()
      }, { merge: true })
    })

    const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client })
    
    let siteUrl = 'https://sizesnap.in/'
    try {
      const sitesRes = await searchconsole.sites.list();
      const sites = sitesRes.data.siteEntry || [];
      const matchedSite = sites.find(s => s.siteUrl?.includes('sizesnap.in'));
      if (matchedSite && matchedSite.siteUrl) {
        siteUrl = matchedSite.siteUrl;
      } else if (sites.length > 0 && sites[0].siteUrl) {
        siteUrl = sites[0].siteUrl;
      }
    } catch (siteErr) {
      console.warn("Could not fetch sites list, falling back to default siteUrl", siteErr)
    }

    // Calculate dates for current and previous period
    let durationDays = 28
    if (timeRange === '7days') durationDays = 7
    if (timeRange === '3months') durationDays = 90
    
    const currentEnd = new Date()
    const currentStart = new Date()
    currentStart.setDate(currentEnd.getDate() - durationDays)
    
    const prevEnd = new Date(currentStart)
    prevEnd.setDate(prevEnd.getDate() - 1)
    const prevStart = new Date(prevEnd)
    prevStart.setDate(prevStart.getDate() - durationDays)

    const start = currentStart.toISOString().split('T')[0]
    const end = currentEnd.toISOString().split('T')[0]
    const pStart = prevStart.toISOString().split('T')[0]
    const pEnd = prevEnd.toISOString().split('T')[0]

    // Parallel requests for speed
    const [overviewRes, prevOverviewRes, queriesRes, prevQueriesRes, pagesRes, queryPageRes, dateRes] = await Promise.all([
      // 1. Current Overview
      searchconsole.searchanalytics.query({ siteUrl, requestBody: { startDate: start, endDate: end, rowLimit: 1 } }).catch(() => ({ data: { rows: [] } })),
      // 2. Prev Overview
      searchconsole.searchanalytics.query({ siteUrl, requestBody: { startDate: pStart, endDate: pEnd, rowLimit: 1 } }).catch(() => ({ data: { rows: [] } })),
      // 3. Current Queries
      searchconsole.searchanalytics.query({ siteUrl, requestBody: { startDate: start, endDate: end, dimensions: ['query'], rowLimit: 100 } }).catch(() => ({ data: { rows: [] } })),
      // 4. Prev Queries (for rising/declining)
      searchconsole.searchanalytics.query({ siteUrl, requestBody: { startDate: pStart, endDate: pEnd, dimensions: ['query'], rowLimit: 100 } }).catch(() => ({ data: { rows: [] } })),
      // 5. Current Pages
      searchconsole.searchanalytics.query({ siteUrl, requestBody: { startDate: start, endDate: end, dimensions: ['page'], rowLimit: 100 } }).catch(() => ({ data: { rows: [] } })),
      // 6. Current Query + Page (for detailed opps & cannibalization)
      searchconsole.searchanalytics.query({ siteUrl, requestBody: { startDate: start, endDate: end, dimensions: ['query', 'page'], rowLimit: 300 } }).catch(() => ({ data: { rows: [] } })),
      // 7. Date-wise performance
      searchconsole.searchanalytics.query({ siteUrl, requestBody: { startDate: start, endDate: end, dimensions: ['date'], rowLimit: 100 } }).catch(() => ({ data: { rows: [] } }))
    ]);

    const getRowStats = (res: any) => {
       const row = res.data?.rows && res.data.rows.length > 0 ? res.data.rows[0] : { clicks: 0, impressions: 0, ctr: 0, position: 0 }
       return {
          clicks: row.clicks || 0,
          impressions: row.impressions || 0,
          ctr: ((row.ctr || 0) * 100).toFixed(2),
          position: (row.position || 0).toFixed(1)
       }
    }

    const currentStats = getRowStats(overviewRes);
    const prevStats = getRowStats(prevOverviewRes);
    
    // Comparison Math
    const calcChange = (curr: number, prev: number) => prev === 0 ? 0 : (((curr - prev) / prev) * 100).toFixed(1);
    
    const changes = {
       clicks: calcChange(currentStats.clicks, prevStats.clicks),
       impressions: calcChange(currentStats.impressions, prevStats.impressions),
       ctr: calcChange(parseFloat(currentStats.ctr), parseFloat(prevStats.ctr)),
       position: (parseFloat(currentStats.position) - parseFloat(prevStats.position)).toFixed(1)
    };

    // Calculate Opportunities & Action Plan
    const rawOpps: any[] = [];
    
    const cleanUrl = (url: string) => url ? url.replace('https://sizesnap.in', '').replace('https://www.sizesnap.in', '') || '/' : '/';
    
    // Process Query + Page combinations for Rules A, B, C, D
    const queryGroups: Record<string, any[]> = {};
    (queryPageRes.data?.rows || []).forEach((row: any) => {
       const q = row.keys?.[0] || '';
       let p = row.keys?.[1] || '';
       p = cleanUrl(p);
       
       const imp = row.impressions || 0;
       const clk = row.clicks || 0;
       const ctr = row.ctr || 0;
       const pos = row.position || 0;
       
       if (imp < 10) return; // Skip complete noise
       
       if (!queryGroups[q]) queryGroups[q] = [];
       queryGroups[q].push({ page: p, imp, clk, ctr, pos });

       let type = '';
       let reason = '';
       let action = '';
       let priorityScore = (imp / 100) + (clk * 2);
       let objective = '';

       // D. High Impression / Low Click
       if (imp > 500 && clk < 5) {
          type = 'INTENT_MISMATCH';
          reason = 'High search visibility but very few clicks.';
          action = 'Improve search intent matching, title, and meta description.';
          objective = 'Increase CTR for high visibility query.';
          priorityScore *= 1.5;
       } 
       // A. Low CTR Opportunities
       else if (pos <= 7 && ctr < 0.02 && imp > 50) {
          type = 'LOW_CTR';
          reason = 'Good ranking (Page 1) but low click-through rate.';
          action = 'Improve title and meta description to attract clicks.';
          objective = 'Boost traffic from existing Page 1 rankings.';
          priorityScore *= 2.0;
       }
       // B. Page 8-20 Opportunities
       else if (pos > 7 && pos <= 20 && imp > 50) {
          type = 'PAGE_2_BOOST';
          reason = 'Ranking close to Page 1. Pushing to Page 1 can significantly increase traffic.';
          action = 'Improve content depth, optimize H1, and add internal links.';
          objective = 'Achieve Page 1 ranking.';
          priorityScore *= 1.2;
       }
       // C. Ranking 20-50 Opportunities
       else if (pos > 20 && pos <= 50 && imp > 50) {
          type = 'CONTENT_IMPROVEMENT';
          reason = 'Ranking low but receiving meaningful impressions.';
          action = 'Major content improvement needed. Enhance topical coverage.';
          objective = 'Move up in rankings from deep pages.';
          priorityScore *= 0.8;
       }

       if (type) {
          rawOpps.push({
             type, query: q, page: p, impressions: imp, clicks: clk, 
             ctr: (ctr * 100).toFixed(2), position: pos.toFixed(1), 
             reason, action, objective, priorityScore
          });
       }
    });

    // F. Content Opportunities & H. Cannibalization
    Object.entries(queryGroups).forEach(([q, pages]) => {
       if (pages.length > 1) {
          // Cannibalization: multiple pages rank for same query with decent impressions
          const highImpPages = pages.filter(p => p.imp > 20);
          if (highImpPages.length > 1) {
             highImpPages.sort((a,b) => b.imp - a.imp);
             const combinedImp = highImpPages.reduce((acc, p) => acc + p.imp, 0);
             const combinedClk = highImpPages.reduce((acc, p) => acc + p.clk, 0);
             rawOpps.push({
                type: 'CANNIBALIZATION', query: q, page: 'Multiple Pages',
                impressions: combinedImp, clicks: combinedClk,
                ctr: ((combinedClk / combinedImp) * 100).toFixed(2),
                position: highImpPages[0].pos.toFixed(1),
                reason: 'Multiple pages appear to rank for the same important query.',
                action: 'Possible cannibalization — review manually. Consider merging or differentiating intent.',
                objective: 'Consolidate ranking signals.',
                priorityScore: (combinedImp / 100) * 1.5
             });
          }
       } else if (pages.length === 1 && pages[0].imp > 200 && pages[0].page === '/') {
          // Content Opp: high impressions on homepage, maybe needs a dedicated page
          rawOpps.push({
             type: 'CONTENT_GAP', query: q, page: '/',
             impressions: pages[0].imp, clicks: pages[0].clk,
             ctr: (pages[0].ctr * 100).toFixed(2), position: pages[0].pos.toFixed(1),
             reason: 'Homepage ranks for specific query. No dedicated page exists.',
             action: 'Potential new content/page opportunity to capture specific intent.',
             objective: 'Create highly targeted landing page.',
             priorityScore: (pages[0].imp / 100) * 1.3
          });
       }
    });

    // E. Rising / Declining Performance
    const prevMap: Record<string, any> = {};
    (prevQueriesRes.data?.rows || []).forEach((r: any) => { prevMap[r.keys?.[0] || ''] = r; });
    
    (queriesRes.data?.rows || []).forEach((r: any) => {
       const q = r.keys?.[0] || '';
       const prev = prevMap[q];
       if (prev && r.impressions > 50) {
          if (r.clicks < (prev.clicks || 0) * 0.5 && prev.clicks > 10) {
             rawOpps.push({
                type: 'DECLINING', query: q, page: 'Various',
                impressions: r.impressions, clicks: r.clicks,
                ctr: ((r.ctr || 0) * 100).toFixed(2), position: (r.position || 0).toFixed(1),
                reason: `Clicks dropped from ${prev.clicks} to ${r.clicks} compared to previous period.`,
                action: 'Investigate ranking drop or seasonal trend.',
                objective: 'Recover lost traffic.',
                priorityScore: (prev.clicks - r.clicks) * 3 // High priority for big drops
             });
          }
       }
    });

    // Sort, Assign Priority, Deduplicate
    rawOpps.sort((a, b) => b.priorityScore - a.priorityScore);
    
    const uniqueOpps: any[] = [];
    const seen = new Set();
    rawOpps.forEach(opp => {
       const key = opp.query + opp.type;
       if (!seen.has(key)) {
          seen.add(key);
          uniqueOpps.push(opp);
       }
    });

    // Top 20% HIGH, next 30% MEDIUM, rest LOW
    uniqueOpps.forEach((opp, idx) => {
       if (idx < uniqueOpps.length * 0.2) opp.priority = 'HIGH';
       else if (idx < uniqueOpps.length * 0.5) opp.priority = 'MEDIUM';
       else opp.priority = 'LOW';
    });

    const actionPlan = uniqueOpps.slice(0, 10);
    const opportunities = uniqueOpps.slice(10, 50); // Keep dashboard light

    return NextResponse.json({
       success: true,
       connected: true,
       overview: {
          current: currentStats,
          previous: prevStats,
          changes
       },
       topQueries: (queriesRes.data?.rows || []).map((r: any) => ({
         query: r.keys?.[0], clicks: r.clicks, impressions: r.impressions, ctr: ((r.ctr || 0) * 100).toFixed(2), position: (r.position || 0).toFixed(1)
       })).slice(0, 50),
       topPages: (pagesRes.data?.rows || []).map((r: any) => ({
         page: cleanUrl(r.keys?.[0]), clicks: r.clicks, impressions: r.impressions, ctr: ((r.ctr || 0) * 100).toFixed(2), position: (r.position || 0).toFixed(1)
       })).slice(0, 50),
       performanceByDate: (dateRes.data?.rows || []).map((r: any) => ({
         date: r.keys?.[0], clicks: r.clicks, impressions: r.impressions
       })).sort((a: any, b: any) => a.date?.localeCompare(b.date || '') || 0),
       actionPlan,
       opportunities
    });

  } catch (error: any) {
    console.error('SEO API Error:', error)
    if (error.code === 401 || error.message?.includes('invalid_grant')) {
      return NextResponse.json({ success: true, connected: false, error: 'Token expired or revoked. Please reconnect.' })
    }
    return NextResponse.json({ success: false, connected: false, error: error.message }, { status: 500 })
  }
}
