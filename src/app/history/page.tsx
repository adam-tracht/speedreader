"use client"

import { useReadingHistory } from "@/hooks/useReadingHistory"
import { useSession } from "@/hooks/useSession"
import Link from "next/link"
import { ErrorBoundary } from "@/components/ErrorBoundary"

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

export default function HistoryPage() {
  const { user } = useSession()
  const { history, stats, loading, error } = useReadingHistory()

  const formatTime = (seconds: number | null) => {
    if (!seconds) return "--"
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) return `${hours}h ${mins}m`
    if (mins > 0) return `${mins}m ${secs}s`
    return `${secs}s`
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "Unknown date"

    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) {
      return "Invalid date"
    }

    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <h1 className="text-2xl font-bold mb-4">Sign in Required</h1>
          <p className="text-muted-foreground">Please sign in to view your reading history.</p>
          <Link
            href="/auth"
            className="bg-primary hover:opacity-90 text-primary-foreground px-6 py-2 rounded-lg transition-colors"
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Reading History</h1>
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Home
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-700 text-red-100 p-4 rounded-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {stats && (
              <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card border rounded-lg p-4 md:p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stats.total_sessions}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-2">Sessions</div>
                </div>
                <div className="bg-card border rounded-lg p-4 md:p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-green-400">{stats.total_words_read}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-2">Words Read</div>
                </div>
                <div className="bg-card border rounded-lg p-4 md:p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-purple-400">{stats.avg_wpm}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-2">Avg WPM</div>
                </div>
                <div className="bg-card border rounded-lg p-4 md:p-6 text-center">
                  <div className="text-2xl md:text-3xl font-bold text-orange-400">{formatTime(stats.total_duration_seconds)}</div>
                  <div className="text-xs md:text-sm text-muted-foreground mt-2">Time Spent</div>
                </div>
              </div>
            )}

            {history.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">No reading history yet</p>
                <Link
                  href="/reader"
                  className="text-primary hover:opacity-80 transition-colors font-medium"
                >
                  Start reading to build your history
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((entry, index) => (
                  <div
                    key={entry.id}
                    className="bg-card border rounded-lg p-4 hover:border-primary transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                      <h3 className="text-lg sm:text-xl font-bold text-foreground">
                        {index + 1}. {entry.title}
                      </h3>
                      <span className="text-sm text-muted-foreground">{formatDate(entry.created_at)}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground text-xs sm:text-sm">Words</div>
                        <div className="text-foreground font-medium">{entry.words_read}</div>
                      </div>
                      {entry.wpm && (
                        <div>
                          <div className="text-muted-foreground text-xs sm:text-sm">WPM</div>
                          <div className="text-foreground font-medium">{entry.wpm}</div>
                        </div>
                      )}
                      <div>
                        <div className="text-muted-foreground text-xs sm:text-sm">Time</div>
                        <div className="text-foreground font-medium">{formatTime(entry.duration_seconds)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
    </ErrorBoundary>
  )
}
