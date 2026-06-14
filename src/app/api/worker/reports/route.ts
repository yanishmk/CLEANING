import { createWorkerReport } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const result = await createWorkerReport(body);

  if (!result) {
    return Response.json(
      { ok: false, message: 'Travail introuvable pour ce code intervenant.' },
      { status: 404 },
    );
  }

  return Response.json({ ok: true, ...result });
}
