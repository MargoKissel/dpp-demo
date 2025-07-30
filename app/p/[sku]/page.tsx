import { fetchProduct } from '@/lib/fetchProduct'
import { EcoButton }    from '@/components/EcoButton'
import Image            from 'next/image'

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 60

export function generateMetadata({ params }: { params: { sku: string } }) {
  return {
    title: `Digitaler Produktpass – SKU ${params.sku}`,
    description: `Öffne den digitalen Produktpass für die SKU ${params.sku}.`,
  }
}

export default async function Page({
  params,
}: {
  params: { sku: string }
}): Promise<JSX.Element> {
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

  const co2 = parseFloat(product.co2_kg).toFixed(3)

  return (
    <main className="max-w-md mx-auto p-6 space-y-6 bg-white rounded-2xl shadow-md">
      {product.image_url && (
        <div className="w-full h-64 relative rounded-lg overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            style={{ objectFit: 'contain' }}
            unoptimized
          />
        </div>
      )}

      <h1 className="text-3xl font-extrabold">{product.name}</h1>

      <dl className="space-y-2">
        <div className="flex justify-between">
          <dt className="font-medium">Material:</dt>
          <dd>{product.material}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="font-medium">Herkunftsland:</dt>
          <dd>{product.country}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="font-medium">CO₂-Fußabdruck:</dt>
          <dd>{co2} kg</dd>
        </div>
      </dl>

      {product.rule_status === 'ok' && product.marketing_claim && (
        <blockquote className="p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded">
          <p className="italic">„{product.marketing_claim}“</p>
        </blockquote>
      )}

      <div className="pt-4">
        <EcoButton sku={sku} />
      </div>
    </main>
  )
}
