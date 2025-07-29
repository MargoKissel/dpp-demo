// app/p/[sku]/page.tsx
import { fetchProduct } from '@/lib/fetchProduct'
import { EcoButton }    from '@/components/EcoButton'
import Image            from 'next/image'

export const dynamic       = 'force-dynamic'
export const dynamicParams = true
export const revalidate    = 60

export function generateMetadata({ params }: { params: { sku: string } }) {
  return {
    title: `Digitaler Produktpass – SKU ${params.sku}`,
    description: `Öffne den digitalen Produktpass für die SKU ${params.sku}.`,
  }
}

export default async function ProductPage({ params }: any) {
  const { sku } = params
  let product: any

  try {
    product = await fetchProduct(sku)
    if (!product?.sku) throw new Error('nicht gefunden')
  } catch (err: any) {
    return (
      <main className="p-8 text-red-600">
        <h1 className="text-2xl font-semibold">Fehler – SKU {sku}</h1>
        <p>{err.message}</p>
      </main>
    )
  }

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6 font-sans">
      <h1 className="text-3xl font-bold">{product.name}</h1>

      {product.image_url && (
        <div className="w-full h-64 relative overflow-hidden rounded-lg shadow">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            style={{ objectFit: 'contain' }}
            unoptimized
          />
        </div>
      )}

      <dl className="grid gap-y-2">
        <div>
          <dt className="font-medium">Material:</dt>
          <dd>{product.material}</dd>
        </div>
        <div>
          <dt className="font-medium">Herkunftsland:</dt>
          <dd>{product.country}</dd>
        </div>
        <div>
          <dt className="font-medium">CO₂-Fußabdruck:</dt>
          <dd>{product.co2_kg} kg</dd>
        </div>
      </dl>

      {/* Marketing Claim nur bei rule_status === 'ok' */}
      {product.rule_status === 'ok' && product.marketing_claim && (
        <p className="mt-4 px-4 py-2 bg-green-100 text-green-800 rounded-md">
          <strong>Marketing‑Claim:</strong> {product.marketing_claim}
        </p>
      )}

      <p className="mt-6 text-base leading-relaxed">
        Dieses Produkt besteht aus <strong>{product.material}</strong> in{' '}
        <strong>{product.country}</strong> und emittiert{' '}
        <strong>{product.co2_kg} kg CO₂</strong>.
      </p>

      <EcoButton sku={sku} />

      {/* QR-Code */}
      <div className="mt-8">
        <h2 className="font-semibold mb-2">QR-Code scannen</h2>
        <img
          src={`/api/qrcode/${sku}`}
          alt={`QR-Code für SKU ${sku}`}
          width={256}
          height={256}
          className="rounded border"
        />
      </div>
    </main>
  )
}
