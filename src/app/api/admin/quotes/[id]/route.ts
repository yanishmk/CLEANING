import { deleteQuote, listQuotes, updateQuote } from '@/lib/db';
import { sendQuoteEstimate } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const url = new URL(request.url);
  const body = (await request.json()) as Record<string, unknown>;
  const code = String(body.code ?? url.searchParams.get('code') ?? '');
  const adminCode = process.env.ADMIN_CODE ?? 'admin123';

  if (code !== adminCode) {
    return Response.json({ ok: false, message: 'Accès refusé' }, { status: 401 });
  }

  const { id } = await context.params;
  const previousQuote = (await listQuotes()).find((item) => item.id === id);
  const quote = await updateQuote(id, {
    status: body.status === undefined ? undefined : String(body.status) as never,
    estimate: body.estimate === undefined ? undefined : String(body.estimate),
    nextVisit: body.nextVisit === undefined ? undefined : String(body.nextVisit),
    assignedWorkerName: body.assignedWorkerName === undefined ? undefined : String(body.assignedWorkerName),
    assignedWorkerCode: body.assignedWorkerCode === undefined ? undefined : String(body.assignedWorkerCode),
    workerPay: body.workerPay === undefined ? undefined : String(body.workerPay),
  });

  if (!quote) {
    return Response.json({ ok: false, message: 'Soumission introuvable' }, { status: 404 });
  }

  const nextEstimate = body.estimate === undefined ? '' : String(body.estimate).trim();
  const previousEstimate = previousQuote?.estimate?.trim() ?? '';
  const shouldSendEstimateEmail = Boolean(nextEstimate) && nextEstimate !== previousEstimate;
  const email = shouldSendEstimateEmail ? await sendQuoteEstimate(quote) : null;

  return Response.json({ ok: true, quote, email });
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const url = new URL(request.url);
  const body = await request.json().catch(() => ({})) as Record<string, unknown>;
  const code = String(body.code ?? url.searchParams.get('code') ?? '');
  const adminCode = process.env.ADMIN_CODE ?? 'admin123';

  if (code !== adminCode) {
    return Response.json({ ok: false, message: 'Acces refuse' }, { status: 401 });
  }

  const { id } = await context.params;
  const deleted = await deleteQuote(id);

  if (!deleted) {
    return Response.json({ ok: false, message: 'Soumission introuvable' }, { status: 404 });
  }

  return Response.json({ ok: true });
}
