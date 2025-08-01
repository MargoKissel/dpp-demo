// app/p/[sku]/page.tsx
import { fetchProduct }   from '@/lib/fetchProduct'
import { normalizeImageUrl } from '@/lib/normalizeImageUrl'
import { EcoButton }      from '@/components/EcoButton'

export const revalidate     = 60
export const dynamic        = 'force-dynamic'
export const dynamicParams  = true

// Небольшие словари для перевода
const proxied = `/api/image?src=${encodeURIComponent(normalizeImageUrl(product.image_url))}`
const mat = { Cotton:'Baumwolle', Denim:'Denim', Leather:'Leder' } as const
const ctr = { Turkey:'Türkei', Germany:'Deutschland', Spain:'Spanien' } as const
const artikel = { 'T-Shirt Basic':'Dieses', 'Backpack Eco':'Dieser' } as const

export default async function ProductPage({ params }: { params:{sku:string} }) {
  const product = await fetchProduct(params.sku)

  if (!product?.sku)
    return <main className="p-8 text-red-600">
             <h1 className="text-2xl font-semibold">Fehler – SKU {params.sku}</h1>
             <p>Produkt nicht gefunden.</p>
           </main>

  const material   = mat[product.material] ?? product.material
  const country    = ctr[product.country]  ?? product.country
  const co2        = (+product.co2_kg).toFixed(3).replace(/\.?0+$/,'')
  const img        = normalizeImageUrl(product.image_url)
  const artikelWrt = artikel[product.name] ?? 'Dieses'

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4">
      <article className="max-w-md w-full bg-white rounded-xl shadow overflow-hidden">
        {/* --- картинка -------------------------------------------- */}
        {img && (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
            <img src={img}
                 alt={product.name}
                 className="object-contain max-h-full" />
          </div>
        )}

        {/* --- карточка -------------------------------------------- */}
        <div className="p-6">
          <h1 className="text-3xl font-extrabold mb-4">{product.name}</h1>

          <dl className="space-y-1 text-lg mb-4">
            <div><dt className="font-semibold inline">Material:&nbsp;</dt>
                 <dd className="inline">{material}</dd></div>
            <div><dt className="font-semibold inline">Herstellungsland:&nbsp;</dt>
                 <dd className="inline">{country}</dd></div>
            <div><dt className="font-semibold inline">CO₂-Fußabdruck:&nbsp;</dt>
                 <dd className="inline">{co2}&nbsp;kg&nbsp;CO₂</dd></div>
          </dl>

          <p className="mb-6 leading-relaxed">
            {artikelWrt}&nbsp;{product.name} wurde aus {material} in {country} gefertigt.
            Die Kohlendioxid-Emissionen belaufen sich auf {co2}&nbsp;kg&nbsp;CO₂.
          </p>

          <EcoButton sku={product.sku} />
        </div>
      </article>
    </div>
  )
}
