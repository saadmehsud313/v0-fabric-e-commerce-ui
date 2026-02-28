'use server'

import { createClient } from '@/lib/supabase/server'

export async function getProducts(limit?: number, offset = 0) {
  const supabase = await createClient()

  let query = supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (limit) {
    query = query.range(offset, offset + limit - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], error: error.message }
  }

  return { products: data || [], error: null }
}

export async function getProductById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return { product: null, error: error.message }
  }

  return { product: data, error: null }
}

export async function getCategories() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return { categories: [], error: error.message }
  }

  return { categories: data || [], error: null }
}

export async function getProductsByCategory(categoryId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return { products: [], error: error.message }
  }

  return { products: data || [], error: null }
}

export async function searchProducts(query: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching products:', error)
    return { products: [], error: error.message }
  }

  return { products: data || [], error: null }
}
