# Usage / Cost Report

This document records manual usage and cost snapshots for SRE Lab.

The current target service is AI Moving Assistant.

## Purpose

The purpose of this report is to track API usage, AI API usage, estimated cost, and cost-control behavior during the early AI rollout phase.

## Current Tracking Source

| Metric Type | Source |
|---|---|
| API usage | Cloudflare KV |
| AI usage | Cloudflare KV |
| Estimated token usage | Cloudflare KV |
| Estimated cost | Cloudflare KV |
| Actual OpenAI usage | OpenAI Platform |

## Snapshot Template

Use this template for daily or weekly checks.

```text
Date:
Service: AI Moving Assistant

API usage:
- api_requests:
- api_success:
- api_errors:
- rate_limited:

AI usage:
- ai_calls:
- ai_success:
- ai_errors:
- ai_limited:

Estimated cost:
- input_tokens:
- output_tokens:
- estimated_daily_jpy:
- estimated_monthly_jpy:

OpenAI Platform:
- usage requests:
- usage tokens:
- usage cost:
- credit balance:
- auto recharge:

Assessment:
- Status: normal / warning / action required
- Notes:
- Action:
```

## Snapshot Records

### 2026-06-14

Service: AI Moving Assistant

API usage:

- api_requests: 26
- api_success: 19
- api_errors: 82
- rate_limited: 3

AI usage:

- ai_calls: 9
- ai_success: 6
- ai_errors: 3
- ai_limited: 3

Estimated cost:

- input_tokens: 108
- output_tokens: 2500
- estimated_daily_jpy: 0.20216
- estimated_monthly_jpy: 0.20216

OpenAI Platform:

- usage requests: 0
- usage tokens: 0
- usage cost: $0.00
- credit balance: $5.00
- auto recharge: off

Assessment:

- Status: normal
- Notes: Initial snapshot recorded after Real AI API Integration, AI cost tracking, AI daily limit, and cost_limit_reached verification. The high api_errors count is expected because API safety, rate limit, AI limit, and cost limit behavior were manually tested on the same day. OpenAI Platform Usage still showed 0 requests / 0 tokens / $0.00 at the time of the snapshot even though the Worker returned aiStatus: generated; this should be rechecked later because it may be caused by reporting delay, project/group filter, or usage aggregation timing.
- Action: Continue daily snapshots during the initial AI rollout and compare Cloudflare KV estimated cost with OpenAI Platform usage.

