# AI Moving Assistant

AI Moving Assistant is the first consumer-facing micro service for SRE Lab.

## Current Status

```text
Production / stopped at Phase 16 v1 checkpoint
```

Current revenue status:

```text
Revenue: 0 JPY
Payment flow: not implemented
Affiliate flow: not implemented
PDF / template sale: not implemented
Free sample CTA: implemented
Phase 17: not started
```

## Purpose

The purpose of this service is to help users prepare for moving by generating a simple checklist based on their household items and moving conditions.

## Target Users

- People planning a move
- People living alone
- People unsure how many boxes or packing materials they need
- People who want a quick moving preparation checklist

## User Inputs

The MVP collects the following information:

- Furniture list
- Clothing / storage items
- Electronics
- Books / documents
- Moving date
- Optional notes

## Current Output

The current service displays:

- Input summary
- Moving preparation summary
- Estimated packing material guidance
- Basic moving checklist
- Risk notes
- Disclaimer / caution note
- PDF checklist CTA
- Free sample CTA

## Current Pages

```text
apps/landing/moving-assistant.html
apps/landing/moving-checklist-sample.html
```

## Current API

```text
POST /api/moving-assistant
```

The API is provided by Cloudflare Workers.

Current behavior:

- Validates input
- Applies API safety controls
- Applies rate limiting
- Returns fallback moving checklist response
- Does not expose API keys in frontend

## Free Sample CTA

The free sample CTA is the current lightweight conversion point.

```text
AI Moving Assistant result page
↓
Free sample CTA click
↓
moving-checklist-sample.html visit
```

No payment, affiliate, email collection, or personal information collection is currently implemented.

## Future AI Output

Future versions may generate:

- Estimated number of cardboard boxes
- Recommended packing materials
- Personalized moving checklist
- Risk notes based on large or fragile items
- Preparation timeline based on moving date

Real AI API usage is not the current active focus.

## Non-Goals

This service does not provide:

- Official moving company estimates
- Legal advice
- Insurance advice
- Guaranteed packing quantities
- Real-time moving company pricing
- Contract judgment
- Vendor recommendation guarantee

## Reliability Considerations

Current service:

- Cloudflare Pages frontend
- Cloudflare Workers API
- Fallback response behavior
- API safety controls
- Rate limiting
- Grafana Synthetic Monitoring
- Grafana Alerting
- Runbook and operational records

Future AI version:

- AI API timeout handling will be required
- API cost monitoring will be required
- Error responses must be user-friendly
- Generated results must include disclaimers
- Cost guards must remain active

## Monetization Ideas

Possible future monetization options:

- Moving checklist PDF / template
- Affiliate links for packing materials or related services
- Small paid detailed report
- Ads after traffic grows

Current decision:

```text
Do not start Phase 17 until a real revenue route exists.
```

## Success Criteria

The current checkpoint is considered successful because:

- The public page is available
- Users can input moving information
- A basic result is generated
- The API is monitored
- Operational documents are updated
- PDF checklist CTA is visible
- Free sample CTA is clickable
- Free sample page is accessible
- Docs-based Revenue / Cost Dashboard exists in the management repository

## Current Next

- Do not add new SRE Lab features for now
- Keep Revenue / Cost Dashboard updated monthly or when an event occurs
- Move active learning focus to Kubernetes / CKA preparation
