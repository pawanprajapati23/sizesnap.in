import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const eventsRef = adminDb.collection('analytics_events_raw')
    
    // For performance, we limit to 10000 events or so, or ideally use aggregated stats
    // Since this is just an admin panel for a single project, we will aggregate on the fly
    const rangeSnap = await eventsRef.limit(10000).get()

    const toolStats: Record<string, { uses: number, downloads: number, feedback: number }> = {}

    rangeSnap.forEach(doc => {
      const data = doc.data()
      const tool = data.toolName || data.toolSlug || 'Unknown'
      
      if (!toolStats[tool]) {
         toolStats[tool] = { uses: 0, downloads: 0, feedback: 0 }
      }
      
      if (data.eventName === 'tool_open') {
         toolStats[tool].uses++
      }
      if (data.eventName === 'tool_download') {
         toolStats[tool].downloads++
      }
    })

    // Fetch Feedback stats
    const msgRef = adminDb.collection('user_feedback')
    const msgSnap = await msgRef.get()
    
    msgSnap.forEach(doc => {
       const data = doc.data()
       // Attempt to extract tool slug from URL or metadata
       let tool = 'Unknown'
       if (data.pageUrl) {
          try {
             const url = new URL(data.pageUrl)
             const parts = url.pathname.split('/').filter(Boolean)
             if (parts.length > 0) tool = parts[0]
          } catch (e) {
             tool = data.pageUrl
          }
       }
       if (data.toolId || data.toolSlug) tool = data.toolId || data.toolSlug

       if (toolStats[tool]) {
          toolStats[tool].feedback++
       } else {
          // Normalize matching
          const matchedToolKey = Object.keys(toolStats).find(k => tool.includes(k) || k.includes(tool))
          if (matchedToolKey) {
             toolStats[matchedToolKey].feedback++
          }
       }
    })

    return NextResponse.json({ success: true, stats: toolStats })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
