// app/p/[sku]/page.tsx
import Image from 'next/image';
import { fetchProduct } from '@/lib/fetchProduct';
import { normalizeImageUrl } from '@/lib/normalizeImageUrl';
import { EcoButton } from '@/components/EcoButton';

/* ────────────────────────────────────────────────────────────────────────── */

export const dynamic = 'force-dynamic';
export const revalidate = 60;

/** Переводы значений из таблицы → на немецкий */
const materialMap: Record<string, string> = {
  Cotton: 'Baumwolle',
  Denim: 'Denim',
  Leather: 'Leder',
  'Li-Ion': 'Li-Ion',
};

const countryMap: Record<string, string> = {
  Turkey: 'Türkei',
  Germany: 'Deutschland',
  Spain: 'Spanien',
  China: 'China',
};

/** Какое указательное слово ставить перед названием товара */
const artikel: Record<string, string> = {
  'T-Shirt Basic': 'Dieses',  // sächlich
  'Backpack Eco': 'Dieser',   // maskulin
};

/* ────────────────────────────────────────────────────────────────────────── */

export default async function Page({ params }: { params: { sku: string } }) {
  const { sku } = params;

  /* ── получаем продукт из Google Sheets ─────────────────────────────────── */
  const product = await fetchProduct(sku);

  if (!product?.sku) {
    return (
      <main className="p-8 text-red-600">
        <h1 className="text-2xl font-semibold">Fehler – SKU {sku}</h1>
        <p>Produkt nicht gefunden.</p>
      </main>
    );
  }

  /* ── пост-обработка данных ─────────────────────────────────────────────── */
  const material = materialMap[product.material] ?? product.material;
  const country  = countryMap[product.country]  ?? product.country;

  // 45 658 → 45 658   |   45.658000 → 45.658
  const co2 = Number(product.co2_kg)
    .toFixed(3)
    .replace(/\.?0+$/, '');

  const image = normalizeImageUrl(product.image_url);
  const artikelWort = artikel[product.name] ?? 'Dieses';

  /* ── UI ─────────────────────────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow overflow-hidden">
        {/* картинка товара */}
        {image && (
          <div className="relative w-full h-64 sm:h-72 md:h-80 bg-gray-100">
            <Image
              src={image}
              alt={product.name}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}

        {/* текстовое содержимое */}
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

          <div className="space-y-1 mb-4 text-[17px] leading-6">
            <p>
              <span className="font-semibold">Material:&nbsp;</span>
              {material}
            </p>
            <p>
              <span className="font-semibold">Herstellungsland:&nbsp;</span>
              {country}
            </p>
            <p>
              <span className="font-semibold">CO₂-Fußabdruck:&nbsp;</span>
              {co2}&nbsp;kg&nbsp;CO₂
            </p>
          </div>

          <p className="mb-6 text-gray-700 leading-relaxed">
            {artikelWort} {product.name} wurde aus {material} in {country}{' '}
            gefertigt. Die Kohlendioxid-Emissionen belaufen sich auf {co2}&nbsp;
            kg&nbsp;CO₂.
          </p>

          {/* кнопка «Eco-Punkte» */}
          <EcoButton sku={sku} />
        </div>
      </div>
    </div>
  );
}
