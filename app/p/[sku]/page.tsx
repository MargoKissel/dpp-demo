// app/p/[sku]/page.tsx
import type { Metadata, PageProps } from 'next';
import { fetchProduct }             from '@/lib/fetchProduct';
import { EcoButton }                from '@/components/EcoButton';

export const dynamic       = 'force-dynamic';
export const dynamicParams = true;
export const revalidate    = 60;

/* ------------------------------------------------------------------ */
/*  Тип пропсов, расширяющий стандартный PageProps                    */
/* ------------------------------------------------------------------ */
interface Props extends PageProps {
  params: { sku: string };
}

/* ------------------------------------------------------------------ */
/*  SSG: какие slug-и пререндерить во время build                     */
/* ------------------------------------------------------------------ */
export function generateStaticParams() {
  return [{ sku: '1001' }, { sku: '1002' }];
}

/* ------------------------------------------------------------------ */
/*  SEO / Open Graph                                                  */
/* ------------------------------------------------------------------ */
export function generateMetadata({ params }: Props): Metadata {
  return {
    title: `Digital Product Passport – SKU ${params.sku}`,
    description: `Open digital passport for product SKU ${params.sku}.`,
  };
}

/* ------------------------------------------------------------------ */
/*  Сама страница                                                     */
/* ------------------------------------------------------------------ */
export default async function ProductPage({ params }: Props) {
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
        <dt>Name:</dt>                 <dd>{product.name}</dd>
        <dt>Material:</dt>             <dd>{product.material}</dd>
        <dt>Country&nbsp;of&nbsp;Origin:</dt> <dd>{product.country}</dd>
        <dt>CO₂&nbsp;(kg):</dt>        <dd>{product.co2_kg}</dd>
        <dt>Marketing&nbsp;Claim:</dt> <dd>{product.marketing_claim}</dd>
        <dt>Last&nbsp;Modified:</dt>
        <dd>
          {new Date(product.last_modified).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          })}
        </dd>
        <dt>Row&nbsp;Hash:</dt>
        <dd className="break-all text-xs text-gray-500">
          {product.row_hash}
        </dd>
      </dl>

      {/* Eco-Points β */}
      <EcoButton sku={sku} />
    </main>
  );
}
