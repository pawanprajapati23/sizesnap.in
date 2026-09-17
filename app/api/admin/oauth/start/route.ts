import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { randomBytes } from 'crypto'
import { cookies } from 'next/headers'

export async function GET() {
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

  const state = randomBytes(32).toString('hex')

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/webmasters.readonly'],
    prompt: 'consent',
    state: state
  })

  const cookieStore = await cookies()
  cookieStore.set('oauth_state', state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 10, // 10 minutes
    sameSite: 'lax'
  })

  return NextResponse.redirect(authUrl)
}
