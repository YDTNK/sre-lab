# AWS Cost Simulator

AWS Cost Simulator is the planned second service in SRE Lab.

This service is designed as a lightweight AWS monthly cost estimation tool for learning, portfolio demonstration, and future monetization experiments.

## Service Position

| Item | Value |
|---|---|
| Service name | AWS Cost Simulator |
| Japanese name | AWS料金試算ミニツール |
| Phase | Phase 8 Second Service |
| Status | Deterministic calculation implemented |
| Initial API mode | Deterministic calculation |
| AI dependency | Not required for MVP |
| Target users | AWS learners, junior engineers, portfolio reviewers |

## Purpose

The purpose of AWS Cost Simulator is to show cloud cost awareness as part of SRE Lab.

The service should help users estimate simple AWS monthly costs from a small number of inputs.

It is also intended to connect SRE Lab with AWS SAA, Terraform, and FinOps learning.

## Why This Service

AWS Cost Simulator is a strong second service because:

- It matches SRE / Platform Engineering themes
- It demonstrates cost awareness
- It connects with AWS SAA and Terraform learning
- It can be implemented without paid AI API calls in the MVP
- It is easy to monitor as an additional API endpoint
- It can later support SEO, technical articles, and monetization experiments

## MVP Scope

The MVP should remain small.

Initial supported AWS resources:

- EC2
- EBS
- S3
- Data transfer placeholder

The MVP does not need to match the official AWS Pricing Calculator exactly.

It should clearly state that the result is an approximate educational estimate.

## Initial Input Fields

| Field | Type | Example |
|---|---|---|
| region | string | ap-northeast-1 |
| ec2InstanceType | string | t3.micro |
| ec2InstanceCount | number | 1 |
| ec2HoursPerMonth | number | 730 |
| ebsGb | number | 30 |
| s3Gb | number | 10 |
| dataTransferGb | number | 10 |

## Initial Output Fields

| Field | Description |
|---|---|
| summary | Human-readable monthly estimate summary |
| totalMonthlyUsd | Estimated total monthly cost in USD |
| totalMonthlyJpy | Estimated total monthly cost in JPY |
| breakdown | Per-resource estimated cost |
| assumptions | Pricing assumptions used for calculation |
| warnings | Notes about approximation and excluded items |
| disclaimer | Educational estimate disclaimer |

## Initial Calculation Policy

The first version uses deterministic static pricing values stored in code.

This keeps the MVP simple and avoids external API dependency.

Example policy:

- Use a small fixed set of EC2 instance types
- Use a fixed USD to JPY exchange rate configured in code
- Use approximate EBS and S3 unit prices
- Clearly document assumptions
- Do not claim exact AWS billing accuracy

## Frontend Page Design

AWS Cost Simulator should be implemented as a dedicated service page.

Recommended page:

/aws-cost-simulator.html

This page should not be mixed with AI Moving Assistant form fields.

Initial UI elements:

- Back link to SRE Lab top page
- Service title
- Short educational description
- Region selector
- EC2 instance type selector
- EC2 instance count input
- EC2 hours per month input
- EBS storage GB input
- S3 storage GB input
- Data transfer GB input
- Calculate button
- Result summary
- Cost breakdown
- Assumptions
- Educational disclaimer

Related navigation design:

- docs/frontend-navigation.md

## Proposed API Endpoint

```text
POST /api/aws-cost-simulator
```

The endpoint should follow the same safety approach as AI Moving Assistant.

Required behavior:

- JSON request only
- Method validation
- Path validation
- Input validation
- Request size limit
- Standardized JSON error response
- Deterministic calculation response

## Safety Policy

The AWS Cost Simulator MVP does not call a paid AI API.

However, it should still use the same API safety baseline:

- Validate method and path
- Reject invalid JSON
- Reject missing or invalid fields
- Limit request size
- Limit numeric input ranges
- Return standardized errors
- Avoid storing raw user input

## Monitoring Policy

The service should be monitored as a second API endpoint after implementation.

Recommended synthetic monitoring:

| Target | Method | Expected |
|---|---|---|
| /api/aws-cost-simulator | POST | 2xx |

Recommended usage counters:

- api_requests
- api_success
- api_errors
- rate_limited

Future cost counters are not required for MVP because the service does not call a paid AI API.

## Future AI Extension

After the deterministic MVP is stable, an AI extension may be added.

Possible AI features:

- Explain the estimate in beginner-friendly Japanese
- Suggest cost optimization ideas
- Compare simple architectures
- Generate learning notes for AWS SAA students

AI extension must not be added before:

- API safety is implemented
- Rate limiting is implemented
- Cost tracking is designed
- Fallback behavior is prepared

## Monetization Angle

Possible future monetization paths:

- SEO articles about AWS cost examples
- Affiliate links to AWS learning resources
- Paid downloadable cost planning templates
- Advanced Terraform/AWS review service in the future

Initial monetization is not required.

The first goal is SRE portfolio value and operational consistency.

## Phase 8 Roadmap

| Step | Description | Status |
|---|---|---|
| Phase 8-1 | Service design | Current |
| Phase 8-2 | Frontend UI design | Future |
| Phase 8-3 | Workers API endpoint | Future |
| Phase 8-4 | Deterministic cost calculation | Completed |
| Phase 8-5 | API safety and validation | Future |
| Phase 8-6 | Monitoring and alerting | Future |
| Phase 8-7 | README and operations docs update | Future |

## Success Criteria

Phase 8 is successful when:

- AWS Cost Simulator is available from the SRE Lab frontend
- The API endpoint returns deterministic cost estimates
- The endpoint has safety validation
- The endpoint is monitored
- The service is documented
- Operational records are updated
- The service improves SRE Lab's portfolio story

## Implemented Deterministic Pricing

The current deterministic calculation uses fixed approximate values.

| Item | Value |
|---|---:|
| USD to JPY | 150 |
| t3.micro hourly USD | 0.0136 |
| t3.small hourly USD | 0.0272 |
| t3.medium hourly USD | 0.0544 |
| EBS GB-month USD | 0.096 |
| S3 GB-month USD | 0.025 |
| Data transfer GB USD | 0.09 |

Important exclusions:

- AWS Free Tier
- Taxes
- Snapshots
- NAT Gateway
- Load Balancer
- RDS
- CloudWatch
- AWS Support
- Regional pricing differences beyond the initial fixed table

This is an educational estimate and not an official AWS cost estimate.

## Implemented API Validation

AWS Cost Simulator validates request input before calculating estimates.

Allowed values:

| Field | Allowed values |
|---|---|
| region | ap-northeast-1, us-east-1 |
| ec2InstanceType | t3.micro, t3.small, t3.medium |

Numeric limits:

| Field | Min | Max |
|---|---:|---:|
| ec2InstanceCount | 0 | 20 |
| ec2HoursPerMonth | 0 | 744 |
| ebsGb | 0 | 1000 |
| s3Gb | 0 | 1000 |
| dataTransferGb | 0 | 1000 |

Invalid input response:

400 / invalid_input

The endpoint rejects unsupported regions, unsupported instance types, missing numeric fields, non-numeric values, and out-of-range numeric values.
