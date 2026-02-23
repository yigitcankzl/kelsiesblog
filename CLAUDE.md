# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## Repository Overview

Kelsie's Blog — a React/TypeScript travel blog with interactive maps, rich text editing, and media management. Deployed on Vercel with Firebase backend and Cloudflare R2 storage.

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 7, Tailwind CSS 4 (Shadcn UI)
- **State:** Zustand store (`src/store/store.ts`)
- **Maps:** React Leaflet + GeoJSON boundaries
- **Editor:** TipTap rich text
- **3D:** Three.js globe intro
- **Backend:** Firebase Firestore + Auth, Cloudflare R2 (via Vercel serverless functions in `/api`)

## Project Structure

```
src/
├── pages/          # Route pages (MapPage, AdminPage, AllStoriesPage, GalleryPage, AboutPage)
├── components/
│   ├── admin/      # CMS components (PostForm, GalleryManager, RichTextEditor, R2MediaBrowser)
│   ├── content/    # Display components (PostReader, WelcomeView, CountryPostsView)
│   ├── map/        # Map components (GlobeIntro, CountryView)
│   └── shared/     # Reusable UI (BackButton, CategoryFilter, PageHeader)
├── lib/            # Utilities (firebase.ts, firestore.ts, r2Api.ts, globeRenderer.ts)
├── store/          # Zustand store
├── data/           # GeoJSON, country bounds, city data
├── hooks/          # Custom React hooks
└── types.ts        # Shared TypeScript interfaces
api/                # Vercel serverless functions (upload-r2, r2-list, r2-delete)
scripts/            # Code generation scripts (generate-cities.mjs)
```

## Common Commands

```bash
npm run dev          # Start Vite dev server
npm run build        # TypeScript check + production build
npm run lint         # ESLint
npm run preview      # Preview production build
npm run dev:vercel   # Test with Vercel local environment
```

## Key Patterns

- **Styling:** Tailwind CSS utility classes only — no inline styles
- **Components:** Functional components with TypeScript props interfaces
- **State:** All shared state in Zustand store; local state via useState/usePostDraft
- **API calls:** Firebase via `src/lib/firestore.ts`, R2 via `src/lib/r2Api.ts`
- **Path alias:** `@/` maps to `src/` (configured in tsconfig + vite)
- **Types:** All shared types in `src/types.ts` — BlogPost, GalleryItem, AboutContent, Section
- **Data flow:** Zustand store → components; Firestore → store (via async actions)

## Critical Rules

- Never commit `.env` or files containing API keys/secrets
- Always run `npm run build` to verify TypeScript before committing
- Use Tailwind classes, never inline `style={}` attributes
- Keep components in their appropriate subdirectory (admin/, content/, map/, shared/)
- Serverless functions in `/api` use Vercel Edge Runtime conventions
- R2 uploads go through `/api/upload-r2.js` — never direct client uploads

## Workflow Best Practices

- Start with plan mode for complex, multi-file tasks
- Use `/compact` at ~50% context usage
- Break subtasks small enough to complete in under 50% context
- Use todo list workflow for multi-step tasks
- Provide screenshots when reporting visual issues
