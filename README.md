# Nexus Admin

A responsive administration console built with React and Vite. The application
combines a polished dashboard shell with mock authentication, analytics, and
fully interactive user, product, and order management modules.

## Features

- Responsive dashboard shell with collapsible navigation, mobile drawer,
  breadcrumbs, theme switching, and accessible dialogs/menus.
- Mock authentication with protected routes, role-based access, persisted
  sessions, and administrator/manager demo accounts.
- API-driven dashboard and analytics views with date-range filtering and
  interactive charts.
- Users management with search, role/status filters, pagination, creation,
  editing, activation/deactivation, deletion, and self-account protections.
- Products management with search, category/status/stock filters, sorting,
  pagination, low-stock indicators, CRUD workflows, and image fallbacks.
- Orders management with search, status/payment/date filters, sorting,
  pagination, order details, line items, shipping/payment summaries, and
  guided fulfillment transitions.
- MSW-backed mock API with authentication, validation, conflict responses, and
  deterministic seed data.

## Tech Stack

- React 19 and Vite 8
- Tailwind CSS 4 and DaisyUI 5
- React Router 7
- TanStack Query 5
- Zustand 5
- Axios
- React Hook Form and Zod
- MSW 3
- Vitest and React Testing Library

## Getting Started

```bash
npm install
npm run dev
```

Open the local Vite URL and sign in with one of the demo accounts.

### Demo Accounts

| Role | Email | Password |
| --- | --- | --- |
| Administrator | `admin@nexus.test` | `Admin123!` |
| Manager | `manager@nexus.test` | `Manager123!` |

Both roles can access Users, Products, and Orders. Only administrators can
access Settings.

## Mock Data and API

All API calls are intercepted by MSW. Management records are held in memory and
reset when the browser page is reloaded or the mock service worker restarts.

The management seed contains 24 users, 24 products, and 30 orders. Mutations
persist for the current browser session only. The mock authentication fixtures
are separate from the management user records, so changing another demo
account through Users does not rewrite its login credentials.

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
npm run dev       # Start the Vite development server
npm run build     # Create a production build
npm run preview   # Preview the production build
npm run lint      # Run ESLint
npm run test      # Start Vitest in watch mode
npm run test:run  # Run the full test suite once
```

## Project Structure

```text
src/
  app/          Application providers, router, and query client
  components/   Shared UI, management, and layout components
  constants/    Route, status, role, and management constants
  features/     Auth, dashboard, analytics, users, products, orders, and more
  hooks/        Shared hooks
  layouts/      Dashboard, authentication, and showcase layouts
  mocks/        MSW handlers, management data, and auth fixtures
  services/     Axios client, resource helpers, and API modules
  store/        Zustand authentication and theme stores
  test/         Unit and integration tests
  utils/        Formatting, date range, and utility helpers
```
