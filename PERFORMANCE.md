# Performance Optimization Guide

This document outlines the performance optimizations implemented in SpeedReader.

## Overview

SpeedReader is optimized for fast load times, smooth interactions, and efficient resource usage. The target Lighthouse scores are 90+ across all metrics.

---

## Implemented Optimizations

### 1. Next.js Configuration Optimizations

**File:** `next.config.js`

#### Image Optimization
```javascript
images: {
  formats: ['image/avif', 'image/webp'],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}
```

- **AVIF/WebP formats**: Modern image formats with smaller file sizes
- **Responsive images**: Automatic resizing for different devices
- **Multiple resolutions**: Serve optimal image size for each device

#### SWC Minification
- Faster and smaller than Terser
- Enabled by default in Next.js 14

#### Console Removal (Production)
```javascript
compiler: {
  removeConsole: process.env.NODE_ENV === 'production' ? {
    exclude: ['error', 'warn'],
  } : false,
}
```

- Removes `console.log` and `console.info` in production
- Keeps `console.error` and `console.warn` for debugging

#### Package Import Optimization
```javascript
experimental: {
  optimizePackageImports: ['lucide-react'],
}
```

- Tree-shakes unused icons from lucide-react
- Reduces bundle size significantly

---

### 2. Vercel Configuration

**File:** `vercel.json`

#### Security Headers
```json
{
  "source": "/(.*)",
  "headers": [
    {
      "key": "X-Content-Type-Options",
      "value": "nosniff"
    },
    {
      "key": "X-Frame-Options",
      "value": "DENY"
    },
    {
      "key": "X-XSS-Protection",
      "value": "1; mode=block"
    }
  ]
}
```

- Prevents MIME type sniffing
- Blocks clickjacking attacks
- Enables XSS protection

#### Service Worker Headers
```json
{
  "source": "/sw.js",
  "headers": [
    {
      "key": "Cache-Control",
      "value": "public, max-age=0, must-revalidate"
    },
    {
      "key": "Service-Worker-Allowed",
      "value": "/"
    }
  ]
}
```

- Ensures service worker updates properly
- Allows service worker to control all pages

#### Region Selection
```json
"regions": ["iad1"]
```

- Deploys to US East (Virginia)
- Fast response times for US users

---

### 3. PWA Optimizations

**File:** `next.config.js`

```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
});
```

#### Benefits:
- **Offline access**: Users can read saved texts without internet
- **Fast launches**: Cached assets load instantly
- **App-like experience**: Installable on mobile and desktop

#### Service Worker Strategy:
- `skipWaiting: true` - Immediately activates new service worker
- `register: true` - Automatically registers on page load

---

### 4. Code Splitting & Lazy Loading

### Automatic Code Splitting

Next.js automatically:
- Splits pages into separate bundles
- Loads only necessary JavaScript for each route
- Enables prefetching of linked pages

### Lazy Loading Example

For heavy components, use `next/dynamic`:

```typescript
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(
  () => import('@/components/HeavyComponent'),
  {
    loading: () => <p>Loading...</p>,
    ssr: false // Optional: disable server-side rendering
  }
)
```

**Note:** The landing page demo is already client-side rendered, which improves initial load time.

---

### 5. Icon Optimization

**File:** `public/icons/`

All icons are:
- Properly sized (multiple resolutions: 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512)
- Optimized PNG format
- Served with appropriate cache headers

**Recommendation:** Consider converting to WebP for smaller file sizes:
```bash
# Using cwebp
cwebp -q 80 icon-192x192.png -o icon-192x192.webp
```

---

### 6. Font Optimization

**File:** `src/app/layout.tsx`

```typescript
const inter = Inter({ subsets: ["latin"] })
```

- **Google Fonts**: Inter font with Latin subset
- **Automatic optimization**: Next.js font optimization
- **Self-hosting option**: For even faster loads, consider self-hosting

**To self-host:**
1. Download font files
2. Place in `public/fonts/`
3. Update to local font reference

---

### 7. API Optimization

### Response Compression

Vercel automatically:
- Compresses API responses with gzip/br
- Enables Brotli compression for better compression ratios

### Database Queries

Supabase optimizations:
- Use indexes on frequently queried columns
- Limit result sets with pagination
- Cache frequently accessed data

---

## Performance Targets

### Lighthouse Scores

| Metric | Target | Current |
|--------|--------|---------|
| Performance | 90+ | TBD |
| Accessibility | 90+ | TBD |
| Best Practices | 90+ | TBD |
| SEO | 90+ | TBD |

### Key Metrics

| Metric | Target | Description |
|--------|--------|-------------|
| First Contentful Paint (FCP) | < 1.8s | Time to first content |
| Largest Contentful Paint (LCP) | < 2.5s | Time to largest element |
| Time to Interactive (TTI) | < 3.8s | Page fully interactive |
| Cumulative Layout Shift (CLS) | < 0.1 | Layout stability |
| First Input Delay (FID) | < 100ms | Responsiveness |
| Total Blocking Time (TBT) | < 200ms | JavaScript execution |

---

## Monitoring Performance

### Lighthouse Audit

Run in Chrome DevTools:
1. Open DevTools (F12)
2. Go to **Lighthouse** tab
3. Select categories: Performance, Accessibility, Best Practices, SEO
4. Click **Analyze page load**

### Vercel Analytics

1. Go to Vercel Dashboard → **Analytics**
2. View Core Web Vitals
3. Monitor Real User Metrics (RUM)

### Bundle Analysis

To analyze bundle size:

```bash
npm install @next/bundle-analyzer
```

Update `next.config.js`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer(withPWA(nextConfig))
```

Run analysis:
```bash
ANALYZE=true npm run build
```

---

## Optimization Checklist

- [x] Next.js configuration optimized (images, SWC minification, console removal)
- [x] Vercel configuration with security headers
- [x] PWA with service worker and offline support
- [x] Automatic code splitting enabled
- [x] Lucide-react icons optimized (tree-shaking)
- [x] Google Fonts with subset optimization
- [x] API response compression (automatic via Vercel)
- [ ] Lazy load heavy components (if needed)
- [ ] Convert icons to WebP format
- [ ] Add image optimization for any user-uploaded images
- [ ] Implement caching strategy for API routes
- [ ] Monitor and optimize Core Web Vitals

---

## Troubleshooting Performance Issues

### Slow Initial Load

**Check:**
1. Large JavaScript bundle → Run bundle analyzer
2. Unoptimized images → Use Next.js Image component
3. Missing cache headers → Check Vercel configuration

### Slow API Responses

**Check:**
1. Database queries → Add indexes, optimize queries
2. Network latency → Consider edge functions
3. Heavy computations → Use background jobs or edge compute

### Poor Lighthouse Scores

**Check:**
1. Large unused JavaScript → Implement code splitting
2. Unoptimized images → Convert to WebP, use proper sizes
3. Missing meta tags → Add proper SEO metadata
4. Poor accessibility → Add ARIA labels, improve contrast

---

## Future Optimizations

1. **Image Optimization**: Convert all icons to WebP format
2. **Service Worker Caching**: Implement aggressive caching for API responses
3. **Edge Functions**: Move heavy computations to edge
4. **Database Optimization**: Add indexes and query caching
5. **Analytics Integration**: Add Vercel Analytics for real user metrics
6. **Bundle Monitoring**: Set up automated bundle size checks
7. **Performance Budget**: Set and enforce budget limits
8. **CDN**: Use CDN for static assets (Vercel already does this)

---

## Resources

- [Next.js Performance](https://nextjs.org/docs/app/building-your-application/optimizing)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developer.chrome.com/docs/lighthouse)
- [next-pwa](https://github.com/shadowwalker/next-pwa)
- [Vercel Performance](https://vercel.com/docs/concepts/functions/serverless-functions/optimizing-performance)

---

**Last Updated:** February 2, 2026
