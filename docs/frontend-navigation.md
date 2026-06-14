# Frontend Navigation and Dedicated Service Pages

This document defines the frontend navigation design for SRE Lab after adding a second service.

## Purpose

SRE Lab is a portfolio and operations lab for multiple small AI/SRE-related services.

The frontend should not mix unrelated service forms on a single page.

Instead, the frontend should provide a clear service navigation structure and dedicated pages for each service.

## Design Principle

One service should have one dedicated page.

The top page should work as the SRE Lab entry point and service directory.

## Avoided Design

The following design should be avoided:

- One page containing AI Moving Assistant form
- The same page also containing AWS Cost Simulator form
- Future unrelated service forms added to the same page

Reason:

- The page becomes confusing
- The site theme becomes unclear
- SEO intent becomes mixed
- Monitoring and service ownership become harder to explain
- Future services become difficult to add cleanly

## Recommended Design

Recommended initial page structure:

- index.html: SRE Lab overview and service cards
- moving-assistant.html: AI Moving Assistant dedicated page
- aws-cost-simulator.html: AWS Cost Simulator dedicated page

## Page Roles

| Page | Role |
|---|---|
| index.html | SRE Lab top page and service directory |
| moving-assistant.html | AI Moving Assistant dedicated UI |
| aws-cost-simulator.html | AWS Cost Simulator dedicated UI |

## Top Page Design

The top page should explain SRE Lab and list available services.

Initial top page components:

- SRE Lab project summary
- Short explanation of the operations-focused portfolio
- Service card for AI Moving Assistant
- Service card for AWS Cost Simulator
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
- Operational status note if useful

## Initial File Structure

For the current static frontend, the recommended initial file structure is:

- apps/frontend/index.html
- apps/frontend/moving-assistant.html
- apps/frontend/aws-cost-simulator.html
- apps/frontend/style.css
- apps/frontend/script.js

This keeps the implementation easy while separating each service page.

A future refactor may split JavaScript by service if script.js becomes too large.

## API Routing

Each frontend page should call its own API endpoint.

| Service | Frontend Page | API Endpoint |
|---|---|---|
| AI Moving Assistant | moving-assistant.html | POST /api/moving-assistant |
| AWS Cost Simulator | aws-cost-simulator.html | POST /api/aws-cost-simulator |

## Monitoring Implication

Dedicated pages make service monitoring easier.

Recommended future checks:

| Target | Purpose |
|---|---|
| / | SRE Lab top page availability |
| /moving-assistant.html | AI Moving Assistant page availability |
| /aws-cost-simulator.html | AWS Cost Simulator page availability |
| POST /api/moving-assistant | AI Moving Assistant API availability |
| POST /api/aws-cost-simulator | AWS Cost Simulator API availability |

## SEO and Portfolio Implication

Dedicated pages allow each service to have a clear purpose.

- AI Moving Assistant can target moving preparation use cases
- AWS Cost Simulator can target AWS cost learning and FinOps use cases
- SRE Lab top page can explain the overall operations portfolio

This is better than mixing unrelated forms on one page.

## Phase 8-2 Decision

The Phase 8-2 decision is:

- Do not mix AI Moving Assistant and AWS Cost Simulator forms on one page
- Use the top page as a service directory
- Move or keep AI Moving Assistant as a dedicated service page
- Add AWS Cost Simulator as a dedicated service page
- Keep the first implementation simple with static HTML pages

## Success Criteria

Phase 8-2 is successful when:

- Frontend navigation policy is documented
- Dedicated service page policy is documented
- File structure is documented
- API routing per service is documented
- Monitoring implications are documented
- The next implementation step can proceed without mixing unrelated services
