"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
            <div className="text-center mb-8">
              <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Welcome Back</h1>
              <p className="text-sm text-muted-foreground">Sign in to your kashfdigitex account</p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</Label>
                <input
                  id="email"
                  type="email"
                  placeholder="aisha@example.com"
                  className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                  <Link href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                  Remember me
                </Label>
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Sign In
              </button>
            </form>

            <p className="text-sm text-muted-foreground text-center mt-6">
              {"Don't have an account? "}
              <Link href="/register" className="text-primary font-medium hover:text-primary/80 transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
