// app/api/qrcode/[sku]/route.ts
import QRCode from 'qrcode';

export const runtime  = 'nodejs';       // ← добавили
export const dynamic  = 'force-dynamic';

export async function GET(_req: Request, { params }: any) {
  const base = process.env.NEXT_PUBLIC_SITE_URL
            ?? process.env.VERCEL_URL
            ?? 'https://dpp-demo-lac.vercel.app';

  const url  = base.startsWith('http') ? base : `https://${base}`;
  const png  = await QRCode.toBuffer(`${url}/p/${params.sku}`, { width: 256, margin: 1 });

  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
}
