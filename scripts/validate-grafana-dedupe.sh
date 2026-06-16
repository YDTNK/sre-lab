#!/usr/bin/env bash
set -euo pipefail

WORKER_URL="${WORKER_URL:-https://sre-lab-api.daisan-tanaka.workers.dev/api/grafana-alert}"
SECRET="${GRAFANA_WEBHOOK_SECRET:-}"

if [ -z "$SECRET" ]; then
  echo "GRAFANA_WEBHOOK_SECRET is required" >&2
  exit 1
fi

payload='{
  "receiver": "github-actions-dedupe-validation",
  "status": "firing",
  "groupKey": "github-actions-dedupe-validation",
  "externalURL": "https://github.com/YDTNK/sre-lab/actions",
  "commonLabels": {
    "alertname": "github-actions-dedupe-validation",
    "service_name": "sre-lab-api",
    "severity": "test"
  },
  "commonAnnotations": {
    "summary": "GitHub Actions dedupe validation test"
  },
  "alerts": [
    {
      "status": "firing",
      "labels": {
        "alertname": "github-actions-dedupe-validation",
        "service_name": "sre-lab-api",
        "severity": "test"
      },
      "annotations": {
        "summary": "GitHub Actions dedupe validation test"
      },
      "startsAt": "2026-06-16T00:00:00Z",
      "generatorURL": "https://github.com/YDTNK/sre-lab/actions"
    }
  ]
}'

first_response_file="$(mktemp)"
second_response_file="$(mktemp)"

first_status="$(curl -sS -o "$first_response_file" -w "%{http_code}" \
  -X POST "$WORKER_URL" \
  -H "Content-Type: application/json" \
  -H "X-Grafana-Webhook-Secret: $SECRET" \
  -d "$payload")"

second_status="$(curl -sS -o "$second_response_file" -w "%{http_code}" \
  -X POST "$WORKER_URL" \
  -H "Content-Type: application/json" \
  -H "X-Grafana-Webhook-Secret: $SECRET" \
  -d "$payload")"

node - "$first_status" "$second_status" "$first_response_file" "$second_response_file" <<'NODE'
const fs = require("node:fs");

const [firstStatus, secondStatus, firstFile, secondFile] = process.argv.slice(2);
const first = JSON.parse(fs.readFileSync(firstFile, "utf8"));
const second = JSON.parse(fs.readFileSync(secondFile, "utf8"));

function fail(message) {
  console.error(message);
  console.error("first status:", firstStatus);
  console.error("first response:", first);
  console.error("second status:", secondStatus);
  console.error("second response:", second);
  process.exit(1);
}

if (!first.ok) {
  fail("First Grafana test notification did not return ok=true");
}

if (!second.ok) {
  fail("Second Grafana test notification did not return ok=true");
}

if (!first.issueNumber || !second.issueNumber) {
  fail("Both responses must include issueNumber");
}

if (first.issueNumber !== second.issueNumber) {
  fail("Second notification did not reuse the first Issue");
}

if (second.deduped !== true) {
  fail("Second notification did not report deduped=true");
}

if (secondStatus !== "200") {
  fail("Second notification should return HTTP 200 for deduped update");
}

console.log("Grafana dedupe validation passed");
console.log(`issueNumber=${second.issueNumber}`);
console.log(`issueUrl=${second.issueUrl}`);
NODE
