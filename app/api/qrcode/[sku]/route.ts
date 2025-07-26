// app/api/qrcode/[sku]/route.ts
// @ts-nocheck
import QRCode from 'qrcode';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: { sku: string } }
) {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!site) return new Response('Missing NEXT_PUBLIC_SITE_URL', { status: 500 });

  const png = await QRCode.toBuffer(`${site}/p/${params.sku}`, {
    width: 256,
    margin: 1,
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
}
