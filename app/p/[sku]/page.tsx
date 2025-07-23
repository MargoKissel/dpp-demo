// src/app/p/[sku]/page.tsx
import { fetchProduct }  from '@/lib/fetchProduct';   // <-- путь через alias "@"
import { EcoButton }     from '@/components/EcoButton';

export const dynamic       = 'force-dynamic';
export const dynamicParams = true;
export const revalidate    = 60;                  // ISR 60 c

/* статически генерируем парочку SKU, чтобы Next не ругался */
export async function generateStaticParams() {
  return [{ sku: '1001' }, { sku: '1002' }];
}

export async function generateMetadata({ params }: { params: { sku: string } }) {
  return {
    title: `Digital Product Passport – SKU ${params.sku}`,
    description: `Open digital passport for product SKU ${params.sku}.`,
  };
}

export default async function ProductPage({ params }: { params: { sku: string } }) {
  const { sku } = params;
  let product;

  try {
    product = await fetchProduct(sku);
    if (!product?.sku) throw new Error('not-found');
  } catch (err) {
    return (
      <main className="p-8 text-red-600">
        <h1 className="text-2xl font-semibold">Fehler – SKU {sku}</h1>
        <p>{(err as Error).message}</p>
      </main>
    );
  }

  return (
    <main className="p-8 font-sans max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Product – SKU {sku}</h1>

      <dl className="grid grid-cols-[max-content_1fr] gap-x-6 gap-y-2">
        <dt>Name:</dt>                <dd>{product.name}</dd>
        <dt>Material:</dt>            <dd>{product.material}</dd>
        <dt>Country of Origin:</dt>   <dd>{product.country}</dd>
        <dt>CO₂&nbsp;(kg):</dt>       <dd>{product.co2_kg}</dd>
        <dt>Marketing Claim:</dt>     <dd>{product.marketing_claim}</dd>
        <dt>Last Modified:</dt>
        <dd>
          {new Date(product.last_modified).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}
        </dd>
        <dt>Row&nbsp;Hash:</dt>
        <dd className="break-all text-xs text-gray-500">{product.row_hash}</dd>
      </dl>

      {/* кнопка Eco-Points */}
      <EcoButton sku={sku} />
    </main>
  );
}
