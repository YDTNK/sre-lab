# 20260616-002: Incident log restoration after destructive update

## Type

Operational Record / Documentation Incident Recovery

## Service

SRE Lab Documentation / Incident Log

## Summary

During the documentation update for the AWS Cost Simulator alert investigation, `docs/incidents.md` was accidentally replaced with a shortened version that contained a placeholder instead of preserving the historical incident records.

The issue was detected during review when the AWS Cost Simulator recovery record was found to have been written without fully considering the earlier possibility that AWS Cost Simulator had been intentionally removed or deprecated.

The incident log was restored from the last known good commit, and the AWS Cost Simulator alert investigation was kept as a separate incident file.

## Impact

- `docs/incidents.md` on `main` temporarily lost most historical incident records.
- The placeholder text below appeared in place of the full historical log:

```text
[Existing incident records preserved above this entry in repository history.]
```

- The underlying Git history still preserved the full incident log.
- No application runtime behavior was affected.
- Documentation trust and operational record integrity were affected until restoration.

## Detection

The issue was detected manually during follow-up review of the AWS Cost Simulator alert handling flow.

The key concern was that the initial recovery note treated the AWS Cost Simulator endpoint as something that must be restored, while the latest service state may have intentionally removed or deprecated it.

Further inspection showed that `docs/incidents.md` had also been destructively shortened.

## What Happened

1. An AWS Cost Simulator alert fired.
2. The endpoint initially returned HTTP/2 404.
3. The Worker was redeployed from `apps/api`, and valid POST verification later returned HTTP/2 200.
4. A record was written directly into `docs/incidents.md`.
5. Because `docs/incidents.md` was very large, the update did not safely preserve the full file content.
6. Historical records were replaced by a placeholder line.
7. A corrected AWS Cost Simulator record was created as a separate file:

```text
docs/incidents/20260616-001-aws-cost-simulator-monitoring-service-state-mismatch.md
```

8. A restoration branch was created:

```text
fix/restore-incidents-log
```

9. `docs/incidents.md` was restored from the last known good commit:

```text
98ef7270d6720f4675377747f7ea8d24b881f20f
```

10. Pull request #7 restored the full incident log on `main`.

## Timeline

| Time | Event |
|---|---|
| 2026-06-16 | AWS Cost Simulator alert investigation was documented. |
| 2026-06-16 | `docs/incidents.md` was accidentally shortened during the update. |
| 2026-06-16 | Review identified that AWS Cost Simulator removal/deprecation flow had not been considered. |
| 2026-06-16 | Corrected AWS Cost Simulator record was created under `docs/incidents/`. |
| 2026-06-16 | Local Git recovery branch `fix/restore-incidents-log` was created. |
| 2026-06-16 | `docs/incidents.md` was restored from commit `98ef7270d6720f4675377747f7ea8d24b881f20f`. |
| 2026-06-16 | PR #7 `Restore full incident log` was opened. |
| 2026-06-16 04:26 UTC | PR #7 was merged into `main`. |
| 2026-06-16 | Main branch was verified: historical records restored and the corrected separate AWS Cost Simulator record exists. |

## Recovery Procedure Used

Local recovery was performed with the following flow:

```bash
git switch -c fix/restore-incidents-log

git restore --source 98ef7270d6720f4675377747f7ea8d24b881f20f -- docs/incidents.md

grep -n "Existing incident records preserved" docs/incidents.md
grep -n "20260615-003" docs/incidents.md

git add docs/incidents.md
git commit -m "Restore full incident log"
git push origin fix/restore-incidents-log
```

Expected verification:

```text
- `Existing incident records preserved` should not appear.
- `20260615-003: Moving Assistant API fallback recovery` should appear near the end of the restored log.
```

## Pull Request

PR:

```text
#7 Restore full incident log
```

PR result:

```text
state: closed
merged: true
merge_commit_sha: 99b2f25093e451a1cda81875aadba5b3e6795826
```

## Recovery Validation

After merge, `main` was verified.

### `docs/incidents.md`

The placeholder was removed, and historical records were restored.

Confirmed restored beginning of incident records:

```text
## Incidents

### 20260614-001
```

Confirmed restored later incident record:

```text
## 20260615-003: Moving Assistant API fallback recovery
```

### Separate AWS Cost Simulator record

The corrected service-state-aware record exists on `main`:

```text
docs/incidents/20260616-001-aws-cost-simulator-monitoring-service-state-mismatch.md
```

The record correctly notes that if AWS Cost Simulator had been intentionally removed, the correct remediation would have been stale monitor removal instead of API route restoration.

## Root Cause

The root cause was unsafe editing of a large incident log file through a tool response with output truncation constraints.

The update attempted to write a new record directly into `docs/incidents.md` without safely preserving the full existing file.

A secondary process issue was that the initial AWS Cost Simulator alert response did not first reconcile the service state: active, deprecated, removed, or replaced.

## Mitigation

- Restored `docs/incidents.md` from the last known good commit.
- Merged restoration through PR #7.
- Kept the corrected AWS Cost Simulator alert investigation in a separate file.
- Avoided further direct edits to the large aggregate incident log.

## Lessons Learned

- Do not directly replace large operational log files unless the full current content is safely loaded and preserved.
- Prefer one-file-per-incident records under `docs/incidents/` for new operational events.
- Keep aggregate logs stable, or update them only with small verified index links.
- Before restoring a missing endpoint, confirm whether the service is currently active, deprecated, removed, or replaced.
- A documentation recovery should itself be recorded because incident logs are part of operational reliability.

## Prevention / Follow-up Actions

- [ ] Use `docs/incidents/` for new incident records instead of appending directly to the large `docs/incidents.md` file.
- [ ] Add an incident index file if needed, rather than rewriting the full historical log.
- [ ] Add a service-state checklist to the runbook: active / deprecated / removed / replaced.
- [ ] Before responding to endpoint 404 alerts, check whether the endpoint is intentionally removed.
- [ ] Avoid destructive file updates when tool output is truncated.
