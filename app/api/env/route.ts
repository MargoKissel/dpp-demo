// app/api/env/route.ts
export const runtime = 'nodejs';

export async function GET() {
  // Для дебага можно оставить логи:
  console.log('SITE:', process.env.NEXT_PUBLIC_SITE_URL);
  console.log('API :', process.env.NEXT_PUBLIC_SHEETS_API_BASE);
  console.log('KEY :', process.env.NEXT_PUBLIC_SHEETS_API_KEY);

  return new Response(JSON.stringify({
    site: process.env.NEXT_PUBLIC_SITE_URL ?? null,
    api:  process.env.NEXT_PUBLIC_SHEETS_API_BASE ?? null,
    key:  process.env.NEXT_PUBLIC_SHEETS_API_KEY ? 'SET' : null,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
