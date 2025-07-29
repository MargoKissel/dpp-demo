// app/api/env/route.ts
export const runtime = 'nodejs';

export async function GET() {
  // Вернёт JSON с тем, что подхватилось из .env.local
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? null;
  const api  = process.env.NEXT_PUBLIC_SHEETS_API_BASE ?? null;
  const key  = process.env.NEXT_PUBLIC_SHEETS_API_KEY  ? 'SET' : null;

  return new Response(JSON.stringify({ site, api, key }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
