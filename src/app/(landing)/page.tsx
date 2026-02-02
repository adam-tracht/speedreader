"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipForward, SkipBack, Zap, BookOpen, History, TrendingUp, Shield, Clock, CheckCircle, ArrowRight } from "lucide-react"

export default function LandingPage() {
  const [demoPlaying, setDemoPlaying] = useState(false)
  const [demoSpeed, setDemoSpeed] = useState([300])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const demoIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const demoText = "Welcome to SpeedReader! Read 3x faster with RSVP technology. Watch words appear one at a time as your brain focuses completely on each word. No eye movement, no distractions, just pure reading. Start your free trial today!"
  const demoWords = demoText.split(" ")

  useEffect(() => {
    if (demoPlaying) {
      demoIntervalRef.current = setInterval(() => {
        setCurrentWordIndex((prev) => {
          if (prev >= demoWords.length - 1) {
            setDemoPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 60000 / demoSpeed[0])
    } else {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current)
      }
    }
    return () => {
      if (demoIntervalRef.current) {
        clearInterval(demoIntervalRef.current)
      }
    }
  }, [demoPlaying, demoSpeed])

  const handleDemoToggle = () => {
    setDemoPlaying(!demoPlaying)
  }

  const handleSpeedChange = (value: number[]) => {
    setDemoSpeed(value)
  }

  const handleSkipForward = () => {
    setCurrentWordIndex((prev) => Math.min(prev + 5, demoWords.length - 1))
  }

  const handleSkipBack = () => {
    setCurrentWordIndex((prev) => Math.max(prev - 5, 0))
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-red-600/20 text-red-400 rounded-full text-sm font-medium mb-6">
              ⚡ Read 3x Faster
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Read 3x Faster.<br />
            Retain More.<br />
            Be More Productive.
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Stop losing focus. Stop re-reading sentences. RSVP speed reading eliminates eye movement and peripheral distractions so you can fly through content and actually remember what you read.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link href="/auth">
              <Button size="lg" className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white">
                Start Reading Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <button
              onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full sm:w-auto px-8 py-3 border-2 border-red-600 text-red-400 rounded-lg hover:bg-red-600/10 transition-colors font-medium"
            >
              Try Demo
            </button>
          </div>
          <p className="text-gray-500">
            Join thousands reading smarter every day
          </p>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Problem */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-red-400 mb-6">The Problem with Traditional Reading</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-400 text-xs">×</span>
                  </div>
                  <p className="text-gray-300">Your eyes constantly scan left to right across the page, jumping line by line</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-400 text-xs">×</span>
                  </div>
                  <p className="text-gray-300">Peripheral words distract your brain — you notice words above, below, and around your focus point</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-400 text-xs">×</span>
                  </div>
                  <p className="text-gray-300">Your attention splits between the current word and everything else on the page</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-red-400 text-xs">×</span>
                  </div>
                  <p className="text-gray-300"><strong className="text-red-400">Result:</strong> You lose focus, re-read sentences, and read slower than you should</p>
                </div>
              </div>
            </div>

            {/* Solution */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-green-400 mb-6">The RSVP Solution</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-gray-300"><strong className="text-green-400">RSVP</strong> (Rapid Serial Visual Presentation) displays one word at a time in the center of your screen</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-gray-300"><strong className="text-green-400">No eye movement</strong> — your eyes stay fixed in one place</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-gray-300"><strong className="text-green-400">No peripheral distractions</strong> — only the current word is visible</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-600/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-gray-300">Your brain focuses 100% on each word with nothing competing for attention</p>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <Card className="border-red-600/50 bg-gray-800">
              <CardContent className="p-6 text-center">
                <Zap className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Read 3x Faster</h3>
                <p className="text-gray-400">Zero loss of comprehension</p>
              </CardContent>
            </Card>
            <Card className="border-red-600/50 bg-gray-800">
              <CardContent className="p-6 text-center">
                <TrendingUp className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Retain More</h3>
                <p className="text-gray-400">Never distracted while reading</p>
              </CardContent>
            </Card>
            <Card className="border-red-600/50 bg-gray-800">
              <CardContent className="p-6 text-center">
                <Clock className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Save Time</h3>
                <p className="text-gray-400">Finish in 1/3 the time</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Everything You Need</h2>
          <p className="text-xl text-gray-400 text-center mb-12">Powerful features for speed reading success</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-gray-700 bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-red-400" />
                  Speed Reading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">RSVP display with one word at a time for maximum focus</p>
              </CardContent>
            </Card>
            <Card className="border-gray-700 bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-red-400" />
                  Adjustable Speed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">WPM control from 100-600+ to find your optimal pace</p>
              </CardContent>
            </Card>
            <Card className="border-gray-700 bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-red-400" />
                  Saved Library
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Save articles and texts to your personal library</p>
              </CardContent>
            </Card>
            <Card className="border-gray-700 bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <History className="w-6 h-6 text-red-400" />
                  Reading History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Track all your reading sessions with detailed statistics</p>
              </CardContent>
            </Card>
            <Card className="border-gray-700 bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-red-400" />
                  Progress Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Automatically save your reading position — resume anytime</p>
              </CardContent>
            </Card>
            <Card className="border-gray-700 bg-gray-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-red-400" />
                  Usage Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400">Monitor words read, sessions completed, and average WPM</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">See It In Action</h2>
          <p className="text-xl text-gray-400 text-center mb-8">Try RSVP speed reading right now — no signup required</p>

          <Card className="border-red-600/50 bg-gray-900 mb-8">
            <CardContent className="p-8">
              {/* Demo Display */}
              <div className="bg-gray-800 rounded-lg p-12 mb-6 min-h-[200px] flex items-center justify-center">
                <p className="text-5xl md:text-6xl font-bold text-white">
                  {demoWords[currentWordIndex]}
                </p>
              </div>

              {/* Demo Controls */}
              <div className="space-y-6">
                {/* Speed Control */}
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-400 w-16">Speed:</span>
                  <Slider
                    value={demoSpeed}
                    onValueChange={handleSpeedChange}
                    max={600}
                    min={100}
                    step={50}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-20 text-right">{demoSpeed[0]} WPM</span>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleSkipBack}
                    className="border-gray-600 hover:bg-gray-700"
                  >
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleDemoToggle}
                    className="bg-red-600 hover:bg-red-700 text-white px-8"
                  >
                    {demoPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleSkipForward}
                    className="border-gray-600 hover:bg-gray-700"
                  >
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </div>

                {/* Progress */}
                <div className="text-center text-sm text-gray-400">
                  Word {currentWordIndex + 1} of {demoWords.length}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/auth">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                Start Your Own Reading
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-xl text-gray-400 text-center mb-12">Start reading faster in three simple steps</p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">1</div>
              <h3 className="text-xl font-bold mb-2">Paste Text or URL</h3>
              <p className="text-gray-400">Copy any article or paste your own content</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">2</div>
              <h3 className="text-xl font-bold mb-2">Set Your Speed</h3>
              <p className="text-gray-400">Adjust WPM to match your comfort level (start at 300-400)</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto mb-4 text-2xl font-bold">3</div>
              <h3 className="text-xl font-bold mb-2">Hit Play</h3>
              <p className="text-gray-400">Watch words appear one at a time and read faster</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">What Readers Say</h2>
          <p className="text-xl text-gray-400 text-center mb-12">Join thousands of satisfied speed readers</p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-gray-700 bg-gray-900">
              <CardContent className="p-6">
                <p className="text-gray-300 mb-4">"Cut my reading time by 70% for work reports. I can finally keep up with my industry reading."</p>
                <p className="text-sm text-gray-500">— Sarah M., Product Manager</p>
              </CardContent>
            </Card>
            <Card className="border-gray-700 bg-gray-900">
              <CardContent className="p-6">
                <p className="text-gray-300 mb-4">"Finally getting through my book backlog. RSVP makes reading feel effortless."</p>
                <p className="text-sm text-gray-500">— James K., Software Engineer</p>
              </CardContent>
            </Card>
            <Card className="border-gray-700 bg-gray-900">
              <CardContent className="p-6">
                <p className="text-gray-300 mb-4">"Best speed reader I've used — actually retains comprehension. The demo sold me immediately."</p>
                <p className="text-sm text-gray-500">— Emily R., Graduate Student</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-400 text-center mb-12">Start free, upgrade when you need more</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <Card className="border-gray-700 bg-gray-800">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl mb-2">Free</CardTitle>
                <p className="text-4xl font-bold mb-2">$0<span className="text-lg font-normal text-gray-400">/month</span></p>
                <p className="text-gray-400">Perfect for trying out RSVP reading</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300">10,000 words per month</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300">Save texts to your library</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300">Track reading history and stats</p>
                </div>
                <Link href="/auth" className="block mt-6">
                  <Button variant="outline" className="w-full border-gray-600 hover:bg-gray-700">
                    Get Started Free
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="border-red-600/50 bg-gray-800 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl mb-2">Pro</CardTitle>
                <p className="text-4xl font-bold mb-2">$5<span className="text-lg font-normal text-gray-400">/month</span></p>
                <p className="text-gray-400">Unlimited reading for power users</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300"><strong>Unlimited</strong> words — no limits</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300">All features included</p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <p className="text-gray-300">Priority support</p>
                </div>
                <Link href="/auth" className="block mt-6">
                  <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                    Upgrade to Pro
                  </Button>
                </Link>
                <p className="text-xs text-center text-gray-500 mt-2">Cancel anytime • Secure payment via Stripe</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-6 bg-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-400 text-center mb-12">Everything you need to know</p>

          <div className="space-y-6">
            <Card className="border-gray-700 bg-gray-900">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">How does RSVP speed reading actually work?</h3>
                <p className="text-gray-400">RSVP (Rapid Serial Visual Presentation) eliminates eye movement by displaying one word at a time at a fixed point. This prevents the saccadic eye movements that consume time during traditional reading, and removes peripheral distractions that split your attention. Your brain processes single words faster than scanning across lines.</p>
              </CardContent>
            </Card>

            <Card className="border-gray-700 bg-gray-900">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Will this work for me? I've never tried speed reading before.</h3>
                <p className="text-gray-400">Absolutely! RSVP reading is easier to learn than traditional speed reading techniques. Most people adapt within 5-10 minutes of trying the demo. Start at 300 WPM and increase as you get comfortable. The key is removing eye movement — your brain naturally processes words faster than you think.</p>
              </CardContent>
            </Card>

            <Card className="border-gray-700 bg-gray-900">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Can I import articles from websites?</h3>
                <p className="text-gray-400">Yes! Simply paste any article URL and we'll extract the content automatically. You can also paste text directly from any source — PDFs, documents, emails, or anything else you can copy.</p>
              </CardContent>
            </Card>

            <Card className="border-gray-700 bg-gray-900">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Do my saved texts sync across devices?</h3>
                <p className="text-gray-400">Yes, your library, reading history, and progress all sync across all devices you use with SpeedReader. Start reading on your phone, continue on your laptop — everything stays in sync.</p>
              </CardContent>
            </Card>

            <Card className="border-gray-700 bg-gray-900">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">What's included in the free vs paid tier?</h3>
                <p className="text-gray-400">The free tier includes 10,000 words per month, which is enough to try RSVP reading and see if it works for you. The Pro tier ($5/month) removes all word limits and includes priority support. All features are available in both tiers.</p>
              </CardContent>
            </Card>

            <Card className="border-gray-700 bg-gray-900">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Can I cancel anytime?</h3>
                <p className="text-gray-400">Yes, you can cancel your Pro subscription at any time with no questions asked. Your account will revert to the free tier at the end of your billing period. We use Stripe for secure payment processing.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to read 3x faster?</h2>
          <p className="text-xl text-gray-400 mb-8">Join thousands of readers who've already transformed their reading habits.</p>
          <Link href="/auth">
            <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white text-lg px-12 py-6">
              Start Reading Free
              <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
          <p className="mt-4 text-gray-500">
            Still have questions? <button
              onClick={() => document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" })}
              className="text-red-400 hover:underline"
            >
              Check the FAQ
            </button>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-5xl mx-auto text-center text-gray-500">
          <p className="mb-2">© 2025 SpeedReader. Read faster, retain more.</p>
          <p className="text-sm">Built with RSVP technology for smarter reading.</p>
        </div>
      </footer>
    </div>
  )
}
