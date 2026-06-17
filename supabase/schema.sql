create table if not exists public.quotes (
  id text primary key,
  created_at timestamptz not null default now(),
  quote_due_at timestamptz not null,
  status text not null default 'new'
    check (status in ('new', 'reviewing', 'quoted', 'accepted', 'scheduled', 'completed')),
  name text not null,
  email text not null,
  phone text not null,
  service text not null,
  address text not null default '',
  city text not null,
  message text not null default '',
  preferred_date date,
  preferred_time time,
  property_type text not null default '',
  space_size text not null default '',
  bedrooms text not null default '',
  bathrooms text not null default '',
  rooms text not null default '',
  current_condition text not null default '',
  frequency text not null default '',
  extras text not null default '',
  access_notes text not null default '',
  room_photos jsonb not null default '[]'::jsonb,
  estimate text,
  next_visit text,
  assigned_worker_name text,
  assigned_worker_code text,
  worker_pay text
);

create index if not exists quotes_created_at_idx on public.quotes (created_at desc);
create index if not exists quotes_email_idx on public.quotes (lower(email));

alter table public.quotes add column if not exists address text not null default '';
alter table public.quotes add column if not exists preferred_date date;
alter table public.quotes add column if not exists preferred_time time;
alter table public.quotes add column if not exists property_type text not null default '';
alter table public.quotes add column if not exists space_size text not null default '';
alter table public.quotes add column if not exists bedrooms text not null default '';
alter table public.quotes add column if not exists bathrooms text not null default '';
alter table public.quotes add column if not exists rooms text not null default '';
alter table public.quotes add column if not exists current_condition text not null default '';
alter table public.quotes add column if not exists frequency text not null default '';
alter table public.quotes add column if not exists extras text not null default '';
alter table public.quotes add column if not exists access_notes text not null default '';
alter table public.quotes add column if not exists room_photos jsonb not null default '[]'::jsonb;
alter table public.quotes drop column if exists budget;
alter table public.quotes add column if not exists assigned_worker_name text;
alter table public.quotes add column if not exists assigned_worker_code text;
alter table public.quotes add column if not exists worker_pay text;

do $$
begin
  alter table public.quotes drop constraint if exists quotes_status_check;
  alter table public.quotes add constraint quotes_status_check
    check (status in ('new', 'reviewing', 'quoted', 'accepted', 'scheduled', 'completed'));
end $$;

create table if not exists public.service_reports (
  id text primary key,
  quote_id text not null references public.quotes(id) on delete cascade,
  created_at timestamptz not null default now(),
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'sent')),
  checklist jsonb not null default '[]'::jsonb,
  notes text not null default '',
  before_image text,
  after_image text
);

create index if not exists service_reports_quote_id_idx on public.service_reports (quote_id);

create table if not exists public.quote_notifications (
  id text primary key,
  quote_id text not null references public.quotes(id) on delete cascade,
  created_at timestamptz not null default now(),
  audience text not null default 'all' check (audience in ('admin', 'client', 'all')),
  title text not null,
  message text not null,
  tone text not null default 'info' check (tone in ('info', 'success', 'warning'))
);

create index if not exists quote_notifications_quote_id_idx on public.quote_notifications (quote_id);
create index if not exists quote_notifications_created_at_idx on public.quote_notifications (created_at desc);

create table if not exists public.workers (
  id text primary key,
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  code text not null unique,
  active boolean not null default true
);

create index if not exists workers_created_at_idx on public.workers (created_at desc);
create index if not exists workers_code_idx on public.workers (code);
alter table public.workers drop column if exists default_pay;

alter table public.quotes enable row level security;
alter table public.service_reports enable row level security;
alter table public.quote_notifications enable row level security;
alter table public.workers enable row level security;

-- The Next.js server uses SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.
-- Do not expose SUPABASE_SERVICE_ROLE_KEY in the browser.
