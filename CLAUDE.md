# System Design Companion

## Commands
- Dev: `npm run dev` (astro dev on port 4321)
- Build: `npm run build`
- Preview: `npm run preview`
- Type check: `npm run typecheck`
- Lint: `npm run lint`
- Pages dev (with Functions): `npm run pages:dev` (build first)

## Code Style
- TypeScript everywhere (strict mode)
- Tailwind CSS utility classes only — no custom CSS files
- Astro components for pages/layouts; React islands only for interactive elements
- Named exports, no default exports in .ts files
- Use `fetch` for CF Pages Function calls, not axios

## Architecture
- Astro + React + Tailwind, deployed to Cloudflare Pages
- CF Pages Functions in `functions/` for server-side API routes
- Progress data stored in `localStorage` (client-side only, no auth for now)
- `src/pages/` — Astro page routes
- `src/components/` — React interactive islands
- `src/layouts/` — Astro layout wrappers
- `src/lib/` — shared utilities and type definitions

## Workflow
- Never auto-commit; always show diff and ask first
- Run `npm run typecheck && npm run lint` before committing
- One Linear issue = one branch (branch name: `gau-<number>-short-description`)
