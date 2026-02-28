'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShieldCheck, ArrowRight, Loader } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { getCart } from '@/app/actions/cart'
import { createOrder } from '@/app/actions/orders'
import { getUser } from '@/app/actions/auth'

function formatPrice(price: number | string) {
  return `Rs. ${Number(price).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

export default function CheckoutPage() {
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Pakistan',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    const init = async () => {
      const currentUser = await getUser()
      setUser(currentUser)

      if (!currentUser) {
        router.push('/login')
        return
      }

      const { items: cartItems } = await getCart()
      if (cartItems.length === 0) {
        router.push('/cart')
        return
      }

      setItems(cartItems)
      if (currentUser.email) {
        setFormData((prev) => ({ ...prev, email: currentUser.email }))
      }
      setLoading(false)
    }

    init()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      setError('Please fill in all required fields')
      return
    }

    setSubmitting(true)

    const result = await createOrder({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      country: formData.country,
    })

    if (!result.success) {
      setError(result.error || 'Failed to create order')
      setSubmitting(false)
    } else {
      router.push(`/order-confirmation/${result.orderId}`)
    }
  }

  const subtotal = items.reduce((sum, item) => sum + (item.products?.price || 0) * item.quantity, 0)
  const shipping = subtotal > 5000 ? 0 : 350
  const total = subtotal + shipping

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <p className="text-muted-foreground">Loading checkout...</p>
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
            <p className="text-xs text-muted-foreground mb-2">Home / Cart / Checkout</p>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">Checkout</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Forms */}
            <div className="flex-1 flex flex-col gap-8">
              {/* Shipping Address */}
              <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
                <h2 className="text-lg font-semibold text-foreground mb-6">Shipping Address</h2>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                      Full Name
                    </Label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="Aisha Khan"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email Address
                    </Label>
                    <input
                      id="email"
                      type="email"
                      placeholder="aisha@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
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
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
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
                      value={formData.address}
                      onChange={handleInputChange}
                      required
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
                      placeholder="Karachi"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="postalCode" className="text-sm font-medium text-foreground">
                      Postal Code
                    </Label>
                    <input
                      id="postalCode"
                      type="text"
                      placeholder="75500"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div className="sm:col-span-2 flex flex-col gap-1.5">
                    <Label htmlFor="country" className="text-sm font-medium text-foreground">
                      Country
                    </Label>
                    <input
                      id="country"
                      type="text"
                      placeholder="Pakistan"
                      value={formData.country}
                      onChange={handleInputChange}
                      className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="sm:col-span-2 pt-4 border-t border-border">
                    <h3 className="text-base font-semibold text-foreground mb-4">Payment Method</h3>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center gap-3 mb-4">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="text-sm cursor-pointer">
                          Cash on Delivery
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="card" id="card" disabled />
                        <Label htmlFor="card" className="text-sm cursor-not-allowed text-muted-foreground">
                          Credit/Debit Card (Coming Soon)
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-primary text-primary-foreground rounded-xl py-4 text-base font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {submitting && <Loader className="h-4 w-4 animate-spin" />}
                      {submitting ? 'Processing Order...' : 'Place Order'}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right: Order Summary */}
            <aside className="lg:w-96 shrink-0">
              <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 sticky top-28 h-fit">
                <h2 className="text-lg font-semibold text-foreground mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6 pb-6 border-b border-border">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-start gap-4">
                      <div className="h-16 w-16 shrink-0 rounded-lg overflow-hidden bg-secondary">
                        <img
                          src={item.products?.image_url || '/placeholder.jpg'}
                          alt={item.products?.name}
                          className="h-full w-full object-cover"
                          crossOrigin="anonymous"
                        />
                      </div>
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-foreground">{item.products?.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity}</p>
                        <p className="font-semibold text-foreground mt-1">
                          {formatPrice((item.products?.price || 0) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

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

                <div className="p-4 bg-blue-50 rounded-lg flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-700">
                    Your order is secure. We use industry-standard security measures to protect your information.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
