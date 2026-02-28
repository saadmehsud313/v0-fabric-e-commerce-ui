"use client"

import { Send } from "lucide-react"

export function NewsletterSection() {
  return (
    <section className="bg-secondary py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
        <p className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">
          Stay Updated
        </p>
        <h2 className="font-serif text-3xl lg:text-4xl font-bold text-secondary-foreground mb-4 text-balance">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
          Be the first to know about new collections, exclusive deals, and seasonal offers delivered straight to your inbox.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full flex-1 bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Subscribe
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  )
}
