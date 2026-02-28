import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey)

async function setupDatabase() {
  try {
    console.log('Setting up database schema...')

    // Create profiles table
    console.log('Creating profiles table...')
    const profilesSQL = `
      DROP TABLE IF EXISTS public.profiles CASCADE;
      CREATE TABLE public.profiles (
        id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        full_name text,
        role text NOT NULL DEFAULT 'customer',
        phone text,
        address text,
        city text,
        postal_code text,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      
      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "profiles_select_own" ON public.profiles
        FOR SELECT USING (auth.uid() = id);
      
      CREATE POLICY "profiles_insert_own" ON public.profiles
        FOR INSERT WITH CHECK (auth.uid() = id);
      
      CREATE POLICY "profiles_update_own" ON public.profiles
        FOR UPDATE USING (auth.uid() = id);
    `

    const { error: profilesError } = await supabase.rpc('exec_sql', { sql: profilesSQL })
    if (profilesError) console.log('Note: profiles table might already exist')

    // Create categories table
    console.log('Creating categories table...')
    const categoriesSQL = `
      DROP TABLE IF EXISTS public.categories CASCADE;
      CREATE TABLE public.categories (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL UNIQUE,
        description text,
        image_url text,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      
      ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "categories_select_all" ON public.categories
        FOR SELECT USING (true);
    `

    const { error: categoriesError } = await supabase.rpc('exec_sql', { sql: categoriesSQL })
    if (categoriesError) console.log('Note: categories table might already exist')

    // Create products table
    console.log('Creating products table...')
    const productsSQL = `
      DROP TABLE IF EXISTS public.products CASCADE;
      CREATE TABLE public.products (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
        name text NOT NULL,
        description text,
        price numeric(10, 2) NOT NULL,
        image_url text,
        fabric_type text,
        is_featured boolean DEFAULT false,
        is_new_arrival boolean DEFAULT false,
        stock integer DEFAULT 0,
        details jsonb,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      
      ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "products_select_all" ON public.products
        FOR SELECT USING (true);
    `

    const { error: productsError } = await supabase.rpc('exec_sql', { sql: productsSQL })
    if (productsError) console.log('Note: products table might already exist')

    // Create cart_items table
    console.log('Creating cart_items table...')
    const cartSQL = `
      DROP TABLE IF EXISTS public.cart_items CASCADE;
      CREATE TABLE public.cart_items (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
        quantity integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE(user_id, product_id)
      );
      
      ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "cart_items_select_own" ON public.cart_items
        FOR SELECT USING (auth.uid() = user_id);
      
      CREATE POLICY "cart_items_insert_own" ON public.cart_items
        FOR INSERT WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY "cart_items_update_own" ON public.cart_items
        FOR UPDATE USING (auth.uid() = user_id);
      
      CREATE POLICY "cart_items_delete_own" ON public.cart_items
        FOR DELETE USING (auth.uid() = user_id);
    `

    const { error: cartError } = await supabase.rpc('exec_sql', { sql: cartSQL })
    if (cartError) console.log('Note: cart_items table might already exist')

    // Create orders table
    console.log('Creating orders table...')
    const ordersSQL = `
      DROP TABLE IF EXISTS public.orders CASCADE;
      CREATE TABLE public.orders (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        total_amount numeric(10, 2) NOT NULL,
        status text DEFAULT 'pending',
        shipping_address text,
        shipping_phone text,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      
      ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "orders_select_own" ON public.orders
        FOR SELECT USING (auth.uid() = user_id);
      
      CREATE POLICY "orders_insert_own" ON public.orders
        FOR INSERT WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY "orders_update_own" ON public.orders
        FOR UPDATE USING (auth.uid() = user_id);
    `

    const { error: ordersError } = await supabase.rpc('exec_sql', { sql: ordersSQL })
    if (ordersError) console.log('Note: orders table might already exist')

    // Create order_items table
    console.log('Creating order_items table...')
    const orderItemsSQL = `
      DROP TABLE IF EXISTS public.order_items CASCADE;
      CREATE TABLE public.order_items (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
        product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
        quantity integer NOT NULL CHECK (quantity > 0),
        price numeric(10, 2) NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
      
      ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "order_items_select_own" ON public.order_items
        FOR SELECT USING (
          EXISTS (
            SELECT 1 FROM public.orders o WHERE o.id = order_id AND o.user_id = auth.uid()
          )
        );
    `

    const { error: orderItemsError } = await supabase.rpc('exec_sql', { sql: orderItemsSQL })
    if (orderItemsError) console.log('Note: order_items table might already exist')

    // Create reviews table
    console.log('Creating reviews table...')
    const reviewsSQL = `
      DROP TABLE IF EXISTS public.reviews CASCADE;
      CREATE TABLE public.reviews (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
        user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment text,
        created_at timestamptz NOT NULL DEFAULT now(),
        UNIQUE(product_id, user_id)
      );
      
      ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
      
      CREATE POLICY "reviews_select_all" ON public.reviews
        FOR SELECT USING (true);
      
      CREATE POLICY "reviews_insert_own" ON public.reviews
        FOR INSERT WITH CHECK (auth.uid() = user_id);
      
      CREATE POLICY "reviews_update_own" ON public.reviews
        FOR UPDATE USING (auth.uid() = user_id);
      
      CREATE POLICY "reviews_delete_own" ON public.reviews
        FOR DELETE USING (auth.uid() = user_id);
    `

    const { error: reviewsError } = await supabase.rpc('exec_sql', { sql: reviewsSQL })
    if (reviewsError) console.log('Note: reviews table might already exist')

    console.log('Database setup complete!')
  } catch (error) {
    console.error('Error setting up database:', error)
    process.exit(1)
  }
}

setupDatabase()
