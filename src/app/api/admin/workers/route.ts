import { createWorker, listWorkers } from '@/lib/db';

export const dynamic = 'force-dynamic';

function isAuthorized(code: string) {
  return code === (process.env.ADMIN_CODE ?? 'admin123');
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code') ?? '';

  if (!isAuthorized(code)) {
    return Response.json({ ok: false, message: 'Accès refusé' }, { status: 401 });
  }

  try {
    const workers = await listWorkers();
    return Response.json({ ok: true, workers });
  } catch {
    return Response.json({ ok: true, workers: [] });
  }
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>;
  const code = String(body.adminCode ?? '');

  if (!isAuthorized(code)) {
    return Response.json({ ok: false, message: 'Accès refusé' }, { status: 401 });
  }

  try {
    const worker = await createWorker(body);
    return Response.json({ ok: true, worker });
  } catch (error) {
    const message = error instanceof Error && error.message === 'worker_code_exists'
      ? 'Ce code intervenant existe déjà.'
      : 'Nom, téléphone et code intervenant sont requis.';
    return Response.json({ ok: false, message }, { status: 400 });
  }
}
