import { fetchProduct } from '@/lib/fetchProduct'
import { EcoButton }    from '@/components/EcoButton'
import Image            from 'next/image'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export function generateMetadata({ params }: { params: { sku: string } }) {
  return {
    title: `Digitaler Produktpass – SKU ${params.sku}`,
    description: `Digitaler Produktpass für SKU ${params.sku}.`,
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
    if (!product?.sku) throw new Error('Produkt nicht gefunden')
  } catch (err: any) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-xl shadow text-red-600">
          <h1 className="text-2xl font-semibold mb-2">Fehler – SKU {sku}</h1>
          <p>{err.message}</p>
        </div>
      </div>
    )
  }

  // Форматируем CO₂ с точкой и 3 знаками
  const co2 = parseFloat(product.co2_kg).toFixed(3)

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <article className="w-full max-w-lg bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Изображение */}
        {product.image_url && (
          <div className="w-full h-72 relative bg-gray-100">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              unoptimized
            />
          </div>
        )}

        <div className="p-6 space-y-6">
          {/* Название */}
          <h1 className="text-3xl font-bold leading-tight">{product.name}</h1>

          {/* Атрибуты */}
          <dl className="grid grid-cols-2 gap-y-2 text-base">
            <dt className="font-medium">Material</dt>
            <dd className="text-right">{product.material}</dd>
            <dt className="font-medium">Herkunftsland</dt>
            <dd className="text-right">{product.country}</dd>
            <dt className="font-medium">CO₂-Fußabdruck</dt>
            <dd className="text-right">{co2} kg</dd>
          </dl>

          {/* Описание (если есть) */}
          {product.description && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Marketing‑Claim */}
          {product.rule_status === 'ok' && product.marketing_claim && (
            <div className="p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded">
              <p className="italic text-center">„{product.marketing_claim}“</p>
            </div>
          )}

          {/* Кнопка */}
          <div className="flex justify-center">
            <EcoButton sku={sku} />
          </div>
        </div>
      </article>
    </div>
  )
}
