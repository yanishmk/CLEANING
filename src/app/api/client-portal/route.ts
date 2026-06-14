import { findClientPortal } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const record = await findClientPortal(body);

  if (!record) {
    return Response.json(
      { ok: false, message: 'Aucun dossier trouvé avec ce courriel ou téléphone.' },
      { status: 404 },
    );
  }

  return Response.json({ ok: true, ...record });
}
