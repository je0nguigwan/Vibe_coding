# FoodTinder MVP

Mobile-first group dining decision MVP built with Next.js App Router, TypeScript, Tailwind, and shadcn/ui.

## Setup

```bash
npm install
npm run dev
```

Then open http://localhost:3000

## Demo flow
- Landing → Create Session or Join Session
- Preferences → Swipe → Results → Restaurant Detail
- Admin shows local session state
- Docs renders PRD/Problem/Solution/Design

## Data
- Swipe data lives in `public/data/DragonMasterData.json` (client fetches it at runtime).
- Seed data lives in `src/data/restaurants.json`.
- Optional: place Excel/CSV in `public/data/` and run `scripts/excel-to-json.ts`.

Example:
```bash
node scripts/excel-to-json.js public/data/restaurants.xlsx
```

## Local storage
Session state, preferences, swipes, and chat are stored in localStorage under the `foodtinder.session.*` key.
