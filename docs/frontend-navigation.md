# Frontend Navigation and Dedicated Service Pages

This document defines the frontend navigation design for SRE Lab.

## Current Status

```text
Stopped at Phase 16 v1 checkpoint
```

The frontend currently focuses on one active service: AI Moving Assistant.

AWS Cost Simulator was removed from the active service portfolio.

## Purpose

SRE Lab is a portfolio and operations lab for small consumer AI services.

The frontend should not mix unrelated service forms on a single page.

Instead, the frontend should provide a clear service navigation structure and dedicated pages for active services.

## Design Principle

One service should have one dedicated page.

The top page should work as the SRE Lab entry point and service directory.

## Current Page Structure

Current active page structure:

- index.html: SRE Lab top page and focused entry point
- moving-assistant.html: AI Moving Assistant dedicated page
- moving-checklist-sample.html: free moving checklist sample page

Removed page:

- aws-cost-simulator.html

## Page Roles

| Page | Role |
|---|---|
| index.html | SRE Lab top page and focused entry point |
| moving-assistant.html | AI Moving Assistant dedicated UI |
| moving-checklist-sample.html | Free moving checklist sample / first lightweight conversion point |

## Avoided Design

The following design should be avoided:

- One page containing multiple unrelated service forms
- Re-adding AWS Cost Simulator to the active navigation
- Adding future unrelated service forms before a clear decision

Reason:

- The page becomes confusing
- The site theme becomes unclear
- SEO intent becomes mixed
- Monitoring and service ownership become harder to explain
- Future services become difficult to add cleanly

## Top Page Design

The top page should explain SRE Lab and route users to the active service.

Current top page components:

- SRE Lab project summary
- Short explanation of the operations-focused portfolio
- Service card for AI Moving Assistant
- Future service candidate section only as context if needed
- Links to documentation or GitHub if appropriate

## Dedicated Service Page Design

Each service page should contain only one service's UI.

Common elements:

- Back link to SRE Lab top page
- Service title
- Service description
- Input form
- Result area
- Safety or disclaimer note
- CTA area when relevant
- Operational status note if useful

## Current File Structure

```text
apps/landing/index.html
apps/landing/moving-assistant.html
apps/landing/moving-checklist-sample.html
apps/landing/styles.css
```

A future refactor may split JavaScript by service if inline script becomes too large.

## API Routing

Each frontend page should call its own API endpoint.

| Service | Frontend Page | API Endpoint |
|---|---|---|
| AI Moving Assistant | moving-assistant.html | POST /api/moving-assistant |

Removed API endpoint:

```text
POST /api/aws-cost-simulator
```

## Monitoring Implication

Dedicated pages make service monitoring easier.

Current / recommended checks:

| Target | Purpose |
|---|---|
| / | SRE Lab top page availability |
| /moving-assistant.html | AI Moving Assistant page availability |
| /moving-checklist-sample.html | Free sample page availability if needed |
| POST /api/moving-assistant | AI Moving Assistant API availability |

## SEO and Portfolio Implication

Dedicated pages allow each service to have a clear purpose.

- AI Moving Assistant targets moving preparation use cases
- Free sample page supports checklist-oriented intent
- SRE Lab top page explains the overall operations portfolio

This is better than mixing unrelated forms on one page.

## Current Decision

- Keep AI Moving Assistant as the only active service page
- Keep the free sample page as a lightweight conversion point
- Do not re-add AWS Cost Simulator to the active frontend
- Do not add new SRE Lab frontend features for now
- Do not start Phase 17 until a real revenue route exists

## Success Criteria

This navigation setup is successful when:

- Frontend navigation is focused
- Active service page is clear
- Free sample page is accessible
- Removed services are not shown as active navigation targets
- The next active learning focus can move to Kubernetes / CKA preparation without further frontend expansion
