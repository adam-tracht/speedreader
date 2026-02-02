# SpeedReader Roadmap

> "Read 3x Faster. Retain More. Be More Productive."

## Current Status: Phase 3 (Library & Persistence) - ✅ COMPLETE

---

## Phase 1: Core RSVP Reader ✅ COMPLETE

### Core Functionality
- [x] RSVP reader: displays one word at a time in center of screen
- [x] Configurable WPM speed slider (range 100-600, default 350)
- [x] Play/pause controls
- [x] Transport controls (restart, back 10 words, forward 10 words)
- [x] Progress bar showing reading position
- [x] Word count display

### Text Input ✅ COMPLETE
- [x] Paste text directly (textarea)
- [x] Load sample text button for demo
- [x] Input URL → scrape article content (use @extractus/article-extractor)

### Design
- [x] Minimal dark theme (near-black background)
- [x] White text for words
- [x] Red accent color for buttons/highlights
- [x] Reader center stage
- [x] Dark mode only

### Technical
- [x] Next.js 14 (App Router)
- [x] TypeScript throughout
- [x] Tailwind CSS
- [ ] shadcn/ui components (currently using custom CSS)
- [ ] Responsive design (mobile-first) - needs testing/refinement

---

## Phase 2: Authentication & User Accounts ✅ COMPLETE

### User Accounts
- [x] NextAuth.js setup
- [x] Google OAuth provider
- [x] GitHub OAuth provider
- [x] User session management
- [x] Sign-in page UI
- [x] User menu with sign-out
- [x] Middleware for protected routes
- [x] Session hooks and utilities

### Database
- [x] Supabase integration (client and types)
- [x] Users table schema
- [x] Environment variables configuration
- [x] Supabase project setup

### Auth Components
- [x] AuthProvider (SessionProvider wrapper)
- [x] SignInButton (Google/GitHub sign-in buttons)
- [x] UserMenu (dropdown with sign-out)
- [x] AuthButton (simple sign-out button)
- [x] Sign-in page (/signin)
- [x] Middleware (route protection)
- [x] Session utilities (getSession, getCurrentUser, requireAuth)

### Documentation
- [x] Phase 2 Setup Guide (PHASE2_SETUP.md)
- [x] Environment variables template (.env.example)

---

## Phase 3: Library & Persistence ✅ COMPLETE

### Save Texts
- [x] Save texts/articles to user library
- [x] Saved texts table in Supabase
- [x] Library UI (list saved texts)
- [x] Resume reading from last position
- [x] Delete saved texts

### History
- [x] Reading history tracking
- [x] View history of what you've read
- [x] Sync across devices
- [x] Reading statistics (WPM, sessions, words read)

### Technical Implementation
- [x] Database migration (001_initial_schema.sql)
- [x] TypeScript types (supabase.ts)
- [x] Saved texts utilities (saved-texts.ts)
- [x] Reading history utilities (reading-history.ts)
- [x] API routes for saved texts
- [x] API routes for reading history and stats
- [x] React hooks (useSavedTexts, useReadingHistory, useSession)
- [x] Library page (/library)
- [x] History page (/history)
- [x] Reader page updated with save/load functionality
- [x] Layout updated with navigation

---

## Phase 4: Usage Tracking & Paywall ✅ COMPLETE

### Word Tracking
- [x] Track words read per user
- [x] Usage stats table in Supabase
- [x] Display usage stats in UI
- [x] Remaining words counter

### Paywall Tiers
- [x] Free tier: 10,000 words/month
- [x] Paid tier: $5/month unlimited
- [x] Paywall enforcement logic
- [x] Upgrade prompts when limit reached

---

## Phase 5: URL Scraping ✅ COMPLETE

- [x] Install @extractus/article-extractor
- [x] URL input field UI
- [x] Article extraction logic
- [x] Error handling for invalid URLs
- [x] Loading states during extraction

---

## Phase 6: Stripe Integration ✅ COMPLETE

- [x] Stripe account setup (environment variables)
- [x] Stripe Checkout integration (checkout session creation)
- [x] Subscription management (customer portal)
- [x] Webhook handlers (subscription events: created/updated/deleted, payment failed)
- [x] Customer portal for billing management
- [x] Environment variables for Stripe keys
- [x] Settings page with subscription management
- [x] CheckoutButton component
- [x] User tier tracking in database
- [x] Upgrade prompt in reader when limit reached
- [x] Stripe utilities (client, webhook verification, checkout/portal functions)

---

## Phase 7: PWA Features ⏸️ NOT STARTED

- [ ] manifest.json configuration
- [ ] Service worker for offline support
- [ ] App icons (various sizes)
- [ ] Install prompt UI
- [ ] Offline reading capability

---

## Phase 8: Landing Page & Marketing ⏸️ NOT STARTED

### Landing Page
- [x] Hero section: "Read 3x Faster. Retain More. Be More Productive."
- [x] Value proposition section
- [ ] Embedded demo or preview
- [x] FAQ section
- [ ] Pricing section

### CTA
- [ ] "Start Speed Reading" button
- [ ] Triggers auth/signup flow

---

## Phase 9: Deployment & Polish ⏸️ NOT STARTED

### Deployment
- [ ] Vercel project setup
- [ ] Environment variables configuration
- [ ] Production database setup
- [ ] Domain configuration

### Documentation
- [ ] README with setup instructions
- [ ] Environment variables template (.env.example)
- [ ] Deployment guide

### Polish
- [ ] Performance optimization
- [ ] Error boundaries
- [ ] Loading states throughout
- [ ] Mobile responsiveness audit
- [ ] Accessibility audit

---

## Tech Stack

| Layer | Technology | Status |
|-------|------------|--------|
| Framework | Next.js 14 (App Router) | ✅ |
| Language | TypeScript | ✅ |
| Styling | Tailwind CSS | ✅ |
| Components | shadcn/ui | ❌ |
| Auth | NextAuth.js | ✅ |
| Database | Supabase (fully configured) | ✅ |
| Payments | Stripe | ❌ |
| Scraping | @extractus/article-extractor | ✅ |
| Deployment | Vercel | ❌ |

---

## Priority Order

1. ✅ Core RSVP reader with paste text
2. ✅ Basic auth + user accounts
3. ✅ Save texts to library + history tracking
4. 🔲 Word tracking + paywall UI
5. ✅ URL scraping
6. ⏸️ Stripe integration
7. ⏸️ PWA features
8. ⏸️ Landing page

---

## Design Principles

- **Buttery smooth** reading experience — no lag between words
- **Minimal UI** — reader is center stage
- **Dark mode only** — keep it simple
- **Mobile-first** — works great on phones
- **Fast** — local state for reading session performance
