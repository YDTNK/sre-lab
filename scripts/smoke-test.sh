#!/usr/bin/env bash
set -euo pipefail

FRONTEND_URL="${FRONTEND_URL:-https://sre-lab.pages.dev/}"
API_URL="${API_URL:-https://sre-lab-api.daisan-tanaka.workers.dev/api/moving-assistant}"
REMOVED_URL="${REMOVED_URL:-https://sre-lab-api.daisan-tanaka.workers.dev/api/aws-cost-simulator}"

frontend_status="$(curl -sS -o /dev/null -w "%{http_code}" "$FRONTEND_URL")"
if [ "$frontend_status" != "200" ]; then
  echo "Frontend check failed: $frontend_status"
  exit 1
fi

api_status="$(curl -sS -o /tmp/sre-lab-api-response.json -w "%{http_code}" \
  -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"furniture":"smoke test desk","clothes":"","electronics":"","books":"","movingDate":"","notes":"github actions smoke test"}')"

if [ "$api_status" != "200" ]; then
  echo "API check failed: $api_status"
  cat /tmp/sre-lab-api-response.json || true
  exit 1
fi

removed_status="$(curl -sS -o /dev/null -w "%{http_code}" \
  -X POST "$REMOVED_URL" \
  -H "Content-Type: application/json" \
  -d '{}')"

if [ "$removed_status" = "200" ]; then
  echo "Removed service unexpectedly returned 200"
  exit 1
fi

echo "Smoke tests passed"
