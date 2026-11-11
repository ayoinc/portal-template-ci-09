# sample-react-app

Storefront for the team's "main" shop: catalogue, basket & checkout

## Overview

| Setting     | Value                                                                               |
| ----------- | ----------------------------------------------------------------------------------- |
| Application | `sample-react-app`                                                                |
| Owner       | `group:default/platform-team`                                                               |
| Stack       | React 19, TypeScript, Vite                                 |
| UI          | Material UI 9                                                                          |
| State       | Redux Toolkit 2                                                                       |
| Routing     | React Router 7                                                                     |
| API client  | TanStack Query 5 over `fetch`, base URL `/api`                                  |
| Tests       | Vitest, React Testing Library, Mock Service Worker |
| Node.js     | 22 (see `.nvmrc`)                                                                   |
| Repository  | <https://github.com/example-org/sample-react-app> |

```d2
direction: right

browser: Browser {
  shape: oval
}

app: sample-react-app {
  entry: "main.tsx\nAppProviders"
  shell: "App\nHome, About, Not Found"
  store: "store/counter\nRedux Toolkit"
  api: "api/client\nTanStack Query"
  entry -> shell
  shell -> store: Counter
  shell -> api: ItemList
}

backend: "Backend API\n/api" {
  shape: cylinder
}

browser -> app.entry: loads the bundle
app.api -> backend: GET /items
```

## Project structure

```
sample-react-app/
├── .github/workflows/
│   ├── docker.yaml           # Image build, smoke test and publish
│   ├── lint.yaml             # Biome
│   ├── storybook.yaml        # Storybook build
│   └── ci.yaml               # Type check, tests, build, dependency scan
├── .storybook/               # Storybook configuration
├── docs/index.md             # This page
├── nginx/default.conf        # nginx server block used by the image
├── public/                   # Files copied to the build as they are
├── src/
│   ├── main.tsx              # Entry point: mounts the application
│   ├── App.tsx               # Layout, navigation and routes
│   ├── AppProviders.tsx      # Strict mode and the providers of the application
│   ├── app.json              # Name, description and default API base URL
│   ├── config.ts             # API base URL in effect
│   ├── theme.ts              # Material UI theme
│   ├── api/                  # client.ts, useItems.ts, queryClient.ts, types.ts
│   ├── components/           # Button, Layout, Section, Counter, ItemList, stories
│   ├── mocks/                # Mock Service Worker handlers and browser worker
│   ├── monitoring/           # Web Vitals reporting
│   ├── pages/                # Home, About, NotFound
│   └── store/                # Counter state
├── tests/                    # Vitest tests; support/ holds the shared helpers
├── Dockerfile
├── biome.json                # Biome configuration
├── catalog-info.yaml         # Backstage catalog entry
├── index.html                # HTML page that loads src/main.tsx
├── mkdocs.yml                # TechDocs configuration
├── package.json
├── tsconfig.json
└── vite.config.ts            # Vite and Vitest configuration
```

## Local development

Requires Node.js 22 and npm.

```bash
git clone https://github.com/example-org/sample-react-app.git
cd sample-react-app
npm install
npm run dev
```

The development server listens on <http://localhost:5173>.

| Command                   | Purpose                                              |
| ------------------------- | ---------------------------------------------------- |
| `npm run dev`             | Development server with hot module replacement       |
| `npm run build`           | Production build in `dist/`                          |
| `npm run preview`         | Serve the production build locally                   |
| `npm run typecheck`       | Type-check sources, tests and configuration          |
| `npm run lint`            | Biome: lint rules, formatting and import order       |
| `npm run lint:fix`        | Apply Biome's safe fixes and formatting              |
| `npm test`                | Vitest, single run                                   |
| `npm run test:watch`      | Vitest in watch mode                                 |
| `npm run test:coverage`   | Vitest with a coverage report in `coverage/`         |
| `npm run storybook`       | Storybook on <http://localhost:6006>                 |
| `npm run build-storybook` | Static Storybook in `storybook-static/`              |

### Dependencies

Every dependency in `package.json` is pinned to an exact version. The
repository starts without a lockfile: the first `npm install` creates
`package-lock.json`. Commit that file so that every later install, in the
pipeline and in the image build, resolves the same transitive versions.

## Configuration

Vite reads variables from `.env` files and exposes those that start with
`VITE_` to the application. Copy `.env.example` to `.env.local` for local
overrides; `.env.local` is ignored by Git.

| Variable               | Default                      | Purpose                                                      |
| ---------------------- | ---------------------------- | ------------------------------------------------------------ |
| `VITE_API_BASE_URL`    | `/api` | Base URL of the backend API, compiled into the bundle        |
| `VITE_ENABLE_MOCK_API` | `false`                      | `true` answers API requests in the development server with the mock handlers |
| `VITE_VITALS_ENDPOINT` | empty                        | URL that receives Web Vitals measurements; empty logs them to the console |

The default API base URL is stored in `src/app.json` together with the name
and description shown in the application.

## Application

### Components

`src/components/` holds three building blocks, built on Material UI and styled by the theme in `src/theme.ts`:

| Component | Purpose                                                       |
| --------- | ------------------------------------------------------------- |
| `Button`  | Button with a `primary` and a `secondary` variant             |
| `Layout`  | Header with the application name and navigation, page content |
| `Section` | Titled block of a page                                        |

`Counter` and `ItemList` are the two example features built with them.

### State

`src/store/counterSlice.ts` defines the counter slice with Redux Toolkit,
`src/store/store.ts` creates the store and its types, and `useCounter()` in
`src/store/counter.ts` gives components the count and the `increment`,
`decrement` and `reset` actions. `AppProviders` creates the store and provides
it to the application.

### Routing

`src/main.tsx` creates a `BrowserRouter` and `src/App.tsx` declares the routes:

| Path     | Page                     |
| -------- | ------------------------ |
| `/`      | `src/pages/Home.tsx`     |
| `/about` | `src/pages/About.tsx`    |
| other    | `src/pages/NotFound.tsx` |

The host that serves the build must answer unknown paths with `index.html`
so that a page reload on `/about` still loads the application. The nginx configuration of the image does this.

### API client

`src/api/client.ts` calls the backend with `fetch` and exposes
`listItems()`, which requests `GET /api/items` and
expects a JSON array of `{ "id": string, "name": string }`. A response with a
status outside 2xx is thrown as `ApiError` with the status code.
`useItems()` in `src/api/useItems.ts` wraps the call in a query with the key
`["items"]`; `src/api/queryClient.ts` sets the cache defaults.

### Mock API

`src/mocks/handlers.ts` defines Mock Service Worker handlers for the API. The
tests use them through `tests/support/server.ts`, so no test needs a backend.
To use the same handlers in the browser, start the development server with
`VITE_ENABLE_MOCK_API=true`; the worker script is served by the `msw` Vite
plugin and is not part of the production build.

### Web Vitals

`src/monitoring/webVitals.ts` measures CLS, INP, LCP, FCP and TTFB with the
`web-vitals` library. Measurements are written to the browser console, or
posted as JSON with `navigator.sendBeacon` to the URL in
`VITE_VITALS_ENDPOINT` when that variable is set at build time.

### Linting

`biome.json` configures Biome, which lints and formats the TypeScript, CSS,
JSON, HTML and workflow files and keeps imports sorted. `docs/`, `README.md`,
`catalog-info.yaml` and `mkdocs.yml` are excluded: the portal wrote them with
the text entered in its form, and Biome would require its own table widths
and quoting style for that text.

## Testing

Tests live in `tests/` and run in jsdom with Vitest and React Testing Library.
`tests/support/render.tsx` renders a component inside `AppProviders`, and
`tests/support/api.ts` starts the Mock Service Worker server and lets a test
replace the response of `GET /items`. A request without a handler fails the
test, so no test reaches the network.

## Continuous integration

`.github/workflows/ci.yaml` runs on every push and pull request to `main`:

| Job                 | What it does                                                             |
| ------------------- | ------------------------------------------------------------------------ |
| Type check and test | `tsc --noEmit`, then Vitest with coverage                                |
| Build               | Production build, checks the output, serves it and requests the page     |
| Dependency scan     | Trivy report of known vulnerabilities in `package-lock.json`             |

The dependency scan reports and does not fail the build. It has nothing to
report until `package-lock.json` is committed. In a public repository its
results also appear in the repository's Security tab.

These workflows run on the same events:

| Workflow         | What it does                                                                   |
| ---------------- | ------------------------------------------------------------------------------ |
| `lint.yaml`      | Biome check: lint rules, formatting and import order                           |
| `storybook.yaml` | Builds the static Storybook and uploads it as an artifact                      |
| `docker.yaml`    | Hadolint, image build, container start with calls to `/healthz` and the page, Trivy image report |

On pushes to `main` the image is published to the GitHub Container Registry
with the workflow's own token; no secret has to be configured.

## Docker

The `Dockerfile` builds the bundle with Node.js 22 and copies it into an
unprivileged nginx image that runs as user `101` and listens on port `8080`.

```bash
docker build -t sample-react-app .
docker run --rm -p 8080:8080 sample-react-app
curl http://localhost:8080/healthz
```

`nginx/default.conf` answers `/healthz` for health checks, serves the hashed
files under `/assets/` with a one-year cache lifetime and answers every other
unknown path with `index.html`. Pass
`--build-arg VITE_API_BASE_URL=https://api.example.com` to compile a different
API base URL into the image.
