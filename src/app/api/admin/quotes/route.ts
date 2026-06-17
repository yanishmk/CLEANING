import { listNotifications, listQuotes } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const adminCode = process.env.ADMIN_CODE ?? 'admin123';

  if (code !== adminCode) {
    return Response.json({ ok: false, message: 'Accès refusé' }, { status: 401 });
  }

  const [quotes, notifications] = await Promise.all([listQuotes(), listNotifications(30)]);
  return Response.json({ ok: true, quotes, notifications });
}
