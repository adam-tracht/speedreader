"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, SkipForward, SkipBack, BookOpen, Zap, TrendingUp, Shield, Cloud, BarChart, Link2, Save, Clock, Check, ArrowRight, ChevronDown, ChevronUp, Star, History } from "lucide-react"

const sampleText = "Welcome to SpeedReader! This is a demo of how RSVP (Rapid Serial Visual Presentation) works. Instead of your eyes scanning left to right across a page, words appear one at a time in the center of your screen. This eliminates eye movement and peripheral distractions, allowing your brain to focus entirely on each word. Most readers can double or triple their reading speed with this method while maintaining or even improving comprehension. Try adjusting the speed slider to find your comfortable pace. You can pause anytime or skip forward and backward. This technique has been used by speed readers for decades and is now accessible through modern technology."

export default function LandingPage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState([300])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const words = sampleText.split(" ")

  useEffect(() => {
    if (isPlaying && currentWordIndex < words.length) {
      intervalRef.current = setInterval(() => {
        setCurrentWordIndex((prev) => {
          if (prev >= words.length - 1) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 60000 / speed[0])
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isPlaying, speed, currentWordIndex, words.length])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying && currentWordIndex >= words.length - 1) {
      setCurrentWordIndex(0)
    }
  }

  const skipForward = () => {
    setCurrentWordIndex((prev) => Math.min(prev + 10, words.length - 1))
  }

  const skipBack = () => {
    setCurrentWordIndex((prev) => Math.max(prev - 10, 0))
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="pt-16 pb-12 sm:pt-20 sm:pb-16 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Read 3x Faster. Retain More. Be More Productive.
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto px-2">
            Stop losing focus. Stop re-reading sentences. RSVP speed reading eliminates eye movement and peripheral distractions so you can fly through content and actually remember what you read.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button size="lg" className="text-lg px-8" onClick={() => window.location.href = "/auth"}>
              Start Reading Free
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" onClick={() => scrollToSection("demo")}>
              Try Demo
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Join thousands reading smarter every day
          </p>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 px-6 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why SpeedReader?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Zap className="w-6 h-6" />
                  The Problem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your eyes constantly scan left to right, jumping line by line. Peripheral words distract your brain. Your attention splits between the current word and everything else on the page. Result: You lose focus, re-read sentences, and read slower than you should.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <TrendingUp className="w-6 h-6" />
                  The Solution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  RSVP (Rapid Serial Visual Presentation) displays one word at a time in the center of your screen. <strong>No eye movement</strong> — your eyes stay fixed. <strong>No peripheral distractions</strong> — only the current word is visible. Your brain focuses 100% on each word.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-primary flex items-center gap-2">
                  <Star className="w-6 h-6" />
                  The Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground space-y-2">
                  <li>✓ Read 3x faster with zero loss of comprehension</li>
                  <li>✓ Retain more — never distracted</li>
                  <li>✓ Finish articles in 1/3 the time</li>
                  <li>✓ Reduce eye strain and fatigue</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Powerful Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Zap, title: "Speed Reading", desc: "RSVP display with one word at a time" },
              { icon: Clock, title: "Adjustable Speed", desc: "WPM control from 100-600+ words per minute" },
              { icon: Save, title: "Progress Tracking", desc: "Automatically save your reading position" },
              { icon: BookOpen, title: "Saved Library", desc: "Save articles and texts to your personal library" },
              { icon: History, title: "Reading History", desc: "Track all your reading sessions with detailed statistics" },
              { icon: Link2, title: "URL Import", desc: "Paste any article URL — we'll extract the content" },
              { icon: BarChart, title: "Usage Stats", desc: "Monitor words read, sessions, and average WPM" },
              { icon: Cloud, title: "Cross-Device Sync", desc: "Your library and history sync across all devices" },
              { icon: Shield, title: "Free Tier", desc: "10,000 words/month at no cost" },
              { icon: TrendingUp, title: "Unlimited Upgrade", desc: "$5/month for unlimited reading" },
            ].map((feature, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-16 px-6 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">See It In Action</h2>
          <p className="text-center text-muted-foreground mb-12">Try the RSVP method yourself — no signup required</p>
          
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8">
              <div className="min-h-32 flex items-center justify-center mb-8">
                <p className="reader-word text-center">{words[currentWordIndex] || ""}</p>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">
                    Speed: {speed[0]} WPM
                  </label>
                  <Slider
                    value={speed}
                    onValueChange={(v) => setSpeed(v)}
                    min={100}
                    max={600}
                    step={50}
                    className="w-full"
                  />
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button variant="outline" size="sm" className="h-10 w-10 p-0" onClick={skipBack}>
                    <SkipBack className="w-5 h-5" />
                  </Button>
                  <Button size="lg" onClick={togglePlay} className="min-w-32">
                    {isPlaying ? <><Pause className="w-5 h-5 mr-2" /> Pause</> : <><Play className="w-5 h-5 mr-2" /> Play</>}
                  </Button>
                  <Button variant="outline" size="sm" className="h-10 w-10 p-0" onClick={skipForward}>
                    <SkipForward className="w-5 h-5" />
                  </Button>
                </div>
                
                <div className="text-center text-sm text-muted-foreground">
                  {currentWordIndex + 1} / {words.length} words
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center mt-8">
            <Button size="lg" onClick={() => window.location.href = "/auth"}>
              Start Your Own Reading <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Paste Text or URL", desc: "Copy any article or paste your own content" },
              { step: "2", title: "Set Your Speed", desc: "Adjust WPM to match your comfort level" },
              { step: "3", title: "Hit Play", desc: "Watch words appear one at a time" },
              { step: "4", title: "Read Faster", desc: "Finish articles in 1/3 the time" },
            ].map((item) => (
              <Card key={item.step}>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                    {item.step}
                  </div>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-6 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What Readers Say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Cut my reading time by 70% for work reports. This is a game-changer.", author: "Product Manager" },
              { quote: "Finally getting through my book backlog. I'm reading 3 books a month now!", author: "Avid Reader" },
              { quote: "Best speed reader I've used — actually retains comprehension.", author: "Student" },
            ].map((testimonial, idx) => (
              <Card key={idx}>
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-lg mb-4 italic">"{testimonial.quote}"</p>
                  <p className="text-sm text-muted-foreground">— {testimonial.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <FAQSection
            title="General"
            questions={[
              {
                q: "How does RSVP speed reading actually work?",
                a: "RSVP (Rapid Serial Visual Presentation) displays words one at a time in a fixed position. This eliminates the eye movement required for normal reading (saccades) and removes peripheral distractions. Your brain processes words more efficiently when focused on a single word, allowing you to read significantly faster while maintaining comprehension."
              },
              {
                q: "Will this work for me? I've never tried speed reading before.",
                a: "Yes! RSVP reading is beginner-friendly. Most people start at 200-300 WPM and quickly progress to 400-500 WPM within a few sessions. The technique doesn't require special skills — just practice finding your optimal speed."
              },
              {
                q: "How long does it take to get used to RSVP reading?",
                a: "Most readers feel comfortable within 10-15 minutes of practice. Start with a slower speed (200-250 WPM) and gradually increase as you get more comfortable. After a few sessions, it becomes second nature."
              },
            ]}
          />
          
          <FAQSection
            title="Features"
            questions={[
              {
                q: "Can I import articles from websites?",
                a: "Absolutely! Just paste any article URL and we'll extract the content automatically. The extracted text is then ready for speed reading."
              },
              {
                q: "Do my saved texts sync across devices?",
                a: "Yes, your library, reading history, and progress all sync across all your devices. Start reading on your phone, continue on your desktop."
              },
              {
                q: "What's included in the free vs paid tier?",
                a: "The free tier includes 10,000 words per month, library access, and reading history. The Pro tier ($5/month) removes the word limit entirely for unlimited reading."
              },
            ]}
          />
          
          <FAQSection
            title="Technical"
            questions={[
              {
                q: "Does it work offline?",
                a: "Currently, SpeedReader requires an internet connection to sync your library and reading history. We're working on offline support for a future update."
              },
              {
                q: "What happens to my data?",
                a: "Your data is securely stored using Supabase. We use industry-standard encryption and never share your reading data with third parties. You can delete your account and data at any time."
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes! You can cancel your subscription at any time. Your access continues until the end of your current billing period. Manage your subscription from the settings page."
              },
            ]}
          />
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-6 bg-card/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Simple Pricing</h2>
          <p className="text-center text-muted-foreground mb-12">Cancel anytime. Secure payment via Stripe.</p>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Tier */}
            <Card className="relative">
              <CardHeader>
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {[
                    "10,000 words/month",
                    "Save texts to library",
                    "Track reading history",
                    "Usage statistics",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" variant="outline" onClick={() => window.location.href = "/auth"}>
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Pro Tier */}
            <Card className="relative border-primary">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
              <CardHeader>
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">$5</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {[
                    "Unlimited words",
                    "All free features included",
                    "Priority support",
                    "Early access to new features",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full" onClick={() => window.location.href = "/auth"}>
                  Start Pro Trial
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to read 3x faster?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of readers who've already transformed their reading habits.
          </p>
          <Button size="lg" className="text-lg px-8" onClick={() => window.location.href = "/auth"}>
            Start Reading Free
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            <a href="#faq" className="hover:text-primary underline">Still have questions? Check the FAQ</a>
          </p>
        </div>
      </section>
    </div>
  )
}

function FAQSection({ title, questions }: { title: string; questions: { q: string; a: string }[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="mb-12">
      <h3 className="text-2xl font-bold mb-6 text-primary">{title}</h3>
      <div className="space-y-4">
        {questions.map((item, idx) => (
          <Card key={idx}>
            <CardContent className="p-0">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-card/50 transition-colors"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-medium">{item.q}</span>
                {openIndex === idx ? <ChevronUp className="w-5 h-5 text-primary" /> : <ChevronDown className="w-5 h-5 text-primary" />}
              </button>
              {openIndex === idx && (
                <div className="px-4 pb-4">
                  <p className="text-muted-foreground">{item.a}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
