// app/p/[sku]/page.tsx
import { fetchProduct } from '@/lib/fetchProduct';
import { EcoButton } from '@/components/EcoButton';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 60;

// utility: из Google-Drive share URL делаем direct-download
function toDirectDriveUrl(raw?: string) {
  if (!raw) return null;
  // если уже корректный прямой URL
  if (raw.startsWith('https://drive.google.com/uc')) return raw;
  // пробуем выцепить ID из /d/<ID>/
  const m = raw.match(/\/d\/([^/]+)/);
  if (m) {
    return `https://drive.google.com/uc?export=download&id=${m[1]}`;
  }
  // иначе возвращаем как есть
  return raw;
}

export async function generateMetadata({ params }: any) {
  const { sku } = await params;
  return {
    title: `Digital Product Passport – SKU ${sku}`,
    description: `Digitaler Produktpass für Artikel mit der SKU ${sku}.`,
  };
}

export default async function ProductPage({ params }: any) {
  const { sku } = params;
  let product: any;

  try {
    product = await fetchProduct(sku);
    if (!product?.sku) throw new Error('not-found');
  } catch (err: any) {
    return (
      <main className="p-8 text-red-600">
        <h1 className="text-2xl font-semibold">Fehler – SKU {sku}</h1>
        <p>{err.message}</p>
      </main>
    );
  }

  // переводим материалы и страны (пример)
  const materialMap: Record<string, string> = {
    Cotton: 'Baumwolle',
    Denim: 'Denim',
    Leather: 'Leder',
  };
  const countryMap: Record<string, string> = {
    Turkey: 'Türkei',
    Germany: 'Deutschland',
  };
  const material = materialMap[product.material] ?? product.material;
  const country = countryMap[product.country] ?? product.country;

  // формат CO₂: три знака после запятой с точкой
  const co2 = Number(product.co2_kg).toFixed(3).replace(/,/g, '.');

  // картинка: либо из API, либо из share URL
  const imageUrl = toDirectDriveUrl(product.image_url);

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow overflow-hidden">
        {imageUrl && (
          <div className="relative w-full h-64">
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain bg-gray-100"
              unoptimized
            />
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            {product.name}
          </h1>

          <div className="space-y-2 mb-4 text-lg">
            <p>
              <span className="font-semibold">Material:&nbsp;</span>
              <span className="text-gray-700">{material}</span>
            </p>
            <p>
              <span className="font-semibold">Herstellungsland:&nbsp;</span>
              <span className="text-gray-700">{country}</span>
            </p>
            <p>
              <span className="font-semibold">CO₂-Fußabdruck:&nbsp;</span>
              <span className="text-gray-700">{co2}&nbsp;kg CO₂</span>
            </p>
          </div>

          <p className="mb-6 text-gray-700 leading-relaxed">
            Dieses {product.name} wurde aus {material} in {country} gefertigt. Die
            Kohlendioxid-Emissionen belaufen sich auf {co2} kg CO₂.
          </p>

          <EcoButton sku={sku} />
        </div>
      </div>
    </div>
  );
}
