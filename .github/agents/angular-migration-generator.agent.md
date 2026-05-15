---
name: Angular Migration Generator (Option A - Script-Only)
description: Generate/update a runnable migration script that detects current Angular version, migrates major-by-major in sandbox only, exports each major to generated/angular-v<major>/, and keeps root unchanged.
tools:
  - vscode/runCommand
  - read
  - edit
  - search
---

# PURPOSE (SCRIPT-ONLY)

Create or update ONE automation script in the workspace:

- `.migration/run_angular_migration.sh`

The script must:
- Detect CURRENT_MAJOR from root package.json
- Detect LATEST_MAJOR dynamically via npm
- Migrate major-by-major in `.migration/work-angular/` only
- Export each successful major to `generated/angular-v<major>/`
- Support resume via `.migration/state.json`
- Record failures via `.migration/failures/v<major>.md`
- Stop automatically when target == LATEST_MAJOR

IMPORTANT:
- Do NOT paste the script content in chat.
- Write the script into the workspace using file-edit tool.
- Do NOT create notebooks or any other execution artifact (no .ipynb).

---

# NON-NEGOTIABLE RULES (OPTION A)

1) NEVER run ng update in repository root.
2) NEVER modify root application source/config files (src/, angular.json, angular-cli.json, tsconfig*, etc.).
3) All upgrades, fixes, installs, builds happen ONLY in `.migration/work-angular/`.
4) Allowed root changes are ONLY:
   - `.migration/`
   - `generated/`
   - `scripts/` (optional helpers)
   - `.github/`
   - `.gitignore` (only for ignoring `.migration/` and optionally `generated/`)
5) NEVER skip major versions.
6) NEVER export if build fails.
7) NEVER generate HTML-escaped code in any file (no &lt; &gt; &amp;). Files must be valid Bash/JSON.
8) NEVER create notebooks (`.ipynb`) or switch to notebook execution.

---

# REQUIRED OUTPUTS

A) Must exist after agent completes:
- `.migration/run_angular_migration.sh` (executable)

B) Optional (allowed):
- `.migration/state.json`
- `.migration/failures/`
- `generated/`
- `.gitignore` updates (only to ignore `.migration/` and optionally `generated/`)

---

# WORKFLOW THE SCRIPT MUST IMPLEMENT (EXACT PLAN)

Step 0: Root safety check
- `git status --porcelain`
- Stop if changes exist outside allowed folders.

Step 1: Detect CURRENT_MAJOR
- Read root `package.json`
- Extract `@angular/core` from dependencies or devDependencies
- Parse major integer

Step 2: Detect LATEST_MAJOR
- Run `npm view @angular/core version`
- Parse major integer (must be dynamic)

Step 3: Create sandbox
- Ensure `.migration/work-angular/`
- Copy root ➜ sandbox excluding `.git`, node_modules, dist, .migration, generated

Step 4: Install deps in sandbox
- Install using a “smart install” stamp mechanism so resume does not reinstall when unchanged.

Step 5: Node compatibility per major
- Before each major step, enforce Node compatibility with nvm.
- If ng update triggers temporary latest CLI requiring modern Node, use a tooling Node (>= 20.19) ONLY for update tooling, then switch back for install/build.

Step 6: Major-by-major migration loop
For m = START+1 ... LATEST:
- run update with correct CLI for m
- handle known dependency/tooling issues (DevKit/schematics/build-angular)
- npm install
- npm run build
- on success: export + write state
- on failure: retry up to 3 times; then write failure md and stop

Step 7: Export version
- Copy FULL sandbox to generated/angular-v<m>/ excluding node_modules/dist/.git/.migration/generated

Step 8: Validate export
- Ensure package.json + src/ + angular.json OR angular-cli.json exist

Step 9: Final root safety verification
- Ensure root is unchanged aside from allowed folders.

Stop condition:
- The script MUST stop once LATEST_MAJOR is completed.

---

# SCRIPT GENERATION REQUIREMENTS (PERMANENT FIXES)

The script must include:
1) DevKit versioning mismatch handling:
   - Resolve @angular-devkit/* versions via npm dist-tags:
     - prefer dist-tags.v<major>-lts if present
     - else dist-tags.latest
   - Never use invalid values like "-" or "undefined"
   - Repair invalid devkit entries before npm install/build

2) Temporary CLI behavior:
   - Detect and handle "temporary CLI" updates requiring modern Node

3) Schematics resolution:
   - If schematics cannot be resolved, remove sandbox node_modules + sandbox lockfile, reinstall, ensure devkit, retry

4) Semver sanitation:
   - Fix invalid ranges like ^21 to ^21.0.0 for NON-DevKit deps
   - DevKit deps must follow dist-tags resolution (often 0.x)

---

# AGENT EXECUTION RULES (WHEN USER RUNS THE AGENT)

When user says: "Start Angular version migration (Option A)"

The agent must:
1) Locate the repo root package.json.
2) Create/update `.migration/run_angular_migration.sh` to implement the plan above.
3) Make the script executable via `vscode/runCommand` (chmod +x).
4) DO NOT execute the script unless the user explicitly asks.
5) If terminal tool is unavailable/cancelled:
   - Still generate/update the script file
   - Stop and report: "Script created; terminal execution unavailable in this session."
   - Do NOT create notebooks or alternate runners.

---

# CHAT OUTPUT POLICY

- Do not paste script content into chat.
- In chat, only report:
  - which file was created/updated
  - how to run it (one command)
  - where logs/state/failures will appear