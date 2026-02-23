---
name: project-conventions
description: Project coding conventions and patterns for Kelsie's Blog
user-invocable: false
---

# Project Conventions — Kelsie's Blog

## Component Pattern

```tsx
import { useState } from "react";
import { useBlogStore } from "@/store/store";
import { BlogPost } from "@/types";

interface MyComponentProps {
  post: BlogPost;
  onSelect?: (id: string) => void;
}

export default function MyComponent({ post, onSelect }: MyComponentProps) {
  const [loading, setLoading] = useState(false);
  // ...
}
```

## Key Rules

- **Imports:** Use `@/` path alias, never deep relative paths (`../../`)
- **Styling:** Tailwind utility classes only, no `style={}` props
- **Types:** Import shared types from `@/types`, define component-specific interfaces locally
- **State:** Zustand for shared state (`useBlogStore`), `useState` for local
- **Naming:** PascalCase for components, camelCase for utilities, kebab-case for files in `/api`
- **Exports:** Default export for page/component files

## Data Types (from `src/types.ts`)

- `BlogPost` — Blog post with sections, coordinates, city boundaries
- `Section` — Post section (heading + content/images)
- `GalleryItem` — Gallery image with caption and location
- `AboutContent` — About page content
- `CountryData` — Country metadata with bounds

## File Placement

| Type | Directory |
|------|-----------|
| Pages | `src/pages/` |
| Admin components | `src/components/admin/` |
| Content display | `src/components/content/` |
| Map components | `src/components/map/` |
| Shared/reusable UI | `src/components/shared/` |
| Firebase/R2/utils | `src/lib/` |
| React hooks | `src/hooks/` |
| Serverless APIs | `api/` |

## Firebase Operations

All Firestore operations go through `src/lib/firestore.ts`. Never import Firebase SDK directly in components.

## R2 Media Operations

All R2 operations go through `src/lib/r2Api.ts` which calls the Vercel serverless functions in `/api`.
