# TaskBoard: UI/UX Design Brief

**Status:** Draft v0.1
**Depends on:** `prd.md` v1.0, `app_flow.md`

---

## 1. Design Principles

- **Clear over clever:** a board must be readable in two seconds.
- **Consistent:** one set of reusable components, no one-off styles.
- **Responsive first:** works on a phone, comfortable on a laptop.
- **Accessible:** semantic HTML, visible focus, sufficient contrast, labels on every input.
- **Calm look:** light, neutral surfaces with one accent color, so priority and status colors stand out.

## 2. Color Palette (Tailwind tokens)

Define once in `tailwind.config.js` and use only these.

| Role | Tailwind color | Use |
|------|---------------|-----|
| Primary | `indigo-600` (hover `indigo-700`) | Main buttons, links, active tab |
| Primary soft | `indigo-50` | Selected rows, subtle highlights |
| Background | `slate-50` | Page background |
| Surface | `white` | Cards, modals, navbar |
| Border | `slate-200` | Dividers, card borders |
| Text main | `slate-900` | Headings, body |
| Text muted | `slate-500` | Secondary text, timestamps |
| Success | `emerald-600` | Success toast, "Done" |
| Warning | `amber-500` | Due soon, "Review" |
| Danger | `red-600` | Delete, errors, overdue |

**Status column accents:** To Do `slate-400`, In Progress `indigo-500`, Review `amber-500`, Done `emerald-500`.

**Priority badges:** Low `slate` (gray), Medium `amber`, High `red`. Always show a text label, never rely on color alone.

## 3. Typography

- **Font:** Inter (fallback: system sans-serif), loaded via the font link in `index.html`.
- **Scale:**

| Use | Tailwind |
|-----|----------|
| Page title | `text-2xl font-semibold` |
| Section title | `text-lg font-semibold` |
| Body | `text-sm` or `text-base` |
| Caption, timestamps | `text-xs text-slate-500` |

## 4. Layout and Spacing

- Base spacing unit: 4px (Tailwind scale). Use `p-4`, `gap-4`, `space-y-4` as defaults.
- Content max width: `max-w-7xl mx-auto px-4`.
- **Navbar:** sticky top, white, bottom border. Mobile shows a menu button.
- **Board:** four columns in a horizontal flex row. On screens below `md`, the row scrolls horizontally with each column at `min-w-[280px]`. From `lg`, columns share width equally.
- **Dashboard:** responsive grid, 1 column on mobile, 2 columns from `md`.
- **Forms:** single column, labels above inputs, max width `max-w-md`.
- **Breakpoints:** `sm` 640, `md` 768, `lg` 1024.

## 5. Component Library

Build these once in `client/src/components/` and reuse everywhere.

| Component | Style notes |
|-----------|-------------|
| `Button` | Variants: primary, secondary, danger, ghost. `rounded-md px-4 py-2 text-sm font-medium`, disabled and loading states |
| `Input`, `Select`, `Textarea` | `rounded-md border-slate-300`, focus ring `ring-2 ring-indigo-500`, error text below in red |
| `Card` | `bg-white rounded-lg border shadow-sm p-4` |
| `TaskCard` | Title, priority badge, label chips, due date (red when overdue), assignee avatar initials |
| `Column` | Header with name and count, vertical list of TaskCards, "Add task" button on To Do |
| `Modal` | Centered, dark overlay, closes on Esc and overlay click, focus moves inside (use `useRef`) |
| `Badge` | Small rounded pill for priority, status, and labels |
| `Avatar` | Circle with user initials |
| `Loader` | Spinner centered in its container |
| `ErrorMessage` | Red-tinted box with message and Retry button |
| `EmptyState` | Muted icon or text, short sentence, optional action button |
| `Toast` | Top-right, auto-dismiss in 4 seconds, success and error variants |
| `ConfirmDialog` | Used before every delete |
| `Pagination` | Previous, next, page indicator |
| `ChartCard` | Card wrapper with title for Recharts charts |

## 6. Interaction Rules

- Every button that triggers a request shows a loading state and is disabled while waiting.
- Destructive actions always need a confirmation dialog.
- Success and failure feedback uses toasts for actions and inline text for form validation.
- Forms validate on submit and show messages under the field.
- Overdue tasks: due date shown in red with the word "Overdue".
- Hover and focus styles on every clickable element.

## 7. Accessibility Checklist

- Semantic elements: `header`, `nav`, `main`, `section`, `button` (not clickable `div`).
- All inputs have `<label>`; icons used alone have `aria-label`.
- Modal traps focus and sets `role="dialog"` with `aria-modal="true"`.
- Color contrast at least 4.5:1 for body text.
- Keyboard: Tab order is logical; Esc closes modals; status can be changed without a mouse.

## 8. Out of Scope for v1

- Dark mode, custom themes, animations beyond simple transitions.
- Drag-and-drop styling (added only if the should-have feature is built).
