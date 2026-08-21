import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { adminDb } from '@/lib/firebase-admin'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'No authorization code found.' }, { status: 400 })
  }

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
  const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || 'https://sizesnap.in/api/admin/oauth/callback'

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return NextResponse.json({ error: 'Missing OAuth credentials in environment variables.' }, { status: 500 })
  }

  const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI
  )

  try {
    const { tokens } = await oauth2Client.getToken(code)
    
    // Secure token storage in Firebase Admin Database
    await adminDb.collection('admin_settings').doc('google_oauth').set({
      tokens,
      updatedAt: new Date().toISOString()
    })

    // Redirect back to SEO dashboard
    return NextResponse.redirect(new URL('/admin/seo', request.url))
  } catch (error: any) {
    console.error('Error fetching OAuth tokens:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
