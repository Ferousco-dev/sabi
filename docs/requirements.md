# SabiHub — Requirements

Status: draft v1 · Owner: Feranmi · Last updated: 2026-07-30

## 1. Problem

Nigerian education is fragmented: schools, teachers, parents, and students are
disconnected; records are paper-based and lost to fire/theft/time; parents only
learn how a child is doing on physical open days; students can misrepresent
results to parents. SabiHub replaces this with one durable, connected system of
record that works on low-end devices and poor connectivity.

## 2. Users (actors)

| Role | Primary job on SabiHub |
|------|------------------------|
| **School admin** (school owner) | Run the school: enrol students, manage teachers, classes, timetable, assessments, results approval, analytics, durable multi-year records. |
| **Teacher** | Take attendance, upload lessons/resources, set & grade assignments, enter assessment scores, publish remarks/results (subject to admin approval). |
| **Student** | **Read-only**: view timetable, content, assignments, own results/attendance. Take gamified quizzes. Works offline. |
| **Parent/guardian** | See their child's live results, attendance, timetable; receive SMS/alerts; manage emergency contacts. |
| **Creator** | Build & sell courses, earn revenue, get certified. |
| **System** (non-human) | Send SMS alerts, run scheduled jobs (report generation, sync reconciliation), enforce data retention. |

## 3. Functional requirements

Grouped by role. `MUST` = pilot-blocking, `SHOULD` = important, `LATER` = post-pilot.

### School admin
- MUST create/enrol students (manual + CSV import), manage teachers (manual + CSV + email-invite), classes, sections, subjects, timetable.
- MUST manage the academic calendar: session + **three terms** (Nigerian K-12 model).
- MUST review/approve/publish results submitted by teachers.
- MUST manage user lifecycle status: active / graduated / expelled / transferred / inactive.
- MUST promote/repeat students between levels (transfers).
- SHOULD see analytics & reports (attendance rates, performance, exams).
- SHOULD manage security: see logged-in devices, revoke sessions.

### Teacher
- MUST take attendance (by class + date), enter assessment scores, grade assignments.
- MUST upload lessons/resources; edit their own timetable slots (admin oversees).
- SHOULD message parents.

### Student (read-only)
- MUST view timetable, content, assignments, own results & attendance — **offline-capable**.
- SHOULD take gamified quizzes; earn XP/badges.

### Parent
- MUST view each linked child's results, attendance, timetable.
- MUST receive alerts (SMS + in-app) for results/attendance events.
- SHOULD pay fees (LATER: payment integration).

### Creator
- SHOULD create courses, set price, view revenue.
- LATER: monetization payout, peer review, certification.

## 4. Non-functional requirements (the hard constraints from the pitch)

| # | Requirement | Target |
|---|-------------|--------|
| NFR-1 | **Multi-tenant isolation** | A user can never read or write another school's data. Enforced centrally. |
| NFR-2 | **Offline-first** | Student/teacher core flows work with no network; mutations queue and sync on reconnect. |
| NFR-3 | **Lightweight** | Installable PWA; initial JS ≤ ~200KB gzipped per route; usable on low-end Android tablets. |
| NFR-4 | **Compliance** | NDPR/GDPR: data-subject rights, retention, encryption in transit (HTTPS) and at rest for sensitive fields. WAEC/NECO-compatible result structures. |
| NFR-5 | **Security** | Per-role authorization, no shared default passwords, rate limiting, input validation, CSRF protection, audit logging. |
| NFR-6 | **Scale path** | Data model + API must not need re-architecture to go from 1 → 500k schools. Pagination on every list. |
| NFR-7 | **Observability** | Central error tracking + request logging; health checks. |
| NFR-8 | **Localisation (LATER)** | English at pilot; Hausa/Yoruba/Igbo in Phase 2. |

## 5. Explicit non-goals (for the pilot)

- No AR/VR (Phase 3).
- No in-app payments at launch (fees tracked, not collected).
- No native iOS/Android app — the PWA is the app (installable on tablets).
- No real-time chat beyond simple messaging.

## 6. Success criteria for "pilot-ready"

1. A school admin can set up a school end-to-end (students, teachers, classes, timetable, terms) with no developer help.
2. A teacher can take attendance and enter results **offline**, and they appear for the parent after sync + admin approval.
3. Two schools on the system cannot see each other's data (verified by test).
4. All `MUST` items above have passing automated tests.
5. No shared default passwords; every list is paginated; error tracking is live.
