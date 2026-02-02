import { useEffect, useState } from "react"
import { getSession } from "@/lib/session"

interface User {
  id: string
  email?: string
  name?: string | null
  image?: string | null
}

interface Session {
  user: User | null
}

interface UseSessionReturn {
  session: Session | null
  user: User | null
  loading: boolean
}

export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionData = await getSession()
        setSession(sessionData as Session)
      } catch (error) {
        console.error("Failed to load session:", error)
        setSession(null)
      } finally {
        setLoading(false)
      }
    }

    loadSession()
  }, [])

  return {
    session,
    user: session?.user || null,
    loading
  }
}
