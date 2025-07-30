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

function driveUrlToDirect(url: string): string {
  // подходит для ссылок вида https://drive.google.com/file/d/FILE_ID/view...
  const m = url.match(/\/d\/([a-zA-Z0-9_-]+)\//)
  if (m?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${m[1]}`
  }
  // иначе возвращаем как есть
  return url
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
      <main className="flex items-center justify-center min-h-screen p-8">
        <div className="text-center text-red-600">
          <h1 className="text-2xl font-semibold">Fehler – SKU {sku}</h1>
          <p>{err.message}</p>
        </div>
      </main>
    )
  }

  const co2 = parseFloat(product.co2_kg).toFixed(3)
  const imgUrl = product.image_url
    ? driveUrlToDirect(product.image_url)
    : null

  return (
    <main className="flex flex-col items-center min-h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md overflow-hidden">
        {/* — Изображение */}
        {imgUrl && (
          <div className="w-full h-64 relative bg-gray-100">
            <Image
              src={imgUrl}
              alt={product.name}
              fill
              style={{ objectFit: 'contain' }}
              unoptimized
            />
          </div>
        )}

        <div className="p-6 space-y-4">
          {/* — Название */}
          <h1 className="text-3xl font-bold text-center">{product.name}</h1>

          {/* — Основные атрибуты */}
          <dl className="grid grid-cols-2 gap-y-2">
            <dt className="font-medium">Material:</dt>
            <dd className="text-right">{product.material}</dd>
            <dt className="font-medium">Herkunftsland:</dt>
            <dd className="text-right">{product.country}</dd>
            <dt className="font-medium">CO₂‑Fußabdruck:</dt>
            <dd className="text-right">{co2} kg</dd>
          </dl>

          {/* — Marketing‑Claim */}
          {product.rule_status === 'ok' && product.marketing_claim && (
            <blockquote className="p-4 bg-green-50 border-l-4 border-green-500 text-green-800 rounded">
              <p className="italic text-center">„{product.marketing_claim}“</p>
            </blockquote>
          )}

          {/* — Eco Button */}
          <div className="flex justify-center">
            <EcoButton sku={sku} />
          </div>
        </div>
      </div>
    </main>
  )
}
