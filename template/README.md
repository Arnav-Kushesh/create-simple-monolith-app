# Simple Monolith 🐝

**Simple Monolith** is a lightweight alternative to Next.js that performs server-side rendering (SSR) *only for bots* and serves a static site to real users.

This architecture ensures:
1.  **Blazing Fast Performance**: Real users get a static SPA served directly from CDNs/disk.
2.  **Perfect SEO**: Bots (Google, Bing, Twitter, etc.) get fully rendered HTML via Puppeteer.
3.  **Clean Separation**: Dedicated packages for API, Frontend, and SSR.

## Project Structure

This is a **monorepo** managed by [Turbopack](https://turbo.build/).

- **`packages/apis`**: Express.js server for business logic and API endpoints. No rendering here.
- **`packages/frontend`**: React + Vite application. Builds to static `dist/`.
- **`packages/frontend-ssr`**: Express app that detects bots.
    - If **User**: Serves static files from `frontend/dist`.
    - If **Bot**: Launches Puppeteer, scrapes the locally running frontend, and returns full HTML.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm (v10+)

### Installation

1.  Clone the repository (or scaffolding command).
2.  Install dependencies:

```bash
npm install
```

### Running Locally

To start all services (API, Frontend Dev Server, SSR Server):

```bash
npm run dev
```

This will start:
- **API**: http://localhost:3001
- **Frontend (Vite Dev)**: http://localhost:3000
- **SSR Server (Entry Point)**: http://localhost:8080

### Running Services Individually

You can also run specific parts of the stack:

- **`npm run apis`**: Runs only the API service.
- **`npm run frontend`**: Runs only the frontend (standard React dev server).
- **`npm run ssr`**: Runs the frontend and the SSR server together.

**👉 You should access the app via http://localhost:8080**

### Testing SSR & Bot Detection

The `ssr` package includes a special route for development.

1.  **Visit as User**: Go to http://localhost:8080. You will see the React app load and fetch data on the client side.
2.  **Test Bot View**: Go to http://localhost:8080/test-ssr. This will simulate a bot visit and show you the server-side rendered HTML (captured via Puppeteer).
    - Example: `http://localhost:8080/test-ssr?path=/`
3.  **Simulate Bot via curl**:
    ```bash
    curl -A "Googlebot" http://localhost:8080/
    ```

## Deployment

When deploying `simple-monolith`, you typically need to host two separate services:

1.  **APIs**: Run the `npm run apis` script (or deploy the `packages/apis` folder).
2.  **Frontend + SSR**: Run the `npm run ssr` script. This handles both the bot detection/SSR server and serves the static frontend assets to users.

**Note**: The `frontend` script is primarily for development or if you only want to serve the static site without SSR/bot detection (e.g., on Netlify/Vercel static hosting), but you would lose the SEO benefits of this framework.

## Building for Production

```bash
npm run build
```

This triggers `turbo run build`, which builds the React app into `packages/frontend/dist`.

## Onboarding

To scaffold a new project based on this template, you can run:

```bash
npx create-simple-monolith-app <project-name>
```
*(Note: Since this is a specialized repo, simply cloning this structure works effectively as a starting point).*
