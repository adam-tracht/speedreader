# Landing Page & Marketing

## Overview
Create a compelling landing page to attract users and drive signups.

## Requirements

### Hero Section (Above the Fold)
- **Headline:** "Read 3x Faster. Retain More. Be More Productive."
- **Subheadline:** "Stop losing focus. Stop re-reading sentences. RSVP speed reading eliminates eye movement and peripheral distractions so you can fly through content and actually remember what you read."
- **Primary CTA:** "Start Reading Free" (prominent, above fold, redirects to sign-in)
- **Secondary CTA:** "Try Demo" (scrolls to embedded demo, no signup)
- **Social Proof:** "Join thousands reading smarter every day" or similar trust signal
- **Visual:** Clean screenshot or animation of the reader in action

### Value Proposition (The "Why" Section)
**Problem Statement (Traditional Reading):**
- Your eyes constantly scan left to right across the page, jumping line by line
- Peripheral words distract your brain — you notice words above, below, and around your focus point
- Your attention splits between the current word and everything else on the page
- Result: You lose focus, re-read sentences, and read slower than you should

**Solution (How RSVP Works):**
- RSVP (Rapid Serial Visual Presentation) displays one word at a time in the center of your screen
- **No eye movement** — your eyes stay fixed in one place
- **No peripheral distractions** — only the current word is visible
- Your brain focuses 100% on each word with nothing competing for attention

**Benefits (What You Get):**
- Read 3x faster with zero loss of comprehension
- Retain more because you're never distracted
- Finish articles, books, and reports in a fraction of the time
- Reduce eye strain and fatigue

### Features Section (All Capabilities)
- **Speed Reading:** RSVP display with one word at a time
- **Adjustable Speed:** WPM control from 100-600+ (find your optimal pace)
- **Progress Tracking:** Automatically save your reading position — resume anytime
- **Saved Library:** Save articles and texts to your personal library
- **Reading History:** Track all your reading sessions with detailed statistics
- **URL Import:** Paste any article URL — we'll extract the content automatically
- **Usage Stats:** Monitor words read, sessions completed, and average WPM
- **Cross-Device Sync:** Your library, history, and progress sync across all devices
- **Free Tier:** 10,000 words/month at no cost
- **Unlimited Upgrade:** $5/month for unlimited reading

### Embedded Demo
- Functional reader preview with sample article pre-loaded
- Controls: Play, pause, speed slider, skip forward/back
- "See it in action" — try the RSVP method yourself in seconds
- No signup required for demo experience
- Clear "Start Your Own Reading" CTA after demo

### How It Works (Step-by-Step)
1. **Paste text or URL** — Copy any article or paste your own content
2. **Set your speed** — Adjust WPM to match your comfort level (start at 300-400)
3. **Hit play** — Watch words appear one at a time
4. **Read faster** — Finish articles in 1/3 the time with better retention

### Social Proof / Testimonials
- "Cut my reading time by 70% for work reports"
- "Finally getting through my book backlog"
- "Best speed reader I've used — actually retains comprehension"
- Add real testimonials or placeholders that can be replaced later

### FAQ Section
**General:**
- "How does RSVP speed reading actually work?" (Explain eye movement science)
- "Will this work for me? I've never tried speed reading before."
- "How long does it take to get used to RSVP reading?"

**Features:**
- "Can I import articles from websites?"
- "Do my saved texts sync across devices?"
- "What's included in the free vs paid tier?"

**Technical:**
- "Does it work offline?" (After PWA is implemented)
- "What happens to my data?" (Explain Supabase/privacy)
- "Can I cancel anytime?" (Stripe billing)

### Pricing Section
- **Free Tier:** 10,000 words/month
  - Perfect for trying out RSVP reading
  - Save texts to your library
  - Track reading history and stats
- **Pro Tier:** $5/month (unlimited words)
  - Unlimited reading — no word limits
  - All features included
  - Priority support
- **Pricing Cards:** Clear comparison, "Upgrade" button for free users, "Get Started" for new users
- **Trust Signals:** "Cancel anytime," "Secure payment via Stripe"

### Final CTA Section
- **Headline:** "Ready to read 3x faster?"
- **Subheadline:** "Join thousands of readers who've already transformed their reading habits."
- **CTA Button:** "Start Reading Free"
- **Secondary Link:** "Still have questions? Check the FAQ" (anchor link)

### UI Best Practices
- **Clear Visual Hierarchy:** H1 > H2 > H3 > body text, with size/weight/color differentiation
- **Generous Whitespace:** Don't crowd content — let sections breathe
- **Sticky Navigation:** Header with logo + "Start Reading" CTA that follows user down page
- **Scroll-triggered Animations:** Subtle fade-ins for sections as user scrolls
- **Mobile-First Design:** Stack vertically on mobile, side-by-side on desktop
- **High Contrast:** Dark theme but ensure text is readable (WCAG AA contrast)
- **Consistent Spacing:** Use 4px/8px grid for margins, padding, gaps
- **Responsive Images:** Use Next.js Image component with optimization
- **Loading States:** Skeletons or spinners for any async content
- **Error Boundaries:** Graceful fallback if something fails to load
- **Accessible Forms:** Proper labels, focus states, keyboard navigation
- **Clear CTAs:** Use action-oriented text ("Start Reading" vs "Submit")
- **Multiple CTAs:** Primary above fold, secondary mid-page, strong closing CTA

### Styling Consistency with Existing Reader
- **Match Dark Theme:** Use identical colors (gray-900 background, white text, red accents as per roadmap)
- **shadcn/ui Components:** Reuse existing components where possible:
  - `Button` component for all CTAs
  - `Card` component for features, testimonials, pricing cards
  - `Slider` component in demo (same as reader)
  - `Progress` component if showing stats
- **Typography:** Same font sizes and weights as reader page
- **Spacing:** Match the padding/margins used in existing UI
- **Colors:**
  - Background: gray-900 (near-black)
  - Text: white (primary), gray-400 (secondary)
  - Accents: red (for CTAs, highlights, buttons)
- **Borders & Shadows:** Same border radius, shadow styles as existing components
- **Hover States:** Consistent with existing interactive elements
- **Component Patterns:** Follow existing component structure and props where applicable

### SEO & Technical
- Meta tags: Title, description, OG tags for social sharing
- Structured data: Schema.org for SoftwareApplication
- Fast loading: Optimize images, code splitting, minimal JavaScript
- Sitemap.xml: Automatically generated by Next.js

## Acceptance Criteria
- Page loads quickly (< 2s on mobile)
- Clear CTAs are prominent
- Copy is compelling and convincing
- Demo works without signup (sample text pre-loaded)
- Mobile-responsive design
- SEO optimized (meta tags, structured data)

## Edge Cases
- User already logged in → CTA should go directly to reader
- Demo needs to handle mobile Safari/Chrome quirks
- FAQ answers should be accurate and helpful
- Pricing should be clear with no hidden fees

## Technical Notes
- Landing page route: / or /home
- Use existing dark theme
- Consider adding video demo of reader in action
- Copywriting should emphasize outcomes, not features
