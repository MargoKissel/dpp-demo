import { fetchProduct } from '@/lib/fetchProduct';
import { EcoButton } from '@/components/EcoButton';
import Image from 'next/image';

export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 60;

export default async function ProductPage({
  params,
}: {
  params: { sku: string };
}) {
  const { sku } = params;
  let product: any;

  try {
    product = await fetchProduct(sku);
    if (!product?.sku) throw new Error('not-found');
  } catch (err: any) {
    return (
      <main className="min-h-screen flex items-center justify-center text-red-600 p-6">
        <div>
          <h1 className="text-2xl font-semibold">Fehler – SKU {sku}</h1>
          <p>{err.message}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-md p-6 max-w-md w-full space-y-4">
        {product.image_url && (
          <Image
            src={product.image_url}
            alt={product.name}
            width={400}
            height={400}
            className="rounded-lg w-full object-cover"
            unoptimized
          />
        )}

        <h1 className="text-xl font-bold">{product.name}</h1>

        <div className="text-sm text-gray-800 space-y-1">
          <div className="flex justify-between">
            <span className="font-semibold">Material:</span>
            <span>{product.material}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Herstellungsland:</span>
            <span>{product.origin}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">CO₂-Fußabdruck:</span>
            <span>{Number(product.carbon_footprint).toFixed(3)} kg</span>
          </div>
        </div>

        <p className="text-sm text-gray-600">
          {product.description || `Dieses T-Shirt wurde aus Baumwolle in ${product.origin} gefertigt. Die Kohlendioxid-Emissionen belaufen sich auf ${Number(product.carbon_footprint).toFixed(3)} kg CO₂.`}
        </p>

        <EcoButton sku={sku} />
      </div>
    </main>
  );
}
