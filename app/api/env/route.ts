// app/api/env/route.ts
export const runtime = 'nodejs';

export async function GET() {
  return Response.json({
    site : process.env.NEXT_PUBLIC_SITE_URL ?? null,
    api  : process.env.NEXT_PUBLIC_SHEETS_API_BASE ?? null,
    key  : process.env.NEXT_PUBLIC_SHEETS_API_KEY ? 'SET' : null,
  });
}
