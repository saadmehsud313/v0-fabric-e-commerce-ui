"use client"

import { useState, use } from "react"
import Link from "next/link"
import {
  Star,
  Minus,
  Plus,
  ShoppingBag,
  Heart,
  Share2,
  Truck,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
} from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { products, formatPrice } from "@/lib/data"

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const product = products.find((p) => p.id === Number(id)) || products[0]
  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null

  const thumbnails = [
    product.image,
    product.image.replace("w=500", "w=501"),
    product.image.replace("w=500", "w=502"),
    product.image.replace("w=500", "w=503"),
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        {/* Product Section */}
        <section className="max-w-7xl mx-auto px-4 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left: Images */}
            <div>
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-secondary mb-4">
                <img
                  src={thumbnails[selectedImage]}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {thumbnails.map((thumb, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`aspect-square rounded-xl overflow-hidden border-2 transition-colors ${
                      selectedImage === i ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img
                      src={thumb}
                      alt={`${product.name} view ${i + 1}`}
                      className="h-full w-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Details */}
            <div className="flex flex-col gap-6">
              <div>
                <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
                  {product.category}
                </p>
                <h1 className="font-serif text-2xl lg:text-3xl font-bold text-foreground mb-3">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "fill-primary/80 text-primary/80"
                            : "fill-border text-border"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                    <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-lg">
                      {`-${discount}%`}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              {/* Fabric Details */}
              <div className="bg-secondary rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-foreground mb-3">Fabric Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Fabric</p>
                    <p className="text-sm font-medium text-foreground">{product.fabric}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Pieces</p>
                    <p className="text-sm font-medium text-foreground">{product.pieces}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Weight</p>
                    <p className="text-sm font-medium text-foreground">{product.weight}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Availability</p>
                    <p className={`text-sm font-medium ${product.inStock ? "text-green-700" : "text-destructive"}`}>
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Quantity & Actions */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground">Quantity</span>
                  <div className="flex items-center border border-border rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-accent transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-5 text-sm font-semibold text-foreground">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-accent transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-xl py-3.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
                    <ShoppingBag className="h-4 w-4" />
                    Add to Cart
                  </button>
                  <button className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-primary text-primary rounded-xl py-3.5 text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors">
                    Buy Now
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Heart className="h-4 w-4" /> Wishlist
                  </button>
                  <button className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                <div className="flex flex-col items-center text-center gap-1.5">
                  <Truck className="h-5 w-5 text-primary" />
                  <span className="text-[11px] text-muted-foreground">Free Shipping</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  <span className="text-[11px] text-muted-foreground">Secure Payment</span>
                </div>
                <div className="flex flex-col items-center text-center gap-1.5">
                  <RotateCcw className="h-5 w-5 text-primary" />
                  <span className="text-[11px] text-muted-foreground">Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="description">
              <TabsList className="w-full sm:w-auto bg-secondary rounded-xl p-1">
                <TabsTrigger value="description" className="rounded-lg">Description</TabsTrigger>
                <TabsTrigger value="reviews" className="rounded-lg">Reviews</TabsTrigger>
                <TabsTrigger value="info" className="rounded-lg">Additional Info</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-6">
                <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {product.description}
                  </p>
                  <p className="text-muted-foreground leading-relaxed">
                    This premium fabric is carefully sourced and crafted to ensure the highest quality. Our fabrics go through rigorous quality checks to maintain color fastness, durability, and comfort. Each piece is designed to bring elegance to your wardrobe, whether you choose to stitch it traditionally or in a modern style.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
                  <div className="flex flex-col gap-6">
                    {[
                      { name: "Aisha K.", rating: 5, comment: "Absolutely stunning fabric quality! The embroidery is exquisite and the material is so soft.", date: "Feb 20, 2026" },
                      { name: "Sara A.", rating: 4, comment: "Beautiful design and good quality. Delivery was prompt. Would recommend.", date: "Feb 18, 2026" },
                      { name: "Fatima M.", rating: 5, comment: "Perfect for the summer season. The colors are exactly as shown in the pictures.", date: "Feb 15, 2026" },
                    ].map((review, i) => (
                      <div key={i} className={`${i > 0 ? "border-t border-border pt-6" : ""}`}>
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="text-sm font-semibold text-foreground">{review.name}</span>
                            <span className="text-xs text-muted-foreground ml-3">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-0.5">
                            {Array.from({ length: 5 }).map((_, j) => (
                              <Star
                                key={j}
                                className={`h-3 w-3 ${
                                  j < review.rating ? "fill-primary/80 text-primary/80" : "fill-border text-border"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="info" className="mt-6">
                <div className="bg-card rounded-2xl border border-border p-6 lg:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      ["Fabric Type", product.fabric],
                      ["Pieces", product.pieces],
                      ["Weight", product.weight],
                      ["Color", "As shown"],
                      ["Season", "Summer 2026"],
                      ["Care", "Dry clean recommended"],
                    ].map(([label, value]) => (
                      <div key={label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                        <span className="text-sm text-muted-foreground">{label}</span>
                        <span className="text-sm font-medium text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-serif text-2xl font-bold text-foreground mb-8">
                Related Products
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} {...p} />
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}
