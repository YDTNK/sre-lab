#!/usr/bin/env bash
set -euo pipefail

FRONTEND_URL="${FRONTEND_URL:-https://sre-lab.pages.dev/}"
API_BASE_URL="${API_BASE_URL:-https://sre-lab-api.daisan-tanaka.workers.dev}"
API_URL="${API_URL:-$API_BASE_URL/api/moving-assistant}"
REMOVED_URL="${REMOVED_URL:-$API_BASE_URL/api/aws-cost-simulator}"

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

check_json_endpoint() {
  local name="$1"
  local path="$2"
  local expected_status="$3"
  local expected_pattern="$4"
  local response_file="/tmp/sre-lab-${name}-response.json"
  local status

  status="$(curl -sS -o "$response_file" -w "%{http_code}" "$API_BASE_URL$path")"

  if [ "$status" != "$expected_status" ]; then
    echo "$name check failed: expected $expected_status, got $status"
    cat "$response_file" || true
    exit 1
  fi

  if ! grep -qE "$expected_pattern" "$response_file"; then
    echo "$name response did not match: $expected_pattern"
    cat "$response_file" || true
    exit 1
  fi
}

check_json_endpoint "health" "/api/health" "200" '"status":"healthy"'
check_json_endpoint "slow" "/api/slow?delayMs=10" "200" '"delayMs":10'
check_json_endpoint "slow-clamped" "/api/slow?delayMs=999999" "200" '"delayMs":5000'
check_json_endpoint "error" "/api/error" "500" '"code":"intentional_demo_error"'
check_json_endpoint "fallback" "/api/fallback" "200" '"fallbackActive":true'
check_json_endpoint "status" "/api/status" "200" '"state":"active"'

removed_status="$(curl -sS -o /dev/null -w "%{http_code}" \
  -X POST "$REMOVED_URL" \
  -H "Content-Type: application/json" \
  -d '{}')"

if [ "$removed_status" = "200" ]; then
  echo "Removed service unexpectedly returned 200"
  exit 1
fi

echo "Smoke tests passed"
