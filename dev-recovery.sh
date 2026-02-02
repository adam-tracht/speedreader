#!/bin/bash
# Dev Recovery Script - Auto-restarts Claude Code work after crashes
# Usage: ./dev-recovery.sh "prompt text"

PROMPT="$1"
cd /root/clawd/speedreader

echo "Starting Claude Code with persistent prompt..."
echo "Prompt: $PROMPT"

claude "$PROMPT" --background --pty

# This script will wait for completion
claude_pid=$!
echo "Started with PID: $claude_pid"
echo "Monitor with: tail -f ~/.config/claude-code/logs/claude-code.log"
