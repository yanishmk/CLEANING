import { acceptClientQuote } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const quote = await acceptClientQuote(body);

  if (!quote) {
    return Response.json(
      { ok: false, message: 'Impossible d accepter cette soumission.' },
      { status: 400 },
    );
  }

  return Response.json({ ok: true, quote });
}
