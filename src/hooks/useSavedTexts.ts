"use client"

import { useEffect, useState } from "react"
import { useSession } from "@/hooks/useSession"

interface SavedText {
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

interface UseSavedTextsReturn {
  savedTexts: SavedText[]
  loading: boolean
  error: string | null
  saveText: (data: {
    title: string
    content: string
    source_url?: string | null
    word_count: number
  }) => Promise<void>
  deleteText: (id: string) => Promise<void>
  updatePosition: (id: string, position: number) => Promise<void>
  refresh: () => Promise<void>
}

export function useSavedTexts(): UseSavedTextsReturn {
  const { user } = useSession()
  const [savedTexts, setSavedTexts] = useState<SavedText[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSavedTexts = async () => {
    if (!user?.id) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch("/api/saved-texts")
      const result = await response.json()
      
      if (result.success && result.data) {
        setSavedTexts(result.data)
      } else {
        setError(result.error || "Failed to fetch saved texts")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const saveText: UseSavedTextsReturn["saveText"] = async (data) => {
    if (!user?.id) return
    
    setError(null)
    
    try {
      const response = await fetch("/api/saved-texts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      
      if (result.success && result.data) {
        setSavedTexts(prev => [result.data, ...prev])
      } else {
        setError(result.error || "Failed to save text")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const deleteText: UseSavedTextsReturn["deleteText"] = async (id) => {
    if (!user?.id) return
    
    setError(null)
    
    try {
      const response = await fetch(`/api/saved-texts/${id}`, {
        method: "DELETE"
      })
      const result = await response.json()
      
      if (result.success) {
        setSavedTexts((prev) => prev.filter((t) => t.id !== id))
      } else {
        setError(result.error || "Failed to delete text")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  const updatePosition: UseSavedTextsReturn["updatePosition"] = async (id, position) => {
    if (!user?.id) return
    
    setError(null)
    
    try {
      const response = await fetch(`/api/saved-texts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_position: position })
      })
      const result = await response.json()
      
      if (result.success) {
        setSavedTexts((prev) => 
          prev.map((t) => t.id === id ? { ...t, current_position: position } : t)
        )
      } else {
        setError(result.error || "Failed to update position")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  useEffect(() => {
    fetchSavedTexts()
  }, [user?.id])

  return {
    savedTexts,
    loading,
    error,
    saveText,
    deleteText,
    updatePosition,
    refresh: fetchSavedTexts
  }
}
