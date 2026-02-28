import Link from "next/link"

interface Category {
  name: string
  slug: string
  image: string
  count: number
}

export function CategoriesSection({ categories }: { categories: Category[] }) {
  return (
    <section className="py-16 lg:py-24 px-4 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
          Browse By
        </p>
        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
          Our Categories
        </h2>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop?category=${cat.slug}`}
            className="group relative aspect-[3/4] rounded-2xl overflow-hidden"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              crossOrigin="anonymous"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5">
              <h3 className="font-serif text-xl lg:text-2xl font-bold text-primary-foreground mb-1">
                {cat.name}
              </h3>
              <p className="text-xs text-primary-foreground/60">
                {cat.count} Products
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
