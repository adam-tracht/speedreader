import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getSavedTextById, updateSavedTextPosition, deleteSavedText } from "@/lib/saved-texts"

/**
 * GET /api/saved-texts/[id]
 * Get a specific saved text by ID
 */
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const savedText = await getSavedTextById(session.user.id, params.id)
    
    if (!savedText) {
      return NextResponse.json(
        { error: "Text not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: savedText })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch saved text"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/saved-texts/[id]
 * Update a saved text (e.g., reading position)
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { current_position } = body as { current_position?: number }

    if (typeof current_position !== 'number') {
      return NextResponse.json(
        { error: "Valid current_position is required" },
        { status: 400 }
      )
    }

    await updateSavedTextPosition(session.user.id, params.id, current_position)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update saved text"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/saved-texts/[id]
 * Delete a saved text
 */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    await deleteSavedText(session.user.id, params.id)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete saved text"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
