# Production Monitoring - SpeedReader

**Purpose:** Document uptime monitoring, performance tracking, and alerting for the SpeedReader application.

---

## Overview

Production monitoring ensures:
- **Availability:** Detect and respond to outages quickly
- **Performance:** Track Core Web Vitals and user experience
- **Reliability:** Monitor API health and error rates
- **Business Impact:** Track conversion rates and feature usage

---

## Recommended Monitoring Tools

### 1. **UptimeRobot** (Recommended - Free Tier)
**Best for:** Simple uptime monitoring with email/slack alerts

**Features:**
- 50 monitors (free tier)
- 5-minute check interval
- HTTP/HTTPS/keyword checks
- SSL certificate monitoring
- Status page integration

**Setup Instructions:**

1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Create a new monitor:
   - **Type:** HTTPS
   - **URL:** `https://speedreader.vercel.app` (replace with actual domain)
   - **Monitoring Interval:** 5 minutes
   - **Alert Contacts:** Email, Slack (via webhook)
   - **Keyword:** "SpeedReader" (optional, checks if text exists in response)

3. Create additional monitors:
   - API health: `https://speedreader.vercel.app/api/health`
   - Auth check: `https://speedreader.vercel.app/api/auth/session`
   - Reader page: `https://speedreader.vercel.app/reader`

4. Configure alert notifications:
   - Email: `dev-team@example.com`
   - Slack: Create incoming webhook for `#speedreader-alerts`

**Environment Variables (`.env`):**
```
UPTIMEROBOT_READ_ONLY_API_KEY=your-api-key
```

**Status Page:**
- Enable public status page at `https://stats.uptimerobot.com/speedreader`
- Embed on landing page: `https://speedreader.vercel.app/status`

---

### 2. **Pingdom** (Alternative - Paid)
**Best for:** Advanced synthetic monitoring from multiple regions

**Features:**
- Multi-region checks (US, EU, Asia)
- 1-minute check intervals (paid)
- Transaction monitoring
- Page speed analysis

**Setup Instructions:**

1. Sign up at [pingdom.com](https://pingdom.com)
2. Create uptime checks for:
   - Homepage: `https://speedreader.vercel.app`
   - API health endpoint
   - Critical user journeys (signup, payment flow)

3. Configure alerting:
   - Email
   - SMS
   - Slack integration
   - PagerDuty (for on-call)

---

### 3. **Vercel Analytics** (Included with Vercel)
**Best for:** Real user monitoring (RUM) and Core Web Vitals

**Features:**
- Real-time analytics
- Core Web Vitals (LCP, CLS, FID, INP)
- Page views and visitor counts
- Geolocation data
- Referrer tracking

**Setup (already documented in LOGGING.md):**
```bash
npm install @vercel/analytics
```

**Key Metrics to Track:**
- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1
- **INP (Interaction to Next Paint):** < 200ms

**View Analytics:**
- Vercel Dashboard → Project → Analytics
- Filter by device type (mobile vs desktop)
- Filter by geographic region
- Track changes over time

---

### 4. **Sentry Performance Monitoring**
**Best for:** Application performance and transaction tracking

**Setup (already documented in LOGGING.md):**

**Key Transactions to Track:**
- `/` - Homepage load
- `/reader` - Reader page initialization
- `/api/auth/*` - Authentication flows
- `/api/checkout/*` - Payment processing
- `/api/save-text` - Text saving

**Performance Alerts:**
- Set up alerts for:
  - Transaction duration > 3s (P95)
  - Error rate > 5% in any transaction
  - LCP > 2.5s
  - CLS > 0.1

---

## Health Check Endpoint

Create a `/api/health` endpoint for monitoring tools:

```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const checks = {
    status: 'ok' as 'ok' | 'degraded' | 'down',
    timestamp: new Date().toISOString(),
    services: {
      database: 'ok' as 'ok' | 'down',
      stripe: 'ok' as 'ok' || 'down',
      version: process.env.VERCEL_GIT_COMMIT_SHA || 'unknown'
    }
  }

  // Check database connectivity
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!
    )
    const { error } = await supabase.from('users').select('id').limit(1)
    if (error) throw error
  } catch (error) {
    checks.services.database = 'down'
    checks.status = 'degraded'
  }

  // Check Stripe API key configuration
  if (!process.env.STRIPE_SECRET_KEY) {
    checks.services.stripe = 'down'
    checks.status = 'degraded'
  }

  const statusCode = checks.status === 'ok' ? 200 : 503
  return NextResponse.json(checks, { status: statusCode })
}
```

**Monitoring Tool Configuration:**
- UptimeRobot: Set monitor to `/api/health`
- Expect status code: 200
- Keyword: `"status":"ok"`

---

## Alerting Strategy

### **Alert Levels**

| Level | Definition | Response Time | Notification |
|-------|------------|---------------|--------------|
| P0 (Critical) | Site down, payment processing broken | < 15 min | PagerDuty + SMS + Slack |
| P1 (High) | Degraded performance, partial outage | < 1 hour | Slack + Email |
| P2 (Medium) | Slow API, minor features broken | < 4 hours | Email |
| P3 (Low) | Info, non-impacting issues | Daily digest | Email |

### **Alert Rules**

#### **Critical (P0) Alerts**
- Site down for > 5 minutes (UptimeRobot)
- Payment processing failures (Sentry)
- Database connection lost (Sentry)
- Error rate > 10% (Sentry)

#### **High (P1) Alerts**
- API response time > 3s (P95) (Sentry)
- Error rate > 5% (Sentry)
- Core Web Vitals degradation (Vercel Analytics)
- Authentication failures (Sentry)

#### **Medium (P2) Alerts**
- Slow database queries (> 2s) (Sentry)
- LCP > 2.5s (Vercel Analytics)
- CLS > 0.1 (Vercel Analytics)

### **Notification Channels**

**Slack (`#speedreader-alerts`):**
```bash
# UptimeRobot webhook to Slack
Webhook URL: https://hooks.slack.com/services/YOUR/WEBHOOK/URL
```

**Email:**
- P0-P1: `oncall@example.com`
- P2-P3: `dev-team@example.com`

**PagerDuty (for on-call):**
- Integration: Sentry → PagerDuty
- Escalation policy: 15 min → 30 min → 1 hour

---

## Monitoring Dashboard

### **Key Metrics to Display**

**Availability:**
- Uptime percentage (target: 99.9%)
- Current status (operational / degraded / down)
- Incident count (last 7 days)

**Performance:**
- Average response time (target: < 500ms)
- P95 response time (target: < 2s)
- Core Web Vitals scores

**Errors:**
- Error rate (target: < 1%)
- Active alerts
- Top error types

**Business:**
- Daily active users
- Words processed today
- Conversion rate (free → paid)

### **Recommended Dashboards**

**Vercel Analytics Dashboard:**
- Real-time page views
- Core Web Vitals trends
- Device/region breakdown

**Sentry Dashboard:**
- Error rate over time
- Top errors by frequency
- Performance transactions

**UptimeRobot Status Page:**
- Public status: `https://status.speedreader.app`
- Embed on landing page footer

---

## Incident Response

### **On-Call Procedures**

**When an alert fires:**
1. Acknowledge alert (respond to notification)
2. Check monitoring dashboards
3. Identify root cause (Sentry, Vercel logs)
4. Implement fix or rollback
5. Verify fix in monitoring
6. Document incident in `INCIDENTS.md`

**Escalation:**
- If not resolved in 15 min → escalate to team lead
- If critical business impact → all-hands on deck

### **Runbooks**

**Site Down:**
1. Check Vercel deployment status
2. Check environment variables
3. Review recent commits
4. Rollback if necessary: `vercel rollback --token=$VERCEL_TOKEN`

**Slow Performance:**
1. Check Sentry performance
2. Identify slow transactions
3. Review database queries
4. Check Vercel logs for timeouts

**High Error Rate:**
1. Check Sentry error dashboard
2. Filter by recent errors
3. Check for third-party outages (Stripe, Supabase)
4. Review recent deployments

---

## Testing Monitoring

### **Smoke Tests**
Run weekly to verify monitoring is working:

```bash
# Test health check endpoint
curl https://speedreader.vercel.app/api/health

# Test homepage
curl -I https://speedreader.vercel.app

# Test API routes
curl -X POST https://speedreader.vercel.app/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"priceId":"test"}'
```

### **Load Testing**
Test during off-peak hours:

```bash
# Install k6
npm install -g k6

# Run load test
k6 run --vus 50 --duration 30s load-test.js
```

```javascript
// load-test.js
import http from 'k6/http'

export default function () {
  http.get('https://speedreader.vercel.app/')
  http.get('https://speedreader.vercel.app/api/health')
}
```

---

## Monitoring Checklist

- [ ] Set up UptimeRobot monitors (homepage, API health, auth)
- [ ] Create public status page
- [ ] Configure alert notifications (Slack, email)
- [ ] Create `/api/health` endpoint
- [ ] Set up Vercel Analytics (already done in LOGGING.md)
- [ ] Configure Sentry performance monitoring
- [ ] Create monitoring dashboard
- [ ] Define alert levels and escalation rules
- [ ] Document incident response procedures
- [ ] Schedule weekly smoke tests
- [ ] Set up load testing (monthly)
- [ ] Train team on monitoring tools
- [ ] Create on-call rotation

---

## Cost Estimates

| Tool | Free Tier Limitations | Recommended Plan | Monthly Cost |
|------|----------------------|------------------|--------------|
| UptimeRobot | 50 monitors, 5-min intervals | Free | $0 |
| Pingdom | 1 monitor | Pro (10 monitors) | $10 |
| Vercel Analytics | Unlimited | Included with Vercel | $0 |
| Sentry Performance | 50k transactions/month | Team (5M transactions) | $26 |

**Total (Recommended Setup):** $0/month (UptimeRobot + Vercel + Sentry free tier)

---

## Next Steps

1. **Immediate (Priority 1):**
   - Set up UptimeRobot monitors (free)
   - Create `/api/health` endpoint
   - Configure Slack alerts

2. **Short-term (Priority 2):**
   - Set up Vercel Analytics (already documented)
   - Configure Sentry performance alerts
   - Create public status page

3. **Long-term (Priority 3):**
   - Create monitoring dashboard
   - Document incident response procedures
   - Set up load testing

---

**Last Updated:** February 2, 2026
