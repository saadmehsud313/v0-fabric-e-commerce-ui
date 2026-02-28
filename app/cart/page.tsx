"use client"

import { useState } from "react"
import Link from "next/link"
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { cartItems as initialCartItems, formatPrice } from "@/lib/data"

export default function CartPage() {
  const [items, setItems] = useState(initialCartItems)

  const updateQuantity = (id: number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    )
  }

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 5000 ? 0 : 350
  const total = subtotal + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/40 mb-6" />
            <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
              Your Cart is Empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Looks like you have not added anything yet.
            </p>
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
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
              Shopping Cart
            </h1>
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
                      i > 0 ? "border-t border-border" : ""
                    }`}
                  >
                    {/* Product */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="h-20 w-20 shrink-0 rounded-xl overflow-hidden bg-secondary">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/product/${item.id}`}
                          className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {item.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="text-center">
                      <span className="lg:hidden text-xs text-muted-foreground mr-2">Price:</span>
                      <span className="text-sm font-medium text-foreground">{formatPrice(item.price)}</span>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center justify-center">
                      <div className="flex items-center border border-border rounded-xl overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.id, -1)}
                          className="p-2 hover:bg-accent transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="px-4 text-sm font-semibold text-foreground">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1)}
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
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>

              <Link
                href="/shop"
                className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <ArrowRight className="h-4 w-4 rotate-180" />
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:w-80 shrink-0">
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-28">
                <h2 className="text-lg font-semibold text-foreground mb-6">Order Summary</h2>
                <div className="flex flex-col gap-3 pb-6 border-b border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Items ({items.reduce((s, i) => s + i.quantity, 0)})
                    </span>
                    <span className="font-medium text-foreground">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-foreground">
                      {shipping === 0 ? "Free" : formatPrice(shipping)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-6 mb-6">
                  <span className="text-base font-semibold text-foreground">Total</span>
                  <span className="text-xl font-bold text-foreground">{formatPrice(total)}</span>
                </div>
                <Link
                  href="/checkout"
                  className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Proceed to Checkout
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {subtotal < 5000 && (
                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Add {formatPrice(5000 - subtotal)} more for free shipping
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
