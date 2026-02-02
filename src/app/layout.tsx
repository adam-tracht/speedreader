import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { getSession } from "@/lib/session"
import Link from "next/link"
import { Book, History, Home, LogOut } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SpeedReader - Read 3x Faster",
  description: "Speed reading RSVP reader with speed control",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
            <div className="max-w-5xl mx-auto flex justify-between items-center">
              <div className="flex items-center space-x-8">
                <Link href={session?.user ? "/reader" : "/"} className="text-2xl font-bold text-white hover:text-red-400 transition-colors">
                  SpeedReader
                </Link>
                {session?.user && (
                  <div className="flex items-center space-x-4">
                    <Link href="/reader" className="flex items-center text-gray-400 hover:text-white transition-colors">
                      <Home className="w-5 h-5 mr-2" />
                      <span>Reader</span>
                    </Link>
                    <Link href="/library" className="flex items-center text-gray-400 hover:text-white transition-colors">
                      <Book className="w-5 h-5 mr-2" />
                      <span>Library</span>
                    </Link>
                    <Link href="/history" className="flex items-center text-gray-400 hover:text-white transition-colors">
                      <History className="w-5 h-5 mr-2" />
                      <span>History</span>
                    </Link>
                  </div>
                )}
              </div>
              {session?.user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-gray-300 text-sm">{session.user.email}</div>
                  <button
                    onClick={() => {
                      localStorage.removeItem("speedreader_session")
                      window.location.href = "/auth"
                    }}
                    className="flex items-center text-gray-400 hover:text-white transition-colors"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/auth"
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Sign In
                </Link>
              )}
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
