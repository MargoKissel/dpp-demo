// app/p/[sku]/page.tsx
import './globals.css';           // если вы не импортируете в layout.tsx
import { fetchProduct } from '@/lib/fetchProduct';
import { EcoButton }    from '@/components/EcoButton';
import Image            from 'next/image';

export const dynamic       = 'force-dynamic';
export const dynamicParams = true;
export const revalidate    = 60;

// Убираем generateStaticParams()

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
      <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white rounded-xl shadow p-8 max-w-sm text-center">
          <h1 className="text-2xl font-semibold mb-4">Fehler – SKU {sku}</h1>
          <p className="text-red-600">{err.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-sm w-full">
        {product.image_url && (
          <div className="relative w-full h-64 bg-gray-50">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              style={{ objectFit: 'contain' }}
              unoptimized
            />
          </div>
        )}
        <div className="p-6 space-y-4">
          <h1 className="text-2xl font-bold">{product.name}</h1>

          <div className="space-y-2 text-gray-800 text-sm">
            <div className="flex justify-between">
              <span className="font-semibold">Material:</span>
              <span>{product.material}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Herstellungsland:</span>
              <span>{product.country}</span>  {/* <-- здесь country */}
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">CO₂-Fußabdruck:</span>
              <span>{Number(product.co2_kg).toFixed(3)} kg CO₂</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">
            {product.description ||
              `Dieses T-Shirt wurde aus Baumwolle in ${product.country} gefertigt. Die Kohlendioxid-Emissionen belaufen sich auf ${Number(
                product.co2_kg
              ).toFixed(3)} kg CO₂.`}
          </p>

          <EcoButton sku={sku} />
        </div>
      </div>
    </main>
  );
}
