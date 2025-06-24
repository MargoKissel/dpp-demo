// src/app/p/[sku]/page.tsx
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

  return (
    <main className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Product Passport: {data.name}</h1>
      <ul>
        <li><strong>SKU:</strong> {data.sku}</li>
        <li><strong>Material:</strong> {data.material}</li>
        <li><strong>Country:</strong> {data.countryOfOrigin}</li>
        <li><strong>CO₂:</strong> {data.co2_kg} kg</li>
        <li><strong>Claim:</strong> {data.marketingClaim}</li>
        <li><strong>Status:</strong> {data.ruleStatus}</li>
      </ul>
      <Image
        src={data.qr_link}
        alt="QR code"
        width={200}
        height={200}
      />
    </main>
  )
}
