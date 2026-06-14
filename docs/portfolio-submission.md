# SRE Lab Portfolio Submission Package

## Summary

SRE Lab is a small multi-service operations lab built as an SRE / Platform Engineering portfolio project.

It is not just a web application. It demonstrates how small services are deployed, monitored, alerted, documented, and improved through operational records.

The project currently operates two services:

- AI Moving Assistant
- AWS Cost Simulator

## Live URLs

Frontend:

https://sre-lab.pages.dev/

Workers API:

https://sre-lab-api.daisan-tanaka.workers.dev

AI Moving Assistant page:

https://sre-lab.pages.dev/moving-assistant.html

AWS Cost Simulator page:

https://sre-lab.pages.dev/aws-cost-simulator.html

## Services

### AI Moving Assistant

AI Moving Assistant is a Japanese moving preparation support service.

Main features:

- Dedicated frontend page
- Cloudflare Workers API
- OpenAI API integration through backend only
- API key stored as Cloudflare Workers Secret
- Request validation
- Rate limiting
- AI-specific daily limit
- Estimated cost tracking
- Cost limit behavior
- Timeout and fallback response
- AI response shape validation
- Grafana Synthetic Monitoring
- Grafana Alerting
- Runbook and operational records

Endpoint:

POST /api/moving-assistant

### AWS Cost Simulator

AWS Cost Simulator is an educational AWS monthly cost estimate service.

Main features:

- Dedicated frontend page
- Cloudflare Workers API
- Deterministic cost calculation
- EC2, EBS, S3, and data transfer estimate
- USD to JPY fixed conversion
- Region whitelist
- EC2 instance type whitelist
- Numeric range validation
- No AWS Pricing API dependency
- No paid AI API usage
- Grafana Synthetic Monitoring
- Grafana Alerting
- Runbook and operational records

Endpoint:

POST /api/aws-cost-simulator

## Technical Stack

| Area | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Hosting | Cloudflare Pages |
| API | Cloudflare Workers |
| Secrets | Cloudflare Workers Secrets |
| Usage / Cost Storage | Cloudflare KV |
| CI/CD | GitHub Actions, Wrangler |
| Monitoring | Grafana Cloud Synthetic Monitoring |
| Alerting | Grafana Alerting |
| Documentation | Markdown |
| Repository | GitHub |

## SRE / Platform Engineering Points

This project demonstrates the following SRE and platform engineering practices:

- Public service operation
- Frontend and API separation
- Multiple service operation
- Service-specific API endpoints
- GitHub Actions CI
- Cloudflare Workers auto deployment
- Synthetic monitoring
- Service-specific alert rules
- Email notification contact point
- Runbook URL attached to alert rules
- Incident and operational records
- API method and path validation
- JSON request validation
- Request size limits
- Rate limiting
- AI cost control
- AI fallback behavior
- Usage and cost tracking
- Documentation-driven operations

## Reliability Design

SRE Lab includes reliability controls for both service operation and AI usage.

Implemented reliability controls:

- Cloudflare Pages for frontend hosting
- Cloudflare Workers for API isolation
- GitHub Actions CI before deployment
- Workers auto deployment
- Grafana Synthetic Monitoring from Tokyo
- Grafana Alerting with pending period
- Email notification contact point
- Runbook for first response
- Operational records for production changes
- Safe fallback for AI API failure
- Cost limit behavior for paid AI API usage

## Monitoring and Alerting

Current monitoring targets:

| Target | Method | Expected | Alert |
|---|---|---|---|
| Frontend | GET | 200 | sre-lab-uptime-down |
| AI Moving Assistant API | POST | 2xx | sre-lab-api-down |
| AWS Cost Simulator API | POST | 2xx | sre-lab-aws-cost-simulator-api-down |

Common alert behavior:

- Metric: probe_success
- Condition: below 0.5
- Evaluation interval: 1m
- Pending period: 2m
- Contact point: sre-lab-email
- Runbook: docs/runbook.md

## Cost and Safety Design

AI Moving Assistant uses OpenAI API through the backend only.

Cost and safety controls:

- API key is never exposed to frontend JavaScript
- OpenAI API key is stored as Cloudflare Workers Secret
- AI request timeout is enforced
- Fallback response is returned when AI fails
- Estimated usage and cost are recorded in Cloudflare KV
- Daily AI limit is enforced
- Monthly estimated cost limit is enforced
- OpenAI auto recharge is off

AWS Cost Simulator intentionally avoids paid APIs.

Cost and safety controls:

- No AWS Pricing API call
- No OpenAI API call
- Deterministic fixed pricing table
- Clear educational disclaimer
- Input validation before calculation

## Operational Records

The project keeps operational records in docs/incidents.md.

Examples of recorded operations:

- Initial production readiness check
- Worker auto deployment verification
- API safety hardening verification
- KV-based rate limiting verification
- OpenAI API integration verification
- AI cost tracking and daily limit verification
- cost_limit_reached behavior verification
- Usage and cost snapshot recording
- AWS Cost Simulator service planning
- AWS Cost Simulator frontend implementation
- AWS Cost Simulator API endpoint implementation
- AWS Cost Simulator deterministic calculation
- AWS Cost Simulator API validation
- AWS Cost Simulator monitoring setup
- Multi-service documentation polish

## What This Project Proves

This project proves that I can do more than build a simple web app.

It demonstrates that I can:

- design a small service architecture
- separate frontend and API responsibilities
- deploy services publicly
- build CI/CD workflows
- add monitoring and alerting
- define runbooks
- keep operational records
- think about API safety
- control AI API usage and cost
- operate multiple small services as one platform
- improve the system iteratively

## Interview Explanation

A concise explanation for interviews:

SRE Lab is my multi-service SRE portfolio project. I operate two small services on Cloudflare Pages and Workers. The first is AI Moving Assistant, which uses OpenAI API safely from the backend with rate limiting, fallback behavior, and cost tracking. The second is AWS Cost Simulator, which calculates deterministic AWS monthly cost estimates without paid AI API usage. Both services have dedicated frontend pages, API endpoints, Grafana Synthetic Monitoring, alert rules, runbook links, and operational records. The goal is to show not only application development, but production-like operation, reliability design, and continuous improvement.

## Current Status

SRE Lab currently has:

- Two production frontend pages
- Two production API endpoints
- CI/CD
- Worker auto deployment
- Grafana Synthetic Monitoring
- Grafana Alerting
- Runbook
- Incident and operational records
- API safety controls
- AI API integration
- Cost tracking
- Multi-service documentation

## Next Improvements

Possible next improvements:

- Add a simple revenue or cost dashboard
- Add GitHub Issues for improvement task tracking
- Add AI Incident Summarizer
- Add more detailed AWS Cost Simulator resources
- Add D1-based usage and cost storage
- Add automated weekly operational reports
