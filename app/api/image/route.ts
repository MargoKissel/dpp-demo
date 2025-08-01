// app/api/image/route.ts
import { NextRequest } from 'next/server'

// Edge-runtime => минимальная задержка + бесплатный CDN от Vercel
export const runtime    = 'edge'
export const revalidate = 60 * 60 * 24        // 24 h cache

export async function GET(req: NextRequest) {
  // исходный URL передаём как /api/image?src=…
  const src = req.nextUrl.searchParams.get('src')
  if (!src) return new Response('missing src', { status: 400 })

  try {
    const upstream = await fetch(src, { redirect: 'follow' })
    if (!upstream.ok) throw new Error(`upstream ${upstream.status}`)

    // пробрасываем mime-type, чтобы <img> понимал формат
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
