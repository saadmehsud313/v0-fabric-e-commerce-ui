import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { categories, products, newArrivals } from "@/lib/data"
import { NewsletterSection } from "@/components/newsletter"
import { HeroSection } from "@/components/hero"
import { CategoriesSection } from "@/components/categories-section"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <CategoriesSection categories={categories} />

        {/* Featured Products */}
        <section className="py-16 lg:py-24 px-4 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
                Curated Selection
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground text-balance">
                Featured Products
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <Link
            href="/shop"
            className="sm:hidden flex items-center justify-center gap-2 mt-8 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </section>

        {/* Promo Banner */}
        <section className="relative overflow-hidden bg-primary mx-4 lg:mx-8 rounded-2xl">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558171813-4c088753af8f?w=1200&h=400&fit=crop')] bg-cover bg-center opacity-20" />
          <div className="relative py-16 lg:py-20 px-8 lg:px-16 text-center">
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-primary-foreground mb-4 text-balance">
              Exclusive Wedding Collection
            </h2>
            <p className="text-primary-foreground/70 max-w-lg mx-auto mb-8 leading-relaxed">
              Discover our handcrafted bridal fabrics with intricate embroidery and premium silk blends, designed for your most special day.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-primary-foreground text-foreground px-8 py-3 rounded-xl text-sm font-semibold hover:bg-primary-foreground/90 transition-colors"
            >
              Explore Collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-16 lg:py-24 px-4 lg:px-8 max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
                Just Dropped
              </p>
              <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground text-balance">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...newArrivals, ...products.slice(0, 4 - newArrivals.length)].slice(0, 4).map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>

        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )
}
