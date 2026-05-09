create table if not exists public.stripe3_resources (
  id text primary key,
  network text not null,
  merchant text not null,
  product_pda text,
  resource jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists stripe3_resources_network_idx
  on public.stripe3_resources (network);

create index if not exists stripe3_resources_merchant_idx
  on public.stripe3_resources (merchant);

create or replace function public.set_stripe3_resources_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists stripe3_resources_updated_at on public.stripe3_resources;

create trigger stripe3_resources_updated_at
before update on public.stripe3_resources
for each row
execute function public.set_stripe3_resources_updated_at();

alter table public.stripe3_resources enable row level security;
