# SpeedReader

A speed reading app using RSVP (Rapid Serial Visual Presentation) to help you read faster. Read up to 3x your normal speed while maintaining comprehension.

## Features

- **RSVP Reader**: Words appear one at a time, eliminating eye movement and distractions
- **Adjustable Speed**: Control reading pace from 100-1000 words per minute
- **Text Library**: Save and manage your reading materials
- **Reading History**: Track your sessions and see detailed statistics
- **URL Scraping**: Import articles from any URL
- **PWA**: Install as a native app on mobile and desktop
- **Cross-Device Sync**: Library and history sync across all devices
- **Free Tier**: 10,000 words/month at no cost
- **Premium**: $5/month for unlimited reading

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: NextAuth.js (Google & GitHub OAuth)
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **PWA**: next-pwa

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account and project
- A Stripe account
- Google and GitHub OAuth apps (optional, for authentication)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd speedreader
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Then edit `.env` and fill in your credentials (see [Environment Variables](#environment-variables) below).

4. **Set up Supabase database**
   ```bash
   # Run migrations
   npx supabase db push
   ```

   Or manually apply the migrations in `supabase/migrations/` via the Supabase dashboard.

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# NextAuth.js Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth (optional)
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Supabase Configuration (required)
NEXT_PUBLIC_SUPABASE_URL="your-supabase-project-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"

# Stripe Configuration (required)
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key_here"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret_here"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your_publishable_key_here"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Generating NextAuth Secret

Generate a secure random string for `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### Setting up OAuth Providers

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new OAuth 2.0 client ID
3. Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs
4. Copy the Client ID and Client Secret to `.env`

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Authorization callback URL to `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to `.env`

### Setting up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service role key → `SUPABASE_SERVICE_ROLE_KEY`
3. Apply the database migrations from `supabase/migrations/`

### Setting up Stripe

1. Create an account at [stripe.com](https://stripe.com)
2. Get your API keys from the Dashboard → Developers → API keys
3. Create a webhook endpoint (in production) to handle events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

## Project Structure

```
speedreader/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Landing page
│   │   ├── reader/            # Reader page
│   │   ├── library/           # Library page
│   │   ├── history/           # Reading history page
│   │   ├── settings/          # Settings page
│   │   └── api/               # API routes
│   ├── components/            # Reusable components
│   ├── lib/                   # Utility functions
│   └── types/                 # TypeScript types
├── public/                    # Static assets (icons, manifest)
├── supabase/                  # Database migrations
└── specs/                     # Feature specifications
```

## API Routes

- `GET/POST /api/reading-history` - Get/add reading history entries
- `GET /api/reading-history/stats` - Get user reading statistics
- `GET/POST /api/saved-texts` - Get/save texts
- `GET/PUT/DELETE /api/saved-texts/[id]` - Manage individual texts
- `GET /api/usage` - Get current month word usage
- `POST /api/extract-article` - Extract article content from URL
- `POST /api/stripe/checkout` - Create Stripe checkout session
- `POST /api/stripe/portal` - Create Stripe customer portal link
- `POST /api/stripe/webhook` - Handle Stripe webhooks

## Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Deployment to Vercel

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import project to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Configure environment variables (see [Environment Variables](#environment-variables))
   - Click "Deploy"

3. **Configure production environment variables**
   In Vercel dashboard → Settings → Environment Variables, add all the variables from your `.env` file.

4. **Run database migrations in production**
   Use the Supabase Dashboard to apply migrations from `supabase/migrations/`.

5. **Configure Stripe webhook**
   - Get your production webhook URL from Vercel (e.g., `https://your-app.vercel.app/api/stripe/webhook`)
   - Add it in Stripe Dashboard → Webhooks → Add endpoint

## Performance & Accessibility

- **Bundle Size**: Optimized with Next.js automatic code splitting
- **Lazy Loading**: Components load on-demand
- **Image Optimization**: Next.js Image component for all images
- **Lighthouse Score**: Aim for 90+ on all metrics
- **Mobile Responsive**: Tested on 320px+ screen widths
- **Accessibility**: Keyboard navigation, ARIA labels, screen reader support, WCAG AA contrast ratios

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue on GitHub.
