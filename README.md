# TaskBoard

TaskBoard is a project and task tracker built with the MERN stack: teams create projects, add members and move tasks across a Kanban board.

Live site: https://taskboard-gu4g.onrender.com

The site runs on a free hosting plan that sleeps when it is idle, so the first load can take up to a minute.

Course project for IT645, DA-IICT.

## Features

**Accounts and roles**
- Register, log in and stay signed in with a JWT. Passwords are stored as bcrypt hashes.
- Edit your own name, email and password on the Profile page.
- Two role levels: a global role (user or admin) and a role inside each project (owner or member).

**Projects and members**
- Create, rename, archive, reactivate and delete projects (owner only).
- Search the project list and filter it by status.
- Owners add members by searching for users and can remove them; a project always keeps at least one owner.

**Board and drag and drop**
- Four columns: To Do, In Progress, Review, Done.
- Move a card to another column by dragging it with the mouse, by touch (press and hold), or by keyboard (Space to pick up, arrow keys to choose a column, Space to drop). The status can also be changed in the task drawer.
- Search and filter the board by priority, assignee, label and due date.

**Tasks and comments**
- Tasks have a title, description, status, priority, labels, due date and one assignee.
- A task drawer shows the details, lets you edit them, and holds the task's comments. Authors edit their own comments; authors, project owners and admins delete them.

**Activity feed**
- Every project keeps an append-only feed of changes: project and member changes, task creation, updates, status changes, deletions and comments.

**Dashboard**
- Per-project totals by status and priority, overdue and due-soon counts, unassigned tasks, workload per member, top labels and tasks created per day, shown as charts.

**GitHub issue links**
- A task can link a GitHub issue or pull request. A Look up button fetches its title and state from GitHub; the task form, drawer and board card show the link.

**Admin**
- Admins see every project and have a Users page (`/admin/users`) to list users, change roles and delete accounts.

## Tech stack

| Part | Technology | Version (from package.json) |
|------|------------|-----------------------------|
| Runtime | Node.js | >= 18 |
| Server | Express | ^4.21.2 |
| Database | MongoDB (Atlas) with Mongoose | ^8.9.5 |
| Auth | jsonwebtoken, bcryptjs | ^9.0.3, ^3.0.3 |
| Server support | cors, dotenv, morgan, nodemon (dev) | ^2.8.5, ^16.4.7, ^1.10.0, ^3.1.9 |
| Client | React, react-dom | ^18.3.1 |
| Routing and HTTP | react-router-dom, axios | ^6.30.6, ^1.21.0 |
| Build and styling | Vite, Tailwind CSS, PostCSS, Autoprefixer | ^8.3.5, 3.4, ^8.5.32, ^10.6.2 |
| UI libraries | lucide-react (icons), Recharts (charts), @dnd-kit/core (drag and drop) | ^1.66.0, ^3.10.1, ^6.3.1 |

The interface uses IBM Plex Sans and IBM Plex Mono, loaded from Google Fonts.

## Architecture

```
server/   Express API: models, controllers, routes, middleware, scripts (seedAdmin)
client/   React app built with Vite (pages, components, api, hooks, context, utils)
docs/     product, technical and design documents, schema contract, Postman collections
```

- The server is an Express REST API under `/api` that stores data in MongoDB through Mongoose. Models: User, Project, Task, Comment, Activity.
- The client calls the API with axios using the relative base path `/api`. In development Vite serves the client on its own port and proxies `/api` to the server. In production, when `NODE_ENV=production` and `client/dist` exists, Express serves the built client itself (with a fallback to `index.html` for page URLs), so the app and API share one origin and one URL.
- Every route except register, login and the health check needs `Authorization: Bearer <token>`.
- Role model: users are `user` or `admin`. Inside a project a member is `owner` or `member`. Admins can act as owners on any project. Project routes return 403 to users who are not members.
- Custom middleware: `auth`, `projectAccess`, `requireProjectOwner`, `requireRole`, `activityLogger` (writes the activity feed), plus not-found, error, CORS, security-header and static-file middleware.

More detail: `docs/prd.md`, `docs/trd.md`, `docs/backend_schema.md`, `docs/design.md`.

## Run locally

Prerequisites: Node.js 18 or newer, npm, and a MongoDB database (the project uses MongoDB Atlas).

1. Install dependencies for both parts, from the repository root:

   ```
   npm --prefix server install
   npm --prefix client install
   ```

2. Create `server/.env` from `server/.env.example` and fill in the values. The variable names:

   | Variable | Purpose |
   |----------|---------|
   | `PORT` | Port of the API server (default 5000) |
   | `MONGO_URI` | MongoDB connection string |
   | `JWT_SECRET` | Secret used to sign and verify tokens |
   | `JWT_EXPIRES_IN` | Lifetime of a token |
   | `CLIENT_ORIGIN` | Allowed origin for CORS (default `http://localhost:5173` in development) |
   | `GITHUB_TOKEN` | Optional GitHub token for higher GitHub API rate limits |
   | `ADMIN_NAME` | Name of the admin account created by `npm run seed:admin` |
   | `ADMIN_EMAIL` | Email of that admin account |
   | `ADMIN_PASSWORD` | Password of that admin account (at least 6 characters) |

3. Start the server and the client in two terminals:

   ```
   cd server
   npm run dev
   ```

   ```
   cd client
   npm run dev
   ```

   The API listens on port 5000 and the client on Vite's default port 5173. Open http://localhost:5173.

4. Optional: create an admin account. With `MONGO_URI`, `ADMIN_NAME`, `ADMIN_EMAIL` and `ADMIN_PASSWORD` set in `server/.env`, run `npm run seed:admin` inside `server/`. If a user with that email already exists, that user is promoted to admin and the password is left unchanged.

Other scripts: `npm start` in `server/` (no file watching), `npm run build` and `npm run preview` in `client/`.

## API

The full contract (data model, endpoints, authorization rules, validation) is in [docs/backend_schema.md](docs/backend_schema.md). All paths start with `/api`.

| Method | Path | Access |
|--------|------|--------|
| GET | `/health` | Public |
| POST | `/auth/register` | Public |
| POST | `/auth/login` | Public |
| GET | `/auth/me` | Auth |
| GET | `/users?search=&page=&limit=` | Auth |
| GET | `/users/:userId` | Auth |
| PUT | `/users/:userId` | Self or Admin |
| PATCH | `/users/:userId/role` | Admin |
| DELETE | `/users/:userId` | Admin |
| POST | `/projects` | Auth |
| GET | `/projects?search=&status=&page=&limit=` | Auth |
| GET | `/projects/:projectId` | Project member |
| PUT | `/projects/:projectId` | Project owner |
| PATCH | `/projects/:projectId/status` | Project owner |
| DELETE | `/projects/:projectId` | Project owner |
| POST | `/projects/:projectId/members` | Project owner |
| DELETE | `/projects/:projectId/members/:userId` | Project owner |
| POST | `/projects/:projectId/tasks` | Project member |
| GET | `/projects/:projectId/tasks?status=&priority=&assignee=&label=&dueBefore=&search=&sort=&page=&limit=` | Project member |
| GET | `/projects/:projectId/tasks/:taskId` | Project member |
| PUT | `/projects/:projectId/tasks/:taskId` | Owner, creator or assignee |
| PATCH | `/projects/:projectId/tasks/:taskId/status` | Project member |
| DELETE | `/projects/:projectId/tasks/:taskId` | Owner or creator |
| POST | `/projects/:projectId/tasks/:taskId/comments` | Project member |
| GET | `/projects/:projectId/tasks/:taskId/comments?page=&limit=` | Project member |
| PUT | `/projects/:projectId/tasks/:taskId/comments/:commentId` | Comment author |
| DELETE | `/projects/:projectId/tasks/:taskId/comments/:commentId` | Author, owner or admin |
| GET | `/projects/:projectId/activity?page=&limit=` | Project member |
| GET | `/projects/:projectId/dashboard` | Project member |
| GET | `/github/issue?url=` | Auth |

## Testing

The API is tested with eight Postman collections in `docs/postman/` (auth, users, projects, tasks, comments, activity, dashboard, github), covering 158 requests. They run against a live server and database. With the server running, from the repository root:

```
npx newman run docs/postman/<name>.postman_collection.json --env-var baseUrl=http://localhost:5000/api --timeout-request 20000 --delay-request 100
```

Replace `<name>` with a collection name. Each collection registers its own throwaway users (emails ending in `@example.com`), so run them against a development database. The users are left in the database afterwards. The optional admin part of the `users` collection is skipped unless admin credentials are set locally. Instructions for the Postman app, the expected results per collection and the rubric coverage table are in [docs/postman/README.md](docs/postman/README.md).

There are no automated tests for the client.

## Deployment

The app deploys as one web service (Render is the host named in `docs/trd.md`) with MongoDB Atlas as the database.

| Setting | Value |
|---------|-------|
| Root directory | empty (repository root) |
| Build command | `npm run render-build` |
| Start command | `npm start` |
| Health check path | `/api/health` |
| Node version | 18 or newer |

Required environment variables: `NODE_ENV=production`, `MONGO_URI`, `JWT_SECRET` (at least 32 characters). Optional: `JWT_EXPIRES_IN`, `GITHUB_TOKEN`, and `CLIENT_ORIGIN` (only when a client on another origin calls the API). The host supplies `PORT`.

In production the server refuses to start when `MONGO_URI` or `JWT_SECRET` is missing, or when `JWT_SECRET` is shorter than 32 characters. In MongoDB Atlas, Network Access must allow the host's outbound connections.

## Team

Course: IT645, DA-IICT.

| Name | GitHub | Modules |
|------|--------|---------|
| Naitik | 24Chessman | Tasks and board, GitHub lookup |
| Harshal | HarshalPrajapati | Auth, users, activity logger |
| Jay | JayTrivedi18 | Projects and teams |
| Jaydip | jaydip679 | Comments, activity feed, dashboard |

## Known limitations

- The server has no rate limiting.
- There is no Content-Security-Policy header: the client loads Google Fonts and uses inline styles. Other basic security headers are set.
- The GitHub lookup cache is held in server memory (up to 100 entries for 5 minutes) and is lost on restart.
- A task has a single assignee.
- Free-tier hosting sleeps when idle, so the first request after a quiet period is slow.

## Screenshots

Screenshots will be added later in `docs/screenshots`.
