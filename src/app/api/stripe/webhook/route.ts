import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import Stripe from "stripe"
import { verifyWebhookSignature, handleSubscriptionCreated, handleSubscriptionUpdated, handleSubscriptionDeleted, handleInvoicePaymentFailed } from "@/lib/stripe"
import { supabase } from "@/lib/supabase"

/**
 * POST /api/stripe/webhook
 * Handle Stripe webhook events for subscription management
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get("stripe-signature") || ""

    // Verify webhook signature
    const event = verifyWebhookSignature(body, signature)

    // Handle different event types
    switch (event.type) {
      case "customer.subscription.created":
        await handleSubscriptionCreated(event)
        break

      case "customer.subscription.updated":
        await handleSubscriptionUpdated(event)
        break

      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event)
        break

      case "invoice.payment_failed":
        await handleInvoicePaymentFailed(event)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Update user_tiers table based on subscription status
    await updateUserTierFromEvent(event)

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handler failed"
    console.error("Webhook error:", error)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

/**
 * Update user tier in Supabase based on subscription event
 */
async function updateUserTierFromEvent(event: Stripe.Event) {

  // Handle subscription events
  if (
    event.type === "customer.subscription.created" ||
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription
    const customerId = subscription.customer as string
    const userId = subscription.metadata.userId

    if (!userId) {
      return
    }

    const isPremium = subscription.status === "active"

    // Update user tier
    await supabase
      .from("user_tiers")
      .upsert({
        user_id: userId,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscription.id,
        tier: isPremium ? "premium" : "free",
        subscription_status: subscription.status,
      })

    console.log(`Updated user tier: ${userId} -> ${isPremium ? "premium" : "free"}`)
  }
}
