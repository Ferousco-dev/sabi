# Architecture Decision Records

Each ADR captures one significant decision: the context, the choice, and the
consequences. They are append-only — supersede, don't edit.

---

## ADR-0001 — Installable PWA for the client (not native)

**Date:** 2026-07-30 · **Status:** accepted

**Context.** The pitch promises a lightweight, offline-first app on low-end
tablets. We have a strong Next.js web app and web-first skills. A separate native
app is a second codebase to build and maintain.

**Decision.** Ship the client as an **installable PWA**: Next.js + a service
worker for offline caching and background sync + IndexedDB for local data and a
mutation queue.

**Consequences.** One codebase, reuses the existing UI, installable on tablets,
works offline. Trade-off: no app-store distribution and slightly less device
integration than native — acceptable for the pilot (OMobile preloads it). If deep
native features are needed later, wrap the PWA or add a thin native shell.

---

## ADR-0002 — Laravel for the backend (replace raw PHP)

**Date:** 2026-07-30 · **Status:** accepted

**Context.** The current API is raw copy-paste PHP scripts on shared cPanel: no
migrations, no tests, no validation layer, `school_id` hardcoded. It works but is
not maintainable or safe to scale.

**Decision.** Rebuild the API in **Laravel**. It provides migrations, Eloquent
(with global scopes for tenancy), policies for authorization, form-request
validation, queues, and a first-class testing story out of the box.

**Consequences.** A cleaner, testable, conventional backend and a real learning
path. Trade-off: learning Laravel + a migration effort. Runs on the existing
cPanel for the pilot (subdomain docroot → `/public`, cron → scheduler); moves to
a VPS when scale demands. The raw-PHP endpoints are ported incrementally, not
big-banged.

---

## ADR-0003 — Shared-database multi-tenancy via `school_id`

**Date:** 2026-07-30 · **Status:** accepted

**Context.** SabiHub serves many isolated schools; today code assumes one
(`school_id = 1`). We need isolation that scales but is simple to operate now.

**Decision.** **Shared database, shared schema, `school_id` discriminator** on
every tenant-owned table. Tenancy is enforced centrally by a global Eloquent
scope + middleware that derives `school_id` from the authenticated user — never
from request input.

**Consequences.** Simple to run and back up at pilot; one migration path to
per-tenant sharding later if needed. Risk: a missing scope leaks data — mitigated
by making scoping automatic (global scope) and asserting cross-tenant isolation
in tests.

---

## ADR-0004 — Offline writes are idempotent, queued, last-write-wins

**Date:** 2026-07-30 · **Status:** accepted

**Context.** Teachers/students act offline; the same write may replay on
reconnect, and two devices may edit the same record.

**Decision.** Each offline mutation carries a **client-generated UUID**; the API
dedupes on it so replays are idempotent. Conflict resolution is **last-write-wins
per record**, except results which are append-then-approve (so conflicts are
rare). Each entity documents its rule.

**Consequences.** No duplicate attendance/score rows from retries; predictable
behaviour. Trade-off: LWW can drop a concurrent edit — acceptable for the pilot's
data shapes; revisit with per-field merge if a real conflict problem appears.
