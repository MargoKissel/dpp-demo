// lib/fetchProduct.ts
const SHEETS = 'https://script.google.com/macros/s/…/exec';  // твой NEXT_PUBLIC_SHEETS_API_BASE
const KEY    = 'r9vXh7KdPq6s2LJ4zUt0GmYcEsBnQa5';            // твой NEXT_PUBLIC_SHEETS_API_KEY

export async function fetchProduct(sku: string) {
  const url = `${SHEETS}?sku=${encodeURIComponent(sku)}&key=${KEY}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Sheets fetch error ' + res.status);
  return res.json();
}
