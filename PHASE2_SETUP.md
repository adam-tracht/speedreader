# Phase 2: Authentication & User Accounts — Setup Guide

## ✅ Completed Components

### Auth Configuration
- **src/lib/auth.ts** — NextAuth.js configuration
  - Google OAuth provider
  - GitHub OAuth provider
  - JWT session strategy
  - Custom callbacks for user ID

### API Routes
- **src/app/api/auth/[...nextauth]/route.ts** — NextAuth API handler

### TypeScript Types
- **src/types/auth.ts** — Auth session & JWT type definitions

### Auth UI Components
- **src/components/auth/auth-provider.tsx** — SessionProvider wrapper
- **src/components/auth/sign-in-button.tsx** — Google/GitHub sign-in buttons
- **src/components/auth/user-menu.tsx** — User dropdown menu with sign-out
- **src/components/auth/auth-button.tsx** — Simple sign-out button

### Sign-In Page
- **src/app/signin/page.tsx** — Full sign-in page with OAuth options

### Middleware
- **src/middleware.ts** — Route protection logic
  - Redirects unauthenticated users to /signin
  - Redirects authenticated users from /signin to /reader

### Session Utilities
- **src/lib/session.ts** — Helper functions for auth
  - `getSession()` — Get current session
  - `getCurrentUser()` — Get current user
  - `requireAuth()` — Get user or redirect

### Environment Variables
- **.env.example** — Template with all required env vars

### Supabase Integration
- **src/lib/supabase.ts** — Supabase client and types
  - User model
  - SavedText model
  - ReadingHistory model

---

## 🚀 Next Steps

### 1. Configure Environment Variables
```bash
# Copy .env.example to .env
cp .env.example .env

# Edit .env with your credentials
nano .env
```

Required variables:
- `NEXTAUTH_SECRET` — Generate with: `openssl rand -base64 32`
- `GOOGLE_CLIENT_ID` — From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` — From Google Cloud Console
- `GITHUB_CLIENT_ID` — From GitHub OAuth App settings
- `GITHUB_CLIENT_SECRET` — From GitHub OAuth App settings

### 2. Set Up Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project or select existing
3. Go to APIs & Services → Credentials
4. Create OAuth 2.0 Client ID
5. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`

### 3. Set Up GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. OAuth Apps → New OAuth App
3. Application name: `SpeedReader`
4. Homepage URL: `http://localhost:3000`
5. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
6. Note Client ID and generate Client Secret

### 4. Set Up Supabase
1. Go to [Supabase](https://supabase.com)
2. Create new project
3. Get project URL and anon key from Settings → API
4. Run SQL to create tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT,
  name TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved texts table
CREATE TABLE saved_texts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  word_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reading history table
CREATE TABLE reading_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  text_id UUID REFERENCES saved_texts(id) ON DELETE CASCADE,
  words_read INTEGER,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Test Sign-In Flow
```bash
# Start dev server
npm run dev

# Navigate to sign-in page
open http://localhost:3000/signin

# Test Google and GitHub sign-in
```

### 6. Update Root Layout
Add AuthProvider to root layout:

```tsx
// src/app/layout.tsx
import { SessionProvider } from "@/components/auth/auth-provider"
import { getSession } from "@/lib/session"

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const session = await getSession()

  return (
    <html lang="en">
      <body>
        <SessionProvider session={session}>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

### 7. Add User Menu to Reader Page
```tsx
// src/app/reader/page.tsx
import { UserMenu } from "@/components/auth/user-menu"

export default function ReaderPage() {
  return (
    <div>
      {/* Your existing reader UI */}
      <UserMenu />
    </div>
  )
}
```

---

## 🔧 Troubleshooting

### Issue: "Supabase environment variables are not set"
**Solution**: Make sure `.env.local` exists and has `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Issue: OAuth callback URL mismatch
**Solution**: Ensure callback URLs match exactly between OAuth provider and NextAuth config

### Issue: User not persisted to session
**Solution**: Check NEXTAUTH_SECRET is the same across all requests

### Issue: Middleware not redirecting
**Solution**: Ensure middleware.ts is at project root (not in src/)

---

## 📝 Implementation Notes

### Design Decisions
1. **Dark theme only** — Consistent with existing app design
2. **Minimal UI** — User menu is clean and unobtrusive
3. **Mobile-first** — Responsive design works on all screen sizes
4. **JWT sessions** — Faster than database sessions
5. **Protected routes** — Middleware handles auth state at edge

### NextAuth Configuration
- Custom sign-in page (`/signin`)
- JWT strategy for performance
- User ID added to session via JWT callback
- Supports both Google and GitHub OAuth

### File Structure
```
src/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts
│   ├── signin/
│   │   └── page.tsx
│   └── reader/
│       └── page.tsx
├── components/
│   └── auth/
│       ├── auth-provider.tsx
│       ├── auth-button.tsx
│       ├── sign-in-button.tsx
│       └── user-menu.tsx
├── lib/
│   ├── auth.ts
│   ├── session.ts
│   └── supabase.ts
├── middleware.ts
└── types/
    └── auth.ts
```

---

## 🎉 Phase 2 Complete!

All authentication infrastructure is in place. You can now:
1. Sign in with Google or GitHub
2. See your profile in the user menu
3. Have protected routes via middleware
4. Access Supabase database for user data

Next: Phase 3 — Library & Persistence
