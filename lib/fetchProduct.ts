export async function fetchProduct(sku: string) {
  const SHEETS = process.env.SHEETS_API              // если вдруг есть
              ?? process.env.NEXT_PUBLIC_SHEETS_API_BASE;
  const KEY    = process.env.SHEETS_API_KEY
              ?? process.env.NEXT_PUBLIC_SHEETS_API_KEY;

  if (!SHEETS || !KEY) throw new Error('No Sheets ENV vars');

  const url = `${SHEETS}?sku=${encodeURIComponent(sku)}&key=${KEY}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Sheets fetch error ' + res.status);
  return res.json();
}
