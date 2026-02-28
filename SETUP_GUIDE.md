# Supabase Database Setup Guide

This guide will help you set up your Supabase database and create the admin account.

## Step 1: Create Database Tables

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (for this app: kashfdigitex)
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the entire contents of `/scripts/001_init_schema.sql`
6. Click **Run**

This will create all the necessary tables with:
- profiles (user profiles with admin flag)
- categories (product categories)
- products (product listings)
- cart_items (shopping cart items)
- orders (customer orders)
- order_items (items in each order)
- reviews (product reviews)

All tables have Row Level Security (RLS) enabled for security.

## Step 2: Create Admin Account

You have two options:

### Option A: Using the Setup Script (Recommended)

1. Open your terminal in the project root
2. Make sure your environment variables are set:
   ```bash
   echo $NEXT_PUBLIC_SUPABASE_URL
   echo $SUPABASE_SERVICE_ROLE_KEY
   ```
3. Run the setup script:
   ```bash
   node scripts/create-admin.mjs
   ```

The script will create an admin account with:
- **Email**: saad@kashfdigitex.com
- **Password**: Saad@Admin2024!SecurePassword
- **Name**: Saad Mehsud
- **Role**: Admin

### Option B: Using Supabase Dashboard Manually

1. In Supabase Dashboard, go to **Authentication** → **Users**
2. Click **Add user**
3. Fill in:
   - Email: `saad@kashfdigitex.com`
   - Password: `Saad@Admin2024!SecurePassword`
4. Check **Auto confirm user**
5. Click **Create user**
6. Go to **SQL Editor** and run this query to mark them as admin:

```sql
UPDATE public.profiles 
SET is_admin = TRUE 
WHERE email = 'saad@kashfdigitex.com';
```

## Step 3: Verify Setup

1. Open the application in your browser
2. Go to `/login`
3. Sign in with:
   - Email: `saad@kashfdigitex.com`
   - Password: `Saad@Admin2024!SecurePassword`

You should now have access to:
- User dashboard at `/dashboard`
- Admin panel (once implemented)
- All e-commerce features

## Database Schema Overview

### Profiles Table
- Stores user profile information
- `is_admin` flag for admin privileges
- Auto-created via trigger when user signs up

### Categories Table
- Product categories (Lawn, Cotton, Silk, Khaddar)
- Only admins can create/edit/delete

### Products Table
- Full product listings with prices, descriptions, images
- Linked to categories
- Features for new arrivals and featured products
- Stock management

### Cart Items Table
- User shopping cart
- Links users to products with quantities
- Each user can only have one cart item per product

### Orders Table
- Customer order history
- Status tracking (pending, confirmed, shipped, delivered, cancelled)
- Stores shipping and billing addresses

### Order Items Table
- Individual items in each order
- Stores product info and price at time of purchase

### Reviews Table
- Product reviews and ratings
- Users can leave one review per product

## Environment Variables

Make sure these are set in your Vercel project:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Public/browser key
- `SUPABASE_SERVICE_ROLE_KEY` - Server-side admin key (for admin operations)

These should already be configured if Supabase is connected to your Vercel project.

## Troubleshooting

### Error: "Invalid API key"
- Make sure your Supabase URL and keys are correct
- Check in Supabase Dashboard → Settings → API

### Error: "User already exists"
- The admin account may already be created
- Try logging in with the credentials above

### Error: "Table does not exist"
- Run the SQL schema script again in Supabase SQL Editor
- Make sure it completed without errors

### RLS Policy Errors
- This is normal during development
- RLS policies are already configured in the schema
- Check that you're authenticated when accessing protected data

## Adding More Sample Data

You can add more products by running this in Supabase SQL Editor:

```sql
INSERT INTO public.products (name, description, price, fabric_type, category_id, image_url, stock)
VALUES (
  'Product Name',
  'Product description',
  2999.00,
  'Lawn',
  (SELECT id FROM categories WHERE name = 'Lawn'),
  'https://image-url.jpg',
  100
);
```

## Next Steps

1. ✅ Create database tables (use 001_init_schema.sql)
2. ✅ Create admin account (use create-admin.mjs)
3. Test authentication by logging in
4. Add more sample products via dashboard
5. Deploy to production

For questions or issues, check the Supabase documentation: https://supabase.com/docs
