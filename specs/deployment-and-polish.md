# Deployment & Polish

## Overview
Deploy SpeedReader to production and complete final polish items.

## Requirements

### Deployment
- Vercel project setup with GitHub integration
- Configure production environment variables (Supabase, Stripe, OAuth)
- Set up production Supabase database (migrations run)
- Configure custom domain (if applicable)
- Set up automatic deployments on push to main branch
- Configure build settings (Node.js version, etc.)

### Documentation
- Update README with:
  - Setup instructions for local development
  - Environment variables reference
  - Deployment guide
  - Architecture overview
- Create .env.example with all required variables
- Document API routes in code comments

### Polish
- Performance optimization (bundle size, lazy loading, image optimization)
- Add error boundaries to prevent app crashes
- Ensure loading states throughout the app (no blank screens)
- Mobile responsiveness audit (test on various screen sizes)
- Accessibility audit (keyboard navigation, screen readers, contrast)
- Fix any remaining bugs or UI issues
- Optimize Lighthouse scores (aim for 90+ on all metrics)

## Acceptance Criteria
- App deploys successfully to Vercel
- All environment variables configured correctly
- Database migrations run without errors
- Domain (if configured) resolves to deployed app
- README is comprehensive and accurate
- Lighthouse performance score > 90
- All pages work on mobile (320px width minimum)
- No console errors in production
- App loads quickly (< 3s first contentful paint)

## Edge Cases
- Environment variable missing → clear error message during build
- Database connection fails in production → graceful error handling
- Build fails → clear error messages for debugging
- Migration conflicts → handle with rollbacks or fixes
- Stripe webhooks fail in production → logging and retry logic

## Technical Notes
- Use Vercel's environment variable management
- Consider adding analytics (Vercel Analytics or Plausible)
- Set up logging for production errors
- Consider adding uptime monitoring
- Document any manual steps required for deployment
