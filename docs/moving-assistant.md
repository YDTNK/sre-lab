# AI Moving Assistant

AI Moving Assistant is the first AI-powered micro service planned for SRE Lab.

## Purpose

The purpose of this service is to help users prepare for moving by generating a simple checklist based on their household items and moving conditions.

## Current Status

Current version: Static MVP

The current MVP does not call an AI API yet. It provides a form-based interface and generates a basic checklist in the browser.

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

The current static MVP displays:

- Input summary
- Basic moving checklist
- Packing material suggestions
- Moving preparation notes

## Future AI Output

Future versions may generate:

- Estimated number of cardboard boxes
- Recommended packing materials
- Personalized moving checklist
- Risk notes based on large or fragile items
- Preparation timeline based on moving date

## Non-Goals

This service does not provide:

- Official moving company estimates
- Legal advice
- Insurance advice
- Guaranteed packing quantities
- Real-time moving company pricing

## Reliability Considerations

Current static MVP:

- No backend dependency
- No AI API dependency
- Low failure risk
- Monitored by Grafana Synthetic Monitoring

Future AI version:

- AI API timeout handling will be required
- API cost monitoring will be required
- Error responses must be user-friendly
- Generated results must include disclaimers

## Monetization Ideas

Possible future monetization options:

- Free basic checklist
- Paid detailed PDF report
- Affiliate links for packing materials
- Ads after traffic grows

## Success Criteria

The MVP is considered successful when:

- The public page is available
- Users can input moving information
- A basic result is generated
- The page is monitored
- Operational documents are updated
