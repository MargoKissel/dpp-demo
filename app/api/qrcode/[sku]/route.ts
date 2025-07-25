import type { NextRequest } from 'next/server';
import QRCode from 'qrcode';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { sku: string } }) {
  const url = `${process.env.NEXT_PUBLIC_SITE_URL}/p/${params.sku}`;
  const buffer = await QRCode.toBuffer(url, { width: 256, margin: 1 });
  return new Response(buffer, {
    headers: { 'Content-Type': 'image/png' },
  });
}
