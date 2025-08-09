// lib/fetchProduct.ts
export type Product = {
  sku: string;
  name: string;
  material?: string;
  country?: string;
  co2_kg?: number | string;
  image_url?: string;
  related_sku?: string;
};

const BASE = process.env.NEXT_PUBLIC_SHEETS_API_BASE!;
const KEY  = process.env.NEXT_PUBLIC_SHEETS_API_KEY!; // должен совпадать с API_KEY в Apps Script

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error(`Sheets fetch error ${res.status}`);
  return res.json();
}

export async function fetchProductAndRelated(sku: string): Promise<{product: Product, related: Product[]}> {
  if (!BASE || !KEY) throw new Error('Missing env NEXT_PUBLIC_SHEETS_API_BASE / KEY');

  // 1) сам товар
  const product = await fetchJSON<Product>(`${BASE}?sku=${encodeURIComponent(sku)}&key=${KEY}`);
  if (!product || !product.sku) return { product: {} as Product, related: [] };

  // 2) если есть related_sku — подтягиваем карточки из полного списка
  const ids = (product.related_sku || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (!ids.length) return { product, related: [] };

  const all = await fetchJSON<Product[]>(`${BASE}?key=${KEY}`);
  const map = new Map(all.map(p => [String(p.sku), p]));
  const related = ids.map(id => map.get(id)).filter(Boolean) as Product[];
  return { product, related };
}
