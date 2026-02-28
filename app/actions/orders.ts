'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getUser } from './auth'
import { getCart } from './cart'

export async function createOrder(shippingInfo: {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}) {
  const user = await getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { items } = await getCart()
  if (items.length === 0) {
    return { success: false, error: 'Cart is empty' }
  }

  const supabase = await createClient()

  // Calculate total
  const total = items.reduce((sum, item: any) => sum + item.products.price * item.quantity, 0)

  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      total_amount: total,
      shipping_address: `${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.postalCode}, ${shippingInfo.country}`,
      shipping_phone: shippingInfo.phone,
      status: 'pending',
    })
    .select()
    .single()

  if (orderError) {
    return { success: false, error: orderError.message }
  }

  // Create order items
  const orderItems = items.map((item: any) => ({
    order_id: order.id,
    product_id: item.products.id,
    quantity: item.quantity,
    price: item.products.price,
  }))

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems)

  if (itemsError) {
    return { success: false, error: itemsError.message }
  }

  // Clear cart
  await supabase.from('cart_items').delete().eq('user_id', user.id)

  revalidatePath('/dashboard')
  return { success: true, orderId: order.id }
}

export async function getOrders() {
  const user = await getUser()
  if (!user) return { orders: [], error: 'Not authenticated' }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      id,
      total_amount,
      status,
      created_at,
      order_items (
        id,
        quantity,
        price,
        products (
          id,
          name,
          image_url
        )
      )
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching orders:', error)
    return { orders: [], error: error.message }
  }

  return { orders: data || [], error: null }
}

export async function getOrderById(orderId: string) {
  const user = await getUser()
  if (!user) return { order: null, error: 'Not authenticated' }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      id,
      total_amount,
      status,
      created_at,
      shipping_address,
      shipping_phone,
      order_items (
        id,
        quantity,
        price,
        products (
          id,
          name,
          image_url
        )
      )
    `
    )
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (error) {
    console.error('Error fetching order:', error)
    return { order: null, error: error.message }
  }

  return { order: data, error: null }
}
