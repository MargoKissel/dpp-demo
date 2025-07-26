// app/api/qrcode/[sku]/route.ts
import QRCode from 'qrcode';

export const dynamic = 'force-dynamic';

/*  ❌ НЕТ строгой типизации второго аргумента – ставим any  */
export async function GET(
  _req: Request,
  { params }: any          // ← важно
) {
  const site = process.env.NEXT_PUBLIC_SITE_URL;
  if (!site) {
    return new Response('Missing NEXT_PUBLIC_SITE_URL', { status: 500 });
  }

  const { sku } = params;

  const png = await QRCode.toBuffer(`${site}/p/${sku}`, {
    width: 256,
    margin: 1,
  });

  return new Response(png, {
    headers: { 'Content-Type': 'image/png' },
  });
}
