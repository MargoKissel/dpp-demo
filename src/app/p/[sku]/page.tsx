export const dynamic = 'force-dynamic';

import Image from 'next/image'
interface Props { params: { sku: string } }

async function fetchProduct(sku: string) {
  const url = `${process.env.NEXT_PUBLIC_SHEETS_API_BASE}?sku=${encodeURIComponent(sku)}`
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export default async function ProductPage({ params }: Props) {
  const data = await fetchProduct(params.sku)
  // …
}