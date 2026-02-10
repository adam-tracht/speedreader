import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { getSession } from "@/lib/session"
import Link from "next/link"
import { Book, History, Home, LogOut } from "lucide-react"
import PWAInstallPrompt from "@/components/PWAInstallPrompt"
import { ErrorBoundary } from "@/components/ErrorBoundary"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SpeedReader - Read 3x Faster with RSVP Speed Reading",
  description: "Stop losing focus. RSVP speed reading eliminates eye movement and peripheral distractions. Read 3x faster, retain more, and finish articles in 1/3 the time. Try free today.",
  keywords: ["speed reading", "RSVP", "read faster", "productivity", "rapid serial visual presentation"],
  authors: [{ name: "SpeedReader" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "SpeedReader",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "SpeedReader - Read 3x Faster",
    description: "Read 3x faster with RSVP speed reading. Eliminate eye movement and peripheral distractions.",
    type: "website",
    url: "https://speedreader.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "SpeedReader - Read 3x Faster",
    description: "Read 3x faster with RSVP speed reading. Try free today.",
  },
  icons: {
    icon: [
      { url: "/icons/icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "/icons/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icons/icon-128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/icons/icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-384x384.png", sizes: "384x384", type: "image/png" },
      { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/icons/icon-152x152.png", sizes: "152x152", type: "image/png" },
    ],
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "SpeedReader",
              "applicationCategory": "ProductivityApplication",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD",
              },
              "description": "RSVP speed reading app that helps you read 3x faster with better comprehension.",
              "featureList": [
                "Speed reading with RSVP",
                "Adjustable WPM control",
                "Progress tracking",
                "Saved library",
                "Reading history",
                "URL import",
                "Usage statistics",
                "Cross-device sync",
              ],
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-card border-b border px-4 py-3 sm:px-6 sm:py-4 sticky top-0 z-50">
            <div className="max-w-5xl mx-auto flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-8 w-full sm:w-auto">
                <Link href={session?.user ? "/reader" : "/"} className="text-2xl font-bold text-foreground hover:text-primary transition-colors">
                  SpeedReader
                </Link>
                {session?.user ? (
                  <div className="flex items-center gap-4 overflow-x-auto sm:overflow-visible whitespace-nowrap w-full sm:w-auto">
                    <Link href="/reader" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                      <Home className="w-5 h-5 sm:mr-2" />
                      <span className="hidden sm:inline">Reader</span>
                    </Link>
                    <Link href="/library" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                      <Book className="w-5 h-5 sm:mr-2" />
                      <span className="hidden sm:inline">Library</span>
                    </Link>
                    <Link href="/history" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
                      <History className="w-5 h-5 sm:mr-2" />
                      <span className="hidden sm:inline">History</span>
                    </Link>
                  </div>
                ) : (
                  <Link
                    href="/"
                    className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Home className="w-5 h-5 sm:mr-2" />
                    <span className="hidden sm:inline">Home</span>
                  </Link>
                )}
              </div>
              {session?.user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-foreground text-sm hidden sm:block">{session.user.email}</div>
                  <button
                    onClick={() => {
                      localStorage.removeItem("speedreader_session")
                      window.location.href = "/auth"
                    }}
                    className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <LogOut className="w-5 h-5 sm:mr-2" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="bg-primary hover:opacity-90 text-primary-foreground px-4 py-2 rounded-lg transition-colors"
                >
                  Start Reading
                </Link>
              )}
            </div>
          </header>
          <main className="flex-1">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
        <PWAInstallPrompt />
      </body>
    </html>
  )
}
