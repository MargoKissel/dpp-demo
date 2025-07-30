// app/p/[sku]/page.tsx
import { fetchProduct } from '@/lib/fetchProduct';
import { EcoButton }    from '@/components/EcoButton';
import Image            from 'next/image';

export const dynamic       = 'force-dynamic';
export const dynamicParams = true;
export const revalidate    = 60;

export default async function ProductPage({
  params,
}: {
  params: { sku: string };
}) {
  const { sku } = params;
  let product: any;

  try {
    product = await fetchProduct(sku);
    if (!product?.sku) throw new Error('nicht gefunden');
  } catch (err: any) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-4">Fehler – SKU {sku}</h1>
          <p className="text-red-600">{err.message}</p>
        </div>
      </main>
    );
  }

  // Форматируем число с точками для тысяч и тремя знаками после запятой
  const co2 = Number(product.co2_kg).toLocaleString('de-DE', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-sm w-full">
        {/* Фото или плейсхолдер */}
        <div className="relative w-full h-64 bg-gray-100">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              style={{ objectFit: 'contain' }}
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
        </div>

        {/* Контент карточки */}
        <div className="p-6 space-y-4 font-sans">
          <h1 className="text-3xl font-extrabold">{product.name}</h1>

          <div className="space-y-2 text-gray-700 text-base">
            <div className="flex justify-between">
              <span className="font-semibold">Material:</span>
              <span>{product.material}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Herstellungsland:</span>
              <span>{product.country}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">CO₂-Fußabdruck:</span>
              <span>{co2} kg CO₂</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description ||
              `Dieses T-Shirt wurde aus ${product.material} in ${product.country} gefertigt. Die Kohlendioxid-Emissionen belaufen sich auf ${co2} kg CO₂.`}
          </p>

          {/* Увеличенная кнопка */}
          <EcoButton
            sku={sku}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg text-lg"
          />
        </div>
      </div>
    </main>
  );
}
