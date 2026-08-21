import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '24hr'

    const now = new Date()
    const todayStart = new Date(now)
    todayStart.setHours(0, 0, 0, 0)

    let rangeStart = new Date(now)
    if (timeRange === '24hr') rangeStart.setHours(now.getHours() - 24)
    if (timeRange === '7day') rangeStart.setDate(now.getDate() - 7)
    if (timeRange === '30day') rangeStart.setDate(now.getDate() - 30)
    if (timeRange === '3month') rangeStart.setMonth(now.getMonth() - 3)

    // 1. Fetch Analytics Events
    const eventsRef = adminDb.collection('analytics_events_raw')
    
    // Server-side fetching is fast, but we'll limit to 5000 to prevent lambda memory exhaustion on huge sites
    const rangeQ = eventsRef
      .where('timestamp', '>=', rangeStart)
      .limit(5000)
    
    const rangeSnap = await rangeQ.get()

    let rangeVisitors = 0
    let rangeDownloads = 0
    let todayVisitors = 0
    
    const toolCounts: Record<string, number> = {}

    rangeSnap.forEach(doc => {
      const data = doc.data()
      if (data.eventName === 'tool_open') {
         rangeVisitors++
         
         // Calculate today visitors simultaneously
         const eventTime = data.timestamp?.toDate ? data.timestamp.toDate() : new Date(data.timestamp)
         if (eventTime >= todayStart) {
            todayVisitors++
         }

         const tool = data.toolName || data.toolSlug || 'Unknown'
         toolCounts[tool] = (toolCounts[tool] || 0) + 1
      }
      if (data.eventName === 'tool_download') {
         rangeDownloads++
      }
    })

    const sortedTools = Object.entries(toolCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    // 2. Fetch Recent Feedback Messages
    const msgRef = adminDb.collection('user_feedback')
    const msgQ = msgRef.orderBy('timestamp', 'desc').limit(50)
    const msgSnap = await msgQ.get()
    
    const messages: any[] = []
    let totalFeedbackCount = 0;
    
    // Get total feedback count for this range
    const allMsgSnap = await msgRef.where('timestamp', '>=', rangeStart).get()
    totalFeedbackCount = allMsgSnap.size

    msgSnap.forEach(doc => {
      const data = doc.data()
      messages.push({
         id: doc.id,
         ...data,
         // Convert timestamp to ISO string for JSON serialization
         timestamp: data.timestamp?.toDate ? data.timestamp.toDate().toISOString() : new Date().toISOString()
      })
    })

    let organicClicks: number | null = null;
    try {
       const tokenDoc = await adminDb.collection('admin_settings').doc('google_oauth').get()
       if (tokenDoc.exists) {
          const { tokens } = tokenDoc.data() as any
          if (tokens && tokens.access_token) {
             const { google } = require('googleapis')
             const oauth2Client = new google.auth.OAuth2(
                process.env.GOOGLE_CLIENT_ID,
                process.env.GOOGLE_CLIENT_SECRET,
                process.env.GOOGLE_REDIRECT_URI || 'https://sizesnap.in/api/admin/oauth/callback'
             )
             oauth2Client.setCredentials(tokens)
             const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client })
             
             let siteUrl = 'https://sizesnap.in/'
             try {
                const sitesRes = await searchconsole.sites.list();
                const sites = sitesRes.data.siteEntry || [];
                const matchedSite = sites.find((s: any) => s.siteUrl?.includes('sizesnap.in'));
                if (matchedSite && matchedSite.siteUrl) siteUrl = matchedSite.siteUrl;
                else if (sites.length > 0 && sites[0].siteUrl) siteUrl = sites[0].siteUrl;
             } catch(e) {}

             const startStr = rangeStart.toISOString().split('T')[0]
             const endStr = now.toISOString().split('T')[0]
             
             const overviewRes = await searchconsole.searchanalytics.query({
                siteUrl,
                requestBody: { startDate: startStr, endDate: endStr, rowLimit: 1 }
             })
             organicClicks = (overviewRes.data.rows && overviewRes.data.rows.length > 0) ? (overviewRes.data.rows[0].clicks || 0) : 0;
          }
       }
    } catch (gscError) {
       console.error("Dashboard GSC Error:", gscError)
    }

    return NextResponse.json({
      success: true,
      stats: {
        totalVisitors: rangeVisitors,
        todayVisitors: todayVisitors,
        totalDownloads: rangeDownloads,
        feedbackCount: totalFeedbackCount,
        organicClicks: organicClicks
      },
      toolStats: sortedTools,
      messages: messages
    })

  } catch (error: any) {
    console.error('API Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
