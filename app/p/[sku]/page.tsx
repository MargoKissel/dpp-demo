import { fetchProduct } from '@/lib/fetchProduct';
import { EcoButton } from '@/components/EcoButton';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 60;

export async function generateMetadata({ params }: any) {
  const { sku } = await params;
  return {
    title: `Digital Product Passport – SKU ${sku}`,
    description: `open digital passport for product SKU ${sku}.`,
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

  // форматируем число CO₂ по-немецки (45,658.000 -> 45,658 kg)
  const co2 = Number(product.co2_kg).toLocaleString('de-DE', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  });

  return (
    <main className="max-w-md w-full bg-white rounded-lg shadow p-6">
      {product.image_url && (
        <div className="mb-4">
          <Image
            src={product.image_url}
            alt={product.name}
            width={600}
            height={600}
            className="w-full h-auto rounded-md object-cover"
            unoptimized
          />
        </div>
      )}

      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

      <div className="space-y-2 mb-4 text-base">
        <p>
          <span className="font-semibold">Material:</span> {product.material}
        </p>
        <p>
          <span className="font-semibold">Herstellungsland:</span> {product.country}
        </p>
        <p>
          <span className="font-semibold">CO₂‑Fußabdruck:</span> {co2} kg CO₂
        </p>
      </div>

      {/* если у вас нет отдельного поля описания, можно составлять фразу из данных */}
      <p className="mb-4 leading-relaxed">
        Dieses {product.name} wurde aus {product.material} in {product.country} gefertigt. Die Kohlendioxid‑Emissionen belaufen sich auf {co2} kg CO₂.
      </p>

      <EcoButton sku={sku} />
    </main>
  );
}
