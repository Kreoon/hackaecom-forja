-- FORJA · migración inicial (referencia). Revisar con security-auditor antes de aplicar.
create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  provider_order text[] not null default array['gemini','openai','anthropic','fal'],
  created_at timestamptz not null default now()
);

create table public.provider_keys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  provider text not null check (provider in ('openai','gemini','anthropic','fal','magnific','kie','apify','firecrawl')),
  secret_id uuid not null, -- vault.secrets.id
  last4 text not null,
  status text not null default 'unverified' check (status in ('unverified','valid','invalid')),
  validated_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, provider)
);

create table public.shops (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  shop_domain text not null check (shop_domain ~ '^[a-z0-9-]+\.myshopify\.com$'),
  client_id_secret uuid not null,      -- vault
  client_secret_secret uuid not null,  -- vault
  theme_access_secret uuid,            -- vault, plan B opcional
  scopes text[],
  deploy_strategy text check (deploy_strategy in ('theme_files','theme_access','app_block')),
  status text not null default 'unverified',
  created_at timestamptz not null default now(),
  unique (user_id, shop_domain)
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users on delete cascade,
  shop_id uuid references public.shops on delete set null,
  name text not null default 'Nuevo producto',
  status text not null default 'draft'
    check (status in ('draft','ingesting','composing','review','deploying','live','failed')),
  current_spec_version int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.inputs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  kind text not null check (kind in ('photo','audio','document','url','reference_image','user_form')),
  storage_path text,
  url text,
  meta jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.evidence (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  input_id uuid references public.inputs on delete cascade,
  data jsonb not null,
  created_at timestamptz not null default now()
);

create table public.product_dna (
  project_id uuid not null references public.projects on delete cascade,
  version int not null,
  data jsonb not null,
  created_at timestamptz not null default now(),
  primary key (project_id, version)
);

create table public.assets (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  kind text not null check (kind in ('image','gif','video')),
  source text not null check (source in ('upload','generated','reference')),
  storage_path text not null,
  alt text,
  prompt text,
  shopify_media_id text,
  created_at timestamptz not null default now()
);

create table public.page_spec_versions (
  project_id uuid not null references public.projects on delete cascade,
  version int not null,
  spec jsonb not null,
  note text,
  created_at timestamptz not null default now(),
  primary key (project_id, version)
);

create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  type text not null, -- ingest.photo, dna.synthesize, tokens, compose, asset.image, deploy…
  status text not null default 'queued' check (status in ('queued','running','done','failed')),
  progress int not null default 0,
  error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.deployments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects on delete cascade,
  shop_id uuid not null references public.shops on delete cascade,
  strategy text not null,
  status text not null default 'pending' check (status in ('pending','preview','published','failed','rolled_back')),
  shopify_product_id text,
  shopify_theme_id text,
  previous_theme_id text,
  preview_url text,
  error text,
  created_at timestamptz not null default now()
);

create table public.usage_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users on delete cascade,
  project_id uuid references public.projects on delete set null,
  provider text not null,
  operation text not null,
  units jsonb not null default '{}',
  est_cost_usd numeric(10,4),
  created_at timestamptz not null default now()
);

-- RLS
alter table public.profiles enable row level security;
alter table public.provider_keys enable row level security;
alter table public.shops enable row level security;
alter table public.projects enable row level security;
alter table public.inputs enable row level security;
alter table public.evidence enable row level security;
alter table public.product_dna enable row level security;
alter table public.assets enable row level security;
alter table public.page_spec_versions enable row level security;
alter table public.jobs enable row level security;
alter table public.deployments enable row level security;
alter table public.usage_events enable row level security;

create policy own_profile on public.profiles for all using (id = auth.uid()) with check (id = auth.uid());
-- provider_keys y shops: el cliente solo LEE metadatos; escrituras pasan por RPC security definer
create policy read_own_keys on public.provider_keys for select using (user_id = auth.uid());
create policy read_own_shops on public.shops for select using (user_id = auth.uid());
-- Un proyecto solo puede apuntar a una tienda del mismo usuario (evita usar credenciales ajenas)
create policy own_projects on public.projects for all
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and (shop_id is null or exists (select 1 from public.shops s where s.id = shop_id and s.user_id = auth.uid()))
  );
create policy read_own_usage on public.usage_events for select using (user_id = auth.uid());

-- jobs y deployments: el cliente solo LEE; los escribe el server (service role)
create policy read_own_jobs on public.jobs for select
  using (exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()));
create policy read_own_deployments on public.deployments for select
  using (
    exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid())
    and exists (select 1 from public.shops s where s.id = shop_id and s.user_id = auth.uid())
  );
-- El worker de deploy además re-verifica shops.user_id = projects.user_id antes de usar credenciales.

-- Tablas hijas de projects editables por el cliente
do $$
declare t text;
begin
  foreach t in array array['inputs','evidence','product_dna','assets','page_spec_versions'] loop
    execute format(
      'create policy own_%1$s on public.%1$I for all using (exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid())) with check (exists (select 1 from public.projects p where p.id = project_id and p.user_id = auth.uid()))',
      t);
  end loop;
end $$;

-- Guardar llave (cliente llama esta RPC; el secreto va directo a Vault)
create or replace function public.save_provider_key(p_provider text, p_secret text)
returns void language plpgsql security definer set search_path = public, vault as $$
declare v_id uuid;
begin
  if auth.uid() is null then raise exception 'not authenticated'; end if;
  delete from public.provider_keys where user_id = auth.uid() and provider = p_provider;
  v_id := vault.create_secret(p_secret, auth.uid()::text || ':' || p_provider);
  insert into public.provider_keys(user_id, provider, secret_id, last4)
  values (auth.uid(), p_provider, v_id, right(p_secret, 4));
end $$;
revoke all on function public.save_provider_key(text, text) from public, anon;
grant execute on function public.save_provider_key(text, text) to authenticated;

-- Leer llave descifrada: SOLO service role (server). Nunca exponer a authenticated.
create or replace function public.get_provider_key(p_user uuid, p_provider text)
returns text language sql security definer set search_path = public, vault as $$
  select ds.decrypted_secret
  from public.provider_keys k join vault.decrypted_secrets ds on ds.id = k.secret_id
  where k.user_id = p_user and k.provider = p_provider;
$$;
revoke all on function public.get_provider_key(uuid, text) from public, anon, authenticated;

-- Realtime de progreso
alter publication supabase_realtime add table public.jobs;

-- Storage: bucket privado "forja", path = <user_id>/<project_id>/...
insert into storage.buckets (id, name, public) values ('forja', 'forja', false) on conflict do nothing;
create policy forja_own_files on storage.objects for all
  using (bucket_id = 'forja' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'forja' and (storage.foldername(name))[1] = auth.uid()::text);
