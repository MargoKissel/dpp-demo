// app/api/qrcode/[sku]/route.ts
import type { NextRequest } from 'next/server';
import QRCode from 'qrcode';

export const runtime = 'edge';
export const revalidate = 0;

export async function GET(
  _req: NextRequest,
  context: { params: { sku: string } }
) {
  const { sku } = context.params;
  // убедитесь, что в Vercel есть эта переменная
  const base = process.env.NEXT_PUBLIC_SITE_URL!;
  const url  = `${base}/p/${encodeURIComponent(sku)}`;

  const png = await QRCode.toBuffer(url, { width: 256, margin: 1 });
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
