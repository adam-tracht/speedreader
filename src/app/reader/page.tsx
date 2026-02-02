"use client"

import { useSession } from "@/hooks/useSession"
import { useSavedTexts } from "@/hooks/useSavedTexts"
import { useReadingHistory } from "@/hooks/useReadingHistory"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { BookOpen, BookmarkPlus, Zap, Crown, AlertCircle } from "lucide-react"
import { CheckoutButton } from "@/components/stripe/CheckoutButton"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export interface UsageData {
  wordsRead: number
  remaining: number
  tier: "free" | "premium"
  atLimit: boolean
  month: string
}

function UsageStatsCompact({ usage }: { usage: UsageData | null }) {
  if (!usage) return null

  const isPremium = usage.tier === "premium"

  if (isPremium) {
    return (
      <div className="flex items-center space-x-2 text-sm">
        <Crown className="w-4 h-4 mr-1" />
        <span className="text-yellow-400">Premium</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-sm">
      <Zap className="w-4 h-4 mr-1" />
      <span className="text-gray-400">{`${usage.remaining.toLocaleString()} left`}</span>
    </div>
  )
}

function UpgradePrompt({ onDismiss }: { onDismiss?: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-yellow-500/50 rounded-xl p-6 w-full max-w-md mx-4">
        <CheckoutButton
          onCheckoutStart={() => console.log("Checkout started")}
          onCheckoutComplete={onDismiss}
        />
      </div>
    </div>
  )
}

export default function ReaderPage() {
  const { user } = useSession()
  const { saveText } = useSavedTexts()
  const { addEntry } = useReadingHistory()
  const router = useRouter()
  const searchParams = useSearchParams()
  const savedTextId = searchParams.get("id")

  const [text, setText] = useState("")
  const [words, setWords] = useState<string[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [wpm, setWpm] = useState(0)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isSaving, setIsSaving] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [bookmarkTitle, setBookmarkTitle] = useState("")
  const [showBookmarkDialog, setShowBookmarkDialog] = useState(false)
  const [loadingSavedText, setLoadingSavedText] = useState(false)
  const [savedTextPosition, setSavedTextPosition] = useState(0)
  const [usage, setUsage] = useState<UsageData | null>(null)
  const [loadingUsage, setLoadingUsage] = useState(true)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const trackedWordsRef = useRef(0)
  const lastTrackedIndexRef = useRef(0)

  useEffect(() => {
    const storedText = localStorage.getItem("speedreader_text")
    const storedPosition = localStorage.getItem("speedreader_position")
    if (storedText) {
      setText(storedText)
      const wordArray = storedText.split(/\s+/)
      setWords(wordArray.filter(w => w.length > 0))
      if (storedPosition) {
        setCurrentWordIndex(parseInt(storedPosition))
      }
    }
  }, [])

  useEffect(() => {
    if (savedTextId && user) {
      loadSavedText(savedTextId)
    }
  }, [savedTextId, user])

  const fetchUsageStats = async () => {
    try {
      const response = await fetch("/api/usage")
      const result = await response.json()
      if (result.success) {
        setUsage(result.data)
      }
    } catch (err) {
      console.error("Failed to fetch usage:", err)
    } finally {
      setLoadingUsage(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchUsageStats()
    }
  }, [user])

  const trackWords = async (count: number) => {
    if (!user || count <= 0) return
    try {
      await fetch("/api/usage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count })
      })
      await fetchUsageStats()
    } catch (err) {
      console.error("Failed to track usage:", err)
    }
  }

  const loadSavedText = async (id: string) => {
    setLoadingSavedText(true)
    try {
      const response = await fetch(`/api/saved-texts/${id}`)
      const result = await response.json()
      
      if (result.success && result.data) {
        setText(result.data.content)
        const wordArray = result.data.content.split(/\s+/).filter(w => w.length > 0)
        setWords(wordArray)
        setCurrentWordIndex(result.data.current_position || 0)
        setSavedTextPosition(result.data.current_position || 0)
        setIsBookmarked(true)
      }
    } catch (err) {
      console.error("Failed to load saved text:", err)
    } finally {
      setLoadingSavedText(false)
    }
  }

  const wordCountCurrent = words.length

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && startTime) {
        const now = new Date()
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000)
        setElapsedTime(elapsed)
        
        const newWpm = Math.round((currentWordIndex * 60) / Math.floor((now.getTime() - startTime.getTime()) / 1000))
        setWpm(newWpm > 0 ? newWpm : 0)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isPaused, startTime, currentWordIndex])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "ArrowRight") {
      handleNextWord()
    } else if (e.key === "ArrowLeft") {
      handlePreviousWord()
    } else if (e.key === " " || e.key === "Escape") {
      togglePause()
    }
  }

  const handleNextWord = () => {
    if (usage && usage.tier === "free" && usage.remaining <= 0 && trackedWordsRef.current > 0) {
      setShowUpgradePrompt(true)
      return
    }

    if (currentWordIndex < words.length - 1) {
      const newIndex = currentWordIndex + 1
      setCurrentWordIndex(newIndex)
      localStorage.setItem("speedreader_position", String(newIndex))

      const wordsSinceLastTrack = newIndex - lastTrackedIndexRef.current
      if (wordsSinceLastTrack >= 10) {
        trackedWordsRef.current += wordsSinceLastTrack
        lastTrackedIndexRef.current = newIndex
        trackWords(wordsSinceLastTrack)
      }

      if (savedTextId && isBookmarked) {
        updateSavedTextPosition(newIndex)
      }
    }
  }

  const handlePreviousWord = () => {
    if (currentWordIndex > 0) {
      const newIndex = currentWordIndex - 1
      setCurrentWordIndex(newIndex)
      localStorage.setItem("speedreader_position", String(newIndex))
      
      if (savedTextId && isBookmarked) {
        updateSavedTextPosition(newIndex)
      }
    }
  }

  const togglePause = () => {
    setIsPaused(!isPaused)
    if (!isPaused && !startTime) {
      setStartTime(new Date())
    }
  }

  const handleReset = () => {
    setCurrentWordIndex(0)
    setWpm(0)
    setStartTime(null)
    setElapsedTime(0)
    setIsPaused(false)
    localStorage.setItem("speedreader_position", "0")
  }

  const handleSaveBookmark = async () => {
    if (!user || !text.trim()) return
    
    setIsSaving(true)
    try {
      const wordCount = words.length
      await saveText({
        title: bookmarkTitle || `Text ${new Date().toLocaleDateString()}`,
        content: text,
        word_count: wordCount
      })
      setIsBookmarked(true)
      setShowBookmarkDialog(false)
      setBookmarkTitle("")
    } catch (err) {
      console.error("Failed to save text:", err)
      alert("Failed to save text")
    } finally {
      setIsSaving(false)
    }
  }

  const updateSavedTextPosition = async (position: number) => {
    if (!savedTextId || !user) return
    
    try {
      await fetch(`/api/saved-texts/${savedTextId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_position: position })
      })
    } catch (err) {
      console.error("Failed to update position:", err)
    }
  }

  const handleFinish = () => {
    if (!user || !isBookmarked) return
    
    const titlePreview = words.slice(0, Math.min(currentWordIndex, 20)).join(" ")
    addEntry({
      title: savedTextId ? titlePreview : "Untitled",
      words_read: currentWordIndex,
      wpm: wpm > 0 ? wpm : null,
      duration_seconds: elapsedTime > 0 ? elapsedTime : null
    })
    
    alert("Reading session recorded!")
  }

  const handleLogout = () => {
    localStorage.removeItem("speedreader_session")
    router.push("/auth")
  }

  if (loadingSavedText) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
        <p className="ml-4">Loading saved text...</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-5xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => router.push("/")}
                className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
              >
                ← Home
              </button>
              <div className="text-gray-400 hidden sm:block">|</div>
              {isBookmarked && (
                <span className="text-xs sm:text-sm text-green-400 flex items-center">
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Saved Text</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <span className="text-gray-400">{currentWordIndex + 1} / {words.length}</span>
              <span className="text-gray-400 hidden sm:inline">|</span>
              <span className="text-gray-400">{wpm} WPM</span>
              <span className="text-gray-400 hidden sm:inline">|</span>
              <span className="text-gray-400">
                {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
              </span>
              <button
                onClick={togglePause}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-sm min-w-[40px]"
                aria-label={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? "▶" : "⏸"}
              </button>
              {user && !loadingUsage && <UsageStatsCompact usage={usage} />}
            </div>
          </div>

          <div className="text-center mb-8 px-4 sm:px-0">
            <div className="bg-gray-800 border-2 border-gray-700 rounded-2xl px-6 py-8 sm:px-12 sm:py-16">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-wide break-words reader-word"
                aria-live="polite"
                aria-atomic="true"
                role="status"
              >
                {words[currentWordIndex] || "Press Space or ArrowRight to begin"}
              </h1>
            </div>
          </div>

          <div className="mb-8">
            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${((currentWordIndex / Math.max(words.length - 1, 1)) * 100)}%` }}
              />
            </div>
          </div>

          <div className="mb-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Or paste your text here..."
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-4 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-gray-400">
                {words.length} words
              </span>
              <button
                onClick={() => {
                  const newWords = text.split(/\s+/).filter(w => w.trim().length > 0)
                  setWords(newWords)
                  setCurrentWordIndex(0)
                  localStorage.setItem("speedreader_text", text)
                  localStorage.setItem("speedreader_position", "0")
                  setStartTime(null)
                  setElapsedTime(0)
                  setWpm(0)
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Load Text
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:space-x-4 mb-6">
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setShowBookmarkDialog(true)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <BookmarkPlus className="w-5 h-5 mr-2" />
              Save to Library
            </button>
            <button
              onClick={handleFinish}
              disabled={!isBookmarked}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Finish Session
            </button>
          </div>

          <div className="text-center text-gray-500 text-xs sm:text-sm px-4">
            <span className="hidden sm:inline">Space/→ Next word | ← Previous word | P Pause | R Reset | B Save | F Finish</span>
            <span className="sm:hidden">Tap to navigate • P to pause • R to reset</span>
          </div>
        </div>
      </div>

      {showBookmarkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-white mb-4">Save to Library</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm mb-2">Title</label>
                <input
                  type="text"
                  value={bookmarkTitle}
                  onChange={(e) => setBookmarkTitle(e.target.value)}
                  placeholder="Text title..."
                  className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <p className="text-gray-400 text-sm mb-4">
                  This will save the current text to your library. You can continue reading from where you left off later.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowBookmarkDialog(false)
                    setBookmarkTitle("")
                  }}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBookmark}
                  disabled={isSaving || !bookmarkTitle.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUpgradePrompt && (
        <UpgradePrompt onDismiss={() => setShowUpgradePrompt(false)} />
      )}
    </div>
    </ErrorBoundary>
  )
}
