-- Run this in: Supabase Dashboard → SQL Editor

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
  created_at    timestamptz default now()
);

-- RLS
alter table menu_items   enable row level security;
alter table reservations enable row level security;

create policy "public_read_menu"         on menu_items   for select using (true);
create policy "public_insert_reservation" on reservations for insert with check (true);
create policy "admin_all_menu"           on menu_items   for all using (auth.role() = 'authenticated');
create policy "admin_all_reservations"   on reservations for all using (auth.role() = 'authenticated');

-- SEED
insert into menu_items (name, description, price, category) values
  ('Grilled Sea Bass',    'Fresh daily catch, lemon butter, capers, dill', 28.00, 'Mains'),
  ('Shrimp Tacos',        'Crispy shrimp, slaw, chipotle crema, lime',     18.00, 'Mains'),
  ('Lobster Bisque',      'Rich cream soup, cognac, chive oil',             16.00, 'Starters'),
  ('Calamari Fritti',     'Light batter, marinara, lemon aioli',           14.00, 'Starters'),
  ('Açaí Bowl',           'Granola, banana, honey, coconut flakes',         12.00, 'Breakfast'),
  ('Avocado Toast',       'Sourdough, poached egg, chilli flakes',          13.00, 'Breakfast'),
  ('Mango Sorbet',        'House-made, coconut cream',                       8.00, 'Desserts'),
  ('Churro Bites',        'Cinnamon sugar, dark chocolate dip',              9.00, 'Desserts'),
  ('Sunset Margarita',    'Tequila, triple sec, fresh lime, tajín rim',     14.00, 'Drinks'),
  ('Fresh Coconut Water', 'Young coconut, served chilled',                   6.00, 'Drinks');
