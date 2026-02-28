import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] lg:min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="/images/hero-fabric.jpg"
          alt="Premium fabric collection"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-foreground/50" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 lg:px-8 py-20 w-full">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.3em] text-primary-foreground/80 font-semibold mb-4">
            Summer 2026
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground leading-tight mb-6 text-balance">
            New Summer Collection 2026
          </h1>
          <p className="text-base lg:text-lg text-primary-foreground/70 leading-relaxed mb-8 max-w-md">
            Explore our exquisite range of premium fabrics, crafted with care for the modern woman. Timeless elegance meets contemporary design.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-primary-foreground text-foreground px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-foreground/90 transition-colors"
            >
              Shop Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 border border-primary-foreground/40 text-primary-foreground px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-primary-foreground/10 transition-colors"
            >
              View Collections
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
