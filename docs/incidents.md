# Incident Records Index

This file is the current incident record index for SRE Lab.

The previous large aggregate incident log contained legacy operational records from earlier service directions. Its detailed content remains available in Git history. Active incident records should now be created as one file per record under:

```text
docs/incidents/
```

## Current active service

```text
Service: Reliability Demo API
State: implemented / active portfolio demonstration service
```

## Current incident record policy

Create one file per record under:

```text
docs/incidents/YYYY-MM-DD-short-description.md
```

Each record should include:

```text
- Incident ID
- Service
- Detection method
- Summary
- Impact
- Timeline
- Root cause or confirmed non-incident reason
- Mitigation
- Recovery validation
- Follow-up actions
```

## Current records

```text
docs/incidents/2026-06-19-reliability-demo-api-mvp-verification.md
```

## Related documents

```text
docs/runbooks/reliability-demo-api.md
docs/slo/reliability-demo-api.md
docs/incident-record-rules.md
docs/services.md
docs/service-state-checklist.md
```

## Legacy rule

Historical service or revenue-route records should not be treated as current incidents unless the management-side `status.md` explicitly reactivates that service direction.
