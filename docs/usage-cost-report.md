# Usage / Cost Report

This document records manual usage and cost snapshots for SRE Lab.

The current target service is AI Moving Assistant.

## Purpose

The purpose of this report is to track API usage, estimated cost, and cost-control behavior when manual snapshots are needed.

Current Phase 16 status:

```text
Revenue: 0 JPY
Payment flow: not implemented
Affiliate flow: not implemented
PDF / template sale: not implemented
Free sample CTA: implemented
Phase 17: not started
```

## Current Tracking Source

| Metric Type | Source |
|---|---|
| API usage | Cloudflare KV |
| AI usage | Cloudflare KV, only if AI calls are intentionally enabled |
| Estimated token usage | Cloudflare KV, only if AI calls are intentionally enabled |
| Estimated cost | Cloudflare KV or docs-based dashboard |
| Actual OpenAI usage | OpenAI Platform, only when reconciling paid AI usage |

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

Historical snapshot from the earlier real AI API verification period. It is retained for audit context and does not describe the current Phase 16 production path.

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

## OpenAI Usage Recheck Notes

Cloudflare KV is used as the primary operational source for immediate usage and estimated cost monitoring.

OpenAI Platform Usage is used as a secondary reconciliation source.

If OpenAI Platform Usage shows 0 requests, 0 tokens, and $0.00 while Cloudflare KV records AI usage, record the mismatch and recheck later.

Possible causes:

- OpenAI Usage reporting delay
- Project or group filter mismatch
- API key project mismatch
- Usage aggregation timing
- Very small spend rounded to $0.00

The first snapshot on 2026-06-14 recorded this mismatch and should be rechecked later.
