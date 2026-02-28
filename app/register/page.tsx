"use client"

import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Label } from "@/components/ui/label"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
            <div className="text-center mb-8">
              <h1 className="font-serif text-2xl font-bold text-foreground mb-2">Create Account</h1>
              <p className="text-sm text-muted-foreground">Join kashfdigitex for an exclusive shopping experience</p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</Label>
                <input
                  id="name"
                  type="text"
                  placeholder="Aisha Khan"
                  className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

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
                <Label htmlFor="password" className="text-sm font-medium text-foreground">Password</Label>
                <input
                  id="password"
                  type="password"
                  placeholder="Create a password"
                  className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">Confirm Password</Label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  className="bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground rounded-xl py-3.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Create Account
              </button>
            </form>

            <p className="text-sm text-muted-foreground text-center mt-6">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:text-primary/80 transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
