# SabiHub — Data Model

Status: draft v1 · Last updated: 2026-07-30

Ports the existing 25-table MySQL schema into a **multi-tenant** model. The tenant
root is the **school**; every tenant-owned row carries `school_id`.

## Core entities (ER diagram)

```mermaid
erDiagram
  SCHOOL ||--o{ USER : "has (school_id)"
  SCHOOL ||--o{ CLASS : ""
  SCHOOL ||--o{ SESSION : ""
  SESSION ||--o{ TERM : "has 3"
  CLASS ||--o{ SECTION : "arms"
  CLASS ||--o{ ENROLLMENT : ""
  USER ||--o{ ENROLLMENT : "student"
  USER ||--o{ ATTENDANCE : "student"
  USER ||--o{ RESULT : "student"
  ASSESSMENT ||--o{ RESULT : ""
  SUBJECT ||--o{ RESULT : ""
  USER ||--o{ PARENT_CHILD : "parent"
  USER ||--o{ PARENT_CHILD : "child"
  CLASS ||--o{ TIMETABLE : ""
  USER ||--o{ TIMETABLE : "teacher"

  SCHOOL {
    bigint id PK
    string name
    string type "K-12 (nursery/primary/secondary)"
  }
  USER {
    bigint id PK
    bigint school_id FK
    string role "admin|teacher|student|parent|creator"
    string status "active|graduated|expelled|transferred|inactive"
    string email
  }
  ENROLLMENT {
    bigint id PK
    bigint school_id FK
    bigint student_id FK
    bigint class_id FK
    bigint section_id FK
    bigint session_id FK
  }
  RESULT {
    bigint id PK
    bigint school_id FK
    bigint student_id FK
    bigint assessment_id FK
    bigint subject_id FK
    decimal score
    string status "pending|approved|published"
  }
```

(Assignments, submissions, lessons, resources, announcements, notifications,
attendance_corrections, emergency_contacts, audit_logs, login_history follow the
same rule: each gets `school_id`.)

## Tenancy rules

1. **Every tenant-owned table has `school_id BIGINT UNSIGNED NOT NULL`** with an FK to `schools` and an index. (Global/reference tables like `sessions` templates are the only exceptions.)
2. **Composite indexes lead with `school_id`** — e.g. `(school_id, status)`, `(school_id, student_id)` — because every query filters by tenant first.
3. **Uniqueness is per-tenant** — e.g. a subject code is unique within a school: `UNIQUE (school_id, code)`, not globally.
4. `users.email` stays globally unique (one login identity), but a user belongs to exactly one school via `school_id`.

## Migration from today's schema

- Today: `school_profiles` exists but most tables have **no `school_id`** and code hardcodes `= 1`.
- Step 1: Laravel migrations recreate the schema *with* `school_id` on every tenant table.
- Step 2: a data migration backfills existing rows to their real school (the pilot's single school for now), then drops the hardcode.
- Step 3: add the per-tenant composite indexes.

## Indexing & performance (NFR-6)

- Lead every hot index with `school_id`.
- Paginate every list endpoint (cursor or `LIMIT/OFFSET` with a cap) — no unbounded `SELECT *`.
- Heavy report queries run as queued jobs and cache their output, not on the request path.

## Retention & compliance (NFR-4)

- Soft-delete users (status, not hard delete) so multi-year records survive — the pitch's core promise ("records survive even if the school burns down").
- Sensitive columns (guardian phone, etc.) encrypted at rest.
- NDPR data-subject export/delete implemented as an admin action + queued job.
