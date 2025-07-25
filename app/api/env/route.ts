export async function GET() {
  return new Response(JSON.stringify({
    sheetsApi: process.env.SHEETS_API,
    key:        process.env.SHEETS_API_KEY,
    siteUrl:    process.env.NEXT_PUBLIC_SITE_URL,
  }), { headers: { 'Content-Type': 'application/json' } });
}
