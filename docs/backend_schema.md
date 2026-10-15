# TaskBoard: Backend Schema Document

**Status:** Draft v0.1
**Depends on:** `prd.md` v1.0, `trd.md`

This is the contract between the four modules. Change it only by agreement, and update this file first.

---

## 1. Data Model Overview

```
User 1 ---- * Project (via members[])      Project 1 ---- * Task
Task 1 ---- * Comment                      Project 1 ---- * Activity
User 1 ---- * Task (assignee, createdBy)   User 1 ---- * Comment (author)
```

All schemas live in `server/src/models/` and use `timestamps: true` (adds `createdAt`, `updatedAt`).

## 2. Schemas

### 2.1 User (`User.js`, owner: Harshal)

| Field | Type | Rules |
|-------|------|-------|
| `name` | String | required, trimmed, 2 to 50 chars |
| `email` | String | required, unique, lowercase, valid format |
| `password` | String | required, min 6 chars, stored as bcrypt hash, `select: false` |
| `role` | String | enum `user`, `admin`; default `user` |

Index: unique on `email`. Never return `password` in any response.

### 2.2 Project (`Project.js`, owner: Jay)

| Field | Type | Rules |
|-------|------|-------|
| `name` | String | required, trimmed, 3 to 80 chars |
| `description` | String | optional, max 500 chars |
| `status` | String | enum `active`, `archived`; default `active` |
| `members` | Array of `{ user: ObjectId(User), role: String }` | role enum `owner`, `member`; creator is added as `owner`; a user appears at most once |

Rule: every project must always have at least one `owner`.
Index: `members.user` (to list a user's projects quickly).

### 2.3 Task (`Task.js`, owner: Naitik)

| Field | Type | Rules |
|-------|------|-------|
| `project` | ObjectId(Project) | required |
| `title` | String | required, trimmed, 1 to 120 chars |
| `description` | String | optional, max 2000 chars |
| `status` | String | enum `todo`, `in_progress`, `review`, `done`; default `todo` |
| `priority` | String | enum `low`, `medium`, `high`; default `medium` |
| `assignee` | ObjectId(User) | optional; must be a member of the project |
| `createdBy` | ObjectId(User) | required, set by server |
| `labels` | [String] | optional, max 5, each 1 to 20 chars, lowercase |
| `dueDate` | Date | optional |
| `githubIssue` | `{ url, title, state }` | optional; filled from the GitHub lookup |

Indexes: `{ project, status }`, `{ project, dueDate }`.

### 2.4 Comment (`Comment.js`, owner: Jaydip)

| Field | Type | Rules |
|-------|------|-------|
| `task` | ObjectId(Task) | required |
| `project` | ObjectId(Project) | required (for access checks) |
| `author` | ObjectId(User) | required, set by server |
| `text` | String | required, trimmed, 1 to 1000 chars |

Index: `{ task, createdAt }`.

### 2.5 Activity (`Activity.js`, written by Harshal's middleware, read by Jaydip)

| Field | Type | Rules |
|-------|------|-------|
| `project` | ObjectId(Project) | required |
| `task` | ObjectId(Task) | optional |
| `actor` | ObjectId(User) | required |
| `action` | String | enum: `project.created`, `project.updated`, `member.added`, `member.removed`, `task.created`, `task.updated`, `task.status_changed`, `task.deleted`, `comment.added` |
| `message` | String | readable summary, for example "moved 'Login page' to Review" |

Index: `{ project, createdAt: -1 }`. Activity is append-only: no update or delete endpoints.

## 3. Endpoints

All paths start with `/api`. "Auth" means a valid JWT is required. `P-Member` means the user belongs to the project, `P-Owner` means project owner, `Admin` means global admin (Admin can also act as owner on any project).

### 3.1 Auth and Users (Harshal)

| Method | Path | Access | Purpose | Success |
|--------|------|--------|---------|---------|
| POST | `/auth/register` | Public | Create account, return token | 201 |
| POST | `/auth/login` | Public | Login, return token | 200 |
| GET | `/auth/me` | Auth | Current user | 200 |
| GET | `/users?search=&page=&limit=` | Auth | Search users (name or email) | 200 |
| GET | `/users/:userId` | Auth | One user's public profile | 200 |
| PUT | `/users/:userId` | Self or Admin | Update profile (name, email, password) | 200 |
| PATCH | `/users/:userId/role` | Admin | Change role | 200 |
| DELETE | `/users/:userId` | Admin | Delete user | 204 |

### 3.2 Projects and Members (Jay)

| Method | Path | Access | Purpose | Success |
|--------|------|--------|---------|---------|
| POST | `/projects` | Auth | Create project (creator becomes owner) | 201 |
| GET | `/projects?search=&status=&page=&limit=` | Auth | Projects the user belongs to (Admin: all) | 200 |
| GET | `/projects/:projectId` | P-Member | Project details with members | 200 |
| PUT | `/projects/:projectId` | P-Owner | Update name and description | 200 |
| PATCH | `/projects/:projectId/status` | P-Owner | Archive or reactivate | 200 |
| DELETE | `/projects/:projectId` | P-Owner | Delete project and its tasks, comments, activity | 204 |
| POST | `/projects/:projectId/members` | P-Owner | Add member `{ userId }` | 201 |
| DELETE | `/projects/:projectId/members/:userId` | P-Owner | Remove member (cannot remove the last owner) | 204 |

### 3.3 Tasks and GitHub (Naitik)

| Method | Path | Access | Purpose | Success |
|--------|------|--------|---------|---------|
| POST | `/projects/:projectId/tasks` | P-Member | Create task | 201 |
| GET | `/projects/:projectId/tasks?status=&priority=&assignee=&label=&dueBefore=&search=&sort=&page=&limit=` | P-Member | List and filter tasks | 200 |
| GET | `/projects/:projectId/tasks/:taskId` | P-Member | One task | 200 |
| PUT | `/projects/:projectId/tasks/:taskId` | P-Member (Owner, creator, or assignee) | Full update | 200 |
| PATCH | `/projects/:projectId/tasks/:taskId/status` | P-Member | Change status only | 200 |
| DELETE | `/projects/:projectId/tasks/:taskId` | P-Owner or creator | Delete task and its comments | 204 |
| GET | `/github/issue?url=` | Auth | Look up a GitHub issue (title, state, url) | 200 |

`sort` accepts `dueDate`, `-dueDate`, `priority`, `createdAt`, `-createdAt`.

### 3.4 Comments, Activity, Dashboard (Jaydip)

| Method | Path | Access | Purpose | Success |
|--------|------|--------|---------|---------|
| POST | `/projects/:projectId/tasks/:taskId/comments` | P-Member | Add comment | 201 |
| GET | `/projects/:projectId/tasks/:taskId/comments?page=&limit=` | P-Member | List comments (oldest first) | 200 |
| PUT | `/projects/:projectId/tasks/:taskId/comments/:commentId` | Comment author | Edit comment | 200 |
| DELETE | `/projects/:projectId/tasks/:taskId/comments/:commentId` | Author, P-Owner, or Admin | Delete comment | 204 |
| GET | `/projects/:projectId/activity?page=&limit=` | P-Member | Activity feed (newest first) | 200 |
| GET | `/projects/:projectId/dashboard` | P-Member | Aggregated stats (see 3.5) | 200 |

### 3.5 Dashboard response shape

```json
{
  "success": true,
  "data": {
    "byStatus": { "todo": 4, "in_progress": 2, "review": 1, "done": 7 },
    "byPriority": { "low": 3, "medium": 8, "high": 3 },
    "overdue": 2,
    "perMember": [ { "userId": "...", "name": "Naitik", "total": 5, "done": 3 } ]
  }
}
```

Computed with MongoDB aggregation pipelines (`$match`, `$group`).

### 3.6 Rubric coverage check

| Requirement | Where it is met |
|-------------|-----------------|
| GET, POST, PUT, PATCH, DELETE all used | Every module, with PATCH on status and role |
| Route parameters | `:projectId`, `:taskId`, `:commentId`, `:userId` |
| Query parameters (filter, search, sort, pagination) | Projects list, tasks list, users search, comments, activity |
| Custom middleware | `activityLogger`, `projectAccess`, `requireRole` |
| JWT and protected routes | Everything except register and login |
| CRUD on MongoDB | All five collections |

## 4. Authorization Rules (summary)

1. **Authentication:** every route except `/auth/register` and `/auth/login` requires `Authorization: Bearer <token>`.
2. **Project access:** a project, task, comment, activity, or dashboard route returns 403 if the user is not a member of that project (Admin bypasses).
3. **Owner-only:** edit, archive, or delete a project, and add or remove members.
4. **Tasks:** any member creates tasks; Owner, creator, or assignee can edit; Owner or creator can delete; any member can change status.
5. **Comments:** only the author edits; author, Owner, or Admin deletes.
6. **Users:** a user edits only their own profile; role changes and user deletion are Admin only.
7. **Assignee check:** a task's `assignee` must be a member of the same project (400 otherwise).
8. **Cascades:** deleting a project removes its tasks, comments, and activity; deleting a task removes its comments.

## 5. Validation and Error Rules

- Validate required fields, types, enum values, and string lengths before saving; return 400 with an `errors` array of `{ field, message }`.
- Invalid ObjectId in a route returns 400; valid but missing resource returns 404.
- Duplicate email returns 409.
- Wrong credentials return 401 with a generic message (do not reveal which part was wrong).
- Pagination defaults: `page=1`, `limit=10`, maximum `limit=50`. List responses include `{ data, page, limit, total }`.
- Errors use the shape from `trd.md`: `{ "success": false, "message": "...", "errors": [] }`.

## 6. Security Rules

- Hash passwords with bcrypt (cost 10 or more); never log passwords or tokens.
- Secrets only in `.env`; `.env` in `.gitignore`; `.env.example` committed.
- Whitelist fields on create and update (never spread `req.body` directly into a model), so users cannot set `role`, `createdBy`, or `project` themselves.
- Check access on the server for every request; never trust the frontend.
- `password` field excluded from queries by default (`select: false`).
