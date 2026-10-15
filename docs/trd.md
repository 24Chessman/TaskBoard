# TaskBoard: Technical Requirements Document (TRD)

**Status:** Draft v0.1 (awaiting team confirmation)
**Depends on:** `prd.md` v1.0

---

## 1. Architecture Overview

A standard three-tier MERN application:

```
React (Vite) SPA  --HTTP/JSON-->  Express API (Node)  --Mongoose-->  MongoDB Atlas
                                       |
                                       +--> GitHub REST API (issue lookup)
```

- The React app talks only to the Express API under `/api`.
- The Express API is the only component that touches MongoDB and the GitHub API.
- **Single deployment:** in production, Express serves the built React app with `express.static()`, so the whole project has one public URL. In development, Vite runs on its own port and proxies `/api` to Express.

## 2. Tech Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| Runtime | Node.js 20 LTS | ES modules (`import/export`) |
| Backend framework | Express.js | REST API |
| Database | MongoDB Atlas (free tier) | Accessed through Mongoose |
| ODM | Mongoose | Schemas in `/models` |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` | Token sent as `Authorization: Bearer <token>` |
| Frontend | React 18 + Vite | Functional components and hooks only |
| Styling | Tailwind CSS | Responsive, semantic HTML |
| Routing | React Router v6 | Protected routes via a wrapper component |
| HTTP client | axios | One shared instance with auth interceptor |
| Charts | Recharts | Dashboard charts |
| Drag-and-drop (should-have) | `@hello-pangea/dnd` | Added only after the v1 baseline works |
| Testing | Postman | Collections committed to the repo |
| Hosting | Render (app) + MongoDB Atlas | Frontend and backend on one service |

## 3. Backend Design

### 3.1 Structure

Each module is organised as routes, controllers, models, and middleware, as the rubric requires.

```
server/
  src/
    config/        db.js (Mongo connection)
    models/        User.js, Project.js, Task.js, Comment.js, Activity.js
    routes/        auth.routes.js, user.routes.js, project.routes.js,
                   task.routes.js, comment.routes.js, dashboard.routes.js
    controllers/   one controller file per route file
    middleware/    auth.js (verify JWT), requireRole.js, projectAccess.js,
                   activityLogger.js (custom), errorHandler.js, notFound.js
    services/      github.service.js (third-party API calls)
    utils/         ApiError.js, asyncHandler.js
    app.js         middleware stack and route mounting
    server.js      loads env, connects DB, starts server
  .env.example
```

### 3.2 Middleware Stack (order matters)

1. `cors()`
2. `morgan('dev')` request logging
3. `express.json()`
4. `express.static()` serving the built React app (production)
5. Route-level chain, for example: `auth` then `projectAccess` then controller
6. `activityLogger` (custom) on write routes
7. `notFound` then `errorHandler` (last)

### 3.3 API Conventions

- Base path: `/api`
- Resource-oriented URLs with route parameters for identity, for example `/api/projects/:projectId/tasks/:taskId`
- Query parameters for filter, search, sort, and pagination, for example `?status=todo&priority=high&sort=dueDate&page=2&limit=10`
- HTTP methods: GET (read), POST (create), PUT (full update), PATCH (partial update such as task status), DELETE (remove)
- Status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 500 Server Error
- Error response shape (all errors use it):

```json
{ "success": false, "message": "Human-readable reason", "errors": [] }
```

- Success response shape:

```json
{ "success": true, "data": {} }
```

Detailed endpoint tables belong in `backend_schema.md`.

### 3.4 Authentication and Authorization

- Passwords hashed with bcrypt (never stored or logged in plain text).
- JWT signed with `JWT_SECRET`, with an expiry (for example 7 days).
- `auth` middleware verifies the token and attaches `req.user`.
- `requireRole('admin')` guards admin-only routes.
- `projectAccess` checks that the user is an Owner or Member of the project before any project, task, or comment route runs. Owner-only actions (edit or delete project, manage members) check the project role.

### 3.5 Third-Party API: GitHub (v1 minimal)

- Backend endpoint (for example `GET /api/github/issue?url=...`) calls the GitHub REST API for a single issue and returns title, state, and link.
- The frontend never calls GitHub directly, so a token (if used) stays on the server.
- `GITHUB_TOKEN` is optional (it only raises rate limits). Handle failures (404, rate limit, network) with clear error messages.

### 3.6 Environment Variables

All secrets live in `.env` (listed in `.gitignore`), with a matching `.env.example` committed.

| Variable | Purpose |
|----------|---------|
| `PORT` | API port |
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRES_IN` | Token lifetime |
| `CLIENT_ORIGIN` | Allowed CORS origin (development) |
| `GITHUB_TOKEN` | Optional, raises GitHub rate limit |

Frontend (Vite) only gets non-secret values, for example `VITE_API_BASE_URL`.

## 4. Frontend Design

### 4.1 Structure

```
client/
  src/
    api/           axios instance + one file per resource
    components/    shared, reusable UI (Button, Modal, Loader, ErrorMessage, ...)
    context/       AuthContext.jsx
    hooks/         useAuth, useFetch (loading / success / error handling)
    pages/         Login, Register, Projects, Board, Dashboard, Profile, ...
    routes/        ProtectedRoute.jsx, AdminRoute.jsx
    App.jsx, main.jsx
```

### 4.2 State Management

- **Auth state:** React Context (`AuthContext`) holding user and token, persisted in `localStorage`.
- **Server data:** local component state with `useState` and `useEffect`, wrapped in a reusable `useFetch` hook that exposes `loading`, `data`, and `error`.
- **Other hooks:** `useRef` (modal focus, comment box), `useContext` (auth).
- No Redux. For this scope it adds code without adding rubric value.

### 4.3 UI Requirements

- Semantic HTML (`header`, `nav`, `main`, `section`, `button`).
- Responsive layout with Tailwind breakpoints (board scrolls horizontally on small screens).
- Every data screen handles loading, success, and error states.
- React Router for navigation, with protected and admin-only routes.
- Component naming: PascalCase. Variables and functions: camelCase.

## 5. Code Standards

- ES6+, `const`/`let`, arrow functions, async/await.
- No duplicated logic: shared helpers in `utils/`, shared UI in `components/`.
- One responsibility per file; keep controllers thin and move reusable logic to services.
- Consistent naming: files in camelCase or PascalCase for components, routes as `*.routes.js`.
- Git: feature branches per module, pull requests reviewed by another member, `main` stays deployable.

## 6. Testing Strategy

- Postman collection per module, stored in `/docs/postman`.
- Each endpoint tested for success and failure: valid input, invalid input, missing token, wrong role, nonexistent ID.
- Auth tests: register, login, expired or malformed token, access to protected routes.
- Manual UI walkthrough of the full flow before the demo.

## 7. Deployment

- Build the React app, serve it from Express with `express.static()`.
- Host on Render (Node web service), database on MongoDB Atlas.
- Set environment variables in the Render dashboard (never commit them).
- Allow Render's outbound access in Atlas network settings.
- Deliverables: public URL, GitHub repo, README (description, install steps, structure, API endpoints, env variables), short report with screenshots.

## 8. Risks

| Risk | Mitigation |
|------|------------|
| Two of four members new to MERN | Short starter tutorial first; pair on each member's first endpoint |
| Modules depend on auth and schemas | Auth and shared schemas finished first (week 1) |
| Render free tier sleeps when idle | Open the app before the demo to wake it |
| Drag-and-drop complexity | Treat as optional; baseline uses dropdown status change |

## 9. Open Questions

1. **Single deployment:** serve the React build from Express (one URL, simpler), or deploy frontend and backend separately? *Recommendation: single deployment.*
2. **Module system:** ES modules (`import`) on the backend to match the frontend, rather than CommonJS? *Recommendation: ES modules.*
3. **Hosting:** Render plus Atlas is the default. Does your college require a specific host?
