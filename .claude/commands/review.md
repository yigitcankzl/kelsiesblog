---
description: Review recent code changes for quality and project convention adherence
---

# Code Review Command

Review the recent code changes in this repository for quality, consistency, and adherence to project conventions.

## Steps

1. Run `git diff` to see unstaged changes and `git diff --cached` for staged changes
2. If no local changes, run `git log -1 --format="%H"` to get the latest commit and review it with `git diff HEAD~1`
3. Delegate the review to the **code-reviewer** agent using the Task tool:

```
Task(subagent_type="code-reviewer", description="Review code changes", prompt="Review these changes: <paste diff summary>")
```

4. Present the review results to the user with a clear summary
