# Angular 4 → Angular 5 Upgrade Plan

This plan follows the instructions in `.github/agents/angular4to5_Upgrade_agent.agent.md` and is limited to planning only.

## Current state
- The repository is currently an Angular 4.4.7 project.
- Current packages in `package.json` include Angular 4.4.7, CLI 1.4.9, TypeScript 2.3.4, RxJS 5.4.3, and zone.js 0.8.18.
- The upgrade must preserve UI, layout, and behavior exactly.

## Upgrade objectives
- Upgrade Angular core packages to Angular 5.2.x.
- Keep dependency compatibility across Angular, RxJS, TypeScript, and CLI.
- Apply the smallest possible changes required for the upgrade.
- Validate build and runtime with `ng build` and `ng serve`.

## Step 1: Update dependency versions
- Update Angular packages to `^5.2.11`:
  - `@angular/common`
  - `@angular/compiler`
  - `@angular/core`
  - `@angular/forms`
  - `@angular/http`
  - `@angular/platform-browser`
  - `@angular/platform-browser-dynamic`
  - `@angular/router`
  - `@angular/compiler-cli`
- Update `@angular/cli` to `~1.5.0`.
- Update `rxjs` to `^5.5.2`.
- Update `typescript` to `~2.4.2`.
- Update `zone.js` to `^0.8.14`.

## Step 2: Validate configuration
- Confirm `tsconfig.json` and `src/tsconfig.app.json` are compatible with TypeScript 2.4.
- Confirm `.angular-cli.json` is compatible with Angular CLI 1.5.
- Confirm `polyfills.ts` includes required Angular 5 polyfills.

## Step 3: Build and runtime validation
- Run `npm install` after updating `package.json`.
- Run `npx ng build` and fix any Angular 5-specific build issues.
- Run `ng serve` and confirm the app starts successfully.
- Run tests if available to ensure no regressions.

## Step 4: Fix only upgrade-specific issues
- Fix only issues that arise from Angular 4 → Angular 5 compatibility.
- Preserve all existing component templates, styles, bindings, and behavior.
- Do not refactor unrelated code.
- Only migrate from `HttpModule` to `HttpClientModule` if strictly required.

## Notes
- This file documents the upgrade plan only.
- No application code or UI files are changed as part of this plan document update.
