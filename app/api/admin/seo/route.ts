import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '28days'

    const tokenDoc = await adminDb.collection('admin_settings').doc('google_oauth').get()
    if (!tokenDoc.exists) return NextResponse.json({ success: true, connected: false })

    const { tokens } = tokenDoc.data() as any
    if (!tokens || !tokens.access_token) return NextResponse.json({ success: true, connected: false })

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
    const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://sizesnap.in/api/admin/oauth/callback'

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return NextResponse.json({ success: false, connected: false, error: "Missing OAuth credentials" }, { status: 500 })
    }

    const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI)
    oauth2Client.setCredentials(tokens)
    
    oauth2Client.on('tokens', async (newTokens) => {
      await adminDb.collection('admin_settings').doc('google_oauth').set({
        tokens: { ...tokens, ...newTokens }, updatedAt: new Date().toISOString()
      }, { merge: true })
    })

    const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client })
    
    let siteUrl = 'https://sizesnap.in/'
    try {
      const sitesRes = await searchconsole.sites.list();
      const sites = sitesRes.data.siteEntry || [];
      const matchedSite = sites.find(s => s.siteUrl?.includes('sizesnap.in'));
      if (matchedSite && matchedSite.siteUrl) siteUrl = matchedSite.siteUrl;
      else if (sites.length > 0 && sites[0].siteUrl) siteUrl = sites[0].siteUrl;
    } catch (siteErr) { console.warn("Could not fetch sites list", siteErr) }

    let durationDays = 28
    if (timeRange === '24hours') durationDays = 1
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

    const [
      overviewRes, prevOverviewRes, queriesRes, prevQueriesRes, pagesRes, queryPageRes, dateRes,
      toolSnap, feedbackSnap, actionsSnap
    ] = await Promise.all([
      searchconsole.searchanalytics.query({ siteUrl, requestBody: { startDate: start, endDate: end, rowLimit: 1 } }).catch(() => ({ data: { rows: [] } })),
      searchconsole.searchanalytics.query({ siteUrl, requestBody: { startDate: pStart, endDate: pEnd, rowLimit: 1 } }).catch(() => ({ data: { rows: [] } })),
      searchconsole.searchanalytics.query({ siteUrl, requestBody: { startDate: start, endDate: end, dimensions: ['query'], rowLimit: 500 } }).catch(() => ({ data: { rows: [] } })),
      searchconsole.searchanalytics.query({ siteUrl, requestBody: { startDate: pStart, endDate: pEnd, dimensions: ['query'], rowLimit: 500 } }).catch(() => ({ data: { rows: [] } })),
      searchconsole.searchanalytics.query({ siteUrl, requestBody: { startDate: start, endDate: end, dimensions: ['page'], rowLimit: 500 } }).catch(() => ({ data: { rows: [] } })),
      searchconsole.searchanalytics.query({ siteUrl, requestBody: { startDate: start, endDate: end, dimensions: ['query', 'page'], rowLimit: 500 } }).catch(() => ({ data: { rows: [] } })),
      searchconsole.searchanalytics.query({ siteUrl, requestBody: { startDate: start, endDate: end, dimensions: ['date'], rowLimit: 100 } }).catch(() => ({ data: { rows: [] } })),
      adminDb.collection('analytics_events_raw').where('timestamp', '>=', prevStart).get().catch(()=>({docs:[]})),
      adminDb.collection('user_feedback').orderBy('timestamp', 'desc').limit(200).get().catch(()=>({docs:[]})),
      adminDb.collection('seo_actions').get().catch(()=>({docs:[]}))
    ]);

    const toolStats: Record<string, number> = {};
    (toolSnap.docs || []).forEach(doc => {
       const d = doc.data()
       if (d.eventName === 'tool_open') {
          const slug = d.toolSlug || d.toolName || 'Unknown'
          toolStats[slug] = (toolStats[slug] || 0) + 1
       }
    });

    const feedbackList: any[] = [];
    const feedbackCountByTool: Record<string, number> = {};
    (feedbackSnap.docs || []).forEach(doc => {
       const d = doc.data()
       feedbackList.push({ id: doc.id, ...d, timestamp: d.timestamp?.toDate?.()?.toISOString() || new Date().toISOString() })
       if (d.toolSlug) {
          feedbackCountByTool[d.toolSlug] = (feedbackCountByTool[d.toolSlug] || 0) + 1
       }
    });

    const existingActions = (actionsSnap.docs || []).map(d => ({ id: d.id, ...d.data() }));

    const getRowStats = (res: any) => {
       const row = res.data?.rows?.[0] || { clicks: 0, impressions: 0, ctr: 0, position: 0 }
       return {
          clicks: row.clicks || 0, impressions: row.impressions || 0,
          ctr: ((row.ctr || 0) * 100).toFixed(2), position: (row.position || 0).toFixed(1)
       }
    }
    const currentStats = getRowStats(overviewRes);
    const prevStats = getRowStats(prevOverviewRes);
    const calcChange = (curr: number, prev: number) => prev === 0 ? 0 : (((curr - prev) / prev) * 100).toFixed(1);
    const changes = {
       clicks: calcChange(currentStats.clicks, prevStats.clicks),
       impressions: calcChange(currentStats.impressions, prevStats.impressions),
       ctr: calcChange(parseFloat(currentStats.ctr), parseFloat(prevStats.ctr)),
       position: (parseFloat(currentStats.position) - parseFloat(prevStats.position)).toFixed(1)
    };

    const cleanUrl = (url: string) => url ? url.replace('https://sizesnap.in', '').replace('https://www.sizesnap.in', '') || '/' : '/';
    const extractSlug = (url: string) => { const c = cleanUrl(url); return c === '/' ? 'home' : c.split('/')[1] || c; };

    const rawOpps: any[] = [];
    const queryGroups: Record<string, any[]> = {};
    
    (queryPageRes.data?.rows || []).forEach((row: any) => {
       const q = row.keys?.[0] || '';
       let p = cleanUrl(row.keys?.[1] || '');
       const imp = row.impressions || 0;
       const clk = row.clicks || 0;
       const ctr = row.ctr || 0;
       const pos = row.position || 0;
       
       if (imp < 10) return;
       
       if (!queryGroups[q]) queryGroups[q] = [];
       queryGroups[q].push({ page: p, imp, clk, ctr, pos });

       let type = '', reason = '', action = '', objective = '';
       let priorityScore = (imp / 100) + (clk * 2);

       const slug = extractSlug(p);
       const uses = toolStats[slug] || 0;
       const feedback = feedbackCountByTool[slug] || 0;
       const extraEvidence = `${uses > 0 ? ` Tool usage: ${uses}.` : ''}${feedback > 0 ? ` Feedback requests: ${feedback}.` : ''}`;

       if (uses > 50) priorityScore += (uses / 100);
       if (feedback > 0) priorityScore += feedback;

       if (imp > 500 && clk < 5) {
          type = 'INTENT_MISMATCH';
          reason = 'High search visibility but very few clicks.' + extraEvidence;
          action = 'Improve search intent matching, title, and meta description.';
          objective = 'Increase CTR for high visibility query.';
          priorityScore *= 1.5;
       } else if (pos <= 7 && ctr < 0.02 && imp > 50) {
          type = 'LOW_CTR';
          reason = 'Good ranking (Page 1) but low click-through rate.' + extraEvidence;
          action = 'Improve title and meta description to attract clicks.';
          objective = 'Boost traffic from existing Page 1 rankings.';
          priorityScore *= 2.0;
       } else if (pos > 7 && pos <= 20 && imp > 50) {
          type = 'PAGE_2_BOOST';
          reason = 'Ranking close to Page 1.' + extraEvidence;
          action = 'Improve content depth, optimize H1, and add internal links.';
          objective = 'Achieve Page 1 ranking.';
          priorityScore *= 1.2;
       } else if (pos > 20 && pos <= 50 && imp > 50) {
          type = 'CONTENT_IMPROVEMENT';
          reason = 'Ranking low but receiving meaningful impressions.' + extraEvidence;
          action = 'Major content improvement needed. Enhance topical coverage.';
          objective = 'Move up in rankings from deep pages.';
          priorityScore *= 0.8;
       }

       if (type) {
          rawOpps.push({
             type, query: q, page: p, impressions: imp, clicks: clk, 
             ctr: (ctr * 100).toFixed(2), position: pos.toFixed(1), 
             reason, action, objective, priorityScore, uses, feedback
          });
       }
    });

    Object.entries(queryGroups).forEach(([q, pages]) => {
       if (pages.length > 1) {
          const highImpPages = pages.filter(p => p.imp > 20);
          if (highImpPages.length > 1) {
             highImpPages.sort((a,b) => b.imp - a.imp);
             const combinedImp = highImpPages.reduce((acc, p) => acc + p.imp, 0);
             const combinedClk = highImpPages.reduce((acc, p) => acc + p.clk, 0);
             rawOpps.push({
                type: 'CANNIBALIZATION', query: q, page: 'Multiple Pages',
                impressions: combinedImp, clicks: combinedClk,
                ctr: ((combinedClk / combinedImp) * 100).toFixed(2), position: highImpPages[0].pos.toFixed(1),
                reason: 'Multiple pages appear to rank for the same important query.',
                action: 'Possible cannibalization — review manually. Consider merging or differentiating intent.',
                objective: 'Consolidate ranking signals.', priorityScore: (combinedImp / 100) * 1.5, uses: 0, feedback: 0
             });
          }
       } else if (pages.length === 1 && pages[0].imp > 200 && pages[0].page === '/') {
          rawOpps.push({
             type: 'CONTENT_GAP', query: q, page: '/',
             impressions: pages[0].imp, clicks: pages[0].clk,
             ctr: (pages[0].ctr * 100).toFixed(2), position: pages[0].pos.toFixed(1),
             reason: 'Homepage ranks for specific query. No dedicated page exists.',
             action: 'Potential new content/page opportunity to capture specific intent.',
             objective: 'Create highly targeted landing page.', priorityScore: (pages[0].imp / 100) * 1.3, uses: 0, feedback: 0
          });
       }
    });

    const prevMap: Record<string, any> = {};
    (prevQueriesRes.data?.rows || []).forEach((r: any) => { prevMap[r.keys?.[0] || ''] = r; });
    (queriesRes.data?.rows || []).forEach((r: any) => {
       const q = r.keys?.[0] || '';
       const prev = prevMap[q];
       if (prev && r.impressions > 50 && r.clicks < (prev.clicks || 0) * 0.5 && prev.clicks > 10) {
          rawOpps.push({
             type: 'DECLINING', query: q, page: 'Various',
             impressions: r.impressions, clicks: r.clicks,
             ctr: ((r.ctr || 0) * 100).toFixed(2), position: (r.position || 0).toFixed(1),
             reason: `Clicks dropped from ${prev.clicks} to ${r.clicks} compared to previous period.`,
             action: 'Investigate ranking drop or seasonal trend.',
             objective: 'Recover lost traffic.', priorityScore: (prev.clicks - r.clicks) * 3, uses: 0, feedback: 0
          });
       }
    });

    // -------------------------------------------------------------
    // NEW TOOL OPPORTUNITY ENGINE
    // -------------------------------------------------------------
    const newToolCandidates: Record<string, any> = {};
    const toolKeywords = [' to ', 'convert', 'compress', 'resize', 'crop', 'merge', 'split', 'maker', 'generator', 'editor', 'remove', 'add', 'pdf'];

    (queriesRes.data?.rows || []).forEach((row: any) => {
       const q = (row.keys?.[0] || '').toLowerCase();
       const imp = row.impressions || 0;
       const clk = row.clicks || 0;

       const isToolQuery = toolKeywords.some(kw => q.includes(kw));
       if (isToolQuery && imp > 10) {
           const relatedPages = queryGroups[q] || [];
           const hasDedicatedPage = relatedPages.some(p => p.pos < 20 && p.page !== '/' && !p.page.includes('/blog/'));

           if (!hasDedicatedPage) {
               let concept = q.replace(/(free|online|tool|without watermark|fast|best)/g, '').trim();
               concept = concept.replace(/\b\w/g, (l: any) => l.toUpperCase());

               if (!newToolCandidates[concept]) {
                   newToolCandidates[concept] = {
                       concept, queries: [q], impressions: 0, clicks: 0, feedbackCount: 0, feedbackMessages: []
                   };
               }
               newToolCandidates[concept].impressions += imp;
               newToolCandidates[concept].clicks += clk;
               if (!newToolCandidates[concept].queries.includes(q)) {
                   newToolCandidates[concept].queries.push(q);
               }
           }
       }
    });

    feedbackList.forEach((fb: any) => {
       const msg = (fb.message || '').toLowerCase();
       Object.values(newToolCandidates).forEach((cand: any) => {
           const conceptWords = cand.concept.toLowerCase().split(' ').filter((w:string) => w.length > 2);
           const matchCount = conceptWords.filter((w:string) => msg.includes(w)).length;
           if (matchCount >= 2 || (conceptWords.length === 1 && matchCount === 1)) {
               cand.feedbackCount += 1;
               cand.feedbackMessages.push(fb.message);
           }
       });
    });

    const newToolOpps: any[] = [];
    Object.values(newToolCandidates).forEach((cand: any) => {
        let gscScore = 0;
        if (cand.impressions > 1000) gscScore = 40;
        else if (cand.impressions > 500) gscScore = 30;
        else if (cand.impressions > 100) gscScore = 20;
        else if (cand.impressions > 20) gscScore = 10;

        let fbScore = Math.min(25, cand.feedbackCount * 10);

        let relScore = 5;
        const lowerConcept = cand.concept.toLowerCase();
        if (lowerConcept.match(/(image|photo|pic|pdf|jpg|jpeg|png|signature|passport|aadhar)/)) {
            relScore = 20;
        } else if (lowerConcept.match(/(word|excel|document|doc|text)/)) {
            relScore = 10;
        }

        let gapScore = 15;
        const totalScore = gscScore + fbScore + relScore + gapScore;

        const searchDemand = cand.impressions > 500 ? 'High' : cand.impressions > 100 ? 'Medium' : 'Low';
        const userDemand = cand.feedbackCount > 2 ? 'High' : cand.feedbackCount === 0 ? 'None' : 'Low';
        const productFit = relScore === 20 ? 'Excellent' : relScore === 10 ? 'Moderate' : 'Low';

        let priority = 'LOW';
        if (totalScore >= 75) priority = 'HIGH';
        else if (totalScore >= 50) priority = 'MEDIUM';

        let evidenceText = `GSC shows ${cand.impressions} impressions for related queries (e.g. "${cand.queries[0]}").`;
        if (cand.feedbackCount > 0) evidenceText += ` Requested by ${cand.feedbackCount} user(s).`;

        if (totalScore > 30) {
            newToolOpps.push({
                concept: cand.concept,
                score: totalScore,
                searchDemand, userDemand, productFit, existingGap: 'Yes',
                evidence: evidenceText, priority, queries: cand.queries,
                impressions: cand.impressions, clicks: cand.clicks
            });
        }
    });

    newToolOpps.sort((a, b) => b.score - a.score);
    // -------------------------------------------------------------

    rawOpps.sort((a, b) => b.priorityScore - a.priorityScore);
    const uniqueOpps: any[] = [];
    const seen = new Set();
    
    rawOpps.forEach(opp => {
       const key = opp.query + opp.type;
       if (!seen.has(key)) {
          seen.add(key);
          const rawId = Buffer.from(key).toString('base64');
          opp.id = rawId.replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
          const existing = existingActions.find(e => e.id === opp.id);
          (opp as any).status = existing ? (existing as any).status : 'Pending';
          (opp as any).completedAt = (existing as any)?.completedAt;
          (opp as any).beforeStats = (existing as any)?.beforeStats;
          
          if ((opp as any).status === 'Done' && opp.beforeStats) {
              opp.afterStats = { impressions: opp.impressions, clicks: opp.clicks, ctr: opp.ctr, position: opp.position }
          }
          uniqueOpps.push(opp);
       }
    });

    uniqueOpps.forEach((opp, idx) => {
       if (idx < uniqueOpps.length * 0.2) opp.priority = 'HIGH';
       else if (idx < uniqueOpps.length * 0.5) opp.priority = 'MEDIUM';
       else opp.priority = 'LOW';
    });

    const actionPlan = uniqueOpps.slice(0, 10);
    const actionTracker = existingActions.sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return NextResponse.json({
       success: true, connected: true,
       overview: { current: currentStats, previous: prevStats, changes },
       topQueries: (queriesRes.data?.rows || []).slice(0, 50).map((r: any) => ({
         query: r.keys?.[0], clicks: r.clicks, impressions: r.impressions, ctr: ((r.ctr || 0) * 100).toFixed(2), position: (r.position || 0).toFixed(1)
       })),
       topPages: (pagesRes.data?.rows || []).slice(0, 50).map((r: any) => ({
         page: cleanUrl(r.keys?.[0]), clicks: r.clicks, impressions: r.impressions, ctr: ((r.ctr || 0) * 100).toFixed(2), position: (r.position || 0).toFixed(1)
       })),
       performanceByDate: (dateRes.data?.rows || []).map((r: any) => ({
         date: r.keys?.[0], clicks: r.clicks, impressions: r.impressions
       })).sort((a: any, b: any) => a.date?.localeCompare(b.date || '') || 0),
       actionPlan,
       actionTracker,
       feedbackList,
       newToolOpportunities: newToolOpps,
       opportunities: uniqueOpps.slice(10, 50)
    });

  } catch (error: any) {
    if (error.code === 401 || error.message?.includes('invalid_grant')) {
      return NextResponse.json({ success: true, connected: false, error: 'Token expired or revoked. Please reconnect.' })
    }
    return NextResponse.json({ success: false, connected: false, error: error.message }, { status: 500 })
  }
}
