"use client"

import { useSession } from "@/hooks/useSession"
import { useReadingHistory } from "@/hooks/useReadingHistory"
import { useState, useEffect, useCallback } from "react"
import { signOut } from "next-auth/react"
import { Crown, CreditCard } from "lucide-react"
import { CheckoutButton } from "@/components/stripe/CheckoutButton"
import { useRouter } from "next/navigation"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export default function SettingsPage() {
  const { user } = useSession()
  const { history } = useReadingHistory()
  const router = useRouter()
  const [loadingPortal, setLoadingPortal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tier, setTier] = useState<"free" | "premium" | null>(null)
  const [loadingTier, setLoadingTier] = useState(true)

  const fetchUserTier = useCallback(async () => {
    if (!user) return

    try {
      const response = await fetch("/api/usage")
      const result = await response.json()
      if (result.success) {
        setTier(result.data.tier)
      }
    } catch (err) {
      console.error("Failed to fetch tier:", err)
    } finally {
      setLoadingTier(false)
    }
  }, [user])

  // Fetch user tier on mount
  useEffect(() => {
    if (user) {
      fetchUserTier()
    }
  }, [user, fetchUserTier])

  const handleOpenPortal = useCallback(async () => {
    if (!user) {
      setError("Please sign in first")
      return
    }

    setLoadingPortal(true)
    setError(null)

    try {
      const response = await fetch("/api/stripe/portal", {
        method: "POST",
      })

      const result = await response.json()

      if (result.success && result.data?.url) {
        // Redirect to Stripe customer portal
        window.location.href = result.data.url
      } else {
        setError(result.error || "Failed to open portal")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Portal failed")
    } finally {
      setLoadingPortal(false)
    }
  }, [user])

  const handleLogout = useCallback(async () => {
    await signOut({ callbackUrl: "/" })
    router.push("/")
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <h1 className="text-2xl font-bold mb-4">Sign in Required</h1>
          <p className="text-muted-foreground">Please sign in to access settings.</p>
          <button
            onClick={() => router.push("/signin")}
            className="bg-primary hover:opacity-90 text-primary-foreground px-6 py-2 rounded-lg transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  const isPremium = tier === "premium"

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </button>
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-700 text-red-100 p-4 rounded-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Subscription Section */}
        <div className="bg-card border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center">
            <Crown className="w-6 h-6 mr-2" />
            Subscription
          </h2>

          {loadingTier ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : isPremium ? (
            <div className="space-y-4">
              <div className="bg-yellow-400/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center text-yellow-400 font-semibold mb-2">
                  <Crown className="w-5 h-5 mr-2" />
                  Premium Member
                </div>
                <p className="text-foreground">
                  You have unlimited access to SpeedReader. Thank you for your support!
                </p>
              </div>

              <button
                onClick={handleOpenPortal}
                disabled={loadingPortal}
                className="w-full flex items-center justify-center px-4 py-3 bg-card hover:bg-muted text-foreground rounded-lg transition-colors disabled:opacity-50"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {loadingPortal ? "Opening..." : "Manage Subscription"}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-foreground mb-4">
                  Upgrade to Premium for unlimited speed reading and exclusive features.
                </p>
                <div className="text-3xl font-bold text-foreground mb-4">
                  $5<span className="text-lg font-normal text-muted-foreground">/month</span>
                </div>
              </div>

              <div className="bg-muted rounded-lg p-4 space-y-2">
                <div className="flex items-center text-foreground">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                  <span>Unlimited words per month</span>
                </div>
                <div className="flex items-center text-foreground">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                  <span>Priority support</span>
                </div>
                <div className="flex items-center text-foreground">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3" />
                  <span>Early access to new features</span>
                </div>
              </div>

              <CheckoutButton
                onCheckoutStart={() => console.log("Checkout started")}
                onCheckoutComplete={() => router.push("/settings?checkout=success")}
              />
            </div>
          )}
        </div>

        {/* Account Section */}
        <div className="bg-card border rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-foreground mb-4">Account</h2>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border">
              <span className="text-muted-foreground">Email</span>
              <span className="text-foreground">{user?.email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-3 bg-red-900 hover:bg-red-800 text-red-100 rounded-lg transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats Section */}
        {history && history.length > 0 && (
          <div className="bg-card border rounded-xl p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Reading Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {history.length}
                </div>
                <div className="text-muted-foreground text-sm">Total Sessions</div>
              </div>

              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {history.reduce((sum, h) => sum + (h.words_read || 0), 0).toLocaleString()}
                </div>
                <div className="text-muted-foreground text-sm">Words Read</div>
              </div>

              <div className="bg-muted rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-foreground mb-1">
                  {Math.round(
                    history
                      .filter(h => h.wpm !== null)
                      .reduce((sum, h) => sum + (h.wpm || 0), 0) /
                      history.filter(h => h.wpm !== null).length
                  ).toLocaleString()}
                </div>
                <div className="text-muted-foreground text-sm">Avg WPM</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </ErrorBoundary>
  )
}
