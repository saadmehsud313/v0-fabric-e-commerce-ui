'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, Package, UserCircle, LogOut, ChevronRight, Menu, X, Clock, CheckCircle, Truck } from 'lucide-react'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { getUser, getUserProfile, signOut } from '@/app/actions/auth'
import { getOrders } from '@/app/actions/orders'

function formatPrice(price: number | string) {
  return `Rs. ${Number(price).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
}

function StatusBadge({ status }: { status: string }) {
  const icons: Record<string, any> = {
    pending: Clock,
    processing: Package,
    shipped: Truck,
    delivered: CheckCircle,
  }

  const colors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
  }

  const statusKey = status?.toLowerCase() || 'pending'
  const Icon = icons[statusKey] || Package
  const colorClass = colors[statusKey] || 'bg-secondary text-secondary-foreground'

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-semibold ${colorClass}`}>
      <Icon className="h-3 w-3" />
      {status || 'Pending'}
    </span>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders')
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const currentUser = await getUser()
      if (!currentUser) {
        router.push('/login')
        return
      }

      setUser(currentUser)

      const userProfile = await getUserProfile()
      setProfile(userProfile)

      const { orders: userOrders } = await getOrders()
      setOrders(userOrders || [])

      setLoading(false)
    }

    init()
  }, [router])

  const handleLogout = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </main>
        <Footer />
      </div>
    )
  }

  const sidebarLinks = [
    { label: 'My Orders', id: 'orders', icon: Package, active: activeTab === 'orders' },
    { label: 'Profile', id: 'profile', icon: UserCircle, active: activeTab === 'profile' },
    { label: 'Logout', id: 'logout', icon: LogOut, active: false },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-secondary py-8 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs text-muted-foreground mb-2">Home / Dashboard</p>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">My Account</h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-56 shrink-0">
              <nav className="bg-card rounded-2xl border border-border p-4 sticky top-28">
                <ul className="flex flex-col gap-1">
                  {sidebarLinks.map((link) => (
                    <li key={link.id}>
                      {link.id === 'logout' ? (
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <link.icon className="h-4 w-4" />
                          {link.label}
                        </button>
                      ) : (
                        <button
                          onClick={() => setActiveTab(link.id as 'orders' | 'profile')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                            link.active ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:text-foreground hover:bg-accent'
                          }`}
                        >
                          <link.icon className="h-4 w-4" />
                          {link.label}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </aside>

            {/* Mobile Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden fixed bottom-6 right-6 z-40 bg-primary text-primary-foreground p-3 rounded-xl shadow-lg hover:bg-primary/90 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {sidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-foreground/50" onClick={() => setSidebarOpen(false)} />
                <div className="absolute inset-y-0 left-0 w-72 bg-card p-6 animate-in slide-in-from-left duration-300">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-semibold text-foreground">Menu</h2>
                    <button onClick={() => setSidebarOpen(false)} className="p-1">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <ul className="flex flex-col gap-1">
                    {sidebarLinks.map((link) => (
                      <li key={link.id}>
                        {link.id === 'logout' ? (
                          <button
                            onClick={() => {
                              setSidebarOpen(false)
                              handleLogout()
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setActiveTab(link.id as 'orders' | 'profile')
                              setSidebarOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors text-foreground/70 hover:text-foreground hover:bg-accent"
                          >
                            <link.icon className="h-4 w-4" />
                            {link.label}
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1">
              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-6">My Orders</h2>
                  {orders.length === 0 ? (
                    <div className="bg-card rounded-2xl border border-border p-12 text-center">
                      <Package className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
                      <p className="text-muted-foreground mb-4">You haven't placed any orders yet.</p>
                      <Link
                        href="/shop"
                        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Start Shopping
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.map((order) => (
                        <Link
                          key={order.id}
                          href={`/order-confirmation/${order.id}`}
                          className="block bg-card rounded-2xl border border-border p-6 hover:border-primary/50 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Order ID</p>
                              <p className="font-mono text-sm font-semibold text-foreground">{order.id}</p>
                            </div>
                            <StatusBadge status={order.status} />
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Date</p>
                              <p className="text-sm font-semibold text-foreground">
                                {new Date(order.created_at).toLocaleDateString()}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Items</p>
                              <p className="text-sm font-semibold text-foreground">
                                {order.order_items?.length || 0} item{order.order_items?.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground mb-1">Total</p>
                              <p className="text-sm font-bold text-primary">{formatPrice(order.total_amount)}</p>
                            </div>
                            <div className="text-right">
                              <ChevronRight className="h-5 w-5 text-muted-foreground ml-auto" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'profile' && (
                <div>
                  <h2 className="text-2xl font-semibold text-foreground mb-6">Profile Information</h2>
                  <div className="bg-card rounded-2xl border border-border p-8 max-w-2xl">
                    <div className="space-y-6">
                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Email Address
                        </label>
                        <p className="text-sm font-semibold text-foreground mt-2">{user?.email}</p>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Full Name
                        </label>
                        <p className="text-sm font-semibold text-foreground mt-2">
                          {profile?.full_name || 'Not set'}
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Phone
                        </label>
                        <p className="text-sm font-semibold text-foreground mt-2">
                          {profile?.phone || 'Not set'}
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Address
                        </label>
                        <p className="text-sm font-semibold text-foreground mt-2">
                          {profile?.address || 'Not set'}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-border">
                        <p className="text-xs text-muted-foreground mb-4">
                          Account created on {new Date(user?.created_at).toLocaleDateString()}
                        </p>
                        <button
                          onClick={handleLogout}
                          className="text-sm font-semibold text-red-600 hover:text-red-700 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
