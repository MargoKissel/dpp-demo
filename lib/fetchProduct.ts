// lib/fetchProduct.ts
export async function fetchProduct(sku: string) {
  const SHEETS =
    process.env.SHEETS_API ??
    process.env.NEXT_PUBLIC_SHEETS_API_BASE; // берём базовый URL откуда есть
  const KEY =
    process.env.SHEETS_API_KEY ??
    process.env.NEXT_PUBLIC_SHEETS_API_KEY; // берём ключ откуда есть

  if (!SHEETS || !KEY) {
    throw new Error('SHEETS_API/SHEETS_API_KEY are not defined');
  }

  const url = `${SHEETS}?sku=${encodeURIComponent(sku)}&key=${KEY}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Sheets fetch error ' + res.status);
  return res.json();
}
