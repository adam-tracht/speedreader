import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "../globals.css"
import { ErrorBoundary } from "@/components/ErrorBoundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SpeedReader - Read 3x Faster",
  description: "Speed reading RSVP reader with speed control. Read 3x faster, retain more, be more productive.",
}

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
