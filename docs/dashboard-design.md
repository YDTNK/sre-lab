# Usage / Cost Dashboard Design

This document defines the future dashboard design for SRE Lab usage and cost monitoring.

The dashboard is not implemented yet. This document describes the target design, metrics, data sources, and staged implementation plan.

## Purpose

The purpose of the future dashboard is to make SRE Lab usage, AI API usage, estimated cost, and cost-control behavior visible without manually checking Cloudflare KV every time.

The dashboard should support future multi-service operations.

## Current State

Current usage and cost monitoring is manual.

| Area | Current State |
|---|---|
| Usage counters | Cloudflare KV |
| Estimated token counters | Cloudflare KV |
| Estimated cost counters | Cloudflare KV |
| Manual reports | docs/usage-cost-report.md |
| Cost policy | docs/cost.md |
| Operational records | docs/incidents.md |

## Target State

The target state is a lightweight dashboard that shows:

- API requests
- API success count
- API error count
- Rate limited count
- AI calls
- AI success count
- AI error count
- AI limited count
- Estimated input tokens
- Estimated output tokens
- Estimated daily cost
- Estimated monthly cost
- Cost threshold status
- Service health summary

## Dashboard Users

Initial users:

- Project owner
- Portfolio reviewer
- Future SRE Lab operator

The dashboard is not intended for end users at the initial stage.

## Primary Metrics

| Category | Metric | Source |
|---|---|---|
| API usage | api_requests | Cloudflare KV or future D1 |
| API usage | api_success | Cloudflare KV or future D1 |
| API reliability | api_errors | Cloudflare KV or future D1 |
| Rate limiting | rate_limited | Cloudflare KV or future D1 |
| AI usage | ai_calls | Cloudflare KV or future D1 |
| AI reliability | ai_success | Cloudflare KV or future D1 |
| AI reliability | ai_errors | Cloudflare KV or future D1 |
| AI protection | ai_limited | Cloudflare KV or future D1 |
| Cost | input_tokens | Cloudflare KV or future D1 |
| Cost | output_tokens | Cloudflare KV or future D1 |
| Cost | estimated_daily_jpy | Cloudflare KV or future D1 |
| Cost | estimated_monthly_jpy | Cloudflare KV or future D1 |

## Derived Metrics

| Metric | Formula | Purpose |
|---|---|---|
| API success rate | api_success / api_requests | Basic service reliability |
| API error rate | api_errors / api_requests | Error trend detection |
| AI success rate | ai_success / ai_calls | AI reliability |
| AI fallback rate | ai_errors / ai_calls | AI provider or validation issue detection |
| AI limit rate | ai_limited / api_requests | Abuse or limit pressure detection |
| Monthly cost usage ratio | estimated_monthly_jpy / monthly_budget_jpy | Cost threshold monitoring |

## Initial Dashboard Layout

A simple dashboard is enough for the first version.

### Section 1: Service Summary

- Service name
- Current phase
- Frontend URL
- API URL
- Current monitoring status
- Current cost status

### Section 2: Usage

- API requests
- API success
- API errors
- rate_limited

### Section 3: AI Usage

- ai_calls
- ai_success
- ai_errors
- ai_limited
- AI success rate

### Section 4: Cost

- estimated_daily_jpy
- estimated_monthly_jpy
- monthly budget
- warning threshold
- stop threshold
- cost usage ratio

### Section 5: Operational Notes

- Recent operational records
- Known limitations
- Follow-up actions

## Data Storage Options

### Option A: Continue with Cloudflare KV

Pros:

- Already implemented
- Simple
- Low cost
- Good enough for small traffic

Cons:

- Not ideal for historical queries
- Not relational
- Harder to aggregate by arbitrary date ranges

Best for:

- Current early-stage operation
- Manual snapshot
- Small service count

### Option B: Cloudflare D1

Pros:

- Better for historical reporting
- SQL queries
- Easier dashboard integration
- Better multi-service support

Cons:

- More implementation work
- Requires schema design
- Requires migration from KV-based counters or dual-write

Best for:

- Multi-service SRE Lab
- Usage and cost dashboard
- Monthly reporting

### Option C: Static Markdown Report

Pros:

- Very simple
- Portfolio-friendly
- Git history works as audit trail

Cons:

- Manual
- Not interactive
- Not scalable

Best for:

- Current Phase 7 manual operation
- Early documentation

## Recommended Path

The recommended path is staged.

| Stage | Approach | Status |
|---|---|---|
| Stage 1 | KV + manual snapshot | Current |
| Stage 2 | KV + generated Markdown report | Future |
| Stage 3 | D1 daily summary table | Future |
| Stage 4 | Lightweight dashboard page | Future |
| Stage 5 | Multi-service dashboard | Future |

## Future D1 Schema Draft

A future D1 table may look like this:

```sql
CREATE TABLE usage_cost_daily_summary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_name TEXT NOT NULL,
  date_utc TEXT NOT NULL,
  api_requests INTEGER NOT NULL DEFAULT 0,
  api_success INTEGER NOT NULL DEFAULT 0,
  api_errors INTEGER NOT NULL DEFAULT 0,
  rate_limited INTEGER NOT NULL DEFAULT 0,
  ai_calls INTEGER NOT NULL DEFAULT 0,
  ai_success INTEGER NOT NULL DEFAULT 0,
  ai_errors INTEGER NOT NULL DEFAULT 0,
  ai_limited INTEGER NOT NULL DEFAULT 0,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  estimated_cost_jpy REAL NOT NULL DEFAULT 0,
  openai_requests INTEGER,
  openai_tokens INTEGER,
  openai_cost_usd REAL,
  notes TEXT,
  created_at TEXT NOT NULL
);
```

Suggested unique key:

- service_name + date_utc

## Future Dashboard Implementation Options

| Option | Description | Fit |
|---|---|---|
| Static admin page | Simple frontend reads summary JSON | Good first dashboard |
| Cloudflare Pages + D1 API | Dashboard reads from Workers API | Good for multi-service |
| Grafana dashboard | Use metrics/logs or exported data | Good later |
| GitHub Actions report | Scheduled report commits Markdown | Good low-cost option |

## Security and Access Policy

Initial dashboard should not expose sensitive operational details publicly.

Rules:

- Do not expose API keys
- Do not expose raw user input
- Do not expose client IP addresses
- Aggregate by day and service
- Keep admin-only dashboard private or omit sensitive fields

## Success Criteria

The dashboard design is successful when it can answer:

- How many API requests happened today?
- How many AI calls happened today?
- How many AI calls succeeded?
- How many AI calls failed?
- How often did limits trigger?
- What is the estimated daily cost?
- What is the estimated monthly cost?
- Are we close to the monthly budget?
- Which service is using the most AI cost?

## Follow-up Actions

- Continue manual usage and cost snapshots
- Compare Cloudflare KV estimated cost with OpenAI Platform usage
- Decide whether KV remains enough for Phase 7
- Add generated Markdown report if manual reporting becomes repetitive
- Consider D1 before adding a second or third service
- Defer public dashboard until there is enough usage data

