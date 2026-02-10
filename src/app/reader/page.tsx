"use client"

import { useSession } from "@/hooks/useSession"
import { useSavedTexts } from "@/hooks/useSavedTexts"
import { useReadingHistory } from "@/hooks/useReadingHistory"
import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { BookOpen, BookmarkPlus, Zap, Crown, AlertCircle, Link2, Loader2 } from "lucide-react"
import { CheckoutButton } from "@/components/stripe/CheckoutButton"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Slider } from "@/components/ui/slider"

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
      <div className="bg-card border border-yellow-500/50 rounded-xl p-6 w-full max-w-md mx-4">
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
  const [targetWpm, setTargetWpm] = useState([300])
  const [isPlaying, setIsPlaying] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
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
  const [urlInput, setUrlInput] = useState("")
  const [loadingUrl, setLoadingUrl] = useState(false)
  const [urlError, setUrlError] = useState("")
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
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

  // RSVP speed reading effect
  useEffect(() => {
    if (isPlaying && currentWordIndex < words.length - 1) {
      intervalRef.current = setInterval(() => {
        setCurrentWordIndex((prev) => {
          const newIndex = prev + 1

          // Track words for usage stats
          const wordsSinceLastTrack = newIndex - lastTrackedIndexRef.current
          if (wordsSinceLastTrack >= 10) {
            trackedWordsRef.current += wordsSinceLastTrack
            lastTrackedIndexRef.current = newIndex
            trackWords(wordsSinceLastTrack)
          }

          // Update saved text position
          if (savedTextId && isBookmarked) {
            updateSavedTextPosition(newIndex)
          }

          localStorage.setItem("speedreader_position", String(newIndex))

          if (newIndex >= words.length - 1) {
            setIsPlaying(false)
            return newIndex
          }

          return newIndex
        })
      }, 60000 / targetWpm[0])
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, targetWpm, currentWordIndex, words.length, savedTextId, isBookmarked])

  // Track elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && startTime) {
        const now = new Date()
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000)
        setElapsedTime(elapsed)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isPlaying, startTime])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "ArrowRight") {
      e.preventDefault()
      handleNextWord()
    } else if (e.key === "ArrowLeft") {
      handlePreviousWord()
    } else if (e.key === "p" || e.key === "P" || e.key === "Escape") {
      togglePlayPause()
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

  const togglePlayPause = () => {
    if (words.length === 0) return

    setIsPlaying(!isPlaying)
    if (!isPlaying && !startTime) {
      setStartTime(new Date())
    }
  }

  const handleReset = () => {
    setCurrentWordIndex(0)
    setStartTime(null)
    setElapsedTime(0)
    setIsPlaying(false)
    localStorage.setItem("speedreader_position", "0")
    trackedWordsRef.current = 0
    lastTrackedIndexRef.current = 0
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

  const handleExtractFromUrl = async () => {
    if (!urlInput.trim()) {
      setUrlError("Please enter a URL")
      return
    }

    setLoadingUrl(true)
    setUrlError("")

    try {
      const response = await fetch("/api/extract-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() })
      })

      const result = await response.json()

      if (result.success && result.content) {
        setText(result.content)
        const wordArray = result.content.split(/\s+/).filter(w => w.trim().length > 0)
        setWords(wordArray)
        setCurrentWordIndex(0)
        localStorage.setItem("speedreader_text", result.content)
        localStorage.setItem("speedreader_position", "0")
        setUrlInput("")
        setIsPlaying(false)
        setStartTime(null)
        setElapsedTime(0)
      } else {
        setUrlError(result.error || "Failed to extract article content")
      }
    } catch (err) {
      console.error("Failed to extract article:", err)
      setUrlError("Failed to extract article. Please try again.")
    } finally {
      setLoadingUrl(false)
    }
  }

  const handleFinish = () => {
    if (!user || !isBookmarked) return

    const titlePreview = words.slice(0, Math.min(currentWordIndex, 20)).join(" ")
    // Calculate actual WPM: (words read / elapsed minutes)
    const actualWpm = elapsedTime > 0 ? Math.round((currentWordIndex * 60) / elapsedTime) : null

    addEntry({
      title: savedTextId ? titlePreview : "Untitled",
      words_read: currentWordIndex,
      wpm: actualWpm,
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
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary"></div>
        <p className="ml-4">Loading saved text...</p>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground flex flex-col" onKeyDown={handleKeyDown} tabIndex={0}>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-5xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-3 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => router.push("/")}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm sm:text-base"
              >
                ← Home
              </button>
              <div className="text-muted-foreground hidden sm:block">|</div>
              {isBookmarked && (
                <span className="text-xs sm:text-sm text-green-400 flex items-center">
                  <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                  <span className="hidden sm:inline">Saved Text</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
              <span className="text-muted-foreground">{currentWordIndex + 1} / {words.length}</span>
              <span className="text-muted-foreground hidden sm:inline">|</span>
              <span className="text-foreground font-semibold">{targetWpm[0]} WPM</span>
              <span className="text-muted-foreground hidden sm:inline">|</span>
              <span className="text-muted-foreground">
                {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')}
              </span>
              <button
                onClick={togglePlayPause}
                className="px-3 py-1.5 sm:px-4 sm:py-2 bg-card hover:bg-muted rounded-lg transition-colors text-sm min-w-[40px]"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              {user && !loadingUsage && <UsageStatsCompact usage={usage} />}
            </div>
          </div>

          <div className="text-center mb-8 px-4 sm:px-0">
            <div className="bg-card border-2 border rounded-2xl px-6 py-8 sm:px-12 sm:py-16">
              <h1
                className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-wide break-words reader-word"
                aria-live="polite"
                aria-atomic="true"
                role="status"
              >
                {words[currentWordIndex] || "Press Space or ArrowRight to begin"}
              </h1>
            </div>
          </div>

          <div className="mb-8">
            <div className="h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentWordIndex / Math.max(words.length - 1, 1)) * 100)}%` }}
              />
            </div>
          </div>

          {/* WPM Slider Control */}
          <div className="mb-6 px-4 sm:px-0">
            <div className="bg-card border rounded-lg p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Reading Speed
                </label>
                <span className="text-2xl font-bold text-primary">{targetWpm[0]} WPM</span>
              </div>
              <Slider
                value={targetWpm}
                onValueChange={setTargetWpm}
                min={100}
                max={600}
                step={50}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>100 WPM</span>
                <span>350 WPM</span>
                <span>600 WPM</span>
              </div>
            </div>
          </div>

          {/* URL Input Section */}
          <div className="mb-6 px-4 sm:px-0">
            <div className="bg-card border rounded-lg p-4 sm:p-6">
              <label className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Link2 className="w-4 h-4 text-primary" />
                Import from URL
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value)
                    setUrlError("")
                  }}
                  placeholder="Paste article URL here..."
                  className="flex-1 bg-muted border text-foreground rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  disabled={loadingUrl}
                />
                <button
                  onClick={handleExtractFromUrl}
                  disabled={loadingUrl || !urlInput.trim()}
                  className="px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                  {loadingUrl ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Extracting...
                    </>
                  ) : (
                    <>
                      <Link2 className="w-4 h-4" />
                      Extract Article
                    </>
                  )}
                </button>
              </div>
              {urlError && (
                <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {urlError}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Paste any article URL and we&apos;ll extract the content automatically
              </p>
            </div>
          </div>

          <div className="mb-6">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Or paste your text here..."
              className="w-full bg-card border text-foreground rounded-lg p-4 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
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
                  setIsPlaying(false)
                  trackedWordsRef.current = 0
                  lastTrackedIndexRef.current = 0
                }}
                className="px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors"
              >
                Load Text
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:space-x-4 mb-6">
            <button
              onClick={togglePlayPause}
              disabled={words.length === 0}
              className="px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? "⏸ Pause" : "▶ Play"}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-card hover:bg-muted text-foreground rounded-lg transition-colors"
            >
              Reset
            </button>
            <button
              onClick={() => setShowBookmarkDialog(true)}
              className="px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors flex items-center justify-center"
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

          <div className="text-center text-muted-foreground text-xs sm:text-sm px-4">
            <span className="hidden sm:inline">Space/→ Next word | ← Previous word | P Play/Pause | R Reset | B Save | F Finish</span>
            <span className="sm:hidden">Tap to navigate • P to play/pause • R to reset</span>
          </div>
        </div>
      </div>

      {showBookmarkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-card border rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-foreground mb-4">Save to Library</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-foreground text-sm mb-2">Title</label>
                <input
                  type="text"
                  value={bookmarkTitle}
                  onChange={(e) => setBookmarkTitle(e.target.value)}
                  placeholder="Text title..."
                  className="w-full bg-muted border text-foreground rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <p className="text-muted-foreground text-sm mb-4">
                  This will save the current text to your library. You can continue reading from where you left off later.
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowBookmarkDialog(false)
                    setBookmarkTitle("")
                  }}
                  className="px-4 py-2 bg-card hover:bg-muted text-foreground rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBookmark}
                  disabled={isSaving || !bookmarkTitle.trim()}
                  className="px-4 py-2 bg-primary hover:opacity-90 text-primary-foreground rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
