import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

const footerLinks = {
  about: [
    { label: "Our Story", href: "/about" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Blog", href: "#" },
  ],
  customerService: [
    { label: "Contact Us", href: "/contact" },
    { label: "Shipping Info", href: "#" },
    { label: "Returns & Exchanges", href: "#" },
    { label: "FAQs", href: "#" },
  ],
  policies: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Refund Policy", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl font-bold mb-4">Fabric House</h3>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-6">
              Discover the finest Pakistani fabrics curated for elegance and comfort. From premium Lawn to luxurious Silk, we bring tradition to your doorstep.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors" aria-label="Facebook">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">About</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.about.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Customer Service</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.customerService.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">Policies</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.policies.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center">
          <p className="text-sm text-primary-foreground/40">
            {'© 2026 Fabric House. All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  )
}
