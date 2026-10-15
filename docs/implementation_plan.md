# TaskBoard: Implementation Plan

**Status:** Draft v0.1
**Depends on:** all other blueprints (`prd.md`, `trd.md`, `app_flow.md`, `ui_ux_brief.md`, `backend_schema.md`)

Build strictly in order. Do not start a milestone until the previous one is marked done. Each milestone is independently testable. No dates are set yet: add them once the submission deadline is known.

---

## 0. Working Rules

- **Owners:** Naitik = Tasks and Board (T), Harshal = Auth and Users (A), Jay = Projects (P), Jaydip = Comments, Activity, Dashboard (C).
- **Every member** builds frontend, backend, and Postman tests for their own module (rubric and viva requirement).
- **Git:** one branch per milestone task (`feature/auth-login`), pull request reviewed by one other member, `main` always runs.
- **Breaking changes:** if a change to a schema or endpoint would affect another module, update `backend_schema.md` first and tell the team.
- **Secrets:** never commit `.env`; add every new variable to `.env.example`.
- **Definition of done (per task):** works in the browser, loading and error states handled, Postman tests for success and failure saved, code reviewed and merged.

---

## Phase 0: Setup and Learning

**M0.1 Repository and tooling** (Naitik)
- Create GitHub repo, `.gitignore`, folder layout (`server/`, `client/`, `docs/`), commit the six blueprints into `docs/`.
- Done when: all four members cloned the repo and can run an empty server and an empty React app.

**M0.2 Starter practice** (everyone, in parallel)
- Each member builds a tiny throwaway Express + Mongoose CRUD and a tiny React page that fetches from it.
- Done when: each member can explain a request from button click to database and back.

**M0.3 MongoDB Atlas and environment** (Harshal)
- Create the free cluster, shared database user, connection string in each member's local `.env`.
- Done when: server connects to Atlas for all four members.

## Phase 1: Foundations

**M1.1 Server skeleton** (Naitik)
- `app.js`, `server.js`, DB config, `asyncHandler`, `ApiError`, `notFound`, `errorHandler`, `cors`, `morgan`, `express.json`.
- Health check route `GET /api/health`.
- Done when: server starts, errors return the standard JSON shape.

**M1.2 Client skeleton** (Naitik)
- Vite + React + Tailwind setup, axios instance with token interceptor, React Router with placeholder pages, Navbar shell.
- Done when: all routes from `app_flow.md` render placeholder pages.

**M1.3 Shared UI components** (Jay and Jaydip, with Naitik reviewing)
- Build Button, Input, Card, Modal, Badge, Loader, ErrorMessage, EmptyState, Toast, ConfirmDialog, Pagination per `ui_ux_brief.md`.
- Done when: a demo page shows every component and all are reused (no duplicate styling).

**M1.4 All Mongoose schemas** (each owner writes their own, per `backend_schema.md`)
- Harshal: User. Jay: Project. Naitik: Task. Jaydip: Comment and Activity.
- Done when: all five models load without errors and validations behave as documented.

## Phase 2: Authentication (everything depends on this)

**M2.1 Auth backend** (Harshal)
- Register, login, `/auth/me`, bcrypt hashing, JWT signing, `auth` middleware, `requireRole`.
- Postman: register success, duplicate email, wrong password, missing token, malformed token.
- Done when: other members can call protected routes with a token.

**M2.2 Auth frontend** (Harshal)
- `AuthContext`, Login and Register pages, `ProtectedRoute`, `AdminRoute`, logout, session-expired handling.
- Done when: full login flow from `app_flow.md` section 3.1 steps 1 to 3 works.

## Phase 3: Projects and Tasks (parallel, after M2)

**M3.1 Projects backend** (Jay)
- Create, list (search, filter, pagination), get, update, delete, archive, add and remove member, `projectAccess` middleware.
- Done when: owner and member permissions behave per `backend_schema.md` section 4.

**M3.2 Projects frontend** (Jay)
- Project list page, create form, settings page with member management.
- Done when: journeys 3.1 (steps 4 to 6) and 3.2 work end to end.

**M3.3 Tasks backend** (Naitik)
- Create, list with filters, sort and pagination, get, update, status PATCH, delete; assignee-membership check.
- Done when: all task endpoints pass Postman success and failure cases.

**M3.4 Board frontend** (Naitik)
- Board page with four columns, TaskCard, task create and edit modal, status change by dropdown, filter bar (filters in URL query string).
- Done when: journeys 3.3 and 3.4 work end to end.

**M3.5 Profile and admin pages** (Harshal)
- Users search, profile view and edit, admin user list, role change, delete user.
- Done when: journey 3.8 works.

## Phase 4: Collaboration and Insight

**M4.1 Activity logger** (Harshal)
- `activityLogger` middleware writing Activity records on project, member, task, and comment actions.
- Done when: each action in the enum produces a record with a readable message.

**M4.2 Comments** (Jaydip)
- Comments endpoints (add, list, edit, delete with permissions) and comments section inside the task modal.
- Done when: journey 3.5 works, including permission failures.

**M4.3 Activity feed** (Jaydip)
- `GET /activity` with pagination and the activity page.
- Done when: feed shows entries from M4.1 in newest-first order.

**M4.4 Dashboard** (Jaydip)
- Aggregation endpoint and Recharts charts (status, priority, overdue, per member).
- Done when: charts match the actual task data.

**M4.5 GitHub issue lookup** (Naitik)
- `github.service.js`, `GET /api/github/issue`, task-modal fetch button, handling of invalid URL, not found, and rate limit.
- Done when: journey 3.6 works and failure messages are clear.

## Phase 5: Quality and Polish

**M5.1 Full Postman suite** (each owner for their module)
- Collections exported to `docs/postman/`, covering success, failure, auth, and invalid input.

**M5.2 Responsive and accessibility pass** (all; Jay and Jaydip lead)
- Check every page at phone and laptop widths; run the accessibility checklist from `ui_ux_brief.md`.

**M5.3 Integration test walkthrough** (all)
- Run the complete flow from sign-up to dashboard on a fresh database; log and fix bugs.

**M5.4 Drag-and-drop (optional, should-have)** (Naitik)
- Only start if M5.1 to M5.3 are done. Must not break dropdown status change.

## Phase 6: Documentation and Delivery

**M6.1 README** (Jay)
- Description, features, install and run steps, project structure, API endpoints, environment variables.

**M6.2 Deployment** (Naitik and Harshal)
- Build client, serve from Express, deploy on Render, set environment variables, test the public URL.
- Done when: the full flow works on the deployed URL.

**M6.3 Short report** (Jaydip)
- Screenshots and major functionality summary.

**M6.4 Demo and viva rehearsal** (all)
- Each member rehearses a 3 to 5 minute explanation of their module's frontend, backend, and tests, and can open and explain their own code live.
- Done when: every member can answer "why did you write it this way?" for each file they own.

---

## Dependency Summary

```
M0 -> M1 -> M2 (auth) -> M3 (projects, tasks, profile) -> M4 (collab, insight) -> M5 -> M6
```

- M3 and M4 modules need M2 (token) and M1.4 (schemas) first.
- M4.2 to M4.4 need tasks from M3.3 and the logger from M4.1.

## Risks and Fallbacks

| Risk | Fallback |
|------|----------|
| Auth delayed | Others build against a temporary hard-coded user, then switch |
| Behind schedule | Cut M5.4 first, then simplify dashboard to two charts |
| Merge conflicts | Small branches, merge daily, no one edits another member's module without a pull request |
| Deployment issue found late | Deploy a skeleton at the end of Phase 1, then redeploy after each phase |

## Open Questions

1. What is the submission and viva date? With it, I will convert phases into dated milestones.
2. Is the work split above accepted, or should any module owner change?
