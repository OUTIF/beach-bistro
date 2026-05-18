-- Run this in: Supabase Dashboard → SQL Editor
-- ⚠️  If you already ran the previous schema.sql, only run the ALTER sections below.

-- TABLES
create table if not exists menu_items (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  price       numeric(10,2) not null,
  category    text not null,
  image_url   text,
  available   boolean default true,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

create table if not exists reservations (
  id            uuid primary key default gen_random_uuid(),
  customer_name text not null,
  party_size    int  not null check (party_size between 1 and 20),
  date_time     timestamptz not null,
  status        text not null default 'pending'
                  check (status in ('pending','confirmed','cancelled')),
  notes         text,
  phone         text,           -- ← ADD THIS if you ran the old schema
  created_at    timestamptz default now()
);

-- If reservations table already exists, just add the phone column:
-- ALTER TABLE reservations ADD COLUMN IF NOT EXISTS phone text;

-- RLS
alter table menu_items   enable row level security;
alter table reservations enable row level security;

-- Drop existing policies if re-running (safe to ignore errors)
drop policy if exists "public_read_menu"          on menu_items;
drop policy if exists "public_insert_reservation" on reservations;
drop policy if exists "admin_all_menu"            on menu_items;
drop policy if exists "admin_all_reservations"    on reservations;

create policy "public_read_menu"          on menu_items   for select using (true);
create policy "public_insert_reservation" on reservations for insert with check (true);
create policy "admin_all_menu"            on menu_items   for all    using (auth.role() = 'authenticated');
create policy "admin_all_reservations"    on reservations for all    using (auth.role() = 'authenticated');

-- SEED (skip if already seeded)
insert into menu_items (name, description, price, category) values
  ('Izgara Levrek',      'Günlük taze balık, limon tereyağı, kapari, dereotu', 28.00, 'Ana Yemekler'),
  ('Karides Taco',       'Çıtır karides, lahana salatası, chipotle kreması',   18.00, 'Ana Yemekler'),
  ('Istakoz Çorbası',    'Kremalı çorba, konyak, frenk soğanı yağı',           16.00, 'Başlangıçlar'),
  ('Kalamar Fritti',     'Hafif hamur, marinara sosu, limon aioli',             14.00, 'Başlangıçlar'),
  ('Açaí Bowl',          'Granola, muz, bal, hindistancevizi',                  12.00, 'Kahvaltı'),
  ('Avokado Toast',      'Ekşi maya ekmek, poşe yumurta, chili pul biber',     13.00, 'Kahvaltı'),
  ('Mango Sorbet',       'Ev yapımı, hindistancevizi kreması',                   8.00, 'Tatlılar'),
  ('Churro Bites',       'Tarçın şeker, bitter çikolata sosu',                   9.00, 'Tatlılar'),
  ('Gün Batımı Margarita','Tekila, triple sec, taze limon, tajín',              14.00, 'İçecekler'),
  ('Taze Hindistancevizi Suyu','Genç hindistancevizi, soğuk servis',             6.00, 'İçecekler')
on conflict do nothing;