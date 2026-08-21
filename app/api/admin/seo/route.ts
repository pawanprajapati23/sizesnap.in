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
      // If a new access token or refresh token is issued, merge it into DB
      const updatedTokens = {
        ...tokens,
        ...newTokens
      }
      await adminDb.collection('admin_settings').doc('google_oauth').set({
        tokens: updatedTokens,
        updatedAt: new Date().toISOString()
      }, { merge: true })
    })

    const searchconsole = google.searchconsole({ version: 'v1', auth: oauth2Client })
    const siteUrl = 'https://sizesnap.in/'

    // Calculate dates
    const endDate = new Date()
    const startDate = new Date()
    if (timeRange === '7days') {
      startDate.setDate(endDate.getDate() - 7)
    } else if (timeRange === '28days') {
      startDate.setDate(endDate.getDate() - 28)
    } else if (timeRange === '3months') {
      startDate.setMonth(endDate.getMonth() - 3)
    }

    const start = startDate.toISOString().split('T')[0]
    const end = endDate.toISOString().split('T')[0]

    // Fetch Overview (no dimensions)
    const overviewRes = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: start,
        endDate: end,
        rowLimit: 1
      }
    })

    const overviewRow = overviewRes.data.rows && overviewRes.data.rows.length > 0 
      ? overviewRes.data.rows[0] 
      : { clicks: 0, impressions: 0, ctr: 0, position: 0 }

    const overview = {
      clicks: overviewRow.clicks || 0,
      impressions: overviewRow.impressions || 0,
      ctr: ((overviewRow.ctr || 0) * 100).toFixed(2),
      position: (overviewRow.position || 0).toFixed(1)
    }

    // Fetch Top Queries
    const queriesRes = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: start,
        endDate: end,
        dimensions: ['query'],
        rowLimit: 50
      }
    })
    
    // Fetch Top Pages
    const pagesRes = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: start,
        endDate: end,
        dimensions: ['page'],
        rowLimit: 50
      }
    })

    // Fetch Date-wise performance
    const dateRes = await searchconsole.searchanalytics.query({
      siteUrl,
      requestBody: {
        startDate: start,
        endDate: end,
        dimensions: ['date'],
        rowLimit: 100
      }
    })

    // Calculate opportunities based on high impressions, low CTR, or low position
    const opportunities = (queriesRes.data.rows || [])
      .filter(row => (row.impressions || 0) > 100 && (row.position || 0) > 5)
      .slice(0, 20)
      .map(row => {
        let rec = "Improve content relevance or add exact-match keywords to headings."
        if ((row.position || 0) <= 10 && (row.ctr || 0) < 0.03) {
          rec = "Good ranking but low clicks. Improve meta title and description for better CTR."
        }
        return {
          query: row.keys?.[0] || '',
          page: 'Various', // We'd need page+query dimension to be exact, keeping it simple
          impressions: row.impressions,
          clicks: row.clicks,
          ctr: ((row.ctr || 0) * 100).toFixed(2),
          position: (row.position || 0).toFixed(1),
          recommendation: rec
        }
      })

    return NextResponse.json({
       success: true,
       connected: true,
       overview,
       topQueries: (queriesRes.data.rows || []).map(r => ({
         query: r.keys?.[0], clicks: r.clicks, impressions: r.impressions, ctr: ((r.ctr || 0) * 100).toFixed(2), position: (r.position || 0).toFixed(1)
       })),
       topPages: (pagesRes.data.rows || []).map(r => ({
         page: r.keys?.[0], clicks: r.clicks, impressions: r.impressions, ctr: ((r.ctr || 0) * 100).toFixed(2), position: (r.position || 0).toFixed(1)
       })),
       performanceByDate: (dateRes.data.rows || []).map(r => ({
         date: r.keys?.[0], clicks: r.clicks, impressions: r.impressions
       })).sort((a, b) => a.date?.localeCompare(b.date || '') || 0),
       opportunities
    });

  } catch (error: any) {
    console.error('SEO API Error:', error)
    // If auth error (e.g., token revoked), we might want to return connected: false
    if (error.code === 401 || error.message.includes('invalid_grant')) {
      return NextResponse.json({ success: true, connected: false, error: 'Token expired or revoked. Please reconnect.' })
    }
    return NextResponse.json({ success: false, connected: false, error: error.message }, { status: 500 })
  }
}
