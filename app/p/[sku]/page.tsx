// app/p/[sku]/page.tsx
import MiniHub from '@/components/MiniHub';
import { fetchProductAndRelated } from '@/lib/fetchProduct';

export const revalidate    = 60;
export const dynamic       = 'force-dynamic';
export const dynamicParams = true;

const mat = { Cotton:'Baumwolle', Denim:'Denim', Leather:'Leder' } as const;
const ctr = { Turkey:'Türkei', Germany:'Deutschland', Spain:'Spanien', Tunisia:'Tunesien', China:'China' } as const;

export default async function ProductPage({ params }: { params:{sku:string} }) {
  const { product, related } = await fetchProductAndRelated(params.sku);

  if (!product?.sku) {
    return (
      <main className="p-8 text-red-600">
        <h1 className="text-2xl font-semibold">Fehler – SKU {params.sku}</h1>
        <p>Produkt nicht gefunden.</p>
      </main>
    );
  }

  const material = mat[product.material as keyof typeof mat] ?? product.material ?? '';
  const country  = ctr[product.country as keyof typeof ctr] ?? product.country ?? '';
  const co2Num   = Number(product.co2_kg);
  const co2      = isFinite(co2Num)
    ? co2Num.toLocaleString('de-DE', { minimumFractionDigits: 0, maximumFractionDigits: 3 })
    : String(product.co2_kg ?? '');

  const img = product.image_url
    ? `/api/image?src=${encodeURIComponent(String(product.image_url))}`
    : null;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center p-4">
      <article className="max-w-md w-full bg-white rounded-xl shadow overflow-hidden">
        {img && (
          <div className="w-full h-64 bg-gray-100 flex items-center justify-center">
            <img src={img} alt={product.name} className="object-contain max-h-full" />
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-extrabold mb-4">{product.name}</h1>

          <dl className="space-y-1 text-lg mb-4">
            <div><dt className="font-semibold inline">Material:&nbsp;</dt><dd className="inline">{material}</dd></div>
            <div><dt className="font-semibold inline">Herstellungsland:&nbsp;</dt><dd className="inline">{country}</dd></div>
            <div><dt className="font-semibold inline">CO₂-Fußabdruck:&nbsp;</dt><dd className="inline">{co2}&nbsp;kg&nbsp;CO₂</dd></div>
          </dl>

          <p className="mb-6 leading-relaxed">
            Dieses {product.name} wurde aus {material} in {country} gefertigt.
            Die Kohlendioxid-Emissionen belaufen sich auf {co2}&nbsp;kg&nbsp;CO₂.
          </p>

          {/* Карусель похожих */}
          <MiniHub items={related} />
        </div>
      </article>
    </div>
  );
}
