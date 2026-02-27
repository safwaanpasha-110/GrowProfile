import { NextRequest, NextResponse } from 'next/server'
import { verifyAuth } from '@/lib/auth'

/**
 * GET /api/instagram/auth
 * Redirects the user to Instagram's OAuth authorization page.
 * Requires Firebase auth token. The user's DB id is encoded in the state param.
 */
export async function GET(request: NextRequest) {
  const user = await verifyAuth(request)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const clientId = process.env.META_APP_ID  // Facebook App ID for OAuth
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI

  if (!clientId || !redirectUri) {
    return NextResponse.json(
      { error: 'Instagram app not configured' },
      { status: 500 }
    )
  }

  // Scopes for Instagram Business API
  const scopes = [
    'instagram_business_basic',
    'instagram_business_manage_messages',
    'instagram_business_manage_comments',
    'instagram_business_content_publish',
  ].join(',')

  // Encode the user's DB id in the state param (so callback can identify them)
  const state = Buffer.from(
    JSON.stringify({ userId: user.id, ts: Date.now() })
  ).toString('base64url')

  const authUrl = new URL('https://www.instagram.com/oauth/authorize')
  authUrl.searchParams.set('client_id', clientId)
  authUrl.searchParams.set('redirect_uri', redirectUri)
  authUrl.searchParams.set('response_type', 'code')
  authUrl.searchParams.set('scope', scopes)
  authUrl.searchParams.set('state', state)

  return NextResponse.json({ authUrl: authUrl.toString() })
}
