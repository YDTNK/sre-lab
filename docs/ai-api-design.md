# AI API Design

This document defines the initial AI API integration design for SRE Lab.

## Purpose

The purpose of the AI API integration is to generate personalized moving preparation advice for AI Moving Assistant.

## Target Service

- Service name: AI Moving Assistant
- Current status: Static MVP
- Future status: AI-assisted MVP

## Proposed Architecture

User
↓
Cloudflare Pages
↓
Cloudflare Workers API
↓
AI API
↓
Generated moving checklist
↓
User

## Why Use Cloudflare Workers

Cloudflare Workers will be used as the backend API layer.

Reasons:

- Keep AI API keys out of frontend code
- Add request validation before calling the AI API
- Add rate limiting in the future
- Add timeout and error handling
- Centralize API cost control
- Keep the frontend static and simple

## API Endpoint

Proposed endpoint:

POST /api/moving-assistant

## Request Body

Example:

{
  "furniture": "desk, chair, bed",
  "clothes": "3 storage boxes",
  "electronics": "iMac, speakers",
  "books": "30 books",
  "movingDate": "2026-07-01",
  "notes": "living alone, has heavy gym equipment"
}

## Response Body

Example:

{
  "summary": "Basic moving preparation summary",
  "boxEstimate": "Estimated cardboard boxes: 8-12",
  "packingMaterials": [
    "cardboard boxes",
    "bubble wrap",
    "packing tape"
  ],
  "checklist": [
    "Pack books into small boxes",
    "Protect electronics with towels or bubble wrap",
    "Confirm elevator and parking availability"
  ],
  "riskNotes": [
    "Heavy items should be separated",
    "Fragile electronics need additional protection"
  ],
  "disclaimer": "This is an AI-generated estimate and not an official moving company quote."
}

## Validation Rules

The backend should reject requests when:

- All input fields are empty
- Request body is too large
- Required JSON format is invalid

## Error Handling

The API should return user-friendly errors.

Examples:

- 400: Invalid input
- 429: Too many requests
- 500: Internal server error
- 504: AI API timeout

Frontend message example:

AI診断の生成に失敗しました。時間をおいて再度お試しください。

## Timeout Policy

Initial timeout target:

- AI API timeout: 10 seconds
- Frontend should display an error if the request fails

## Cost Control

Initial cost control policy:

- Do not call AI API on page load
- Call AI API only after user submission
- Limit input size
- Add simple rate limiting before public release
- Monitor API usage before adding paid features

## Reliability Considerations

Potential failure points:

- Cloudflare Worker error
- AI API timeout
- AI API rate limit
- Invalid user input
- Unexpected AI response format

Mitigation:

- Validate input before API call
- Use timeout handling
- Return fallback error messages
- Log failures in future versions
- Update incident log if production impact occurs

## Safety and Accuracy

The AI-generated output must include a disclaimer.

The service must not claim:

- Exact moving company pricing
- Guaranteed number of boxes
- Legal, insurance, or contract advice

## Initial Success Criteria

AI API integration is successful when:

- User can submit moving information
- Backend receives the request
- AI API returns a result
- Frontend displays the result
- Errors are handled gracefully
- API key is not exposed to the browser

## API Safety Before Real AI Integration

Before connecting a real AI API, the Workers API must protect against invalid requests, oversized input, and unnecessary AI API calls.

Implemented safety controls:

- Standardized JSON error response format
- Path validation
- Method validation
- Content-Type validation
- JSON parse error handling
- Empty input validation
- Request body size limit
- Total input length limit
- Existing mock response behavior preserved

Current limits:

- MAX_REQUEST_BYTES: 8 KB
- MAX_TOTAL_INPUT_LENGTH: 2000 characters

Current standardized error format:

{
  "error": {
    "code": "error_code",
    "message": "Human-readable error message"
  }
}

Verified error cases:

- 400 missing_input
- 400 invalid_json
- 404 not_found
- 405 method_not_allowed
- 413 input_too_large
- 415 unsupported_media_type

Follow-up before real AI integration:

- Add rate limiting
- Add AI API timeout handling
- Add fallback response
- Add usage tracking
- Add estimated cost tracking
- Store AI API keys only in Cloudflare Workers Secrets

## Rate Limiting Design Before Real AI Integration

Rate limiting must be implemented before connecting a real AI API.

The purpose is to reduce abuse, prevent repeated automated POST requests, and avoid unexpected AI API cost spikes.

### Decision

Rate limiting will be implemented with Cloudflare KV.

### Target

- Endpoint: POST /api/moving-assistant
- Preflight OPTIONS requests are excluded from rate limiting
- Invalid paths and unsupported methods should be rejected before rate limit checks

### Initial Limits

| Scope | Limit |
|---|---:|
| Per client IP | 10 requests / minute |
| Per client IP | 50 requests / day |

### Response on Limit Exceeded

Status:

- 429 Too Many Requests

Headers:

- Retry-After: 60

Response body:

{
  "error": {
    "code": "rate_limited",
    "message": "Too many requests. Please try again later."
  }
}

### KV Key Design

Minute window:

- rate:moving-assistant:minute:{ip}:{yyyyMMddHHmm}

Day window:

- rate:moving-assistant:day:{ip}:{yyyyMMdd}

### Client IP

Use Cloudflare's connecting IP header:

- CF-Connecting-IP

If the header is missing, use `unknown` as a fallback key.

### Validation Order

The API should validate requests in the following order:

1. OPTIONS handling
2. Path validation
3. Method validation
4. Content-Type validation
5. Request size validation
6. Rate limit check
7. JSON parse
8. Input validation
9. Mock response or future AI API call

### Follow-up Implementation Tasks

- Create a Cloudflare KV namespace for rate limiting
- Bind the KV namespace to the Worker
- Add rate limit constants
- Add client IP extraction
- Add minute and daily counter logic
- Return 429 with standardized error response
- Add Retry-After: 60
- Add production curl verification
- Document results in docs/incidents.md

## Usage and Cost Tracking Design Before Real AI Integration

Usage and cost tracking must be designed before connecting a real AI API.

The purpose is to understand request volume, estimate AI API cost, and prevent unexpected billing before monetization.

### Decision

Initial usage and cost tracking will use Cloudflare KV.

This is acceptable for the first version because SRE Lab already uses Cloudflare Workers and KV for rate limiting.

A future version may move usage and cost records to Cloudflare D1 or another database if reporting requirements become more complex.

### Initial Metrics

API usage:

- api_requests
- api_success
- api_errors
- rate_limited

AI API usage after real AI integration:

- ai_calls
- ai_success
- ai_errors

Estimated token usage after real AI integration:

- input_tokens
- output_tokens

Estimated cost:

- estimated_jpy_daily
- estimated_jpy_monthly

### KV Key Design

Daily API usage:

- usage:moving-assistant:api_requests:{yyyyMMdd}
- usage:moving-assistant:api_success:{yyyyMMdd}
- usage:moving-assistant:api_errors:{yyyyMMdd}
- usage:moving-assistant:rate_limited:{yyyyMMdd}

Daily AI usage:

- usage:moving-assistant:ai_calls:{yyyyMMdd}
- usage:moving-assistant:ai_success:{yyyyMMdd}
- usage:moving-assistant:ai_errors:{yyyyMMdd}

Estimated tokens:

- cost:moving-assistant:input_tokens:{yyyyMMdd}
- cost:moving-assistant:output_tokens:{yyyyMMdd}

Estimated cost:

- cost:moving-assistant:estimated_jpy:{yyyyMMdd}
- cost:moving-assistant:estimated_jpy:{yyyyMM}

### Initial Budget

| Item | Threshold |
|---|---:|
| Monthly budget | 500 JPY |
| Monthly warning threshold | 300 JPY |
| Monthly stop threshold | 500 JPY |
| Daily soft limit | 50 JPY |
| Daily hard limit | 100 JPY |

### Cost Control Order

The future AI-enabled API should process requests in this order:

1. OPTIONS handling
2. Path validation
3. Method validation
4. Content-Type validation
5. Request size validation
6. Rate limit check
7. JSON parse
8. Input validation
9. Usage count increment
10. Cost threshold check
11. AI API call
12. AI usage and estimated cost record
13. Response

### Cost Limit Response

If the monthly stop threshold is reached, the Worker should not call the AI API.

Expected response:

{
  "error": {
    "code": "cost_limit_reached",
    "message": "AI diagnosis is temporarily unavailable due to usage limits."
  }
}

Initial HTTP status:

- 503 Service Unavailable

### Follow-up Implementation Tasks

- Add usage counter logic
- Add estimated token tracking
- Add estimated cost tracking
- Add monthly cost threshold check
- Add cost_limit_reached response
- Add docs/cost.md
- Add cost incident runbook
- Verify that AI API calls are blocked after the stop threshold is reached

