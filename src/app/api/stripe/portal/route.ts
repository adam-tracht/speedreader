import { NextRequest, NextResponse } from "next/server"
import { createCustomerPortalSession } from "@/lib/stripe"
import { supabase } from "@/lib/supabase"

/**
 * POST /api/stripe/portal
 * Create a Stripe customer portal session for subscription management
 */
export async function POST(request: NextRequest) {
  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Get user's Stripe customer ID
    const { data: tier } = await supabase
      .from("user_tiers")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single()

    if (!tier?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No Stripe customer found" },
        { status: 400 }
      )
    }

    // Create portal session
    const session = await createCustomerPortalSession(tier.stripe_customer_id)

    return NextResponse.json({ success: true, data: { url: session.url } })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create portal session"
    console.error("Portal error:", error)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
