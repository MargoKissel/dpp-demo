// @ts-nocheck
export const dynamic = 'force-dynamic';

async function fetchProduct(sku: string) {
  const base = process.env.NEXT_PUBLIC_SHEETS_API_BASE;
  if (!base) throw new Error('Missing NEXT_PUBLIC_SHEETS_API_BASE');
  // если в base уже есть "?", добавляем "&", иначе — "?"
  const separator = base.includes('?') ? '&' : '?';
  const url = base + separator + 'sku=' + encodeURIComponent(sku);
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('API error ' + res.status + ' at ' + url);
  return res.json();
}

export default async function ProductPage({ params: { sku } }: any) {
  let data;
  let errorMessage = '';
  try {
    data = await fetchProduct(sku);
  } catch (e: any) {
    errorMessage = e.message || String(e);
  }

  if (errorMessage) {
    return (
      <main style={{ padding: 32, color: 'red' }}>
        <h1>Ошибка при загрузке SKU: {sku}</h1>
        <pre>{errorMessage}</pre>
      </main>
    );
  }

  return (
    <main style={{ padding: 32 }}>
      <h1>SKU: {sku}</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
