mport { NextRequest } from 'next/server';
import QRCode from 'qrcode';

export const revalidate = 0;

export async function GET(
  _req: NextRequest,
  { params }: { params: { sku: string } }
) {
  const site = process.env.NEXT_PUBLIC_SITE_URL!;
  const png  = await QRCode.toBuffer(`${site}/p/${params.sku}`, {
    width: 256,
    margin: 1,
  });

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
