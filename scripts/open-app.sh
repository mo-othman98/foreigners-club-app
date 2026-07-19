#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [[ ! -d node_modules ]]; then
  echo "Installing dependencies..."
  npm install
fi

if [[ ! -f prisma/dev.db ]]; then
  echo "Setting up database..."
  npm run db:setup
fi

PORT="${PORT:-3000}"
URL="http://localhost:${PORT}"

echo "Starting Foreigners Club at ${URL}"

if command -v open >/dev/null 2>&1; then
  (sleep 2 && open "$URL") &
elif command -v xdg-open >/dev/null 2>&1; then
  (sleep 2 && xdg-open "$URL") &
fi

exec npm run dev
