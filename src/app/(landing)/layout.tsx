import type { Metadata } from "next"
import { ErrorBoundary } from "@/components/ErrorBoundary"

export const metadata: Metadata = {
  title: "SpeedReader - Read 3x Faster",
  description: "Speed reading RSVP reader with speed control. Read 3x faster, retain more, be more productive.",
}

// NOTE: Only the root layout (src/app/layout.tsx) should render <html> and <body>
// and import global CSS. This layout is just a wrapper for the landing route group.
export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <ErrorBoundary>{children}</ErrorBoundary>
}
