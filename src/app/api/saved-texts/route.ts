import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getSavedTexts, saveText } from "@/lib/saved-texts"

/**
 * GET /api/saved-texts
 * Get all saved texts for the current user
 */
export async function GET() {
  try {
    const session = await getSession()

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const savedTexts = await getSavedTexts(session.user.id)

    return NextResponse.json({ success: true, data: savedTexts })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch saved texts"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/saved-texts
 * Save a new text
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
    const { title, content, source_url, word_count } = body

    // Validate required fields
    if (!title || typeof title !== "string") {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      )
    }

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      )
    }

    if (!word_count || typeof word_count !== "number" || word_count < 0) {
      return NextResponse.json(
        { success: false, error: "Valid word_count is required" },
        { status: 400 }
      )
    }

    const savedText = await saveText(session.user.id, {
      title,
      content,
      source_url: source_url || null,
      word_count,
    })

    return NextResponse.json({ success: true, data: savedText }, { status: 201 })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to save text"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
