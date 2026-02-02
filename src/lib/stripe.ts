/**
 * Stripe Utilities
 *
 * Handle Stripe checkout, subscriptions, and customer portal
 */

import Stripe from "stripe"
import { stripeClient } from "@/lib/stripe-client"

/**
 * Create a Stripe checkout session for subscription upgrade
 */
export async function createCheckoutSession(userId: string) {
  const stripe = stripeClient()

  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "SpeedReader Premium",
            description: "Unlimited speed reading - 10,000+ words per month",
          },
          unit_amount: 500, // $5.00 in cents
        },
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings?checkout=canceled`,
    customer_email: undefined, // Will be set from user data
    client_reference_id: userId,
    metadata: {
      userId,
    },
  })

  return checkoutSession
}

/**
 * Create a customer portal session for subscription management
 */
export async function createCustomerPortalSession(stripeCustomerId: string) {
  const stripe = stripeClient()

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/settings`,
  })

  return portalSession
}

/**
 * Get or create Stripe customer for a user
 */
export async function getOrCreateCustomer(email: string, name: string): Promise<Stripe.Customer> {
  const stripe = stripeClient()

  // Try to find existing customer by email
  const existingCustomers = await stripe.customers.list({
    email: email,
    limit: 1,
  })

  if (existingCustomers.data.length > 0) {
    return existingCustomers.data[0]
  }

  // Create new customer
  const customer = await stripe.customers.create({
    email,
    name,
  })

  return customer
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  const stripe = stripeClient()
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!webhookSecret) {
    throw new Error("Stripe webhook secret not configured")
  }

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    webhookSecret
  )

  return event
}

/**
 * Handle subscription created event
 */
export async function handleSubscriptionCreated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription
  const customerId = subscription.customer as string
  const userId = subscription.metadata.userId

  if (!userId) {
    console.error("No userId in subscription metadata")
    return
  }

  // Update user tier in Supabase
  // This will be handled by the database webhook endpoint
  console.log("Subscription created for user:", userId, "Customer:", customerId)
}

/**
 * Handle subscription updated event
 */
export async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription
  const status = subscription.status

  const tier = status === "active" ? "premium" : "free"
  const userId = subscription.metadata.userId

  if (!userId) {
    return
  }

  console.log("Subscription updated for user:", userId, "Status:", status, "Tier:", tier)
}

/**
 * Handle subscription deleted/canceled event
 */
export async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription = event.data.object as Stripe.Subscription
  const userId = subscription.metadata.userId

  if (!userId) {
    return
  }

  console.log("Subscription canceled for user:", userId)
}

/**
 * Handle invoice payment failed event
 */
export async function handleInvoicePaymentFailed(event: Stripe.Event) {
  const invoice = event.data.object as Stripe.Invoice
  const customerId = invoice.customer as string

  console.error("Invoice payment failed for customer:", customerId, "Invoice:", invoice.id)
}
