// app/p/[sku]/page.tsx
import { fetchProduct } from '@/lib/fetchProduct';
import { EcoButton } from '@/components/EcoButton';
import Image from 'next/image';
import { normalizeImageUrl } from '@/lib/normalizeImageUrl'; 

export const dynamic = 'force-dynamic';
export const revalidate = 60;

// share-URL → direct-download URL
function toDrive(raw?: string) {
  if (!raw) return null;
  const m = raw.match(/\/d\/([^/]+)/);
  return m ? `https://drive.google.com/uc?export=download&id=${m[1]}` : raw;
}

const artikel: Record<string, string> = {
  'T-Shirt Basic': 'Dieses',      // sächlich
  'Backpack Eco': 'Dieser',       // maskulin
};

export default async function Page({ params }: { params: { sku: string } }) {
  const { sku } = params;
  const product = await fetchProduct(sku);

  if (!product?.sku) {
    return (
      <main className="p-8 text-red-600">
        <h1 className="text-2xl font-semibold">Fehler – SKU {sku}</h1>
        <p>Produkt nicht gefunden.</p>
      </main>
    );
  }

  const materialMap = { Cotton: 'Baumwolle', Denim: 'Denim', Leather: 'Leder' };
  const countryMap  = { Turkey: 'Türkei', Germany: 'Deutschland' };
  const material = materialMap[product.material] ?? product.material;
  const country  = countryMap[product.country]  ?? product.country;

  const co2 = Number(product.co2_kg)
                .toFixed(3)
                .replace(/\.?0+$/, '');

  const image = normalizeImageUrl(product.image_url);
  const artikelWort = artikel[product.name] ?? 'Dieses';

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow overflow-hidden">
        {image && (
          <div className="relative w-full h-64 bg-gray-100">
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="space-y-2 mb-4 text-lg">
            <p><span className="font-semibold">Material:&nbsp;</span>{material}</p>
            <p><span className="font-semibold">Herstellungsland:&nbsp;</span>{country}</p>
            <p><span className="font-semibold">CO₂-Fußabdruck:&nbsp;</span>{co2}&nbsp;kg&nbsp;CO₂</p>
          </div>

          <p className="mb-6 text-gray-700 leading-relaxed">
            {artikelWort} {product.name} wurde aus {material} in {country} gefertigt.
            Die Kohlendioxid-Emissionen belaufen sich auf {co2} kg&nbsp;CO₂.
          </p>

          <EcoButton sku={sku} />
        </div>
      </div>
    </div>
  );
}
