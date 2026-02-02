import { NextRequest, NextResponse } from "next/server"
import { getOrCreateCustomer, createCheckoutSession } from "@/lib/stripe"
import { supabase } from "@/lib/supabase"

/**
 * POST /api/stripe/checkout
 * Create a Stripe checkout session for subscription upgrade
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

    const body = await request.json()
    const { tier } = body as { tier: "premium" }

    if (tier !== "premium") {
      return NextResponse.json(
        { error: "Invalid tier" },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    const customer = await getOrCreateCustomer(
      user.email || "",
      user.user_metadata.name || user.email || ""
    )

    // Update user with Stripe customer ID
    await supabase
      .from("user_tiers")
      .upsert({
        user_id: user.id,
        stripe_customer_id: customer.id,
        tier: "premium", // Will be updated when webhook confirms subscription
      })

    // Create checkout session
    const session = await createCheckoutSession(user.id)

    return NextResponse.json({ success: true, data: session })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create checkout session"
    console.error("Checkout error:", error)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
