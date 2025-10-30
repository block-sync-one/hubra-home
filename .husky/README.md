# Git Hooks Setup

This project uses [Husky](https://typicode.github.io/husky/) and [lint-staged](https://github.com/lint-staged/lint-staged) to ensure code quality before commits.

## Pre-commit Hook

The pre-commit hook automatically runs on staged files:

1. **Prettier** - Formats code
2. **ESLint** - Lints and fixes code issues

## What Happens on Commit?

When you run `git commit`:

1. Husky triggers the pre-commit hook
2. lint-staged runs only on **staged files** (fast!)
3. For each staged file:
   - `prettier --write` formats the file
   - `eslint --fix --max-warnings=0` fixes linting issues
4. Changes are automatically added back to staging
5. If any unfixable issues remain, the commit is blocked

## Manual Commands

You can run these commands manually anytime:

```bash
# Format all files
npm run format

# Check formatting without changing files
npm run format:check

# Lint and fix all files
npm run lint

# Check linting without fixing
npm run lint:check
```

## Configuration Files

- `.prettierrc.json` - Prettier formatting rules
- `.prettierignore` - Files to exclude from formatting
- `.eslintignore` - Files to exclude from linting
- `package.json` - lint-staged configuration
- `.husky/pre-commit` - Pre-commit hook script

## Bypassing Hooks (Not Recommended)

If absolutely necessary, you can bypass hooks with:

```bash
git commit --no-verify
```

⚠️ **Warning**: Only use this in emergencies. All code should pass linting and formatting checks.
