# Angular Migration Generator (Option A) - Mandatory Rules

## Root safety
- NEVER run `ng update` in the repository root.
- Root Angular source files must not change.
- All upgrades must happen only in `.migration/work-angular`.

## Upgrade strategy
- Upgrade one major version at a time using Angular CLI `ng update`. 
- Use `ng update @angular/cli@^<major> @angular/core@^<major>` for each step. 
- Consult Angular Update Guide when major-specific breaking changes require manual edits. 

## Generated outputs
- After each successful major upgrade, export source-only output to:
  `generated/angular-v<major>/`
- Never include: `.git`, `node_modules`, `dist`, `.angular`, `.cache`, `.migration`, `generated`

## Behavior
- Stop on errors, summarize root cause, fix ONLY inside sandbox, then resume.