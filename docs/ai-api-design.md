# AI API Design

This document defines the AI API integration design and historical implementation context for SRE Lab.

## Current Status

```text
Stopped at Phase 16 v1 checkpoint
```

The current production path for AI Moving Assistant uses the Cloudflare Workers API with a deterministic fallback response.

OpenAI API integration was previously implemented and verified, but paid AI calls are not treated as the current active production focus at the Phase 16 checkpoint.

## Purpose

The purpose of the AI API integration is to generate personalized moving preparation advice for AI Moving Assistant.

## Target Service

- Service name: AI Moving Assistant
- Current status: Production Worker API with deterministic fallback response
- Inactive / future status if resumed: AI-assisted response generation through the Worker

## Current / Proposed Architecture

User
↓
Cloudflare Pages
↓
Cloudflare Workers API
↓
Deterministic fallback response
↓
User

Inactive / future resumed path:

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

Current endpoint:

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

## Initial AI Integration Success Criteria

AI API integration is successful when that path is intentionally enabled and:

- User can submit moving information
- Backend receives the request
- AI API returns a result
- Frontend displays the result
- Errors are handled gracefully
- API key is not exposed to the browser

## Historical API Safety Before Real AI Integration

This historical design section records the safety controls that were required before connecting a real AI API. These controls remain useful for the current fallback API and for any future re-enabled AI path.

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

Historical follow-up before real AI integration:

- Add rate limiting
- Add AI API timeout handling
- Add fallback response
- Add usage tracking
- Add estimated cost tracking
- Store AI API keys only in Cloudflare Workers Secrets

## Historical Rate Limiting Design Before Real AI Integration

This historical design section records the rate limiting approach required before connecting a real AI API.

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

## Historical Usage and Cost Tracking Design Before Real AI Integration

This historical design section records the usage and cost tracking approach required before connecting a real AI API.

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

## Real AI API Integration Provider and Model Strategy

This section defines the initial provider and model strategy for real AI API integration.

The goal is not to maximize AI quality at the first step. The goal is to safely replace the current mock response with a controlled AI-generated response while preserving the SRE Lab safety model.

### Decision

The initial AI provider will be OpenAI API.

Claude API will not be used for the first AI Moving Assistant integration. It will remain a future candidate for more complex services such as Terraform Review AI and AI Incident Summarizer.

### Rationale

AI Moving Assistant requires short, structured Japanese JSON responses, not long-form reasoning or infrastructure code review.

For the initial production AI integration, the priority is:

- Low cost
- Stable JSON output
- Short latency
- Timeout handling
- Fallback response
- Usage tracking
- Estimated cost tracking
- Secret management
- Safe operation under a small monthly budget

### Initial Model Strategy

The initial model should be a low-cost OpenAI mini/nano class model.

The concrete model name should be configured by environment variable or Worker secret instead of being hard-coded in the frontend.

Planned configuration name:

- AI_MODEL

### Secret Management

The OpenAI API key must be stored as a Cloudflare Workers Secret.

The API key must not be stored in frontend code, repository files, local examples, README examples, or browser-visible JavaScript.

Planned secret name:

- OPENAI_API_KEY

### Initial Budget and Limits

| Item | Initial Value |
|---|---:|
| Monthly budget | 500 JPY |
| Monthly warning threshold | 300 JPY |
| Monthly stop threshold | 500 JPY |
| Daily soft limit | 50 JPY |
| Daily hard limit | 100 JPY |
| Service AI diagnoses per day | 20-50 |
| AI diagnoses per IP per day | 5 |
| Timeout | 8 seconds |

### API Control Order

The future AI-enabled endpoint should process requests in this order:

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
11. AI daily usage limit check
12. OpenAI API call with timeout
13. AI response validation
14. Estimated token and cost record
15. Response
16. Fallback response if needed

### Timeout Strategy

The Worker should use AbortController or an equivalent timeout mechanism.

Initial timeout:

- 8 seconds

If the OpenAI API call times out, the Worker should not fail with an unhandled exception.

It should return the existing fallback/mock-style response with a clear notice that the AI result is temporarily unavailable.

### Fallback Strategy

Fallback is required.

If the OpenAI API call fails, times out, or returns invalid JSON, the Worker should return a safe fallback response.

Fallback must preserve the user experience and prevent frontend breakage.

Expected fallback behavior:

- Return a valid JSON response
- Include checklist-style moving advice
- Include a disclaimer
- Avoid exposing internal API errors
- Record the AI error count

### Response Validation

The AI response must be validated before returning it to the frontend.

Expected fields:

- summary
- boxEstimate
- packingMaterials
- checklist
- riskNotes
- disclaimer

If the response is missing required fields or has invalid types, the Worker should use the fallback response.

### Cost Control

Before calling the OpenAI API, the Worker must check monthly and daily cost thresholds.

If the monthly stop threshold is reached, the Worker must not call OpenAI API.

Expected cost limit response:

{
  "error": {
    "code": "cost_limit_reached",
    "message": "AI diagnosis is temporarily unavailable due to usage limits."
  }
}

Expected status:

- 503 Service Unavailable

### Cost Estimation

The first implementation may estimate cost conservatively.

Initial estimation strategy:

- Treat Japanese input length as a conservative token approximation
- Use fixed expected output token upper bound
- Record estimated input tokens
- Record estimated output tokens
- Record estimated JPY cost

The exact price table should be confirmed from the official provider pricing before implementation.

### Follow-up Implementation Tasks

- Add OPENAI_API_KEY as a Cloudflare Workers Secret
- Add AI_MODEL configuration
- Implement OpenAI API call from Worker only
- Add timeout handling
- Add fallback response
- Add AI response validation
- Add AI daily usage limit
- Add estimated token tracking
- Add estimated cost calculation
- Verify production behavior with curl
- Record verification results in docs/incidents.md

## OpenAI API Secret and Model Configuration

This section defines how OpenAI API credentials and model configuration are prepared before implementation.

### Secret

The OpenAI API key must be stored as a Cloudflare Workers Secret.

Secret name:

- OPENAI_API_KEY

The secret must not be committed to GitHub, written to README examples, exposed in frontend JavaScript, or pasted into chat logs.

### Setup Command

Run this command from the Workers API directory:

```bash
cd apps/api
npx wrangler secret put OPENAI_API_KEY
```

The API key should be pasted only into the interactive secret prompt.

### Model Configuration

The initial model should be configured using a Worker environment variable.

Variable name:

- AI_MODEL

Initial value:

- gpt-4.1-nano

The model name is not secret information, but it should be configurable without changing frontend code.

### Fallback When Secret Is Missing

If OPENAI_API_KEY is not configured, the Worker must not fail.

Expected behavior:

- Do not call OpenAI API
- Return the existing fallback/mock response
- Record an AI configuration error metric after implementation
- Avoid exposing internal configuration details to the frontend

### Safety Requirement

The frontend must continue to call only the SRE Lab Workers API.

The frontend must never call OpenAI API directly.

### Follow-up Implementation Tasks

- Read env.OPENAI_API_KEY inside the Worker
- Read env.AI_MODEL inside the Worker
- Add safe fallback if OPENAI_API_KEY is missing
- Add timeout handling
- Add AI response validation
- Add estimated token and cost tracking
- Verify that the API key is not exposed in frontend assets

## Real AI API Integration Historical Status

Real AI API integration was implemented and verified for AI Moving Assistant during the earlier integration phase.

At the Phase 16 v1 checkpoint, the active production behavior is deterministic fallback from the Workers API. The OpenAI path is retained as historical implementation context and future resumption reference, not as the current active service focus.

### Current Provider

- Provider: OpenAI API
- API location: Cloudflare Workers backend
- Secret storage: Cloudflare Workers Secret
- Model configuration: AI_MODEL in wrangler.toml

### Implemented Controls

- API key is not exposed to frontend JavaScript
- Request validation is completed before the AI API call
- KV-based rate limiting is applied before the AI API call
- Estimated cost checks are applied before the AI API call
- OpenAI API timeout is enforced
- Fallback response is returned when OpenAI API fails
- AI response shape is validated before returning to the frontend
- AI usage counters are recorded in Cloudflare KV
- Estimated token and cost values are recorded in Cloudflare KV
- AI-specific daily limits are enforced
- cost_limit_reached behavior has been verified

### Verified Production Behavior

| Case | Result |
|---|---|
| OpenAI API success | 200 / aiStatus: generated |
| OpenAI API failure | 200 / aiStatus: fallback |
| OpenAI API billing or quota failure | fallback response verified |
| Per-IP AI daily limit | 429 / ai_limit_reached |
| Monthly estimated cost stop threshold | 503 / cost_limit_reached |

### Current Limit Values

| Limit | Value |
|---|---:|
| Request body size | 8 KB |
| Total input length | 2000 characters |
| General per-IP rate limit | 10 requests / minute |
| General per-IP daily limit | 50 requests / day |
| Service AI daily limit | 30 requests / day |
| Per-IP AI daily limit | 5 requests / day |
| Monthly stop threshold | 500 JPY |
| Daily hard limit | 100 JPY |

### Related Documents

- docs/cost.md
- docs/runbook.md
- docs/operations.md
- docs/incidents.md
