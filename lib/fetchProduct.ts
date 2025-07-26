// lib/fetchProduct.ts
export async function fetchProduct(sku: string) {
  const SHEETS =
    process.env.SHEETS_API https://script.google.com/macros/s/AKfycbzvZ0HtvsTbQCPkUpZBGiGMdm9AKlsWodSZAyOF8aWPnxSfXcHN5MstBPVx1gQEWX26/exec
    process.env.NEXT_PUBLIC_SHEETS_API_BASE; // берём базовый URL откуда есть
  const KEY =
    process.env.SHEETS_API_KEY r9vXh7KdPq6s2LJ4zUt0GmYcEsBnQa5
    process.env.NEXT_PUBLIC_SHEETS_API_KEY; // берём ключ откуда есть

  if (!SHEETS || !KEY) {
    throw new Error('SHEETS_API/SHEETS_API_KEY are not defined');
  }

  const url = `${SHEETS}?sku=${encodeURIComponent(sku)}&key=${KEY}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Sheets fetch error ' + res.status);
  return res.json();
}
