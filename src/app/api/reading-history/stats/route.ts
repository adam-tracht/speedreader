import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { getUserStats } from "@/lib/reading-history"

/**
 * GET /api/reading-history/stats
 * Get aggregated reading statistics for current user
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

    const stats = await getUserStats(session.user.id)
    
    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch user stats"
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
