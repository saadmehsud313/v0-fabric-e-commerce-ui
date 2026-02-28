'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getCart, updateCartItem, clearCart } from '@/app/actions/cart'
import { getUser } from '@/app/actions/auth'

function formatPrice(price: number | string) {
  return `Rs. ${Number(price).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export default function CartPage() {
  const router = useRouter()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const init = async () => {
      const currentUser = await getUser()
      setUser(currentUser)

      if (!currentUser) {
        router.push('/login')
        return
      }

      const { items: cartItems } = await getCart()
      setItems(cartItems)
      setLoading(false)
    }

    init()
  }, [router])

  const handleQuantityChange = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    await updateCartItem(cartItemId, newQuantity)
    const { items: updatedItems } = await getCart()
    setItems(updatedItems)
  }

  const handleRemoveItem = async (cartItemId: string) => {
    await updateCartItem(cartItemId, 0)
    const { items: updatedItems } = await getCart()
    setItems(updatedItems)
  }

  const subtotal = items.reduce((sum, item) => sum + (item.products?.price || 0) * item.quantity, 0)
  const shipping = subtotal > 5000 ? 0 : 350
  const total = subtotal + shipping

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <p className="text-muted-foreground">Loading your cart...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/40 mb-6" />
            <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">Looks like you have not added anything yet.</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Continue Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-secondary py-8 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs text-muted-foreground mb-2">Home / Cart</p>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">Shopping Cart</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                {/* Header (desktop) */}
                <div className="hidden lg:grid grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center p-4 bg-secondary text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <span>Product</span>
                  <span className="text-center">Price</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-center">Subtotal</span>
                  <span className="w-8" />
                </div>

                {items.map((item, i) => (
                  <div
                    key={item.id}
                    className={`p-4 lg:grid lg:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 items-center flex flex-col sm:flex-row sm:items-center ${
                      i > 0 ? 'border-t border-border' : ''
                    }`}
                  >
                    {/* Product */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-secondary">
                        <img
                          src={item.products?.image_url || '/placeholder.jpg'}
                          alt={item.products?.name}
                          className="h-full w-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/product/${item.products?.id}`}
                          className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {item.products?.name}
                        </Link>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center">
                      <span className="lg:hidden text-xs text-muted-foreground mr-2">Price:</span>
                      <span className="text-sm font-medium text-foreground">
                        {formatPrice(item.products?.price)}
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center border border-border rounded-xl overflow-hidden">
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className="p-2 hover:bg-accent transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-4 text-sm font-semibold text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className="p-2 hover:bg-accent transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal */}
                    <div className="text-center">
                      <span className="lg:hidden text-xs text-muted-foreground mr-2">Subtotal:</span>
                      <span className="text-sm font-bold text-foreground">
                        {formatPrice((item.products?.price || 0) * item.quantity)}
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-red-600 lg:mx-auto"
                      aria-label="Remove item"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <aside className="lg:w-96 shrink-0">
              <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 sticky top-28 h-fit">
                <h2 className="text-lg font-semibold text-foreground mb-6">Order Summary</h2>
                <div className="flex flex-col gap-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-foreground">
                      {shipping === 0 ? 'Free' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="border-t border-border pt-4 flex items-center justify-between">
                    <span className="text-base font-semibold text-foreground">Total</span>
                    <span className="text-xl font-bold text-primary">{formatPrice(total)}</span>
                  </div>
                </div>
                <Link
                  href="/checkout"
                  className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 text-sm font-semibold hover:bg-primary/90 transition-colors text-center block"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/shop"
                  className="w-full mt-3 bg-accent text-foreground rounded-xl py-3.5 text-sm font-semibold hover:bg-accent/80 transition-colors text-center block"
                >
                  Continue Shopping
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
