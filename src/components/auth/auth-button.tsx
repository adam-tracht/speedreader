"use client"

import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

export function AuthButton() {
  const { data: session } = useSession()

  if (!session?.user) return null

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sign out
    </Button>
  )
}
