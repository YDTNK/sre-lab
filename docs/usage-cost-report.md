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

- api_requests: TBD
- api_success: TBD
- api_errors: TBD
- rate_limited: TBD

AI usage:

- ai_calls: TBD
- ai_success: TBD
- ai_errors: TBD
- ai_limited: TBD

Estimated cost:

- input_tokens: TBD
- output_tokens: TBD
- estimated_daily_jpy: TBD
- estimated_monthly_jpy: TBD

OpenAI Platform:

- usage requests: TBD
- usage tokens: TBD
- usage cost: TBD
- credit balance: 5 USD initial credit configured
- auto recharge: off

Assessment:

- Status: normal
- Notes: Initial report template created after Real AI API Integration completion.
- Action: Fill in values from Cloudflare KV and OpenAI Platform during the next usage/cost check.

