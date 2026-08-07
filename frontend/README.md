# NudgeHealth — Frontend

React + TypeScript + Vite + Tailwind. Built against the Design System &
Accessibility spec (SDG 3 · Good Health & Well-being).

## Running locally

```bash
cd frontend
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

Other scripts:

- `npm run build` — type-check and produce a production build in `dist/`
- `npm run preview` — serve the production build locally

## Screens

| Screen | File | Notes |
| --- | --- | --- |
| Login | `src/pages/LoginPage.tsx` | |
| Sign up | `src/pages/SignupPage.tsx` | |
| Home | `src/pages/HomePage.tsx` | Risk summary + this month's focus |
| Risk detail | `src/pages/RiskDetailPage.tsx` | Sub-page of Home |
| Plan | `src/pages/PlanPage.tsx` | Ranked recommendations |
| Nearby clinic | `src/pages/ClinicPage.tsx` | Sub-page of Plan |
| Diary | `src/pages/DiaryPage.tsx` | Mood check-in + history |
| Profile | `src/pages/ProfilePage.tsx` | Account + settings |

Navigation is currently a `useState` switch in `src/App.tsx`. Swap it for
`react-router` when routes need to be linkable.

## Backend integration points

Everything below is currently stubbed. These are the only places that need
to change when the API is ready — no component code should need touching.

### 1. `src/lib/mockData.ts`

Placeholder data for every screen. Replace each export with a real fetch:

| Export | Feeds | Suggested source |
| --- | --- | --- |
| `MOCK_RISK` | Home hero, Risk detail, Profile badge | scoring app |
| `MOCK_FACTORS` | Risk detail "What's contributing" | scoring app |
| `MOCK_TASKS` | Home "This month's focus" | recommendations app |
| `MOCK_PLAN` | Plan page (adds `priority` + `why`) | recommendations app |
| `MOCK_CLINICS` | Nearby clinic list | static config or recommendations app |
| `MOCK_DIARY` | Diary history | diary app |
| `MOCK_USER` | Profile email | accounts app |

Shapes are defined in `src/types/app.ts`. `RiskSummary.band` uses
`"low" | "moderate" | "high"` to match the backend's `RISK_BAND_CHOICES`.

### 2. `src/hooks/useAuth.ts` and `src/hooks/useSignup.ts`

Both resolve to `{ success: true }` without calling anything. Replace the
body of `login` / `signup` with the real request; the loading and error
states are already wired into the forms.

### 3. Diary submission

`DiaryPage` currently appends new entries to local state only. The
`handleSave` function is where the POST should go.

## Notes for whoever picks this up

- **Design tokens live in `tailwind.config.ts`.** Colors, the type scale
  (`text-display`, `text-h2`, `text-h3`, `text-body`, `text-body-sm`,
  `text-caption`) and `min-h-tap` (48px) all come from the spec. Use those
  tokens rather than raw values so the accessibility rules hold.
- **Body text never goes below 16px**, and every interactive element is at
  least 48×48px. Both are spec requirements for the 40–60 y/o target cohort.
- **Risk bands and status pills always pair color with an icon or symbol
  and a text label**, so meaning survives colorblindness, grayscale
  printouts and screen readers. Don't reduce them to color alone.
- **Copy lives in `src/lib/i18n/en.json` and `bm.json`.** Both files must
  stay in sync; add new keys to both. No user-facing strings in components.
