import Link from "next/link"
import { ShoppingBag, Star } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/data"

interface ProductCardProps {
  id: number
  name: string
  price: number
  originalPrice: number | null
  image: string
  badge: string | null
  rating: number
  category: string
}

export function ProductCard({
  id,
  name,
  price,
  originalPrice,
  image,
  badge,
  rating,
  category,
}: ProductCardProps) {
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null

  return (
    <div className="group rounded-2xl bg-card border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Image */}
      <Link href={`/product/${id}`} className="block relative aspect-[4/5] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          crossOrigin="anonymous"
        />
        {badge && (
          <Badge
            className={`absolute top-3 left-3 rounded-lg text-xs font-semibold border-0 ${
              badge === "Sale"
                ? "bg-primary text-primary-foreground"
                : "bg-foreground text-card"
            }`}
          >
            {badge}
          </Badge>
        )}
        {discount && (
          <Badge className="absolute top-3 right-3 rounded-lg text-xs font-semibold bg-primary text-primary-foreground border-0">
            {`-${discount}%`}
          </Badge>
        )}
      </Link>

      {/* Details */}
      <div className="p-4">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
          {category}
        </p>
        <Link href={`/product/${id}`}>
          <h3 className="text-sm font-semibold text-foreground leading-snug mb-2 line-clamp-2 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3 w-3 ${
                i < Math.floor(rating)
                  ? "fill-primary/80 text-primary/80"
                  : "fill-border text-border"
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">
            {rating.toFixed(1)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-foreground">
              {formatPrice(price)}
            </span>
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
          <button
            className="p-2 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            aria-label={`Add ${name} to cart`}
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
