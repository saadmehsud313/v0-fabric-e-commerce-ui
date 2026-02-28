"use client"

import { useState } from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  DollarSign,
  Menu,
  X,
  ChevronRight,
  BarChart3,
} from "lucide-react"
import { adminStats, recentOrders, formatPrice } from "@/lib/data"

const adminSidebarLinks = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Products", icon: Package, active: false },
  { label: "Orders", icon: ShoppingCart, active: false },
  { label: "Users", icon: Users, active: false },
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

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const statCards = [
    {
      label: "Total Users",
      value: adminStats.totalUsers.toLocaleString(),
      icon: Users,
      change: "+12%",
      color: "bg-blue-50 text-blue-700",
      iconColor: "text-blue-600",
    },
    {
      label: "Total Orders",
      value: adminStats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      change: "+8%",
      color: "bg-green-50 text-green-700",
      iconColor: "text-green-600",
    },
    {
      label: "Revenue",
      value: formatPrice(adminStats.totalRevenue),
      icon: DollarSign,
      change: "+23%",
      color: "bg-primary/5 text-primary",
      iconColor: "text-primary",
    },
    {
      label: "Products",
      value: adminStats.totalProducts.toString(),
      icon: Package,
      change: "+5%",
      color: "bg-orange-50 text-orange-700",
      iconColor: "text-orange-600",
    },
  ]

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-sidebar text-sidebar-foreground min-h-screen">
        <div className="p-6 border-b border-sidebar-border">
          <Link href="/" className="font-serif text-xl font-bold text-sidebar-foreground">
            Fabric House
          </Link>
          <p className="text-xs text-sidebar-foreground/50 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="flex flex-col gap-1">
            {adminSidebarLinks.map((link) => (
              <li key={link.label}>
                <button
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    link.active
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  }`}
                >
                  <link.icon className="h-4 w-4" />
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <Link
            href="/"
            className="text-xs text-sidebar-foreground/40 hover:text-sidebar-foreground/60 transition-colors"
          >
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-foreground/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-72 bg-sidebar text-sidebar-foreground p-6 animate-in slide-in-from-left duration-300">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-serif text-lg font-bold">Fabric House</h2>
                <p className="text-xs text-sidebar-foreground/50">Admin Panel</p>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-1">
                <X className="h-5 w-5 text-sidebar-foreground" />
              </button>
            </div>
            <ul className="flex flex-col gap-1">
              {adminSidebarLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => setSidebarOpen(false)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      link.active
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent"
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
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-card border-b border-border px-4 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-accent transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5 text-foreground" />
            </button>
            <h1 className="text-lg font-semibold text-foreground">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              A
            </div>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            {statCards.map((stat) => (
              <div key={stat.label} className="bg-card rounded-2xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl ${stat.color}`}>
                    <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700">
                    <TrendingUp className="h-3 w-3" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-foreground">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Chart Placeholder + Quick Actions */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* Chart */}
            <div className="xl:col-span-2 bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-semibold text-foreground">Revenue Overview</h3>
                <select className="text-xs bg-secondary border border-border rounded-lg px-3 py-1.5 text-muted-foreground">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 3 months</option>
                </select>
              </div>
              <div className="flex items-end gap-3 h-48">
                {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div
                      className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/40"
                      style={{ height: `${height}%` }}
                    >
                      <div
                        className="w-full bg-primary rounded-t-lg"
                        style={{ height: `${Math.min(100, height + 10)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="text-base font-semibold text-foreground mb-6">Quick Stats</h3>
              <div className="flex flex-col gap-5">
                {[
                  { label: "Average Order Value", value: formatPrice(28600) },
                  { label: "Conversion Rate", value: "3.2%" },
                  { label: "Active Customers", value: "847" },
                  { label: "Returns Rate", value: "1.8%" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="text-sm font-semibold text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders Table */}
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="flex items-center justify-between p-6 pb-4">
              <h3 className="text-base font-semibold text-foreground">Recent Orders</h3>
              <button className="text-xs text-primary font-medium hover:text-primary/80 transition-colors flex items-center gap-1">
                View All <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-secondary text-xs text-muted-foreground uppercase tracking-wider">
                    <th className="text-left px-6 py-3 font-semibold">Order ID</th>
                    <th className="text-left px-6 py-3 font-semibold">Customer</th>
                    <th className="text-left px-6 py-3 font-semibold">Date</th>
                    <th className="text-left px-6 py-3 font-semibold">Status</th>
                    <th className="text-right px-6 py-3 font-semibold">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-t border-border hover:bg-accent/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-foreground">{order.id}</td>
                      <td className="px-6 py-4 text-muted-foreground">{order.customer}</td>
                      <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                      <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
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
  )
}
