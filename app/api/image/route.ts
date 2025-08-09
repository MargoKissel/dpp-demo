// app/api/image/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { normalizeImageUrl } from '@/lib/normalizeImageUrl';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const src = searchParams.get('src');
  if (!src) return NextResponse.json({ error: 'missing src' }, { status: 400 });

  const url = normalizeImageUrl(decodeURIComponent(src));
  if (!url) return NextResponse.json({ error: 'bad src' }, { status: 400 });

  const upstream = await fetch(url, {
    // некоторые CDN/Drive требуют «нормальный» UA/Referer
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': '*/*' },
    redirect: 'follow',
    cache: 'no-store',
  });

  if (!upstream.ok) {
    return NextResponse.json({ error: 'upstream ' + upstream.status }, { status: 502 });
  }

  const buff = await upstream.arrayBuffer();
  const ct = upstream.headers.get('content-type') || 'image/jpeg';

  return new NextResponse(buff, {
    headers: {
      'content-type': ct,
      'cache-control': 'public, max-age=86400, immutable',
    },
  });
}
