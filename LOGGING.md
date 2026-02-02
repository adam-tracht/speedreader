# Production Logging - SpeedReader

**Purpose:** Document production logging setup, log levels, error tracking, and monitoring tools for the SpeedReader application.

---

## Overview

Effective logging is critical for production applications to:
- Debug issues in real-time
- Monitor application health
- Track user behavior patterns
- Identify performance bottlenecks
- Alert on critical errors

---

## Recommended Logging Tools

### 1. **Sentry** (Recommended for Error Tracking)
**Best for:** Production error tracking and performance monitoring

**Setup:**
```bash
npm install @sentry/nextjs
npx @sentry/wizard -i nextjs
```

**Key Features:**
- Automatic error capture
- Stack traces with source maps
- Performance monitoring
- Release tracking
- Alert integrations (Slack, email, PagerDuty)

**Configuration (`.sentryclirc`):**
```ini
[defaults]
url=https://sentry.io/
org=your-org-name
project=speedreader
auth_token=YOUR_AUTH_TOKEN
```

**Environment Variables (`.env`):**
```
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
SENTRY_AUTH_TOKEN=your-auth-token
SENTRY_ENVIRONMENT=production
```

**Usage Example:**
```typescript
import * as Sentry from '@sentry/nextjs'

// Manual error capture
Sentry.captureException(new Error('Something went wrong'))

// Custom breadcrumbs
Sentry.addBreadcrumb({
  category: 'user',
  message: 'User clicked save button',
  level: 'info'
})

// Track custom events
Sentry.captureMessage('User reached 10k word limit', 'warning')
```

---

### 2. **LogRocket** (Recommended for Session Replay)
**Best for:** Understanding user behavior and reproducing bugs

**Setup:**
```bash
npm install logrocket
```

**Environment Variables (`.env`):**
```
NEXT_PUBLIC_LOGROCKET_APP_ID=your-app-id
```

**Usage Example (`app/layout.tsx` or `pages/_app.tsx`):**
```typescript
import LogRocket from 'logrocket'

if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
  LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID)

  // Identify user
  LogRocket.identify('user_123', {
    name: 'John Doe',
    email: 'john@example.com'
  })
}
```

**Key Features:**
- Session replay with video-like playback
- Network request logging
- Console capture
- User session search

---

### 3. **Vercel Analytics** (Included with Vercel)
**Best for:** Traffic analytics and Core Web Vitals

**Setup:**
```bash
npm install @vercel/analytics
```

**Usage Example (`app/layout.tsx`):**
```typescript
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

**Key Features:**
- Page views
- Web Vitals (LCP, CLS, FID)
- Geolocation data
- Referrer tracking

---

### 4. **Console-based Logging** (For Development)
**Best for:** Local development and quick debugging

**Log Levels:**
```typescript
// Debug - Detailed diagnostic info
console.debug('[SpeedReader Debug]', 'User data loaded', userData)

// Info - General informational messages
console.info('[SpeedReader]', 'User saved text', { id: textId, wordCount })

// Warn - Warning messages for non-critical issues
console.warn('[SpeedReader]', 'API rate limit approaching', { remaining: 100 })

// Error - Critical errors that need attention
console.error('[SpeedReader]', 'Failed to save text', error)
```

**Production Logging Pattern:**
```typescript
const isDevelopment = process.env.NODE_ENV === 'development'

function log(message: string, data?: any, level: 'info' | 'warn' | 'error' = 'info') {
  if (isDevelopment) {
    console[level](`[SpeedReader ${level.toUpperCase()}]`, message, data)
  } else {
    // Send to logging service (Sentry, LogRocket, etc.)
    if (level === 'error') {
      // Sentry.captureException(new Error(message))
    }
  }
}
```

---

## Recommended Logging Strategy

### **Development Environment**
- Use `console.log`, `console.debug`, `console.error`
- Enable verbose logging
- Stack traces visible
- Fast refresh with logs

### **Staging Environment**
- Use structured logging
- Filter out debug logs
- Test production logging tools
- Validate error reporting

### **Production Environment**
- **Error Tracking:** Sentry (critical errors only)
- **Session Replay:** LogRocket (sample sessions, e.g., 10%)
- **Analytics:** Vercel Analytics (all users)
- **Performance Monitoring:** Sentry Performance
- **Console:** Remove all `console.log` statements in production builds

---

## What to Log

### **Always Log (Production)**
- Unhandled errors
- API failures (with response status)
- Authentication failures
- Payment processing errors
- Database connection errors

### **Never Log (Production)**
- Passwords or sensitive credentials
- Full credit card numbers
- Personal identifying information (PII) without consent
- Raw request bodies with sensitive data
- User tokens or session IDs

### **Sometimes Log (Production - With Caution)**
- User IDs (not emails/names) for debugging
- Feature usage patterns (anonymized)
- Performance metrics
- Business logic errors

---

## Log Level Best Practices

| Level | When to Use | Example |
|-------|-------------|---------|
| `debug` | Development diagnostics | "User clicked button", "Component mounted" |
| `info` | Normal operation | "User logged in", "Text saved successfully" |
| `warn` | Non-critical issues | "API rate limit at 80%", "Slow query detected" |
| `error` | Critical failures | "Failed to process payment", "Database connection lost" |

---

## Alerting Setup

### **Sentry Alerts**
1. Go to Sentry → Settings → Alerts
2. Create rules for:
   - Error rate > 5% in 5 minutes
   - Any error with "critical" tag
   - New errors introduced after deployment
3. Configure notification channels:
   - Slack (#speedreader-alerts)
   - Email (dev-team@example.com)
   - PagerDuty (for on-call)

### **LogRocket Alerts**
1. Set up session alerts for:
   - 3+ errors in a single session
   - Failed checkout attempts
   - API errors with status 500

---

## Log Retention

- **Development:** No retention (local only)
- **Staging:** 7 days
- **Production:**
  - Sentry: 30 days (free tier), 90 days (paid)
  - LogRocket: 7 days (free tier), 30 days (paid)
  - Vercel Analytics: 30 days (included)

---

## Privacy & Compliance

### **GDPR Considerations**
- Anonymize user IDs in logs
- Provide opt-out for session replay
- Delete logs on user request
- Clear data retention policies

### **Session Replay Consent**
```typescript
// Example: Only record sessions with consent
if (userConsent && process.env.NEXT_PUBLIC_LOGROCKET_APP_ID) {
  LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_APP_ID)
}
```

---

## Implementation Checklist

- [ ] Install Sentry: `npm install @sentry/nextjs`
- [ ] Install LogRocket: `npm install logrocket`
- [ ] Install Vercel Analytics: `npm install @vercel/analytics`
- [ ] Add environment variables to `.env.example`
- [ ] Configure Sentry in `next.config.js` (via wizard)
- [ ] Add Analytics component to root layout
- [ ] Add Sentry error boundaries to all pages
- [ ] Remove `console.log` from production builds
- [ ] Set up Sentry alerts
- [ ] Test error tracking in staging
- [ ] Configure LogRocket session sampling (start with 10%)
- [ ] Add privacy policy for session replay
- [ ] Document log retention policy
- [ ] Train team on log review procedures

---

## Common Issues & Solutions

### **Issue:** Too many Sentry errors from client-side hydration
**Solution:** Filter hydration mismatch errors in Sentry settings:
```
Filter: message contains "Hydration failed" or "Minified React error #418"
Action: Ignore (these are expected in some scenarios)
```

### **Issue:** LogRocket session replay too slow
**Solution:** Reduce session sampling or enable compression:
```typescript
LogRocket.init('app-id', {
  rootHostname: 'speedreader.app',
  sampleRate: 0.05, // Only record 5% of sessions
  release: process.env.VERCEL_GIT_COMMIT_SHA,
})
```

### **Issue:** Missing source maps in Sentry
**Solution:** Upload source maps during Vercel build:
```javascript
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(
  // Your existing config
  { ... },
  {
    silent: true,
    dryRun: process.env.NODE_ENV !== 'production'
  }
)
```

---

## Next Steps

1. Set up Sentry for error tracking (highest priority)
2. Add Vercel Analytics for basic metrics (free)
3. Add LogRocket for session replay (start with 5% sampling)
4. Configure alerting rules
5. Test error capture in staging
6. Review logs regularly for patterns

---

**Last Updated:** February 2, 2026
