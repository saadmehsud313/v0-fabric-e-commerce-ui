'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getUser } from './auth'

export async function getCart() {
  const user = await getUser()
  if (!user) return { items: [], error: 'Not authenticated' }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('cart_items')
    .select(
      `
      id,
      quantity,
      products (
        id,
        name,
        price,
        image_url
      )
    `
    )
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching cart:', error)
    return { items: [], error: error.message }
  }

  return { items: data || [], error: null }
}

export async function addToCart(productId: string, quantity: number) {
  const user = await getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const supabase = await createClient()

  // Check if item already in cart
  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .single()

  if (existing) {
    // Update quantity
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: existing.quantity + quantity })
      .eq('id', existing.id)

    if (error) {
      return { success: false, error: error.message }
    }
  } else {
    // Insert new item
    const { error } = await supabase.from('cart_items').insert({
      user_id: user.id,
      product_id: productId,
      quantity,
    })

    if (error) {
      return { success: false, error: error.message }
    }
  }

  revalidatePath('/cart')
  return { success: true }
}

export async function updateCartItem(cartItemId: string, quantity: number) {
  const user = await getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const supabase = await createClient()

  if (quantity <= 0) {
    // Delete item
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }
  } else {
    // Update quantity
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .eq('user_id', user.id)

    if (error) {
      return { success: false, error: error.message }
    }
  }

  revalidatePath('/cart')
  return { success: true }
}

export async function clearCart() {
  const user = await getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const supabase = await createClient()

  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('user_id', user.id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/cart')
  return { success: true }
}
