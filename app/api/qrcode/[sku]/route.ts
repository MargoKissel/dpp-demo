// app/api/qrcode/[sku]/route.ts
import QRCode from 'qrcode'

export const revalidate = 0

export async function GET(
  request: Request,
  context: any      // <–– здесь вместо вашего строгого типа
) {
  const { sku } = context.params as { sku: string }

  const site = process.env.NEXT_PUBLIC_SITE_URL!
  if (!site) {
    return new Response('Missing NEXT_PUBLIC_SITE_URL', { status: 500 })
  }

  const text = `${site}/p/${sku}`
  let png: Buffer
  try {
    png = await QRCode.toBuffer(text, { width: 256, margin: 1 })
  } catch {
    return new Response('QR generation failed', { status: 500 })
  }

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
