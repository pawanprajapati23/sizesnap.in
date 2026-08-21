import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, status, actionData } = body

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Missing id or status' }, { status: 400 })
    }

    const docRef = adminDb.collection('seo_actions').doc(id)
    const doc = await docRef.get()

    const updateData: any = { status, updatedAt: new Date().toISOString() }

    if (status === 'Done' && (!doc.exists || doc.data()?.status !== 'Done')) {
      updateData.completedAt = new Date().toISOString()
    }

    if (!doc.exists) {
       await docRef.set({
          ...actionData,
          ...updateData,
          createdAt: new Date().toISOString(),
          beforeStats: {
             impressions: actionData.impressions,
             clicks: actionData.clicks,
             ctr: actionData.ctr,
             position: actionData.position
          }
       })
    } else {
       await docRef.update(updateData)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
