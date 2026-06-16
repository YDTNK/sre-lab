# Revenue Release Before CKA Policy

## Purpose

SRE Lab should complete the first AI Moving Assistant revenue release before Kubernetes / CKA becomes the main learning focus.

After that revenue release, SRE Lab should move into maintenance-only operation during the CKA learning period.

## Current Direction

```text
Phase 16 v1 checkpoint: complete
First revenue release: planned before CKA
CKA learning: starts after revenue release preparation is complete
SRE Lab during CKA: maintenance-only
```

## Why This Policy Exists

The project should not remain in an unfinished monetization-validation state while the main learning focus moves to Kubernetes / CKA.

A small first revenue route is enough. The goal is not to build a large business before CKA. The goal is to release one simple monetization path, verify that the public service can support it, and then stop feature expansion.

## Allowed First Revenue Routes

The first revenue release should use one small route:

- Moving checklist PDF / template
- Moving preparation checklist product page
- Simple paid report or downloadable template
- Affiliate link for moving supplies or related services, only if it does not require large feature expansion

## Not Required Before CKA

The following are not required before CKA:

- Full payment system inside SRE Lab
- User accounts
- Email collection
- Complex analytics pipeline
- New consumer AI service
- Large SEO/content expansion

## Completion Criteria

The revenue release is complete when:

- One simple revenue route is publicly linked from AI Moving Assistant or the free sample page
- The user can understand what is free and what is paid
- The paid/download/affiliate destination works outside the main app if needed
- Grafana monitoring for active services is healthy
- AWS Cost Simulator remains removed from active monitoring and navigation
- Revenue / Cost Dashboard has an initial release entry
- A release record is created under `docs/incidents/` or a dedicated release note

## Maintenance-Only Mode During CKA

After the revenue release, SRE Lab should avoid new feature development during Kubernetes / CKA learning.

Allowed work:

- Monitoring checks
- Incident response
- Security or dependency fixes
- Small copy fixes
- Revenue / cost record updates
- Broken link fixes
- Grafana alert maintenance

Not allowed by default:

- New consumer AI services
- Major UI redesign
- New payment system expansion
- New data pipeline implementation
- Reintroducing AWS Cost Simulator as an active service

## Relationship to Future Services

Future Consumer AI Service Ideas should be evaluated only after:

1. AI Moving Assistant revenue release is complete
2. Kubernetes / CKA learning is not delayed
3. There is a clear reason to resume SRE Lab feature development
