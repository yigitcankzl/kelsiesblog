---
name: blog-post-helper
description: Use when the user needs help creating, editing, or debugging blog post content and components
user-invocable: true
allowed-tools: Read, Edit, Write, Glob, Grep, Bash
---

# Blog Post Helper

Assists with blog post management, content formatting, and CMS component development.

## Blog Post Structure

A `BlogPost` consists of:
- **Metadata:** title, country, city, coordinates, date, category[], coverImage, contentFont
- **Sections[]:** Each section has a heading, content (string or string[]), and optional images
- **GeoJSON:** Optional cityBoundary for map highlighting

## Key Files

- `src/components/admin/PostForm.tsx` — Post creation/editing form
- `src/components/content/PostReader.tsx` — Post display/reading view
- `src/lib/firestore.ts` — CRUD operations (addPost, updatePost, deletePost)
- `src/store/store.ts` — Post state management (fetchPosts, posts array)
- `src/types.ts` — BlogPost, Section interfaces

## Rich Text Editor

The blog uses TipTap editor configured in `src/lib/richText.tsx`. Extensions include:
- Text formatting (bold, italic, underline, strike)
- Headings, lists, blockquotes
- Image embedding
- Code blocks

## Common Tasks

### Add a new post field
1. Update `BlogPost` interface in `src/types.ts`
2. Add field to `PostForm.tsx` form
3. Include in Firestore save operation in `firestore.ts`
4. Display in `PostReader.tsx`

### Add a new category
Categories are string arrays on BlogPost. Add the category option in `PostForm.tsx` and filter UI in `CategoryFilter.tsx`.

### Debug map markers
Check `MapPage.tsx` for marker rendering, `src/data/countryBounds.ts` for coordinates, and `src/lib/cityBoundaryCache.ts` for GeoJSON caching.
