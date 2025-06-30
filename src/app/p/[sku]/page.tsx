// src/app/p/[sku]/page.tsx
// @ts-nocheck
export const dynamic = 'force-dynamic';
export const dynamicParams = true;
export const revalidate = 60;

async function fetchProduct(sku: string) {
  const base = process.env.NEXT_PUBLIC_SHEETS_API_BASE!;
  const sep = base.includes('?') ? '&' : '?';
  const url = base + sep + 'sku=' + encodeURIComponent(sku);
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('API error ' + res.status);
  return res.json();
}

// Статически генерируем пару demo-страниц
export async function generateStaticParams() {
  return [{ sku: '1001' }, { sku: 'XYZ' }];
}

// Заголовок страницы
export async function generateMetadata({ params }: { params: { sku: string } }) {
  return {
    title: `Product Page – SKU ${params.sku}`,
    description: `Detailed product information for SKU ${params.sku}.`,
  };
}

// **Вот здесь важно**: мы деструктурируем { params: { sku } }
export default async function ProductPage({
  params: { sku },
}: {
  params: { sku: string };
}) {
  let data, error;
  try {
    data = await fetchProduct(sku);
  } catch (e: any) {
    error = e.message;
  }

  if (error) {
    return (
      <main style={{ padding: 32, color: 'red' }}>
        <h1>Error fetching SKU {sku}</h1>
        <pre>{error}</pre>
      </main>
    );
  }

  return (
    <main style={{ padding: 32, fontFamily: 'sans-serif' }}>
      <h1>Product – SKU {sku}</h1>
      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: 'max-content 1fr',
          gap: '8px 16px',
        }}
      >
        <dt>Name:</dt><dd>{data.name}</dd>
        <dt>Material:</dt><dd>{data.material}</dd>
        <dt>Country of Origin:</dt><dd>{data.countryOfOrigin}</dd>
        <dt>CO₂ (kg):</dt><dd>{data.co2_kg}</dd>
        <dt>Marketing Claim:</dt><dd>{data.marketingClaim}</dd>
        <dt>Last Modified:</dt><dd>{new Date(data.lastModified).toLocaleDateString('en-GB')}</dd>
      </dl>
    </main>
  );
}
