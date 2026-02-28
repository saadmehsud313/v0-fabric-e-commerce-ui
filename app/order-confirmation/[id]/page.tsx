'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle, Package, Clock } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getOrderById } from '@/app/actions/orders'
import { getUser } from '@/app/actions/auth'

function formatPrice(price: number | string) {
  return `Rs. ${Number(price).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const user = await getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { order: orderData } = await getOrderById(params.id)
      if (!orderData) {
        router.push('/dashboard')
        return
      }

      setOrder(orderData)
      setLoading(false)
    }

    init()
  }, [router, params])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <p className="text-muted-foreground">Loading order details...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <p className="text-muted-foreground">Order not found</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 py-16">
          {/* Success Message */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-20 w-20 text-green-600" />
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              Thank you for your order. We've received it and will process it shortly. Check your email for order details.
            </p>
          </div>

          {/* Order Details */}
          <div className="bg-card rounded-2xl border border-border p-8 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8 pb-8 border-b border-border">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Order Number
                </p>
                <p className="font-mono text-sm font-semibold text-foreground">{order.id}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Order Date</p>
                <p className="text-sm font-semibold text-foreground">
                  {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Status</p>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700">
                  <Clock className="h-3 w-3" />
                  <span className="text-xs font-semibold">Pending</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Total</p>
                <p className="text-lg font-bold text-primary">{formatPrice(order.total_amount)}</p>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-foreground mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-background">
                        <img
                          src={item.products?.image_url || '/placeholder.jpg'}
                          alt={item.products?.name}
                          className="h-full w-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{item.products?.name}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">{formatPrice(item.price)}</p>
                      <p className="text-xs text-muted-foreground">each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-8 pb-8 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground mb-4">Shipping Address</h2>
              <p className="text-sm text-foreground">{order.shipping_address}</p>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Package className="h-4 w-4" />
                What Happens Next?
              </h3>
              <ol className="text-sm text-blue-800 space-y-2 ml-6 list-decimal">
                <li>We'll confirm your order and prepare it for shipment</li>
                <li>You'll receive a tracking number via email</li>
                <li>Your order will be delivered within 5-7 business days</li>
              </ol>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              View My Orders
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-accent text-foreground px-8 py-3 rounded-xl text-sm font-semibold hover:bg-accent/80 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
