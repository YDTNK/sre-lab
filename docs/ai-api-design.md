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

