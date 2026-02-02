"use client"

import { signOut, useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function UserMenu() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  if (!session?.user) return null

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt={session.user.name || "User"}
            className="w-8 h-8 rounded-full"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {session.user.name?.[0]?.toUpperCase() || session.user.email?.[0]?.toUpperCase() || "U"}
            </span>
          </div>
        )}
        <span className="hidden sm:inline text-sm">
          {session.user.name || session.user.email}
        </span>
      </Button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 z-50 w-48 bg-card border border-primary rounded-md shadow-lg py-1">
            <div className="px-4 py-2 border-b border-primary/20">
              <p className="text-sm font-medium truncate">
                {session.user.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {session.user.email}
              </p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full text-left px-4 py-2 text-sm hover:bg-primary/10 transition-colors"
            >
              Sign out
            </button>
          </div>
        </>
      )}
    </div>
  )
}
