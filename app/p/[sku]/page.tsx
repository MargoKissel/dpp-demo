// src/app/p/[sku]/page.tsx
import { fetchProduct } from '@/lib/fetchProduct';
import { EcoButton }    from '@/components/EcoButton';

/* ------------------------------------------------------------------ */
/*  ─── STATIC & META ──────────────────────────────────────────────── */
/* ------------------------------------------------------------------ */

export const dynamic        = 'force-dynamic';
export const dynamicParams  = true;   // генерим любые slug-и
export const revalidate     = 60;     // ISR 60 сек

export type PageProps = {
  params: { sku: string };
};

/** какие slug-и Next пререндерит на этапе build */
export function generateStaticParams(): PageProps['params'][] {
  return [{ sku: '1001' }, { sku: '1002' }];
}

/** SEO / Open Graph */
export function generateMetadata({ params }: PageProps) {
  return {
    title: `Digital Product Passport – SKU ${params.sku}`,
    description: `Open digital passport for product SKU ${params.sku}.`,
  };
}

/* ------------------------------------------------------------------ */
/*  ─── PAGE ────────────────────────────────────────────────────────── */
/* ------------------------------------------------------------------ */

export default async function ProductPage({ params }: PageProps) {
  const { sku } = params;

  let product: Awaited<ReturnType<typeof fetchProduct>>;
  try {
    product = await fetchProduct(sku);
    if (!product?.sku) throw new Error('not-found');
  } catch (err) {
    /* простая 404-страница */
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
        <dt>Name:</dt>              <dd>{product.name}</dd>
        <dt>Material:</dt>          <dd>{product.material}</dd>
        <dt>Country of Origin:</dt> <dd>{product.country}</dd>
        <dt>CO₂&nbsp;(kg):</dt>     <dd>{product.co2_kg}</dd>
        <dt>Marketing Claim:</dt>   <dd>{product.marketing_claim}</dd>
        <dt>Last Modified:</dt>
        <dd>
          {new Date(product.last_modified).toLocaleDateString('de-DE', {
            year:  'numeric',
            month: '2-digit',
            day:   '2-digit',
          })}
        </dd>
        <dt>Row Hash:</dt>
        <dd className="break-all text-xs text-gray-500">
          {product.row_hash}
        </dd>
      </dl>

      {/* ── Eco-Points β ── */}
      <EcoButton sku={sku} />
    </main>
  );
}
