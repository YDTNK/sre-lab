# SRE Lab Cost Guardrails

This document defines the current cost management policy for SRE Lab as an SRE / Platform Engineering portfolio.

## Current Scope

```text
Current service: Reliability Demo API
Current phase: Portfolio evidence loop completed
Current active target: Final full-site QA and optional polish
Paid AI API usage: not active
Revenue route: stopped / historical
```

The current cost focus is not monetization or paid AI expansion.

The current cost focus is:

```text
- keep the public portfolio low-cost
- avoid runaway usage
- document guardrail decisions clearly
- separate implemented controls from future work
- show cost-aware operations as SRE portfolio evidence
```

## Current Cost Assumptions

| Area | Current assumption |
|---|---|
| GitHub | Free tier for current repo usage |
| Cloudflare Pages | Free or low-cost at current traffic |
| Cloudflare Workers | Free or low-cost at current traffic |
| Grafana Cloud | Free tier / low usage monitoring |
| Paid AI API | Not active in the current Reliability Demo API path |
| Payment provider | Not active |
| Additional fixed SaaS | Not used |

## Guardrail Policy

SRE Lab should avoid adding fixed monthly costs unless the benefit is clearly tied to portfolio evidence.

Allowed low-cost portfolio value:

```text
- public static portfolio site
- small Workers API
- synthetic monitoring
- GitHub Actions validation
- documentation-backed SLO / runbook / incident evidence
```

Avoid by default:

```text
- paid ads
- paid analytics SaaS
- paid AI calls as the default path
- unnecessary always-on infrastructure
- payment/revenue tooling unless the project direction explicitly changes
```

## Cost Guardrail Concepts

The public cost page demonstrates these concepts:

```text
- request volume awareness
- compute time awareness
- external dependency awareness
- rate limit policy
- usage counter policy
- budget threshold policy
- cost incident response flow
```

Public page:

```text
/cost.html
```

## Implemented vs Future Work

### Implemented evidence

```text
- Cost Guardrail public portfolio page
- Cost response flow documentation
- Budget threshold example policy
- Cost incident scenario
- Future implementation list clearly labeled as future work
```

### Future work

```text
- route-level rate limiting for Reliability Demo API
- usage counter storage for Reliability Demo API
- automated cost threshold alerting
- dedicated cost runbook
- cost incident game-day record
```

Do not describe future work as already implemented runtime behavior.

## Initial Budget Threshold Example

The public cost page uses a general threshold policy:

| Threshold | Meaning | Example response |
|---:|---|---|
| 50% | Early notice | Review recent changes and usage trend |
| 80% | Action required | Consider rate limits or reduce heavy operations |
| 100% | Containment | Temporarily restrict non-critical behavior and investigate |

These thresholds are portfolio examples unless a future implementation wires them to actual runtime counters.

## External API Policy

Paid external APIs should remain disabled by default.

If a paid external API is introduced later, the work must include:

```text
- explicit Issue
- cost estimate
- budget threshold
- rate limit
- failure / fallback policy
- runbook update
- monitoring update
- validation evidence
```

## Current Source of Truth

For current project state and requirements, use:

```text
README.md
docs/services.md
docs/cost.md
docs/runbooks/reliability-demo-api.md
management-side status.md
management-side portfolio-requirements.md
```

Historical revenue or AI cost tracking documents under archive paths are not current sources of truth.
