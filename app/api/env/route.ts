
export async function GET() {
  return Response.json({
    SHEETS_API      : process.env.SHEETS_API,
    SHEETS_API_KEY  : process.env.SHEETS_API_KEY,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  });
}
