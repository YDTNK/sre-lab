# Runbook

This runbook defines basic incident response procedures for SRE Lab.

---

## Alert: sre-lab-uptime-down

### Summary

The landing page uptime check failed.

### Impact

Users may not be able to access the SRE Lab landing page.

### Detection

- Grafana Synthetic Monitoring
- Alert rule: sre-lab-uptime-down
- Target: https://sre-lab.pages.dev/

### First Checks

1. Open the landing page in a browser:
   - https://sre-lab.pages.dev/
2. Check Grafana Synthetic Monitoring result.
3. Check Cloudflare Pages deployment status.
4. Check recent GitHub commits.
5. Check GitHub Actions status.

### Mitigation

- If the latest deployment caused the issue, revert the latest commit.
- If Cloudflare Pages deployment failed, redeploy from Cloudflare Pages.
- If the issue is external or transient, continue monitoring until recovery.

### After Recovery

- Record the incident in docs/incidents.md.
- Update this runbook if the response process changed.
- Add follow-up actions if prevention is needed.

---

## Alert: sre-lab-api-down

### Summary

The AI Moving Assistant API synthetic check failed.

### Impact

Users may be able to access the landing page, but the AI Moving Assistant diagnosis may fail.

### Detection

- Grafana Synthetic Monitoring
- Alert rule: sre-lab-api-down
- Target: https://sre-lab-api.daisan-tanaka.workers.dev/api/moving-assistant

### First Checks

1. Check Grafana Synthetic Monitoring result for the API check.

2. Test the production API with curl:

    curl -X POST https://sre-lab-api.daisan-tanaka.workers.dev/api/moving-assistant \
      -H "Content-Type: application/json" \
      -d '{
        "furniture": "テスト用デスク",
        "clothes": "",
        "electronics": "",
        "books": "",
        "movingDate": "",
        "notes": "runbook test"
      }'

3. Check Cloudflare Workers deployment status.
4. Check recent GitHub commits.
5. Check whether the frontend can call the production API endpoint.
6. Check whether the API returns:
   - HTTP 200 for valid POST requests
   - HTTP 400 for invalid empty requests

### Mitigation

- If the latest Worker deployment caused the issue, redeploy the previous working version.
- If the API returns 400 for valid input, review request validation logic.
- If the API returns 500, review Worker logs and recent code changes.
- If the API is unreachable, check Cloudflare Workers status and deployment settings.
- If the frontend fails but curl succeeds, review frontend API endpoint configuration and CORS headers.

### After Recovery

- Record the incident in docs/incidents.md.
- Add the root cause and mitigation steps.
- Update the API design document if the failure suggests a design issue.
- Add follow-up tasks if alerting, validation, or error handling should be improved.

---

## General Incident Notes

For every incident, record:

- Incident ID
- Summary
- Impact
- Detection method
- Timeline
- Root cause
- Mitigation
- Prevention / follow-up actions

## API Safety Validation

Use this section when validating the AI Moving Assistant Workers API after deployment or when investigating API-related alerts.

### Expected API Safety Responses

| Case | Expected status | Expected error code |
|---|---:|---|
| Valid POST | 200 | N/A |
| Empty JSON body | 400 | missing_input |
| Invalid JSON | 400 | invalid_json |
| Unknown path | 404 | not_found |
| Unsupported method | 405 | method_not_allowed |
| Input too large | 413 | input_too_large |
| Missing JSON Content-Type | 415 | unsupported_media_type |

### Validation Commands

Valid request:

    curl -i -X POST "https://sre-lab-api.daisan-tanaka.workers.dev/api/moving-assistant" \
      -H "Content-Type: application/json" \
      -d '{"furniture":"机1つ","clothes":"服2箱"}'

Invalid JSON:

    curl -i -X POST "https://sre-lab-api.daisan-tanaka.workers.dev/api/moving-assistant" \
      -H "Content-Type: application/json" \
      -d '{invalid json'

Unsupported method:

    curl -i -X GET "https://sre-lab-api.daisan-tanaka.workers.dev/api/moving-assistant"

Unknown path:

    curl -i -X POST "https://sre-lab-api.daisan-tanaka.workers.dev/api/unknown" \
      -H "Content-Type: application/json" \
      -d '{}'

### Investigation Notes

If valid requests fail:

- Check the latest GitHub Actions CI result
- Check the latest Deploy Worker workflow result
- Review recent commits under apps/api
- Confirm the production endpoint still returns HTTP 200 for a valid POST
- Confirm Grafana Synthetic Monitoring is healthy

If invalid requests return unexpected status codes:

- Review apps/api/src/index.js validation logic
- Confirm the Worker deployment completed successfully
- Re-run the API safety validation commands
- Record findings in docs/incidents.md

## Rate Limiting Runbook

Use this section when the Workers API returns 429 Too Many Requests after rate limiting is implemented.

### Expected Behavior

When a client exceeds the configured request limit, the API should return:

- HTTP status: 429
- Error code: rate_limited
- Header: Retry-After: 60

Expected response body:

{
  "error": {
    "code": "rate_limited",
    "message": "Too many requests. Please try again later."
  }
}

### Initial Limits

| Scope | Limit |
|---|---:|
| Per client IP | 10 requests / minute |
| Per client IP | 50 requests / day |

### Investigation Steps

1. Confirm whether the response is expected rate limiting behavior.
2. Check if requests are coming from repeated manual curl tests, browser refreshes, or bot-like access.
3. Confirm valid requests below the limit still return 200.
4. Confirm Grafana API monitoring remains healthy.
5. Review recent deployments under apps/api.
6. If the rate limit is too strict for normal usage, tune limits and document the reason.

### Follow-up Actions

- Record rate limit related findings in docs/incidents.md
- Review whether the client behavior indicates abuse
- Review whether future AI API cost controls need stricter limits
- Consider adding usage and cost tracking before real AI API integration

## Cost Incident Runbook

Use this section when estimated AI API usage or cost exceeds expected thresholds.

### Initial Thresholds

| Item | Threshold |
|---|---:|
| Monthly budget | 500 JPY |
| Monthly warning threshold | 300 JPY |
| Monthly stop threshold | 500 JPY |
| Daily soft limit | 50 JPY |
| Daily hard limit | 100 JPY |

### Expected Stop Behavior

When the monthly stop threshold is reached, the Worker should not call the real AI API.

Expected response:

{
  "error": {
    "code": "cost_limit_reached",
    "message": "AI diagnosis is temporarily unavailable due to usage limits."
  }
}

Expected status:

- 503 Service Unavailable

### Investigation Steps

1. Check daily usage count.
2. Check monthly estimated cost.
3. Confirm whether traffic increased naturally or appears abusive.
4. Check rate limited request count.
5. Check recent deployments.
6. Confirm whether AI API calls are being blocked after the stop threshold.
7. Review whether rate limits should be lowered.
8. Record findings in docs/incidents.md.

### Mitigation Options

- Temporarily disable real AI API calls
- Lower rate limits
- Lower daily or monthly cost thresholds
- Return fallback mock response
- Add stricter input length limits
- Investigate suspicious traffic patterns

### Follow-up Actions

- Add or update docs/cost.md
- Review monthly cost trend
- Review revenue versus cost
- Update thresholds if usage becomes stable
- Add alerting for cost threshold if possible

