"use client"

import { useSession } from "@/hooks/useSession"
import { useState } from "react"

interface CheckoutButtonProps {
  onCheckoutStart: () => void
  onCheckoutComplete: () => void
}

export function CheckoutButton({ onCheckoutStart, onCheckoutComplete }: CheckoutButtonProps) {
  const { user } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleCheckout = async () => {
    if (!user) {
      setError("Please sign in first")
      return
    }

    setLoading(true)
    setError(null)
    onCheckoutStart()

    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: "premium" }),
      })

      const result = await response.json()

      if (result.success && result.data?.url) {
        // Redirect to Stripe checkout
        window.location.href = result.data.url
      } else {
        setError(result.error || "Failed to create checkout session")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="flex-1 px-4 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Processing..." : "Upgrade"}
      </button>

      {error && (
        <div className="bg-red-900 border border-red-700 text-red-100 p-3 rounded-lg text-sm">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        Secure payment powered by Stripe
      </p>
    </div>
  )
}
