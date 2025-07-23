import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(process.env.SHEETS_API!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, secret: process.env.POINTS_SECRET }),
  });
  const txt = await res.text();
  return new Response(txt, { status: 200 });
}
