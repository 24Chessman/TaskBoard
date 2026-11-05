# TaskBoard Postman collections

Eight collections, one per API module. Each one is self-contained: it registers its own throwaway users (`*-{{runId}}@example.com`), creates what it needs, checks the endpoints and deletes what it created (except the users, see below). Run each file on its own, in any order.

## Variables

Set on every collection (all have defaults; nothing else is needed):

| Variable | Default | Notes |
|----------|---------|-------|
| `baseUrl` | `http://localhost:5000/api` | Change it to test another host |
| `password` | `secret123` | Throwaway password for the test users, a collection variable (the requests use `{{password}}`) |
| `runId` and the token, id variables | empty | Filled by the first requests of the run |

`users` also has `adminEmail` and `adminPassword` (empty). They are only for the optional "Admin (optional)" folder. Fill them locally (create the admin with `npm run seed:admin` in `server/`); never commit values. When either is empty the whole folder is skipped, so the collection still passes.

The `github` collection has one request that needs internet ("Valid public pull request (needs internet)"); it calls the real GitHub API.

## Run in the Postman app

1. Start the backend (`npm run dev` in `server/`, default port 5000).
2. Import the files from `docs/postman/`.
3. Open a collection, click Run, keep the request order, Run.

## Run with Newman

From the repository root, with the backend running (no install: `npx` downloads Newman):

```
npx newman run docs/postman/<name>.postman_collection.json --env-var baseUrl=http://localhost:5000/api --timeout-request 20000 --delay-request 100
```

Replace `<name>` with `auth`, `users`, `projects`, `tasks`, `comments`, `activity`, `dashboard` or `github`. Add `--reporters cli,json --reporter-json-export <file>` to save a JSON report. Atlas can fail now and then with a TLS or timeout error: run the collection again before treating it as a failure.

## Expected result (Newman 6.2.3, backend on localhost, Atlas database)

| Collection | Covers | Requests run | Assertions | Failed |
|------------|--------|--------------|------------|--------|
| `auth` | register, login, me, validation, wrong password, malformed token | 8 | 14 | 0 |
| `users` | search (query params), profile edit, 403 checks; Admin folder optional | 18 (24 with admin) | 25 | 0 |
| `projects` | CRUD, archive, members, list query params, owner-only 403s | 21 | 28 | 0 |
| `tasks` | CRUD, status PATCH, filters, search, sort, paging, 403s | 26 | 35 | 0 |
| `comments` | CRUD, paging, author/owner rules, 403s | 29 | 35 | 0 |
| `activity` | feed content, paging, limit cap, read-only feed, cascade delete | 15 | 19 | 0 |
| `dashboard` | counts per project, access rules, query injection ignored | 17 | 30 | 0 |
| `github` | issue lookup, URL validation, 401, valid PR (needs internet) | 18 | 31 | 0 |

## Things to know

- Every run leaves the users it registered in the database (emails ending `@example.com`). Projects, tasks, comments and activity are deleted by the collections themselves. Remove the old users by hand when you want, for example in Atlas or mongosh: `db.users.deleteMany({ email: /@example\.com$/ })` (check what matches with `find` first, and only on a test database).
- The optional admin folder of `users` deletes users A and B at its end; without an admin those two users also stay behind.
- The collections do not create an admin account and hold no secrets: no tokens, no connection strings, only the throwaway `password` variable.

## Rubric coverage (backend_schema.md section 3.6)

Counts are requests across all collections (158 total: 55 POST, 59 GET, 17 PUT, 8 PATCH, 19 DELETE).

| Requirement | Requests that exercise it | Count |
|-------------|---------------------------|-------|
| GET | e.g. "Get project", "List tasks - sorted by priority with paging", "Get the feed (A)" | 59 |
| POST | e.g. "Register", "Create task", "Add comment", "Add member" | 55 |
| PUT | e.g. "Update project", "Update task", "Edit comment", users profile update | 17 |
| PATCH | "Change task status (A)", "Archive project (A)", "Change role as normal user (A)" (403), admin role change (optional folder) | 8 |
| DELETE | "Delete project", "Delete task", comments delete, "Delete user as normal user (A deletes B)" (403) | 19 |
| Route parameters (`:projectId`, `:taskId`, `:commentId`, `:userId`) | any request using `{{projectId}}`, `{{taskId}}`, `{{commentId}}`, `{{userId}}` | 104 |
| Query parameters: filter, search, sort, pagination | tasks filter/search/sort/paging, "List projects with query params (A)", "Search users by name (A)", comments and activity `page`/`limit`, github `url` | 23 |
| Custom middleware: `projectAccess` | outsider 403 requests in projects, tasks, comments, activity, dashboard | 18 (all 403 checks) |
| Custom middleware: `requireRole` | "Change role as normal user (A)", "Delete user as normal user (A deletes B)" (403) | 2 (plus 4 in the optional admin folder) |
| Custom middleware: `activityLogger` | the activity collection: "Create project (A) - logs project.created", "Create task (A) - logs task.created", "Move task to Review (A) - logs task.status_changed", then the feed requests | 5 |
| JWT and protected routes | every "no token" / malformed token request returns 401: login wrong password, "Get me - no token", "Get me - malformed token", and no-token requests in users, projects, tasks, comments, activity, dashboard, github | 10 |
| CRUD on MongoDB | users, projects, tasks, comments are created, read, updated and deleted; activity is written by `activityLogger` and read, and removed with its project | all five collections |

Every rubric item has at least one request. The only gaps: user role change and user delete by an admin are exercised only when admin credentials are filled in (otherwise the 403 checks cover those routes), and activity has no direct create or update request by design (the feed is read-only).
