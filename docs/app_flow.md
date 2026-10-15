# TaskBoard: App Flow Document

**Status:** Draft v0.1
**Depends on:** `prd.md` v1.0, `trd.md`

---

## 1. Screen Map and Routes

| Route | Screen | Access | Module owner |
|-------|--------|--------|--------------|
| `/register` | Register | Public | Harshal |
| `/login` | Login | Public | Harshal |
| `/projects` | Project list (search, filter, pagination) | Logged in | Jay |
| `/projects/new` | Create project form | Logged in | Jay |
| `/projects/:projectId` | Kanban board | Project member | Naitik |
| `/projects/:projectId/settings` | Edit project, manage members | Project owner | Jay |
| `/projects/:projectId/dashboard` | Dashboard charts | Project member | Jaydip |
| `/projects/:projectId/activity` | Activity feed | Project member | Jaydip |
| `/profile` | View and edit own profile | Logged in | Harshal |
| `/admin/users` | Manage all users | Admin | Harshal |
| `*` | Not found page | Public | Shared |

Task details open as a **modal on the board** (not a separate route), and comments live inside that modal.

## 2. Global Behaviour

- **Unauthenticated user** opening any protected route is redirected to `/login`, then returned to the page they wanted after login.
- **Logged-in user** opening `/login` or `/register` is redirected to `/projects`.
- **Navbar** (all logged-in screens): logo, Projects link, Profile menu (Profile, Logout), plus an Admin link for admins.
- **Expired or invalid token:** any API call returning 401 clears the session and redirects to `/login` with a "Session expired" message.
- **No access (403):** show a "You don't have access" screen with a link back to Projects.
- **Every data screen** shows a loader while fetching, an error message with Retry on failure, and an empty-state message when there is nothing to show.

## 3. Primary User Journeys

### 3.1 New user signs up and creates a first project

1. Opens the app, lands on `/login`, clicks "Create account".
2. Fills name, email, password on `/register` and submits.
3. On success, is logged in automatically and redirected to `/projects`.
4. Sees an empty state: "No projects yet", with a "Create project" button.
5. Clicks it, fills name and description on `/projects/new`, submits.
6. Redirected to the new project's board `/projects/:projectId` with four empty columns. The user is now the project **Owner**.

**Errors:** duplicate email shows "Email already registered"; weak or missing fields show inline validation messages.

### 3.2 Owner invites a member

1. On the board, clicks Settings, then opens `/projects/:projectId/settings`.
2. Types a name or email in the member search box (searches users).
3. Selects a user and clicks "Add member". The member list updates.
4. To remove, clicks Remove next to a member and confirms.

### 3.3 Create and work on a task

1. On the board, clicks "Add task" (top of the To Do column).
2. Modal opens: title (required), description, priority, assignee (project members only), labels, due date, optional GitHub issue URL.
3. Submits. The card appears in To Do.
4. Opens the card to see the detail modal. Changes status by dropdown (or drag-and-drop if built), which sends a status update. The card moves to the new column.
5. Edits fields and saves, or deletes the task after a confirmation dialog.

### 3.4 Filter the board

1. Uses the filter bar above the board: status, priority, assignee, label, due date, text search.
2. The board refetches with the chosen filters. A "Clear filters" button resets them.

### 3.5 Comment on a task

1. Opens a task card and scrolls to Comments.
2. Types a comment and submits. It appears at the bottom with author and time.
3. Authors can edit or delete their own comments. The project Owner and Admin can delete any comment.

### 3.6 GitHub issue lookup

1. In the task modal, pastes a GitHub issue URL and clicks "Fetch".
2. The app shows the issue title and state (open or closed) and saves it on the task.
3. If the URL is invalid or the issue is not found, shows an inline error and saves nothing.

### 3.7 Check progress

1. Opens `/projects/:projectId/dashboard`.
2. Sees charts: tasks by status, tasks by priority, overdue tasks count, tasks per member.
3. Opens `/projects/:projectId/activity` to see a reverse-chronological feed such as "Harshal moved 'Login page' to Review", with pagination.

### 3.8 Admin manages users

1. Admin opens `/admin/users`, sees all users with search and pagination.
2. Can change a user's role or delete a user (confirmation required).

## 4. State Flow Summary

| Action | Request | Success result | Failure result |
|--------|---------|----------------|----------------|
| Register | `POST /api/auth/register` | Logged in, go to `/projects` | Inline error |
| Login | `POST /api/auth/login` | Token stored, go to `/projects` | "Invalid credentials" |
| Create project | `POST /api/projects` | Go to board | Inline error |
| Add task | `POST .../tasks` | Card appears | Error toast, modal stays open |
| Move task | `PATCH .../tasks/:taskId/status` | Card moves columns | Card returns, error toast |
| Delete task | `DELETE .../tasks/:taskId` | Card removed | Error toast |
| Add comment | `POST .../comments` | Comment appended | Inline error |

## 5. Navigation Rules Summary

- Board is the home of a project; Dashboard, Activity, and Settings are tabs next to it.
- Settings tab is visible only to the project Owner (and Admin).
- Breadcrumb: Projects > Project name > current tab.
- Back button always returns to the previous screen without losing filters (filters are kept in the URL query string).
