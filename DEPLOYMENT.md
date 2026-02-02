# SpeedReader Deployment Guide

This guide walks you through deploying SpeedReader to Vercel.

## Prerequisites

Before you begin, ensure you have:

- ✅ A GitHub account
- ✅ A Vercel account ([sign up](https://vercel.com/signup))
- ✅ A Supabase project with migrations applied
- ✅ A Stripe account with API keys
- ✅ Google and/or GitHub OAuth apps configured

## Step 1: Push Code to GitHub

If you haven't already:

```bash
git add .
git commit -m "Ready for Vercel deployment"
git remote add origin https://github.com/YOUR_USERNAME/speedreader.git
git branch -M main
git push -u origin main
```

## Step 2: Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New..."** → **"Project"**
3. Select your `speedreader` repository from GitHub
4. Vercel will auto-detect Next.js settings

## Step 3: Configure Environment Variables

In Vercel dashboard → **Settings** → **Environment Variables**, add:

### Required Variables

| Variable | Value | Example |
|----------|-------|---------|
| `NEXTAUTH_URL` | Your Vercel URL | `https://speedreader.vercel.app` |
| `NEXTAUTH_SECRET` | Generate with: `openssl rand -base64 32` | `abc123xyz...` |
| `NEXT_PUBLIC_APP_URL` | Your Vercel URL | `https://speedreader.vercel.app` |
| `NEXT_PUBLIC_SUPABASE_URL` | From Supabase Dashboard → API | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | From Supabase Dashboard → API | `eyJxxx...` |
| `SUPABASE_SERVICE_ROLE_KEY` | From Supabase Dashboard → API | `eyJxxx...` |
| `STRIPE_SECRET_KEY` | From Stripe Dashboard → API Keys | `sk_live_...` |
| `STRIPE_WEBHOOK_SECRET` | From Stripe Dashboard → Webhooks | `whsec_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From Stripe Dashboard → API Keys | `pk_live_...` |

### Optional OAuth Variables

| Variable | Value | Example |
|----------|-------|---------|
| `GOOGLE_CLIENT_ID` | From Google Cloud Console | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud Console | `GOCSPX-xxx` |
| `GITHUB_CLIENT_ID` | From GitHub Developer Settings | `Iv1xxx` |
| `GITHUB_CLIENT_SECRET` | From GitHub Developer Settings | `xxx` |

**Important**: Set these for all environments (Production, Preview, Development) as needed.

## Step 4: Configure Production OAuth Redirect URLs

Update your OAuth apps with the production URLs:

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth 2.0 Client ID
3. Add to **Authorized redirect URIs**:
   - `https://your-app.vercel.app/api/auth/callback/google`

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Edit your OAuth App
3. Update **Authorization callback URL**:
   - `https://your-app.vercel.app/api/auth/callback/github`

## Step 5: Deploy to Vercel

1. Click **"Deploy"** in Vercel
2. Wait for build to complete (~2-3 minutes)
3. Visit your Vercel URL (e.g., `https://speedreader.vercel.app`)

## Step 6: Set Up Stripe Webhooks

1. In Stripe Dashboard → **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Endpoint URL: `https://your-app.vercel.app/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the **Signing Secret** and add to Vercel as `STRIPE_WEBHOOK_SECRET`

## Step 7: Run Supabase Migrations in Production

Your Supabase project should already have migrations applied from the `supabase/migrations/` directory. If you need to run them:

### Option A: Via Supabase Dashboard
1. Go to your Supabase project → **SQL Editor**
2. Run the contents of each migration file from `supabase/migrations/`

### Option B: Via Supabase CLI
```bash
# Link to your production project
supabase link --project-ref YOUR_PROJECT_ID

# Push migrations
supabase db push
```

## Step 8: Configure Custom Domain (Optional)

1. In Vercel dashboard → **Settings** → **Domains**
2. Click **"Add"** and enter your domain (e.g., `speedreader.app`)
3. Follow the DNS instructions provided
4. Wait for SSL certificate to provision (~5-10 minutes)

## Step 9: Enable Automatic Deployments

Vercel automatically deploys on push to `main` branch by default. To verify:

1. In Vercel dashboard → **Settings** → **Git**
2. Ensure **"Production Branch"** is set to `main`
3. Ensure **"Deploy Hooks"** → **"Ignored Build Step"** is empty (or only skip docs changes)

## Step 10: Verify Deployment

### Checklist:
- [ ] App loads at the production URL
- [ ] Authentication works (Google/GitHub login)
- [ ] Library page loads and can save texts
- [ ] Reader works with saved texts
- [ ] URL scraping works
- [ ] Stripe checkout works (use test mode first)
- [ ] PWA installs on mobile/desktop
- [ ] No console errors in browser DevTools

### Lighthouse Audit:
Run Lighthouse in Chrome DevTools:
1. Press `F12` → **Lighthouse** tab
2. Run audit for **Performance, Accessibility, Best Practices, SEO**
3. Aim for 90+ on all metrics

## Troubleshooting

### Build Fails

**Error**: `NEXTAUTH_SECRET is not defined`
- **Fix**: Add `NEXTAUTH_SECRET` environment variable in Vercel

**Error**: Database connection failed
- **Fix**: Verify Supabase credentials are correct and project is active

### Stripe Webhook Fails

**Error**: Webhook signature verification failed
- **Fix**: Ensure `STRIPE_WEBHOOK_SECRET` matches exactly (no trailing spaces)

### OAuth Fails

**Error**: Redirect URI mismatch
- **Fix**: Update OAuth provider's redirect URIs with your Vercel URL

### PWA Not Installing

**Error**: Manifest not found
- **Fix**: Ensure `manifest.json` is in `public/` directory and builds correctly

## Post-Deployment Tasks

1. **Set up monitoring**: Use Vercel Analytics or add your own (e.g., Plausible)
2. **Configure logging**: Vercel provides built-in logs
3. **Set up error tracking**: Consider Sentry for production error monitoring
4. **Configure uptime monitoring**: Use UptimeRobot or similar

## Production vs Development

| Variable | Development | Production |
|----------|-------------|------------|
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://your-app.vercel.app` |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `https://your-app.vercel.app` |
| `STRIPE_SECRET_KEY` | `sk_test_...` | `sk_live_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | `pk_live_...` |

## Support

If you encounter issues:
1. Check Vercel build logs
2. Check Supabase logs in Dashboard
3. Check Stripe Dashboard → Events for webhook errors
4. Open an issue on GitHub

---

**🎉 Congratulations!** Your SpeedReader app is now live on Vercel.
