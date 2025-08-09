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
const KEY  = process.env.NEXT_PUBLIC_SHEETS_API_KEY!;

async function j<T>(u: string): Promise<T> {
  const r = await fetch(u, { next: { revalidate: 60 } });
  if (!r.ok) throw new Error(`Sheets error ${r.status}`);
  return r.json();
}

export async function fetchProductAndRelated(sku: string) {
  if (!BASE || !KEY) throw new Error('Missing env vars');

  const product = await j<Product>(`${BASE}?sku=${encodeURIComponent(sku)}&key=${KEY}`);
  if (!product?.sku) return { product: {} as Product, related: [] };

  const ids = (product.related_sku || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (!ids.length) return { product, related: [] };

  const all = await j<Product[]>(`${BASE}?key=${KEY}`);
  const map = new Map(all.map(p => [String(p.sku), p]));
  const related = ids.map(id => map.get(id)).filter(Boolean) as Product[];

  return { product, related };
}
