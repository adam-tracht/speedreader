import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Allow build to complete without Supabase env vars for development
// In production, these must be set via environment variables
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export const hasSupabaseConfig = !!supabase

// =====================================================
// Database Types (matching migration schema)
// =====================================================

export interface DbUser {
  id: string
  email: string
  name: string | null
  image: string | null
  created_at: string
}

export interface SavedText {
  id: string
  user_id: string
  title: string
  content: string
  source_url: string | null
  word_count: number
  current_position: number
  created_at: string
  updated_at: string
}

export interface ReadingHistory {
  id: string
  user_id: string
  saved_text_id: string | null
  title: string
  words_read: number
  wpm: number | null
  duration_seconds: number | null
  created_at: string
}

// Input types for creating records
export interface SaveTextInput {
  title: string
  content: string
  source_url?: string | null
  word_count: number
}

export interface UpdatePositionInput {
  current_position: number
}

export interface AddHistoryInput {
  saved_text_id?: string | null
  title: string
  words_read: number
  wpm?: number | null
  duration_seconds?: number | null
}

// Aggregated statistics
export interface ReadingStats {
  total_sessions: number
  total_words_read: number
  avg_wpm: number
  total_duration_seconds: number
}

// Usage tracking types
export interface UserUsage {
  id: string
  user_id: string
  month: string // Date string
  words_read: number
  created_at: string
  updated_at: string
}

export interface UserTier {
  id: string
  user_id: string
  tier: "free" | "premium"
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  subscription_status: "active" | "canceled" | "past_due" | "incomplete" | "trialing" | null
  created_at: string
  updated_at: string
}
