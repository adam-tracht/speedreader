/**
 * Reading History Utilities
 *
 * CRUD operations for reading_history table
 */

import { supabase, ReadingHistory, AddHistoryInput, ReadingStats } from "./supabase"

/**
 * Add a reading history entry
 */
export async function addHistoryEntry(
  userId: string,
  data: AddHistoryInput
): Promise<ReadingHistory> {
  const { data: history, error } = await supabase
    .from("reading_history")
    .insert({
      user_id: userId,
      saved_text_id: data.saved_text_id || null,
      title: data.title,
      words_read: data.words_read,
      wpm: data.wpm || null,
      duration_seconds: data.duration_seconds || null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to add history entry: ${error.message}`)
  }

  return history
}

/**
 * Get reading history for a user, ordered by date (newest first)
 */
export async function getReadingHistory(
  userId: string,
  limit = 50
): Promise<ReadingHistory[]> {
  const { data, error } = await supabase
    .from("reading_history")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to fetch reading history: ${error.message}`)
  }

  return data || []
}

/**
 * Get reading history for a specific saved text
 */
export async function getTextHistory(
  userId: string,
  savedTextId: string
): Promise<ReadingHistory[]> {
  const { data, error } = await supabase
    .from("reading_history")
    .select("*")
    .eq("user_id", userId)
    .eq("saved_text_id", savedTextId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch text history: ${error.message}`)
  }

  return data || []
}

/**
 * Get aggregated reading statistics for a user
 */
export async function getUserStats(userId: string): Promise<ReadingStats> {
  const { data, error } = await supabase
    .from("reading_history")
    .select("words_read, wpm, duration_seconds")
    .eq("user_id", userId)

  if (error) {
    throw new Error(`Failed to fetch user stats: ${error.message}`)
  }

  const records = data || []

  const total_sessions = records.length
  const total_words_read = records.reduce((sum, r) => sum + r.words_read, 0)
  const total_duration_seconds = records.reduce(
    (sum, r) => sum + (r.duration_seconds || 0),
    0
  )

  // Calculate average WPM from records that have WPM data
  const recordsWithWpm = records.filter((r) => r.wpm !== null && r.wpm > 0)
  const avg_wpm =
    recordsWithWpm.length > 0
      ? recordsWithWpm.reduce((sum, r) => sum + r.wpm!, 0) /
        recordsWithWpm.length
      : 0

  return {
    total_sessions,
    total_words_read,
    avg_wpm: Math.round(avg_wpm),
    total_duration_seconds,
  }
}

/**
 * Get recent reading history (last N entries)
 */
export async function getRecentHistory(
  userId: string,
  limit = 10
): Promise<ReadingHistory[]> {
  return getReadingHistory(userId, limit)
}

/**
 * Delete a reading history entry
 */
export async function deleteHistoryEntry(
  userId: string,
  historyId: string
): Promise<void> {
  const { error } = await supabase
    .from("reading_history")
    .delete()
    .eq("id", historyId)
    .eq("user_id", userId)

  if (error) {
    throw new Error(`Failed to delete history entry: ${error.message}`)
  }
}

/**
 * Clear all reading history for a user
 */
export async function clearHistory(userId: string): Promise<void> {
  const { error } = await supabase
    .from("reading_history")
    .delete()
    .eq("user_id", userId)

  if (error) {
    throw new Error(`Failed to clear history: ${error.message}`)
  }
}
