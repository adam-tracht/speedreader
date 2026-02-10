"use client"

import { useSavedTexts } from "@/hooks/useSavedTexts"
import { useSession } from "@/hooks/useSession"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export default function LibraryPage() {
  const { user } = useSession()
  const { savedTexts, loading, error, deleteText } = useSavedTexts()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this text?")) return
    
    setDeletingId(id)
    await deleteText(id)
    setDeletingId(null)
  }

  const handleContinueReading = (textId: string) => {
    router.push(`/reader?id=${textId}`)
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-8">
          <h1 className="text-2xl font-bold mb-4">Sign in Required</h1>
          <p className="text-muted-foreground">Please sign in to view your saved texts.</p>
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
          <h1 className="text-3xl font-bold text-foreground">My Library</h1>
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
        ) : savedTexts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg mb-4">No saved texts yet</p>
            <Link
              href="/reader"
              className="text-primary hover:opacity-80 transition-colors font-medium"
            >
              Start reading to add texts
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {savedTexts.map((text) => (
              <div
                key={text.id}
                className="bg-card border rounded-lg p-6 hover:border-primary transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-foreground flex-1 pr-4">
                    {text.title}
                  </h3>
                  <button
                    onClick={() => handleDelete(text.id)}
                    disabled={deletingId === text.id}
                    className="text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {deletingId === text.id ? (
                      <span className="animate-spin">⟳</span>
                    ) : (
                      <span>🗑</span>
                    )}
                  </button>
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  {new Date(text.created_at).toLocaleDateString()} • {text.word_count} words
                </div>
                {text.current_position > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-sm text-muted-foreground mb-1">
                      <span>Progress</span>
                      <span>
                        {Math.round((text.current_position / text.word_count) * 100)}% complete
                      </span>
                    </div>
                    <div className="bg-muted rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-primary h-full transition-all duration-300"
                        style={{ width: `${(text.current_position / text.word_count) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                <button
                  onClick={() => handleContinueReading(text.id)}
                  className="w-full bg-primary hover:opacity-90 text-primary-foreground py-3 px-4 rounded-lg transition-colors font-medium"
                >
                  Continue Reading
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </ErrorBoundary>
  )
}
