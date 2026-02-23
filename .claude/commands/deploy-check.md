---
description: Verify the project builds successfully and is ready for deployment
---

# Deploy Check Command

Verify the project is ready for deployment to Vercel.

## Steps

1. **TypeScript Check:** Run `npx tsc --noEmit` to verify there are no type errors
2. **Lint Check:** Run `npm run lint` to verify ESLint passes
3. **Build Check:** Run `npm run build` to verify production build succeeds
4. **Git Status:** Run `git status` to check for uncommitted changes

## Report Format

Provide a deployment readiness report:

- **TypeScript:** Pass/Fail (list errors if any)
- **Lint:** Pass/Fail (list warnings/errors if any)
- **Build:** Pass/Fail (note build size if successful)
- **Git:** Clean/Dirty (list uncommitted files if any)
- **Verdict:** Ready to deploy / Not ready (with blockers)
