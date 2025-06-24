// src/app/p/[sku]/page.tsx
export const dynamicParams = false

interface Props { params: { sku: string } }

async function fetchProduct(sku: string) {
  const url = `${process.env.NEXT_PUBLIC_SHEETS_API_BASE}?sku=${encodeURIComponent(sku)}`
  console.log('Fetch URL =', url)
  const res = await fetch(url, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json()
}

export default async function Passport({ params }: Props) {
  console.log('API =', process.env.NEXT_PUBLIC_SHEETS_API_BASE)
  console.log('SKU =', params.sku)

  const p = await fetchProduct(params.sku)

  return (
    <main className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-xl font-bold">🛍️ Product Passport: {p.name}</h1>
      <ul>
        <li>SKU: {p.sku}</li>
        <li>Material: {p.material}</li>
        <li>Country: {p.countryOfOrigin}</li>
        <li>CO₂: {p.co2_kg} kg</li>
        <li>Claim: {p.marketingClaim}</li>
        <li>Status: {p.ruleStatus}</li>
      </ul>
      <img src={p.qr_link} width={200} height={200} alt="QR code" />
    </main>
  )
}