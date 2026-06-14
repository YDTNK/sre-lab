# SRE Lab Cost Operations

This document defines the initial cost management policy for SRE Lab.

The current cost focus is the AI Moving Assistant Workers API and OpenAI API usage.

## Cost Policy

SRE Lab is currently in the pre-monetization phase.

The priority is not maximizing AI usage. The priority is preventing unexpected cost growth while maintaining a safe public portfolio service.

## Current Budget

| Item | Value |
|---|---:|
| OpenAI initial credit | 5 USD |
| Auto recharge | Off |
| SRE Lab monthly AI budget | 500 JPY |
| Monthly warning threshold | 300 JPY |
| Monthly stop threshold | 500 JPY |
| Daily hard limit | 100 JPY |

## Current AI Limits

| Limit | Value |
|---|---:|
| Service AI daily limit | 30 requests / day |
| Per-IP AI daily limit | 5 requests / day |
| AI limit response | 429 / ai_limit_reached |
| Retry-After | 86400 seconds |

## Current Cost Tracking Storage

Initial cost tracking is stored in Cloudflare KV.

KV binding:

- RATE_LIMIT_KV

This is acceptable for the early stage because the system is small and already uses KV for rate limiting and usage tracking.

A future version may move historical cost data to Cloudflare D1 or another database if reporting requirements grow.

## Cost KV Keys

Daily estimated input tokens:

- cost:moving-assistant:input_tokens:{yyyyMMdd}

Daily estimated output tokens:

- cost:moving-assistant:output_tokens:{yyyyMMdd}

Daily estimated cost:

- cost:moving-assistant:estimated_jpy:{yyyyMMdd}

Monthly estimated cost:

- cost:moving-assistant:estimated_jpy:{yyyyMM}

## Usage KV Keys

AI call count:

- usage:moving-assistant:ai_calls:{yyyyMMdd}

AI success count:

- usage:moving-assistant:ai_success:{yyyyMMdd}

AI error count:

- usage:moving-assistant:ai_errors:{yyyyMMdd}

AI limit count:

- usage:moving-assistant:ai_limited:{yyyyMMdd}

## Daily Cost Check Commands

Replace the date suffix with the current UTC date.

Example for 2026-06-14:

```bash
cd apps/api

npx wrangler kv key get "usage:moving-assistant:ai_calls:20260614" --binding RATE_LIMIT_KV --remote --text
npx wrangler kv key get "usage:moving-assistant:ai_success:20260614" --binding RATE_LIMIT_KV --remote --text
npx wrangler kv key get "usage:moving-assistant:ai_errors:20260614" --binding RATE_LIMIT_KV --remote --text
npx wrangler kv key get "usage:moving-assistant:ai_limited:20260614" --binding RATE_LIMIT_KV --remote --text

npx wrangler kv key get "cost:moving-assistant:input_tokens:20260614" --binding RATE_LIMIT_KV --remote --text
npx wrangler kv key get "cost:moving-assistant:output_tokens:20260614" --binding RATE_LIMIT_KV --remote --text
npx wrangler kv key get "cost:moving-assistant:estimated_jpy:20260614" --binding RATE_LIMIT_KV --remote --text
npx wrangler kv key get "cost:moving-assistant:estimated_jpy:202606" --binding RATE_LIMIT_KV --remote --text
```

## OpenAI Platform Checks

OpenAI Platform should also be checked because Cloudflare KV cost tracking is an estimate.

Check:

- Usage
- Billing
- Credit balance
- Auto recharge status
- Monthly spend limit

Expected current policy:

- Credit balance is manually topped up
- Auto recharge is off
- OpenAI API usage is reviewed manually during initial rollout

## Cost Limit Behavior

If the estimated monthly cost reaches the stop threshold, the Worker must not call OpenAI API.

Expected response:

```json
{
  "error": {
    "code": "cost_limit_reached",
    "message": "AI diagnosis is temporarily unavailable due to usage limits."
  }
}
```

Expected status:

- 503 Service Unavailable

## AI Limit Behavior

If the service or per-IP AI daily limit is reached, the Worker should return:

```json
{
  "error": {
    "code": "ai_limit_reached",
    "message": "AI diagnosis limit reached. Please try again later."
  }
}
```

Expected status:

- 429 Too Many Requests

Expected header:

- Retry-After: 86400

## Review Cadence

| Stage | Review Cadence |
|---|---|
| Initial AI rollout | Daily |
| Stable low-traffic operation | Weekly |
| Revenue experiment phase | Weekly and monthly |

## Cost Incident Criteria

Create an operational record in docs/incidents.md if any of the following occurs:

- Estimated monthly cost exceeds 300 JPY
- Estimated monthly cost reaches 500 JPY
- OpenAI credit decreases faster than expected
- AI errors spike
- ai_limit_reached appears frequently
- cost_limit_reached appears
- OpenAI API billing or quota errors occur

## Follow-up Improvements

- Compare estimated KV cost with OpenAI Platform usage
- Add cost_limit_reached test case
- Add monthly cost review section to operations.md
- Consider Grafana alerting for cost thresholds
- Consider D1 for historical cost reporting
- Add revenue versus cost tracking after monetization experiments begin\n\n## Usage / Cost Snapshot Procedure\n\nUse this procedure to create a manual daily or weekly snapshot.\n\n1. Check Cloudflare KV usage counters.\n2. Check Cloudflare KV estimated token and cost counters.\n3. Check OpenAI Platform actual usage.\n4. Check OpenAI credit balance.\n5. Confirm auto recharge is off.\n6. Record the result in docs/usage-cost-report.md.\n7. Create an operational record in docs/incidents.md if thresholds are exceeded or abnormal behavior is found.\n\nSnapshot report:\n\n- docs/usage-cost-report.md\n\nRecommended initial cadence:\n\n- Daily during initial AI rollout\n- Weekly after stable low-traffic operation\n\n

## Usage Source of Truth

During the initial AI rollout, Cloudflare KV is treated as the primary source for immediate operational decisions.

OpenAI Platform Usage is treated as a secondary reconciliation source because it may be affected by reporting delay, project or group filters, and usage aggregation timing.

### Primary Operational Source

| Data | Source | Purpose |
|---|---|---|
| API request count | Cloudflare KV | Immediate service usage review |
| AI call count | Cloudflare KV | Immediate AI usage review |
| AI success/error count | Cloudflare KV | Immediate reliability review |
| Estimated input/output tokens | Cloudflare KV | Immediate cost estimation |
| Estimated daily/monthly JPY cost | Cloudflare KV | Immediate cost guard decision |

### Secondary Reconciliation Source

| Data | Source | Purpose |
|---|---|---|
| Actual API requests | OpenAI Platform Usage | Later reconciliation |
| Actual token usage | OpenAI Platform Usage | Later reconciliation |
| Actual spend | OpenAI Platform Usage / Billing | Later reconciliation |
| Credit balance | OpenAI Billing | Budget confirmation |

### Policy

- Do not wait for OpenAI Platform Usage to update before enforcing local cost guards.
- Use Cloudflare KV estimated cost for cost_limit_reached behavior.
- Use OpenAI Platform Usage to compare and adjust the estimate later.
- If OpenAI Usage remains 0 while KV records generated AI responses, check project selection, group filter, API key project, and reporting delay.
- Record any mismatch in docs/usage-cost-report.md.

### Recheck Cadence

| Situation | Recheck Timing |
|---|---|
| Initial AI rollout | Same day and next day |
| OpenAI Usage shows 0 but Worker generated responses | Recheck after several hours or next day |
| Stable operation | Weekly |
| Billing or quota issue | Immediately and after mitigation |

