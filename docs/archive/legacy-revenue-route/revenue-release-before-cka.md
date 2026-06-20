# Revenue Release Before CKA Policy

> Historical archive note: this policy is obsolete.
>
> SRE Lab has moved to SRE portfolio-first and the construction phase is complete. The revenue-first / Moving Assistant monetization route is stopped unless the management-side `status.md` explicitly reactivates it.

## Original Purpose

SRE Lab should complete the first AI Moving Assistant revenue release before Kubernetes / CKA becomes the main learning focus.

After that revenue release, SRE Lab should move into maintenance-only operation during the CKA learning period.

## Historical Direction

```text
Phase 16 v1 checkpoint: complete
First revenue release: planned before CKA
Customer-facing service release: planned before CKA
Revenue content/link: planned before CKA
CKA learning: starts after revenue release preparation is complete
SRE Lab during CKA: maintenance-only
```

## Current Treatment

```text
Status: archived / historical
Current active direction: SRE portfolio-first
Current active service: Reliability Demo API
Construction phase: completed
Current phase: normal weekly/monthly operation
```

Do not use this file as active guidance.

## Historical Target State at CKA Start

When Kubernetes / CKA learning starts, SRE Lab should already be in the following state:

```text
AI Moving Assistant is publicly available for customer use
A free sample is publicly available
A revenue content page, paid content page, or affiliate/revenue link is publicly available
The active site has a visible route from the free/service experience to the revenue route
If user traffic arrives and converts, revenue can be generated
SRE Lab is operated as a live customer-facing service with monitoring
```

## Why This Policy Existed

The project should not remain in an unfinished monetization-validation state while the main learning focus moves to Kubernetes / CKA.

A small first revenue route was considered enough. The goal was not to build a large business before CKA. The goal was to release one simple monetization path, verify that the public service could support it, and then stop feature expansion.

## Allowed First Revenue Routes

The first revenue release would have used one small route:

- Moving checklist PDF / template
- Moving preparation checklist product page
- Simple paid report or downloadable template
- Affiliate link for moving supplies or related services, only if it did not require large feature expansion

## Not Required Before CKA

The following were not required before CKA:

- Full payment system inside SRE Lab
- User accounts
- Email collection
- Complex analytics pipeline
- New consumer AI service
- Large SEO/content expansion
- Guaranteed traffic or guaranteed sales
- Paid advertising campaign

## Completion Criteria

The revenue release would have been complete when:

- AI Moving Assistant is publicly available as a customer-facing service
- A free sample page or free service experience is publicly available
- One simple revenue route is publicly linked from AI Moving Assistant or the free sample page
- The user can understand what is free and what is paid
- The paid/download/affiliate destination works outside the main app if needed
- If user traffic arrives and converts, revenue can be generated
- Grafana monitoring for active services is healthy
- AWS Cost Simulator remains removed from active monitoring and navigation
- Revenue / Cost Dashboard has an initial release entry
- A release record is created under `docs/incidents/` or a dedicated release note

## Maintenance-Only Mode During CKA

After the revenue release, SRE Lab would avoid new feature development during Kubernetes / CKA learning.
