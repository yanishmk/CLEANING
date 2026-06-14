import { createQuote } from '@/lib/db';
import { sendQuoteConfirmation } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const quote = await createQuote(body);
    const email = await sendQuoteConfirmation(quote);
    return Response.json({ ok: true, quote, email });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown_error';
    console.error('quote_submit_error', error);
    return Response.json({ ok: false, message }, { status: 400 });
  }
}
