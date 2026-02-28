-- ============================================================
-- kashfdigitex: Full Database Schema with RLS
-- ============================================================

-- 1. Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'customer',
  phone text,
  address text,
  city text,
  postal_code text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Admin can read all profiles
create policy "profiles_admin_select" on public.profiles
  for select using (
    exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Auto-create profile on signup trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', null)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- 2. Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image_url text,
  product_count int not null default 0,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;

-- Anyone can read categories
create policy "categories_public_read" on public.categories
  for select using (true);

-- 3. Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  category_id uuid references public.categories(id) on delete set null,
  image_url text,
  badge text,
  rating numeric(2,1) not null default 0,
  review_count int not null default 0,
  in_stock boolean not null default true,
  description text,
  fabric text,
  pieces text,
  weight text,
  created_at timestamptz not null default now()
);

alter table public.products enable row level security;

-- Anyone can read products
create policy "products_public_read" on public.products
  for select using (true);

-- 4. Cart Items
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity int not null default 1,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

alter table public.cart_items enable row level security;

create policy "cart_select_own" on public.cart_items
  for select using (auth.uid() = user_id);

create policy "cart_insert_own" on public.cart_items
  for insert with check (auth.uid() = user_id);

create policy "cart_update_own" on public.cart_items
  for update using (auth.uid() = user_id);

create policy "cart_delete_own" on public.cart_items
  for delete using (auth.uid() = user_id);

-- 5. Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending',
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  payment_method text not null default 'cod',
  shipping_address jsonb,
  created_at timestamptz not null default now()
);

alter table public.orders enable row level security;

create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);

create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id);

-- Admin can read all orders
create policy "orders_admin_select" on public.orders
  for select using (
    exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- Admin can update orders
create policy "orders_admin_update" on public.orders
  for update using (
    exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- 6. Order Items
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete set null,
  quantity int not null,
  price numeric(10,2) not null
);

alter table public.order_items enable row level security;

create policy "order_items_select_own" on public.order_items
  for select using (
    exists (
      select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()
    )
  );

create policy "order_items_insert_own" on public.order_items
  for insert with check (
    exists (
      select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()
    )
  );

-- Admin can read all order items
create policy "order_items_admin_select" on public.order_items
  for select using (
    exists (
      select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin'
    )
  );

-- 7. Reviews
create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique(user_id, product_id)
);

alter table public.reviews enable row level security;

-- Anyone can read reviews
create policy "reviews_public_read" on public.reviews
  for select using (true);

-- Authenticated users can insert own
create policy "reviews_insert_own" on public.reviews
  for insert with check (auth.uid() = user_id);

-- Owner can delete own review
create policy "reviews_delete_own" on public.reviews
  for delete using (auth.uid() = user_id);
