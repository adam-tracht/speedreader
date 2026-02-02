import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getUsageStats, trackWordsRead } from "@/lib/usage"

/**
 * GET /api/usage
 * Get current usage stats for the authenticated user
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

    const stats = await getUsageStats(session.user.id)

    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch usage stats"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

/**
 * POST /api/usage
 * Track words read (increment usage)
 * Body: { count: number }
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
    const { count } = body as { count: number }

    if (typeof count !== "number" || count < 0) {
      return NextResponse.json(
        { error: "Invalid word count" },
        { status: 400 }
      )
    }

    await trackWordsRead(session.user.id, count)

    // Return updated stats
    const stats = await getUsageStats(session.user.id)

    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to track usage"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
