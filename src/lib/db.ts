import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export type QuoteStatus = 'new' | 'reviewing' | 'quoted' | 'accepted' | 'scheduled' | 'completed';

export type QuoteSubmission = {
  id: string;
  createdAt: string;
  quoteDueAt: string;
  status: QuoteStatus;
  name: string;
  email: string;
  phone: string;
  service: string;
  address: string;
  city: string;
  message: string;
  preferredDate?: string;
  preferredTime?: string;
  propertyType?: string;
  spaceSize?: string;
  bedrooms?: string;
  bathrooms?: string;
  rooms?: string;
  currentCondition?: string;
  frequency?: string;
  extras?: string;
  accessNotes?: string;
  roomPhotos?: string[];
  estimate?: string;
  nextVisit?: string;
  assignedWorkerName?: string;
  assignedWorkerCode?: string;
  workerPay?: string;
};

export type ServiceReport = {
  id: string;
  quoteId: string;
  createdAt: string;
  title: string;
  status: 'sent' | 'draft';
  checklist: string[];
  notes: string;
  beforeImage?: string;
  afterImage?: string;
};

export type Worker = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  email?: string;
  code: string;
  active: boolean;
};

export type QuoteNotification = {
  id: string;
  quoteId: string;
  createdAt: string;
  audience: 'admin' | 'client' | 'all';
  title: string;
  message: string;
  tone: 'info' | 'success' | 'warning';
};

export type QuoteUpdate = {
  status?: QuoteStatus;
  estimate?: string;
  nextVisit?: string;
  assignedWorkerName?: string;
  assignedWorkerCode?: string;
  workerPay?: string;
};

type CleaningDb = {
  quotes: QuoteSubmission[];
  reports: ServiceReport[];
  workers: Worker[];
  notifications: QuoteNotification[];
};

type SupabaseQuoteRow = {
  id: string;
  created_at: string;
  quote_due_at: string;
  status: QuoteStatus;
  name: string;
  email: string;
  phone: string;
  service: string;
  address: string;
  city: string;
  message: string;
  preferred_date?: string | null;
  preferred_time?: string | null;
  property_type?: string | null;
  space_size?: string | null;
  bedrooms?: string | null;
  bathrooms?: string | null;
  rooms?: string | null;
  current_condition?: string | null;
  frequency?: string | null;
  extras?: string | null;
  access_notes?: string | null;
  room_photos?: string[] | null;
  estimate?: string | null;
  next_visit?: string | null;
  assigned_worker_name?: string | null;
  assigned_worker_code?: string | null;
  worker_pay?: string | null;
};

type SupabaseReportRow = {
  id: string;
  quote_id: string;
  created_at: string;
  title: string;
  status: 'sent' | 'draft';
  checklist: string[];
  notes: string;
  before_image?: string | null;
  after_image?: string | null;
};

type SupabaseWorkerRow = {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email?: string | null;
  code: string;
  active: boolean;
};

type SupabaseNotificationRow = {
  id: string;
  quote_id: string;
  created_at: string;
  audience: 'admin' | 'client' | 'all';
  title: string;
  message: string;
  tone: 'info' | 'success' | 'warning';
};

const dbPath = path.join(process.cwd(), 'data', 'cleaning-db.json');
const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const demoDb: CleaningDb = {
  quotes: [
    {
      id: 'CS-2481',
      createdAt: '2026-06-07T13:15:00.000Z',
      quoteDueAt: '2026-06-08T13:15:00.000Z',
      status: 'scheduled',
      name: 'Marie Dupont',
      email: 'marie@example.com',
      phone: '5145704038',
      service: 'Residentiel',
      address: '123 rue Principale',
      city: 'Gatineau',
      message: 'Maison 3 chambres, nettoyage aux deux semaines.',
      preferredDate: '2026-06-13',
      preferredTime: '09:00',
      propertyType: 'Maison',
      spaceSize: '1500-2000 pi2',
      bedrooms: '3',
      bathrooms: '2',
      rooms: '7',
      currentCondition: 'Normal',
      frequency: 'Aux 2 semaines',
      extras: 'Four, Vitres interieures',
      accessNotes: 'Stationnement dans l entree.',
      roomPhotos: [],
      estimate: '145 $ / visite',
      nextVisit: '2026-06-13T09:00',
      assignedWorkerName: 'Samir',
      assignedWorkerCode: 'SAMIR-2481',
      workerPay: '85 $',
    },
  ],
  reports: [
    {
      id: 'RPT-2481',
      quoteId: 'CS-2481',
      createdAt: '2026-06-07T16:40:00.000Z',
      title: 'Rapport apres intervention',
      status: 'sent',
      checklist: ['Cuisine terminee', 'Salle de bain terminee', 'Sols laves'],
      notes: 'Intervention completee. Photos avant/apres disponibles dans le portail.',
      beforeImage: '/follow/kitchen-before-real-v4.png',
      afterImage: '/follow/kitchen-after-real-v4.png',
    },
  ],
  workers: [
    {
      id: 'WRK-SAMIR',
      createdAt: '2026-06-07T12:00:00.000Z',
      name: 'Samir',
      phone: '5145704038',
      email: 'samir@example.com',
      code: 'SAMIR-2481',
      active: true,
    },
  ],
  notifications: [
    {
      id: 'NTF-2481',
      quoteId: 'CS-2481',
      createdAt: '2026-06-07T16:45:00.000Z',
      audience: 'all',
      title: 'Travail terminé',
      message: 'Le rapport après intervention est disponible dans le portail.',
      tone: 'success',
    },
  ],
};

async function readDb(): Promise<CleaningDb> {
  try {
    const raw = await readFile(dbPath, 'utf8');
    const db = JSON.parse(raw) as CleaningDb;
    return {
      quotes: db.quotes ?? [],
      reports: db.reports ?? [],
      workers: db.workers ?? demoDb.workers,
      notifications: db.notifications ?? [],
    };
  } catch {
    await mkdir(path.dirname(dbPath), { recursive: true });
    await writeFile(dbPath, JSON.stringify(demoDb, null, 2), 'utf8');
    return demoDb;
  }
}

async function writeDb(db: CleaningDb) {
  await mkdir(path.dirname(dbPath), { recursive: true });
  await writeFile(dbPath, JSON.stringify(db, null, 2), 'utf8');
}

function normalize(value: unknown) {
  return String(value ?? '').trim();
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, '');
}

function makeQuoteId() {
  const segment = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CS-${new Date().getFullYear()}-${segment}`;
}

function makeReportId() {
  const segment = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `RPT-${segment}`;
}

function makeWorkerId(name: string) {
  const slug = normalize(name)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 16);
  const segment = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `WRK-${slug || 'TEAM'}-${segment}`;
}

function makeNotificationId() {
  const segment = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `NTF-${segment}`;
}

function hasSupabase() {
  return Boolean(supabaseUrl && supabaseServiceKey);
}

function getJwtRole(token: string) {
  try {
    const payload = token.split('.')[1];
    const decoded = Buffer.from(payload, 'base64url').toString('utf8');
    return (JSON.parse(decoded) as { role?: string }).role;
  } catch {
    return undefined;
  }
}

function assertServiceRoleKey() {
  if (!supabaseServiceKey) return;
  const role = getJwtRole(supabaseServiceKey);

  if (role && role !== 'service_role') {
    throw new Error(
      `SUPABASE_SERVICE_ROLE_KEY must be the service_role key, but received "${role}".`,
    );
  }
}

function toQuote(row: SupabaseQuoteRow): QuoteSubmission {
  return {
    id: row.id,
    createdAt: row.created_at,
    quoteDueAt: row.quote_due_at,
    status: row.status,
    name: row.name,
    email: row.email,
    phone: row.phone,
    service: row.service,
    address: row.address,
    city: row.city,
    message: row.message,
    preferredDate: row.preferred_date ?? undefined,
    preferredTime: row.preferred_time ?? undefined,
    propertyType: row.property_type ?? undefined,
    spaceSize: row.space_size ?? undefined,
    bedrooms: row.bedrooms ?? undefined,
    bathrooms: row.bathrooms ?? undefined,
    rooms: row.rooms ?? undefined,
    currentCondition: row.current_condition ?? undefined,
    frequency: row.frequency ?? undefined,
    extras: row.extras ?? undefined,
    accessNotes: row.access_notes ?? undefined,
    roomPhotos: row.room_photos ?? undefined,
    estimate: row.estimate ?? undefined,
    nextVisit: row.next_visit ?? undefined,
    assignedWorkerName: row.assigned_worker_name ?? undefined,
    assignedWorkerCode: row.assigned_worker_code ?? undefined,
    workerPay: row.worker_pay ?? undefined,
  };
}

function toReport(row: SupabaseReportRow): ServiceReport {
  return {
    id: row.id,
    quoteId: row.quote_id,
    createdAt: row.created_at,
    title: row.title,
    status: row.status,
    checklist: row.checklist,
    notes: row.notes,
    beforeImage: row.before_image ?? undefined,
    afterImage: row.after_image ?? undefined,
  };
}

function toWorker(row: SupabaseWorkerRow): Worker {
  return {
    id: row.id,
    createdAt: row.created_at,
    name: row.name,
    phone: row.phone,
    email: row.email ?? undefined,
    code: row.code,
    active: row.active,
  };
}

function toNotification(row: SupabaseNotificationRow): QuoteNotification {
  return {
    id: row.id,
    quoteId: row.quote_id,
    createdAt: row.created_at,
    audience: row.audience,
    title: row.title,
    message: row.message,
    tone: row.tone,
  };
}

function pipelineStatus(current: QuoteSubmission, next: QuoteSubmission, explicitStatus?: QuoteStatus) {
  if (explicitStatus) return explicitStatus;
  if (current.status === 'completed') return 'completed';
  if (current.status === 'accepted' && next.assignedWorkerCode && next.workerPay) return 'scheduled';
  if (current.status === 'scheduled') return 'scheduled';
  if (current.status === 'accepted') return 'accepted';
  if (next.estimate) return 'quoted';

  const wasWorked =
    current.estimate !== next.estimate ||
    current.nextVisit !== next.nextVisit ||
    current.assignedWorkerName !== next.assignedWorkerName ||
    current.assignedWorkerCode !== next.assignedWorkerCode ||
    current.workerPay !== next.workerPay;

  return wasWorked ? 'reviewing' : current.status;
}

function statusNotification(status: QuoteStatus, quote: QuoteSubmission): Omit<QuoteNotification, 'id' | 'quoteId' | 'createdAt'> | null {
  if (status === 'reviewing') {
    return {
      audience: 'all',
      title: `${quote.name} est en analyse`,
      message: quote.id,
      tone: 'info',
    };
  }
  if (status === 'quoted') {
    return {
      audience: 'all',
      title: `Estimation envoyee a ${quote.name}`,
      message: quote.estimate ? `${quote.estimate} - ${quote.id}` : quote.id,
      tone: 'success',
    };
  }
  if (status === 'accepted') {
    return {
      audience: 'all',
      title: `${quote.name} a accepte le prix`,
      message: quote.id,
      tone: 'success',
    };
  }
  if (status === 'scheduled') {
    return {
      audience: 'all',
      title: `Travail planifie pour ${quote.name}`,
      message: quote.nextVisit ? `${quote.nextVisit} - ${quote.id}` : quote.id,
      tone: 'success',
    };
  }
  if (status === 'completed') {
    return {
      audience: 'all',
      title: `Travail termine pour ${quote.name}`,
      message: quote.id,
      tone: 'success',
    };
  }
  return null;
}

function updateNotifications(current: QuoteSubmission, next: QuoteSubmission): Array<Omit<QuoteNotification, 'id' | 'quoteId' | 'createdAt'>> {
  const notifications: Array<Omit<QuoteNotification, 'id' | 'quoteId' | 'createdAt'>> = [];

  if (current.status !== next.status) {
    const notification = statusNotification(next.status, next);
    if (notification) notifications.push(notification);
    return notifications;
  }

  if ((current.estimate ?? '') !== (next.estimate ?? '') && next.estimate) {
    notifications.push({
      audience: 'all',
      title: `Prix modifie pour ${next.name}`,
      message: `${next.estimate} - ${next.id}`,
      tone: 'info',
    });
  }

  if ((current.nextVisit ?? '') !== (next.nextVisit ?? '') && next.nextVisit) {
    notifications.push({
      audience: 'all',
      title: `Date modifiee pour ${next.name}`,
      message: `${next.nextVisit} - ${next.id}`,
      tone: 'info',
    });
  }

  if ((current.assignedWorkerCode ?? '') !== (next.assignedWorkerCode ?? '') && next.assignedWorkerName) {
    notifications.push({
      audience: 'admin',
      title: `${next.assignedWorkerName} assigne a ${next.name}`,
      message: next.id,
      tone: 'info',
    });
  }

  return notifications;
}

function newQuoteNotification(quote: QuoteSubmission): Omit<QuoteNotification, 'id' | 'quoteId' | 'createdAt'> {
  return {
    audience: 'all',
    title: `${quote.name} a envoye une demande`,
    message: `${quote.service} - ${quote.city}`,
    tone: 'info',
  };
}

async function supabaseFetch<T>(endpoint: string, init?: RequestInit): Promise<T> {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('supabase_not_configured');
  }
  assertServiceRoleKey();

  const res = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/${endpoint}`, {
    ...init,
    headers: {
      apikey: supabaseServiceKey,
      Authorization: `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`supabase_error_${res.status}: ${text}`);
  }

  return (await res.json()) as T;
}

function quotePayload(quote: QuoteSubmission) {
  return {
    id: quote.id,
    created_at: quote.createdAt,
    quote_due_at: quote.quoteDueAt,
    status: quote.status,
    name: quote.name,
    email: quote.email,
    phone: quote.phone,
    service: quote.service,
    address: quote.address,
    city: quote.city,
    message: quote.message,
    preferred_date: quote.preferredDate || null,
    preferred_time: quote.preferredTime || null,
    property_type: quote.propertyType || '',
    space_size: quote.spaceSize || '',
    bedrooms: quote.bedrooms || '',
    bathrooms: quote.bathrooms || '',
    rooms: quote.rooms || '',
    current_condition: quote.currentCondition || '',
    frequency: quote.frequency || '',
    extras: quote.extras || '',
    access_notes: quote.accessNotes || '',
    room_photos: quote.roomPhotos ?? [],
  };
}

async function createQuoteInSupabase(quote: QuoteSubmission) {
  const rows = await supabaseFetch<SupabaseQuoteRow[]>('quotes', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify(quotePayload(quote)),
  });

  const created = toQuote(rows[0]);
  await createNotificationsInSupabase(created.id, [newQuoteNotification(created)]);
  return created;
}

async function listQuotesFromSupabase() {
  const rows = await supabaseFetch<SupabaseQuoteRow[]>('quotes?select=*&order=created_at.desc');
  return rows.map(toQuote);
}

async function listWorkersFromSupabase() {
  const rows = await supabaseFetch<SupabaseWorkerRow[]>('workers?select=*&order=created_at.desc');
  return rows.map(toWorker);
}

async function createWorkerInSupabase(worker: Worker) {
  const rows = await supabaseFetch<SupabaseWorkerRow[]>('workers', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      id: worker.id,
      created_at: worker.createdAt,
      name: worker.name,
      phone: worker.phone,
      email: worker.email || null,
      code: worker.code,
      active: worker.active,
    }),
  });

  return toWorker(rows[0]);
}

async function createNotificationsInSupabase(quoteId: string, notifications: Array<Omit<QuoteNotification, 'id' | 'quoteId' | 'createdAt'>>) {
  if (notifications.length === 0) return [];

  const createdAt = new Date().toISOString();
  try {
    const rows = await supabaseFetch<SupabaseNotificationRow[]>('quote_notifications', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(
        notifications.map((notification) => ({
          id: makeNotificationId(),
          quote_id: quoteId,
          created_at: createdAt,
          audience: notification.audience,
          title: notification.title,
          message: notification.message,
          tone: notification.tone,
        })),
      ),
    });

    return rows.map(toNotification);
  } catch {
    return [];
  }
}

async function notificationsForQuote(quoteId: string) {
  if (hasSupabase()) {
    try {
      const rows = await supabaseFetch<SupabaseNotificationRow[]>(
        `quote_notifications?select=*&quote_id=eq.${encodeURIComponent(quoteId)}&order=created_at.desc`,
      );
      return rows.map(toNotification);
    } catch {
      return [];
    }
  }

  const db = await readDb();
  return db.notifications
    .filter((notification) => notification.quoteId === quoteId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function listNotifications(limit = 20) {
  if (hasSupabase()) {
    try {
      const rows = await supabaseFetch<SupabaseNotificationRow[]>(
        `quote_notifications?select=*&order=created_at.desc&limit=${limit}`,
      );
      return rows.map(toNotification);
    } catch {
      return [];
    }
  }

  const db = await readDb();
  return [...db.notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, limit);
}

async function updateQuoteInSupabase(id: string, update: QuoteUpdate) {
  const currentRows = await supabaseFetch<SupabaseQuoteRow[]>(
    `quotes?select=*&id=eq.${encodeURIComponent(id)}&limit=1`,
  );
  const current = currentRows[0] ? toQuote(currentRows[0]) : null;

  if (!current) return null;

  const next: QuoteSubmission = {
    ...current,
    estimate: update.estimate !== undefined ? update.estimate : current.estimate,
    nextVisit: update.nextVisit !== undefined ? update.nextVisit : current.nextVisit,
    assignedWorkerName:
      update.assignedWorkerName !== undefined ? update.assignedWorkerName : current.assignedWorkerName,
    assignedWorkerCode:
      update.assignedWorkerCode !== undefined ? update.assignedWorkerCode : current.assignedWorkerCode,
    workerPay: update.workerPay !== undefined ? update.workerPay : current.workerPay,
  };
  const payload: Record<string, string> = {};

  payload.status = pipelineStatus(current, next, update.status);
  if (update.estimate !== undefined) payload.estimate = update.estimate;
  if (update.nextVisit !== undefined) payload.next_visit = update.nextVisit;
  if (update.assignedWorkerName !== undefined) payload.assigned_worker_name = update.assignedWorkerName;
  if (update.assignedWorkerCode !== undefined) payload.assigned_worker_code = update.assignedWorkerCode;
  if (update.workerPay !== undefined) payload.worker_pay = update.workerPay;

  const rows = await supabaseFetch<SupabaseQuoteRow[]>(
    `quotes?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'PATCH',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify(payload),
    },
  );

  const updated = rows[0] ? toQuote(rows[0]) : null;
  if (updated) {
    await createNotificationsInSupabase(updated.id, updateNotifications(current, updated));
  }

  return updated;
}

async function deleteQuoteInSupabase(id: string) {
  const rows = await supabaseFetch<SupabaseQuoteRow[]>(
    `quotes?id=eq.${encodeURIComponent(id)}`,
    {
      method: 'DELETE',
      headers: { Prefer: 'return=representation' },
    },
  );

  return rows.length > 0;
}

async function reportsForQuote(quoteId: string) {
  if (hasSupabase()) {
    const rows = await supabaseFetch<SupabaseReportRow[]>(
      `service_reports?select=*&quote_id=eq.${encodeURIComponent(quoteId)}&order=created_at.desc`,
    );
    return rows.map(toReport);
  }

  const db = await readDb();
  return db.reports.filter((report) => report.quoteId === quoteId);
}

async function findPortalInSupabase(input: Record<string, unknown>) {
  const reference = normalize(input.reference).toUpperCase();
  const contact = normalize(input.contact).toLowerCase();
  const phoneContact = normalizePhone(contact);
  const rows = await supabaseFetch<SupabaseQuoteRow[]>('quotes?select=*&order=created_at.desc');
  const quotes = rows
    .map(toQuote)
    .filter((quote) => quote.email.toLowerCase() === contact || normalizePhone(quote.phone) === phoneContact);
  const quote = reference
    ? quotes.find((item) => item.id.toUpperCase() === reference) ?? null
    : quotes[0] ?? null;

  if (!quote || quotes.length === 0) return null;

  return {
    quotes,
    quote,
    reports: await reportsForQuote(quote.id),
    notifications: await notificationsForQuote(quote.id),
  };
}

export async function createQuote(input: Record<string, unknown>) {
  const now = new Date();
  const due = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const quote: QuoteSubmission = {
    id: makeQuoteId(),
    createdAt: now.toISOString(),
    quoteDueAt: due.toISOString(),
    status: 'new',
    name: normalize(input.name),
    email: normalize(input.email).toLowerCase(),
    phone: normalize(input.phone),
    service: normalize(input.service),
    address: normalize(input.address),
    city: normalize(input.city),
    preferredDate: normalize(input.preferredDate),
    preferredTime: normalize(input.preferredTime),
    propertyType: normalize(input.propertyType),
    spaceSize: normalize(input.spaceSize),
    bedrooms: normalize(input.bedrooms),
    bathrooms: normalize(input.bathrooms),
    rooms: normalize(input.rooms),
    currentCondition: normalize(input.currentCondition),
    frequency: normalize(input.frequency),
    extras: Array.isArray(input.extras) ? input.extras.map(normalize).filter(Boolean).join(', ') : normalize(input.extras),
    accessNotes: normalize(input.accessNotes),
    roomPhotos: Array.isArray(input.roomPhotos) ? input.roomPhotos.map(normalize).filter(Boolean).slice(0, 4) : [],
    message: normalize(input.message),
  };

  if (!quote.name || !quote.email || !quote.phone || !quote.service || !quote.address || !quote.city) {
    throw new Error('missing_required_fields');
  }

  if (hasSupabase()) {
    return createQuoteInSupabase(quote);
  }

  const db = await readDb();
  const createdAt = new Date().toISOString();
  db.quotes.unshift(quote);
  db.notifications.unshift({
    id: makeNotificationId(),
    quoteId: quote.id,
    createdAt,
    ...newQuoteNotification(quote),
  });
  await writeDb(db);
  return quote;
}

export async function listQuotes() {
  if (hasSupabase()) {
    return listQuotesFromSupabase();
  }

  const db = await readDb();
  return db.quotes;
}

export async function listWorkers() {
  if (hasSupabase()) {
    return listWorkersFromSupabase();
  }

  const db = await readDb();
  return db.workers;
}

export async function createWorker(input: Record<string, unknown>) {
  const name = normalize(input.name);
  const phone = normalize(input.phone);
  const email = normalize(input.email).toLowerCase();
  const code = normalize(input.code).toUpperCase();

  if (!name || !phone || !code) {
    throw new Error('missing_required_fields');
  }

  const worker: Worker = {
    id: makeWorkerId(name),
    createdAt: new Date().toISOString(),
    name,
    phone,
    email: email || undefined,
    code,
    active: true,
  };

  if (hasSupabase()) {
    return createWorkerInSupabase(worker);
  }

  const db = await readDb();
  const codeExists = db.workers.some((item) => item.code.toUpperCase() === code);
  if (codeExists) throw new Error('worker_code_exists');
  db.workers.unshift(worker);
  await writeDb(db);
  return worker;
}

export async function updateQuote(id: string, update: QuoteUpdate) {
  if (hasSupabase()) {
    return updateQuoteInSupabase(id, update);
  }

  const db = await readDb();
  const quote = db.quotes.find((item) => item.id === id);

  if (!quote) return null;

  const current = { ...quote };
  if (update.estimate !== undefined) quote.estimate = update.estimate;
  if (update.nextVisit !== undefined) quote.nextVisit = update.nextVisit;
  if (update.assignedWorkerName !== undefined) quote.assignedWorkerName = update.assignedWorkerName;
  if (update.assignedWorkerCode !== undefined) quote.assignedWorkerCode = update.assignedWorkerCode;
  if (update.workerPay !== undefined) quote.workerPay = update.workerPay;
  quote.status = pipelineStatus(current, quote, update.status);
  const notifications = updateNotifications(current, quote).map((notification) => ({
    id: makeNotificationId(),
    quoteId: quote.id,
    createdAt: new Date().toISOString(),
    ...notification,
  }));
  db.notifications.unshift(...notifications);

  await writeDb(db);
  return quote;
}

export async function deleteQuote(id: string) {
  if (hasSupabase()) {
    return deleteQuoteInSupabase(id);
  }

  const db = await readDb();
  const beforeCount = db.quotes.length;
  db.quotes = db.quotes.filter((item) => item.id !== id);
  db.reports = db.reports.filter((report) => report.quoteId !== id);
  db.notifications = db.notifications.filter((notification) => notification.quoteId !== id);

  if (db.quotes.length === beforeCount) return false;

  await writeDb(db);
  return true;
}

export async function acceptClientQuote(input: Record<string, unknown>) {
  const record = await findClientPortal(input);
  if (!record?.quote.estimate) return null;
  return updateQuote(record.quote.id, { status: 'accepted' });
}

export async function findClientPortal(input: Record<string, unknown>) {
  if (hasSupabase()) {
    return findPortalInSupabase(input);
  }

  const reference = normalize(input.reference).toUpperCase();
  const contact = normalize(input.contact).toLowerCase();
  const phoneContact = normalizePhone(contact);
  const db = await readDb();

  const quotes = db.quotes.filter((item) => {
    return item.email.toLowerCase() === contact || normalizePhone(item.phone) === phoneContact;
  });
  const quote = reference
    ? quotes.find((item) => item.id.toUpperCase() === reference) ?? null
    : quotes[0] ?? null;

  if (!quote || quotes.length === 0) return null;

  return {
    quotes,
    quote,
    reports: db.reports.filter((report) => report.quoteId === quote.id),
    notifications: db.notifications
      .filter((notification) => notification.quoteId === quote.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
  };
}

export async function listWorkerJobs(workerCode: string) {
  const code = normalize(workerCode);
  if (!code) return [];

  const quotes = await listQuotes();
  return quotes.filter((quote) => quote.assignedWorkerCode === code);
}

export async function listWorkerNotifications(workerCode: string) {
  const jobs = await listWorkerJobs(workerCode);
  const quoteIds = new Set(jobs.map((job) => job.id));

  if (quoteIds.size === 0) return [];

  if (hasSupabase()) {
    const notifications = await Promise.all(jobs.map((job) => notificationsForQuote(job.id)));
    return notifications.flat().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const db = await readDb();
  return db.notifications
    .filter((notification) => quoteIds.has(notification.quoteId))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function createWorkerReport(input: Record<string, unknown>) {
  const code = normalize(input.code);
  const quoteId = normalize(input.quoteId);
  const jobs = await listWorkerJobs(code);
  const quote = jobs.find((item) => item.id === quoteId);

  if (!quote) return null;

  const report: ServiceReport = {
    id: makeReportId(),
    quoteId,
    createdAt: new Date().toISOString(),
    title: normalize(input.title) || 'Rapport apres intervention',
    status: 'sent',
    checklist: normalize(input.checklist)
      .split('\n')
      .map((item) => item.trim())
      .filter(Boolean),
    notes: normalize(input.notes),
    beforeImage: normalize(input.beforeImage),
    afterImage: normalize(input.afterImage),
  };

  if (hasSupabase()) {
    const rows = await supabaseFetch<SupabaseReportRow[]>('service_reports', {
      method: 'POST',
      headers: { Prefer: 'return=representation' },
      body: JSON.stringify({
        id: report.id,
        quote_id: report.quoteId,
        created_at: report.createdAt,
        title: report.title,
        status: report.status,
        checklist: report.checklist,
        notes: report.notes,
        before_image: report.beforeImage || null,
        after_image: report.afterImage || null,
      }),
    });
    const updatedQuote = await updateQuote(quoteId, { status: 'completed' });
    return { report: toReport(rows[0]), quote: updatedQuote ?? quote, notifications: await listWorkerNotifications(code) };
  }

  const db = await readDb();
  db.reports.unshift(report);
  const storedQuote = db.quotes.find((item) => item.id === quoteId);
  if (storedQuote) {
    const current = { ...storedQuote };
    storedQuote.status = 'completed';
    db.notifications.unshift(
      ...updateNotifications(current, storedQuote).map((notification) => ({
        id: makeNotificationId(),
        quoteId: storedQuote.id,
        createdAt: new Date().toISOString(),
        ...notification,
      })),
    );
  }
  await writeDb(db);
  return { report, quote: storedQuote ?? quote, notifications: await listWorkerNotifications(code) };
}
