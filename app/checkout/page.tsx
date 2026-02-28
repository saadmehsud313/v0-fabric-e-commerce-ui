"use client"

import { useState } from "react"
import Link from "next/link"
import { ShieldCheck, ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { cartItems, formatPrice } from "@/lib/data"

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("cod")

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 5000 ? 0 : 350
  const total = subtotal + shipping

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-secondary py-8 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs text-muted-foreground mb-2">Home / Cart / Checkout</p>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
              Checkout
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Forms */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Shipping Address */}
              <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
                <h2 className="text-lg font-semibold text-foreground mb-6">Shipping Address</h2>
                <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="firstName" className="text-sm font-medium text-foreground">
                      First Name
                    </Label>
                    <input
                      id="firstName"
                      type="text"
                      placeholder="Aisha"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="lastName" className="text-sm font-medium text-foreground">
                      Last Name
                    </Label>
                    <input
                      id="lastName"
                      type="text"
                      placeholder="Khan"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <input
                      id="email"
                      type="email"
                      placeholder="aisha@example.com"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Phone Number
                    </Label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+92 300 1234567"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <Label htmlFor="address" className="text-sm font-medium text-foreground">
                      Street Address
                    </Label>
                    <input
                      id="address"
                      type="text"
                      placeholder="123 Main Street, Block A"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="city" className="text-sm font-medium text-foreground">
                      City
                    </Label>
                    <input
                      id="city"
                      type="text"
                      placeholder="Lahore"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="zip" className="text-sm font-medium text-foreground">
                      Postal Code
                    </Label>
                    <input
                      id="zip"
                      type="text"
                      placeholder="54000"
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </form>
              </div>

              {/* Payment Method */}
              <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
                <h2 className="text-lg font-semibold text-foreground mb-6">Payment Method</h2>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col gap-4">
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === "cod" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                    <RadioGroupItem value="cod" id="cod" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Cash on Delivery</p>
                      <p className="text-xs text-muted-foreground">Pay when your order arrives</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                    <RadioGroupItem value="card" id="card" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Credit / Debit Card</p>
                      <p className="text-xs text-muted-foreground">Visa, Mastercard, JazzCash</p>
                    </div>
                  </label>
                </RadioGroup>

                {paymentMethod === "card" && (
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                    <div className="sm:col-span-2 flex flex-col gap-1.5">
                      <Label htmlFor="cardNumber" className="text-sm font-medium text-foreground">Card Number</Label>
                      <input
                        id="cardNumber"
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="expiry" className="text-sm font-medium text-foreground">Expiry Date</Label>
                      <input
                        id="expiry"
                        type="text"
                        placeholder="MM/YY"
                        className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="cvv" className="text-sm font-medium text-foreground">CVV</Label>
                      <input
                        id="cvv"
                        type="text"
                        placeholder="123"
                        className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:w-96 shrink-0">
              <div className="bg-card rounded-2xl border border-border p-6 sticky top-28">
                <h2 className="text-lg font-semibold text-foreground mb-6">Order Summary</h2>

                {/* Items */}
                <div className="flex flex-col gap-4 pb-6 border-b border-border">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-secondary">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-semibold text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3 py-6 border-b border-border">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
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

                <button className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
                  Place Order
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Secure encrypted checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
