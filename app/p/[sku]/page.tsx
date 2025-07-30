// app/p/[sku]/page.tsx

import { fetchProduct } from '@/lib/fetchProduct';
import { EcoButton }    from '@/components/EcoButton';
import Image            from 'next/image';

export const dynamic       = 'force-dynamic';
export const dynamicParams = true;
export const revalidate    = 60;

interface Product {
  sku: string;
  name: string;
  material: string;
  country: string;
  co2_kg: number;
  description?: string;
  image_url?: string;
}

export default async function ProductPage({
  params,
}: {
  params: { sku: string };
}) {
  const { sku } = params;
  let product: Product;

  // 1. Загрузка данных из Google Sheets
  try {
    product = await fetchProduct(sku);
    if (!product?.sku) {
      throw new Error('Produkt nicht gefunden');
    }
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

  // 2. Форматируем CO₂-число по-немецки: 45.658,000
  const co2Formatted = product.co2_kg.toLocaleString('de-DE', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  // 3. Основной рендер
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-sm w-full">
        {/* Изображение или плейсхолдер */}
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
              <span className="text-gray-400">Kein Bild verfügbar</span>
            </div>
          )}
        </div>

        {/* Контент карточки */}
        <div className="p-6 space-y-6 font-sans">
          {/* Название товара */}
          <h1 className="text-3xl font-extrabold">{product.name}</h1>

          {/* Краткие характеристики */}
          <dl className="grid grid-cols-[max-content_1fr] gap-x-4 gap-y-2 text-gray-700 text-base">
            <dt className="font-medium">Material:</dt>
            <dd>{product.material}</dd>

            <dt className="font-medium">Herstellungsland:</dt>
            <dd>{product.country}</dd>

            <dt className="font-medium">CO₂-Fußabdruck:</dt>
            <dd>{co2Formatted} kg CO₂</dd>
          </dl>

          {/* Описание */}
          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description ??
              `Dieses T-Shirt wurde aus ${product.material} in ${product.country} gefertigt. ` +
              `Die CO₂-Emissionen belaufen sich auf ${co2Formatted} kg CO₂.`}
          </p>

          {/* Кнопка выдачи баллов */}
          <EcoButton
            sku={sku}
            className="
              w-full 
              bg-green-600 hover:bg-green-700 
              text-white font-semibold 
              py-3 rounded-lg 
              text-lg
              transition-colors
            "
          />
        </div>
      </div>
    </main>
  );
}
