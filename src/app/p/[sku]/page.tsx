import type { Metadata } from 'next';

const API = process.env.SHEETS_API_BASE!;     // 🔥 здесь переменная

//----- метаданные страницы
export async function generateMetadata(
  { params }: { params: { sku: string } }
): Promise<Metadata> {
  return { title: `Passport • ${params.sku}` };
}

//----- функция, которая берёт данные у Apps Script
async function fetchProduct(sku: string) {
  console.log('API =', API);                       // 🔥 1-й лог
  const url = `${API}?sku=${sku}`;
  console.log('URL =', url);                       // 🔥 2-й лог

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('API error');
  return res.json();
}

//----- сама страница паспорта
export default async function Passport(
  { params }: { params: { sku: string } }
) {
  const p = await fetchProduct(params.sku);

  return (
    <main className="p-8 max-w-xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Product Passport: {p.name}</h1>
      <ul className="list-disc ml-6 space-y-1">
        <li><b>Material:</b> {p.material}</li>
        <li><b>Country:</b> {p.country}</li>
        <li><b>CO₂ kg:</b> {p.co2_kg}</li>
        <li><b>Rule status:</b> {p.ruleStatus}</li>
      </ul>
      <img
        className="w-40 h-40 mt-6 border"
        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${params.sku}`}
        alt="QR code"
      />
    </main>
  );
}