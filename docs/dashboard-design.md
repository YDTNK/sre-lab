# Usage / Cost Dashboard Design

This document defines the current docs-based dashboard policy and future implementation-backed dashboard design for SRE Lab usage, cost, and revenue monitoring.

## Current Status

```text
Stopped at Phase 16 v1 checkpoint
```

The implementation-backed dashboard is not implemented yet.

Current dashboard operation is docs-based in the management repository:

```text
YDTNK/engineering-career-hq
projects/sre-lab/revenue-cost-dashboard.md
```

## Purpose

The current docs-based dashboard keeps revenue, cost, and gross profit visible during the Phase 16 stop checkpoint.

The purpose of a future implementation-backed dashboard would be to make SRE Lab usage, AI API usage, estimated cost, revenue, gross profit, and cost-control behavior visible without manually checking Cloudflare KV every time.

The dashboard should support future multi-service operations only when SRE Lab resumes beyond the current checkpoint.

## Current State

Current revenue / cost monitoring is docs-based and manual.

| Area | Current State |
|---|---|
| Revenue / cost dashboard | engineering-career-hq docs-based dashboard |
| Usage counters | Cloudflare KV design / optional operational reference |
| Manual reports | docs/usage-cost-report.md and management dashboard |
| Cost policy | docs/cost.md |
| Operational records | docs/incidents.md |

Current baseline:

```text
Revenue: 0 JPY
Payment flow: not implemented
Affiliate flow: not implemented
PDF / template sale: not implemented
Free sample CTA: implemented
Phase 17: not started
```

## Current Decision

Do not implement a public or internal application dashboard now.

Policy:

```text
Docs-based Revenue / Cost Dashboard
↓
Workers / KV / Analytics integration only when needed
↓
Phase 17 First Revenue Validation after a real revenue route exists
```

## Upgrade Conditions

Move from docs-based tracking to implementation-backed tracking only when one of these becomes true:

- PDF sample CTA clicks become meaningful enough to measure regularly
- PDF download flow is added
- Paid template / affiliate / payment flow is added
- Manual recording becomes too slow or unreliable
- Channel comparison becomes necessary
- Cost / usage monitoring needs automation

## Target State

The future target state is a lightweight dashboard that can show:

- Revenue
- Cost
- Gross profit
- API requests
- API success count
- API error count
- Rate limited count
- AI calls if real AI API is enabled again
- AI success count if real AI API is enabled again
- AI error count if real AI API is enabled again
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
| Revenue | revenue_jpy | Management dashboard / future payment or affiliate data |
| Cost | cost_jpy | Management dashboard / future KV or D1 |
| Profit | gross_profit_jpy | Derived |
| Conversion | free_sample_page_visits | Manual, Cloudflare, or future tracking |
| Conversion | pdf_sample_cta_clicks | Manual or future tracking |
| API usage | api_requests | Cloudflare KV or future D1 |
| API usage | api_success | Cloudflare KV or future D1 |
| API reliability | api_errors | Cloudflare KV or future D1 |
| Rate limiting | rate_limited | Cloudflare KV or future D1 |
| AI usage | ai_calls | Cloudflare KV or future D1 |
| AI reliability | ai_success | Cloudflare KV or future D1 |
| AI reliability | ai_errors | Cloudflare KV or future D1 |
| Cost | estimated_daily_jpy | Cloudflare KV or future D1 |
| Cost | estimated_monthly_jpy | Cloudflare KV or future D1 |

## Derived Metrics

| Metric | Formula | Purpose |
|---|---|---|
| Gross profit | revenue_jpy - cost_jpy | Business viability |
| API success rate | api_success / api_requests | Basic service reliability |
| API error rate | api_errors / api_requests | Error trend detection |
| AI success rate | ai_success / ai_calls | AI reliability if AI API is active |
| Monthly cost usage ratio | estimated_monthly_jpy / monthly_budget_jpy | Cost threshold monitoring |
| Conversion rate | pdf_sample_cta_clicks / visits | Demand validation |

## Initial Dashboard Layout

A simple dashboard is enough for the first implementation-backed version.

### Section 1: Service Summary

- Service name
- Current phase
- Frontend URL
- API URL
- Current monitoring status
- Current revenue status
- Current cost status

### Section 2: Revenue / Cost

- revenue_jpy
- cost_jpy
- gross_profit_jpy
- monthly budget
- notes

### Section 3: Usage

- API requests
- API success
- API errors
- rate_limited

### Section 4: Conversion

- free_sample_page_visits
- pdf_sample_cta_clicks
- future PDF downloads / purchases

### Section 5: Operational Notes

- Recent operational records
- Known limitations
- Follow-up actions

## Data Storage Options

### Option A: Docs-based Markdown Dashboard

Pros:

- Very simple
- Portfolio-friendly
- Git history works as audit trail
- No additional cost

Cons:

- Manual
- Not interactive
- Not scalable

Best for:

- Current Phase 16 stop checkpoint
- Pre-revenue operation
- Low-cost portfolio management

### Option B: Continue with Cloudflare KV

Pros:

- Already available from previous rate limiting / usage design
- Simple
- Low cost
- Good enough for small traffic

Cons:

- Not ideal for historical queries
- Not relational
- Harder to aggregate by arbitrary date ranges

Best for:

- When usage or CTA tracking becomes worth measuring regularly

### Option C: Cloudflare D1

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
- Usage, cost, and revenue dashboard
- Monthly reporting

## Recommended Path

The recommended path is staged.

| Stage | Approach | Status |
|---|---|---|
| Stage 1 | Docs-based Revenue / Cost Dashboard | Current |
| Stage 2 | KV + manual snapshot | Future if usage tracking becomes useful |
| Stage 3 | KV + generated Markdown report | Future |
| Stage 4 | D1 daily summary table | Future |
| Stage 5 | Lightweight dashboard page | Future |
| Stage 6 | Multi-service dashboard | Future |

## Future D1 Schema Draft

A future D1 table may look like this:

```sql
CREATE TABLE usage_cost_daily_summary (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  service_name TEXT NOT NULL,
  date_utc TEXT NOT NULL,
  revenue_jpy REAL NOT NULL DEFAULT 0,
  cost_jpy REAL NOT NULL DEFAULT 0,
  gross_profit_jpy REAL NOT NULL DEFAULT 0,
  api_requests INTEGER NOT NULL DEFAULT 0,
  api_success INTEGER NOT NULL DEFAULT 0,
  api_errors INTEGER NOT NULL DEFAULT 0,
  rate_limited INTEGER NOT NULL DEFAULT 0,
  ai_calls INTEGER NOT NULL DEFAULT 0,
  ai_success INTEGER NOT NULL DEFAULT 0,
  ai_errors INTEGER NOT NULL DEFAULT 0,
  input_tokens INTEGER NOT NULL DEFAULT 0,
  output_tokens INTEGER NOT NULL DEFAULT 0,
  estimated_cost_jpy REAL NOT NULL DEFAULT 0,
  free_sample_page_visits INTEGER NOT NULL DEFAULT 0,
  pdf_sample_cta_clicks INTEGER NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL
);
```

Suggested unique key:

- service_name + date_utc

## Future Dashboard Implementation Options

| Option | Description | Fit |
|---|---|---|
| Markdown dashboard | Manual docs-based dashboard | Current best fit |
| Static admin page | Simple frontend reads summary JSON | Good first dashboard if resumed |
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

The future dashboard design is successful when it can answer:

- How much revenue happened this month?
- How much cost happened this month?
- What is the gross profit?
- How many API requests happened today?
- How often did limits trigger?
- What is the estimated daily cost?
- What is the estimated monthly cost?
- Are we close to the monthly budget?
- Which service is using the most cost?

## Current Next

- Keep using the management repository docs-based dashboard
- Do not implement Workers / KV / Analytics dashboard yet
- Do not start Phase 17 until a real revenue route exists
- Move active learning focus to Kubernetes / CKA preparation
