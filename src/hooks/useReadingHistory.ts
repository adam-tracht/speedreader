"use client"

import { useEffect, useState } from "react"
import { useSession } from "@/hooks/useSession"

interface ReadingHistoryEntry {
  id: string
  user_id: string
  saved_text_id: string | null
  title: string
  words_read: number
  wpm: number | null
  duration_seconds: number | null
  created_at: string
}

interface ReadingStats {
  total_sessions: number
  total_words_read: number
  avg_wpm: number
  total_duration_seconds: number
}

interface UseReadingHistoryReturn {
  history: ReadingHistoryEntry[]
  stats: ReadingStats | null
  loading: boolean
  error: string | null
  addEntry: (data: {
    saved_text_id?: string | null
    title: string
    words_read: number
    wpm?: number | null
    duration_seconds?: number | null
  }) => Promise<void>
  refresh: () => Promise<void>
}

export function useReadingHistory(): UseReadingHistoryReturn {
  const { user } = useSession()
  const [history, setHistory] = useState<ReadingHistoryEntry[]>([])
  const [stats, setStats] = useState<ReadingStats | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHistory = async () => {
    if (!user?.id) return
    
    setLoading(true)
    setError(null)
    
    try {
      const historyResponse = await fetch("/api/reading-history")
      const historyResult = await historyResponse.json()
      
      if (historyResult.success && historyResult.data) {
        setHistory(historyResult.data)
      }
      
      const statsResponse = await fetch("/api/reading-history/stats")
      const statsResult = await statsResponse.json()
      
      if (statsResult.success && statsResult.data) {
        setStats(statsResult.data)
      }
      
      if (!historyResult.success) {
        setError(historyResult.error || "Failed to fetch reading history")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  const addEntry: UseReadingHistoryReturn["addEntry"] = async (data) => {
    if (!user?.id) return
    
    setError(null)
    
    try {
      const response = await fetch("/api/reading-history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      
      if (result.success) {
        await fetchHistory()
      } else {
        setError(result.error || "Failed to add history entry")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [user?.id])

  return {
    history,
    stats,
    loading,
    error,
    addEntry,
    refresh: fetchHistory
  }
}
