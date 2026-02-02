# SpeedReader API Documentation

Base URL: `https://your-app.vercel.app/api` (development: `http://localhost:3000/api`)

## Authentication

All API routes (except `POST /api/extract-article`) require authentication via NextAuth.js sessions.

### How to Authenticate

**Client-side (browser):**
- Use `getServerSession()` or `useSession()` from `next-auth/react`
- Session cookies are sent automatically with requests

**Server-side (API routes):**
```typescript
import { getSession } from "@/lib/session"

const session = await getSession()
if (!session?.user?.id) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```

## Response Format

All API responses follow this format:

**Success Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

**HTTP Status Codes:**
- `200` - OK
- `201` - Created (for POST requests that create resources)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (not authenticated)
- `404` - Not Found
- `422` - Unprocessable Entity (e.g., article extraction failed)
- `500` - Internal Server Error

---

## API Routes

### 1. Authentication

#### `GET/POST /api/auth/[...nextauth]`

NextAuth.js authentication endpoints. Handles login, logout, and OAuth callbacks.

**OAuth Providers:**
- Google OAuth
- GitHub OAuth

**Usage:**
```typescript
import { signIn, signOut, useSession } from "next-auth/react"

// Sign in
signIn("google") // or "github"

// Sign out
signOut()

// Get session
const { data: session, status } = useSession()
```

---

### 2. Saved Texts

#### `GET /api/saved-texts`

Get all saved texts for the current user.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "title": "Article Title",
      "content": "Article content...",
      "source_url": "https://example.com/article",
      "word_count": 1000,
      "current_position": 500,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

#### `POST /api/saved-texts`

Save a new text.

**Authentication:** Required

**Request Body:**
```json
{
  "title": "Article Title",
  "content": "Article content...",
  "source_url": "https://example.com/article",
  "word_count": 1000
}
```

**Validation:**
- `title` (required, string) - Text title
- `content` (required, string) - Text content
- `source_url` (optional, string) - Source URL if applicable
- `word_count` (required, number, >= 0) - Number of words in text

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "title": "Article Title",
    "content": "Article content...",
    "source_url": "https://example.com/article",
    "word_count": 1000,
    "current_position": 0,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

---

#### `GET /api/saved-texts/[id]`

Get a specific saved text by ID.

**Authentication:** Required

**Parameters:**
- `id` (path parameter) - Text UUID

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "user_id": "uuid",
    "title": "Article Title",
    "content": "Article content...",
    "source_url": "https://example.com/article",
    "word_count": 1000,
    "current_position": 500,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

**Response (404 Not Found):**
```json
{
  "success": false,
  "error": "Text not found"
}
```

---

#### `PATCH /api/saved-texts/[id]`

Update a saved text (currently only supports reading position).

**Authentication:** Required

**Parameters:**
- `id` (path parameter) - Text UUID

**Request Body:**
```json
{
  "current_position": 750
}
```

**Validation:**
- `current_position` (required, number) - Current reading position in words

**Response:**
```json
{
  "success": true
}
```

---

#### `DELETE /api/saved-texts/[id]`

Delete a saved text.

**Authentication:** Required

**Parameters:**
- `id` (path parameter) - Text UUID

**Response:**
```json
{
  "success": true
}
```

---

### 3. Reading History

#### `GET /api/reading-history`

Get reading history entries for the current user.

**Authentication:** Required

**Query Parameters:**
- `limit` (optional, default: 100) - Maximum number of entries to return

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "saved_text_id": "uuid",
      "title": "Article Title",
      "words_read": 500,
      "wpm": 350,
      "duration_seconds": 86,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

---

#### `POST /api/reading-history`

Add a reading history entry.

**Authentication:** Required

**Request Body:**
```json
{
  "saved_text_id": "uuid",
  "title": "Article Title",
  "words_read": 500,
  "wpm": 350,
  "duration_seconds": 86
}
```

**Validation:**
- `title` (required, string) - Title of text read
- `words_read` (required, number) - Number of words read
- `saved_text_id` (optional, string) - Associated saved text UUID
- `wpm` (optional, number) - Words per minute speed
- `duration_seconds` (optional, number) - Reading duration in seconds

**Response:**
```json
{
  "success": true
}
```

---

#### `GET /api/reading-history/stats`

Get aggregated reading statistics for the current user.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "total_words_read": 15000,
    "total_sessions": 25,
    "average_wpm": 320,
    "total_time_minutes": 45,
    "last_read_at": "2024-01-01T00:00:00Z"
  }
}
```

---

### 4. Usage Tracking

#### `GET /api/usage`

Get current month's usage statistics for the authenticated user.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "month": "2024-01",
    "words_used": 8500,
    "words_limit": 10000,
    "tier": "free",
    "subscription_status": "active"
  }
}
```

**Tier Information:**
- `free` - 10,000 words per month
- `premium` - Unlimited words

---

#### `POST /api/usage`

Track words read (increments usage counter).

**Authentication:** Required

**Request Body:**
```json
{
  "count": 100
}
```

**Validation:**
- `count` (required, number, >= 0) - Number of words read

**Response:**
```json
{
  "success": true,
  "data": {
    "month": "2024-01",
    "words_used": 8600,
    "words_limit": 10000,
    "tier": "free",
    "subscription_status": "active"
  }
}
```

---

### 5. Article Extraction

#### `POST /api/extract-article`

Extract article content from a URL.

**Authentication:** Not required

**Request Body:**
```json
{
  "url": "https://example.com/article"
}
```

**Validation:**
- `url` (required, string, valid URL) - Article URL to extract

**Response (200 OK):**
```json
{
  "success": true,
  "title": "Article Title",
  "content": "Article content..."
}
```

**Response (422 Unprocessable Entity):**
```json
{
  "success": false,
  "error": "Failed to extract article from the provided URL"
}
```

---

### 6. Stripe Payment Integration

#### `POST /api/stripe/checkout`

Create a Stripe checkout session for subscription upgrade.

**Authentication:** Required

**Request Body:**
```json
{
  "tier": "premium"
}
```

**Validation:**
- `tier` (required, string) - Must be `"premium"`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "cs_xxx",
    "url": "https://checkout.stripe.com/pay/cs_xxx"
  }
}
```

**Flow:**
1. User clicks "Upgrade to Premium"
2. Frontend calls this API
3. Returns Stripe checkout URL
4. User is redirected to Stripe to complete payment
5. Webhook (`/api/stripe/webhook`) updates user tier after successful payment

---

#### `POST /api/stripe/portal`

Create a Stripe customer portal session for subscription management (cancel, update payment method, etc.).

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "https://billing.stripe.com/session/xxx"
  }
}
```

**Flow:**
1. User clicks "Manage Subscription"
2. Frontend calls this API
3. Returns Stripe portal URL
4. User is redirected to manage subscription

---

#### `POST /api/stripe/webhook`

Handle Stripe webhook events for subscription management.

**Authentication:** Not required (verified via Stripe signature)

**Webhook Events Handled:**
- `customer.subscription.created` - New subscription created
- `customer.subscription.updated` - Subscription updated
- `customer.subscription.deleted` - Subscription cancelled
- `invoice.payment_failed` - Payment failed

**Response:**
```json
{
  "success": true
}
```

**Note:** This endpoint is called by Stripe, not by the frontend.

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider adding rate limiting for production use.

## Error Handling

All API endpoints return error responses in a consistent format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common errors:
- `401 Unauthorized` - User not authenticated
- `400 Bad Request` - Invalid input parameters
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## CORS

API routes inherit CORS settings from Next.js. For cross-origin requests, configure headers in `next.config.js` or use Next.js API middleware.

## Example: Fetching Saved Texts

```typescript
// Client-side component
import { useSession } from "next-auth/react"

function MyComponent() {
  const { data: session } = useSession()
  const [texts, setTexts] = useState([])

  useEffect(() => {
    if (session) {
      fetch('/api/saved-texts')
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTexts(data.data)
          }
        })
    }
  }, [session])

  // Render texts...
}
```

## Example: Saving a Text

```typescript
async function saveText() {
  const response = await fetch('/api/saved-texts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'My Article',
      content: 'Article content...',
      source_url: 'https://example.com/article',
      word_count: 1000
    })
  })

  const data = await response.json()
  if (data.success) {
    console.log('Text saved:', data.data)
  }
}
```

---

## Support

For issues or questions:
- Check browser console for error details
- Check Vercel logs for server errors
- Open an issue on GitHub
