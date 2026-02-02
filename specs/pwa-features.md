# PWA Features

## Overview
Enable SpeedReader to work as a Progressive Web App with offline support.

## Requirements
- manifest.json configuration with app metadata (name, icons, colors, orientation)
- Service worker for offline caching and functionality
- App icons at various sizes (72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512)
- Install prompt UI to guide users on installing the PWA
- Offline reading capability - cache articles/texts for offline use
- Service worker should cache static assets (JS, CSS, images) and API responses

## Acceptance Criteria
- App is installable from browser (shows install prompt)
- App works offline (cached content is accessible)
- Service worker updates automatically
- App launches in full screen mode when installed
- User can install on mobile and desktop

## Edge Cases
- User denies install permission → gracefully handle, offer retry
- Service worker update fails → fallback to online mode
- Cache quota exceeded → implement cache management/eviction strategy
- Offline mode → show clear indicator that user is offline

## Technical Notes
- Next.js has built-in PWA support with next-pwa plugin
- Need to configure next.config.js for PWA
- Icons should be created/sourced (may need design work)
