# SpeedReader Implementation Plan

**Generated:** February 2, 2026
**Current Status:** Phases 1-6 Complete, starting Phase 7-9

---

## Completed Work ✅

- Phase 1: Core RSVP reader (display, controls, text input)
- Phase 2: Authentication (NextAuth, Google/GitHub OAuth, user accounts)
- Phase 3: Library & Persistence (save texts, history, stats)
- Phase 4: Usage tracking & paywall (10k free words, $5/mo tier)
- Phase 5: URL scraping (@extractus/article-extractor)
- Phase 6: Stripe integration (checkout, webhooks, customer portal)

---

## Remaining Work

### Priority 1: PWA Features (Phase 7)
**Spec:** `specs/pwa-features.md`

**Tasks:**
1. Install next-pwa package
2. Configure PWA in next.config.js (manifest.json, service worker)
3. Create app icons (72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512)
4. Create manifest.json with app metadata
5. Implement service worker for offline caching
6. Add install prompt UI component
7. Test PWA installation on mobile and desktop
8. Test offline reading capability

**Acceptance:** App installable, works offline, launches fullscreen

---

### Priority 2: Landing Page Completion (Phase 8)
**Spec:** `specs/landing-page.md`

**Tasks:**
1. Create landing page route (/ or /home)
2. Build hero section with headline, subheadlines, CTAs
3. Build value proposition section (problem/solution/benefits)
4. Build features section (all capabilities listed)
5. Build embedded demo with functional reader preview
6. Build how-it-works step-by-step section
7. Build FAQ section with expandable answers
8. Build pricing section (free vs pro tier comparison)
9. Build final CTA section
10. Add sticky navigation header
11. Implement scroll-triggered animations
12. Add social proof/testimonials section
13. Ensure mobile-first responsive design
14. Add SEO meta tags and structured data
15. Match dark theme styling (gray-900 bg, white text, red accents)
16. Reuse shadcn/ui components where possible

**Acceptance:** Page loads <2s, CTAs prominent, demo works, mobile-responsive, SEO optimized

---

### Priority 3: Deployment & Polish (Phase 9)
**Spec:** `specs/deployment-and-polish.md`

**Tasks:**
1. Set up Vercel project with GitHub integration
2. Configure production environment variables (Supabase, Stripe, OAuth)
3. Run database migrations in production
4. Configure custom domain (if applicable)
5. Set up automatic deployments on push to main
6. Update README with setup instructions, env vars reference, deployment guide
7. Create comprehensive .env.example
8. Add API route documentation
9. Performance optimization (bundle size, lazy loading, images)
10. Add error boundaries throughout app
11. Ensure loading states on all pages
12. Mobile responsiveness audit (test on 320px+)
13. Accessibility audit (keyboard nav, screen readers, contrast)
14. Fix any remaining bugs or UI issues
15. Optimize Lighthouse scores (aim 90+ on all metrics)
16. Set up production logging
17. Configure uptime monitoring

**Acceptance:** Deployed to Vercel, Lighthouse >90, mobile works, no console errors, comprehensive README

---

## Blocked Issues

None currently.

---

## Technical Notes

- Tech stack: Next.js 14, TypeScript, Tailwind CSS, Supabase, Stripe, NextAuth
- Dark theme: gray-900 bg, white text, red accents (#dc2626)
- Port: localhost:3000 for dev
- Database: Supabase (already configured with migrations)
- Stripe: Test mode for now, production keys needed for deployment

---

## Next Steps

1. Start with PWA Features (Priority 1) — foundation for installable app
2. Then Landing Page (Priority 2) — marketing and user acquisition
3. Finally Deployment & Polish (Priority 3) — production-ready
