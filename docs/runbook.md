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
