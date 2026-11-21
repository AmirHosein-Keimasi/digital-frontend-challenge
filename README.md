# Site Inspection Report Wizard: Frontend Challenge

A take-home exercise for frontend engineers: finish a partially built Next.js app.

## The scenario

Site inspectors visit warehouses and retail sites and file inspection reports from a tablet on
site. A report has three steps:

1. General info: site name, inspector email, inspection type.
2. Inspection findings: a dynamic list of findings, plus an escalation contact for emergency
   inspections.
3. Review and submit: a read-only summary sent to a mocked server action.

Step 1 works end to end. Steps 2 and 3 are stubs. Finish them without rewriting the foundation.

The UI is Persian-first and right-to-left (`dir="rtl"`), the copy is in Persian, and Vazirmatn is
bundled locally. Keep it that way.

## Stack

| Concern    | Choice                                                                |
| ---------- | --------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router) + React 19                                    |
| Language   | TypeScript with `strict: true`                                        |
| Styling    | Tailwind CSS 4                                                        |
| Validation | Zod 4 (`src/lib/schemas.ts`)                                          |
| Icons      | `lucide-react`                                                        |
| Font       | Vazirmatn (bundled in `src/app/fonts/`, loaded via `next/font/local`) |
| Tooling    | pnpm, ESLint, Prettier                                                |

No form library is installed. Use plain React state, or add one (`react-hook-form` or similar) if
you can justify the trade-off.

## Getting started

Node.js 20.9+ and pnpm are required. The package manager version is pinned in `package.json`.

```bash
pnpm install
pnpm dev          # http://localhost:3000
```

Scripts:

| Command             | What it does                       |
| ------------------- | ---------------------------------- |
| `pnpm dev`          | Start the dev server               |
| `pnpm build`        | Production build (Turbopack)       |
| `pnpm start`        | Serve the production build         |
| `pnpm typecheck`    | `tsc --noEmit`                     |
| `pnpm lint`         | ESLint                             |
| `pnpm format`       | Prettier write                     |
| `pnpm format:check` | Check formatting before submitting |

`pnpm build` and `pnpm typecheck` pass on the starter. Keep both green.

## What already works

- UI primitives: `Button` (variants and `isLoading`), `Input`, `Select`, `Textarea`, `Badge`,
  `Card`. Labels, `aria-invalid`, `aria-describedby` and `role="alert"` are wired up, and the
  primitives use logical properties (`ms-*`, `pe-*`, `end-*`) so they behave correctly in RTL.
  Reuse them instead of writing new CSS.
- Step 1: fully working, validated on submit, writes to the wizard context and advances.
- Wizard shell: header, clickable three-step progress indicator, active-step renderer.
- Schemas: `step1Schema`, `findingItemSchema`, `step2Schema`, `fullReportSchema` and their
  inferred types, with Persian validation messages.
- Server action: `submitReport()` in `src/app/actions.ts`, with a one-second delay, server-side
  validation and a simulated upstream failure.
- Success page: `/success?id=...`.

## What you need to build

Gaps are marked with `// TODO (Task N)`. Search the codebase for `TODO`.

| File                                      | Task       |
| ----------------------------------------- | ---------- |
| `src/components/wizard/Step2Items.tsx`    | Task 1     |
| `src/components/wizard/WizardContext.tsx` | Tasks 2, 3 |
| `src/components/wizard/WizardShell.tsx`   | Tasks 2, 3 |
| `src/components/wizard/Step3Review.tsx`   | Task 4     |

## Domain notes

- `fullReportSchema` combines the step 1 and step 2 fields and adds one cross-field rule: if
  `inspectionType === "emergency"`, `escalationContact` is required (at least 3 characters,
  reported on `escalationContact`).
- The rule lives in `fullReportSchema` rather than `step2Schema` because step 2 does not know the
  inspection type. Compose the two however you prefer: check the emergency field yourself, or
  validate the merged draft with `fullReportSchema`.
- `formData` in the wizard context is a `Partial<FullReportData>`, so `items` can be `undefined`.
- The server action re-validates everything and simulates an upstream failure when the site name
  contains `error`. See "Testing failure paths".
- Keep field keys, schema names and `inspectionType` values in English. Only user-facing copy is
  Persian.

## Tasks

### Task 1: Dynamic step 2

- Show a required escalation contact field only for emergency inspections. Minimum 3 characters,
  with the error shown inline.
- Render a repeatable list of findings. Each row has a title (min 3 chars), a severity
  (`low` / `medium` / `high`) and optional notes.
- Support adding and removing rows. You can remove the last row, but you cannot submit with zero
  findings.
- Give every finding a stable unique id, for example `crypto.randomUUID()`.
- On Next, validate with `step2Schema` plus the emergency rule. Show inline field errors (no
  `alert()`), save the rows to the wizard context and go to step 3.
- Values must survive going Back to step 1 and returning.

### Task 2: Draft persistence

- Auto-save the draft to `localStorage` as the user edits.
- On reload, restore the draft and the visible form values without hydration warnings or errors.
- Add a Clear draft button that resets in-memory state and removes the stored draft.
- Handle corrupted or unrelated `localStorage` data without crashing.
- If storage is unavailable (private mode, quota, disabled cookies), the wizard must still work in
  memory.

### Task 3: Navigation guards

- Clicking a step header may move backwards freely.
- Block forward navigation when the preceding step is invalid, including direct jumps from step 1
  to step 3.
- Blocked steps should look disabled and be exposed correctly to assistive technology
  (`aria-disabled`, no unexpected focus traps).

### Task 4: Review and submit

- Show a read-only summary of all step 1 and step 2 data, including the escalation contact when it
  applies.
- Wire Submit report to `submitReport()` in `src/app/actions.ts`.
- Show a pending state and disable Submit while the request is in flight.
- If the action returns `success: false`, show its message in an error banner and keep the data on
  screen. Surface server `fieldErrors` where it makes sense.
- On success, clear the stored draft and redirect to `/success?id=<reportId>`.

## Testing failure paths

- Validation: submit empty or invalid values on each step.
- Upstream failure: use a site name containing `error` (for example `Error Ridge Depot`) and
  submit. The action waits about a second, then fails. The banner must appear and the data must
  survive.
- Hydration: fill the form, reload, and watch the console. There should be no React hydration
  warnings.
- Corrupted storage: set the draft key to `not-json` in DevTools and reload.

## Submission

- Fill in `NOTES.md` with:
  - trade-offs you made,
  - where state lives, how validation is composed, how persistence is guarded,
  - what you would do with more time.
- Send the repo as a zip, branch or pull request, however your contact asked for it.
- Do not commit `node_modules`, `.next` or `.env` files.

## How we evaluate

We care about working flows and clear thinking more than pixel-perfect design:

1. Working flows: can an inspector finish a report, including the emergency path?
2. State modelling: is the draft a single source of truth, or is state duplicated and drifting?
3. Correctness under failure: hydration, double submits, corrupted storage, server errors.
4. Accessibility: labels, error association, keyboard and focus behaviour.
5. TypeScript and code quality: readable, idiomatic, minimal `any`, sensible component boundaries.
6. Judgement: clear trade-offs and honest notes over unnecessary polish.
