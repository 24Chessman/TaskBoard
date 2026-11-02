# TaskBoard: Design Brief v2 (design.md)

**Status:** Draft v0.2 (adds the public landing page and findings from the live study of Jira, the Atlassian Design System and two Jira clones), awaiting team confirmation
**Supersedes:** the visual parts of `ui_ux_brief.md` (palette, components, layout). The accessibility rules in `ui_ux_brief.md` section 7 still apply.
**Stack limits:** React 18 + Tailwind v3. The ONLY new dependency allowed for the redesign is `lucide-react` (icons). No component libraries.

---

## 1. Why a redesign

What the current build shows (from screenshots of the Projects, Board and Settings screens):

- No logo, no favicon, and the top bar is plain text ("Projects", "John" as a text button). No avatar, no icons anywhere.
- Buttons that should be icons are words (Refresh, Profile, Clear filters, Add task, Delete).
- A stray scroll arrow (up and down triangles) appears at the right end of the tab row on every project screen: the tab strip is overflowing and showing a scrollbar on Windows. This is a bug to fix.
- The board toolbar uses five large labelled inputs, which eats a third of the screen before any task is visible.
- Priority ("High") is drawn as a pill in the same style as labels, so the two are easy to confuse.
- Empty columns are tall and bare; settings content is narrow and left-aligned with a large empty area on the right.
- Navigation lives in one top bar plus text tabs. As more screens exist, there is no sense of "where am I".

## 2. References and what we borrow

We study how established tools organise work, and borrow **patterns and ideas only**. We do NOT copy logos, icons, names, exact colours, illustrations, wording or pixel layouts of any product.

| Reference | Pattern worth borrowing for TaskBoard |
|-----------|---------------------------------------|
| Jira | Left project sidebar with icon + label items; project avatar (coloured square with initials); board cards that show priority icon, labels, due date and assignee avatar in one compact footer; status shown as a coloured lozenge; issue opens in a two-pane view (content left, details right); "+ Create" at the bottom of each column; avatar group as a quick filter |
| Trello | Very light, scannable cards; coloured label chips; "Add a card" inline at the bottom of a list; badges with small icons (due date, comments) |
| Linear | Dense, calm interface with one accent colour; small consistent icons; status and priority drawn as icons, not words; subtle borders instead of heavy shadows; fast, short transitions |
| Asana | Friendly empty states with an icon and a clear call to action; soft colour use |

Where a reference conflicts with accessibility or with our rules, ours wins (for example, we use sentence-case column titles, not tracked capitals).

### 2.1 Findings from the live study (v0.2)

Sources: atlassian.com/software/jira (viewed in a browser), the Atlassian Design System token pages, and the open-source clones `daniserrano7/jira-clone` (demo viewed) and `namnguyenn17/jira-clone` (repo only; it has no documentation or screenshots, so nothing was taken from it).

**Atlassian Design System (naming and scale, not assets)**
- Tokens are named `category.property.variant.state` and are semantic (text, surface, border, accent). Components use roles, never raw colours. We copy this idea: define roles once in `tailwind.config.js` and CSS variables, and use only roles in components.
- Emphasis levels for accent colours: subtlest, subtle, bold. Our lozenges use "subtle" (soft background, dark text) and our primary button uses "bold".
- Spacing scale is 2, 4, 6, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80px, which fits our 4px grid.
- Radius scale: 2, 4, 6, 8, 12, 16px and full. We use 6 (inputs, buttons), 8 (cards), 12 (columns, drawer).
- Borders are 1px; focus and selected are 2px. Disabled controls use 40% opacity.
- Motion: short is 150ms, long is 250ms. Matches section 5.
- Status colours: danger red, warning orange, success green, information blue, discovery purple. Text on subtle backgrounds uses the 700 or 800 shade for contrast.

**Jira public site (layout ideas)**
- A left-aligned, very large headline with a one-line subhead, and the sign-up form right beside it above the fold. One primary call to action, one secondary (Google sign-in there; Login for us).
- Slim sticky top bar: logo left, a few text links, "Sign in" as a quiet link and "Get it free" as the one filled button.
- A product screenshot directly under the hero, then a logo strip, a feature section, customer quotes with big numbers, and a closing call to action.
- A dismissible announcement bar above the nav. We do not need one.

**Jira clone demo (app ideas)**
- Project card = square project image on the left, name and type on the right.
- Sidebar: project name and type at the top, a collapse arrow, then Board / Analytics / Backlog with icons.
- Breadcrumb "Projects / Name", a big "Board" title, a filter box, an avatar group as quick filters, then three equal columns with the count in the title and a plus icon.
- Cards show the title, a short id, a type icon and a priority flag. Issue opens as a large panel: title and description on the left, comments below, Status / Priority / Assignee / Reporter / Created on the right.
- Keyboard hints in the UI ("Shift + N to create a new issue"). Nice to have, later.
- What we avoid: its all-caps "PROJECTS" page title, the very bare project page, and the login that is only a user dropdown.

## 3. Design principles

1. **Icons for actions, words for meaning.** Common actions get an icon (with an accessible name and a tooltip). Anything unusual keeps a text label.
2. **One accent.** Indigo is the only brand colour. Status and priority colours are semantic and small.
3. **Dense but calm.** 14px UI text, 4px spacing grid, thin borders, restrained shadows.
4. **Always oriented.** A persistent sidebar and a breadcrumb tell the user where they are.
5. **Everything has a state.** Hover, focus, active, disabled, loading, empty and error.

## 4. Brand

**Logo (original, drawn as inline SVG):** a rounded indigo square (`indigo-600`) containing three white rounded vertical bars of different heights, like kanban columns. The wordmark "TaskBoard" sits beside it in Inter semibold, `slate-900`.

- Component: `components/Logo.jsx` with props `showWordmark` (default true) and `size`.
- Favicon: `client/public/favicon.svg` using the same mark. Add it to `index.html`.
- On the login and register pages the logo is shown large, above the form.

## 5. Design tokens (Tailwind classes)

**Colour**

| Role | Classes |
|------|---------|
| App background | `bg-slate-50` |
| Surface (cards, panels, top bar) | `bg-white`, border `border-slate-200` |
| Sidebar | `bg-white`, right border; active item `bg-indigo-50 text-indigo-700`, hover `bg-slate-100` |
| Board column | `bg-slate-100/70` with `rounded-xl` |
| Text | `text-slate-900` (main), `text-slate-600` (secondary), `text-slate-500` (muted) |
| Primary | `indigo-600`, hover `indigo-700`, focus ring `ring-indigo-500` |
| Danger / success / warning | `red-600`, `emerald-600`, `amber-500` |

**Lozenges** (status and priority): `rounded-md px-2 py-0.5 text-xs font-medium` with a soft background, matching text and inset ring, for example `bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20`.

**Typography:** Inter. Base UI text `text-sm` (14px). Page title `text-xl font-semibold`. Section title `text-base font-semibold`. Meta text `text-xs text-slate-500`. No tracked capitals and no all-caps eyebrows.

**Shape and depth:** inputs and buttons `rounded-md`, cards `rounded-lg`, drawers and modals `rounded-xl`. Shadows: cards `shadow-sm`, card hover `shadow-md`, drawer and modal `shadow-xl`.

**Spacing:** 4px grid. Page padding `px-4 sm:px-6 lg:px-8`, card padding `p-4`, stack gaps `gap-3` or `gap-4`.

**Motion:** 150ms ease-out for hover and colour changes; drawer slide 200ms; toasts fade and slide 150ms. Respect `prefers-reduced-motion` (no slide, instant fade).

## 6. Icons (lucide-react)

Sizes: 16px inside buttons and chips, 20px in the sidebar, 24px in empty states. Stroke width default. Icon-only buttons must have an `aria-label` and a `title` tooltip. The agent must check each name exists in the installed lucide-react version and pick the closest match if not.

| Use | Icon |
|-----|------|
| Projects | `LayoutGrid` |
| Board | `Columns3` (or `Kanban` if available) |
| Dashboard | `BarChart3` |
| Activity | `Activity` |
| Settings | `Settings` |
| Profile / user | `User` |
| Admin | `Shield` |
| Log out | `LogOut` |
| Add / create | `Plus` |
| Refresh | `RefreshCw` |
| Search | `Search` |
| Filters | `ListFilter` |
| Edit | `Pencil` |
| Delete | `Trash2` |
| Close | `X` |
| Calendar / due date | `Calendar` |
| Overdue | `AlarmClock` (red) |
| Comments | `MessageSquare` |
| Labels | `Tag` |
| Members | `Users` |
| Archive | `Archive` |
| Menu (mobile) | `Menu` |
| Dropdown chevron | `ChevronDown` |
| GitHub link (M4.5) | `Github`, `ExternalLink` |

**Priority icons:** high `ArrowUp` (`text-red-600`), medium `Equal` (`text-amber-500`), low `ArrowDown` (`text-sky-600`). Always shown with a tooltip and an accessible text name.
**Status icons:** To Do `Circle` (slate), In Progress `CircleDot` (indigo), Review `Eye` (amber), Done `CheckCircle2` (emerald).

## 7. App shell

- **Top bar** (`h-14`, white, bottom border): on the left a hamburger (mobile only) and the Logo linking to `/projects`; on the right the user menu. The user menu is an avatar button (initials) that opens a dropdown with name, email, role badge, Profile and Log out. No text "Profile" button.
- **Sidebar** (desktop, 240px, white, right border): section "Workspace" with Projects (`LayoutGrid`) and, for admins, Admin (`Shield`). When inside a project, a second section shows the **project block** (ProjectAvatar, project name, status lozenge) followed by Board, Dashboard, Activity and Settings (owners and admins only), each with an icon. A "Back to all projects" link sits at the top of that section.
- **Mobile:** the sidebar becomes a slide-over drawer opened from the hamburger, closing on Esc, on overlay click and after navigating.
- **Page header pattern:** breadcrumb (small, muted, with `ChevronRight` separators), then the page title with actions on the right (primary action as an icon + label button).
- The old text tab row under the project title is removed (the sidebar replaces it). This also removes the stray scrollbar bug.
- Page content max width `max-w-7xl`; the board may use the full width.

## 7.1 Public landing page and routes (new in v0.2)

Visitors who are not logged in must see a landing page first, not the login form.

**Routes**

| Route | Who | Page |
|-------|-----|------|
| `/` | Guests see the landing page. A logged-in user is redirected to `/projects`. | `LandingPage` |
| `/login`, `/register` | Guests only (GuestRoute as today) | Auth pages |
| `/projects` and everything else | Logged in (ProtectedRoute as today) | App |

All "go to the app" links and the post-login and post-register redirects keep going to `/projects`. The 401 interceptor still redirects to `/login?reason=expired`. The Logo in the app top bar links to `/projects`; the Logo on public pages links to `/`.

**Public header** (sticky, `h-16`, white with bottom border once scrolled): Logo left; links "Features" and "How it works" (smooth-scroll anchors) in the middle; on the right a quiet "Log in" link and a filled indigo "Get started" button (to `/register`). Under 768px the links collapse into the same slide-over pattern as the app drawer.

**Sections (top to bottom)**
1. **Hero.** Two columns on desktop. Left: headline "Plan the work. Move it across the board." (placeholder, team may reword), one supporting sentence, buttons "Get started free" (primary, `/register`) and "Log in" (secondary, `/login`). Under the buttons a small line: "Free for your team. No card needed." Right: a **product preview built in HTML and Tailwind** (not an image): a mock board with three columns and four cards using the real TaskCard look, slightly tilted or cropped by the section edge, with a soft indigo glow behind it. It uses fake sample data only.
2. **Trust strip.** One row with three short facts, no fake customer logos: "Kanban boards", "Roles and permissions", "Activity history".
3. **Features.** Six cards in a 3x2 grid, each with a lucide icon, a title and one sentence: Kanban boards, Tasks with labels and due dates, Team roles (Owner, Member, Admin), Comments on every task, Activity feed, Dashboard charts. (The dashboard card says "coming soon" until M4.4 ships.)
4. **How it works.** Three numbered steps: Create a project, Invite your team, Move tasks to Done. Each with a small icon.
5. **Big preview or showcase.** Optional wide section with a second mock (task drawer with comments) to show depth. Skip it if the page feels long.
6. **Final call to action.** An indigo-600 band with a short heading, the primary button in white and a "Log in" link.
7. **Footer.** Logo, "A project for IT645, DA-IICT", and a link to the GitHub repository. No fake social icons or legal pages.

**Rules for the landing page**
- Honest content only: no invented testimonials, user counts, company logos or awards. Sample data in mock cards is clearly generic.
- Same tokens, icons and Inter font as the app. One accent. Generous space (sections `py-16 sm:py-24`), text `max-w-2xl` for readability, headings `text-4xl sm:text-5xl font-semibold tracking-tight` (tight tracking is fine, tracked capitals still are not).
- No external images, stock photos or illustration libraries. Everything is SVG, CSS or lucide.
- Subtle entrance motion only (fade and 8px rise, 200ms), disabled for `prefers-reduced-motion`. No parallax, no autoplay carousels, no animated counters.
- Performance: no new dependency; the page is a normal route in the same bundle. Lighthouse target of 90+ for Accessibility and Best Practices; tell the agent to run it only if it is already available.
- SEO basics in `index.html`: `<title>`, meta description and theme colour.

**Login and Register after the change.** Keep the split layout from section 9. Add a small "Back to home" link and make the Logo link to `/`.

## 8. Component refresh

| Component | Change |
|-----------|--------|
| `Button` | Sizes `sm` and `md`; optional `leftIcon`; variants primary, secondary, danger, ghost. New `IconButton` (square, ghost by default, required `label` prop used as aria-label and title) |
| `Input`, `Select`, `Textarea` | Optional leading icon (for example `Search`); slightly smaller height; consistent error state |
| `Badge` | Becomes the lozenge style above. Add `StatusLozenge` and `PriorityBadge` (icon + text) helpers |
| `Avatar` | Sizes xs, sm, md; background colour chosen deterministically from the name (a fixed set of soft colours); new `AvatarGroup` (overlapping, `+n` overflow) |
| `ProjectAvatar` | New. Rounded-square, coloured from the project name, shows initials |
| `Card` | Thinner border, `rounded-lg`, no card nested inside a card |
| `Modal` and new `Drawer` | Drawer slides from the right (full width on mobile, up to 720px on desktop) using the same focus handling as Modal (move focus in, restore it on close, Esc closes the top layer only) |
| `Toast` | Add a small icon for success and error; stack bottom-right on desktop |
| `EmptyState` | Large muted icon in a soft circle, title, one helpful sentence, one primary action |
| `Dropdown menu` (new) | Small reusable menu used by the user menu: button, menu list, keyboard support (arrow keys, Esc), closes on outside click |
| `Logo` (new) | See section 4 |

Shared components must keep their existing prop names so existing screens keep working; new capabilities are added as optional props.

## 9. Screens

**Projects list.** Header with title and a primary "New project" button (`Plus`). A single toolbar row: search input with icon, status filter, and a count. Project cards show ProjectAvatar, name, status lozenge, a two-line description, and a footer with AvatarGroup of members and "Updated" date. Hover raises the card. Friendly empty state when there are none.

**Board.**
- Header: breadcrumb, title, and primary "Add task" button.
- **Compact toolbar** in one row: search with icon, AvatarGroup of members as clickable assignee filters, a "Filters" button (`ListFilter`) with a count badge that opens a popover holding priority, label and due-before, and a "Clear" icon button when filters are active. Filters stay in the URL.
- **Columns:** sentence-case title with the status icon, a count pill, and a small `Plus` icon button. Cards stack with `gap-2`. An inline **quick add** at the bottom of each column: click to reveal a text field, Enter creates a task with that status, Esc cancels.
- **Card anatomy (top to bottom):** title (two lines max), then a footer row with PriorityBadge icon, up to two label chips plus "+n", a due-date chip with `Calendar` (red with `AlarmClock` when overdue and not done), and the assignee Avatar at the far right. Whole card is one focusable button; hover raises it.
- Empty column shows a faint dashed outline and "No tasks" (no tall empty block); columns have a sensible min height.
- Horizontal scroll on small screens as before.

**Task drawer (replaces the centred task modal for viewing and editing).** Two panes on desktop, stacked on mobile.
- Left pane: large title, description, then the comments section.
- Right pane "Details": status (lozenge-style select, changes immediately), assignee, priority, labels, due date, created by and date, GitHub issue (M4.5). An Edit button switches to the existing form behaviour; Delete is in a "more" menu (`MoreHorizontal`) and still confirms. The same validation and permission rules apply as today.
- Creating a task keeps a compact modal, not the drawer.

**Comments.** Compact rows with Avatar, name, relative time, and hover-only icon buttons for Edit and Delete (always visible on touch screens).

**Activity.** A vertical timeline: small circular icon per action type (task, comment, member, project) on a line, actor name in bold plus the message, relative time on the right. Day headings stay.

**Dashboard (built after the refresh).** Row of stat cards (total tasks, in progress, done, overdue) with icons, then chart cards in a responsive grid. Charts use the lozenge colours.

**Settings.** Two-column sections on desktop: section title and description on the left, the form on the right, divided by thin lines. Danger zone is a separate bordered section with a red heading.

**Auth pages (Login, Register).** On desktop a split layout: a left brand panel (indigo-600 background, Logo in white, one short tagline, no stock gradients) and the form on the right. On mobile only the form with the Logo above it.

**Profile and Admin.** Profile: avatar header block, then two section cards. Admin: toolbar with search; table with Avatar + name, role lozenge, joined date, and icon buttons.

## 10. Accessibility and quality bar

- Keep every rule in `ui_ux_brief.md` section 7 (semantic HTML, labels, 4.5:1 contrast, visible focus, keyboard-only use).
- Icons are decorative (`aria-hidden`) unless they are the only content of a control, in which case the control has an accessible name.
- Never use colour alone for status or priority: icon plus text name too.
- Touch targets at least 40px on mobile.
- Test at 360px, 768px and 1280px widths.

## 11. Out of scope for the refresh

Dark mode, issue keys (like `TB-12`), drag-and-drop (still optional M5.4), a global command palette, custom fonts beyond Inter, animations beyond the short transitions above, illustrations beyond simple icon-based empty states.

## 12. Implementation order (four prompts)

The landing page comes right after the foundation so the public site and the app share the same components from the start.

1. **Foundation:** install `lucide-react`; Logo, favicon; token cleanup in Tailwind config; refresh of shared components (Button, IconButton, Input, Badge and lozenges, Avatar and AvatarGroup, ProjectAvatar, Card, Drawer, Toast, EmptyState, Dropdown); update the component demo page.
2. **Landing page and public routes:** `LandingPage`, public header and footer, route changes from section 7.1, the mock board preview, `index.html` metadata; restyle Login and Register with the split layout.
3. **App shell and pages:** top bar, sidebar, mobile drawer, breadcrumb and page header; restyle Projects list and create, Project settings, Profile, Admin users and Activity.
4. **Board and task drawer:** new toolbar, columns, cards, quick add, task drawer, comments row styling.

The dashboard (M4.4) and the GitHub issue lookup (M4.5) are built after this, using the new components.
