# Internal Tools Dashboard

Frontend for internal SaaS tools monitoring.

## Stack

| Layer         | Tech                          |
| ------------- | ----------------------------- |
| Runtime       | Node.js 24.x                  |
| Framework     | TanStack Start + React 19     |
| Routing       | TanStack Router               |
| Data fetching | TanStack Query + Orval client |
| Styling       | Tailwind CSS 4                |
| Icons         | Lucide React                  |
| Testing       | Cypress + Vitest              |
| Linting       | ESLint + Prettier             |

## What's Done

- Dashboard page with KPI cards and recent tools table.
- Shared header, theme toggle, responsive shell.
- API client generated with Orval.
- Cypress coverage for dashboard flows.

## Quick Start

```bash
cd app
pnpm install
pnpm dev
```

### Production Build

```bash
cd app
pnpm build
```

## Testing

```bash
cd app
pnpm test
pnpm exec cypress run --browser electron
```

## Scripts

| Command        | Description                         |
| -------------- | ----------------------------------- |
| `pnpm dev`     | Start Vite dev server               |
| `pnpm build`   | Build client and SSR output         |
| `pnpm preview` | Serve production build locally      |
| `pnpm test`    | Run Vitest suite                    |
| `pnpm lint`    | Run ESLint                          |
| `pnpm format`  | Format with Prettier and ESLint fix |
| `pnpm check`   | Prettier check                      |

## Routes

| Route        | Purpose             |
| ------------ | ------------------- |
| `/`          | Dashboard overview  |
| `/tools`     | SaaS tools catalog  |
| `/analytics` | Analytics workspace |

## Data

The app consumes the JSON server backend exposed by Alt.

Main resources:

- `GET /departments`
- `GET /users`
- `GET /tools`
- `GET /user_tools`
- `GET /analytics`

## Project Structure

```text
app/
├── src/
│   ├── api/        # Orval client + generated models
│   ├── components/ # Shared UI and custom cards/tables
│   ├── hooks/      # Data hooks for dashboard pages
│   ├── lib/        # Helpers and formatters
│   ├── routes/     # TanStack Router pages
│   └── styles.css  # Global theme and tokens
├── cypress/        # E2E tests and fixtures
└── public/         # Static assets
```

## CI

- GitHub Actions runs install, build, unit tests
