"use client"

import { useState } from "react"
import { SlidersHorizontal, X, ChevronDown } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { products } from "@/lib/data"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"

const fabricTypes = ["Lawn", "Cotton", "Silk", "Khaddar"]

export default function ShopPage() {
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState("newest")
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const filteredProducts = products.filter((p) => {
    if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false
    return true
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "low-high") return a.price - b.price
    if (sortBy === "high-low") return b.price - a.price
    return b.id - a.id
  })

  const FilterContent = () => (
    <div className="flex flex-col gap-8">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">Categories</h3>
        <div className="flex flex-col gap-3">
          {fabricTypes.map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox
                checked={selectedCategories.includes(type)}
                onCheckedChange={() => toggleCategory(type)}
              />
              <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">Price Range</h3>
        <Slider
          defaultValue={[0, 10000]}
          max={10000}
          step={500}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mb-3"
        />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Rs. {priceRange[0].toLocaleString()}</span>
          <span>Rs. {priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      {/* Fabric Type */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">Fabric Type</h3>
        <div className="flex flex-col gap-3">
          {["Digital Print", "Embroidered", "Plain", "Jacquard"].map((type) => (
            <label key={type} className="flex items-center gap-3 cursor-pointer group">
              <Checkbox />
              <span className="text-sm text-foreground/70 group-hover:text-foreground transition-colors">
                {type}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-secondary py-8 px-4 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs text-muted-foreground mb-2">Home / Shop</p>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
              Our Collection
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-28 bg-card rounded-2xl border border-border p-6">
                <h2 className="text-base font-semibold text-foreground mb-6">Filters</h2>
                <FilterContent />
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={() => setFiltersOpen(true)}
                  className="lg:hidden inline-flex items-center gap-2 bg-card border border-border rounded-xl px-4 py-2.5 text-sm font-medium text-foreground hover:bg-accent transition-colors"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </button>
                <p className="hidden lg:block text-sm text-muted-foreground">
                  {sortedProducts.length} products found
                </p>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-card border border-border rounded-xl px-4 py-2.5 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                  >
                    <option value="newest">Newest</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} {...product} />
                ))}
              </div>

              {sortedProducts.length === 0 && (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">No products match your filters.</p>
                </div>
              )}

              {/* Pagination */}
              {sortedProducts.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {[1, 2, 3].map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-10 w-10 rounded-xl text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground"
                          : "bg-card border border-border text-foreground hover:bg-accent"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Overlay */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-foreground/50" onClick={() => setFiltersOpen(false)} />
            <div className="absolute inset-y-0 left-0 w-80 max-w-[85vw] bg-card p-6 overflow-y-auto animate-in slide-in-from-left duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-base font-semibold text-foreground">Filters</h2>
                <button onClick={() => setFiltersOpen(false)} className="p-1 rounded-lg hover:bg-accent transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <FilterContent />
              <button
                onClick={() => setFiltersOpen(false)}
                className="mt-8 w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}
