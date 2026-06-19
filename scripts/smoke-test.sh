#!/usr/bin/env bash
set -euo pipefail

FRONTEND_URL="${FRONTEND_URL:-https://sre-lab.pages.dev/}"
API_BASE_URL="${API_BASE_URL:-https://sre-lab-api.daisan-tanaka.workers.dev}"
HEALTH_URL="${HEALTH_URL:-$API_BASE_URL/api/health}"
STATUS_URL="${STATUS_URL:-$API_BASE_URL/api/status}"
FALLBACK_URL="${FALLBACK_URL:-$API_BASE_URL/api/fallback}"
REMOVED_URL="${REMOVED_URL:-$API_BASE_URL/api/aws-cost-simulator}"

frontend_status="$(curl -sS -o /dev/null -w "%{http_code}" "$FRONTEND_URL")"
if [ "$frontend_status" != "200" ]; then
  echo "Frontend check failed: $frontend_status"
  exit 1
fi

health_status="$(curl -sS -o /tmp/sre-lab-health.json -w "%{http_code}" "$HEALTH_URL")"
if [ "$health_status" != "200" ]; then
  echo "Reliability health check failed: $health_status"
  cat /tmp/sre-lab-health.json || true
  exit 1
fi

status_status="$(curl -sS -o /tmp/sre-lab-status.json -w "%{http_code}" "$STATUS_URL")"
if [ "$status_status" != "200" ]; then
  echo "Reliability status check failed: $status_status"
  cat /tmp/sre-lab-status.json || true
  exit 1
fi

fallback_status="$(curl -sS -o /tmp/sre-lab-fallback.json -w "%{http_code}" "$FALLBACK_URL")"
if [ "$fallback_status" != "200" ]; then
  echo "Reliability fallback check failed: $fallback_status"
  cat /tmp/sre-lab-fallback.json || true
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
