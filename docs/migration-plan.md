# SabiHub — Migration Plan

Status: draft v1 · Last updated: 2026-07-30

How we go from **today** (online-only Next.js on Vercel + raw-PHP API on cPanel,
single-tenant) to the **target** (PWA + Laravel + multi-tenant + tested) **without
taking the pilot offline**. Strangler-fig approach: stand the new stack up
alongside the old, move traffic endpoint-by-endpoint, delete the old.

## Phase 0 — Foundation (docs + guardrails) ✅ in progress
- [x] Requirements, architecture, data model, ADRs (this folder).
- [x] CI gate: nothing reaches prod unless typecheck + lint + build + e2e pass.
- [ ] Add a **staging** environment (Vercel preview + staging API + staging DB).
- [ ] Add error tracking (Sentry or similar) to the current app.

## Phase 1 — Laravel API skeleton + tenancy ✅ (backend built; not yet deployed)
- [x] Laravel 13 app in `backend/` (Sanctum auth).
- [x] Migrations with `school_id` + composite indexes on every tenant table (schools, school_classes, subjects, timetable_entries, invitations, users.role/status).
- [x] Central tenancy: `ResolveTenant` middleware + global `BelongsToSchool` scope (auto-filter + auto-stamp).
- [x] Auth + tokenised set-own-password invites (kills `sabihub123`); `role:` middleware + `SchoolClassPolicy`; validation on every write.
- [x] Cross-tenant isolation feature tests — **12 tests / 29 assertions green**.
- [ ] Remaining domain: rate limiting; per-model policies for results/attendance; students/teachers are `users` by role (done) — add dedicated endpoints as ported.

**Target end state: Laravel serves `api.sabihub.ng`.** To get there without breaking
the live app: the old PHP keeps answering `api.sabihub.ng` until the Laravel API
reaches parity; then we flip that domain's docroot to `backend/public` in a single
cutover (staging-verified first). Porting below builds that parity.

## Phase 2 — Port endpoints (strangler fig)
Port in dependency order, each with API tests, repointing the frontend base URL per group:
1. Auth + users + tenancy.
2. School setup: students, teachers, classes, sections, subjects, timetable, terms.
3. Attendance, assessments, results (approval flow).
4. Parent views, notifications/SMS (queued), creator/courses.
- [ ] When a group is ported + tested + repointed, delete its raw-PHP endpoint.
- [ ] Backfill data migration: assign existing rows to the real school, drop `school_id = 1`.

## Phase 3 — PWA / offline
- [ ] Add service worker (Serwist/next-pwa) + web app manifest → installable, ≤ target JS budget.
- [ ] Cache app shell + reference reads for offline.
- [ ] IndexedDB mutation queue with client UUIDs; background sync replay (ADR-0004).
- [ ] Offline-enable the priority flows: student reads, teacher attendance + score entry.

## Phase 4 — Security & compliance hardening
- [ ] Replace shared `sabihub123` with tokenised set-your-own-password invites.
- [ ] Audit log on sensitive actions; encrypt sensitive columns.
- [ ] NDPR export/delete admin action (queued).
- [ ] Pen-test pass of the checklist in requirements NFR-5.

## Phase 5 — Performance & observability
- [ ] Pagination on every list; cache heavy reports; move files to object storage.
- [ ] Request logging + dashboards; uptime + healthcheck alerts.

## Phase 6 — Follow-ups carried over from the current build
- [ ] Teacher score-entry: subject picker so scores post with `subject_id`.
- [ ] Settings persistence (student_settings, school_security_settings tables + wiring).
- [ ] `announcements.target_class_id`, `holidays.is_recurring` columns.
- [ ] Teacher email-invite flow (started; finish under the new auth).

## Guardrails during migration
- Old and new APIs run in parallel; the frontend switches per endpoint group behind a base-URL/env flag, so a bad port is a one-line rollback.
- Every ported endpoint must have a feature test **and** the cross-tenant isolation assertion before the old one is deleted.
- Prod DB changes: staging first, backup before every migration (already the practice).
