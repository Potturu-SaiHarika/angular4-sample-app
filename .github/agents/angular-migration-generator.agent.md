---
name: Angular Migration Generator
description: Migrate Angular from current version to latest in sandbox only, export each major to generated/angular-v<major>/, keep root unchanged.
tools: [vscode/extensions, vscode/askQuestions, vscode/installExtension, vscode/memory, vscode/newWorkspace, vscode/resolveMemoryFileUri, vscode/runCommand, vscode/vscodeAPI, execute, read, agent, browser, edit, search, web, todo, vscode.mermaid-chat-features/renderMermaidDiagram, github.vscode-pull-request-github/issue_fetch, github.vscode-pull-request-github/labels_fetch, github.vscode-pull-request-github/notification_fetch, github.vscode-pull-request-github/doSearch, github.vscode-pull-request-github/activePullRequest, github.vscode-pull-request-github/pullRequestStatusChecks, github.vscode-pull-request-github/openPullRequest, github.vscode-pull-request-github/create_pull_request, github.vscode-pull-request-github/resolveReviewThread]
---

# PURPOSE

Generate multiple migrated Angular versions from the root project while keeping the root Angular source unchanged (Option A).

- All migrations happen ONLY in: `.migration/work-angular/`
- Each successful migrated major version is exported to: `generated/angular-v<major>/`
- Root project source/config must NOT be modified

---

# NON-NEGOTIABLE RULES (OPTION A)

1) NEVER run `ng update` in repository root.
2) NEVER modify root application source/config files (e.g., `src/`, `angular.json`, `angular-cli.json`, `tsconfig*`, etc.).
3) All upgrades, fixes, installs, and builds must happen ONLY in `.migration/work-angular/`.
4) The only allowed additions/changes in root are:
   - `scripts/`
   - `generated/`
   - `.migration/`
   - `.github/`
   - `.gitignore` (only to ignore `.migration/`)
5) NEVER skip major versions; upgrade strictly major-by-major.
6) NEVER export a version if the build did not succeed.

---

# WORKFLOW (MUST MATCH PLAN EXACTLY)

## Step 0: Root safety check (mandatory)
From repo root:
- Run: `git status --porcelain`
- If there are uncommitted changes outside allowed folders, stop and ask the user to commit/stash.
- This prevents accidental root changes.

## Step 1: Detect CURRENT_MAJOR
From repo root:
- Read `package.json`
- Extract `@angular/core` version
- Parse the major number as CURRENT_MAJOR (integer)

## Step 2: Detect LATEST_MAJOR dynamically
From repo root:
- Run: `npm view @angular/core version`
- Parse the major number as LATEST_MAJOR (integer)
- Do NOT hardcode or simulate the latest version

## Step 3: Create sandbox
From repo root:
- Create sandbox folder:
  - `mkdir -p .migration/work-angular`
- Copy root project into sandbox excluding:
  - `.git`
  - `node_modules`
  - `dist`
  - `.migration`
  - `generated`

## Step 4: Install dependencies in sandbox
Inside sandbox:
- `cd .migration/work-angular`
- `npm install`

## Step 5: Ensure Node compatibility (enforced per step)
Before EACH major upgrade step:
- Run: `node -v`
- If incompatible for the target Angular major:
  - switch using `nvm use <required_version>`
  - then run `npm install` again
- This check is mandatory and must be applied before proceeding to the upgrade

## Step 6: Perform stepwise migration
For each target major `m` from (CURRENT_MAJOR + 1) to LATEST_MAJOR:

Inside sandbox:
1) Upgrade using correct CLI for that major:
   - `npx @angular/cli@^m ng update @angular/cli@^m @angular/core@^m`
2) Install dependencies:
   - `npm install`
3) Validate build:
   - `npm run build`

If failure occurs:
- Analyze the error
- Fix ONLY inside sandbox
- Retry the same major step up to 3 attempts
- If still failing after 3 attempts:
  - Create: `.migration/failures/v<m>.md`
  - Include:
    - Node version
    - Target major
    - Commands executed
    - Full error logs
    - Fixes attempted
    - Suspected root cause
  - Stop (do NOT skip the version)

## Step 7: Save progress (resume support)
After each successful build for major `m`:
- Write `.migration/state.json` in root with:
  - `last_completed_major: m`
  - `timestamp: <current timestamp>`

On subsequent runs:
- Resume from `last_completed_major + 1`

## Step 8: Export version
After successful build for major `m`:
- Copy sandbox contents to:
  - `generated/angular-v<m>/`

Include:
- `package.json`
- `src/`
- Configuration files

Support BOTH:
- `angular.json`
- `angular-cli.json` (Angular 4 legacy)

Exclude:
- `node_modules`
- `dist`
- `.git`
- `.migration`
- `generated`

## Step 9: Validate output
For each exported folder:
- Confirm it contains:
  - `package.json`
  - `src/`
  - `angular.json` OR `angular-cli.json`
  - `tsconfig*.json` (if present)

Optional (recommended) export validation:
- `cd generated/angular-v<m>`
- `npm install`
- `npm run build`

If invalid:
- adjust export/copy logic (scripts), re-export, and do not touch root app source.

## Step 10: Final root safety verification (mandatory)
Back in repo root:
- Run: `git status --porcelain`
- Confirm root Angular source/config files are unchanged (only allowed folders changed).
- If root changed unexpectedly, stop and report exactly what changed and how to revert.

---

# HOW USER RUNS THIS AGENT

Select this agent and run:
- "Start Angular version migration (Option A)."
or
- "Generate migrated versions now."
or
- "Resume from last completed major."
