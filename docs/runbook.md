# Runbook

This runbook defines basic incident response procedures for SRE Lab.

---

## Service State Gate

Before restoring an endpoint, page, monitor, or alert target, confirm whether the target is still an active service.

Required source of truth:

- `README.md`
- `docs/services.md`
- `docs/service-state-checklist.md`
- Latest records under `docs/incidents/`

Classify the target as one of:

| State | Meaning | First action |
|---|---|---|
| active | Current production service or endpoint | Investigate and restore if broken |
| degraded | Active service with partial failure | Mitigate and monitor |
| deprecated | Planned for removal | Confirm expected behavior before restoring |
| removed | Intentionally removed | Remove stale monitor or stale reference by default |
| replaced | Superseded by another target | Update monitor, redirect, or remove stale reference |
| unknown | State cannot be confirmed | Stop and verify service intent first |

If an endpoint returns 404, do not assume it is down until service state is confirmed.

AWS Cost Simulator is currently treated as a removed service. Alerts for `/api/aws-cost-simulator` should first be investigated as possible stale monitoring or service-state mismatch, not as an automatic API restoration task.

---

## Reliability Demo API

### Endpoint expectations

| Endpoint | Expected result | Operational purpose |
|---|---:|---|
| `GET /api/health` | 200 | Primary health and uptime target |
| `GET /api/slow?delayMs=<value>` | 200 | Controlled latency; delay is clamped to 0-5000 ms |
| `GET /api/error` | 500 | Intentional error-rate and alert demonstration |
| `GET /api/fallback` | 200 | Deterministic degraded/fallback-mode response |
| `GET /api/status` | 200 | Active service state and endpoint inventory |

The `/api/error` response is intentionally unhealthy. Do not treat a manual request to that endpoint as an incident by itself.

### Health or status failure

1. Confirm the Reliability Demo API is still `active` in `docs/services.md`.
2. Test `/api/health` and `/api/status`.
3. Check the latest Deploy Worker workflow and recent changes to `apps/api/src/index.js`.
4. Run `bash scripts/smoke-test.sh` against the deployed API.
5. If a recent deployment caused the failure, roll back to the previous working Worker version.

### Unexpected latency

1. Confirm the requested `delayMs` value.
2. Verify responses report `delayMs` no greater than 5000.
3. Compare `/api/health` latency with `/api/slow` latency to separate platform latency from intentional delay.
4. Treat latency above the requested/clamped delay plus normal network overhead as unexpected degradation.

### Fallback mode

`/api/fallback` intentionally returns HTTP 200 with `fallbackActive: true` and `status: degraded`. Use it to demonstrate graceful degradation without creating a real dependency failure.

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

1. Confirm the target page is still active using the Service State Gate.
2. Open the landing page in a browser:
   - https://sre-lab.pages.dev/
3. Check Grafana Synthetic Monitoring result.
4. Check Cloudflare Pages deployment status.
5. Check recent GitHub commits.
6. Check GitHub Actions status.

### Mitigation

- If the latest deployment caused the issue, revert the latest commit.
- If Cloudflare Pages deployment failed, redeploy from Cloudflare Pages.
- If the issue is external or transient, continue monitoring until recovery.
- If the page was intentionally removed or replaced, update the monitor or alert rule instead of restoring the page by default.

### After Recovery

- Record new incidents under `docs/incidents/` as one file per incident.
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

1. Confirm the target endpoint is still active using the Service State Gate.

2. Check Grafana Synthetic Monitoring result for the API check.

3. Test the production API with curl:

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

4. Check Cloudflare Workers deployment status.
5. Check recent GitHub commits.
6. Check whether the frontend can call the production API endpoint.
7. Check whether the API returns:
   - HTTP 200 for valid POST requests
   - HTTP 400 for invalid empty requests

### Mitigation

- If the latest Worker deployment caused the issue, redeploy the previous working version.
- If the API returns 400 for valid input, review request validation logic.
- If the API returns 500, review Worker logs and recent code changes.
- If the API is unreachable, check Cloudflare Workers status and deployment settings.
- If the frontend fails but curl succeeds, review frontend API endpoint configuration and CORS headers.
- If the endpoint was intentionally removed or replaced, update Grafana monitoring and alert rules instead of restoring the endpoint by default.

### After Recovery

- Record new incidents under `docs/incidents/` as one file per incident.
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

New records should normally be created as one file per incident under:

```text
docs/incidents/
```

Avoid directly rewriting the large aggregate file unless the full current content is safely loaded and the change is small and verified.

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

- Check the Service State Gate before restoring the endpoint
- Check the latest GitHub Actions CI result
- Check the latest Deploy Worker workflow result
- Review recent commits under apps/api
- Confirm the production endpoint still returns HTTP 200 for a valid POST
- Confirm Grafana Synthetic Monitoring is healthy

If invalid requests return unexpected status codes:

- Review apps/api/src/index.js validation logic
- Confirm the Worker deployment completed successfully
- Re-run the API safety validation commands
- Record findings under `docs/incidents/`

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

- Record rate limit related findings under `docs/incidents/`
- Review whether the client behavior indicates abuse
- Review whether AI API cost controls need stricter limits before paid AI usage is re-enabled
- Consider usage and cost tracking requirements before paid AI usage is re-enabled

## Cost Incident Runbook

Use this section if paid AI usage is intentionally re-enabled and estimated AI API usage or cost exceeds expected thresholds.

### Initial Thresholds

| Item | Threshold |
|---|---:|
| Monthly budget | 500 JPY |
| Monthly warning threshold | 300 JPY |
| Monthly stop threshold | 500 JPY |
| Daily soft limit | 50 JPY |
| Daily hard limit | 100 JPY |

### Expected Stop Behavior

When the monthly stop threshold is reached in an AI-enabled path, the Worker should not call the real AI API.

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
6. Confirm whether AI API calls are being blocked after the stop threshold if paid AI usage is enabled.
7. Review whether rate limits should be lowered.
8. Record findings under `docs/incidents/`.

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

## OpenAI Secret Runbook

Use this section when OPENAI_API_KEY is missing, invalid, expired, or suspected to be exposed.

### Symptoms

- AI integration returns fallback response only
- AI calls fail with authentication errors
- OpenAI API returns unauthorized errors
- Secret setup is missing in Cloudflare
- API key exposure is suspected

### Immediate Checks

1. Confirm OPENAI_API_KEY exists as a Cloudflare Workers Secret.
2. Confirm the API key is not committed to GitHub.
3. Confirm the API key is not present in frontend files.
4. Confirm AI_MODEL is configured in wrangler.toml.
5. Confirm the Worker was deployed after configuration changes if required.
6. Check recent deployments.
7. Check AI error metrics after implementation.

### Mitigation

- Re-run `npx wrangler secret put OPENAI_API_KEY`
- Rotate the OpenAI API key if exposure is suspected
- Temporarily keep fallback response enabled
- Avoid exposing provider error details to users
- Record the event under `docs/incidents/`

### Recovery Validation

1. Existing API endpoint still returns valid JSON.
2. API key is not visible in repository files.
3. Frontend does not call OpenAI API directly.
4. Worker reads AI_MODEL from configuration.
5. Real AI integration can proceed only after secret setup is confirmed.

## AI Cost Limit Runbook

Use this section when AI usage cost approaches or exceeds the configured threshold.

### Symptoms

- Estimated monthly cost exceeds 300 JPY
- Estimated monthly cost reaches 500 JPY
- cost_limit_reached appears
- ai_limit_reached appears frequently
- OpenAI credit balance decreases faster than expected
- OpenAI API returns billing, quota, or rate limit errors

### Immediate Checks

1. Check docs/cost.md.
2. Check Cloudflare KV estimated daily cost.
3. Check Cloudflare KV estimated monthly cost.
4. Check OpenAI Platform Usage.
5. Check OpenAI credit balance.
6. Confirm auto recharge is off.
7. Check recent deployments.
8. Check ai_calls, ai_success, ai_errors, and ai_limited counters.

### Mitigation

- Keep auto recharge disabled
- Lower AI service daily limit
- Lower per-IP AI daily limit
- Temporarily disable AI calls and return fallback
- Reduce max output tokens
- Tighten input length limits
- Review whether traffic is abusive or expected

### Recovery Validation

1. Valid API requests still return JSON.
2. AI calls are blocked when limits are reached.
3. cost_limit_reached returns 503 when cost threshold is reached.
4. ai_limit_reached returns 429 when AI daily limit is reached.
5. Estimated cost counters are recorded.
6. Record findings under `docs/incidents/`.
