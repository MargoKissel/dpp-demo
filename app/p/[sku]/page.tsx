import Image from 'next/image'
import { EcoButton } from '@/components/EcoButton'
import { fetchProduct } from '@/lib/fetchProduct'

export const dynamic = 'force-dynamic'
export const dynamicParams = true
export const revalidate = 60
export function generateMetadata({ params }) {
  return {
    title: `Digital Product Passport – SKU ${params.sku}`,
    description: `Open digital passport for product SKU ${params.sku}.`,
  }
}

export default async function ProductPage({ params }) {
  const { sku } = params
  let product
  try {
    product = await fetchProduct(sku)
    if (!product?.sku) throw new Error('not-found')
  } catch {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-xl">Fehler – Produkt nicht gefunden.</p>
      </main>
    )
  }

  return (
    <main className="max-w-md mx-auto p-4 space-y-6">
      {/* Product Card */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">
        {product.image_url && (
          <div className="relative w-full h-64">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-700 mb-4">{product.material} &middot; {product.country}</p>
          <p className="text-gray-800 mb-4 leading-relaxed">
            Dieses {product.name} wurde aus {product.material} in {product.country} gefertigt. CO₂-Emissionen: {product.co2_kg} kg.
          </p>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6 text-sm text-gray-600">
            <div>
              <dt className="font-medium">Marketing Claim:</dt>
              <dd>{product.marketing_claim}</dd>
            </div>
            <div>
              <dt className="font-medium">Last Modified:</dt>
              <dd>{new Date(product.last_modified).toLocaleDateString('de-DE')}</dd>
            </div>
            <div className="col-span-2">
              <dt className="font-medium">Row Hash:</dt>
              <dd className="break-all text-xs text-gray-400">{product.row_hash}</dd>
            </div>
          </dl>
          {/* Eco Button */}
          <EcoButton sku={sku} />
        </div>
      </div>

      {/* QR Code Section */}
      <section className="text-center">
        <h2 className="font-semibold mb-3">QR Code zum Scannen</h2>
        <img
          src={`/api/qrcode/${sku}`}
          alt={`QR code for SKU ${sku}`}
          width={200}
          height={200}
          className="mx-auto"
        />
      </section>
    </main>
  )
}
