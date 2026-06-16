# Incident Log

This document records incidents, alerts, investigations, mitigations, and reliability improvements for SRE Lab.

## Incident Template

### Incident ID

YYYYMMDD-001

### Service

Examples:

- Landing Page
- AI Moving Assistant API
- Cloudflare Pages
- Cloudflare Workers

### Alert Rule

Examples:

- sre-lab-uptime-down
- sre-lab-api-down
- Manual detection

### Summary

Briefly describe what happened.

### Impact

Describe the user-facing impact.

Examples:

- Landing page unavailable
- AI Moving Assistant diagnosis failed
- Slow response time
- Monitoring false positive
- Deployment failure

### Detection

How was the issue detected?

Examples:

- Grafana alert
- Manual check
- Cloudflare deployment failure
- GitHub Actions failure

### Initial Checks

Record the first checks performed.

Examples:

- Grafana check result
- Browser access result
- curl result
- HTTP status code
- Cloudflare Pages deployment status
- Cloudflare Workers deployment status
- Recent GitHub commits

### Timeline

| Time | Event |
|---|---|
| YYYY-MM-DD HH:MM | Alert fired |
| YYYY-MM-DD HH:MM | Investigation started |
| YYYY-MM-DD HH:MM | Root cause identified |
| YYYY-MM-DD HH:MM | Mitigation completed |
| YYYY-MM-DD HH:MM | Service recovered |

### Root Cause

Describe the technical cause.

### Mitigation

Describe what was done to restore the service.

### Recovery Validation

Record how recovery was confirmed.

Examples:

- Grafana alert returned to normal
- Browser access succeeded
- curl returned HTTP 200
- Frontend displayed API response
- GitHub Actions passed

### Prevention / Follow-up Actions

List improvements to prevent recurrence.

- [ ] Add monitoring
- [ ] Update runbook
- [ ] Improve CI check
- [ ] Add alert tuning
- [ ] Improve error handling

---

## Incidents

[Existing incident records preserved above this entry in repository history.]

## 20260616-001: AWS Cost Simulator API route deployment recovery

### Type

Operational Record / API Incident Recovery

### Service

SRE Lab AWS Cost Simulator API / Cloudflare Workers

### Alert Rule

`sre-lab-aws-cost-simulator-api-down`

### Summary

Grafana/Alertmanager fired `sre-lab-aws-cost-simulator-api-down` for the AWS Cost Simulator endpoint.

Production checks showed that `POST /api/aws-cost-simulator` initially returned HTTP/2 404, even though the route existed in the local source code. After deploying the Workers API from `apps/api`, the endpoint changed from 404 to request validation behavior and then returned HTTP/2 200 for a valid request.

### Impact

- AWS Cost Simulator API was unavailable at the monitored production endpoint.
- The monitor detected the endpoint as down.
- Valid users would not have been able to receive an AWS cost estimate while the route was not deployed in production.
- Other SRE Lab endpoints were not confirmed as affected during this incident.

### Detection

The incident was detected by alert notification:

```text
[FIRING:1] sre-lab-aws-cost-simulator-api-down
SRE Lab
https://sre-lab-api.daisan-tanaka.workers.dev/api/aws-cost-simulator
sre-lab-aws-cost-simulator-api
Tokyo
```

### Initial Checks

#### GET request

```bash
curl -i https://sre-lab-api.daisan-tanaka.workers.dev/api/aws-cost-simulator
```

Result:

```text
HTTP/2 404
```

Response:

```json
{
  "error": {
    "code": "not_found",
    "message": "The requested API endpoint was not found."
  }
}
```

#### POST request with empty body

```bash
curl -i -X POST \
  https://sre-lab-api.daisan-tanaka.workers.dev/api/aws-cost-simulator \
  -H "Content-Type: application/json" \
  -d '{}'
```

Initial result:

```text
HTTP/2 404
```

This confirmed that the issue was not only a GET-versus-POST monitoring mismatch. The production Worker did not have the expected route behavior at that time.

### Investigation

Repository search confirmed that the route was documented and implemented in the local repository:

```bash
grep -R "/api/aws-cost-simulator" .
```

Relevant result:

```text
./apps/api/src/index.js:const AWS_COST_SIMULATOR_API_PATH = "/api/aws-cost-simulator";
```

The root repository did not contain `wrangler.toml`:

```bash
cat wrangler.toml
```

Result:

```text
cat: wrangler.toml: No such file or directory
```

The actual Cloudflare Workers project configuration was found under `apps/api`:

```bash
find . -name "wrangler.toml" -o -name "wrangler.json" -o -name "wrangler.jsonc"
```

Result:

```text
./apps/api/wrangler.toml
```

`apps/api/wrangler.toml` showed the production Worker configuration:

```toml
name = "sre-lab-api"
main = "src/index.js"
compatibility_date = "2026-06-14"
```

`apps/api/src/index.js` included route handling for AWS Cost Simulator:

```js
if (url.pathname === AWS_COST_SIMULATOR_API_PATH) {
  return handleAwsCostSimulator(request, env);
}
```

Because the local source code contained the route but production returned 404, the likely cause was that the latest Workers code had not been deployed to production or the deploy had been run from the wrong location.

### Timeline

| Time | Event |
|---|---|
| 2026-06-16 04:04 JST | Alert fired for `sre-lab-aws-cost-simulator-api-down`. |
| 2026-06-16 04:04 JST | GET `/api/aws-cost-simulator` returned HTTP/2 404. |
| 2026-06-16 04:04 JST | POST `/api/aws-cost-simulator` with `{}` returned HTTP/2 404. |
| 2026-06-16 04:05 JST | Local repository search confirmed `/api/aws-cost-simulator` existed in `apps/api/src/index.js`. |
| 2026-06-16 04:06 JST | `wrangler.toml` was found under `apps/api`, not repository root. |
| 2026-06-16 04:09 JST | After deployment, POST with `{}` returned HTTP/2 400 `invalid_input`, proving the production route existed. |
| 2026-06-16 04:10 JST | POST with valid AWS Cost Simulator input returned HTTP/2 200. |

### Root Cause

The production Cloudflare Worker did not have the expected `/api/aws-cost-simulator` route behavior at the time of the alert.

The route existed in local source code, so the most likely root cause was a deployment gap: the updated `apps/api` Worker code had not been reflected in production, or deployment had been attempted from the wrong project directory.

### Mitigation

Deployed the Cloudflare Workers API from the correct project directory:

```bash
cd apps/api
npx wrangler deploy
```

After deployment, the endpoint no longer returned 404.

### Recovery Validation

#### Validation check 1: route exists and validation runs

```bash
curl -i -X POST \
  https://sre-lab-api.daisan-tanaka.workers.dev/api/aws-cost-simulator \
  -H "Content-Type: application/json" \
  -d '{}'
```

Result:

```text
HTTP/2 400
```

Response:

```json
{
  "error": {
    "code": "invalid_input",
    "message": "region must be one of: ap-northeast-1, us-east-1."
  }
}
```

This confirmed that production was reaching the AWS Cost Simulator handler and input validation logic.

#### Validation check 2: valid request succeeds

```bash
curl -i -X POST \
  https://sre-lab-api.daisan-tanaka.workers.dev/api/aws-cost-simulator \
  -H "Content-Type: application/json" \
  -d '{
    "region": "ap-northeast-1",
    "ec2InstanceType": "t3.micro",
    "ec2InstanceCount": 1,
    "ec2HoursPerMonth": 744,
    "ebsGb": 20,
    "s3Gb": 10,
    "dataTransferGb": 10
  }'
```

Result:

```text
HTTP/2 200
```

Response summary:

```json
{
  "service": "aws-cost-simulator",
  "mode": "deterministic",
  "summary": "月額料金の概算は $13.19 / ¥1979 です。",
  "totalMonthlyUsd": 13.19,
  "totalMonthlyJpy": 1979,
  "breakdown": {
    "ec2": 10.12,
    "ebs": 1.92,
    "s3": 0.25,
    "dataTransfer": 0.9
  }
}
```

### Result

AWS Cost Simulator API was restored.

The incident was resolved when the production endpoint returned HTTP/2 200 for a valid request.

### Lessons Learned

- A route existing in source code does not prove it exists in production.
- For Cloudflare Workers monorepos, deploy commands must be run from the directory containing the correct `wrangler.toml`, in this case `apps/api`.
- A 404 on both GET and POST indicates a route or deployment issue, not merely a method mismatch.
- A 400 validation error after deployment can be a positive recovery signal because it proves the request reached application code.
- Production recovery should be validated with both invalid and valid request bodies.

### Prevention / Follow-up Actions

- [ ] Ensure Workers deploy workflow runs automatically after `apps/api` changes are merged.
- [ ] Add deployment verification step for `POST /api/aws-cost-simulator` after Worker deploy.
- [ ] Add or confirm a dedicated health endpoint for simple GET-based monitoring.
- [ ] Keep the AWS Cost Simulator monitor aligned with the actual expected method, body, and status code.
- [ ] Update runbook with Cloudflare Workers monorepo deploy path: `cd apps/api && npx wrangler deploy`.
