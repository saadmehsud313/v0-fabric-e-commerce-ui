"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ShoppingBag, User, Menu, ChevronDown, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { AuthUserMenu } from "@/components/auth-user-menu"

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  {
    label: "Categories",
    href: "#",
    children: [
      { label: "Lawn", href: "/shop?category=lawn" },
      { label: "Cotton", href: "/shop?category=cotton" },
      { label: "Silk", href: "/shop?category=silk" },
      { label: "Khaddar", href: "/shop?category=khaddar" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <nav className="mx-auto max-w-7xl flex items-center justify-between px-4 lg:px-8 h-16 lg:h-20">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-serif text-xl lg:text-2xl font-bold tracking-wider text-foreground">
            kashfdigitex
          </span>
        </Link>

        {/* Center: Desktop Nav */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) =>
            link.children ? (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button className="flex items-center gap-1 text-sm font-medium text-foreground/80 hover:text-primary transition-colors">
                  {link.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {dropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-44 bg-card rounded-xl border border-border shadow-md py-2 animate-in fade-in-0 zoom-in-95 duration-200">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-accent transition-colors"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
        </div>

        {/* Right: Icons */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Search"
            >
              {searchOpen ? <X className="h-5 w-5 text-foreground/70" /> : <Search className="h-5 w-5 text-foreground/70" />}
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 animate-in fade-in-0 slide-in-from-top-2 duration-200">
                <input
                  type="text"
                  placeholder="Search fabrics..."
                  className="w-full bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-md"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            href="/cart"
            className="p-2 rounded-full hover:bg-accent transition-colors relative"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5 text-foreground/70" />
            <Badge className="absolute -top-0.5 -right-0.5 h-4.5 w-4.5 flex items-center justify-center rounded-full text-[10px] p-0 bg-primary text-primary-foreground border-0">
              3
            </Badge>
          </Link>

          {/* User */}
          <AuthUserMenu />

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="lg:hidden p-2 rounded-full hover:bg-accent transition-colors"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5 text-foreground/70" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 bg-card p-0">
              <SheetHeader className="p-6 pb-4 border-b border-border">
                <SheetTitle className="font-serif text-xl tracking-wider text-foreground">
                  kashfdigitex
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col py-4">
                {navLinks.map((link) =>
                  link.children ? (
                    <div key={link.label}>
                      <span className="block px-6 py-3 text-sm font-semibold text-foreground/60 uppercase tracking-wider">
                        {link.label}
                      </span>
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block px-8 py-2.5 text-sm text-foreground/80 hover:text-primary hover:bg-accent transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-6 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent transition-colors"
                    >
                      {link.label}
                    </Link>
                  )
                )}
                <div className="border-t border-border mt-4 pt-4">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-6 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-6 py-3 text-sm font-medium text-foreground/80 hover:text-primary hover:bg-accent transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  )
}
