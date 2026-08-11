# AGENTS.md

## Project

High-end e-commerce web application for fine jewelry. Combines editorial storytelling with high-performance commerce.

- **Stack:** React / Next.js, Tailwind CSS
- **Language:** TypeScript (expected)

## Quick Start

```bash
npm run dev        # Start dev server
npm run build      # Production build
npm run lint       # Lint check
npm run typecheck  # Type check
```

## Conventions

- Prefer Next.js App Router patterns (use `app/` directory, not `pages/`)
- Tailwind CSS only for styling — no CSS modules or styled-components
- Luxury/immersive design requires careful attention to animations and transitions
- Keep component files small and composable
- Use `@/` path aliases for imports (configured in `tsconfig.json`)

## Gotchas

- This is a new repo — structure and config will evolve rapidly
- No existing tests yet — establish test patterns early if adding them
- Tailwind config may need custom theme tokens for jewelry brand palette
