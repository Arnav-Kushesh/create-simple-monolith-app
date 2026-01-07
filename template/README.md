## Project Structure

This is a **monorepo** managed by [Turbopack](https://turbo.build/).

- **`packages/apis`**: Express.js server for business logic and API endpoints. No rendering here.
- **`packages/frontend`**: React + Vite application. Builds to static `dist/`.
- **`packages/frontend-ssr`**: Express app that detects bots.
    - If **User**: Serves static files from `frontend/dist`.
    - If **Bot**: Launches Puppeteer, scrapes the locally running frontend, and returns full HTML.