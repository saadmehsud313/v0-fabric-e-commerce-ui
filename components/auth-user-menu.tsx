'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { User, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { signOut } from '@/app/actions/auth'

export function AuthUserMenu() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    checkUser()

    const {
      data: { subscription },
    } = createClient().auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <Link
        href="/login"
        className="hidden sm:flex p-2 rounded-full hover:bg-accent transition-colors"
        aria-label="Account"
      >
        <User className="h-5 w-5 text-foreground/70" />
      </Link>
    )
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="hidden sm:flex p-2 rounded-full hover:bg-accent transition-colors"
        aria-label="Account"
      >
        <User className="h-5 w-5 text-foreground/70" />
      </Link>
    )
  }

  return (
    <div className="hidden sm:flex items-center gap-2">
      <Link
        href="/dashboard"
        className="hidden sm:flex p-2 rounded-full hover:bg-accent transition-colors"
        aria-label="Dashboard"
      >
        <User className="h-5 w-5 text-foreground/70" />
      </Link>
      <button
        onClick={async () => {
          await signOut()
        }}
        className="p-2 rounded-full hover:bg-accent transition-colors"
        aria-label="Sign Out"
      >
        <LogOut className="h-5 w-5 text-foreground/70" />
      </button>
    </div>
  )
}
