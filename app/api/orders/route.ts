import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const isAdmin = searchParams.get('admin') === 'true'

    // Check if user is admin
    let query = supabase.from('orders').select(
      `
      id,
      total_amount,
      status,
      created_at,
      shipping_address,
      shipping_phone,
      user_id,
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

    if (isAdmin) {
      // Check if user is admin
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

      if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      // Admin can see all orders
      query = query.order('created_at', { ascending: false })
    } else {
      // Regular users see only their orders
      query = query.eq('user_id', user.id).order('created_at', { ascending: false })
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
