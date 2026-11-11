# sample-react-app

Storefront for the team's "main" shop: catalogue, basket & checkout

React 19 single-page application (TypeScript, Vite).

## Getting started

Requires Node.js 22 (see `.nvmrc`) and npm.

```bash
npm install
npm run dev
```

The development server listens on <http://localhost:5173>.

Every dependency in `package.json` is pinned to an exact version. The first
`npm install` creates `package-lock.json`; commit it so that the pipeline and the image build install the same transitive versions.

## Scripts

- `npm run dev` starts the development server
- `npm run build` creates the production build in `dist/`
- `npm run preview` serves the production build locally
- `npm run typecheck` type-checks sources, tests and configuration
- `npm run lint` runs Biome (`npm run lint:fix` applies its fixes and formatting)
- `npm test` runs the Vitest tests (`npm run test:coverage` adds coverage)
- `npm run storybook` starts Storybook on <http://localhost:6006>
  (`npm run build-storybook` builds it into `storybook-static/`)

## What is included

- UI: Material UI 9 (`src/components/`)
- State: Redux Toolkit 2 (`src/store/`)
- Routing: React Router 7
- API client: TanStack Query 5 over `fetch` (`src/api/`)
- Mock API: Mock Service Worker handlers in `src/mocks/`, used by the tests
  and by the development server when `VITE_ENABLE_MOCK_API=true`
- Web Vitals reporting (`src/monitoring/webVitals.ts`)
- Storybook stories next to the components (`*.stories.tsx`)

## Configuration

Copy `.env.example` to `.env.local` to change the defaults.

- `VITE_API_BASE_URL` (default `/api`): base URL of the backend API
- `VITE_ENABLE_MOCK_API` (default `false`): answer API requests in the
  development server with the mock handlers
- `VITE_VITALS_ENDPOINT` (default empty): URL that receives Web Vitals
  measurements; when empty they are written to the browser console

## Docker

```bash
docker build -t sample-react-app .
docker run --rm -p 8080:8080 sample-react-app
```

nginx serves the build on <http://localhost:8080> and answers
`/healthz` for health checks.

## Pipeline

GitHub Actions workflows in `.github/workflows/` run on every push and pull
request to `main`:

- `ci.yaml`: type check, tests with coverage, production build, dependency scan
- `lint.yaml`: Biome
- `storybook.yaml`: Storybook build
- `docker.yaml`: Dockerfile lint, image build and smoke test; publishes the
  image to the GitHub Container Registry on pushes to `main`

More detail is in `docs/index.md`.

## Owner

group:default/platform-team
