/**
 * Usage Tracking Utilities
 *
 * Track word usage and manage paywall tiers
 */

import { supabase, UserUsage, UserTier } from "./supabase"

export const FREE_TIER_LIMIT = 10000 // words per month

export interface UsageStats {
  wordsRead: number
  remaining: number
  tier: "free" | "premium"
  atLimit: boolean
  month: string
}

/**
 * Get or create user tier record
 */
async function ensureUserTier(userId: string): Promise<UserTier> {
  // First try to get existing tier
  const { data: existingTier, error: fetchError } = await supabase
    .from("user_tiers")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (existingTier) {
    return existingTier
  }

  // Create new free tier user
  const { data: newTier, error: insertError } = await supabase
    .from("user_tiers")
    .insert({ user_id: userId, tier: "free" })
    .select()
    .single()

  if (insertError) {
    throw new Error(`Failed to create user tier: ${insertError.message}`)
  }

  return newTier
}

/**
 * Track words read by incrementing the user's monthly usage
 */
export async function trackWordsRead(
  userId: string,
  count: number
): Promise<void> {
  if (!supabase) {
    console.warn("Supabase not configured, skipping usage tracking")
    return
  }

  // Use the database function for atomic increment
  const { error } = await supabase.rpc("increment_words_read", {
    p_user_id: userId,
    p_word_count: count
  })

  if (error) {
    throw new Error(`Failed to track words read: ${error.message}`)
  }
}

/**
 * Get usage stats for a user for the current month
 */
export async function getUsageStats(userId: string): Promise<UsageStats> {
  if (!supabase) {
    return {
      wordsRead: 0,
      remaining: FREE_TIER_LIMIT,
      tier: "free",
      atLimit: false,
      month: new Date().toISOString().slice(0, 7)
    }
  }

  // Get user tier
  const tier = await ensureUserTier(userId)

  // If premium, return unlimited usage
  if (tier.tier === "premium") {
    return {
      wordsRead: 0,
      remaining: -1, // -1 indicates unlimited
      tier: "premium",
      atLimit: false,
      month: new Date().toISOString().slice(0, 7)
    }
  }

  // Get current month's usage
  const currentMonth = new Date()
  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    .toISOString()

  const { data: usage, error } = await supabase
    .from("user_usage")
    .select("words_read")
    .eq("user_id", userId)
    .eq("month", monthStart.slice(0, 10)) // Just the date part
    .single()

  const wordsRead = usage?.words_read || 0
  const remaining = Math.max(0, FREE_TIER_LIMIT - wordsRead)

  return {
    wordsRead,
    remaining,
    tier: tier.tier as "free" | "premium",
    atLimit: wordsRead >= FREE_TIER_LIMIT,
    month: currentMonth.toISOString().slice(0, 7)
  }
}

/**
 * Get usage stats for a specific month
 */
export async function getUsageStatsForMonth(
  userId: string,
  month: string // Format: "YYYY-MM"
): Promise<{ wordsRead: number; month: string }> {
  if (!supabase) {
    return { wordsRead: 0, month }
  }

  // Parse the month string to get the first day
  const [year, monthNum] = month.split("-").map(Number)
  const monthStart = new Date(year, monthNum - 1, 1).toISOString().slice(0, 10)

  const { data: usage, error } = await supabase
    .from("user_usage")
    .select("words_read")
    .eq("user_id", userId)
    .eq("month", monthStart)
    .single()

  return {
    wordsRead: usage?.words_read || 0,
    month
  }
}

/**
 * Get user tier information
 */
export async function getUserTier(userId: string): Promise<UserTier | null> {
  if (!supabase) {
    return null
  }

  const { data, error } = await supabase
    .from("user_tiers")
    .select("*")
    .eq("user_id", userId)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // Not found - create default free tier
      return ensureUserTier(userId)
    }
    throw new Error(`Failed to fetch user tier: ${error.message}`)
  }

  return data
}

/**
 * Check if user can read more words (not at limit)
 */
export async function canReadMore(userId: string): Promise<boolean> {
  const stats = await getUsageStats(userId)
  return stats.tier === "premium" || stats.remaining > 0
}
