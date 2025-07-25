// app/api/qrcode/[sku]/route.ts
import { NextRequest } from 'next/server'
import QRCode          from 'qrcode'

export const revalidate = 0

export async function GET(
  _req: NextRequest,                       // ← 1‑й аргумент — NextRequest
  { params }: { params: { sku: string } }  // ← 2‑й аргумент — context c params
) {
  const site = process.env.NEXT_PUBLIC_SITE_URL
  if (!site) return new Response('Missing NEXT_PUBLIC_SITE_URL', { status: 500 })

  const url = `${site}/p/${params.sku}`

  let png: Buffer
  try {
    png = await QRCode.toBuffer(url, { width: 256, margin: 1 })
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
