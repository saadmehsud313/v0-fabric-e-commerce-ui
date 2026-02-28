"use client"

import { useState } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  UserCircle,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { orders, formatPrice } from "@/lib/data"

const sidebarLinks = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "My Orders", icon: Package, active: false },
  { label: "Profile", icon: UserCircle, active: false },
  { label: "Logout", icon: LogOut, active: false },
]

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    Delivered: "bg-green-100 text-green-800",
    Processing: "bg-yellow-100 text-yellow-800",
    Shipped: "bg-blue-100 text-blue-800",
    Pending: "bg-orange-100 text-orange-800",
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ${colors[status] || "bg-secondary text-secondary-foreground"}`}>
      {status}
    </span>
  )
}

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="bg-secondary py-8 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs text-muted-foreground mb-2">Home / Dashboard</p>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
              My Account
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-56 shrink-0">
              <nav className="bg-card rounded-2xl border border-border p-4 sticky top-28">
                <ul className="flex flex-col gap-1">
                  {sidebarLinks.map((link) => (
                    <li key={link.label}>
                      <button
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                          link.active
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground/70 hover:text-foreground hover:bg-accent"
                        }`}
                      >
                        <link.icon className="h-4 w-4" />
                        {link.label}
                      </button>
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
                      <li key={link.label}>
                        <button
                          onClick={() => setSidebarOpen(false)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                            link.active
                              ? "bg-primary text-primary-foreground"
                              : "text-foreground/70 hover:text-foreground hover:bg-accent"
                          }`}
                        >
                          <link.icon className="h-4 w-4" />
                          {link.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1">
              {/* Welcome */}
              <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 mb-6">
                <h2 className="font-serif text-xl font-bold text-foreground mb-2">
                  Welcome back, Aisha!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Manage your orders, update your profile, and explore your Fabric House account.
                </p>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-card rounded-2xl border border-border p-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Orders</p>
                  <p className="text-2xl font-bold text-foreground">{orders.length}</p>
                </div>
                <div className="bg-card rounded-2xl border border-border p-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-foreground">
                    {formatPrice(orders.reduce((s, o) => s + o.total, 0))}
                  </p>
                </div>
                <div className="bg-card rounded-2xl border border-border p-6">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Pending</p>
                  <p className="text-2xl font-bold text-foreground">
                    {orders.filter((o) => o.status !== "Delivered").length}
                  </p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-card rounded-2xl border border-border overflow-hidden">
                <div className="flex items-center justify-between p-6 pb-4">
                  <h3 className="text-base font-semibold text-foreground">Recent Orders</h3>
                  <Link href="#" className="text-xs text-primary font-medium hover:text-primary/80 transition-colors flex items-center gap-1">
                    View All <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-secondary text-xs text-muted-foreground uppercase tracking-wider">
                        <th className="text-left px-6 py-3 font-semibold">Order ID</th>
                        <th className="text-left px-6 py-3 font-semibold">Date</th>
                        <th className="text-left px-6 py-3 font-semibold">Status</th>
                        <th className="text-left px-6 py-3 font-semibold">Items</th>
                        <th className="text-right px-6 py-3 font-semibold">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-t border-border hover:bg-accent/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-foreground">{order.id}</td>
                          <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                          <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
                          <td className="px-6 py-4 text-muted-foreground">{order.items}</td>
                          <td className="px-6 py-4 text-right font-semibold text-foreground">{formatPrice(order.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
