import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getReadingHistory, addHistoryEntry, getUserStats } from "@/lib/reading-history"

/**
 * GET /api/reading-history
 * Get reading history for current user
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const history = await getReadingHistory(session.user.id, 100)
    
    return NextResponse.json({ success: true, data: history })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch reading history"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/reading-history
 * Add a reading history entry
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { saved_text_id, title, words_read, wpm, duration_seconds } = body as {
      saved_text_id?: string | null
      title: string
      words_read: number
      wpm?: number | null
      duration_seconds?: number | null
    }

    // Validate required fields
    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      )
    }

    if (!words_read || typeof words_read !== 'number') {
      return NextResponse.json(
        { error: "Valid words_read is required" },
        { status: 400 }
      )
    }

    await addHistoryEntry(session.user.id, {
      saved_text_id: saved_text_id || null,
      title,
      words_read,
      wpm: wpm || null,
      duration_seconds: duration_seconds || null
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to add history entry"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
