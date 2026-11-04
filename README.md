# Nexus Admin

A responsive SaaS administration console built with React 19 and Vite. Nexus
Admin pairs a polished dashboard shell with mock authentication, analytics, and
fully interactive user, product, and order management modules.

The project is a portfolio-grade front end. It ships with an in-browser MSW API
so the complete experience runs without a backend, while the API layer, query
keys, and environment-based mock switch keep it ready for a real service.

## Features

- Responsive dashboard shell with collapsible desktop navigation, a mobile
  drawer, breadcrumbs, workspace switcher, notifications, and theme switching.
- Mock authentication with protected routes, role-based access, persisted
  sessions, session revalidation, and mid-session 401 handling.
- Dashboard and analytics views driven by the API with date-range filtering and
  accessible, responsive charts.
- Users management with search, role/status filters, sorting, pagination,
  creation, editing, activation/deactivation, deletion, and self-account
  protections.
- Products management with search, category/status/stock filters, sorting,
  pagination, low-stock indicators, CRUD workflows, and image fallbacks.
- Orders management with search, status/payment/date filters, sorting,
  pagination, order details, line items, shipping/payment summaries, and guided
  fulfillment transitions.
- An in-app design-system showcase covering tokens, typography, colors,
  controls, data display, feedback, and overlays.
- MSW-backed mock API with bearer auth, validation, conflict responses, and
  deterministic seed data.
- Accessibility support: skip links, focus-managed dialogs and menus, visible
  focus styles, ARIA live regions, semantic tables, and reduced-motion support.

## Tech Stack

- React 19 and Vite 8
- Tailwind CSS 4 and DaisyUI 5
- React Router 7
- TanStack Query 5
- Zustand 5
- Axios
- React Hook Form and Zod
- Recharts
- Lucide icons and react-hot-toast
- date-fns
- MSW 3
- Vitest and React Testing Library

## Requirements

- Node.js 20.19+ or 22.12+ (Vite 8 requirement)
- npm 10+

## Getting Started

```bash
npm install
npm run dev
```

Open the local Vite URL and sign in with a demo account. No backend or
environment configuration is required for local development:
`.env.development` enables the MSW mock API.

### Environment Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `VITE_ENABLE_MOCK_API` | `false` (`true` in `.env.development`) | Starts the MSW browser worker. MSW is also gated to development builds in `src/main.jsx`. |
| `VITE_API_BASE_URL` | `/api` | Base URL used by the Axios client. Point this at a real backend outside the mock setup. |

To override defaults, copy `.env.example` to `.env.local` and edit it.
`.env.local` and `.env` are gitignored.

### Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@nexus.test` | `Admin123!` |
| Manager | `manager@nexus.test` | `Manager123!` |

Both roles can access the dashboard, analytics, users, products, orders, and the
design-system showcase. Only administrators can access Settings. These
credentials exist only in the mock API and are intentionally public.

## Mock Data and API

All API calls are intercepted by MSW while the mock flag is enabled. Management
records are held in memory and reset when the page reloads or the mock service
worker restarts.

The management seed contains 24 users, 24 products, and 30 orders. Mutations
persist for the current browser session only. The mock authentication fixtures
are separate from the management user records, so changing another demo account
through Users does not rewrite its login credentials.

The mock API exposes bearer-protected endpoints for:

- `POST /auth/login`, `GET /auth/me`, and `POST /auth/logout`
- dashboard summary, revenue, sales, user growth, transactions, and activities
- analytics overview
- users, products, and orders list/detail routes plus create, update, status,
  and delete mutations where supported

Self-account protections apply in both the UI and mock API:

- You cannot delete or deactivate your own account.
- You cannot change your own email or role through user management.
- Editing your own profile only updates your name, phone, and department.
- Updating your own name is reflected in the authenticated session.

Order fulfillment follows these transitions:

```text
pending -> processing -> shipped -> delivered
pending -> cancelled
processing -> cancelled
```

Delivered and cancelled orders are terminal. Payment status is managed
separately from fulfillment status.

## Available Scripts

```bash
npm run dev       # Start the Vite development server with the mock API
npm run build     # Create the production build in dist/
npm run preview   # Serve the production build locally
npm run lint      # Run ESLint
npm run test      # Start Vitest in watch mode
npm run test:run  # Run the full test suite once
```

`npm run preview` serves the static production build. MSW is stripped from
production assets, so authentication and data screens require a real backend or
should be reviewed in development mode.

## Architecture

```text
src/
  app/          Providers, router, query client, error boundaries
  components/   Shared UI, management, chart, and layout components
  constants/    Route, status, role, and management constants
  features/     Feature-scoped auth, dashboard, analytics, users, products,
                orders, settings, notifications, and design-system modules
  hooks/        Shared hooks such as debouncing, media queries, and reduced motion
  layouts/      Dashboard, authentication, and showcase layouts
  mocks/        MSW handlers, management data, and auth fixtures
  services/     Axios client, resource helpers, and API modules
  store/        Zustand authentication and theme stores
  styles/       Tailwind entry point and design tokens
  test/         Unit and integration tests
  utils/        Formatting, date range, and utility helpers
```

Data flow conventions:

- TanStack Query owns server state; query keys live in `src/services/api/queryKeys.js`.
- Zustand owns authentication and theme state, with auth persisted to
  `localStorage` under `nexus-admin-auth`.
- Axios attaches the bearer token and normalizes errors. A `401` clears the
  session, clears cached queries, dispatches an unauthorized event, and redirects
  to login.
- Route-level lazy loading keeps feature pages out of the initial bundle.

## Testing

```bash
npm run test:run
npm run lint
```

The suite currently contains 24 test files and 133 tests covering authentication,
routing, layouts, shared UI, dashboard, analytics, users, products, orders,
design-system pages, and the mock API. Tests use MSW's Node server, so no network
access is required. Vitest runs with `maxWorkers: 2` for reproducible execution
on Windows and CI.

## Accessibility and Performance

- Skip-to-content links, focus trapping and restoration in dialogs, roving menu
  focus, semantic tables, sortable column `aria-sort`, and live result counts.
- Form controls expose labels, descriptions, and `aria-invalid` state.
- Low-opacity text and chart axes were raised to more readable contrast levels in
  both themes.
- `prefers-reduced-motion` disables CSS transitions and Recharts animations.
- Images below the fold use native lazy loading.
- Feature routes and charts are code-split; the production mock worker is removed
  by a Vite plugin.

Current production build (gzip): entry `339.53 kB` (`105.63 kB`), CSS
`127.03 kB` (`19.19 kB`), and the largest lazy chart/data chunk `436.64 kB`
(`122.73 kB`).

## Deployment

The included `vercel.json` configures Vite builds, SPA fallback routing,
immutable caching for hashed assets, and baseline security headers. To deploy:

1. Push the repository to a Git provider and import it in Vercel.
2. Set `VITE_API_BASE_URL` to the production API origin.
3. Leave `VITE_ENABLE_MOCK_API` unset or set it to `false`.
4. Deploy. The build output directory is `dist`.

Any static host that supports SPA fallback to `index.html` also works. The demo
does not include a production backend; without one, only the login shell and
static pages are usable. A production authentication flow should replace the
mock token flow, preferably using secure, HTTP-only cookies.

## Known Limitations

- Authentication and all data are mocked; there is no real authorization or
  persistence layer.
- Settings and Notifications are navigable placeholders.
- Mock data resets on page reload, and changes are local to the browser session.
- The Inter font is loaded from Google Fonts at runtime, so the UI depends on
  external font availability.
- No real-time updates, audit log, or multi-tenant support.
