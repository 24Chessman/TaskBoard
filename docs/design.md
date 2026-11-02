# TaskBoard: Design Brief v2 (design.md)

**Status:** Draft v0.3 (identity pass: cobalt, IBM Plex, product-first landing page, anti-slop rules), confirmed by the team lead
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
| Notion | Calm, spacious pages; product shown in context rather than described; restrained colour; hand-made feeling spot illustrations instead of stock art |
| Trello (public site) | Very large product visuals right in the hero; simple headline with one clear action; alternating text and product rows below |

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
2. **One accent.** Cobalt is the only brand colour. Status and priority colours are semantic and small.
3. **Dense but calm.** 14px UI text, 4px spacing grid, thin borders, restrained shadows.
4. **Always oriented.** A persistent sidebar and a breadcrumb tell the user where they are.
5. **Everything has a state.** Hover, focus, active, disabled, loading, empty and error.

## 4. Brand

**Logo (original, drawn as inline SVG):** a cobalt square (`#1D4ED8`, corner radius 6 on a 32px mark) that contains two thin white column outlines and one small solid white card sitting across the gap between them, slightly offset, so it reads as "a task moving to the next column". It must not look like a generic three-bar icon. The wordmark "TaskBoard" sits beside it in IBM Plex Sans semibold, `slate-900`.

- Component: `components/Logo.jsx` with props `showWordmark` (default true) and `size`.
- Favicon: `client/public/favicon.svg` using the same mark. Add it to `index.html`.
- On the login and register pages the logo is shown large, above the form.

## 5. Design tokens (Tailwind classes)

**Colour**

| Role | Classes |
|------|---------|
| App background | `bg-slate-50` |
| Surface (cards, panels, top bar) | `bg-white`, border `border-slate-200` |
| Sidebar | `bg-white`, right border; active item `bg-blue-50 text-blue-700`, hover `bg-slate-100` |
| Board column | `bg-slate-100/70` with `rounded-lg` |
| Text | `text-slate-900` (main), `text-slate-600` (secondary), `text-slate-500` (muted) |
| Primary (cobalt) | `blue-700` (`#1D4ED8`, 6.7:1 with white text), hover `blue-800`, focus ring `ring-blue-600`; selected and link text `blue-700` |
| Danger / success / warning | `red-600`, `emerald-600`, `amber-500` |

**Lozenges** (status and priority): `rounded-md px-2 py-0.5 text-xs font-medium` with a soft background, matching text and inset ring, for example `bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20`.

**Typography:** IBM Plex Sans (400, 500, 600) with IBM Plex Mono (400, 500) for identifiers and counters only (character counters, sample ids in mock UI); both from Google Fonts with `display=swap` and a system-font fallback stack. Reason: a tool for engineers, a clear and slightly technical voice, and it is not the default sans. Base UI text `text-sm` (14px). Page title `text-xl font-semibold`. Section title `text-base font-semibold`. Meta text `text-xs text-slate-500`. No tracked capitals and no all-caps eyebrows.

**Shape and depth (a deliberate scale, not one radius everywhere):** lozenges `rounded` (4px); inputs, buttons and the logo mark `rounded-md` (6px); cards and board columns `rounded-lg` (8px); drawers, modals and popovers `rounded-xl` (12px); avatars full. Prefer 1px borders over shadows: cards have no shadow at rest, hover darkens the border and adds `shadow-sm`; popovers `shadow-lg`; drawers and modals `shadow-xl`.

**Spacing:** 4px grid. Page padding `px-4 sm:px-6 lg:px-8`, card padding `p-4`, stack gaps `gap-3` or `gap-4`.

**Motion:** 150ms ease-out for hover and colour changes; drawer slide 200ms; toasts fade and slide 150ms. Respect `prefers-reduced-motion` (no slide, instant fade).

## 5.1 Anti-slop rules (v0.3)

These come from community research on AI-looking UI. A "tell" is an unspecified default, so every choice below has a stated reason.

Decisions made on purpose:
- **Reference:** Jira and the Atlassian token scale for the app screens; Notion and Trello public pages for the landing page's calm, product-first feel.
- **Colour:** cobalt `#1D4ED8`. Not indigo or violet (the "AI purple" default) and not cream, serif and sage green (the newer default).
- **Type:** IBM Plex Sans and Plex Mono, chosen for a tool-like voice.
- **Landing layout:** product-first, left-aligned, no "hero + three cards + coloured CTA band" skeleton.

Never do:
- Gradients, gradient text, glow or blurred colour orbs, glassmorphism.
- `hover:scale-*` on cards, fade-up on every section, any decorative animation. Motion only for state changes (drawer, dropdown, toast) and the one hero entrance.
- One radius everywhere (see the scale above) and pill buttons.
- Emoji as icons; stock illustrations; fake logos, quotes, counts or awards.
- Copy clichés: "Transform", "Supercharge", "Unleash", "Seamless", "Elevate", "All-in-one", "Revolutionize".
- Untouched library defaults: every colour, radius and font comes from the roles in section 5.

Allowed only with a reason written next to it in the code (`unslop-ignore` comment): anything the auditor flags that is a deliberate choice.

Illustrations and images: hand-authored inline SVG only (original, flat, line plus one fill, two hues from the palette plus neutrals, `aria-hidden`). No raster stock photos. Mock UI on the landing page is built from the real shared components with fake sample data, so it is honest and stays in sync.

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
**Status icons:** To Do `Circle` (slate), In Progress `CircleDot` (cobalt), Review `Eye` (amber), Done `CheckCircle2` (emerald).

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

**Public header** (sticky, `h-16`, white with bottom border once scrolled): Logo left; links "Product" and "Roles" (smooth-scroll anchors, optional) in the middle; on the right a quiet "Log in" link and a filled cobalt "Get started" button (to `/register`). Under 768px the links collapse into the same slide-over pattern as the app drawer.

**Sections (top to bottom), v0.3, product-first**
1. **Hero (left-aligned, not centred).** Left column, max about 520px: h1 "Plan the work. Move it across the board.", one supporting sentence, buttons "Get started free" (primary, `/register`) and "Log in" (secondary, `/login`), then one quiet line "Free for your team. No card needed." Right: a **large board mock** (three columns, five cards, real TaskCard look, fake generic data) that runs off the right edge of the viewport on desktop so it feels like a real app window. A thin window chrome (three dots is a cliché: use a small title row with the logo mark and the project name instead). No glow, no tilt, no blur. On mobile the mock sits under the buttons at full width, cropped on the right.
2. **Four alternating feature rows** (text left or right, mock on the other side), each with an h2 that states an outcome, a short paragraph and two or three plain facts:
   - Board: "See every task in its column" (board mock with filters row).
   - Task drawer: "Everything about a task in one place" (details pane plus two comments).
   - Roles: "Owners decide, members do" (a small roles table: Admin, Owner, Member, with what each can do).
   - Activity: "A history nobody has to write" (timeline mock).
   Dashboard charts get one line at the end of the section: "Dashboard charts are on the way." No separate card.
3. **Closing section (quiet, not a coloured band).** On `bg-slate-50`: an h2 "Start your first board", one sentence, the primary button and a "Log in" link, with a small hand-drawn SVG (a card moving to the Done column) on the right.
4. **Footer.** Logo, "A course project for IT645, DA-IICT", GitHub link with `ExternalLink` that states it opens in a new tab.

Removed from v0.2: the trust strip, the 3x2 feature-card grid, the three-step "How it works" and the coloured CTA band. Header anchor links become "Product" and "Roles" (or none if the page is short enough; the agent may drop anchors and keep only Log in and Get started).

**Rules for the landing page**
- Honest content only: no invented testimonials, user counts, customer logos or awards. Every mock uses generic sample data and is `aria-hidden`; the same information is stated in text next to it.
- Same tokens, icons and fonts as the app. Sections `py-16 sm:py-24`, text `max-w-prose`. Headings `text-4xl sm:text-5xl font-semibold` (hero) and `text-2xl sm:text-3xl font-semibold` (rows) with tracking `-0.02em` at most; no tracked capitals.
- Only the hero has an entrance animation (fade and 8px rise, 200ms), off under `prefers-reduced-motion`. Nothing else moves.
- No raster images, no external images. SVG is hand-authored and inline.
- SEO basics in `index.html`: `<title>`, meta description, theme colour `#1D4ED8`, Open Graph text.

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

**Auth pages (Login, Register).** On desktop a split layout: a left brand panel (solid cobalt `blue-700` background, Logo in white, one short tagline, and a faint hand-drawn SVG board outline as texture; no gradients) and the form on the right. On mobile only the form with the Logo above it.

**Profile and Admin.** Profile: avatar header block, then two section cards. Admin: toolbar with search; table with Avatar + name, role lozenge, joined date, and icon buttons.

## 10. Accessibility and quality bar

- Keep every rule in `ui_ux_brief.md` section 7 (semantic HTML, labels, 4.5:1 contrast, visible focus, keyboard-only use).
- Icons are decorative (`aria-hidden`) unless they are the only content of a control, in which case the control has an accessible name.
- Never use colour alone for status or priority: icon plus text name too.
- Touch targets at least 40px on mobile.
- Test at 360px, 768px and 1280px widths.

## 11. Out of scope for the refresh

Dark mode, issue keys (like `TB-12`), drag-and-drop (still optional M5.4), a global command palette, fonts beyond IBM Plex Sans and Mono, animations beyond the short transitions above, illustrations beyond the few hand-authored SVGs named in sections 5.1 and 7.1 (landing page, empty states, auth panel).

## 12. Implementation order

Done: foundation (M4.7a), landing page v1 and auth pages (M4.7b), app shell and page restyle (M4.7c).

Next:
4. **Identity pass (M4.7d):** install check for Playwright MCP and unslop-ui; baseline audit and screenshots; switch to cobalt and IBM Plex through the existing role tokens; new logo and favicon; rebuild the landing page per section 7.1 (v0.3); auth panel texture; empty-state SVG art; re-audit and screenshot loop at 1440px and 390px.
5. **Board and task drawer (M4.7e):** new toolbar, columns, cards, quick add, task drawer, comments row styling.

The dashboard (M4.4) and the GitHub issue lookup (M4.5) are built after this, using the new components.
