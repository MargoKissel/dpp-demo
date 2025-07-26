// app/api/env/route.ts
export async function GET() {
  return Response.json({
    NODE_ENV: process.env.NODE_ENV,
    site    : process.env.NEXT_PUBLIC_SITE_URL ?? null,
    api     : process.env.SHEETS_API ?? null,
    key     : process.env.SHEETS_API_KEY ? 'SET' : null,
  });
}
