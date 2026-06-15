# Services

This document describes the service direction for SRE Lab.

## Service Selection Policy

SRE Lab services should meet the following criteria:

- Useful for general users
- Possible to build as a small MVP
- Can be operated with monitoring and alerting
- Can be improved through real user feedback
- Has potential for small monetization experiments
- Does not require continuous manual content posting

---

## Current Primary Service: AI Moving Assistant

### Overview

AI Moving Assistant helps users plan a move by estimating required packing materials, identifying preparation tasks, and generating a simple moving checklist based on user input.

### Target Users

- People planning a move
- People living alone
- People unsure how many boxes or packing materials they need
- People who want a quick checklist before moving

### User Problem

Moving preparation is confusing because users often do not know:

- How many boxes they need
- What packing materials to request
- What tasks they should do before moving day
- What risks they should check in advance

### MVP Features

The current MVP supports:

- User input form
  - Furniture list
  - Number of clothing/storage items
  - Electronics
  - Books/documents
  - Moving date
  - Optional notes
- Generated estimate
  - Number of cardboard boxes
  - Packing material suggestions
  - Preparation checklist
  - Risk notes
- Static result display
- PDF checklist CTA for monetization demand check

### Monetization Ideas

Initial monetization options:

- Free basic diagnosis
- Moving checklist PDF / template
- Affiliate links for moving supplies or related services
- Ads after traffic grows

### SRE / Operations Value

This service can be used to demonstrate:

- Frontend deployment
- API endpoint operation
- AI API cost control
- Request/response monitoring
- Error handling
- Alerting
- Incident management
- Monetization experiment tracking

### Initial Success Criteria

MVP success is defined as:

- Public page is available
- User can submit moving information
- A result is generated
- PDF checklist CTA is displayed
- Basic errors are handled
- Usage and failures can be monitored

---

## Removed Service: AWS Cost Simulator

AWS Cost Simulator was previously implemented as the second service in SRE Lab.

It has been removed from the active service portfolio.

Reason:

- The current monetization strategy focuses on consumer AI services
- AWS Cost Simulator does not fit the future consumer AI service group
- It adds noise to the SRE Lab positioning
- It has lower monetization potential than AI Moving Assistant and future consumer AI service candidates
- The project should focus on AI Moving Assistant and Phase 15 Distribution / Acquisition Experiment

Historical note:

- AWS Cost Simulator demonstrated deterministic API design and cloud cost awareness
- It is no longer part of the active frontend, API, or service navigation

---

## Future Consumer AI Service Ideas

Future services should stay closer to general consumer pain points.

Candidates:

- AI Career Assistant
- AI Learning Coach
- Personal Budget Review Assistant
- Real estate / moving support assistant

These should be evaluated after the AI Moving Assistant monetization and acquisition experiment is stable.

---

## Internal Operations Services

Revenue / Cost Dashboard is not a consumer-facing service.

It should be treated as an internal operations tool for:

- revenue tracking
- cost tracking
- gross profit tracking
- usage monitoring
- monthly review
- scale-or-stop decision support

---

## Service Navigation Policy

SRE Lab should not mix unrelated service forms on a single page.

The frontend should use the top page as a focused entry point and provide dedicated pages for active services.

Current active page structure:

- index.html
- moving-assistant.html

Removed page:

- aws-cost-simulator.html

Related document:

- docs/frontend-navigation.md

---

## Current Operating Status

### AI Moving Assistant

Status: Production

Purpose:

- Japanese moving preparation support
- First monetization experiment target
- API safety, rate limiting, cost tracking, and fallback behavior
- PDF checklist CTA demand check

Operational features:

- Dedicated frontend page
- Dedicated Workers API endpoint
- Cloudflare Workers Secret support for future AI key management
- KV-based usage and cost tracking design
- Cost limit behavior design
- Grafana Synthetic Monitoring
- Grafana Alerting
- Runbook and operational records

### Portfolio Value

The project now demonstrates focused operation of one active consumer AI service with:

- service-specific frontend
- API separation
- monitoring
- alerting
- operational documentation
- incident and operational records
- safe API design
- cost-aware product design
- monetization experiment design
