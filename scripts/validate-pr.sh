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

require_file AGENTS.md
require_file README.md
require_file docs/automation-first-working-policy.md
require_file docs/ai-organization-operating-model.md
require_file docs/sre-lab-workflow.md
require_file docs/codex-workflow.md
require_file docs/service-state-checklist.md
require_file docs/services.md
require_file docs/runbook.md
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

require_grep 'MOVING_ASSISTANT_API_PATH = "/api/moving-assistant"' apps/api/src/index.js
require_grep 'GRAFANA_ALERT_API_PATH = "/api/grafana-alert"' apps/api/src/index.js
require_grep 'handleMovingAssistantMock' apps/api/src/index.js
require_grep 'handleGrafanaAlertWebhook' apps/api/src/index.js
require_grep 'GRAFANA_WEBHOOK_SECRET_HEADER' apps/api/src/index.js
require_grep 'GRAFANA_DEDUPE_LABEL' apps/api/src/index.js
require_grep 'buildGrafanaDedupeKey' apps/api/src/index.js
require_grep 'findOpenGrafanaIssue' apps/api/src/index.js
require_grep 'commentOnGitHubIssue' apps/api/src/index.js
require_grep 'createGitHubIssue' apps/api/src/index.js
require_grep 'Content-Type must be application/json' apps/api/src/index.js
require_grep 'Invalid webhook secret' apps/api/src/index.js

require_grep 'moving-assistant.html' apps/landing/index.html
require_grep 'AI引越し診断' apps/landing/index.html
require_grep 'styles.css' apps/landing/index.html
require_grep '<meta name="viewport"' apps/landing/index.html
require_grep '不要な機微情報は入力しないでください' apps/landing/index.html

require_grep 'AWS Cost Simulator' docs/services.md
require_grep 'removed' docs/services.md
reject_grep 'aws-cost-simulator.html' apps/landing/index.html
require_grep 'aws-cost-simulator' scripts/smoke-test.sh

require_grep 'Manual work: 5-10%' docs/ai-organization-operating-model.md
require_grep 'Non-trivial work' docs/automation-first-working-policy.md
require_grep 'Codex Workflow' docs/codex-workflow.md

node --check apps/api/src/index.js

echo "PR validation passed"
