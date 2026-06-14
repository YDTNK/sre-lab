# Services

This document describes AI-powered micro services planned for SRE Lab.

## Service Selection Policy

SRE Lab services should meet the following criteria:

- Useful for general users
- Possible to build as a small MVP
- Can be operated with monitoring and alerting
- Can be improved through real user feedback
- Has potential for small monetization experiments
- Does not require continuous manual content posting

---

## Service 1: AI Moving Assistant

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

The first MVP should support:

- User input form
  - Furniture list
  - Number of clothing/storage items
  - Electronics
  - Books/documents
  - Moving date
  - Optional notes
- AI-generated estimate
  - Number of cardboard boxes
  - Packing material suggestions
  - Preparation checklist
  - Risk notes
- Static result display

### Monetization Ideas

Initial monetization options:

- Free basic diagnosis
- Paid detailed PDF report
- Affiliate links for moving supplies
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

### Initial Success Criteria

MVP success is defined as:

- Public page is available
- User can submit moving information
- A result is generated
- Basic errors are handled
- Usage and failures can be monitored

---

## Future Service Ideas

- AI Career Assistant
- AI Learning Coach
- AWS Cost Estimator
- Personal Budget Review Assistant

## AWS Cost Simulator

AWS Cost Simulator is the planned second service in SRE Lab.

Purpose:

- Provide a lightweight AWS monthly cost estimation tool
- Demonstrate cloud cost awareness
- Connect SRE Lab with AWS SAA, Terraform, and FinOps learning
- Add a second monitored service to SRE Lab

Initial MVP:

- EC2 monthly estimate
- EBS estimate
- S3 estimate
- Data transfer placeholder
- Deterministic calculation without AI API dependency

Documentation:

- docs/aws-cost-simulator.md

## Service Navigation Policy

SRE Lab should not mix unrelated service forms on a single page.

The frontend should use the top page as a service directory and provide a dedicated page for each service.

Initial page structure:

- index.html
- moving-assistant.html
- aws-cost-simulator.html

Related document:

- docs/frontend-navigation.md

## Multi-Service Operating Status

SRE Lab currently operates two small services.

### AI Moving Assistant

Status: Production

Purpose:

- Japanese moving preparation support
- Real AI API integration experiment
- API safety, rate limiting, cost tracking, and fallback behavior

Operational features:

- Dedicated frontend page
- Dedicated Workers API endpoint
- OpenAI API integration through backend only
- Cloudflare Workers Secret for API key
- KV-based usage and cost tracking
- AI daily limit
- Cost limit behavior
- Grafana Synthetic Monitoring
- Grafana Alerting
- Runbook and operational records

### AWS Cost Simulator

Status: Production

Purpose:

- Educational AWS monthly cost estimate
- AWS cost awareness and FinOps learning
- Second service for multi-service SRE Lab operations

Operational features:

- Dedicated frontend page
- Dedicated Workers API endpoint
- Deterministic cost calculation
- Region whitelist
- EC2 instance type whitelist
- Numeric input range validation
- No AWS Pricing API dependency
- No paid AI API usage
- Grafana Synthetic Monitoring
- Grafana Alerting
- Runbook and operational records

### Portfolio Value

The project now demonstrates operation of multiple small services instead of a single standalone application.

This improves the portfolio value by showing:

- service separation
- API separation
- service-specific monitoring
- service-specific alerting
- operational documentation
- incident and operational records
- safe API design
- cost-aware product design
