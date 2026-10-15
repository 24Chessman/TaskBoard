# TaskBoard: Product Requirements Document (PRD)

**Status:** v1.0 approved baseline (decisions recorded in section 9)
**Course:** IT645, MERN stack course project
**Team size:** 4

---

## 1. Overview

TaskBoard is a lightweight project and task tracker (a mini-Jira). Teams create projects, invite members, and manage work on a Kanban board with columns for To Do, In Progress, Review, and Done. Every task carries an assignee, priority, labels, and a due date. Members discuss tasks through comments, every change is recorded in an activity log, and a dashboard shows progress at a glance.

## 2. Problem Statement

Small student and early-stage teams track work in chats, spreadsheets, or memory. Work gets lost, ownership is unclear, and nobody sees overall progress. Full tools like Jira are heavy for small teams. TaskBoard offers just enough structure: who is doing what, by when, and how far along the project is.

## 3. Target Audience

- **Primary:** student project teams (3 to 8 people)
- **Secondary:** small teams and freelancers who need a simple board without enterprise setup

## 4. Goals and Non-Goals

**Goals (v1)**
- Register, log in, and manage projects and members securely
- Create, assign, filter, and move tasks across a Kanban board
- Collaborate through task comments, with an activity trail
- Show project progress through dashboard charts
- Satisfy every IT645 rubric item with a deployed, demo-ready app

**Non-Goals (v1)**
- Sprints, epics, time tracking, or custom workflows
- Real-time collaboration (WebSockets), email notifications, file attachments
- Mobile native app (responsive web only)
- Full GitHub integration (v1 has only a minimal issue lookup, see section 6)

## 5. User Roles

| Role | Scope | Capabilities |
|------|-------|--------------|
| **Admin** | Whole system | View and manage all users and projects, remove abusive content |
| **Owner** | One project | Edit or delete the project, add or remove members, manage all tasks |
| **Member** | One project | Create tasks, edit assigned tasks, move tasks, comment |

*Proposed model: Admin is a global role on the user account. Owner and Member are per-project roles. A project creator automatically becomes its Owner.*

## 6. Core Features

### Must-have (v1)

**M1. Authentication and Users** *(Harshal)*
- Register and login with JWT, protected routes, logout
- Profile view and edit, user search for adding members
- Role-based access (Admin vs normal user)
- Activity-log middleware (records who did what)

**M2. Projects and Teams** *(Jay)*
- Create, view, edit, and delete projects
- Add and remove members, list projects with filters and pagination

**M3. Tasks and Kanban Board** *(Naitik)*
- Create, view, edit, and delete tasks
- Fields: title, description, status, priority, assignee, **labels**, **due date**
- Move tasks between columns (status update)
- Filter and sort by status, priority, assignee, label, and due date
- Minimal GitHub issue lookup: attach an issue URL to a task and show its title and state (satisfies the third-party API requirement)

**M4. Comments, Activity, and Dashboard** *(Jaydip)*
- Add, edit, and delete comments on tasks
- Project activity feed (reads the log written by M1 middleware)
- **Dashboard charts:** tasks by status, tasks by priority, overdue tasks, tasks per member

### Should-have (v1, if time allows)
- Drag-and-drop between columns (v1 baseline uses a status dropdown or buttons)
- Responsive polish and dark mode

### Later (v2)
- **Full GitHub integration:** link commits and sync issue status via the GitHub API
- Notifications, file attachments, real-time updates

## 7. Success Criteria

- Full flow works end to end: sign up, create project, add member, create task, move task, comment, view dashboard
- All five HTTP methods (GET, POST, PUT, PATCH, DELETE) used meaningfully
- Every member demonstrates frontend, backend, and Postman tests for their own module in the viva
- App deployed with a working public URL, README and short report submitted
- No secrets in the repository (`.env` ignored, `.env.example` provided)

## 8. Constraints and Assumptions

- Stack is fixed: MongoDB, Express, React, Node (MERN), Tailwind CSS, React Router
- Course rubric (IT645 guidelines) is the acceptance baseline
- Team of four with mixed MERN experience, so scope is kept to four modules
- A meaningful third-party Web API is required by the rubric. v1 uses the GitHub REST API (issue lookup only)

## 9. Decisions Log

1. **Third-party API (v1):** minimal GitHub issue lookup (paste issue URL, show title and state). Full integration moves to v2.
2. **Drag-and-drop:** should-have. v1 baseline moves tasks with a dropdown or buttons.
3. **Role model:** Admin (global) plus Owner and Member (per project).
