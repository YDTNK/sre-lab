# 20260616-001: AWS Cost Simulator monitoring / service-state mismatch

## Type

Operational Record / Alert Investigation

## Service

SRE Lab AWS Cost Simulator API / Cloudflare Workers / Monitoring

## Alert Rule

`sre-lab-aws-cost-simulator-api-down`

## Summary

Alertmanager fired `sre-lab-aws-cost-simulator-api-down` for the AWS Cost Simulator endpoint.

Initial production checks showed that `POST /api/aws-cost-simulator` returned HTTP/2 404. The local repository still contained route code for `/api/aws-cost-simulator`, and deploying the Worker from `apps/api` restored the endpoint to HTTP/2 200 for a valid request.

However, this recovery path must be treated with caution because the latest product/service state may have intentionally removed or deprecated AWS Cost Simulator. If AWS Cost Simulator had been intentionally removed, the correct remediation would have been to remove or disable the stale monitor rather than restore the API route.

## Impact

- The monitor reported AWS Cost Simulator API as down.
- At the time of the check, the monitored endpoint returned 404.
- A valid request later returned 200 after Worker deployment.
- The incident exposed a possible mismatch between monitoring configuration and the intended current service scope.

## Detection

Alert notification:

```text
[FIRING:1] sre-lab-aws-cost-simulator-api-down
SRE Lab
https://sre-lab-api.daisan-tanaka.workers.dev/api/aws-cost-simulator
sre-lab-aws-cost-simulator-api
Tokyo
```

## Initial Checks

### GET request

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

### POST request with empty body

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

This proved the issue was not only a GET-versus-POST monitoring mismatch.

## Investigation

Local repository search showed references to `/api/aws-cost-simulator` in documentation, frontend, and API code:

```bash
grep -R "/api/aws-cost-simulator" .
```

Important result:

```text
./apps/api/src/index.js:const AWS_COST_SIMULATOR_API_PATH = "/api/aws-cost-simulator";
```

The repository root did not contain `wrangler.toml`:

```bash
cat wrangler.toml
```

Result:

```text
cat: wrangler.toml: No such file or directory
```

The actual Workers configuration existed under `apps/api`:

```bash
find . -name "wrangler.toml" -o -name "wrangler.json" -o -name "wrangler.jsonc"
```

Result:

```text
./apps/api/wrangler.toml
```

`apps/api/wrangler.toml`:

```toml
name = "sre-lab-api"
main = "src/index.js"
compatibility_date = "2026-06-14"
```

`apps/api/src/index.js` included route handling:

```js
if (url.pathname === AWS_COST_SIMULATOR_API_PATH) {
  return handleAwsCostSimulator(request, env);
}
```

## Timeline

| Time | Event |
|---|---|
| 2026-06-16 04:04 JST | Alert fired for `sre-lab-aws-cost-simulator-api-down`. |
| 2026-06-16 04:04 JST | GET `/api/aws-cost-simulator` returned HTTP/2 404. |
| 2026-06-16 04:04 JST | POST `/api/aws-cost-simulator` with `{}` returned HTTP/2 404. |
| 2026-06-16 04:05 JST | Local repository search confirmed `/api/aws-cost-simulator` references existed. |
| 2026-06-16 04:06 JST | `wrangler.toml` was found under `apps/api`, not repository root. |
| 2026-06-16 04:09 JST | After Worker deployment, POST with `{}` returned HTTP/2 400 `invalid_input`, proving the route existed in production. |
| 2026-06-16 04:10 JST | POST with valid AWS Cost Simulator input returned HTTP/2 200. |
| 2026-06-16 after review | Concern raised that AWS Cost Simulator may have been intentionally removed or deprecated. |

## Root Cause

Confirmed technical symptom:

- Production returned 404 for `/api/aws-cost-simulator` before redeployment.
- Local code still contained the route.
- Redeploying from `apps/api` made the route available again.

Final root cause is not fully closed until the intended service state is reconciled.

There are two possible interpretations:

1. **Unintentional deployment drift**  
   The route should have existed, but production did not have the latest Worker code.

2. **Intentional service removal / stale monitor**  
   AWS Cost Simulator had been intentionally removed or deprecated, and the monitor continued to check an endpoint that should no longer exist.

The second interpretation was not considered during the initial recovery action and must be explicitly checked.

## Mitigation Performed

The Worker was deployed from the API project directory:

```bash
cd apps/api
npx wrangler deploy
```

After deployment, the endpoint no longer returned 404.

## Recovery Validation

### Validation check 1: route reached application validation

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

### Validation check 2: valid request succeeded

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

## Corrective Note

The initial recovery action treated the alert as a deployment issue. That was technically plausible, but incomplete.

Before restoring a missing endpoint, the intended product/service state should be checked:

```text
404 alert
↓
Check source code and deployment
↓
Check latest product decision: active, removed, deprecated, or replaced
↓
If active: restore API / deploy
If removed: remove or disable stale monitor
```

## Lessons Learned

- A missing endpoint is not always an outage; it may be an intentional removal with stale monitoring.
- Monitoring configuration must be reconciled with the current service catalog.
- In a monorepo, deployment path matters: the Worker config is under `apps/api`.
- A 400 validation response can confirm the request reached application code.
- A valid 200 response confirms technical recovery, but not necessarily product-state correctness.

## Follow-up Actions

- [ ] Confirm whether AWS Cost Simulator is currently intended to be active, deprecated, or removed.
- [ ] If removed, disable the Grafana check and alert rule for `sre-lab-aws-cost-simulator-api-down`.
- [ ] If active, keep the Worker route and add post-deploy API verification.
- [ ] Update service catalog documentation to mark each service as active / deprecated / removed.
- [ ] Update runbook to check service-state before restoring any 404 endpoint.
- [ ] Avoid destructive updates to large incident logs; use separate incident files when the log is too large for safe tool editing.
