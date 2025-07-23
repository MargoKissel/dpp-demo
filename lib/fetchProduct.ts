export async function fetchProduct(sku: string) {
  const SHEETS = process.env.SHEETS_API!;
  const KEY    = process.env.SHEETS_API_KEY!;
  const url = `${SHEETS}?sku=${encodeURIComponent(sku)}&key=${KEY}`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Sheets fetch error ' + res.status);
  return res.json();
}
