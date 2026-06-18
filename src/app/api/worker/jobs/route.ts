import { listWorkerJobs, listWorkerNotifications } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code') ?? '';
  const [jobs, notifications] = await Promise.all([
    listWorkerJobs(code),
    listWorkerNotifications(code),
  ]);

  if (!code) {
    return Response.json({ ok: false, message: 'Code intervenant requis.' }, { status: 400 });
  }

  return Response.json({ ok: true, jobs, notifications });
}
