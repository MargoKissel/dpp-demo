import { NextRequest } from 'next/server'
import QRCode from 'qrcode'

export const revalidate = 0

export async function GET(
  _req: NextRequest,
  { params }: { params: { sku: string } }
) {
  // dùng biến окружения для базового URL
  const site = process.env.NEXT_PUBLIC_SITE_URL!
  if (!site) {
    return new Response('Missing NEXT_PUBLIC_SITE_URL', { status: 500 })
  }

  const text = `${site}/p/${params.sku}`
  let buffer: Buffer
  try {
    buffer = await QRCode.toBuffer(text, { width: 256, margin: 1 })
  } catch (e) {
    return new Response('QR generation error', { status: 500 })
  }

  return new Response(buffer, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
