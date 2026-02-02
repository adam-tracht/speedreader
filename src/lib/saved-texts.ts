/**
 * Saved Texts Utilities
 *
 * CRUD operations for saved_texts table
 */

import { supabase, SavedText, SaveTextInput, UpdatePositionInput } from "./supabase"

/**
 * Save a new text to the user's library
 */
export async function saveText(
  userId: string,
  inputData: SaveTextInput
): Promise<SavedText> {
  const { data, error } = await supabase
    .from("saved_texts")
    .insert({
      user_id: userId,
      title: inputData.title,
      content: inputData.content,
      source_url: inputData.source_url || null,
      word_count: inputData.word_count,
      current_position: 0,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Failed to save text: ${error.message}`)
  }

  return data
}

/**
 * Get all saved texts for a user, ordered by creation date (newest first)
 */
export async function getSavedTexts(userId: string): Promise<SavedText[]> {
  const { data, error } = await supabase
    .from("saved_texts")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch saved texts: ${error.message}`)
  }

  return data || []
}

/**
 * Get a single saved text by ID
 */
export async function getSavedTextById(
  userId: string,
  textId: string
): Promise<SavedText | null> {
  const { data, error } = await supabase
    .from("saved_texts")
    .select("*")
    .eq("id", textId)
    .eq("user_id", userId)
    .single()

  if (error) {
    if (error.code === "PGRST116") {
      // Record not found
      return null
    }
    throw new Error(`Failed to fetch saved text: ${error.message}`)
  }

  return data
}

/**
 * Update current reading position of a saved text
 */
export async function updateSavedTextPosition(
  userId: string,
  textId: string,
  position: number
): Promise<void> {
  const { error } = await supabase
    .from("saved_texts")
    .update({ current_position: position })
    .eq("id", textId)
    .eq("user_id", userId)

  if (error) {
    throw new Error(`Failed to update position: ${error.message}`)
  }
}

/**
 * Delete a saved text
 */
export async function deleteSavedText(
  userId: string,
  textId: string
): Promise<void> {
  const { error } = await supabase
    .from("saved_texts")
    .delete()
    .eq("id", textId)
    .eq("user_id", userId)

  if (error) {
    throw new Error(`Failed to delete text: ${error.message}`)
  }
}
