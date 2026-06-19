# Reliability Demo API Game Day

## Summary

```text
Date: 2026-06-19
Service: Reliability Demo API
Type: game day / controlled failure exercise
Status: passed
```

## Purpose

Validate that the intentional error endpoint behaves as expected and can be explained without treating it as an unexpected outage.

## Scenario

Call the controlled error endpoint:

```text
GET /api/error
```

## Expected result

```text
HTTP 500
error.code: intentional_demo_error
```

## Actual result

```text
HTTP 500
error.code: intentional_demo_error
```

## Result

Passed.

The endpoint returned the expected controlled error response.

## Operational decision

Do not treat a manual request to `/api/error` as an incident by itself.

Use `/api/health` and `/api/status` as primary monitoring targets.

## Follow-up

- Confirm external synthetic monitoring checks `/api/health` and `/api/status`.
- Keep `/api/error` out of default uptime alerting.
- Use this record as SRE portfolio evidence for controlled failure testing.