# AGENTS.md

Operational guide for this project. Keep under 60 lines.

## Build & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Validation

Run these after implementing to get immediate feedback:

```bash
# Lint
npm run lint

# Type check (manual)
npx tsc --noEmit

# Build check
npm run build
```

## Codebase Patterns

- App Router: Pages in `src/app/`
- Components in `src/components/`
- Shared utilities in `src/lib/`
- Supabase client: `src/lib/supabase.ts`
- NextAuth: `src/lib/auth.ts`
- Server actions in `src/app/.../actions.ts`

## Operational Notes

- No test framework configured yet — add if needed
- Environment variables required: NEXTAUTH_SECRET, NEXTAUTH_URL, SUPABASE_URL, SUPABASE_ANON_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET

## Recent Updates

### Landing Page & Marketing ✅
- **Built:** Full landing page at `src/app/(landing)/page.tsx`
- **Includes:** Hero, value propositions, features, embedded demo, testimonials, FAQ, pricing, final CTA
- **Styling:** Matches dark theme (gray-900, white text, red accents)
- **SEO:** Has meta tags and structured data (Schema.org SoftwareApplication)
- **Components:** Uses existing shadcn/ui (Button, Card, Slider)

### What's Remaining 🔨

- **PWA Features:** Install next-pwa, configure next.config.js, create manifest.json, create icons, service worker setup
- **Documentation:** Create README.md, update .env.example, add API documentation to routes
- **Deployment:** Vercel setup, production database migration
- **Testing:** Test landing page locally, verify PWA features

## Project Status

- **Core Functionality:** ✅ 100% complete (reader, auth, library, history, stats, Stripe)
- **Marketing:** ✅ Landing page built
- **PWA:** ⏳ Pending
- **Documentation:** ⏳ Pending
- **Deployment:** ⏳ Pending

