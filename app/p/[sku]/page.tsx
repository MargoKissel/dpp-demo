// app/p/[sku]/page.tsx
import { fetchProduct }         from '@/lib/fetchProduct'
import { EcoButton }            from '@/components/EcoButton'
import Image                     from 'next/image'

export default async function ProductPage({ params }: any) {
  const { sku } = params
  let product: any

  try {
    product = await fetchProduct(sku)
    if (!product?.sku) throw new Error('not-found')
  } catch {
    return <p className="p-8 text-red-600">Ошибка загрузки SKU {sku}</p>
  }

  return (
    <main className="max-w-2xl mx-auto p-6 space-y-8">
      {/* Название и фото */}
      <div className="flex flex-col sm:flex-row items-center gap-6">
        {product.image_url && (
          <div className="w-48 h-48 relative">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover rounded-lg shadow-md"
              unoptimized
            />
          </div>
        )}
        <h1 className="text-3xl font-bold">{product.name}</h1>
      </div>

      {/* Основные данные в карточке */}
      <div className="bg-white shadow-sm rounded-lg p-6 grid grid-cols-1 gap-4">
        <p className="text-gray-700">
          <span className="font-semibold">Материал:</span> {product.material}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Страна производства:</span> {product.country}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Углеродный след:</span> {product.co2_kg} кг CO₂
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Маркетинговое заявление:</span>{' '}
          <span className={product.rule_status === 'warning' ? 'text-red-500' : 'text-green-600'}>
            {product.marketing_claim}
          </span>
        </p>
      </div>

      {/* Описание (по-русски или нем.) */}
      <p className="prose">
        Dieses T-Shirt wurde aus <strong>{product.material}</strong> in <strong>{product.country}</strong> gefertigt.&nbsp;
        Die Kohlendioxid‑Emissionen liegen bei <strong>{product.co2_kg} kg</strong>.
      </p>

      {/* Кнопка «Эко‑пункты» */}
      <EcoButton sku={sku} />

      {/* QR‑код */}
      <div className="text-center">
        <h2 className="text-lg font-medium mb-2">QR Code zum Scannen</h2>
        <img
          src={`/api/qrcode/${sku}`}
          alt={`QR code for SKU ${sku}`}
          width={200}
          height={200}
          className="inline-block"
        />
      </div>
    </main>
  )
}
