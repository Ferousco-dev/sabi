# SabiHub API (Laravel)

The multi-tenant REST API for SabiHub. See [`../docs/`](../docs) for the why
(requirements, architecture, ADRs). This README is the how.

## Run it locally

```bash
cd backend
composer install
cp .env.example .env        # first time only
php artisan key:generate    # first time only
php artisan migrate          # create tables (SQLite by default)
php artisan db:seed          # 2 demo schools + admins + classes
php artisan serve            # http://127.0.0.1:8000
```

PHP + Composer come from Homebrew (`brew install php composer`). If `php` isn't
found, add Homebrew to your PATH: `export PATH="/opt/homebrew/bin:$PATH"`.

## Test it

```bash
php artisan test                       # whole suite
php artisan test --filter=Tenancy      # just isolation tests
```

Tests use a throwaway database (`RefreshDatabase`), so they never touch dev data.

## The tenancy model (read this before adding a table)

Any table that belongs to a school must:

1. have a `school_id` foreign key (see an existing migration for the pattern),
2. its model must `use App\Models\Concerns\BelongsToSchool;`.

That's it — the model is then auto-filtered on read and auto-stamped on write for
the current school. **Never** write `where('school_id', ...)` by hand, and never
read the school from request input. The tenant comes from the authenticated user
via `ResolveTenant` middleware. The one exception is `User` (the tenant *root*),
which is scoped explicitly in its controllers.

Every new tenant-owned table should ship with a test asserting School A cannot see
School B's rows (copy `ClassTenancyTest`).

## Auth

- `POST /api/login` → `{ token, user }`. Send the token as `Authorization: Bearer <token>`.
- Invited users set their own password: admin `POST /api/invitations`, invitee
  `POST /api/invitations/accept`. There is **no shared default password.**

## Authorization

- Coarse: route middleware `role:school_admin` (or `role:school_admin,teacher`).
- Fine: Policies (see `SchoolClassPolicy`), called with `$this->authorize(...)`.

## Current endpoints

| Method | Path | Who |
|--------|------|-----|
| POST | `/api/login` | public |
| POST | `/api/invitations/accept` | public |
| GET | `/api/me`, `/api/classes`, `/api/subjects`, `/api/timetable` | any authenticated |
| POST | `/api/classes` | school_admin (policy) |
| GET | `/api/users` | school_admin |
| POST | `/api/subjects`, `/api/timetable`, `/api/invitations` | school_admin |
| POST | `/api/logout` | any authenticated |

## Deploy (pilot)

Target: Laravel serves **`api.sabihub.ng`**. Cutover (once at parity, staging-verified
first): point the `api.sabihub.ng` docroot at `backend/public`, set the `.env`
(DB + `APP_KEY`), run `php artisan migrate --force`, add a cron entry for
`php artisan schedule:run`. Until then the old PHP keeps that domain live. CI-gated
via the same pipeline. Move to a VPS when scale demands (see ADR-0002).
