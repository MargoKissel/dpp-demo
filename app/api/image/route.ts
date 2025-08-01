// app/api/image/route.ts
import { NextRequest } from 'next/server'

export const runtime    = 'edge'
export const revalidate = 86_400          // <- литерал, 24 h

export async function GET(req: NextRequest) {
  const src = req.nextUrl.searchParams.get('src')
  if (!src) return new Response('missing src', { status: 400 })

  try {
    const upstream = await fetch(src, { redirect: 'follow' })
    if (!upstream.ok) throw new Error(`upstream ${upstream.status}`)

    const headers = new Headers()
    headers.set('Content-Type', upstream.headers.get('Content-Type') ?? 'image/jpeg')
    headers.set(
      'Cache-Control',
      upstream.headers.get('Cache-Control') ?? 'public, max-age=86400'
    )

    return new Response(upstream.body, { status: 200, headers })
  } catch {
    return new Response('image proxy error', { status: 502 })
  }
}
