#!/usr/bin/env bash
set -euo pipefail

fail() {
  echo "PR validation failed: $1" >&2
  exit 1
}

require_file() {
  local file="$1"
  test -f "$file" || fail "missing required file: $file"
}

require_grep() {
  local pattern="$1"
  local file="$2"
  grep -qE -- "$pattern" "$file" || fail "expected pattern '$pattern' in $file"
}

reject_grep() {
  local pattern="$1"
  local file="$2"
  if grep -qE -- "$pattern" "$file"; then
    fail "unexpected pattern '$pattern' in $file"
  fi
}

require_file START_HERE_FOR_AI.md
require_file AGENTS.md
require_file README.md
require_file docs/mandatory-context-registry.md
require_file docs/issue-number-execution.md
require_file docs/automation-first-working-policy.md
require_file docs/ai-organization-operating-model.md
require_file docs/sre-lab-workflow.md
require_file docs/ai-assisted-85-90-workflow.md
require_file docs/codex-workflow.md
require_file docs/completion-report-template.md
require_file docs/service-state-checklist.md
require_file docs/services.md
require_file docs/runbook.md
require_file docs/architecture.md
require_file docs/operations.md
require_file docs/incidents.md
require_file docs/incident-record-rules.md
require_file docs/grafana-issue-ai-investigation.md
require_file docs/deploy-failure-investigation.md
require_file .github/ISSUE_TEMPLATE/codex_task.md
require_file .github/pull_request_template.md
require_file .github/workflows/ci.yml
require_file .github/workflows/deploy-worker.yml
require_file scripts/smoke-test.sh
require_file apps/landing/index.html
require_file apps/landing/styles.css
require_file apps/api/src/index.js
require_file apps/api/package.json
require_file apps/api/package-lock.json
require_file apps/api/wrangler.toml

bash -n scripts/smoke-test.sh

# Portfolio pivot guardrails
require_grep 'Reliability Demo API' README.md
require_grep 'SRE / Platform Engineer portfolio' README.md
require_grep 'Reliability Demo API' AGENTS.md
require_grep 'SRE portfolio-first' AGENTS.md
require_grep 'Reliability Demo API' docs/services.md
require_grep 'SLO / SLI' docs/services.md
require_grep 'SRE portfolio-first' docs/automation-first-working-policy.md
require_grep 'Issue-first' docs/automation-first-working-policy.md

# Preserve operational assets that remain valuable after the portfolio pivot.
require_grep 'RELIABILITY_HEALTH_API_PATH = "/api/health"' apps/api/src/index.js
require_grep 'RELIABILITY_SLOW_API_PATH = "/api/slow"' apps/api/src/index.js
require_grep 'RELIABILITY_ERROR_API_PATH = "/api/error"' apps/api/src/index.js
require_grep 'RELIABILITY_FALLBACK_API_PATH = "/api/fallback"' apps/api/src/index.js
require_grep 'RELIABILITY_STATUS_API_PATH = "/api/status"' apps/api/src/index.js
require_grep 'MAX_SLOW_DELAY_MS = 5000' apps/api/src/index.js
require_grep 'intentional_demo_error' apps/api/src/index.js
require_grep 'check_json_endpoint "health"' scripts/smoke-test.sh
require_grep 'check_json_endpoint "slow-clamped"' scripts/smoke-test.sh
require_grep 'check_json_endpoint "error"' scripts/smoke-test.sh
require_grep 'check_json_endpoint "fallback"' scripts/smoke-test.sh
require_grep 'check_json_endpoint "status"' scripts/smoke-test.sh
require_grep 'GRAFANA_ALERT_API_PATH = "/api/grafana-alert"' apps/api/src/index.js
require_grep 'handleGrafanaAlertWebhook' apps/api/src/index.js
require_grep 'GRAFANA_WEBHOOK_SECRET_HEADER' apps/api/src/index.js
require_grep 'GRAFANA_DEDUPE_LABEL' apps/api/src/index.js
require_grep 'buildGrafanaDedupeKey' apps/api/src/index.js
require_grep 'findOpenGrafanaIssue' apps/api/src/index.js
require_grep 'commentOnGitHubIssue' apps/api/src/index.js
require_grep 'createGitHubIssue' apps/api/src/index.js
require_grep 'Content-Type must be application/json' apps/api/src/index.js
require_grep 'Invalid webhook secret' apps/api/src/index.js

# Historical service guardrails.
require_grep 'AI Moving Assistant' docs/services.md
require_grep 'historical implementation asset' docs/services.md
require_grep 'AWS Cost Simulator' docs/services.md
require_grep 'removed historical service' docs/services.md
require_grep 'Digital Product LP Starter Kit' docs/services.md
require_grep 'stopped / not planned' docs/services.md
reject_grep 'aws-cost-simulator.html' apps/landing/index.html

# General AI-assisted operations guardrails.
require_grep 'Manual work: 5-10%' docs/ai-organization-operating-model.md
require_grep 'Non-trivial work' docs/automation-first-working-policy.md
require_grep 'Codex Workflow' docs/codex-workflow.md
require_grep 'Completion Reports' AGENTS.md

node --check apps/api/src/index.js

echo "PR validation passed"
