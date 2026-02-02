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
