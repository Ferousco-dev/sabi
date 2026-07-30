# SabiHub — Engineering Docs

This folder is the source of truth for *how SabiHub is built*, separate from the
pitch (which is *why*). Read in this order:

1. [`requirements.md`](requirements.md) — the problem, the users, and exactly what the system must do (and must not).
2. [`architecture.md`](architecture.md) — how the pieces fit: PWA client, Laravel API, MySQL, offline sync, multi-tenancy, environments.
3. [`data-model.md`](data-model.md) — the multi-tenant data model and ER diagram.
4. [`adr/`](adr/) — Architecture Decision Records: the *why* behind each big technical choice, dated and permanent.
5. [`migration-plan.md`](migration-plan.md) — the phased path from today's stack (raw PHP on cPanel + online-only Next.js) to the target, without taking the pilot offline.

## The one-paragraph summary

SabiHub is a **multi-tenant, offline-first education platform** for Nigerian
schools. One installable web app (PWA) serves five roles — school admin, teacher,
student, parent, creator — each isolated per school. A Laravel REST API backed by
MySQL owns all data and business rules. The client works offline on low-end
tablets and syncs when connectivity returns. Everything is designed to scale from
a pilot to hundreds of thousands of schools without re-architecture.

## Working agreements

- **Every schema change is a migration** (Laravel migrations), never a manual `ALTER`.
- **Every endpoint is tenant-scoped** — a user can only ever see their own school's data. This is enforced centrally, not per-query.
- **Every feature ships with tests** (unit for logic, feature/API tests for endpoints).
- **Nothing reaches `main` without CI passing** (typecheck, lint, tests, build) — already enforced.
- **Decisions are recorded** as ADRs, not lost in chat.
- **Secrets never live in git.** Config comes from environment.
