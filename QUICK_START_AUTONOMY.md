# QUICK AUTONOMY REFERENCE

## CRASH RECOVERY (Do These FAST)

1. Kill crashed session: `process kill session_id`
2. Fix the error (see ERROR FIXES below)
3. Restart: `claude "prompt" --background --pty`
4. Monitor: `process poll session_id` every 60s

## ERROR FIXES (Do These FIRST)

### Directory Error:
```bash
mkdir -p /path/to/directory
```

### File Creation Error:
```bash
python3 << 'END'
with open('/path/to/file', 'w') as f:
    f.write('content')
END
```

### Module Not Found:
```bash
npm install package-name
```

### TypeScript Error:
```bash
# Fix the type error in the file
npm run build
```

### Waiting on Prompt:
```bash
# NEVER wait for user click. Use:
process write session_id "1"
```

## NEVER

- ❌ Wait for user to say "fix it"
- ❌ Wait for user to click "Yes" on file creation
- ❌ Wait more than 30 seconds before acting on error
- ❌ Let a crashed session sit idle

## ALWAYS

- ✅ Fix errors immediately when detected
- ✅ Try alternative approach if first fails
- ✅ Monitor long-running processes
- ✅ Record learnings (see AUTONOMOUS_WORKFLOW.md)
- ✅ Take autonomous action without being told

## PHASE 3 STATUS

Files to verify exist:
- src/lib/saved-texts.ts
- src/lib/reading-history.ts
- src/app/api/saved-texts/route.ts
- src/app/api/saved-texts/[id]/route.ts
- src/app/api/reading-history/route.ts
- src/app/api/reading-history/stats/route.ts
- src/hooks/useSavedTexts.ts
- src/hooks/useReadingHistory.ts
- src/hooks/useSession.ts
- src/app/library/page.tsx
- src/app/history/page.tsx

Next action: Fix Supabase env issue and verify build
